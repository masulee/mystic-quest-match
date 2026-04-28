export const mockPartners = [
  {
    id: "partner-emotion",
    name: "서리안",
    avatar: "🌸",
    trait: "감성" as const,
    percentage: 94,
    traitEmoji: "💗",
  },
  {
    id: "partner-wisdom",
    name: "다은",
    avatar: "📜",
    trait: "지혜" as const,
    percentage: 91,
    traitEmoji: "📖",
  },
  {
    id: "partner-courage",
    name: "하준",
    avatar: "🔥",
    trait: "용기" as const,
    percentage: 89,
    traitEmoji: "⚔️",
  },
  {
    id: "partner-mystery",
    name: "루나",
    avatar: "🌙",
    trait: "신비" as const,
    percentage: 96,
    traitEmoji: "🔮",
  },
];

export const traitEmoji: Record<"감성" | "지혜" | "용기" | "신비", string> = {
  감성: "💗",
  지혜: "📖",
  용기: "⚔️",
  신비: "🔮",
};

export const getPartnerForTrait = (trait: "감성" | "지혜" | "용기" | "신비") =>
  mockPartners.find((p) => p.trait === trait) ?? mockPartners[0];
