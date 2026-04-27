import { useState, useEffect } from "react";
import { HalfItem } from "./HalfItem";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface MatchProfile {
  id: number;
  silhouette: boolean;
  matchedItem: {
    name: string;
    icon: string;
    rarity: "common" | "rare" | "legendary";
  };
  compatibility: number;
}

const potentialMatches: MatchProfile[] = [
  {
    id: 1,
    silhouette: true,
    matchedItem: { name: "반쪽 나침반", icon: "🧭", rarity: "legendary" },
    compatibility: 87,
  },
];

const mysteryHints = [
  "전당포 주인이 건넨 나침반의 바늘이 천천히 떨리기 시작합니다...",
  "어딘가에서 또 다른 반쪽 나침반이 같은 방향을 가리키고 있어요...",
  "두 나침반의 자기장이 서로를 감지하고 있습니다...",
  "바늘이 한 방향으로 강하게 끌리고 있습니다...",
  "반쪽 나침반의 온기가 손끝으로 전해집니다...",
];

const partnerTraits = [
  { label: "성향", value: "???", icon: "🌊" },
  { label: "여행한 곳", value: "알 수 없음", icon: "🗺️" },
  { label: "획득 아이템", value: "■■■■", icon: "🔒" },
];

type Phase = "preview" | "sensing" | "approaching" | "resonating" | "breaking" | "failed";

export const MatchPreview = () => {
  const [phase, setPhase] = useState<Phase>("preview");
  const [hintIndex, setHintIndex] = useState(0);
  const [heartbeat, setHeartbeat] = useState(1);
  const [revealProgress, setRevealProgress] = useState(0);

  const handleCheckMatch = () => {
    setPhase("sensing");
    setHintIndex(0);
    setHeartbeat(1);
    setRevealProgress(0);
  };

  useEffect(() => {
    if (phase === "sensing") {
      const hintTimer = setInterval(() => {
        setHintIndex((i) => {
          if (i >= mysteryHints.length - 1) {
            clearInterval(hintTimer);
            setTimeout(() => setPhase("approaching"), 800);
            return i;
          }
          return i + 1;
        });
      }, 1800);
      return () => clearInterval(hintTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "approaching") {
      const beatTimer = setInterval(() => {
        setHeartbeat((b) => Math.min(b + 0.15, 3));
      }, 300);
      const progressTimer = setInterval(() => {
        setRevealProgress((p) => {
          if (p >= 100) {
            clearInterval(progressTimer);
            clearInterval(beatTimer);
            setTimeout(() => setPhase("resonating"), 500);
            return 100;
          }
          return p + 2;
        });
      }, 80);
      return () => { clearInterval(beatTimer); clearInterval(progressTimer); };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "resonating") {
      setTimeout(() => setPhase("breaking"), 3000);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "breaking") {
      setTimeout(() => setPhase("failed"), 2000);
    }
  }, [phase]);

  const handleRetry = () => setPhase("preview");

  // ── Failed ending ──
  if (phase === "failed") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-destructive/30 bg-gradient-to-br from-card to-destructive/10 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--destructive)/0.1),transparent_70%)]" />
        <div className="relative text-center space-y-6 animate-in fade-in duration-700">
          <div className="relative h-24 flex items-center justify-center gap-4">
            <span className="text-5xl opacity-80 inline-block rotate-[-15deg] translate-y-[5px]">💔</span>
            <span className="text-3xl opacity-60 inline-block rotate-[25deg] translate-y-[-10px]">✨</span>
            <span className="text-2xl opacity-40 inline-block rotate-[45deg] translate-y-[15px]">🔮</span>
          </div>
          <div className="space-y-3">
            <h3 className="font-display text-2xl text-foreground">조각이 맞지 않습니다...</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
              가까이 다가갔지만, 이 인연은 당신의 반쪽이 아니었어요.<br />
              조각이 부서져 별가루로 흩어졌습니다.
            </p>
          </div>
          <div className="py-4">
            <div className="mx-auto w-48 h-px bg-gradient-to-r from-transparent via-destructive/50 to-transparent" />
          </div>
          <p className="text-foreground/70 text-sm font-display">다시 여행을 떠나 새로운 조각을 모아보세요</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/explore">
              <Button variant="golden" size="lg">🌙 다시 여행 떠나기</Button>
            </Link>
            <Button variant="ethereal" size="lg" onClick={handleRetry}>돌아가기</Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Breaking animation ──
  if (phase === "breaking") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-destructive/40 bg-gradient-to-br from-card to-destructive/10 p-8">
        <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_50%,hsl(var(--destructive)/0.15),transparent_60%)]" />
        <div className="relative text-center space-y-6">
          <div className="relative h-32 flex items-center justify-center">
            <div className="animate-crack-left">
              <HalfItem name="별의 조각" icon="⭐" rarity="rare" isLeft={true} />
            </div>
            <div className="mx-4 text-3xl animate-pulse text-destructive">💥</div>
            <div className="animate-crack-right">
              <HalfItem name="???" icon="❓" rarity="rare" isLeft={false} className="opacity-50" />
            </div>
          </div>
          <p className="font-display text-lg text-destructive/80 animate-pulse">조각이 서로를 거부하고 있습니다...</p>
          {/* Shard particles */}
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="inline-block text-xs opacity-0 animate-shard"
                style={{ animationDelay: `${i * 0.2}s` }}
              >✦</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Resonating — two pieces almost touch ──
  if (phase === "resonating") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gold/50 bg-gradient-to-br from-card to-deep-purple/30 p-8">
        <div className="absolute inset-0 animate-pulse-glow bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.2),transparent_60%)]" />
        <div className="relative text-center space-y-6">
          <p className="text-xs text-gold/70 font-display tracking-widest uppercase animate-in fade-in duration-500">운명의 순간</p>
          <div className="relative h-36 flex items-center justify-center">
            <div className="animate-slide-in-left">
              <HalfItem name="별의 조각" icon="⭐" rarity="rare" isLeft={true} />
            </div>
            <div className="mx-2 flex flex-col items-center gap-1">
              <span className="text-2xl animate-heartbeat-fast">💓</span>
              <div className="w-8 h-0.5 bg-gradient-to-r from-gold to-mystic-purple animate-pulse" />
            </div>
            <div className="animate-slide-in-right">
              <div className="relative">
                <HalfItem name="???" icon="❓" rarity="rare" isLeft={false} className="opacity-70" />
                <div className="absolute inset-0 backdrop-blur-[2px] rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
          <p className="font-display text-lg text-gold animate-pulse">조각을 맞추는 중...</p>
          <p className="text-muted-foreground text-xs">두 조각이 서로에게 끌리고 있습니다</p>
        </div>
      </div>
    );
  }

  // ── Approaching — heartbeat + progress reveal ──
  if (phase === "approaching") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-card to-deep-purple/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
        <div className="relative space-y-6">
          <div className="text-center">
            <span
              className="text-4xl inline-block"
              style={{ animation: `heartbeat ${1.2 / heartbeat}s ease-in-out infinite` }}
            >💓</span>
          </div>
          <p className="text-center font-display text-gold text-sm tracking-wider">상대의 조각에 다가가는 중...</p>

          {/* Mystery profile reveal */}
          <div className="bg-background/30 rounded-xl border border-border/30 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mystic-purple/40 to-gold/20 flex items-center justify-center border border-gold/20">
                <span className="text-lg" style={{ filter: revealProgress < 90 ? `blur(${4 - revealProgress * 0.04}px)` : "none" }}>👤</span>
              </div>
              <div>
                <p className="text-sm text-foreground font-display">
                  {revealProgress < 30 ? "??? ???" : revealProgress < 70 ? "??? 님" : "알 수 없는 인연"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {revealProgress < 50 ? "정보를 읽는 중..." : "일부 정보 감지됨"}
                </p>
              </div>
            </div>

            {partnerTraits.map((trait, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{trait.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{trait.label}</p>
                  <p className="text-sm text-foreground/70 font-mono tracking-wider">
                    {revealProgress > (i + 1) * 25 ? trait.value : "■".repeat(4 + i)}
                  </p>
                </div>
                {revealProgress > (i + 1) * 25 && (
                  <span className="text-xs text-gold animate-in fade-in duration-300">감지됨</span>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>조각 공명도</span>
              <span className="text-gold">{revealProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold via-mystic-purple to-gold transition-all duration-200"
                style={{ width: `${revealProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Sensing — mystery hints ──
  if (phase === "sensing") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-mystic-purple/40 bg-gradient-to-br from-card to-deep-purple/30 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(280_60%_45%/0.15),transparent_60%)]" />
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xs text-gold/30 animate-float"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.3}s`,
              }}
            >✦</span>
          ))}
        </div>

        <div className="relative text-center space-y-8">
          <div className="animate-spin-slow">
            <span className="text-5xl">🔮</span>
          </div>

          <div className="min-h-[60px] flex items-center justify-center">
            <p
              key={hintIndex}
              className="font-display text-base text-foreground/90 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-xs"
            >
              {mysteryHints[hintIndex]}
            </p>
          </div>

          {/* Pulse rings */}
          <div className="relative h-16 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-gold/20"
                style={{
                  width: `${40 + i * 30}px`,
                  height: `${40 + i * 30}px`,
                  animation: `pulse-ring 2s ease-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
            <span className="text-xl text-gold/60">💫</span>
          </div>

          <p className="text-xs text-muted-foreground/60">조각의 공명을 탐지하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // ── Default preview ──
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-card to-deep-purple/20 p-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-mystic-purple/20 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">✨</span>
          <h3 className="font-display text-xl text-foreground">운명의 인연</h3>
        </div>
        
        {potentialMatches.length > 0 ? (
          <div className="space-y-6">
            {potentialMatches.map((match) => (
              <div key={match.id} className="flex items-center gap-6">
                <HalfItem name={match.matchedItem.name} icon={match.matchedItem.icon} rarity={match.matchedItem.rarity} isLeft={true} />
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-mystic-purple" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl animate-pulse">💫</div>
                  </div>
                </div>
                <div className="relative">
                  <HalfItem name="???" icon="❓" rarity={match.matchedItem.rarity} isLeft={false} className="opacity-50" />
                  <div className="absolute inset-0 backdrop-blur-sm rounded-xl" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display text-gold">{match.compatibility}%</div>
                  <div className="text-xs text-muted-foreground">운명 호환</div>
                </div>
              </div>
            ))}
            <Button variant="golden" className="w-full" onClick={handleCheckMatch}>
              인연 확인하기
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔮</div>
            <p className="text-muted-foreground">
              아직 매칭된 인연이 없습니다.<br />
              여행을 계속하며 반쪽 아이템을 모아보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
