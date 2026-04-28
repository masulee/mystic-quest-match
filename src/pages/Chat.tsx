import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StarField } from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { traitEmoji } from "@/lib/mockPartners";
import { cn } from "@/lib/utils";

type Category = "감정" | "자연" | "행동" | "시간";

const CATEGORY_ICONS: Record<Category, string> = {
  감정: "💖",
  자연: "🌿",
  행동: "⚡",
  시간: "⏳",
};

const WORD_BANK: Record<Category, string[]> = {
  감정: ["그리움", "설렘", "따스함", "평온", "신비", "경이"],
  자연: ["달빛", "별빛", "바람", "꽃잎", "물결", "숲"],
  행동: ["흐르다", "춤추다", "속삭이다", "비추다", "감싸다", "떠오르다"],
  시간: ["밤하늘에", "새벽녘에", "황혼 속에", "순간마다", "영원히", "지금"],
};

const SENTENCE_TEMPLATES = [
  "{시간} {감정}이 {행동}, {자연} 사이로",
  "{자연}처럼 {감정}이 {행동}, {시간}",
  "{시간} {자연}이 {행동}, {감정}을 담아",
  "{감정}의 {자연}이 {시간} {행동}",
];

const generateSentence = (selected: Record<Category, string>) => {
  const tmpl = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
  return tmpl
    .replace("{감정}", selected["감정"])
    .replace("{자연}", selected["자연"])
    .replace("{행동}", selected["행동"])
    .replace("{시간}", selected["시간"]);
};

type Message =
  | { role: "system"; text: string; id: string }
  | { role: "me"; text: string; id: string; trait?: string; pct?: number }
  | { role: "partner"; text: string; id: string; trait?: string; pct?: number };

const Chat = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const partnerId = params.get("partner");
  const { matchedPartners, updatePartnerTemperature, updatePartnerLastMessage } = useGame();

  const partner = useMemo(
    () => matchedPartners.find((p) => p.id === partnerId),
    [matchedPartners, partnerId]
  );

  const [activeCategory, setActiveCategory] = useState<Category>("감정");
  const [selected, setSelected] = useState<Partial<Record<Category, string>>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!partner) return;
    setMessages([
      {
        role: "system",
        id: "sys-1",
        text: `${partner.name}님과의 인연이 시작되었습니다. 단어를 조합해 마음을 전해보세요.`,
      },
      {
        role: "partner",
        id: "p-1",
        text: "달빛 아래, 당신의 빛을 기다리고 있었어요.",
        trait: partner.trait,
        pct: partner.percentage,
      },
    ]);
  }, [partner]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (!partner) {
    return (
      <div className="min-h-screen bg-gradient-night relative flex items-center justify-center px-6 text-center">
        <StarField />
        <div className="relative z-10 space-y-4">
          <p className="font-display text-xl text-foreground">파트너를 찾을 수 없습니다</p>
          <Button variant="ethereal" onClick={() => navigate("/mypage")}>
            마이페이지로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const selectedCount = (Object.keys(selected) as Category[]).filter((k) => selected[k]).length;
  const canSend = selectedCount === 4;

  const toggleWord = (cat: Category, word: string) => {
    setSelected((s) => ({
      ...s,
      [cat]: s[cat] === word ? undefined : word,
    }));
  };

  const handleSend = () => {
    if (!canSend) return;
    const text = generateSentence(selected as Record<Category, string>);
    const msg: Message = {
      role: "me",
      id: `me-${Date.now()}`,
      text,
      trait: partner.trait,
      pct: partner.percentage,
    };
    setMessages((m) => [...m, msg]);
    updatePartnerTemperature(partner.id, 5);
    updatePartnerLastMessage(partner.id, text);
    setSelected({});

    // Mock partner reply
    setTimeout(() => {
      const replies = [
        "그 문장이 별빛처럼 마음에 닿았어요.",
        "당신의 말이 바람처럼 스며들어요.",
        "같은 시간 속에서 저도 그 온도를 느껴요.",
        "당신의 단어 하나하나가 기억이 되네요.",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((m) => [
        ...m,
        {
          role: "partner",
          id: `p-${Date.now()}`,
          text: reply,
          trait: partner.trait,
          pct: partner.percentage,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-night relative overflow-hidden flex flex-col">
      <StarField />

      {/* Top */}
      <header className="relative z-10 h-16 flex items-center justify-between px-4 border-b border-border/40 bg-background/60 backdrop-blur-md">
        <button
          onClick={() => navigate("/mypage")}
          className="text-sm text-foreground/80 hover:text-gold transition-colors"
        >
          ← 뒤로
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mystic-purple/30 to-gold/20 flex items-center justify-center text-base border border-gold/30">
            {partner.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-display text-foreground truncate">{partner.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {traitEmoji[partner.trait]} {partner.trait}
            </p>
          </div>
        </div>

        <div className="min-w-[110px]">
          <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
            <span>🌡</span>
            <span className="text-gold">{partner.temperature}%</span>
          </div>
          <Progress value={partner.temperature} className="h-1.5 mt-1" />
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {messages.map((m) => {
          if (m.role === "system") {
            return (
              <div key={m.id} className="flex justify-center">
                <span className="text-[11px] text-muted-foreground bg-background/60 px-3 py-1 rounded-full">
                  {m.text}
                </span>
              </div>
            );
          }
          const mine = m.role === "me";
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 border",
                  mine
                    ? "bg-mystic-purple/20 border-mystic-purple/40"
                    : "bg-card/80 border-border/50"
                )}
              >
                <p className="text-sm text-foreground leading-relaxed">{m.text}</p>
                {m.trait && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {traitEmoji[m.trait as any]} {m.trait} · {m.pct}%
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="relative z-10 border-t border-border/40 bg-background/80 backdrop-blur-md p-3 space-y-3">
        {/* Category tabs */}
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(WORD_BANK) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "h-9 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1",
                activeCategory === cat
                  ? "bg-gold text-primary-foreground border-gold"
                  : "bg-card/60 text-foreground/80 border-border/50 hover:border-gold/50",
                selected[cat] && activeCategory !== cat && "ring-1 ring-gold/40"
              )}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
              {selected[cat] && <span className="text-[9px]">✓</span>}
            </button>
          ))}
        </div>

        {/* Word grid */}
        <div className="grid grid-cols-2 gap-2">
          {WORD_BANK[activeCategory].map((word) => {
            const isActive = selected[activeCategory] === word;
            return (
              <button
                key={word}
                onClick={() => toggleWord(activeCategory, word)}
                className={cn(
                  "h-9 rounded-lg text-sm border transition-all",
                  isActive
                    ? "bg-gold text-primary-foreground border-gold"
                    : "bg-card/60 text-foreground/90 border-border/50 hover:border-gold/50"
                )}
              >
                {word}
              </button>
            );
          })}
        </div>

        <Button
          variant="golden"
          size="lg"
          disabled={!canSend}
          onClick={handleSend}
          className="w-full"
        >
          ✨ 문장 조합 & 전송 ({selectedCount}/4)
        </Button>
      </div>
    </div>
  );
};

export default Chat;
