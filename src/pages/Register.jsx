import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Orb } from "../components/Orb";
import Navbar from "../components/Navbar";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    semester: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await register(form);

    setIsLoading(false);
    if (result.success) {
      alert("Registration successful! Please sign in.");
      navigate("/login");
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

      {/* Register Form Container */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="glass-panel rounded-2xl p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Create Identity</h1>
              <p className="text-secondary text-sm">Join the academic collective across the universe</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    University Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@university.edu"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Access Key (Password)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="college" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Educational Institution
                </label>
                <input
                  id="college"
                  name="college"
                  type="text"
                  placeholder="University of Technology"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="branch" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Branch / Dept
                  </label>
                  <input
                    id="branch"
                    name="branch"
                    type="text"
                    placeholder="CSE"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="semester" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Current Semester
                  </label>
                  <input
                    id="semester"
                    name="semester"
                    type="text"
                    placeholder="6th"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Synthesizing..." : "Initiate Registration"}
                {!isLoading && <span className="text-lg">→</span>}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500">
              Already a member?{" "}
              <Link to="/login" className="text-secondary hover:text-primary transition-colors font-bold uppercase tracking-wider ml-1">
                Authorize Access
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
