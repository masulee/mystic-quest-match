import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StarField } from "@/components/StarField";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import { gameLocations, personalityDescriptions, PersonalityTrait } from "@/lib/gameData";
import { traitEmoji } from "@/lib/mockPartners";
import { HalfItem } from "@/components/HalfItem";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const traitBarColors: Record<PersonalityTrait, string> = {
  감성: "bg-pink-500",
  지혜: "bg-blue-500",
  용기: "bg-orange-500",
  신비: "bg-purple-500",
};

const MyPage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { collectedItems, traitScores, matchedPartners, matchAttempts, resetGame } = useGame();

  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState(user?.nickname ?? "");

  if (!user) return null;

  const totalScores = Object.values(traitScores).reduce((a, b) => a + b, 0);
  const sortedTraits = (Object.entries(traitScores) as [PersonalityTrait, number][])
    .sort((a, b) => b[1] - a[1]);
  const dominant = sortedTraits[0]?.[1] > 0 ? sortedTraits[0][0] : null;
  const personality = dominant ? personalityDescriptions[dominant] : null;

  const legendaryCount = collectedItems.filter((i) => i.rarity === "legendary").length;
  const totalChoices = Object.values(traitScores).reduce((a, b) => a + b, 0);
  const exploredCount = new Set(collectedItems.map((i) => i.locationId)).size;

  const handleSaveNickname = () => {
    const t = nicknameDraft.trim();
    if (!t || t.length > 20) {
      toast.error("닉네임은 1~20자로 입력해주세요");
      return;
    }
    updateProfile({
      nickname: t,
      gender: user.gender ?? "other",
      age: user.age ?? 20,
    });
    setEditingNickname(false);
    toast.success("닉네임이 변경되었습니다");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const continueJourney = () => {
    if (collectedItems.length >= 5) navigate("/finale");
    else navigate("/explore");
  };

  const providerBadge =
    user.provider === "google" ? "🟦 Google" : "🟣 Instagram";

  return (
    <div className="min-h-screen bg-gradient-night relative overflow-hidden">
      <StarField />
      <Header />

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* 1) Profile header */}
        <section className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center bg-gradient-to-br from-gold/20 to-mystic-purple/20 text-3xl animate-pulse-glow">
                {user.avatar ?? "🌙"}
              </div>
              <span className="absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-background/90 border border-border/60">
                {providerBadge}
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {editingNickname ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nicknameDraft}
                      onChange={(e) => setNicknameDraft(e.target.value)}
                      maxLength={20}
                      className="h-8 w-40"
                    />
                    <Button size="sm" variant="golden" onClick={handleSaveNickname}>
                      저장
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingNickname(false)}>
                      취소
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-2xl text-foreground">
                      {user.nickname || user.name}
                    </h2>
                    <button
                      onClick={() => {
                        setNicknameDraft(user.nickname ?? "");
                        setEditingNickname(true);
                      }}
                      className="text-xs text-gold/70 hover:text-gold transition-colors"
                      aria-label="닉네임 수정"
                    >
                      ✏️ 수정
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.email}
                {user.gender && ` • ${user.gender === "male" ? "남성" : user.gender === "female" ? "여성" : "기타"}`}
                {user.age && ` • ${user.age}세`}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-mystic-purple/20 text-accent-foreground border border-mystic-purple/30">
                  🗺️ {exploredCount}개 장소 탐험 완료
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                  ✨ {collectedItems.length}개 아이템 수집
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="golden" size="sm" onClick={continueJourney}>
                여정 계속하기
              </Button>
              <Button variant="ethereal" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </div>
          </div>
        </section>

        {/* 2) Matched partners */}
        {matchedPartners.length > 0 && (
          <section className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8">
            <h3 className="font-display text-xl text-foreground mb-4">매칭된 인연</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {matchedPartners.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/chat?partner=${p.id}`)}
                  className="text-left bg-background/40 rounded-xl border border-border/50 p-4 space-y-3 transition-all hover:scale-[1.03] hover:border-gold"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mystic-purple/30 to-gold/20 flex items-center justify-center text-2xl border border-gold/30">
                      {p.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-base text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {traitEmoji[p.trait]} {p.trait} · {p.percentage}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>🌡 인연 온도</span>
                      <span className="text-gold">{p.temperature}%</span>
                    </div>
                    <Progress value={p.temperature} className="h-1.5" />
                  </div>

                  {p.lastMessage && (
                    <p className="text-xs text-foreground/70 truncate">"{p.lastMessage}"</p>
                  )}
                  <p className="text-[10px] text-muted-foreground/70">
                    {new Date(p.matchedAt).toLocaleDateString("ko-KR")}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3) Journey progress */}
        <section className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-foreground">여정 진행도</h3>
            <span className="text-xs text-muted-foreground">
              {exploredCount} / 5
            </span>
          </div>
          <Progress value={(exploredCount / 5) * 100} className="h-2 mb-6" />
          <ul className="space-y-2">
            {gameLocations.map((loc) => {
              const done = collectedItems.some((i) => i.locationId === loc.id);
              return (
                <li
                  key={loc.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg border",
                    done
                      ? "border-gold/40 bg-gold/5"
                      : "border-border/40 opacity-70"
                  )}
                >
                  <span className="text-xl">{loc.icon}</span>
                  <span className="flex-1 text-sm text-foreground/90">{loc.name}</span>
                  <span className={cn("text-xs", done ? "text-gold" : "text-muted-foreground")}>
                    {done ? "✓ 완료" : "미완료"}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 4) Personality */}
        {personality && (
          <section className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8 space-y-5">
            <h3 className="font-display text-xl text-foreground">성향 분석</h3>
            <div
              className={cn(
                "rounded-xl p-5 bg-gradient-to-br text-foreground",
                personality.color
              )}
            >
              <p className="font-display text-2xl">{personality.title}</p>
              <p className="text-sm text-foreground/90 mt-2 leading-relaxed">
                {personality.description}
              </p>
            </div>

            <div className="space-y-3">
              {(Object.keys(traitScores) as PersonalityTrait[]).map((trait) => {
                const pct = totalScores ? (traitScores[trait] / totalScores) * 100 : 0;
                return (
                  <div key={trait} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/80">
                        {traitEmoji[trait]} {trait}
                      </span>
                      <span className="text-muted-foreground">{Math.round(pct)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", traitBarColors[trait])}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5) Collected items */}
        {collectedItems.length > 0 && (
          <section className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8">
            <h3 className="font-display text-xl text-foreground mb-4">수집한 인연의 조각</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {collectedItems.map((item) => (
                <div key={item.locationId} className="flex justify-center">
                  <HalfItem
                    name={item.itemName}
                    icon={item.icon}
                    rarity={item.rarity}
                    description={item.description}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6) Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🗺️", label: "탐험한 장소", value: exploredCount },
            { icon: "✨", label: "수집한 조각", value: collectedItems.length },
            { icon: "🏆", label: "전설 아이템", value: legendaryCount },
            { icon: "📊", label: "총 선택 횟수", value: totalChoices },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-display text-2xl text-gradient-gold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        <div className="text-center pt-4">
          <button
            onClick={() => {
              resetGame();
              toast("여정이 초기화되었습니다");
            }}
            className="text-xs text-muted-foreground/50 hover:text-destructive transition-colors"
          >
            여정 초기화
          </button>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
