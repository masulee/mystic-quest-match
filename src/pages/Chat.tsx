import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StarField } from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { traitEmoji } from "@/lib/mockPartners";
import ChatWordSelector from "@/components/ChatWordSelector";
import { cn } from "@/lib/utils";




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

  const handleSend = (text: string) => {
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

      {/* Composer - ChatWordSelector */}
      <div className="relative z-10">
        <ChatWordSelector onSend={handleSend} />
      </div>
    </div>
  );
};

export default Chat;
