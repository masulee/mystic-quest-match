import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

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

// Build a natural Korean sentence: [시간], [장소] [감정/신비/위트] — [행동]
function buildNaturalSentence(selected: Record<Category, string[]>): string {
  const time = selected["시간"];
  const place = selected["장소"];
  const feeling = [...selected["감정"], ...selected["신비"], ...selected["위트"]];
  const action = selected["행동"];

  const parts: string[] = [];
  if (time.length) parts.push(time.join(", "));
  if (place.length) parts.push(place.join(", "));

  const midAndEnd: string[] = [];
  if (feeling.length) midAndEnd.push(feeling.join(", "));
  if (action.length) midAndEnd.push(action.join(", "));

  if (parts.length && midAndEnd.length) {
    return parts.join(", ") + " " + midAndEnd.join(" — ");
  }
  if (parts.length) return parts.join(", ");
  if (midAndEnd.length) return midAndEnd.join(" — ");
  return "";
}

// Generate up to 3 sentence variations by shuffling/picking subsets
function generateVariations(selected: Record<Category, string[]>): string[] {
  const time = selected["시간"];
  const place = selected["장소"];
  const feeling = [...selected["감정"], ...selected["신비"], ...selected["위트"]];
  const action = selected["행동"];

  const pick = (arr: string[]) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : "";
  const totalSelected = time.length + place.length + feeling.length + action.length;
  if (totalSelected === 0) return [];

  const variations = new Set<string>();
  // Always add the primary sentence
  const primary = buildNaturalSentence(selected);
  if (primary) variations.add(primary);

  // Generate more variations by picking single items from each category
  for (let i = 0; i < 20 && variations.size < 3; i++) {
    const parts: string[] = [];
    const t = pick(time);
    const p = pick(place);
    const f = pick(feeling);
    const a = pick(action);

    if (t) parts.push(t);
    if (p) parts.push(p);
    const tail: string[] = [];
    if (f) tail.push(f);
    if (a) tail.push(a);

    let sentence = "";
    if (parts.length && tail.length) {
      sentence = parts.join(", ") + " " + tail.join(" — ");
    } else if (parts.length) {
      sentence = parts.join(", ");
    } else if (tail.length) {
      sentence = tail.join(" — ");
    }
    if (sentence) variations.add(sentence);
  }

  return Array.from(variations).slice(0, 3);
}

interface ChatWordSelectorProps {
  onSend?: (text: string) => void;
}

const ChatWordSelector = ({ onSend }: ChatWordSelectorProps) => {
  const [active, setActive] = useState<Category>("감정");
  const [selected, setSelected] = useState<Record<Category, string[]>>({
    감정: [], 장소: [], 행동: [], 시간: [], 신비: [], 위트: [],
  });
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const totalSelected = Object.values(selected).reduce((s, a) => s + a.length, 0);
  const sentence = buildNaturalSentence(selected);

  useEffect(() => {
    if (totalSelected > 0 && !showPreview) setShowPreview(true);
    if (totalSelected === 0) { setShowPreview(false); setVariations([]); }
  }, [totalSelected]);

  const catMeta = CATEGORIES.find((c) => c.key === active)!;

  const toggle = (word: string) => {
    setSelected((s) => {
      const arr = s[active];
      return { ...s, [active]: arr.includes(word) ? arr.filter((w) => w !== word) : [...arr, word] };
    });
    setVariations([]);
  };

  const handleCompose = () => {
    if (!sentence) return;
    const v = generateVariations(selected);
    setVariations(v);
  };

  const handleSend = (text: string) => {
    onSend?.(text);
    setSelected({ 감정: [], 장소: [], 행동: [], 시간: [], 신비: [], 위트: [] });
    setVariations([]);
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch { /* fallback: ignore */ }
  };

  const allSelected = Object.entries(selected).flatMap(([cat, words]) =>
    words.map((w) => ({ word: w, cat: cat as Category }))
  );

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
          const count = selected[cat.key].length;
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
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {WORD_BANK[active].map((word) => {
            const isSelected = selected[active].includes(word);
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

      {/* Preview Area */}
      <div
        className={cn(
          "border-t border-white/10 px-3 py-3 space-y-2 transition-all duration-300",
          showPreview ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        )}
        style={{ background: "rgba(26,16,37,0.95)" }}
      >
        {/* Selected chips */}
        {allSelected.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allSelected.map(({ word, cat }) => {
              const meta = CATEGORIES.find((c) => c.key === cat)!;
              return (
                <span
                  key={`${cat}-${word}`}
                  className="px-2.5 py-1 rounded-full text-xs text-white border"
                  style={{ background: meta.bg, borderColor: meta.color + "50" }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        )}

        {/* Sentence preview */}
        {sentence && (
          <p className="text-sm text-white/50 italic leading-relaxed">"{sentence}"</p>
        )}

        {/* Compose button */}
        <button
          onClick={handleCompose}
          disabled={!sentence}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
            sentence ? "text-white hover:brightness-110" : "text-white/30 cursor-not-allowed"
          )}
          style={{
            background: sentence
              ? "linear-gradient(135deg, #FF6B9D, #7B61FF, #C084FC)"
              : "rgba(255,255,255,0.08)",
          }}
        >
          ✨ 문장 만들기 ({totalSelected}개)
        </button>

        {/* Sentence variations */}
        {variations.length > 0 && (
          <div className="space-y-2 pt-1">
            {variations.map((v, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-xl px-3 py-2.5 border border-white/10"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <p className="flex-1 text-sm text-white/80 leading-relaxed">"{v}"</p>
                <div className="flex gap-1 flex-shrink-0 pt-0.5">
                  <button
                    onClick={() => handleCopy(v, i)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title="복사"
                  >
                    {copiedIdx === i ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-white/40" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSend(v)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/90 hover:brightness-110 transition-all whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg, #FF6B9D, #7B61FF)" }}
                  >
                    채팅에 보내기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWordSelector;
