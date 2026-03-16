import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowRight, Eye, EyeOff, AlertCircle, Users } from 'lucide-react';

export default function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setTokenError('No invitation token provided.');
      setIsValidating(false);
      return;
    }

    api
      .get(`/auth/invite/${token}`)
      .then(({ data }) => {
        setEmail(data.email || '');
        setOrgName(data.org_name || 'your team');
        setIsValidating(false);
      })
      .catch((err) => {
        setTokenError(
          err?.response?.data?.error || 'This invitation link is invalid or has expired.'
        );
        setIsValidating(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/accept-invite', { token, name, password });
      await login(email, password);
      toast.success('Welcome aboard!');
      navigate('/');
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || err?.message || 'Failed to accept invitation'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Shared left panel
  const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[hsl(185,85%,50%)] blur-[120px] animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[hsl(260,85%,60%)] blur-[120px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-[hsl(220,90%,55%)] blur-[100px] animate-[drift_22s_ease-in-out_infinite_2s]" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-sharpei flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-white/90 font-semibold text-xl tracking-tight">Sharpei</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-white leading-[1.15] tracking-tight">
            You've been{' '}
            <span className="gradient-sharpei-text">invited.</span>
          </h1>
          <p className="mt-5 text-white/50 text-lg leading-relaxed">
            {orgName !== 'your team'
              ? `${orgName} has invited you to join their team on Sharpei. Set up your account to get started.`
              : 'Your team has invited you to join Sharpei. Set up your account to get started.'}
          </p>
        </div>
        <div className="text-white/30 text-sm">
          Secure team collaboration platform
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isValidating) {
    return (
      <div className="flex min-h-screen">
        <LeftPanel />
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Validating your invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (tokenError) {
    return (
      <div className="flex min-h-screen">
        <LeftPanel />
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
          <div className="w-full max-w-[380px] text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto flex items-center justify-center mb-6">
              <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Invalid invitation</h2>
            <p className="text-muted-foreground mt-3">{tokenError}</p>
            <Link to="/login" className="inline-block mt-8">
              <Button variant="outline" className="h-11">
                Go to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="flex min-h-screen">
      <LeftPanel />

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl gradient-sharpei flex items-center justify-center">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">Sharpei</span>
          </div>

          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl gradient-sharpei flex items-center justify-center mb-5">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Join {orgName}</h2>
            <p className="text-muted-foreground mt-2">
              Set up your account to accept the invitation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email</Label>
              <Input
                type="email"
                value={email}
                disabled
                className="h-11 bg-muted/50 text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Your name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                autoFocus
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                className="w-full h-11 font-medium gradient-sharpei text-white hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Joining...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Join team
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
