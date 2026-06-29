import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { gameLocations, personalityDescriptions } from "@/lib/gameData";
import { Button } from "@/components/ui/button";
import { HalfItem } from "./HalfItem";
import { cn } from "@/lib/utils";

export const ExplorationQuiz = () => {
  const {
    currentLocationId, currentQuizIndex, isQuizActive, showResponse,
    locationCompleted, showReward, collectedItems, quizAnswers,
    startQuiz, answerQuiz, proceedAfterResponse, claimReward, getDominantTrait,
  } = useGame();

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const location = gameLocations.find((l) => l.id === currentLocationId);
  if (!location) return null;

  const alreadyCompleted = collectedItems.some((i) => i.locationId === currentLocationId);

  // Show reward screen
  if (showReward) {
    const dominant = getDominantTrait();
    const reward = collectedItems.find((i) => i.locationId === currentLocationId);
    const personality = personalityDescriptions[dominant];

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-float">{location.icon}</div>
          <h3 className="font-display text-2xl text-gradient-gold">{location.name} 완료!</h3>
        </div>

        {reward && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-sm">획득한 아이템</p>
            <div className="relative">
              <HalfItem name={reward.itemName} icon={reward.icon} rarity={reward.rarity} isLeft={true} />
              <div className="absolute -inset-4 rounded-full border-2 border-gold/30 animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">{reward.itemName}</p>
              <p className="text-muted-foreground text-xs mt-1">{reward.description}</p>
            </div>
          </div>
        )}

        <div className={cn("p-6 rounded-2xl border border-border/50 bg-gradient-to-br", personality.color, "bg-opacity-10")}>
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-5 space-y-2">
            <p className="text-xs text-muted-foreground">이번 여정에서 드러난 당신의 성향</p>
            <p className="font-display text-lg text-foreground">{personality.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{personality.description}</p>
          </div>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          {(["감성", "지혜", "용기", "신비"] as const).map((trait) => {
            const count = quizAnswers.filter((a) => a === trait).length;
            return count > 0 ? (
              <span key={trait} className="px-3 py-1 rounded-full text-xs bg-muted/50 text-muted-foreground border border-border/50">
                {trait} +{count}
              </span>
            ) : null;
          })}
        </div>
      </div>
    );
  }

  // Already completed location
  if (alreadyCompleted && !isQuizActive) {
    const item = collectedItems.find((i) => i.locationId === currentLocationId);
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-4xl">{location.icon}</div>
        <h3 className="font-display text-xl text-foreground">이미 탐험한 장소입니다</h3>
        {item && (
          <div className="flex flex-col items-center gap-3">
            <HalfItem name={item.itemName} icon={item.icon} rarity={item.rarity} isLeft={true} />
            <p className="text-sm text-gold">{item.itemName} 획득 완료</p>
          </div>
        )}
      </div>
    );
  }

  // Location intro
  if (!isQuizActive && !locationCompleted) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="relative h-56 md:h-72 -mx-6 md:-mx-8 -mt-6 md:-mt-8 overflow-hidden rounded-t-2xl">
          <img
            src={location.sceneImage}
            alt={location.name}
            width={1280}
            height={768}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-5xl drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">
            {location.icon}
          </div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="font-display text-2xl text-gradient-gold">{location.name}</h3>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{location.description}</p>
        </div>
        <div className="flex justify-center">
          <Button variant="golden" size="lg" onClick={startQuiz}>
            🌙 탐험 시작하기
          </Button>
        </div>
      </div>
    );
  }

  // Show response after answering
  if (showResponse) {
    return (
      <div className="text-center space-y-8 py-8 animate-in fade-in duration-500">
        <div className="text-4xl animate-pulse-glow rounded-full inline-block p-4">{location.icon}</div>
        <p className="text-foreground/90 text-lg leading-relaxed max-w-md mx-auto italic">
          {showResponse}
        </p>
        <Button variant="ethereal" onClick={() => { setSelectedChoice(null); proceedAfterResponse(); }}>
          계속하기 →
        </Button>
      </div>
    );
  }

  // Quiz completed, claim reward
  if (locationCompleted && !showReward) {
    return (
      <div className="text-center space-y-8 py-8 animate-in fade-in duration-500">
        <div className="text-5xl animate-float">✨</div>
        <h3 className="font-display text-2xl text-foreground">탐험 완료!</h3>
        <p className="text-muted-foreground">당신의 선택에 따라 운명의 아이템이 결정되었습니다.</p>
        <Button variant="golden" size="lg" onClick={claimReward} className="animate-pulse-glow">
          💫 아이템 수령하기
        </Button>
      </div>
    );
  }

  // Active quiz
  const quiz = location.quizzes[currentQuizIndex];
  if (!quiz) return null;

  const targetLabel = quiz.target === "self" ? "나의 성향" : "이상형 탐색";
  const targetColor = quiz.target === "self" ? "text-gold" : "text-mystic-purple";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="relative h-32 md:h-40 -mx-6 md:-mx-8 -mt-6 md:-mt-8 overflow-hidden rounded-t-2xl">
        <img
          src={location.sceneImage}
          alt={location.name}
          width={1280}
          height={768}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-3">
          <span className="text-xs text-foreground/90 font-display drop-shadow">
            {location.icon} {location.name}
          </span>
          <span className="text-[10px] text-foreground/80 drop-shadow">
            질문 {currentQuizIndex + 1}/{location.quizzes.length}
          </span>
        </div>
      </div>

      <div className="text-center space-y-3 py-2">
        <span className={cn("inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase border border-border/50 bg-card/40", targetColor)}>
          {targetLabel}
        </span>
        <p className="text-foreground text-lg leading-relaxed">{quiz.question}</p>
      </div>


      <div className="grid gap-3">
        {quiz.choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => setSelectedChoice(index)}
            className={cn(
              "w-full text-left p-4 rounded-xl border transition-all duration-300",
              selectedChoice === index
                ? "border-gold bg-gold/10 shadow-[0_0_20px_hsl(38_92%_60%/0.2)]"
                : "border-border/50 bg-card/30 hover:border-gold/50 hover:bg-card/50"
            )}
          >
            <span className="text-sm text-foreground/90">{choice.text}</span>
          </button>
        ))}
      </div>

      {selectedChoice !== null && (
        <div className="flex justify-center animate-in fade-in duration-300">
          <Button
            variant="mystic"
            size="lg"
            onClick={() => {
              const choice = quiz.choices[selectedChoice];
              answerQuiz(choice.trait, choice.response, quiz.target);
              setSelectedChoice(null);
            }}
          >
            선택하기
          </Button>
        </div>
      )}
    </div>
  );
};
