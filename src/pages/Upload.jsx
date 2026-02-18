import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Upload() {
  const { refreshUser } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus({ type: "", message: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus({ type: "error", message: "Please select a file" });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    setIsUploading(true);
    setStatus({ type: "", message: "" });

    try {
      await api.post('/api/resources/upload', formData);
      await refreshUser();
      setStatus({ type: "success", message: "Resource uploaded successfully! +10 Credits awarded." });
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Upload failed. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium mb-2">
            <UploadCloud className="h-4 w-4" />
            <span>FILE UPLINK</span>
          </div>
          <h1 className="text-4xl font-bold">
            Share your <span className="text-primary text-glow">Knowledge</span>
          </h1>
          <p className="text-gray-400">
            Upload notes, lab reports, or cheat sheets to the orbital network.
          </p>
        </motion.div>

        {/* Status Messages */}
        {status.message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`p-4 rounded-xl border flex items-center gap-3 ${status.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}
          >
            {status.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">{status.message}</span>
          </motion.div>
        )}

        {/* Form Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-8 space-y-8 relative overflow-hidden group"
        >
          {/* Decorative element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Data Structures Master Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Brief Description
                </label>
                <input
                  type="text"
                  placeholder="What is this resource about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Select File
              </label>
              <div className="relative group/upload">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                />
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer ${file
                    ? "border-primary bg-primary/5"
                    : "border-white/10 hover:border-primary/50 hover:bg-white/5"
                    }`}
                >
                  <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${file ? "bg-primary text-white scale-110 shadow-[0_0_20px_rgba(59,130,246,0.5)]" : "bg-white/5 text-gray-400"
                    }`}>
                    {file ? <FileText className="h-8 w-8" /> : <UploadCloud className="h-8 w-8" />}
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white mb-1">
                      {file ? file.name : "Choose a file to upload"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, DOCX, PPTX (Max 10MB)"}
                    </p>
                  </div>
                  {!file && (
                    <div className="mt-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 group-hover/upload:bg-primary group-hover/upload:text-white transition-all">
                      Browse Files
                    </div>
                  )}
                </label>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isUploading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
            >
              {isUploading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>TRANSMITTING...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-6 w-6" />
                  <span>UPLOAD TO ORBIT</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Visibility", desc: "Instantly shared with the community", color: "text-secondary" },
            { title: "Format", desc: "PDF, Office, and Text supported", color: "text-primary" },
            { title: "Storage", desc: "Safe as the stars in our network", color: "text-accent" }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-panel p-6 rounded-2xl border-white/5"
            >
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${item.color}`}>{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
