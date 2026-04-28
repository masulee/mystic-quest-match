import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on login, chat, match-success per spec
  const hiddenPaths = ["/login", "/chat", "/match-success"];
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl group-hover:animate-pulse">🌙</span>
          <span className="font-display text-sm text-gradient-gold tracking-wider">
            인연의 조각
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Button
                variant="ethereal"
                size="sm"
                onClick={() => navigate("/login", { state: { mode: "signup" } })}
              >
                회원가입
              </Button>
              <Button
                variant="golden"
                size="sm"
                onClick={() => navigate("/login")}
              >
                로그인
              </Button>
            </>
          ) : (
            <button
              onClick={() => navigate("/mypage")}
              className="flex items-center gap-2 px-2 py-1 rounded-full bg-card/70 border border-gold/30 hover:border-gold hover:shadow-[0_0_16px_hsl(38_92%_60%/0.3)] transition-all"
            >
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/30 to-mystic-purple/30 flex items-center justify-center text-sm">
                {user?.avatar ?? "🌙"}
              </span>
              <span className="text-xs text-foreground/90 max-w-[90px] truncate">
                {user?.nickname || user?.name}
              </span>
              <span className="hidden sm:inline text-[10px] text-gold/70">마이페이지</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
