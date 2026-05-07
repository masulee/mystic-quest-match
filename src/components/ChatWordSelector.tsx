import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

type Category = "감정" | "장소" | "행동" | "시간" | "신비" | "위트";

const CATEGORIES: { key: Category; emoji: string; color: string; bg: string; glow: string }[] = [
  { key: "감정", emoji: "💖", color: "#FF6B9D", bg: "rgba(255,107,157,0.25)", glow: "0 0 12px rgba(255,107,157,0.5)" },
  { key: "장소", emoji: "📍", color: "#7B61FF", bg: "rgba(123,97,255,0.25)", glow: "0 0 12px rgba(123,97,255,0.5)" },
  { key: "행동", emoji: "⚡", color: "#FF9500", bg: "rgba(255,149,0,0.25)", glow: "0 0 12px rgba(255,149,0,0.5)" },
  { key: "시간", emoji: "⏳", color: "#00C2FF", bg: "rgba(0,194,255,0.25)", glow: "0 0 12px rgba(0,194,255,0.5)" },
  { key: "신비", emoji: "🌙", color: "#C084FC", bg: "rgba(192,132,252,0.25)", glow: "0 0 12px rgba(192,132,252,0.5)" },
  { key: "위트", emoji: "😏", color: "#34D399", bg: "rgba(52,211,153,0.25)", glow: "0 0 12px rgba(52,211,153,0.5)" },
];

const WORD_BANK: Record<Category, string[]> = {
  감정: ["설레설레","두근두근","심장이 쿵","몸이 간질간질","뭔가 끌려","자꾸 떠올라","웃음이 새","눈이 마주치면","좋아 좋아해","행복해","따뜻해져","편안해","긴장돼","두렵기도 해","설명이 안 돼","이유를 모르겠어","너무 좋은데 어떡해","자꾸 생각나","어색한데 싫지 않아","낯선데 익숙해","심장 탓이야","뭔가 묘해","이 기분 처음이야","감이 왔어"],
  장소: ["카페 창가에서","바닷가에서","공원 벤치에서","골목길에서","옥상에서","달빛 아래서","숲 속에서","다리 위에서","별빛 아래서","비 오는 창가에서","한강변에서","야경 앞에서","도서관 구석에서","오래된 골목에서","버스 안에서","지하철 안에서","지붕 위에서","편의점 앞에서","산 꼭대기에서","전시회에서","폐건물 틈에서","안개 속에서","세상 끝에서","그 어딘가에서"],
  행동: ["이야기하고 싶어","눈 마주치고 싶어","손잡고 싶어","같이 걷고 싶어","기대고 싶어","바라보고 싶어","만나고 싶어","함께하고 싶어","웃게 해주고 싶어","오래 있고 싶어","가만히 있고 싶어","이름 불러보고 싶어","물어보고 싶어","살짝 건드리고 싶어","뒤에서 안아주고 싶어","먼저 연락하고 싶어","핑계 만들고 싶어","같이 밥 먹고 싶어","영화 보고 싶어","드라이브 하고 싶어","사진 찍고 싶어","어딘가 떠나고 싶어","아무것도 안 하고 싶어","그냥 옆에 있고 싶어"],
  시간: ["지금 이 순간","오늘 밤","새벽에","내일도","매일매일","이 계절에","달이 뜨면","비 오는 날","시간이 멈추면","언젠가 꼭","아무 이유 없이","봄이 오면","여름이 끝나기 전에","첫눈이 오면","자정이 지나면","해가 뜨기 전에","주말 아침에","퇴근길에","잠들기 전에","눈을 뜨면","시간이 더 있다면","되돌릴 수 있다면","기억이 남는다면","영원이 있다면"],
  신비: ["운명인 것 같아","우연이 아닌 것 같아","어디선가 본 것 같아","꿈에서 본 것 같아","인연인 것 같아","끌리는 이유가 있어","별이 이어준 것 같아","필연 같아","처음인데 낯설지 않아","말하지 않아도 알아","같은 걸 느끼는 것 같아","반쪽 같아","우주가 보낸 사람 같아","시간을 뛰어넘은 것 같아","전생에 만난 것 같아","묘하게 겹쳐"],
  위트: ["내 탓이야 완전히","이게 다 네 탓이야","심장에 고장난 것 같아","왜 이러는 거야 진짜","이상하게 눈에 밟혀","자꾸 왜 나와","억울하게 좋아","어이없게 설레","어쩔 수 없잖아","이미 늦었어","도망가려 했는데","그냥 네가 문제야","사실 좋아한다고","솔직히 말하면","그런 거 아닌데 그런 거야","지금 티 나?","이러면 안 되는데","멈출 수가 없어","말이 안 나와","어떡하지 진짜"],
};

interface ChatWordSelectorProps {
  onSend?: (text: string) => void;
}

const ChatWordSelector = ({ onSend }: ChatWordSelectorProps) => {
  const [active, setActive] = useState<Category>("감정");
  // Track words in selection order: { word, category }
  const [orderedSelection, setOrderedSelection] = useState<{ word: string; cat: Category }[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  const selectedInCategory = (cat: Category) =>
    orderedSelection.filter((s) => s.cat === cat).map((s) => s.word);

  const catMeta = CATEGORIES.find((c) => c.key === active)!;

  const toggle = (word: string) => {
    setOrderedSelection((prev) => {
      const exists = prev.some((s) => s.word === word && s.cat === active);
      if (exists) return prev.filter((s) => !(s.word === word && s.cat === active));
      return [...prev, { word, cat: active }];
    });
  };

  const sentence = orderedSelection.map((s) => s.word).join(", ");

  const handleSend = () => {
    if (!sentence) return;
    onSend?.(sentence);
    setOrderedSelection([]);
  };

  const removeChip = (word: string, cat: Category) => {
    setOrderedSelection((prev) => prev.filter((s) => !(s.word === word && s.cat === cat)));
  };

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col" style={{ background: "#1a1025" }}>
      {/* Category Tabs */}
      <div
        ref={tabsRef}
        className="flex gap-2 px-3 py-2 overflow-x-auto scrollbar-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.key;
          const count = selectedInCategory(cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                isActive ? "text-white border-transparent" : "text-white/60 border-white/10 hover:border-white/20"
              )}
              style={
                isActive
                  ? { background: cat.bg, boxShadow: cat.glow, borderColor: cat.color + "60" }
                  : { background: "rgba(255,255,255,0.05)" }
              }
            >
              <span>{cat.emoji}</span>
              <span>{cat.key}</span>
              {count > 0 && (
                <span
                  className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                  style={{ background: cat.color + "40", color: cat.color }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Word Chips */}
      <div className="flex-1 overflow-y-auto px-3 py-3" style={{ maxHeight: "200px" }}>
        <div className="flex flex-wrap gap-2">
          {WORD_BANK[active].map((word) => {
            const isSelected = selectedInCategory(active).includes(word);
            return (
              <button
                key={word}
                onClick={() => toggle(word)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-all duration-200",
                  isSelected ? "text-white scale-105" : "text-white/80 hover:text-white"
                )}
                style={
                  isSelected
                    ? { background: catMeta.bg, borderColor: catMeta.color + "80", boxShadow: catMeta.glow }
                    : { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }
                }
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview & Send */}
      {orderedSelection.length > 0 && (
        <div className="border-t border-white/10 px-3 py-3 space-y-2" style={{ background: "rgba(26,16,37,0.95)" }}>
          {/* Selected chips in order */}
          <div className="flex flex-wrap gap-1.5">
            {orderedSelection.map(({ word, cat }, idx) => {
              const meta = CATEGORIES.find((c) => c.key === cat)!;
              return (
                <button
                  key={`${cat}-${word}-${idx}`}
                  onClick={() => removeChip(word, cat)}
                  className="px-2.5 py-1 rounded-full text-xs text-white border flex items-center gap-1 hover:brightness-125 transition-all"
                  style={{ background: meta.bg, borderColor: meta.color + "50" }}
                >
                  {word}
                  <span className="text-white/40 text-[10px]">✕</span>
                </button>
              );
            })}
          </div>

          {/* Sentence preview */}
          <p className="text-sm text-white/50 italic leading-relaxed">"{sentence}"</p>

          {/* Send button */}
          <button
            onClick={handleSend}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #FF6B9D, #7B61FF, #C084FC)",
            }}
          >
            <Send className="w-4 h-4" />
            채팅에 보내기
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWordSelector;
