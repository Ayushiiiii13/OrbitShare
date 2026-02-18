import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { BookOpen, Home, Upload, User as UserIcon, LogIn, UserPlus, LogOut, Settings, Shield, ChevronDown } from "lucide-react";
import { Button } from "./Button";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Upload", path: "/upload", icon: Upload },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-primary/5">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
            <BookOpen className="relative h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white glow-text">
            OrbitShare
          </span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center space-x-1 p-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  location.pathname === item.path
                    ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-lg shadow-primary/20">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-200 hidden sm:inline-block">
                  {user.name}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform duration-300", isProfileOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-72 origin-top-right bg-[#0a0a0c]/95 backdrop-blur-2xl rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-[100]"
                  >
                    {/* User Header */}
                    <div className="px-4 py-4 mb-2 border-b border-white/5">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Account details</p>
                      <p className="text-base font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>

                    {/* Metadata Section */}
                    <div className="px-4 py-3 space-y-2 bg-white/5 rounded-xl mb-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">COLLEGE</span>
                        <span className="text-primary font-medium text-right uppercase truncate max-w-[150px]">{user.college || "Not Set"}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">BRANCH</span>
                        <span className="text-secondary font-medium uppercase">{user.branch || "General"}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">SEMESTER</span>
                        <span className="text-accent font-medium">{user.semester || "N/A"}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                      >
                        <UserIcon className="h-4 w-4 mr-3 text-secondary group-hover:scale-110 transition-transform" />
                        Manage Profile
                      </Link>
                      <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Settings className="h-4 w-4 mr-3 text-primary group-hover:rotate-45 transition-transform" />
                        Orbital Settings
                      </button>
                      <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Shield className="h-4 w-4 mr-3 text-accent group-hover:scale-110 transition-transform" />
                        Security Uplink
                      </button>

                      <div className="h-px bg-white/5 my-2 mx-2" />

                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-all group"
                      >
                        <LogOut className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                        Log out of Orbit
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant={location.pathname === "/login" ? "default" : "ghost"} size="sm" className="rounded-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant={location.pathname === "/register" ? "default" : "ghost"} size="sm" className="rounded-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
