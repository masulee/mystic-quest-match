import { useEffect } from "react";
import { StarField } from "@/components/StarField";
import { ExplorationMap } from "@/components/ExplorationMap";
import { ExplorationQuiz } from "@/components/ExplorationQuiz";
import { PersonalityProfile } from "@/components/PersonalityProfile";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { Link, useNavigate } from "react-router-dom";

const Explore = () => {
  const { collectedItems, resetGame } = useGame();

  return (
    <div className="min-h-screen bg-gradient-night relative overflow-hidden">
      <StarField />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-border/30">
        <Link to="/" className="text-gold hover:text-gold-glow transition-colors">
          <span className="text-lg">🌙</span>
          <span className="font-display text-sm ml-2 hidden sm:inline">인연의 조각</span>
        </Link>
        <h1 className="font-display text-sm md:text-base text-foreground">신비의 여정</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{collectedItems.length}/5 아이템</span>
          {collectedItems.length > 0 && (
            <button onClick={resetGame} className="text-xs text-muted-foreground/50 hover:text-destructive transition-colors">
              초기화
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Map */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-4 md:p-6">
          <ExplorationMap />
        </div>

        {/* Quiz area */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8 min-h-[300px]">
          <ExplorationQuiz />
        </div>

        {/* Personality Profile */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8">
          <PersonalityProfile />
        </div>

        {/* All complete - 마법사의 부름 */}
        {collectedItems.length >= 5 && (
          <div className="text-center space-y-6 py-8 animate-in fade-in duration-700">
            <div className="text-5xl animate-pulse-glow">🌬️✨</div>
            <h2 className="font-display text-2xl text-gradient-gold">
              바람결에 마법사의 부름이 들려옵니다…
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              인연의 조각 5개가 모두 모였습니다.
              <br />
              잊혀진 편지를 되살릴 시간입니다.
            </p>
            <Link to="/finale">
              <Button variant="golden" size="xl" className="animate-pulse-glow">
                🔮 마법사에게 가기
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
