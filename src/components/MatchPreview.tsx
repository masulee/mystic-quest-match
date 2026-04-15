import { useState } from "react";
import { HalfItem } from "./HalfItem";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface MatchProfile {
  id: number;
  silhouette: boolean;
  matchedItem: {
    name: string;
    icon: string;
    rarity: "common" | "rare" | "legendary";
  };
  compatibility: number;
}

const potentialMatches: MatchProfile[] = [
  {
    id: 1,
    silhouette: true,
    matchedItem: { name: "별의 조각", icon: "⭐", rarity: "rare" },
    compatibility: 87,
  },
];

type Phase = "preview" | "matching" | "breaking" | "failed";

export const MatchPreview = () => {
  const [phase, setPhase] = useState<Phase>("preview");

  const handleCheckMatch = () => {
    setPhase("matching");
    setTimeout(() => setPhase("breaking"), 2000);
    setTimeout(() => setPhase("failed"), 3500);
  };

  const handleRetry = () => {
    setPhase("preview");
  };

  // Failed ending screen
  if (phase === "failed") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-destructive/30 bg-gradient-to-br from-card to-destructive/10 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--destructive)/0.1),transparent_70%)]" />
        
        <div className="relative text-center space-y-6 animate-in fade-in duration-700">
          {/* Broken shards */}
          <div className="relative h-24 flex items-center justify-center">
            <span className="text-5xl opacity-80 inline-block rotate-[-15deg] translate-x-[-20px] translate-y-[5px]">💔</span>
            <span className="text-3xl opacity-60 inline-block rotate-[25deg] translate-x-[10px] translate-y-[-10px]">✨</span>
            <span className="text-2xl opacity-40 inline-block rotate-[45deg] translate-x-[25px] translate-y-[15px]">🔮</span>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-2xl text-foreground">조각이 맞지 않습니다...</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
              이 인연은 당신의 반쪽이 아니었어요.<br />
              아이템의 조각이 부서져 흩어졌습니다.
            </p>
          </div>

          <div className="py-4">
            <div className="mx-auto w-48 h-px bg-gradient-to-r from-transparent via-destructive/50 to-transparent" />
          </div>

          <p className="text-foreground/70 text-sm font-display">
            다시 여행을 떠나 새로운 조각을 모아보세요
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/explore">
              <Button variant="golden" size="lg">
                🌙 다시 여행 떠나기
              </Button>
            </Link>
            <Button variant="ethereal" size="lg" onClick={handleRetry}>
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Breaking animation
  if (phase === "breaking") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-destructive/40 bg-gradient-to-br from-card to-destructive/10 p-8">
        <div className="relative text-center space-y-6">
          <div className="relative h-32 flex items-center justify-center">
            {/* Items cracking apart */}
            <div className="animate-crack-left">
              <HalfItem name="별의 조각" icon="⭐" rarity="rare" isLeft={true} />
            </div>
            <div className="mx-4 text-3xl animate-pulse text-destructive">💥</div>
            <div className="animate-crack-right">
              <HalfItem name="???" icon="❓" rarity="rare" isLeft={false} className="opacity-50" />
            </div>
          </div>
          <p className="font-display text-lg text-destructive/80 animate-pulse">조각이 부서지고 있습니다...</p>
        </div>
      </div>
    );
  }

  // Matching animation
  if (phase === "matching") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-card to-deep-purple/20 p-8">
        <div className="relative text-center space-y-6">
          <div className="text-4xl animate-pulse">🔮</div>
          <p className="font-display text-lg text-gold animate-pulse">인연을 확인하는 중...</p>
          <div className="mx-auto w-48 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold to-mystic-purple animate-[loading_2s_ease-in-out]" />
          </div>
        </div>
      </div>
    );
  }

  // Default preview
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-card to-deep-purple/20 p-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-mystic-purple/20 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">✨</span>
          <h3 className="font-display text-xl text-foreground">운명의 인연</h3>
        </div>
        
        {potentialMatches.length > 0 ? (
          <div className="space-y-6">
            {potentialMatches.map((match) => (
              <div key={match.id} className="flex items-center gap-6">
                <HalfItem
                  name={match.matchedItem.name}
                  icon={match.matchedItem.icon}
                  rarity={match.matchedItem.rarity}
                  isLeft={true}
                />
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-mystic-purple" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl animate-pulse">
                      💫
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <HalfItem
                    name="???"
                    icon="❓"
                    rarity={match.matchedItem.rarity}
                    isLeft={false}
                    className="opacity-50"
                  />
                  <div className="absolute inset-0 backdrop-blur-sm rounded-xl" />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-display text-gold">{match.compatibility}%</div>
                  <div className="text-xs text-muted-foreground">운명 호환</div>
                </div>
              </div>
            ))}
            
            <Button variant="golden" className="w-full" onClick={handleCheckMatch}>
              인연 확인하기
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔮</div>
            <p className="text-muted-foreground">
              아직 매칭된 인연이 없습니다.<br />
              여행을 계속하며 반쪽 아이템을 모아보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
