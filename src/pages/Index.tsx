import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import RamenCard from '@/components/RamenCard';
import { menuItems, categories } from '@/data/menuData';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      {/* Menu Section */}
      <section id="menu" className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              <span className="text-foreground">Explore Our </span>
              <span className="text-gradient-warm">Menu</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each bowl is crafted with care, using traditional recipes and the freshest ingredients
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'warm' : 'cream'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RamenCard ramen={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gradient-warm">Ramen House</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Authentic Japanese Ramen, Delivered Fresh
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Ramen House. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
