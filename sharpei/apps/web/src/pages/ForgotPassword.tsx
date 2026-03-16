import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Gradient panel */}
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
              Happens to the{' '}
              <span className="gradient-sharpei-text">best</span>{' '}
              of us.
            </h1>
            <p className="mt-5 text-white/50 text-lg leading-relaxed">
              We'll send you a magic link to reset your password. Check your inbox and follow the instructions.
            </p>
          </div>

          <div className="text-white/30 text-sm">
            Secure password reset via Supabase Auth
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl gradient-sharpei flex items-center justify-center">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">Sharpei</span>
          </div>

          {sent ? (
            /* Success state */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-sharpei mx-auto flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                We sent a password reset link to{' '}
                <span className="font-medium text-foreground">{email}</span>.
                Click the link in the email to set a new password.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  className="font-medium text-foreground hover:underline underline-offset-4"
                >
                  try again
                </button>
              </p>
              <Link to="/login" className="inline-block mt-8">
                <Button variant="outline" className="h-11">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Button>
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>

              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Reset your password</h2>
                <p className="text-muted-foreground mt-2">
                  Enter the email associated with your account and we'll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-medium gradient-sharpei text-white hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
