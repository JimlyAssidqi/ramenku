import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/ramen';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Receipt,
  Home
} from 'lucide-react';

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-24 h-24 rounded-full gradient-warm flex items-center justify-center mx-auto mb-6 shadow-warm animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Pesanan Dikonfirmasi!</h1>
            <p className="text-lg text-muted-foreground">
              Terima kasih atas pesanan Anda. Ramen lezat Anda sedang disiapkan.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-card rounded-2xl border border-border shadow-elevated p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Detail Pesanan</h2>
            </div>

            {/* Order ID */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">ID Pesanan</p>
              <p className="font-mono font-semibold text-foreground">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => {
                const toppingsPrice = item.selectedToppings.reduce((sum, t) => sum + t.price, 0);
                const itemTotal = (item.ramen.price + toppingsPrice) * item.quantity;

                return (
                  <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0">
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
                    <span className="font-semibold text-foreground">{formatRupiah(itemTotal)}</span>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="text-lg font-semibold text-foreground">Total Dibayar</span>
              <span className="text-2xl font-bold text-gradient-warm">
                {formatRupiah(order.totalPrice)}
              </span>
            </div>

            {/* Payment Method */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
              <p className="font-medium text-foreground">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Estimasi Pengiriman</h3>
                <p className="text-muted-foreground">Pesanan Anda akan tiba dalam 25-35 menit</p>
              </div>
            </div>
            <div className="flex items-start gap-4 mt-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Status Pesanan</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-muted-foreground">
                    {order.status === 'pending' ? 'Menunggu konfirmasi admin' : 
                     order.status === 'processing' ? 'Sedang diproses' : order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/history" className="flex-1">
              <Button variant="cream" size="lg" className="w-full">
                Lihat Riwayat Pesanan
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="warm" size="lg" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
