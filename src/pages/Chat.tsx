import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StarField } from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { traitEmoji } from "@/lib/mockPartners";
import ChatWordSelector from "@/components/ChatWordSelector";
import { cn } from "@/lib/utils";

type Category = "감정" | "장소" | "행동" | "시간";

const CATEGORY_ICONS: Record<Category, string> = {
  감정: "💖",
  장소: "📍",
  행동: "⚡",
  시간: "⏳",
};

const WORD_BANK: Record<Category, string[]> = {
  감정: [
    "보고싶어", "설레", "편안해", "두근거려",
    "행복해", "궁금해", "따뜻해", "좋아해",
    "웃게돼", "감동이야",
  ],
  장소: [
    "카페에서", "바닷가에서", "공원에서", "하늘 아래",
    "골목길에서", "창가에서", "벤치에서", "옥상에서",
    "숲속에서", "달빛 아래",
  ],
  행동: [
    "걷고 싶어", "이야기하고 싶어", "같이 있고 싶어", "눈 마주치고 싶어",
    "손잡고 싶어", "기대고 싶어", "웃고 싶어", "바라보고 싶어",
    "기다릴게", "함께하고 싶어",
  ],
  시간: [
    "지금", "오늘 밤", "내일도", "매일",
    "언젠가", "이 순간", "새벽에", "해질녘에",
    "항상", "다시",
  ],
};

const buildSentence = (selected: Record<Category, string[]>): string => {
  const parts: string[] = [];

  // Natural ordering: 시간 → 장소 → 감정 → 행동
  const time = selected["시간"] || [];
  const place = selected["장소"] || [];
  const emotion = selected["감정"] || [];
  const action = selected["행동"] || [];

  if (time.length) parts.push(time.join(" "));
  if (place.length) parts.push(place.join(" "));
  if (emotion.length) parts.push(emotion.join(", "));
  if (action.length) parts.push(action.join(", "));

  return parts.join(" ") || "";
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
  const [selected, setSelected] = useState<Record<Category, string[]>>({
    감정: [], 장소: [], 행동: [], 시간: [],
  });
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
        text: "오늘 밤 달빛 아래, 당신을 기다리고 있었어요.",
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

  const totalSelected = Object.values(selected).reduce((sum, arr) => sum + arr.length, 0);
  const canSend = totalSelected >= 1;
  const preview = buildSentence(selected);

  const toggleWord = (cat: Category, word: string) => {
    setSelected((s) => {
      const arr = s[cat];
      const exists = arr.includes(word);
      return {
        ...s,
        [cat]: exists ? arr.filter((w) => w !== word) : [...arr, word],
      };
    });
  };

  const handleSend = () => {
    if (!canSend) return;
    const text = buildSentence(selected);
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
    setSelected({ 감정: [], 장소: [], 행동: [], 시간: [] });

    setTimeout(() => {
      const replies = [
        "그 말이 마음에 닿았어요 ☺️",
        "저도 같은 마음이에요, 정말로.",
        "당신이랑 같이 있고 싶어요.",
        "그 말 듣고 웃음이 났어요 😊",
        "오늘 밤, 저도 설레요.",
        "다시 만날 수 있을까요?",
        "그 순간을 함께하고 싶어요.",
        "마음이 따뜻해지네요.",
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

  const categories = Object.keys(WORD_BANK) as Category[];

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
      <div className="relative z-10 border-t border-border/40 bg-background/80 backdrop-blur-md p-3 space-y-2">
        {/* Preview */}
        {preview && (
          <div className="bg-card/60 border border-border/50 rounded-lg px-3 py-2">
            <p className="text-xs text-muted-foreground mb-0.5">미리보기</p>
            <p className="text-sm text-foreground">{preview}</p>
          </div>
        )}

        {/* Category tabs */}
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => {
            const count = selected[cat].length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "h-9 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1",
                  activeCategory === cat
                    ? "bg-gold text-primary-foreground border-gold"
                    : "bg-card/60 text-foreground/80 border-border/50 hover:border-gold/50",
                  count > 0 && activeCategory !== cat && "ring-1 ring-gold/40"
                )}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{cat}</span>
                {count > 0 && <span className="text-[9px] bg-gold/20 rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Word grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {WORD_BANK[activeCategory].map((word) => {
            const isActive = selected[activeCategory].includes(word);
            return (
              <button
                key={word}
                onClick={() => toggleWord(activeCategory, word)}
                className={cn(
                  "h-8 rounded-lg text-sm border transition-all",
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
          ✨ 전송 ({totalSelected}개 선택됨)
        </Button>
      </div>
    </div>
  );
};

export default Chat;
