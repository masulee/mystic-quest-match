import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarField } from "@/components/StarField";
import { useAuth, calcAge } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "consent" | "sns" | "profile";

const CONSENT_KEY = "privacy_consent_v1";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithOAuth, updateProfile, user, loading } = useAuth();
  const alreadyConsented =
    typeof window !== "undefined" && localStorage.getItem(CONSENT_KEY) === "true";

  const [step, setStep] = useState<Step>(
    user && !user.profileCompleted ? "profile" : alreadyConsented ? "sns" : "consent"
  );
  const [oauthLoading, setOauthLoading] = useState<"google" | "instagram" | null>(null);

  // 동의 항목
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const requiredOk = agreeAge && agreeTos && agreePrivacy;

  const from = (location.state as any)?.from?.pathname ?? "/";

  // OAuth 콜백 후 user 가 세팅되면 자동 라우팅
  useEffect(() => {
    if (loading || !user) return;
    if (user.profileCompleted) {
      navigate(from, { replace: true });
    } else {
      setStep("profile");
    }
  }, [user, loading, navigate, from]);

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
        JSON.stringify({ at: new Date().toISOString(), marketing: agreeMarketing })
      );
    } catch {}
    setStep("sns");
  };

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">(user?.gender ?? "");
  const [birthInput, setBirthInput] = useState<string>(
    user?.birthdate ? user.birthdate.replace(/-/g, "") : ""
  );

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

  const handleGoogleLogin = async () => {
    setOauthLoading("google");
    try {
      await loginWithOAuth("google");
      // 브라우저가 Google 로 리다이렉트 됨 → 콜백 후 listener 가 user 를 세팅
    } catch (e: any) {
      toast.error(e?.message ?? "Google 로그인에 실패했어요");
      setOauthLoading(null);
    }
  };

  const handleInstagramLogin = () => {
    toast.info("Instagram 로그인은 준비 중입니다. Google 로그인을 이용해주세요.");
  };

  const handleSubmitProfile = async () => {
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
    try {
      await updateProfile({
        nickname: trimmed,
        gender: gender as "male" | "female" | "other",
        birthdate: iso,
      });
      toast.success(`환영합니다, ${trimmed}님 ✨`);
      navigate(from, { replace: true });
    } catch (e: any) {
      toast.error(e?.message ?? "프로필 저장에 실패했어요");
    }
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
              ? "SNS로 간편하게 시작하세요"
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
                  <p>• 수집 항목: SNS 계정 정보(이름, 이메일, 프로필 이미지), 닉네임, 성별, 생년월일</p>
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
              <p className="text-center text-xs text-muted-foreground -mt-1">
                SNS 계정으로 간편하게 가입/로그인 할 수 있어요
              </p>

              <button
                onClick={handleGoogleLogin}
                disabled={oauthLoading !== null}
                className="w-full h-12 rounded-lg bg-white text-gray-800 font-medium flex items-center justify-center gap-3 hover:shadow-lg transition-all disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
                </svg>
                {oauthLoading === "google" ? "이동 중..." : "Google로 계속하기"}
              </button>

              <button
                onClick={handleInstagramLogin}
                disabled={oauthLoading !== null}
                className="w-full h-12 rounded-lg text-white font-medium flex items-center justify-center gap-3 hover:shadow-[0_0_24px_rgba(236,72,153,0.4)] transition-all disabled:opacity-60 relative"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #ec4899 55%, #f97316 100%)",
                }}
              >
                <span className="text-lg">📸</span>
                Instagram으로 계속하기
                <span className="absolute top-1 right-2 text-[9px] bg-black/30 px-1.5 py-0.5 rounded">
                  준비 중
                </span>
              </button>

              <p className="text-[10px] text-center text-muted-foreground/80 leading-relaxed">
                Google 인증 페이지로 이동 → 동의 → 자동으로 돌아옵니다.
                <br />
                다음 단계에서 닉네임 · 성별 · 생년월일을 입력해주세요.
              </p>

              <Button variant="ethereal" size="lg" className="w-full" onClick={() => navigate("/")}>
                👣 둘러보기
              </Button>
            </>
          ) : (
            <div className="space-y-5">
              <div className="text-center -mt-2">
                <p className="text-xs text-gold">
                  {user?.provider === "google" ? "Google" : "SNS"} 연결 완료 ✓
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  서비스 이용을 위해 추가 정보를 입력해주세요
                </p>
              </div>

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
                ✨ 가입 완료
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
