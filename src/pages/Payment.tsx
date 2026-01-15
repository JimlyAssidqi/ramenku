import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Banknote,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const paymentMethods = [
  { id: 'bank', name: 'Bank Transfer', icon: CreditCard, description: 'Direct bank transfer' },
  { id: 'ewallet', name: 'E-Wallet', icon: Wallet, description: 'GoPay, OVO, Dana' },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when delivered' },
];

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, getTotalPrice, clearCart, addOrder, removeFromCart } = useCart();
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAuthenticated) {
    navigate('/auth', { state: { from: '/payment' } });
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some delicious ramen to get started!</p>
          <Link to="/">
            <Button variant="warm">Browse Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast({
        title: 'Select payment method',
        description: 'Please select a payment method to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const order = {
      id: crypto.randomUUID(),
      items: cartItems,
      totalPrice: getTotalPrice(),
      paymentMethod: paymentMethods.find((m) => m.id === selectedPayment)?.name || '',
      status: 'processing' as const,
      createdAt: new Date(),
    };

    addOrder(order);
    clearCart();

    navigate('/success', { state: { order } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
              <p className="text-muted-foreground">Review your order and select a payment method</p>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>
              {cartItems.map((item, index) => {
                const toppingsPrice = item.selectedToppings.reduce((sum, t) => sum + t.price, 0);
                const itemTotal = (item.ramen.price + toppingsPrice) * item.quantity;

                return (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-card rounded-xl border border-border shadow-soft"
                  >
                    <img
                      src={item.ramen.image}
                      alt={item.ramen.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">{item.ramen.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} • {item.spiceLevel}
                          </p>
                          {item.selectedToppings.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              + {item.selectedToppings.map((t) => t.name).join(', ')}
                            </p>
                          )}
                          {item.specialNotes && (
                            <p className="text-sm text-primary mt-1">Note: {item.specialNotes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg text-gradient-warm">
                            ${itemTotal.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="block mt-2 text-sm text-destructive hover:underline"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Methods */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
              <div className="grid gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedPayment === method.id ? 'gradient-warm' : 'bg-muted'
                    }`}>
                      <method.icon className={`w-6 h-6 ${
                        selectedPayment === method.id ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    {selectedPayment === method.id && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Total */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card p-6 rounded-2xl border border-border shadow-elevated animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold text-foreground mb-4">Order Total</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-gradient-warm">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="warm"
                size="xl"
                className="w-full"
                onClick={handlePayment}
                disabled={isProcessing || !selectedPayment}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By placing this order, you agree to our terms of service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
