import { useGame } from "@/contexts/GameContext";
import { gameLocations } from "@/lib/gameData";
import { cn } from "@/lib/utils";

export const ExplorationMap = () => {
  const { currentLocationId, unlockedLocations, collectedItems, selectLocation } = useGame();

  return (
    <div className="relative py-4">
      {/* Connection line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gold/50 via-mystic-purple/50 to-muted transform -translate-y-1/2" />

      <div className="relative flex justify-between items-center">
        {gameLocations.map((loc) => {
          const isUnlocked = unlockedLocations.includes(loc.id);
          const isCurrent = currentLocationId === loc.id;
          const isCompleted = collectedItems.some((i) => i.locationId === loc.id);

          return (
            <button
              key={loc.id}
              onClick={() => selectLocation(loc.id)}
              disabled={!isUnlocked}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={cn(
                  "relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl transition-all duration-300",
                  isCurrent
                    ? "bg-gradient-to-br from-gold to-gold-glow shadow-[0_0_30px_hsl(38_92%_60%/0.6)] scale-110"
                    : isCompleted
                    ? "bg-gradient-to-br from-mystic-purple/50 to-secondary/50 border-2 border-gold/50"
                    : isUnlocked
                    ? "bg-gradient-to-br from-mystic-purple/30 to-secondary/30 border-2 border-mystic-purple/50 hover:scale-105 hover:border-gold/50"
                    : "bg-muted/30 border-2 border-muted-foreground/20 grayscale opacity-50"
                )}
              >
                {loc.icon}
                {isCurrent && <div className="absolute -inset-2 rounded-full border-2 border-gold/50 animate-ping" />}
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-[10px]">✓</div>
                )}
              </div>
              <span className={cn(
                "text-[10px] md:text-xs font-medium text-center max-w-[70px]",
                isCurrent ? "text-gold" : isUnlocked ? "text-foreground" : "text-muted-foreground"
              )}>
                {loc.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
