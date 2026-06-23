import { useGame } from "@/contexts/GameContext";
import { idealDescriptions, personalityDescriptions, PersonalityTrait } from "@/lib/gameData";
import { cn } from "@/lib/utils";

const traitColors: Record<PersonalityTrait, string> = {
  감성: "bg-pink-500",
  지혜: "bg-blue-500",
  용기: "bg-orange-500",
  신비: "bg-purple-500",
};

const TraitBars = ({ scores }: { scores: Record<PersonalityTrait, number> }) => {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  if (total === 0) return null;
  const sorted = (Object.entries(scores) as [PersonalityTrait, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  return (
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
  );
};

export const PersonalityProfile = () => {
  const { traitScores, idealTraitScores, collectedItems } = useGame();

  const selfTotal = Object.values(traitScores).reduce((a, b) => a + b, 0);
  const idealTotal = Object.values(idealTraitScores).reduce((a, b) => a + b, 0);
  if (selfTotal === 0 && idealTotal === 0) return null;

  const selfSorted = (Object.entries(traitScores) as [PersonalityTrait, number][])
    .sort((a, b) => b[1] - a[1]);
  const idealSorted = (Object.entries(idealTraitScores) as [PersonalityTrait, number][])
    .sort((a, b) => b[1] - a[1]);

  const dominantSelf = selfSorted[0]?.[1] > 0 ? selfSorted[0][0] : null;
  const dominantIdeal = idealSorted[0]?.[1] > 0 ? idealSorted[0][0] : null;

  return (
    <div className="space-y-8">
      {dominantSelf && (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.3em] uppercase border border-gold/40 text-gold bg-card/40">
              나의 성향
            </span>
            <p className={cn("font-display text-lg bg-gradient-to-r bg-clip-text text-transparent", personalityDescriptions[dominantSelf].color)}>
              {personalityDescriptions[dominantSelf].title}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {personalityDescriptions[dominantSelf].description}
            </p>
          </div>
          <TraitBars scores={traitScores} />
        </div>
      )}

      {dominantIdeal && (
        <div className="space-y-4 pt-4 border-t border-border/30">
          <div className="text-center space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.3em] uppercase border border-mystic-purple/40 text-mystic-purple bg-card/40">
              이상형 성향
            </span>
            <p className="font-display text-lg text-foreground">
              {idealDescriptions[dominantIdeal].title}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {idealDescriptions[dominantIdeal].description}
            </p>
          </div>
          <TraitBars scores={idealTraitScores} />
        </div>
      )}

      {collectedItems.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border/30">
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
