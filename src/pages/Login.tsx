import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarField } from "@/components/StarField";
import { useAuth, AuthProvider as Provider, calcAge } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "sns" | "profile";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, updateProfile, user } = useAuth();
  const [step, setStep] = useState<Step>(user && !user.profileCompleted ? "profile" : "sns");
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">(user?.gender ?? "");
  const [birthInput, setBirthInput] = useState<string>(
    user?.birthdate ? user.birthdate.replace(/-/g, "") : ""
  );

  const from = (location.state as any)?.from?.pathname ?? "/";

  // Convert YYYYMMDD digits → YYYY-MM-DD; returns null if invalid
  const parseBirth = (digits: string): string | null => {
    if (!/^\d{8}$/.test(digits)) return null;
    const y = Number(digits.slice(0, 4));
    const m = Number(digits.slice(4, 6));
    const d = Number(digits.slice(6, 8));
    const nowY = new Date().getFullYear();
    if (y < 1900 || y > nowY) return null;
    if (m < 1 || m > 12) return null;
    if (d < 1 || d > 31) return null;
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
    if (dt > new Date()) return null;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  };

  const previewAge = (() => {
    const iso = parseBirth(birthInput);
    return iso ? calcAge(iso) : undefined;
  })();

  const handleSnsLogin = async (provider: Provider) => {
    setLoadingProvider(provider);
    try {
      await login(provider);
      setStep("profile");
    } catch {
      toast.error("로그인에 실패했어요. 다시 시도해주세요.");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleSubmitProfile = () => {
    const trimmed = nickname.trim();
    if (!trimmed || trimmed.length > 20) {
      toast.error("닉네임은 1~20자로 입력해주세요");
      return;
    }
    if (!gender) {
      toast.error("성별을 선택해주세요");
      return;
    }
    const iso = parseBirth(birthInput);
    const n = iso ? calcAge(iso) : undefined;
    if (!iso || n === undefined || n < 1 || n > 150) {
      toast.error("올바른 생년월일 8자리를 입력해주세요 (YYYYMMDD)");
      return;
    }
    updateProfile({
      nickname: trimmed,
      gender: gender as "male" | "female" | "other",
      birthdate: iso,
    });
    toast.success(`환영합니다, ${trimmed}님 ✨`);
    navigate(from, { replace: true });
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4"
      style={{ background: "var(--gradient-night)" }}
    >
      <StarField />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-5xl mb-3">🌙</div>
          <h1 className="font-display text-3xl text-gradient-gold">인연의 조각</h1>
          <p className="text-xs text-muted-foreground mt-2 tracking-widest">
            {step === "sns" ? "운명의 여정을 시작하세요" : "당신을 알려주세요"}
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-2xl p-6 md:p-8 space-y-5 animate-fade-in">
          {step === "sns" ? (
            <>
              <button
                onClick={() => handleSnsLogin("google")}
                disabled={loadingProvider !== null}
                className="w-full h-12 rounded-lg bg-white text-gray-800 font-medium flex items-center justify-center gap-3 hover:shadow-lg transition-all disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
                </svg>
                {loadingProvider === "google" ? "연결 중..." : "Google로 계속하기"}
              </button>

              <button
                onClick={() => handleSnsLogin("instagram")}
                disabled={loadingProvider !== null}
                className="w-full h-12 rounded-lg text-white font-medium flex items-center justify-center gap-3 hover:shadow-[0_0_24px_rgba(236,72,153,0.4)] transition-all disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #ec4899 55%, #f97316 100%)",
                }}
              >
                <span className="text-lg">📸</span>
                {loadingProvider === "instagram" ? "연결 중..." : "Instagram으로 계속하기"}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-border/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-card text-xs text-muted-foreground">또는</span>
                </div>
              </div>

              <Button
                variant="ethereal"
                size="lg"
                className="w-full"
                onClick={() => navigate("/")}
              >
                👣 둘러보기
              </Button>
            </>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-foreground/80">닉네임</label>
                <Input
                  placeholder="예: 달빛여행자"
                  maxLength={20}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">{nickname.length}/20</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-foreground/80">성별</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "male", label: "남성" },
                    { key: "female", label: "여성" },
                    { key: "other", label: "기타" },
                  ].map((g) => (
                    <button
                      key={g.key}
                      onClick={() => setGender(g.key as any)}
                      className={cn(
                        "h-10 rounded-lg border text-sm transition-all",
                        gender === g.key
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-border/60 text-foreground/80 hover:border-gold/50"
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-foreground/80">생년월일</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !birthdate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthdate ? (
                        <>
                          {format(birthdate, "yyyy년 M월 d일", { locale: ko })}
                          <span className="ml-auto text-xs text-gold">
                            만 {calcAge(format(birthdate, "yyyy-MM-dd"))}세
                          </span>
                        </>
                      ) : (
                        <span>생년월일을 선택하세요</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthdate}
                      onSelect={setBirthdate}
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      defaultMonth={birthdate ?? new Date(2000, 0)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button variant="golden" size="lg" className="w-full" onClick={handleSubmitProfile}>
                ✨ 완료
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
