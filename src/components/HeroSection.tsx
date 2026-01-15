import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Soup, Star } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-ramen-cream/50" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-medium text-primary">Ramen Jepang Autentik</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">Rasakan</span>
                <br />
                <span className="text-gradient-warm">Tradisi</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Nikmati ramen buatan tangan dengan kuah kaya yang mendidih dan bahan-bahan premium. 
                Dibuat segar setiap hari, diantar ke rumah Anda.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="warm" 
                size="xl"
                onClick={scrollToMenu}
                className="group"
              >
                <Soup className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Lihat Menu
              </Button>
              <Button 
                variant="outline" 
                size="xl"
              >
                Cerita Kami
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-warm">15+</div>
                <div className="text-sm text-muted-foreground">Variasi Ramen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-warm">4.9</div>
                <div className="text-sm text-muted-foreground">Rating Pelanggan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-warm">30mnt</div>
                <div className="text-sm text-muted-foreground">Rata-rata Pengiriman</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full gradient-warm opacity-20 blur-3xl scale-110" />
              
              {/* Main Image Container */}
              <div className="relative rounded-full overflow-hidden border-4 border-ramen-cream shadow-elevated animate-float">
                <img
                  src="/hero-ramen.jpg"
                  alt="Semangkuk Ramen Lezat"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-card shadow-soft animate-slide-in">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
                    <Star className="w-4 h-4 text-ramen-dark fill-ramen-dark" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Terlaris</div>
                    <div className="text-xs text-muted-foreground">Tonkotsu</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-card shadow-soft animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-card" />
                    ))}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold">2.5rb+</span>
                    <span className="text-muted-foreground"> pelanggan puas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <span className="text-sm">Scroll untuk eksplorasi</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;
