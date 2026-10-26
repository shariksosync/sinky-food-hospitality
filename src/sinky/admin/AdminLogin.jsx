import { useState } from "react";
import { useApp, useRouter, DEMO_EMAIL, DEMO_PASSWORD } from "../store.jsx";
import { Btn, Icon, Wordmark } from "../ui.jsx";

export function AdminLogin() {
  const { login, authed } = useApp();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (authed) {
    navigate("/admin", { replace: true });
    return null;
  }

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please provide both demo email and password.");
      return;
    }
    const ok = login(email, password);
    if (ok) {
      navigate("/admin");
    } else {
      setError("Invalid demo credentials. Use the demo credentials shown below.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-block">
            <Wordmark />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-bold text-forest">Admin Login</h1>
          <p className="mt-2 text-sm text-ink/70">
            Sign in to access the website management dashboard.
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-card p-8 shadow-soft">
          {/* Demo Notice Banner */}
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <Icon name="tag" className="h-4 w-4 text-amber-700" />
              <span>Demo Mode Authentication</span>
            </div>
            <p className="mt-1 text-amber-800">
              This portfolio is a frontend-only demonstration. No external server or database is connected.
            </p>
            <div className="mt-2.5 rounded-lg border border-amber-200 bg-white/90 p-2 font-mono text-[11px] text-amber-950">
              <div><strong className="text-amber-800">Email:</strong> {DEMO_EMAIL}</div>
              <div><strong className="text-amber-800">Password:</strong> {DEMO_PASSWORD}</div>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-3 inline-flex items-center gap-1.5 font-semibold text-terracotta hover:underline"
            >
              <Icon name="check" className="h-3.5 w-3.5" />
              Quick-Fill Demo Credentials
            </button>
          </div>

          {error && (
            <div role="alert" className="mb-5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Email Address <span className="text-terracotta">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sinkyindustries.local"
                className="input mt-1.5"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Password <span className="text-terracotta">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
                >
                  <Icon name={showPassword ? "eye" : "eye"} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Btn type="submit" className="w-full mt-2">
              Sign In to Dashboard
            </Btn>
          </form>

          <div className="mt-6 border-t border-line pt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-forest"
            >
              <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" />
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
