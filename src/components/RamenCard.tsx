import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RamenItem } from '@/types/ramen';
import { ShoppingCart, Flame } from 'lucide-react';

interface RamenCardProps {
  ramen: RamenItem;
}

const RamenCard: React.FC<RamenCardProps> = ({ ramen }) => {
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate(`/order/${ramen.id}`);
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={ramen.image}
          alt={ramen.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ramen-dark/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-background/90 backdrop-blur-sm text-foreground shadow-soft">
            {ramen.category}
          </span>
        </div>

        {/* Spice Indicator */}
        {ramen.category === 'Specialty' && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-ramen-red/90 backdrop-blur-sm">
            <Flame className="w-3 h-3 text-primary-foreground" />
            <span className="text-xs font-medium text-primary-foreground">Spicy</span>
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 rounded-lg text-lg font-bold gradient-warm text-primary-foreground shadow-warm">
            ${ramen.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {ramen.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {ramen.description}
        </p>

        {/* Toppings Preview */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {ramen.toppings.slice(0, 3).map((topping) => (
            <span
              key={topping.id}
              className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
            >
              +{topping.name}
            </span>
          ))}
          {ramen.toppings.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
              +{ramen.toppings.length - 3} more
            </span>
          )}
        </div>

        <Button 
          variant="warm" 
          size="lg" 
          className="w-full"
          onClick={handleOrder}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Order Now
        </Button>
      </div>
    </div>
  );
};

export default RamenCard;
