import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { menuItems } from '@/data/menuData';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Topping } from '@/types/ramen';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Flame, 
  ShoppingBag,
  ChefHat
} from 'lucide-react';
import { Link } from 'react-router-dom';

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Order: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const ramen = menuItems.find((item) => item.id === id);

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  useEffect(() => {
    if (ramen && ramen.spiceLevels.length > 0) {
      setSpiceLevel(ramen.spiceLevels[0]);
    }
  }, [ramen]);

  if (!ramen) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Ramen tidak ditemukan</h1>
          <Link to="/">
            <Button variant="warm">Kembali ke Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleToppingToggle = (topping: Topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      }
      return [...prev, topping];
    });
  };

  const calculateTotal = () => {
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return (ramen.price + toppingsPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/order/${id}` } });
      return;
    }

    addToCart({
      ramen,
      quantity,
      spiceLevel,
      selectedToppings,
      specialNotes,
    });

    toast({
      title: 'Ditambahkan ke keranjang!',
      description: `${quantity}x ${ramen.name} telah ditambahkan ke keranjang Anda.`,
    });

    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Menu
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image */}
          <div className="animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={ramen.image}
                alt={ramen.name}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ramen-dark/40 via-transparent to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-background/90 backdrop-blur-sm text-foreground shadow-soft">
                  {ramen.category}
                </span>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">{ramen.name}</h1>
              <p className="text-lg text-muted-foreground">{ramen.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gradient-warm">
                  {formatRupiah(ramen.price)}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Jumlah</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Spice Level */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Flame className="w-4 h-4 text-primary" />
                Level Pedas
              </Label>
              <div className="flex flex-wrap gap-2">
                {ramen.spiceLevels.map((level) => (
                  <Button
                    key={level}
                    variant={spiceLevel === level ? 'warm' : 'cream'}
                    size="sm"
                    onClick={() => setSpiceLevel(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Toppings */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-primary" />
                Topping Tambahan
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {ramen.toppings.map((topping) => (
                  <div
                    key={topping.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedToppings.find((t) => t.id === topping.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleToppingToggle(topping)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={!!selectedToppings.find((t) => t.id === topping.id)}
                        onCheckedChange={() => handleToppingToggle(topping)}
                      />
                      <span className="font-medium">{topping.name}</span>
                    </div>
                    <span className="text-primary font-semibold">+{formatRupiah(topping.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-base font-semibold">
                Catatan Khusus (Opsional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Alergi atau permintaan khusus..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Total & Add to Cart */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-muted-foreground">Total</span>
                <span className="text-3xl font-bold text-gradient-warm">
                  {formatRupiah(calculateTotal())}
                </span>
              </div>
              <Button
                variant="warm"
                size="xl"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {isAuthenticated ? 'Lanjut ke Pembayaran' : 'Masuk untuk Pesan'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
