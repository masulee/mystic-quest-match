import { useGame } from "@/contexts/GameContext";
import { personalityDescriptions, PersonalityTrait } from "@/lib/gameData";
import { cn } from "@/lib/utils";

const traitColors: Record<PersonalityTrait, string> = {
  감성: "bg-pink-500",
  지혜: "bg-blue-500",
  용기: "bg-orange-500",
  신비: "bg-purple-500",
};

export const PersonalityProfile = () => {
  const { traitScores, collectedItems } = useGame();

  const total = Object.values(traitScores).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const sorted = Object.entries(traitScores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]) as [PersonalityTrait, number][];

  const dominant = sorted[0]?.[0];
  if (!dominant) return null;

  const personality = personalityDescriptions[dominant];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-display text-xl text-foreground">나의 성향 프로필</h3>
        <p className={cn("font-display text-lg bg-gradient-to-r bg-clip-text text-transparent", personality.color)}>
          {personality.title}
        </p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">{personality.description}</p>
      </div>

      {/* Trait bars */}
      <div className="space-y-3">
        {sorted.map(([trait, score]) => (
          <div key={trait} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-foreground/80">{trait}</span>
              <span className="text-muted-foreground">{Math.round((score / total) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", traitColors[trait])}
                style={{ width: `${(score / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Collected items */}
      {collectedItems.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">수집한 아이템 ({collectedItems.length}/5)</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {collectedItems.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card/50 border border-border/50">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] text-foreground/80">{item.itemName}</span>
                <span className={cn(
                  "text-[9px] px-1.5 py-0.5 rounded-full",
                  item.rarity === "legendary" ? "bg-gold/20 text-gold" :
                  item.rarity === "rare" ? "bg-mystic-purple/20 text-accent-foreground" :
                  "bg-muted text-muted-foreground"
                )}>
                  {item.rarity === "legendary" ? "전설" : item.rarity === "rare" ? "희귀" : "일반"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
