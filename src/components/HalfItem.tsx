import { cn } from "@/lib/utils";

interface HalfItemProps {
  name: string;
  icon: string;
  rarity: "common" | "rare" | "legendary";
  isLeft?: boolean;
  className?: string;
}

export const HalfItem = ({ name, icon, rarity, isLeft = true, className }: HalfItemProps) => {
  const rarityStyles = {
    common: "from-muted to-muted/50 border-muted-foreground/30",
    rare: "from-celestial-blue/30 to-mystic-purple/30 border-celestial-blue/50",
    legendary: "from-gold/30 to-gold-glow/20 border-gold/60",
  };

  const glowStyles = {
    common: "",
    rare: "shadow-[0_0_20px_hsl(220_60%_50%/0.3)]",
    legendary: "shadow-[0_0_30px_hsl(38_92%_60%/0.5)] animate-pulse-glow",
  };

  return (
    <div
      className={cn(
        "relative w-24 h-32 rounded-xl border-2 bg-gradient-to-br transition-all duration-300 hover:scale-110",
        rarityStyles[rarity],
        glowStyles[rarity],
        isLeft ? "clip-left" : "clip-right",
        className
      )}
      style={{
        clipPath: isLeft 
          ? "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)"
          : "polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 0 50%)",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        <span className="text-4xl mb-2">{icon}</span>
        <span className="text-xs text-foreground/80 text-center font-medium">{name}</span>
      </div>
      
      {/* Jagged edge effect */}
      <div 
        className={cn(
          "absolute top-0 bottom-0 w-4",
          isLeft ? "right-0" : "left-0"
        )}
        style={{
          background: `repeating-linear-gradient(
            ${isLeft ? "45deg" : "-45deg"},
            transparent,
            transparent 3px,
            hsl(var(--gold) / 0.3) 3px,
            hsl(var(--gold) / 0.3) 6px
          )`,
        }}
      />
    </div>
  );
};
