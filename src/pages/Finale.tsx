import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/StarField";
import { useGame } from "@/contexts/GameContext";
import wizardImg from "@/assets/wizard-study.jpg";
import letterImg from "@/assets/faded-letter.jpg";
import pawnshopImg from "@/assets/intro-pawnshop.jpg";
import { cn } from "@/lib/utils";

type Phase =
  | "summon"        // 5개 아이템이 화면 중앙으로 모임
  | "fade-out"      // 화면 페이드 아웃
  | "wizard-1"      // 마법사 첫 대사
  | "wizard-2"      // 마법사 두 번째 대사 + 슬롯 + 버튼
  | "ritual-rise"   // 마법진 점등 + 아이템 떠오름
  | "ritual-merge"  // 빛의 소용돌이
  | "white-out"     // 화이트 아웃
  | "narration"     // 내레이션 텍스트
  | "letter-reveal" // 편지 등장
  | "wizard-3"      // 편지 전달 대사
  | "to-pawnshop"   // 전당포 복귀 전환
  | "pawnshop-1"    // 전당포 주인 - 반쪽 나침반
  | "pawnshop-2";   // 매칭으로 안내

const Finale = () => {
  const navigate = useNavigate();
  const { collectedItems } = useGame();
  const [phase, setPhase] = useState<Phase>("summon");
  const [textKey, setTextKey] = useState(0);

  // 자동 전환 단계들
  useEffect(() => {
    const timers: Record<string, number> = {
      "summon": 2800,
      "fade-out": 1000,
      "ritual-rise": 2400,
      "ritual-merge": 1400,
      "white-out": 900,
      "narration": 3800,
      "letter-reveal": 2400,
      "to-pawnshop": 1400,
    };
    const ms = timers[phase];
    if (!ms) return;

    const t = setTimeout(() => {
      const nextMap: Partial<Record<Phase, Phase>> = {
        "summon": "fade-out",
        "fade-out": "wizard-1",
        "ritual-rise": "ritual-merge",
        "ritual-merge": "white-out",
        "white-out": "narration",
        "narration": "letter-reveal",
        "letter-reveal": "wizard-3",
        "to-pawnshop": "pawnshop-1",
      };
      const nxt = nextMap[phase];
      if (nxt) {
        setPhase(nxt);
        setTextKey((k) => k + 1);
      }
    }, ms);
    return () => clearTimeout(t);
  }, [phase]);

  const advance = (to: Phase) => {
    setPhase(to);
    setTextKey((k) => k + 1);
  };

  // ===== 단계 1: 소환 - 5개 아이템 모이기 =====
  if (phase === "summon" || phase === "fade-out") {
    return (
      <div className="min-h-screen bg-gradient-night relative overflow-hidden">
        <StarField />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p
            className="font-display text-lg md:text-2xl text-gradient-gold max-w-xl mb-12 animate-fade-in drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
          >
            인연의 조각 5개가 모두 모였습니다.
            <br />
            <span className="text-foreground/80 text-base md:text-xl">
              바람결에 마법사의 부름이 들려옵니다…
            </span>
          </p>

          {/* 아이템들이 중앙으로 모임 */}
          <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gold/20 blur-2xl animate-pulse-glow" />
            </div>
            {collectedItems.slice(0, 5).map((item, i) => {
              const angle = (i * 72 - 90) * (Math.PI / 180);
              const radius = 130;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={item.locationId}
                  className="absolute top-1/2 left-1/2 text-4xl md:text-5xl transition-all duration-[2200ms] ease-in"
                  style={{
                    transform:
                      phase === "fade-out"
                        ? "translate(-50%, -50%) scale(0.4)"
                        : `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`,
                    opacity: phase === "fade-out" ? 0 : 1,
                    filter: "drop-shadow(0 0 12px hsl(38 92% 60% / 0.7))",
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  {item.icon}
                </div>
              );
            })}
          </div>

          {phase === "fade-out" && (
            <div className="absolute inset-0 bg-background animate-fade-in pointer-events-none" />
          )}
        </div>
      </div>
    );
  }

  // ===== 단계 2-4: 마법사 서재 배경 사용 =====
  const showWizardBg =
    phase === "wizard-1" ||
    phase === "wizard-2" ||
    phase === "ritual-rise" ||
    phase === "ritual-merge" ||
    phase === "letter-reveal" ||
    phase === "wizard-3";

  const showPawnshopBg =
    phase === "to-pawnshop" || phase === "pawnshop-1" || phase === "pawnshop-2";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0">
        {showWizardBg && (
          <img
            src={wizardImg}
            alt="시간의 서재 - 늙은 마법사"
            className="w-full h-full object-cover animate-fade-in"
            width={1536}
            height={896}
          />
        )}
        {showPawnshopBg && (
          <img
            src={pawnshopImg}
            alt="전당포 내부"
            className="w-full h-full object-cover animate-fade-in"
            width={1536}
            height={896}
            loading="lazy"
          />
        )}
        {phase === "narration" && (
          <div className="absolute inset-0 bg-gradient-night" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      {/* 별 오버레이 */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <StarField />
      </div>

      {/* 화이트 아웃 플래시 */}
      {phase === "white-out" && (
        <div className="absolute inset-0 bg-foreground z-30 animate-fade-in pointer-events-none" />
      )}

      {/* 전당포 전환 페이드 */}
      {phase === "to-pawnshop" && (
        <div className="absolute inset-0 bg-background animate-fade-out pointer-events-none z-20" />
      )}

      {/* 의식 - 마법진 + 아이템 떠오름 */}
      {(phase === "ritual-rise" || phase === "ritual-merge") && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {/* 마법진 */}
          <div
            className={cn(
              "absolute w-[300px] h-[300px] md:w-[420px] md:h-[420px] rounded-full",
              "border-2 border-gold/60 animate-pulse-glow"
            )}
            style={{
              boxShadow:
                "0 0 60px hsl(38 92% 60% / 0.6), inset 0 0 60px hsl(38 92% 60% / 0.3)",
            }}
          />
          <div
            className="absolute w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-full border border-gold/40"
            style={{ animation: "spin 8s linear infinite" }}
          />
          {/* 떠오르는 아이템 */}
          {collectedItems.slice(0, 5).map((item, i) => {
            const angle = (i * 72 - 90) * (Math.PI / 180);
            const radius = 110;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <div
                key={item.locationId}
                className={cn(
                  "absolute text-4xl md:text-5xl transition-all ease-out",
                  phase === "ritual-merge" ? "duration-[1200ms]" : "duration-[2000ms]"
                )}
                style={{
                  transform:
                    phase === "ritual-merge"
                      ? "translate(0, 0) scale(0)"
                      : `translate(${x}px, ${y}px) scale(1)`,
                  opacity: phase === "ritual-merge" ? 0 : 1,
                  filter: "drop-shadow(0 0 16px hsl(38 92% 60% / 0.9))",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                {item.icon}
              </div>
            );
          })}
        </div>
      )}

      {/* 편지 등장 */}
      {(phase === "letter-reveal" || phase === "wizard-3") && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <img
            src={letterImg}
            alt="빛바랜 편지"
            className="max-w-md md:max-w-lg w-full animate-fade-in rounded-2xl"
            style={{
              filter: "drop-shadow(0 0 40px hsl(38 92% 60% / 0.7))",
            }}
            width={1536}
            height={896}
            loading="lazy"
          />
        </div>
      )}

      {/* Skip */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 z-40 text-xs text-foreground/50 hover:text-gold transition-colors tracking-widest uppercase"
      >
        Skip ›
      </button>

      {/* 컨텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end px-6 pb-16 md:pb-24">
        {/* 마법사 대사 1 */}
        {phase === "wizard-1" && (
          <div key={textKey} className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-gold/30">
              <span className="font-display text-sm text-gold tracking-widest">늙은 마법사</span>
            </div>
            <p className="font-display text-xl md:text-2xl text-foreground leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
              "오, 마침내 왔구나. 네가 걸어온 다섯 개의 문,
              <br />
              그 선택의 무게가 이 조각들에 고스란히 담겨 있군."
            </p>
            <button
              onClick={() => advance("wizard-2")}
              className="text-xs text-gold/70 hover:text-gold transition-colors tracking-[0.3em] uppercase animate-pulse"
            >
              ▾ 계속하기 ▾
            </button>
          </div>
        )}

        {/* 마법사 대사 2 + 아이템 슬롯 + 의식 시작 버튼 */}
        {phase === "wizard-2" && (
          <div key={textKey} className="max-w-2xl w-full text-center space-y-6 animate-fade-in">
            <div className="inline-block px-4 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-gold/30">
              <span className="font-display text-sm text-gold tracking-widest">늙은 마법사</span>
            </div>
            <p className="font-display text-base md:text-xl text-foreground leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
              "이제 이 조각들을 하나로 엮어,
              <br />
              잊혀진 인연의 편지로 되살리마. 준비되었는가?"
            </p>

            {/* 수집 아이템 슬롯 */}
            <div className="flex justify-center gap-3 md:gap-4 py-2">
              {collectedItems.slice(0, 5).map((item) => (
                <div
                  key={item.locationId}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-card/70 backdrop-blur-sm border border-gold/40 flex items-center justify-center text-2xl glow-gold"
                >
                  {item.icon}
                </div>
              ))}
            </div>

            <Button
              variant="golden"
              size="lg"
              onClick={() => advance("ritual-rise")}
              className="animate-pulse-glow"
            >
              ✨ 조각을 마법진에 올려놓는다
            </Button>
          </div>
        )}

        {/* 내레이션 */}
        {phase === "narration" && (
          <div key={textKey} className="max-w-2xl w-full text-center animate-fade-in absolute inset-0 flex items-center justify-center px-6">
            <p className="font-display text-lg md:text-2xl text-gradient-gold leading-relaxed italic drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
              "시간이 조각을 감싸고,
              <br />
              기억이 잉크가 되네…
              <br />
              <br />
              네 영혼이 고른 인연의 경로가
              <br />
              여기 피어난다."
            </p>
          </div>
        )}

        {/* 마법사 대사 3 - 편지 전달 */}
        {phase === "wizard-3" && (
          <div key={textKey} className="max-w-2xl w-full text-center space-y-6 animate-fade-in">
            <div className="inline-block px-4 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-gold/30">
              <span className="font-display text-sm text-gold tracking-widest">늙은 마법사</span>
            </div>
            <p className="font-display text-base md:text-xl text-foreground leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] bg-background/40 backdrop-blur-sm rounded-xl p-4">
              "이 편지는 네 선택이 빚어낸 지도이자, 운명의 열쇠다.
              <br />
              전당포 주인에게 가져가거라.
              <br />
              그가 너에게 '반쪽 나침반'을 건네줄 것이야."
            </p>
            <Button
              variant="golden"
              size="lg"
              onClick={() => advance("to-pawnshop")}
            >
              🏚️ 전당포로 이동하기
            </Button>
          </div>
        )}

        {/* 전당포 - 반쪽 나침반 교환 */}
        {phase === "pawnshop-1" && (
          <div key={textKey} className="max-w-2xl w-full text-center space-y-6 animate-fade-in">
            <div className="inline-block px-4 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-gold/30">
              <span className="font-display text-sm text-gold tracking-widest">전당포 주인</span>
            </div>
            <p className="font-display text-base md:text-xl text-foreground leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] bg-background/40 backdrop-blur-sm rounded-xl p-4">
              "오, 정말로 그 편지를 가져왔구먼…
              <br />
              약속한 대로, 자네에게 '반쪽 나침반'을 내어주겠네.
              <br />
              이 나침반은 자네의 인연이 있는 방향을 가리킬 것이야."
            </p>
            <div className="flex justify-center">
              <div className="text-6xl animate-float" style={{ filter: "drop-shadow(0 0 20px hsl(38 92% 60% / 0.7))" }}>
                🧭
              </div>
            </div>
            <Button
              variant="golden"
              size="lg"
              onClick={() => advance("pawnshop-2")}
            >
              나침반을 받는다
            </Button>
          </div>
        )}

        {/* 전당포 - 매칭으로 안내 */}
        {phase === "pawnshop-2" && (
          <div key={textKey} className="max-w-2xl w-full text-center space-y-6 animate-fade-in">
            <div className="inline-block px-4 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-gold/30">
              <span className="font-display text-sm text-gold tracking-widest">전당포 주인</span>
            </div>
            <p className="font-display text-base md:text-xl text-foreground leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] bg-background/40 backdrop-blur-sm rounded-xl p-4">
              "이제 운명의 다리로 향하시게.
              <br />
              자네의 반쪽을 가진 인연이 그곳에서 자네를 기다리고 있을 걸세."
            </p>
            <Button
              variant="golden"
              size="xl"
              onClick={() => navigate("/?match=1#match")}
              className="animate-pulse-glow"
            >
              🌙 운명의 다리로 향하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Finale;
