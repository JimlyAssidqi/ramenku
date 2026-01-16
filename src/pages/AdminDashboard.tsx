import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types/ramen';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  XCircle,
  ChefHat,
  ShoppingBag,
  Users,
  TrendingUp
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const statusConfig = {
  pending: { label: 'Menunggu Konfirmasi', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Dikonfirmasi', color: 'bg-blue-500', icon: CheckCircle },
  processing: { label: 'Diproses', color: 'bg-purple-500', icon: ChefHat },
  completed: { label: 'Selesai', color: 'bg-green-500', icon: Package },
  delivered: { label: 'Dikirim', color: 'bg-emerald-500', icon: Truck },
};

const AdminDashboard: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/auth');
      return;
    }
    loadOrders();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadOrders = () => {
    const allOrders: Order[] = [];
    const users = JSON.parse(localStorage.getItem('ramen-registered-users') || '[]');
    
    users.forEach((user: { id: string }) => {
      const userOrders = localStorage.getItem(`ramen-orders-${user.id}`);
      if (userOrders) {
        const parsed = JSON.parse(userOrders);
        allOrders.push(...parsed);
      }
    });
    
    // Sort by date, newest first
    allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(allOrders);
  };

  const updateOrderStatus = (orderId: string, userId: string, newStatus: Order['status']) => {
    const userOrdersKey = `ramen-orders-${userId}`;
    const userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
    
    const updatedOrders = userOrders.map((order: Order) => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
    loadOrders();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length,
    completed: orders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
    revenue: orders.filter(o => o.status !== 'pending').reduce((sum, o) => sum + o.totalPrice, 0),
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-warm mb-2">Dashboard Admin</h1>
          <p className="text-muted-foreground">Kelola pesanan pelanggan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pesanan</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Menunggu</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <ChefHat className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diproses</p>
                <p className="text-2xl font-bold">{stats.processing}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendapatan</p>
                <p className="text-lg font-bold">{formatPrice(stats.revenue)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'processing', 'completed', 'delivered'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'warm' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'Semua' : statusConfig[status as keyof typeof statusConfig]?.label}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tidak ada pesanan</p>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status]?.icon || Clock;
              return (
                <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={`${statusConfig[order.status]?.color} text-white`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[order.status]?.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          #{order.id.slice(0, 8)}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="font-medium flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {order.userName}
                        </p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                      
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium">{item.quantity}x</span> {item.ramen.name}
                            {item.spiceLevel && (
                              <span className="text-muted-foreground"> ({item.spiceLevel})</span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="font-semibold text-primary">
                          Total: {formatPrice(order.totalPrice)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Pembayaran: {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 lg:flex-col">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="warm"
                            onClick={() => updateOrderStatus(order.id, order.userId, 'confirmed')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Konfirmasi
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => updateOrderStatus(order.id, order.userId, 'pending')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Tolak
                          </Button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="warm"
                          onClick={() => updateOrderStatus(order.id, order.userId, 'processing')}
                        >
                          <ChefHat className="w-4 h-4 mr-1" />
                          Proses
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button
                          size="sm"
                          variant="warm"
                          onClick={() => updateOrderStatus(order.id, order.userId, 'completed')}
                        >
                          <Package className="w-4 h-4 mr-1" />
                          Selesai
                        </Button>
                      )}
                      {order.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="warm"
                          onClick={() => updateOrderStatus(order.id, order.userId, 'delivered')}
                        >
                          <Truck className="w-4 h-4 mr-1" />
                          Kirim
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
