import { useEffect } from "react";
import { StarField } from "@/components/StarField";
import { JourneyPath } from "@/components/JourneyPath";
import { ItemCollection } from "@/components/ItemCollection";
import { MatchPreview } from "@/components/MatchPreview";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // Wait for layout
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-night relative overflow-hidden">
      <StarField />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-mystic-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
          {/* Logo/Brand */}
          <div className="animate-float">
            <span className="text-6xl">🌙</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-gradient-gold leading-tight">
            인연의 조각
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 max-w-xl mx-auto leading-relaxed">
            신비로운 여행 속에서 당신만의 반쪽 아이템을 찾아보세요.
            <br />
            운명의 인연이 나머지 반쪽을 가지고 기다리고 있습니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/intro">
              <Button variant="golden" size="xl">
                여행 시작하기
              </Button>
            </Link>
            <Button variant="ethereal" size="xl">
              인연 찾기
            </Button>
          </div>
          
          {/* Scroll indicator */}
          <div className="pt-12 animate-bounce">
            <span className="text-gold/60 text-sm">스크롤하여 더 알아보기</span>
            <div className="mt-2 mx-auto w-6 h-10 rounded-full border-2 border-gold/30 flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-gold rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="relative px-4 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            신비의 <span className="text-gradient-gold">여정</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            각 장소를 탐험하며 운명의 아이템을 수집하세요
          </p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8">
          <JourneyPath />
          
          <div className="mt-8 text-center">
            <Button variant="mystic" size="lg">
              🌙 달빛 호수 탐험하기
            </Button>
          </div>
        </div>
      </section>

      {/* Items Section */}
      <section className="relative px-4 py-20 max-w-6xl mx-auto">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8">
          <ItemCollection />
        </div>
      </section>

      {/* Match Section */}
      <section id="match" className="relative px-4 py-20 max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            발견된 <span className="text-gradient-gold">인연</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            같은 아이템의 반쪽을 가진 운명의 인연을 만나보세요
          </p>
        </div>
        
        <MatchPreview />
      </section>

      {/* Footer */}
      <footer className="relative px-4 py-12 text-center border-t border-border/30">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-2xl">🌙✨💫</div>
          <p className="text-sm text-muted-foreground">
            인연의 조각 - 신비로운 방식으로 진정한 인연을 찾다
          </p>
          <p className="text-xs text-muted-foreground/60">
            © 2024 인연의 조각. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
