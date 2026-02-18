import { useState, useEffect } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { User, Mail, School, BookOpen as BranchIcon, GraduationCap, Save, CheckCircle2, AlertCircle, ArrowLeft, Trash2, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        college: user?.college || "",
        branch: user?.branch || "",
        semester: user?.semester || "",
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [userResources, setUserResources] = useState([]);
    const [isLoadingResources, setIsLoadingResources] = useState(true);

    useEffect(() => {
        const fetchUserResources = async () => {
            try {
                const res = await api.get('/api/resources/user');
                const data = res.data.matches !== undefined ? res.data.matches : res.data;
                setUserResources(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch user resources:", error);
            } finally {
                setIsLoadingResources(false);
            }
        };
        fetchUserResources();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setStatus({ type: "", message: "" });

        const result = await updateProfile(formData);

        if (result.success) {
            setStatus({ type: "success", message: "Orbital profile updated successfully!" });
        } else {
            setStatus({ type: "error", message: result.message });
        }
        setIsUpdating(false);
    };

    const handleDeleteResource = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

        try {
            await api.delete(`/api/resources/${id}`);
            setUserResources(userResources.filter(r => r.id !== id));
        } catch (error) {
            console.error("Failed to delete resource:", error);
            alert("Failed to delete resource. Please try again.");
        }
    };

    const handleDownload = (fileUrl, title) => {
        const link = document.createElement('a');
        link.href = `http://localhost:5000/${fileUrl}`;
        link.download = title;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                {/* Breadcrumb */}
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium w-fit">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Command Center</span>
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center gap-6"
                >
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-primary/20 shrink-0">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold text-white">Manage <span className="text-primary text-glow">Identity</span></h1>
                        <p className="text-gray-400">Configure your global profile across the OrbitShare network.</p>
                    </div>
                </motion.div>

                {/* Status Messages */}
                <AnimatePresence>
                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-4 rounded-xl border flex items-center gap-3 ${status.type === "success"
                                ? "bg-green-500/10 border-green-500/20 text-green-500"
                                : "bg-red-500/10 border-red-500/20 text-red-500"
                                }`}
                        >
                            {status.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                            <span className="text-sm font-medium">{status.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#0a0a0c]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <User className="h-32 w-32" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <h3 className="text-lg font-bold text-white mb-4">Identity Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Fields */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <User className="h-3 w-3" /> Full Name
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Mail className="h-3 w-3" /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            disabled
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <School className="h-3 w-3" /> College / University
                                        </label>
                                        <input
                                            name="college"
                                            type="text"
                                            value={formData.college}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <BranchIcon className="h-3 w-3" /> Branch
                                        </label>
                                        <input
                                            name="branch"
                                            type="text"
                                            value={formData.branch}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <GraduationCap className="h-3 w-3" /> Semester
                                        </label>
                                        <input
                                            name="semester"
                                            type="text"
                                            value={formData.semester}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <motion.button
                                        type="submit"
                                        disabled={isUpdating}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {isUpdating ? (
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Save className="h-5 w-5" />
                                        )}
                                        <span>{isUpdating ? "SYNCING..." : "SAVE CHANGES"}</span>
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>

                        {/* My Resources Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#0a0a0c]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">My <span className="text-secondary">Uplinks</span></h3>
                                    <p className="text-sm text-gray-400">Manage your shared academic resources.</p>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold border border-secondary/20">
                                    {userResources.length}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {isLoadingResources ? (
                                    <div className="py-10 text-center text-gray-500">Decrypting resource list...</div>
                                ) : userResources.length === 0 ? (
                                    <div className="py-10 text-center rounded-2xl border border-dashed border-white/5 text-gray-500">
                                        No resources shared yet.
                                    </div>
                                ) : (
                                    userResources.map((resource) => (
                                        <div
                                            key={resource.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{resource.title}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                                                        {new Date(resource.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                                <button
                                                    onClick={() => handleDownload(resource.fileUrl, resource.title)}
                                                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-secondary transition-colors"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteResource(resource.id, resource.title)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#0a0a0c]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden relative group"
                        >
                            <div className="absolute -right-4 -top-4 text-primary/10 group-hover:text-primary/20 transition-colors">
                                <GraduationCap size={120} />
                            </div>

                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 relative z-10">Orbital Standing</h3>

                            <div className="space-y-4 relative z-10">
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Current Credits</p>
                                        <p className="text-3xl font-black text-white text-glow">{user?.credits || 0}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                        <span className="text-xl font-bold">⌬</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Rank Status</p>
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">
                                        {(user?.credits || 0) >= 100 ? "Elite Scholar" : (user?.credits || 0) >= 50 ? "Ace Contributor" : "Rookie Explorer"}
                                    </p>
                                    <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="h-full bg-secondary shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                            style={{ width: `${Math.min(((user?.credits || 0) % 50) * 2, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#0a0a0c]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Security Level</h3>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Identity Verified</p>
                                    <p className="text-[10px] text-gray-500 uppercase">Level 4 Encryption</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
