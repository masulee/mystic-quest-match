import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StarField } from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { traitEmoji } from "@/lib/mockPartners";
import ChatWordSelector from "@/components/ChatWordSelector";
import { cn } from "@/lib/utils";
import { Sparkles, Send } from "lucide-react";

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
  const [showSelector, setShowSelector] = useState(false);
  const [inputText, setInputText] = useState("");
  const [inputGlow, setInputGlow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleInsertFromSelector = (text: string) => {
    setShowSelector(false);
    setInputText(text);
    setInputGlow(true);
    setTimeout(() => {
      inputRef.current?.focus();
      setInputGlow(false);
    }, 1200);
  };

  const handleSendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const msg: Message = {
      role: "me",
      id: `me-${Date.now()}`,
      text,
      trait: partner.trait,
      pct: partner.percentage,
    };
    setMessages((m) => [...m, msg]);
    setInputText("");
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

      {/* Chat Input Bar */}
      <div className="relative z-10 px-4 py-3 border-t border-border/40 bg-background/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="단어를 조합해 메시지를 보내세요..."
            className={cn(
              "flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-500",
              inputGlow && "border-mystic-purple/60 shadow-[0_0_20px_rgba(192,132,252,0.4)]"
            )}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200",
              inputText.trim()
                ? "bg-gradient-to-r from-mystic-purple to-gold/80 text-white hover:brightness-110"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating ✨ button */}
      {!showSelector && (
        <button
          onClick={() => setShowSelector(true)}
          className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-200"
          style={{
            background: "linear-gradient(135deg, #FF6B9D, #7B61FF, #C084FC)",
            boxShadow: "0 4px 20px rgba(123,97,255,0.4)",
          }}
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Word Selector Panel (slide up/down) */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 transition-transform duration-300 ease-in-out",
          showSelector ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="relative">
          {/* Close handle */}
          <button
            onClick={() => setShowSelector(false)}
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-t-xl px-6 py-1 text-xs text-white/60 hover:text-white/90 transition-colors"
          >
            ▼ 닫기
          </button>
          <div className="max-h-[60vh] overflow-y-auto">
            <ChatWordSelector onSend={handleInsertFromSelector} />
          </div>
        </div>
      </div>

      {/* Overlay when selector is open */}
      {showSelector && (
        <div
          className="fixed inset-0 z-[15] bg-black/30"
          onClick={() => setShowSelector(false)}
        />
      )}
    </div>
  );
};

export default Chat;
