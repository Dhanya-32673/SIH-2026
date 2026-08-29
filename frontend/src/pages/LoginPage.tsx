import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ShieldCheck, ArrowRight, Loader2, Sparkles, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendEmailOtp, verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp, isAuthenticated } = useAuth();

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCodes, setOtpCodes] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (loginMethod === 'email') {
        if (!email) throw new Error('Please enter a valid email address.');
        const res = await sendEmailOtp(email);
        setSuccessMsg(res.message);
      } else {
        if (!phone) throw new Error('Please enter a valid phone number.');
        // Basic E.164 phone formatting support (+91...)
        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+' + formattedPhone;
        }
        const res = await sendPhoneOtp(formattedPhone);
        setSuccessMsg(res.message);
      }
      setOtpSent(true);
      setResendTimer(60);
      // Reset OTP values
      setOtpCodes(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to dispatch verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val)) && val !== '') return;

    const newOtp = [...otpCodes];
    newOtp[index] = val.substring(val.length - 1);
    setOtpCodes(newOtp);

    // Auto-advance to next cell
    if (val !== '' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otpCodes[index] === '' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').trim();
    if (pastedText.length === 6 && !isNaN(Number(pastedText))) {
      const chars = pastedText.split('');
      setOtpCodes(chars);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const fullOtp = otpCodes.join('');
    if (fullOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits.');
      setLoading(false);
      return;
    }

    try {
      if (loginMethod === 'email') {
        const res = await verifyEmailOtp(email, fullOtp);
        if (res.success) {
          navigate('/dashboard');
        }
      } else {
        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+' + formattedPhone;
        }
        const res = await verifyPhoneOtp(formattedPhone, fullOtp);
        if (res.success) {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Visual background glows */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl glass-panel border border-slate-800/80 p-6 sm:p-8 shadow-2xl relative z-10 space-y-6"
      >
        {/* Brand/Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Secure Companion Access</h2>
          <p className="text-xs text-slate-400">
            Privacy-first passwordless authorization portal
          </p>
        </div>

        {/* State Messages */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono"
            >
              {errorMsg}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono"
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs - Only show when OTP is not sent */}
        {!otpSent && (
          <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setLoginMethod('email');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                loginMethod === 'email'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-4.5 h-4.5" />
              <span>Email Link</span>
            </button>

            <button
              onClick={() => {
                setLoginMethod('phone');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                loginMethod === 'phone'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Phone className="w-4.5 h-4.5" />
              <span>SMS Code</span>
            </button>
          </div>
        )}

        {/* Forms */}
        <AnimatePresence mode="wait">
          {!otpSent ? (
            <motion.form
              key="request-form"
              onSubmit={handleSendOtp}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {loginMethod === 'email' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-400 uppercase">
                    Authorized Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. companion@sih2026.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-400 uppercase">
                    Registered Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +919876543210 (with country code)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Generate Secure OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="verify-form"
              onSubmit={handleVerifyOtp}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div className="space-y-2 text-center">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
                  ENTER 6-DIGIT VERIFICATION CODE
                </span>
                <div className="flex justify-between gap-1.5 sm:gap-2 max-w-xs mx-auto pt-2">
                  {otpCodes.map((code, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={code}
                      onPaste={handlePaste}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className="w-8 h-10 sm:w-10 sm:h-12 text-center rounded-xl bg-slate-950/90 border border-slate-800 text-sm sm:text-lg font-bold text-cyan-400 focus:outline-none focus:border-cyan-500/60"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Verify & Establish Session</span>
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Edit Input
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0 || loading}
                    onClick={handleSendOtp}
                    className="hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* SIH Hackathon Demo Notes */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold">SIH demonstration bypass notes:</span>
          </div>
          <p>• Phone OTP will print in the backend command console.</p>
          <p>• If SMTP credentials are unconfigured in .env, email OTP falls back to printing in backend console as well.</p>
          <p>• Enter the master override code <strong className="text-white">123456</strong> to instantly bypass validation.</p>
        </div>
      </motion.div>
    </div>
  );
};
export default LoginPage;
