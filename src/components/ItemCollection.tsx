import { HalfItem } from "./HalfItem";

interface CollectedItem {
  id: number;
  name: string;
  icon: string;
  rarity: "common" | "rare" | "legendary";
  matchFound: boolean;
}

const collectedItems: CollectedItem[] = [
  { id: 1, name: "달빛 열쇠", icon: "🔑", rarity: "legendary", matchFound: false },
  { id: 2, name: "별의 조각", icon: "⭐", rarity: "rare", matchFound: true },
  { id: 3, name: "운명의 실", icon: "🧵", rarity: "common", matchFound: false },
  { id: 4, name: "수정 하트", icon: "💎", rarity: "legendary", matchFound: false },
];

export const ItemCollection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-foreground">수집한 반쪽 아이템</h3>
        <span className="text-sm text-muted-foreground">{collectedItems.length}개 수집</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {collectedItems.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-3">
            <div className="relative">
              <HalfItem
                name={item.name}
                icon={item.icon}
                rarity={item.rarity}
                isLeft={true}
              />
              {item.matchFound && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-xs animate-pulse-glow">
                  💫
                </div>
              )}
            </div>
            {item.matchFound ? (
              <span className="text-xs text-gold font-medium">인연 발견!</span>
            ) : (
              <span className="text-xs text-muted-foreground">탐색 중...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
