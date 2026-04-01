import React from 'react';
import { motion } from 'motion/react';
import { signInWithGoogle, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { LogIn, User } from 'lucide-react';

export default function Login() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-3xl max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center text-black text-2xl font-bold mx-auto mb-8">F</div>
        <h2 className="text-4xl font-bold uppercase tracking-tighter mb-4">Welcome Back</h2>
        <p className="text-white/40 mb-12 uppercase tracking-widest text-[10px]">Access your elite grooming dashboard</p>
        
        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-brand-green transition-all flex items-center justify-center gap-3"
          >
            <LogIn size={20} />
            {loading ? "Connecting..." : "Sign in with Google"}
          </button>

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 border border-white/20 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <User size={20} />
            {loading ? "Creating Account..." : "Sign up with Google"}
          </button>
        </div>

        <p className="mt-12 text-xs text-white/20 uppercase tracking-widest leading-relaxed">
          By signing in, you agree to our <br />
          <span className="text-white/40 hover:text-brand-green cursor-pointer">Terms & Conditions</span> and <span className="text-white/40 hover:text-brand-green cursor-pointer">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}
