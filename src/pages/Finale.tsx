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
  // Wizard (magic ritual)
  | "summon" | "fade-out"
  | "wizard-1" | "wizard-2"
  | "ritual-rise" | "ritual-merge" | "white-out"
  | "narration" | "letter-reveal" | "wizard-3"
  // Pawnshop (9 steps)
  | "to-pawnshop" | "pawnshop-enter"
  | "pawnshop-greeting" | "letter-hand-over"
  | "letter-inspect" | "letter-accept"
  | "compass-reveal" | "compass-glow" | "compass-received"
  // Bridge (8 steps)
  | "to-bridge" | "bridge-arrival" | "bridge-atmosphere"
  | "compass-ready" | "compass-align-start"
  | "compass-align-glow" | "compass-resonate" | "compass-complete";

const AUTO_TIMERS: Partial<Record<Phase, number>> = {
  "summon": 2800,
  "fade-out": 1000,
  "ritual-rise": 2400,
  "ritual-merge": 1400,
  "white-out": 900,
  "narration": 3800,
  "letter-reveal": 2400,
  "to-pawnshop": 1500,
  "pawnshop-enter": 2000,
  "compass-glow": 2000,
  "to-bridge": 1500,
  "bridge-arrival": 2000,
  "compass-align-glow": 2500,
  "compass-resonate": 2000,
};

const NEXT_AFTER_AUTO: Partial<Record<Phase, Phase>> = {
  "summon": "fade-out",
  "fade-out": "wizard-1",
  "ritual-rise": "ritual-merge",
  "ritual-merge": "white-out",
  "white-out": "narration",
  "narration": "letter-reveal",
  "letter-reveal": "wizard-3",
  "to-pawnshop": "pawnshop-enter",
  "pawnshop-enter": "pawnshop-greeting",
  "compass-glow": "compass-received",
  "to-bridge": "bridge-arrival",
  "bridge-arrival": "bridge-atmosphere",
  "compass-align-glow": "compass-resonate",
  "compass-resonate": "compass-complete",
};

const Finale = () => {
  const navigate = useNavigate();
  const { collectedItems } = useGame();
  const [phase, setPhase] = useState<Phase>("summon");
  const [textKey, setTextKey] = useState(0);

  useEffect(() => {
    const ms = AUTO_TIMERS[phase];
    if (!ms) return;
    const t = setTimeout(() => {
      const nxt = NEXT_AFTER_AUTO[phase];
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

  // ===== Summon + fade =====
  if (phase === "summon" || phase === "fade-out") {
    return (
      <div className="min-h-screen bg-gradient-night relative overflow-hidden">
        <StarField />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-lg md:text-2xl text-gradient-gold max-w-xl mb-12 animate-fade-in drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
            인연의 조각 5개가 모두 모였습니다.
            <br />
            <span className="text-foreground/80 text-base md:text-xl">바람결에 마법사의 부름이 들려옵니다…</span>
          </p>
          <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gold/20 blur-2xl animate-pulse-glow" />
            </div>
            {collectedItems.slice(0, 5).map((item, i) => {
              const angle = (i * 72 - 90) * (Math.PI / 180);
              const x = Math.cos(angle) * 130;
              const y = Math.sin(angle) * 130;
              return (
                <div
                  key={item.locationId}
                  className="absolute top-1/2 left-1/2 text-4xl md:text-5xl transition-all duration-[2200ms] ease-in"
                  style={{
                    transform: phase === "fade-out"
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

  // ===== "To pawnshop" or "To bridge" transitions =====
  if (phase === "to-pawnshop") {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="text-5xl animate-pulse">✨</div>
          <p className="font-display text-lg text-gradient-gold tracking-widest">전당포로 향하는 중...</p>
        </div>
      </div>
    );
  }

  if (phase === "to-bridge") {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="text-5xl animate-pulse">🌉</div>
          <p className="font-display text-lg text-gradient-gold tracking-widest">운명의 다리로 향하는 중...</p>
        </div>
      </div>
    );
  }

  // ===== Bridge scenes =====
  const isBridgeScene = phase === "bridge-arrival" || phase === "bridge-atmosphere" ||
    phase === "compass-ready" || phase === "compass-align-start" ||
    phase === "compass-align-glow" || phase === "compass-resonate" ||
    phase === "compass-complete";

  if (isBridgeScene) {
    return (
      <div className="min-h-screen relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, hsl(260 50% 12%) 0%, hsl(280 60% 18%) 50%, hsl(220 60% 20%) 100%)" }}>
        <StarField />
        {/* Rainbow arc */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center bottom, transparent 40%, rgba(236,72,153,0.25) 60%, rgba(251,146,60,0.25) 70%, rgba(250,204,21,0.25) 80%, rgba(34,197,94,0.25) 90%, transparent 100%)",
          }}
        />

        <button onClick={() => navigate("/")} className="absolute top-6 right-6 z-40 text-xs text-foreground/50 hover:text-gold tracking-widest uppercase">Skip ›</button>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pb-16">
          {phase === "bridge-arrival" && (
            <div key={textKey} className="text-center space-y-6 animate-fade-in">
              <div className="text-6xl">🌈</div>
              <h2 className="font-display text-3xl md:text-5xl text-gradient-gold">인연의 다리</h2>
              <p className="text-foreground/80 text-sm md:text-base">신비로운 무지개 빛이 다리를 감싸고 있습니다</p>
            </div>
          )}

          {phase === "bridge-atmosphere" && (
            <div key={textKey} className="text-center space-y-6 animate-fade-in max-w-xl">
              <p className="font-display text-lg md:text-xl text-foreground leading-relaxed">
                다리 위에 서자 바람이 부드럽게 불어옵니다<br />
                이곳에서... 운명의 인연을 만나게 될 것입니다
              </p>
              <button onClick={() => advance("compass-ready")} className="text-xs text-gold/70 hover:text-gold tracking-[0.3em] uppercase animate-pulse">
                ▾ 계속하기 ▾
              </button>
            </div>
          )}

          {phase === "compass-ready" && (
            <div key={textKey} className="text-center space-y-6 animate-fade-in">
              <div className="text-7xl animate-float" style={{ filter: "drop-shadow(0 0 20px hsl(38 92% 60% / 0.7))" }}>🧭</div>
              <p className="font-display text-base md:text-lg text-foreground/90 max-w-md">
                나침반의 바늘이 조용히 떨리기 시작합니다
              </p>
              <Button variant="golden" size="lg" onClick={() => advance("compass-align-start")}>
                나침반을 들어올린다
              </Button>
            </div>
          )}

          {phase === "compass-align-start" && (
            <div key={textKey} className="text-center space-y-8 animate-fade-in">
              <div className="flex items-center justify-center gap-6 md:gap-12">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-6xl animate-pulse">🧭</span>
                  <span className="text-xs text-gold">당신</span>
                </div>
                <span className="text-2xl text-gold/70">↔</span>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-6xl animate-pulse" style={{ animationDelay: "0.5s" }}>🧲</span>
                  <span className="text-xs text-muted-foreground">???</span>
                </div>
              </div>
              <p className="font-display text-base md:text-lg text-foreground/90 max-w-md">
                저 멀리서... 또 다른 나침반의 기운이 느껴집니다
              </p>
              <Button variant="golden" size="lg" onClick={() => advance("compass-align-glow")}>
                나침반을 앞으로 내민다
              </Button>
            </div>
          )}

          {phase === "compass-align-glow" && (
            <div key={textKey} className="text-center space-y-8 animate-fade-in">
              <div className="relative flex items-center justify-center gap-6 md:gap-12">
                {/* Pulse rings */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border border-gold/30"
                    style={{
                      width: `${80 + i * 40}px`,
                      height: `${80 + i * 40}px`,
                      animation: `pulse-ring 2s ease-out infinite`,
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />
                ))}
                <span className="text-6xl animate-heartbeat" style={{ filter: "drop-shadow(0 0 20px hsl(38 92% 60% / 0.9))" }}>🧭</span>
                <span className="text-6xl animate-heartbeat" style={{ filter: "drop-shadow(0 0 20px hsl(280 60% 60% / 0.9))", animationDelay: "0.1s" }}>🧲</span>
              </div>
              <p className="font-display text-lg text-gold animate-pulse">두 나침반이 서로를 향해 빛나기 시작합니다!</p>
            </div>
          )}

          {phase === "compass-resonate" && (
            <div key={textKey} className="text-center space-y-6 animate-fade-in w-full max-w-md">
              <div className="flex items-center justify-center gap-2">
                <span className="text-6xl animate-pulse" style={{ filter: "drop-shadow(0 0 24px hsl(38 92% 60%))" }}>🧭</span>
                <span className="text-4xl text-gold animate-pulse">✦</span>
                <span className="text-6xl animate-pulse" style={{ filter: "drop-shadow(0 0 24px hsl(280 60% 60%))" }}>🧲</span>
              </div>
              <p className="font-display text-2xl md:text-3xl text-gradient-gold">공명!</p>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-gold via-mystic-purple to-gold animate-[loading_2s_ease-out_forwards]" />
              </div>
              <p className="text-sm text-foreground/80">두 나침반이 하나가 되려 합니다</p>
            </div>
          )}

          {phase === "compass-complete" && (
            <div key={textKey} className="text-center space-y-6 animate-fade-in max-w-xl">
              <div className="text-7xl animate-pulse-glow" style={{ filter: "drop-shadow(0 0 30px hsl(38 92% 60%))" }}>🧭</div>
              <h3 className="font-display text-2xl md:text-3xl text-gradient-gold">나침반이 완성되었습니다</h3>
              <p className="font-display text-base md:text-lg text-foreground/90 leading-relaxed">
                두 개의 반쪽이 하나가 되어<br />완전한 나침반이 되었습니다
              </p>
              <Button variant="golden" size="xl" onClick={() => navigate("/?match=1#match")} className="animate-pulse-glow">
                ✨ 인연을 만나러 가기
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== Pawnshop detailed scenes =====
  const isPawnshopScene = phase === "pawnshop-enter" ||
    phase === "pawnshop-greeting" || phase === "letter-hand-over" ||
    phase === "letter-inspect" || phase === "letter-accept" ||
    phase === "compass-reveal" || phase === "compass-glow" || phase === "compass-received";

  // ===== Wizard scenes =====
  const showWizardBg = phase === "wizard-1" || phase === "wizard-2" ||
    phase === "ritual-rise" || phase === "ritual-merge" ||
    phase === "letter-reveal" || phase === "wizard-3";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0">
        {showWizardBg && (
          <img src={wizardImg} alt="시간의 서재" className="w-full h-full object-cover animate-fade-in" width={1536} height={896} />
        )}
        {isPawnshopScene && (
          <img src={pawnshopImg} alt="전당포 내부" className="w-full h-full object-cover animate-fade-in" width={1536} height={896} loading="lazy" />
        )}
        {phase === "narration" && <div className="absolute inset-0 bg-gradient-night" />}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      <div className="absolute inset-0 opacity-30 pointer-events-none"><StarField /></div>

      {phase === "white-out" && (
        <div className="absolute inset-0 bg-foreground z-30 animate-fade-in pointer-events-none" />
      )}

      {/* Ritual magic circle */}
      {(phase === "ritual-rise" || phase === "ritual-merge") && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className={cn("absolute w-[300px] h-[300px] md:w-[420px] md:h-[420px] rounded-full border-2 border-gold/60 animate-pulse-glow")}
            style={{ boxShadow: "0 0 60px hsl(38 92% 60% / 0.6), inset 0 0 60px hsl(38 92% 60% / 0.3)" }} />
          <div className="absolute w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-full border border-gold/40"
            style={{ animation: "spin 8s linear infinite" }} />
          {collectedItems.slice(0, 5).map((item, i) => {
            const angle = (i * 72 - 90) * (Math.PI / 180);
            const x = Math.cos(angle) * 110;
            const y = Math.sin(angle) * 110;
            return (
              <div
                key={item.locationId}
                className={cn("absolute text-4xl md:text-5xl transition-all ease-out", phase === "ritual-merge" ? "duration-[1200ms]" : "duration-[2000ms]")}
                style={{
                  transform: phase === "ritual-merge" ? "translate(0, 0) scale(0)" : `translate(${x}px, ${y}px) scale(1)`,
                  opacity: phase === "ritual-merge" ? 0 : 1,
                  filter: "drop-shadow(0 0 16px hsl(38 92% 60% / 0.9))",
                  transitionDelay: `${i * 100}ms`,
                }}
              >{item.icon}</div>
            );
          })}
        </div>
      )}

      {/* Letter */}
      {(phase === "letter-reveal" || phase === "wizard-3" || phase === "letter-hand-over" || phase === "letter-inspect" || phase === "letter-accept") && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <img src={letterImg} alt="빛바랜 편지"
            className={cn("max-w-sm md:max-w-md w-full rounded-2xl",
              phase === "letter-hand-over" ? "animate-slide-in-left" : "animate-fade-in")}
            style={{ filter: "drop-shadow(0 0 40px hsl(38 92% 60% / 0.7))" }}
            width={1536} height={896} loading="lazy"
          />
        </div>
      )}

      {/* Compass reveal */}
      {(phase === "compass-reveal" || phase === "compass-glow" || phase === "compass-received") && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <span className={cn("text-7xl md:text-8xl", phase === "compass-glow" ? "animate-pulse-glow" : "animate-fade-in")}
            style={{ filter: "drop-shadow(0 0 30px hsl(38 92% 60% / 0.9))" }}>🧭</span>
        </div>
      )}

      <button onClick={() => navigate("/")} className="absolute top-6 right-6 z-40 text-xs text-foreground/50 hover:text-gold tracking-widest uppercase">Skip ›</button>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end px-6 pb-16 md:pb-24">
        {/* Wizard 1 */}
        {phase === "wizard-1" && (
          <Dialogue key={textKey} speaker="늙은 마법사">
            "오, 마침내 왔구나. 네가 걸어온 다섯 개의 문,
            <br />그 선택의 무게가 이 조각들에 고스란히 담겨 있군."
            <ContinueBtn onClick={() => advance("wizard-2")} />
          </Dialogue>
        )}

        {/* Wizard 2 + ritual start */}
        {phase === "wizard-2" && (
          <Dialogue key={textKey} speaker="늙은 마법사" compact>
            "이제 이 조각들을 하나로 엮어,<br />잊혀진 인연의 편지로 되살리마. 준비되었는가?"
            <div className="flex justify-center gap-3 md:gap-4 py-2">
              {collectedItems.slice(0, 5).map((item) => (
                <div key={item.locationId} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-card/70 backdrop-blur-sm border border-gold/40 flex items-center justify-center text-2xl glow-gold">
                  {item.icon}
                </div>
              ))}
            </div>
            <Button variant="golden" size="lg" onClick={() => advance("ritual-rise")} className="animate-pulse-glow">
              ✨ 조각을 마법진에 올려놓는다
            </Button>
          </Dialogue>
        )}

        {/* Narration */}
        {phase === "narration" && (
          <div key={textKey} className="max-w-2xl w-full text-center animate-fade-in absolute inset-0 flex items-center justify-center px-6">
            <p className="font-display text-lg md:text-2xl text-gradient-gold leading-relaxed italic drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
              "시간이 조각을 감싸고,<br />기억이 잉크가 되네…<br /><br />
              네 영혼이 고른 인연의 경로가<br />여기 피어난다."
            </p>
          </div>
        )}

        {/* Wizard 3 */}
        {phase === "wizard-3" && (
          <Dialogue key={textKey} speaker="늙은 마법사" compact>
            "이 편지는 네 선택이 빚어낸 지도이자, 운명의 열쇠다.<br />
            전당포 주인에게 가져가거라.<br />
            그가 너에게 '반쪽 나침반'을 건네줄 것이야."
            <Button variant="golden" size="lg" onClick={() => advance("to-pawnshop")}>
              🏚️ 전당포로 이동하기
            </Button>
          </Dialogue>
        )}

        {/* Pawnshop enter */}
        {phase === "pawnshop-enter" && (
          <div key={textKey} className="max-w-2xl w-full text-center space-y-4 animate-fade-in">
            <div className="text-5xl">🏪</div>
            <h2 className="font-display text-3xl text-gradient-gold">전당포</h2>
            <p className="text-sm text-foreground/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              낡은 나무 간판이 삐걱거리며 당신을 반깁니다...
            </p>
          </div>
        )}

        {/* Pawnshop greeting */}
        {phase === "pawnshop-greeting" && (
          <Dialogue key={textKey} speaker="전당포 주인" compact>
            <span className="text-4xl block mb-3">👴</span>
            "돌아왔구나. 그 눈빛을 보니... 해냈나 보군."
            <Button variant="golden" size="lg" onClick={() => advance("letter-hand-over")}>
              빛바랜 편지를 꺼낸다
            </Button>
          </Dialogue>
        )}

        {/* Letter hand over */}
        {phase === "letter-hand-over" && (
          <Dialogue key={textKey} speaker="나">
            <span className="text-4xl block mb-3">📜</span>
            당신은 조심스럽게 빛바랜 편지를 건넵니다...
            <ContinueBtn onClick={() => advance("letter-inspect")} />
          </Dialogue>
        )}

        {/* Letter inspect */}
        {phase === "letter-inspect" && (
          <Dialogue key={textKey} speaker="전당포 주인" compact>
            "노인은 떨리는 손으로 편지를 펼쳐봅니다"<br /><br />
            "이 필체... 이 기운... 오래된 친구의 것이 맞군..."
            <ContinueBtn onClick={() => advance("letter-accept")} />
          </Dialogue>
        )}

        {/* Letter accept */}
        {phase === "letter-accept" && (
          <Dialogue key={textKey} speaker="전당포 주인" compact>
            "자네는 정말로 해냈어"<br />
            "약속한 대로, 이것을 주지."
            <Button variant="golden" size="lg" onClick={() => advance("compass-reveal")}>
              서랍에서 무언가 꺼내는 것을 본다
            </Button>
          </Dialogue>
        )}

        {/* Compass reveal */}
        {phase === "compass-reveal" && (
          <Dialogue key={textKey} speaker="전당포 주인" compact>
            "먼지 속에서 빛나는 반쪽 나침반..."
            <Button variant="golden" size="lg" onClick={() => advance("compass-glow")}>
              나침반을 받는다
            </Button>
          </Dialogue>
        )}

        {/* Compass glow (auto) */}
        {phase === "compass-glow" && (
          <div key={textKey} className="max-w-2xl w-full text-center space-y-4 animate-fade-in">
            <p className="font-display text-base md:text-lg text-gold bg-background/40 backdrop-blur-sm rounded-xl p-4">
              나침반이 당신의 손에 닿자 신비로운 빛을 발합니다
            </p>
          </div>
        )}

        {/* Compass received */}
        {phase === "compass-received" && (
          <Dialogue key={textKey} speaker="전당포 주인" compact>
            <h3 className="font-display text-xl text-gradient-gold mb-2">반쪽 나침반을 얻었습니다</h3>
            "이 나침반은 단순한 도구가 아니야...<br />
            자네의 인연이 있는 방향을 가리킬 것이지."
            <Button variant="golden" size="lg" onClick={() => advance("to-bridge")} className="animate-pulse-glow">
              🌉 운명의 다리로
            </Button>
          </Dialogue>
        )}
      </div>
    </div>
  );
};

// Helper components
const Dialogue: React.FC<{ speaker: string; children: React.ReactNode; compact?: boolean }> = ({ speaker, children, compact }) => (
  <div className="max-w-2xl w-full text-center space-y-6 animate-fade-in">
    <div className="inline-block px-4 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-gold/30">
      <span className="font-display text-sm text-gold tracking-widest">{speaker}</span>
    </div>
    <div className={cn(
      "font-display leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] space-y-4",
      compact ? "text-base md:text-xl text-foreground bg-background/40 backdrop-blur-sm rounded-xl p-4"
              : "text-xl md:text-2xl text-foreground"
    )}>
      {children}
    </div>
  </div>
);

const ContinueBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="text-xs text-gold/70 hover:text-gold transition-colors tracking-[0.3em] uppercase animate-pulse">
    ▾ 계속하기 ▾
  </button>
);

export default Finale;
