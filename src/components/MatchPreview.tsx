import { HalfItem } from "./HalfItem";
import { Button } from "./ui/button";

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

export const MatchPreview = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-card to-deep-purple/20 p-6">
      {/* Decorative elements */}
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
                {/* Your half */}
                <HalfItem
                  name={match.matchedItem.name}
                  icon={match.matchedItem.icon}
                  rarity={match.matchedItem.rarity}
                  isLeft={true}
                />
                
                {/* Connection animation */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-mystic-purple" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl animate-pulse">
                      💫
                    </div>
                  </div>
                </div>
                
                {/* Their half (silhouette) */}
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
                
                {/* Compatibility */}
                <div className="text-center">
                  <div className="text-2xl font-display text-gold">{match.compatibility}%</div>
                  <div className="text-xs text-muted-foreground">운명 호환</div>
                </div>
              </div>
            ))}
            
            <Button variant="golden" className="w-full">
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
