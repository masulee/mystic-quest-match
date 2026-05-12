import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarField } from "@/components/StarField";
import { useAuth, AuthProvider as Provider, calcAge } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "consent" | "sns" | "profile";

const CONSENT_KEY = "privacy_consent_v1";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signUpWithEmail, signInWithEmail, updateProfile, user } = useAuth();
  const alreadyConsented =
    typeof window !== "undefined" && localStorage.getItem(CONSENT_KEY) === "true";
  const [step, setStep] = useState<Step>(
    user && !user.profileCompleted ? "profile" : alreadyConsented ? "sns" : "consent"
  );
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  // 동의 항목
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const requiredOk = agreeAge && agreeTos && agreePrivacy;

  const toggleAll = (v: boolean) => {
    setAgreeAll(v);
    setAgreeAge(v);
    setAgreeTos(v);
    setAgreePrivacy(v);
    setAgreeMarketing(v);
  };

  const handleConsentNext = () => {
    if (!requiredOk) {
      toast.error("필수 항목에 모두 동의해주세요");
      return;
    }
    try {
      localStorage.setItem(CONSENT_KEY, "true");
      localStorage.setItem(
        "privacy_consent_meta",
        JSON.stringify({
          at: new Date().toISOString(),
          marketing: agreeMarketing,
        })
      );
    } catch {}
    setStep("sns");
  };

  const [emailMode, setEmailMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

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

  const handleEmailSubmit = async () => {
    const e = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(e)) {
      toast.error("올바른 이메일을 입력해주세요");
      return;
    }
    if (password.length < 6) {
      toast.error("비밀번호는 6자 이상이어야 해요");
      return;
    }
    setEmailLoading(true);
    try {
      if (emailMode === "signup") {
        const { needsConfirmation } = await signUpWithEmail(e, password);
        if (needsConfirmation) {
          toast.success("확인 메일을 보냈어요. 이메일 인증 후 로그인해주세요 ✉️");
          setEmailMode("signin");
        } else {
          toast.success("가입 완료! ✨");
          setStep("profile");
        }
      } else {
        const u = await signInWithEmail(e, password);
        if (u.profileCompleted) {
          navigate(from, { replace: true });
        } else {
          setStep("profile");
        }
      }
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        toast.error("이미 가입된 이메일이에요. 로그인 해주세요.");
        setEmailMode("signin");
      } else if (msg.includes("Invalid login")) {
        toast.error("이메일 또는 비밀번호가 올바르지 않아요");
      } else if (msg.includes("Email not confirmed")) {
        toast.error("이메일 인증이 필요해요. 메일함을 확인해주세요.");
      } else {
        toast.error(msg || "처리 중 오류가 발생했어요");
      }
    } finally {
      setEmailLoading(false);
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
            {step === "consent"
              ? "시작 전 약관에 동의해주세요"
              : step === "sns"
              ? "운명의 여정을 시작하세요"
              : "당신을 알려주세요"}
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-2xl p-6 md:p-8 space-y-5 animate-fade-in">
          {step === "consent" ? (
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gold/30 bg-gold/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAll}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="w-5 h-5 accent-amber-400"
                />
                <span className="text-sm font-medium text-gold">전체 동의</span>
              </label>

              <div className="space-y-2 text-sm">
                {[
                  { key: "age", label: "만 14세 이상입니다", required: true, checked: agreeAge, set: setAgreeAge },
                  { key: "tos", label: "서비스 이용약관 동의", required: true, checked: agreeTos, set: setAgreeTos },
                  { key: "privacy", label: "개인정보 수집·이용 동의", required: true, checked: agreePrivacy, set: setAgreePrivacy },
                  { key: "marketing", label: "마케팅 정보 수신 동의", required: false, checked: agreeMarketing, set: setAgreeMarketing },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-gold/40 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => {
                        item.set(e.target.checked);
                        setAgreeAll(false);
                      }}
                      className="w-5 h-5 mt-0.5 accent-amber-400"
                    />
                    <div className="flex-1 text-foreground/90">
                      <span className={item.required ? "text-gold mr-1" : "text-muted-foreground mr-1"}>
                        [{item.required ? "필수" : "선택"}]
                      </span>
                      {item.label}
                    </div>
                  </label>
                ))}
              </div>

              <details className="text-xs text-muted-foreground bg-background/40 rounded-lg p-3 border border-border/40">
                <summary className="cursor-pointer text-foreground/80">개인정보 수집·이용 안내 보기</summary>
                <div className="mt-2 space-y-1 leading-relaxed">
                  <p>• 수집 항목: 이메일, 닉네임, 성별, 생년월일, 프로필 이미지(선택)</p>
                  <p>• 이용 목적: 회원 식별, 매칭 서비스 제공, 채팅 기능 운영</p>
                  <p>• 보유 기간: 회원 탈퇴 시까지 (관련 법령에 따라 일정 기간 보관 가능)</p>
                  <p>• 동의를 거부할 수 있으나, 거부 시 서비스 이용이 제한됩니다.</p>
                </div>
              </details>

              <Button
                variant="golden"
                size="lg"
                className="w-full"
                onClick={handleConsentNext}
                disabled={!requiredOk}
              >
                동의하고 계속하기 ✨
              </Button>

              <Button variant="ethereal" size="lg" className="w-full" onClick={() => navigate("/")}>
                👣 둘러보기
              </Button>
            </div>
          ) : step === "sns" ? (
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
                  <span className="px-3 bg-card text-xs text-muted-foreground">또는 이메일로</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailMode("signup")}
                    className={cn(
                      "h-9 rounded-lg text-xs border transition-all",
                      emailMode === "signup"
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-border/60 text-foreground/70 hover:border-gold/50"
                    )}
                  >
                    회원가입
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailMode("signin")}
                    className={cn(
                      "h-9 rounded-lg text-xs border transition-all",
                      emailMode === "signin"
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-border/60 text-foreground/70 hover:border-gold/50"
                    )}
                  >
                    로그인
                  </button>
                </div>

                <Input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Input
                  type="password"
                  placeholder="비밀번호 (6자 이상)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={emailMode === "signup" ? "new-password" : "current-password"}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                />

                <Button
                  variant="golden"
                  size="lg"
                  className="w-full"
                  onClick={handleEmailSubmit}
                  disabled={emailLoading}
                >
                  {emailLoading
                    ? "처리 중..."
                    : emailMode === "signup"
                    ? "✉️ 이메일로 가입하기"
                    : "✨ 이메일로 로그인"}
                </Button>
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
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={8}
                  placeholder="YYYYMMDD (예: 19900315)"
                  value={birthInput}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 8);
                    setBirthInput(onlyDigits);
                  }}
                  className="tracking-widest"
                />
                <p className="text-[10px] text-muted-foreground flex justify-between">
                  <span>숫자 8자리로 입력해주세요</span>
                  {previewAge !== undefined && (
                    <span className="text-gold">만 {previewAge}세</span>
                  )}
                </p>
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
