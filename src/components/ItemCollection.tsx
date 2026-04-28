import { HalfItem } from "./HalfItem";
import { useGame } from "@/contexts/GameContext";

export const ItemCollection = () => {
  const { collectedItems } = useGame();

  const demo =
    collectedItems.length > 0
      ? collectedItems
      : [
          { locationId: 0, itemName: "달빛 열쇠", icon: "🔑", rarity: "legendary" as const, description: "운명의 문을 여는 반쪽 열쇠", trait: "신비" as const },
        ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-foreground">수집한 인연의 조각</h3>
        <span className="text-sm text-muted-foreground">{collectedItems.length}개 수집</span>
      </div>

      {collectedItems.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          여정을 시작하면 이곳에 아이템이 쌓입니다 ✨
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 justify-items-center">
          {demo.map((item) => (
            <HalfItem
              key={item.locationId}
              name={item.itemName}
              icon={item.icon}
              rarity={item.rarity}
              description={item.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};
