import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Soup, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Masukkan email yang valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Masukkan email yang valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const success = await login(formData.email, formData.password);
        if (success) {
          toast({
            title: 'Selamat datang kembali!',
            description: 'Anda berhasil masuk.',
          });
          navigate(from, { replace: true });
        } else {
          toast({
            title: 'Gagal masuk',
            description: 'Periksa kredensial Anda dan coba lagi.',
            variant: 'destructive',
          });
        }
      } else {
        const result = registerSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          toast({
            title: 'Akun berhasil dibuat!',
            description: 'Selamat datang di Rumah Ramen.',
          });
          navigate(from, { replace: true });
        } else {
          toast({
            title: 'Pendaftaran gagal',
            description: 'Silakan coba lagi dengan kredensial yang berbeda.',
            variant: 'destructive',
          });
        }
      }
    } catch {
      toast({
        title: 'Kesalahan',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Menu
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center shadow-warm">
                <Soup className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient-warm">Rumah Ramen</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? 'Selamat datang kembali' : 'Buat akun'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Masukkan kredensial Anda untuk mengakses akun' 
                : 'Bergabunglah dan mulai pesan ramen lezat'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama Anda"
                    className="pl-10 h-12"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Alamat Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="anda@contoh.com"
                  className="pl-10 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Kata Sandi
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button 
              type="submit" 
              variant="warm" 
              size="lg" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Mohon tunggu...' : isLogin ? 'Masuk' : 'Buat Akun'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="ml-2 text-primary hover:underline font-medium"
              >
                {isLogin ? 'Daftar' : 'Masuk'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-warm items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-ramen-dark/20" />
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        
        <div className="relative text-center text-primary-foreground p-12">
          <div className="w-24 h-24 rounded-full bg-primary-foreground/20 backdrop-blur-lg flex items-center justify-center mx-auto mb-8">
            <Soup className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Kelezatan Menanti</h2>
          <p className="text-lg text-primary-foreground/80 max-w-sm">
            Bergabunglah dengan ribuan pecinta ramen dan nikmati cita rasa Jepang autentik yang diantar ke rumah Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
