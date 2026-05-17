"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { handleLogin } from "@/server/providers/handleLogin";
import { handleAuth } from "@/server/providers/handleAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Key, ArrowRight, EyeOff, Eye, Fingerprint } from "lucide-react";
import { biometricVerify } from "@/server/api";
import { startAuthentication } from "@simplewebauthn/browser";
import { handleBiometric } from "@/server/providers/handleBiometricLogin";
import { motion, AnimatePresence } from "framer-motion";

// ── Noise texture ─────────────────────────────────────────────────────────────
const noiseDataUri = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

// ── Reusable vault input ───────────────────────────────────────────────────────
const VaultInput = ({ name, type = "text", placeholder, onChange, required, suffix }) => (
  <div className="relative">
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 font-mono text-[13px] text-stone-200 placeholder:text-stone-700 bg-transparent border border-stone-800 focus:border-amber-600/60 focus:outline-none transition-colors duration-200"
      style={{ caretColor: "#d4a847" }}
    />
    {/* Corner marks */}
    <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-600/40 pointer-events-none" />
    <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-600/40 pointer-events-none" />
    <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-600/40 pointer-events-none" />
    <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-600/40 pointer-events-none" />
    {suffix}
  </div>
);

// ── Field label ───────────────────────────────────────────────────────────────
const FieldLabel = ({ icon: Icon, children, right }) => (
  <div className="flex items-center justify-between mb-2">
    <label className="font-mono text-[9px] tracking-[0.35em] uppercase text-amber-600/70 flex items-center gap-2">
      <Icon size={11} className="text-amber-600/60" />
      {children}
    </label>
    {right}
  </div>
);

// ── Section divider ───────────────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div className="relative flex items-center gap-4">
    <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,168,107,0.2))" }} />
    <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-stone-700">{label}</span>
    <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(200,168,107,0.2), transparent)" }} />
  </div>
);

// ── Primary action button ─────────────────────────────────────────────────────
const PrimaryButton = ({ type = "button", onClick, children, name, value }) => (
  <button
    type={type}
    onClick={onClick}
    name={name}
    value={value}
    className="group relative w-full py-3 font-mono text-[11px] tracking-[0.3em] uppercase text-[#070707] overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 transition-colors duration-300"
    style={{ background: "linear-gradient(135deg, #d4a847 0%, #b8892a 100%)" }}
  >
    <span className="absolute inset-0 bg-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    <span className="relative z-10 flex items-center justify-center gap-3">
      {children}
    </span>
  </button>
);

// ── Ghost button ──────────────────────────────────────────────────────────────
const GhostButton = ({ type = "button", onClick, children }) => (
  <button
    type={type}
    onClick={onClick}
    className="group relative w-full py-3 font-mono text-[11px] tracking-[0.3em] uppercase text-amber-600/70 border border-stone-800 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 hover:border-amber-600/40 transition-all duration-300"
  >
    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(200,168,107,0.05)" }} />
    <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-amber-500 transition-colors duration-200">
      {children}
    </span>
  </button>
);

// ── OAuth button ──────────────────────────────────────────────────────────────
const OAuthButton = ({ name, value, icon, label }) => (
  <button
    type="submit"
    name={name}
    value={value}
    className="group relative flex-1 flex items-center justify-center gap-3 py-3 font-mono text-[10px] tracking-[0.2em] uppercase text-stone-500 border border-stone-800 overflow-hidden cursor-pointer hover:border-amber-600/35 hover:text-stone-300 transition-all duration-300"
  >
    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(200,168,107,0.04)" }} />
    <span className="relative z-10 flex items-center gap-2.5">
      {icon}
      {label}
    </span>
  </button>
);

// ── Main form ─────────────────────────────────────────────────────────────────
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [show2faField, set2faField] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleCredentialLogin = async (formData) => {
    const toastID = toast.loading("Verifying credentials…");
    try {
      const result = await handleLogin(formData, show2faField);
      if (result.success) {
        toast.success(result.message, { id: toastID, description: "Welcome back." });
        router.push("/home");
      } else {
        if (result.twoFactorField) set2faField(true);
        toast.error("Login failed", { id: toastID, description: result.message });
      }
    } catch (err) {
      if (err.message !== "NEXT_REDIRECT")
        toast.error("Failed to login", { id: toastID, description: err.message });
    } finally {
      setTimeout(() => toast.dismiss(toastID), 5000);
    }
  };

  const handleOAuthLogin = async (formData) => {
    const toastID = toast.loading("Connecting via OAuth…");
    const provider = formData.get("provider");
    try {
      await handleAuth(provider);
    } catch (err) {
      toast.error(err.message, { id: toastID });
    } finally {
      setTimeout(() => toast.dismiss(toastID), 3000);
    }
  };

  const handleBiometricLogin = async () => {
    if (!email) { toast.error("Email is required."); return; }
    try {
      const biometricOptions = await biometricVerify(email);
      if (biometricOptions.error) throw new Error(biometricOptions.error);
      const authResp = await startAuthentication(biometricOptions);
      const res = await handleBiometric(authResp, email);
      if (res) { toast.success("Biometric login successful!"); router.push("/home"); }
      else toast.error("Biometric verification failed");
    } catch (err) {
      toast.error(err.message || "Biometrics cancelled or failed");
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1 mb-2">
        <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-amber-600/60">
          ◈ Secure Access Portal
        </p>
        <h1
          className="text-3xl font-bold text-stone-100 tracking-tight"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Welcome Back
        </h1>
        <p className="font-mono text-[11px] text-stone-600 mt-1">
          Authenticate to access your vault
        </p>
      </div>

      {/* Thin amber separator */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, rgba(200,168,107,0.5), rgba(200,168,107,0.1) 60%, transparent)" }} />

      {/* ── Credential form ── */}
      <form action={handleCredentialLogin} className="flex flex-col gap-5">

        {/* Email */}
        <div>
          <FieldLabel icon={Mail}>Email Address</FieldLabel>
          <VaultInput
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <FieldLabel
            icon={Lock}
            right={
              <Link href="/forgot-password" className="font-mono text-[9px] tracking-[0.2em] uppercase text-stone-600 hover:text-amber-500/70 transition-colors duration-200">
                Forgot?
              </Link>
            }
          >
            Password
          </FieldLabel>
          <VaultInput
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            required
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-700 hover:text-amber-500/70 transition-colors duration-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
          />
        </div>

        {/* 2FA */}
        <AnimatePresence>
          {show2faField && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              <FieldLabel icon={Key}>
                Two-Factor Code
                <span className="ml-1 text-stone-700 normal-case tracking-normal font-sans text-[9px]">(optional)</span>
              </FieldLabel>
              <VaultInput name="2fa" type="text" placeholder="000000" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign in */}
        <PrimaryButton type="submit">
          Sign In
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
        </PrimaryButton>

        {/* Biometric */}
        <GhostButton type="button" onClick={handleBiometricLogin}>
          <Fingerprint size={13} />
          Login with Biometrics
        </GhostButton>
      </form>

      <Divider label="or continue with" />

      {/* ── OAuth form ── */}
      <form action={handleOAuthLogin}>
        <div className="flex gap-3">
          <OAuthButton
            name="provider"
            value="google"
            label="Google"
            icon={
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            }
          />
          <OAuthButton
            name="provider"
            value="github"
            label="GitHub"
            icon={
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 fill-stone-500 group-hover:fill-stone-300 transition-colors duration-300">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            }
          />
        </div>
      </form>

      {/* Bottom separator */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(200,168,107,0.1) 50%, transparent)" }} />

      {/* Sign up link */}
      <p className="font-mono text-[10px] tracking-[0.15em] text-stone-700 text-center">
        No vault account?{" "}
        <Link href="/signup" className="text-amber-600/70 hover:text-amber-500 transition-colors duration-200">
          Create one →
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;