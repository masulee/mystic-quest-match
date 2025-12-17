import { cn } from "@/lib/utils";

interface JourneyNode {
  id: number;
  name: string;
  icon: string;
  unlocked: boolean;
  current?: boolean;
}

const journeyNodes: JourneyNode[] = [
  { id: 1, name: "시작의 숲", icon: "🌲", unlocked: true },
  { id: 2, name: "달빛 호수", icon: "🌙", unlocked: true, current: true },
  { id: 3, name: "별의 정원", icon: "✨", unlocked: false },
  { id: 4, name: "운명의 사원", icon: "🏛️", unlocked: false },
  { id: 5, name: "인연의 다리", icon: "🌉", unlocked: false },
];

export const JourneyPath = () => {
  return (
    <div className="relative py-8">
      {/* Connection line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gold/50 via-mystic-purple/50 to-muted transform -translate-y-1/2" />
      
      <div className="relative flex justify-between items-center">
        {journeyNodes.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300",
                node.unlocked
                  ? node.current
                    ? "bg-gradient-to-br from-gold to-gold-glow shadow-[0_0_30px_hsl(38_92%_60%/0.6)] scale-110"
                    : "bg-gradient-to-br from-mystic-purple/50 to-secondary/50 border-2 border-mystic-purple/50"
                  : "bg-muted/30 border-2 border-muted-foreground/20 grayscale"
              )}
            >
              {node.icon}
              {node.current && (
                <div className="absolute -inset-2 rounded-full border-2 border-gold/50 animate-ping" />
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium text-center max-w-[80px]",
                node.unlocked ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {node.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
