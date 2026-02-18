import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Download, Star, Link as LinkIcon, FileText, Search, MessageSquare } from "lucide-react";
import ReviewModal from "../components/ReviewModal";

export default function Dashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await api.get('/api/resources');
      setResources(res.data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openReviews = (resource) => {
    setSelectedResource(resource);
    setIsReviewModalOpen(true);
  };

  const filteredResources = resources.filter(resource => {
    const query = searchQuery.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.description?.toLowerCase().includes(query) ||
      resource.User?.name?.toLowerCase().includes(query)
    );
  });

  const stats = [
    {
      icon: FileText,
      label: "TOTAL RESOURCES",
      value: resources.length,
      change: "Global count",
      color: "text-secondary",
    },
    {
      icon: Download,
      label: "DOWNLOADS",
      value: "2.4k",
      change: "+340 this week",
      color: "text-primary",
    },
    {
      icon: Star,
      label: "AVG RATING",
      value: resources.length > 0
        ? (resources.reduce((acc, r) => acc + (r.averageRating || 0), 0) / resources.length).toFixed(1)
        : "0.0",
      change: "Global feedback",
      color: "text-accent",
    },
    {
      icon: LinkIcon,
      label: "CONNECTIONS",
      value: "56",
      change: "+8 new",
      color: "text-secondary",
    },
  ];

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
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-secondary text-sm font-medium">
              <span>★</span>
              <span>COMMAND CENTER</span>
            </div>
            <h1 className="text-5xl font-bold">
              Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Explorer'}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Your orbital activity overview and trending academic resources.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full md:w-80"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or info..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-lg"
            />
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-2xl p-6 space-y-4 group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <div className="space-y-1">
                <div className={`text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400">{stat.change}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trending Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <h2 className="text-xl font-bold text-secondary">
              {searchQuery ? "SEARCH RESULTS" : "TRENDING"}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-20 text-center text-gray-400">Loading resources...</div>
            ) : filteredResources.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-400 leading-relaxed">
                <Search className="h-12 w-12 text-gray-600 mx-auto mb-4 opacity-20" />
                No resources match your search criteria.<br />
                <span className="text-sm opacity-50">Try different keywords or check back later!</span>
              </div>
            ) : (
              filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="glass-panel rounded-2xl p-6 space-y-4 group hover:border-primary/30 transition-all flex flex-col"
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                      {resource.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                    <button
                      onClick={() => handleDownload(resource.fileUrl, resource.title)}
                      className="text-secondary hover:text-white transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 flex-1 line-clamp-2">{resource.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>👤 {resource.User?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openReviews(resource)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-accent/10 transition-all text-gray-400 hover:text-accent"
                      >
                        <Star className={`h-3 w-3 ${resource.averageRating > 0 ? 'fill-accent text-accent' : 'text-gray-600'}`} />
                        <span className="text-xs font-bold">{resource.averageRating || "0.0"}</span>
                        <span className="text-[10px] opacity-40">({resource.reviewCount || 0})</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        resource={selectedResource}
        onReviewSubmitted={fetchResources}
      />
    </Layout>
  );
}
