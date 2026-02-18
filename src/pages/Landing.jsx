import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Orb } from "../components/Orb";
import Navbar from "../components/Navbar";

export default function Landing() {
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

            {/* Hero Content */}
            <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8 text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block"
                    >
                        <div className="px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 backdrop-blur-sm">
                            <span className="text-sm text-secondary font-medium">★ Campus Academic Resource Platform</span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-7xl md:text-8xl font-bold">
                        <span className="text-white">Orbit</span>
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Share
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
                        Explore <span className="text-secondary">Academic Knowledge</span> Across Your
                        <br />
                        Campus Universe
                    </p>

                    {/* Enter Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent text-white text-xl font-bold shadow-2xl hover:shadow-primary/50 transition-all duration-300 relative group"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10">ENTER</span>
                        </Link>
                    </motion.div>

                    {/* Bottom Links */}
                    <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500">
                        <Link to="/login" className="hover:text-secondary transition-colors">
                            Sign In
                        </Link>
                        <span>|</span>
                        <Link to="/dashboard" className="hover:text-secondary transition-colors">
                            Dashboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
