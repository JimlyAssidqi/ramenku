import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { 
  ArrowLeft, 
  Calendar, 
  Package, 
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck
} from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
  completed: { icon: Truck, color: 'text-green-600', bg: 'bg-green-100', label: 'Out for Delivery' },
  delivered: { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10', label: 'Delivered' },
};

const History: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { orders } = useCart();

  if (!isAuthenticated) {
    navigate('/auth', { state: { from: '/history' } });
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
          <p className="text-muted-foreground">View all your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8">
              When you place an order, it will appear here.
            </p>
            <Link to="/">
              <Button variant="warm">Start Ordering</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy • h:mm a')}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg}`}>
                      <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, itemIndex) => {
                        const toppingsPrice = item.selectedToppings.reduce((sum, t) => sum + t.price, 0);
                        const itemTotal = (item.ramen.price + toppingsPrice) * item.quantity;

                        return (
                          <div key={itemIndex} className="flex gap-4">
                            <img
                              src={item.ramen.image}
                              alt={item.ramen.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{item.ramen.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity}x • {item.spiceLevel}
                              </p>
                              {item.selectedToppings.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  + {item.selectedToppings.map((t) => t.name).join(', ')}
                                </p>
                              )}
                            </div>
                            <span className="font-semibold text-foreground">${itemTotal.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        Payment: {order.paymentMethod}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="text-xl font-bold text-gradient-warm">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
