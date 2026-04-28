import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StarField } from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { getPartnerForTrait, traitEmoji } from "@/lib/mockPartners";
import { PersonalityTrait } from "@/lib/gameData";

const MatchSuccess = () => {
  const navigate = useNavigate();
  const { traitScores, addMatchedPartner, matchedPartners } = useGame();

  // Determine dominant trait to pick partner
  const dominant: PersonalityTrait = useMemo(() => {
    const entries = Object.entries(traitScores) as [PersonalityTrait, number][];
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[1] > 0 ? sorted[0][0] : "신비";
  }, [traitScores]);

  const partner = useMemo(() => getPartnerForTrait(dominant), [dominant]);

  useEffect(() => {
    if (!matchedPartners.some((p) => p.id === partner.id)) {
      addMatchedPartner({
        id: partner.id,
        name: partner.name,
        avatar: partner.avatar,
        trait: partner.trait,
        percentage: partner.percentage,
        matchedAt: new Date().toISOString(),
        temperature: 20,
      });
    }
  }, [partner, addMatchedPartner, matchedPartners]);

  return (
    <div className="min-h-screen bg-gradient-night relative overflow-hidden">
      <StarField />
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold/70 mb-4 animate-fade-in">
          ✦ Fate Connected ✦
        </p>
        <h1 className="font-display text-3xl md:text-5xl text-gradient-gold mb-10 animate-fade-in">
          인연이 완성되었습니다
        </h1>

        <div className="relative animate-float">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-mystic-purple to-gold/50 p-1">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-5xl">
              {partner.avatar}
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 text-[10px] px-2 py-0.5 rounded-full bg-gold text-primary-foreground font-display tracking-widest">
            운명
          </span>
        </div>

        <h2 className="font-display text-3xl text-foreground mt-6 mb-2">{partner.name}</h2>
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8">
          {traitEmoji[partner.trait]} {partner.trait} · {partner.percentage}%
        </span>

        <p className="font-display text-lg text-foreground/90 mb-8 max-w-md">
          "서로의 나침반이 하나 되었습니다"
        </p>

        <div className="max-w-md w-full bg-gradient-to-br from-mystic-purple/20 to-gold/10 border border-gold/30 rounded-2xl p-5 mb-8 animate-fade-in">
          <p className="text-xs text-gold/80 tracking-widest mb-2">성향 매치</p>
          <p className="text-sm text-foreground/90">
            당신의 <span className="text-gold">{dominant}</span> 기운이{" "}
            <span className="text-gold">{partner.name}</span>의 {partner.trait}과 공명하고 있어요.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            variant="golden"
            size="xl"
            onClick={() => navigate(`/chat?partner=${partner.id}`)}
            className="animate-pulse-glow"
          >
            💫 연결하기
          </Button>
          <button
            onClick={() => navigate("/mypage")}
            className="text-xs text-muted-foreground hover:text-gold transition-colors"
          >
            잠시 후에 다시 보기
          </button>
        </div>
      </main>
    </div>
  );
};

export default MatchSuccess;
