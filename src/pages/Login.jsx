import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Orb } from "../components/Orb";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    setIsLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex flex-col">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb color="bg-red-500/30" size="w-[300px] h-[300px]" className="top-[10%] left-[5%]" delay={0} />
        <Orb color="bg-blue-500/40" size="w-[500px] h-[500px]" className="top-[15%] right-[10%]" delay={1.5} />
        <Orb color="bg-primary/30" size="w-[400px] h-[400px]" className="bottom-[20%] left-[15%]" delay={3} />
        <Orb color="bg-accent/20" size="w-[350px] h-[350px]" className="bottom-[10%] right-[5%]" delay={4.5} />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Login Form Container */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel rounded-2xl p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Access Orbit</h1>
              <p className="text-secondary text-sm">Sign in to your academic command center</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Identity (Email)
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Access Key (Password)
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? "Synchronizing..." : "Initiate Uplink"}
                {!isLoading && <span className="text-lg">→</span>}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-2">
              New to the system?{" "}
              <Link to="/register" className="text-secondary hover:text-primary transition-colors font-bold uppercase tracking-wider ml-1">
                Register Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
