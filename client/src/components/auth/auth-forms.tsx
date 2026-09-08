"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

const GOOGLE_ICON = "/icons/google.svg";
const EYE_ICON = "/icons/eye.svg";

function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  passwordToggle,
  required = true,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  passwordToggle?: boolean;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const inputType = passwordToggle ? (visible ? "text" : "password") : type;

  return (
    <label className="relative block">
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder=" "
        className="peer h-[34px] w-full border-[0.5px] border-[#757575] bg-transparent px-3 pr-8 text-[11px] tracking-[0.55px] text-black outline-none lg:h-[34px] lg:text-[13px] lg:tracking-[0.65px]"
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-medium tracking-[0.55px] text-[#757575] peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden lg:text-[13px] lg:tracking-[0.65px]">
        {label}
      </span>
      {passwordToggle ? (
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <Image src={EYE_ICON} alt="" width={16} height={16} className="size-4" />
        </button>
      ) : null}
    </label>
  );
}

function GoogleButton({ onClick, pending, iconSize = 16 }: { onClick: () => void; pending?: boolean; iconSize?: 16 | 20 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="flex h-10 w-full items-center justify-center gap-2 border border-[#565656] bg-white disabled:opacity-50"
    >
      <Image src={GOOGLE_ICON} alt="" width={iconSize} height={iconSize} className="shrink-0" style={{ width: iconSize, height: iconSize }} />
      <span className="text-[12px] font-medium tracking-[0.6px] text-black lg:text-[14px] lg:tracking-normal">
        LOGIN WITH GOOGLE
      </span>
    </button>
  );
}

export function LoginForm({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) {
  const { signIn, signInWithGoogle, resetPassword, openAuth } = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);

  const isDesktop = variant === "desktop";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setPending(true);
    try {
      await signIn(mobile, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in");
    } finally {
      setPending(false);
    }
  };

  const handleForgot = async () => {
    if (!mobile) {
      setError("Enter your mobile number first");
      return;
    }
    setError("");
    try {
      await resetPassword(mobile);
      setInfo("Password reset email sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
    }
  };

  const handleGoogle = async () => {
    setError("");
    setPending(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={isDesktop ? "contents" : "space-y-0"}>
      {isDesktop ? (
        <>
          <div>
            <p className="text-[18px] font-semibold leading-none">LOGIN</p>
            <p className="mt-8 text-[14px] font-medium">For Existing Customers only</p>
            <div className="mt-6 space-y-[19px]">
              <AuthInput label="Mobile Number" type="tel" value={mobile} onChange={setMobile} />
              <AuthInput label="Password" value={password} onChange={setPassword} passwordToggle />
            </div>
            <button type="button" onClick={handleForgot} className="mt-[11px] text-[13px] font-medium">
              Forgot Your Password ?
            </button>
            {error ? <p className="mt-2 text-[12px] text-[#e83647]">{error}</p> : null}
            {info ? <p className="mt-2 text-[12px] text-gray">{info}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="mt-[22px] h-10 w-full bg-black text-[13px] font-medium tracking-[0.65px] text-white disabled:opacity-50"
            >
              LOGIN
            </button>
          </div>
          <div>
            <p className="mt-[52px] text-[14px] font-medium">Log in from Google</p>
            <div className="mt-6">
              <GoogleButton onClick={handleGoogle} pending={pending} iconSize={20} />
            </div>
            <p className="mt-[73px] text-[14px] font-medium">
              Don&apos;t have an account ?{" "}
              <button type="button" onClick={() => openAuth("signup")} className="text-[#e83647]">
                Sign Up
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-[19px]">
            <AuthInput label="Mobile Number" type="tel" value={mobile} onChange={setMobile} />
            <AuthInput label="Password" value={password} onChange={setPassword} passwordToggle />
          </div>
          <button type="button" onClick={handleForgot} className="mt-[20px] text-[10px] font-medium">
            Forgot Your Password ?
          </button>
          {error ? <p className="mt-2 text-[12px] text-[#e83647]">{error}</p> : null}
          {info ? <p className="mt-2 text-[12px] text-gray">{info}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-[7px] h-[34px] w-full bg-black text-[12px] font-medium tracking-[0.6px] text-white disabled:opacity-50"
          >
            LOGIN
          </button>
          <p className="mt-[27px] text-center text-[11px] font-medium">
            Don&apos;t have an account ?{" "}
            <a href="/signup" className="text-[#e83647]">Sign Up</a>
          </p>
          <div className="mt-[21px] border-t border-black/20 pt-[19px]">
            <GoogleButton onClick={handleGoogle} pending={pending} />
          </div>
        </>
      )}
    </form>
  );
}

export function SignupForm({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) {
  const { sendOtp, signUp, signInWithGoogle, openAuth } = useAuth();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);
  const isDesktop = variant === "desktop";

  const handleResend = async () => {
    setError("");
    setPending(true);
    try {
      await sendOtp(mobile);
      setInfo("OTP sent to your mobile number.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP");
    } finally {
      setPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agree) {
      setError("Please agree to the T&Cs.");
      return;
    }
    setPending(true);
    try {
      if (!otp) {
        await sendOtp(mobile);
        setInfo("OTP sent. Enter the code to continue.");
        return;
      }
      await signUp({
        fullName,
        mobile,
        otp,
        password,
        agreeToTerms: agree,
        emailUpdates,
        whatsappUpdates: whatsapp,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign up");
    } finally {
      setPending(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setPending(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setPending(false);
    }
  };

  const checkboxes = (
    <div className={isDesktop ? "mt-[19px] space-y-[16px]" : "mt-[21px] space-y-[16px]"}>
      <label className="flex items-start gap-[9px] text-[10px] font-medium leading-[15px]">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-[2px] size-3 shrink-0 appearance-none border-0 bg-[#d9d9d9] checked:bg-black" />
        I agree to Pernia&apos;s Pop up Shop T&amp;Cs.
      </label>
      <label className="flex items-start gap-[9px] text-[10px] font-medium leading-[15px]">
        <input type="checkbox" checked={emailUpdates} onChange={(e) => setEmailUpdates(e.target.checked)} className="mt-[2px] size-3 shrink-0 appearance-none border-0 bg-[#d9d9d9] checked:bg-black" />
        Send me Email Updates on New Arrivals &amp; Deals.
      </label>
      <label className="flex items-start gap-[9px] text-[10px] font-medium leading-[15px]">
        <input type="checkbox" checked={whatsapp} onChange={(e) => setWhatsapp(e.target.checked)} className="mt-[2px] size-3 shrink-0 appearance-none border-0 bg-[#d9d9d9] checked:bg-black" />
        Enable Whatsapp Updates
      </label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={isDesktop ? "contents" : ""}>
      {isDesktop ? (
        <>
          <div>
            <p className="text-[18px] font-semibold leading-none">SIGN UP</p>
            <p className="mt-8 text-[14px] font-medium">Let&apos;s setup your account</p>
            <div className="mt-6 space-y-[19px]">
              <AuthInput label="Full Name" value={fullName} onChange={setFullName} />
              <AuthInput label="Mobile Number" type="tel" value={mobile} onChange={setMobile} />
              <div>
                <AuthInput label="Enter OTP" value={otp} onChange={setOtp} required={false} />
                <button type="button" onClick={handleResend} className="mt-1 text-[12px] font-medium text-[#757575]">
                  Resend OTP
                </button>
              </div>
              <AuthInput label="Create Password" value={password} onChange={setPassword} passwordToggle />
            </div>
            {checkboxes}
            {error ? <p className="mt-2 text-[12px] text-[#e83647]">{error}</p> : null}
            {info ? <p className="mt-2 text-[12px] text-gray">{info}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="mt-[23px] h-10 w-full bg-black text-[13px] font-medium tracking-[0.65px] text-white disabled:opacity-50"
            >
              SIGN UP
            </button>
          </div>
          <div className="flex flex-col">
            <p className="mt-[52px] text-[14px] font-medium">Log in from Google</p>
            <div className="mt-6">
              <GoogleButton onClick={handleGoogle} pending={pending} iconSize={20} />
            </div>
            <p className="mt-auto pt-16 text-[14px] font-medium">
              Already have an account ?{" "}
              <button type="button" onClick={() => openAuth("login")} className="text-[#e83647]">
                Log In
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-[19px]">
            <AuthInput label="Full Name" value={fullName} onChange={setFullName} />
            <AuthInput label="Mobile Number" type="tel" value={mobile} onChange={setMobile} />
            <div>
              <AuthInput label="Enter OTP" value={otp} onChange={setOtp} required={false} />
              <button type="button" onClick={handleResend} className="mt-1 text-[10px] font-medium text-[#757575]">
                Resend OTP
              </button>
            </div>
            <AuthInput label="Create Password" value={password} onChange={setPassword} passwordToggle />
          </div>
          {checkboxes}
          {error ? <p className="mt-2 text-[12px] text-[#e83647]">{error}</p> : null}
          {info ? <p className="mt-2 text-[12px] text-gray">{info}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-[22px] h-[34px] w-full bg-black text-[12px] font-medium tracking-[0.6px] text-white disabled:opacity-50"
          >
            SIGN UP
          </button>
          <p className="mt-[30px] text-center text-[11px] font-medium">
            Already have an account ?{" "}
            <a href="/login" className="text-[#e83647]">Log In</a>
          </p>
          <div className="mt-[21px] border-t border-black/20 pt-[19px]">
            <GoogleButton onClick={handleGoogle} pending={pending} />
          </div>
        </>
      )}
    </form>
  );
}
