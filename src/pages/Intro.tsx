import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/StarField";
import { useGame } from "@/contexts/GameContext";
import { doorChoices, PersonalityTrait } from "@/lib/gameData";
import { cn } from "@/lib/utils";
import candleImg from "@/assets/intro-candle.jpg";
import pawnshopImg from "@/assets/intro-pawnshop.jpg";

type Phase =
  | "candle-1"
  | "candle-2"
  | "candle-3"
  | "pawnshop-enter"
  | "npc-1"
  | "npc-2"
  | "npc-quest"
  | "door-intro"
  | "door-choice";

const phaseOrder: Phase[] = [
  "candle-1",
  "candle-2",
  "candle-3",
  "pawnshop-enter",
  "npc-1",
  "npc-2",
  "npc-quest",
];

const lines: Record<Phase, string> = {
  "candle-1": "당신은... 인연을 믿나요?",
  "candle-2": "이곳은 시간의 흐름 속에서 잊힌 인연의 조각들이 머무는 곳.",
  "candle-3": "당신의 작은 선택 하나하나가 잠든 운명을 깨우게 될지도 모릅니다.",
  "pawnshop-enter": "",
  "npc-1": "어서 오시게. 자네의 눈빛에서 무언가를 간절히 찾고 있는 듯한 기운이 느껴지는군.",
  "npc-2": "내 오랜 친구가 간직했던 '빛바랜 편지' 한 통을 찾아다 주면, 자네의 여정에 작은 도움이 될 '반쪽 아이템'을 내어주겠네.",
  "npc-quest": "",
  "door-intro": "\"첫 번째 선택이오. 어느 문을 열든, 당신이 선택한 것이 당신을 말해줄 것입니다.\"",
  "door-choice": "",
};

const Intro = () => {
  const navigate = useNavigate();
  const { recordDoorChoice } = useGame();
  const [phase, setPhase] = useState<Phase>("candle-1");
  const [textKey, setTextKey] = useState(0);
  const [hoveredDoor, setHoveredDoor] = useState<number | null>(null);

  const isCandleScene = phase.startsWith("candle");
  const isPawnshopScene =
    phase.startsWith("pawnshop") || phase.startsWith("npc") || phase.startsWith("door");

  useEffect(() => {
    // pawnshop-enter is a brief scene transition, auto-advance
    if (phase === "pawnshop-enter") {
      const t = setTimeout(() => {
        setPhase("npc-1");
        setTextKey((k) => k + 1);
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const next = () => {
    const idx = phaseOrder.indexOf(phase);
    if (idx < phaseOrder.length - 1) {
      setPhase(phaseOrder[idx + 1]);
      setTextKey((k) => k + 1);
    }
  };

  const acceptQuest = () => {
    setPhase("door-intro");
    setTextKey((k) => k + 1);
  };

  const pickDoor = (trait: PersonalityTrait) => {
    recordDoorChoice(trait);
    navigate("/explore");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background scene */}
      <div className="absolute inset-0">
        {isCandleScene && (
          <img
            src={candleImg}
            alt="어두운 방 안에서 희미하게 타오르는 촛불"
            className="w-full h-full object-cover animate-fade-in"
            width={1536}
            height={896}
          />
        )}
        {isPawnshopScene && (
          <img
            src={pawnshopImg}
            alt="신비로운 분위기의 전당포 내부와 노인 주인"
            className="w-full h-full object-cover animate-fade-in"
            width={1536}
            height={896}
            loading="lazy"
          />
        )}
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* Subtle stars on top */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <StarField />
      </div>

      {/* Scene transition flash */}
      {phase === "pawnshop-enter" && (
        <div className="absolute inset-0 bg-background animate-fade-out pointer-events-none z-20" />
      )}

      {/* Skip button */}
      <button
        onClick={() => navigate("/explore")}
        className="absolute top-6 right-6 z-30 text-xs text-foreground/50 hover:text-gold transition-colors tracking-widest uppercase"
      >
        Skip ›
      </button>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end px-6 pb-20 md:pb-28">
        {phase !== "pawnshop-enter" && (
          <div
            key={textKey}
            className="max-w-2xl w-full text-center space-y-8 animate-fade-in"
          >
            {/* NPC label */}
            {(phase === "npc-1" || phase === "npc-2") && (
              <div className="inline-block px-4 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-gold/30">
                <span className="font-display text-sm text-gold tracking-widest">
                  전당포 주인
                </span>
              </div>
            )}

            {phase === "npc-quest" ? (
              <div className="bg-card/70 backdrop-blur-md border border-gold/40 rounded-2xl p-8 space-y-6 glow-gold">
                <div className="text-4xl">📜</div>
                <h2 className="font-display text-2xl md:text-3xl text-gradient-gold">
                  첫 번째 퀘스트
                </h2>
                <div className="space-y-2 text-foreground/90">
                  <p className="font-display text-lg">빛바랜 편지를 찾아서</p>
                  <p className="text-sm text-muted-foreground">
                    전당포 주인의 오랜 친구가 간직했던 편지를 찾아
                    <br />
                    당신의 첫 반쪽 아이템을 얻으세요.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button variant="golden" size="lg" onClick={acceptQuest}>
                    퀘스트 수락하기
                  </Button>
                  <Button
                    variant="ethereal"
                    size="lg"
                    onClick={() => navigate("/")}
                  >
                    다음에 다시
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="font-display text-xl md:text-3xl text-foreground leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                  {lines[phase]}
                </p>
                <button
                  onClick={next}
                  className="text-xs text-gold/70 hover:text-gold transition-colors tracking-[0.3em] uppercase animate-pulse"
                >
                  ▾ 계속하기 ▾
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Intro;
