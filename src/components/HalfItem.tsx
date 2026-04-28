import { cn } from "@/lib/utils";

interface HalfItemProps {
  name: string;
  icon: string;
  rarity: "common" | "rare" | "legendary";
  description?: string;
  /** @deprecated kept for backwards compat; no longer affects shape */
  isLeft?: boolean;
  className?: string;
}

const rarityLabel = {
  common: "일반",
  rare: "희귀",
  legendary: "전설",
} as const;

export const HalfItem = ({ name, icon, rarity, description, className }: HalfItemProps) => {
  const rarityStyles = {
    common: "from-muted to-muted/40 border-muted-foreground/30",
    rare: "from-celestial-blue/25 to-mystic-purple/25 border-celestial-blue/50",
    legendary: "from-gold/30 to-gold-glow/20 border-gold/60",
  };

  const glowStyles = {
    common: "",
    rare: "shadow-[0_0_18px_hsl(220_60%_50%/0.25)]",
    legendary: "shadow-[0_0_24px_hsl(38_92%_60%/0.45)] animate-pulse-glow",
  };

  const badgeStyles = {
    common: "bg-muted text-muted-foreground",
    rare: "bg-mystic-purple/20 text-accent-foreground",
    legendary: "bg-gold/20 text-gold",
  };

  return (
    <div
      className={cn(
        "relative w-28 rounded-xl border-2 bg-gradient-to-br transition-all duration-300 hover:scale-105 p-3 flex flex-col items-center gap-1",
        rarityStyles[rarity],
        glowStyles[rarity],
        className
      )}
    >
      <span className="text-4xl" aria-hidden>{icon}</span>
      <span className="text-xs text-foreground/90 text-center font-medium leading-tight line-clamp-2">
        {name}
      </span>
      {description && (
        <span className="text-[10px] text-muted-foreground text-center leading-snug line-clamp-2">
          {description}
        </span>
      )}
      <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full mt-1", badgeStyles[rarity])}>
        {rarityLabel[rarity]}
      </span>
    </div>
  );
};
