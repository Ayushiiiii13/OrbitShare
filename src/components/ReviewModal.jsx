import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send, User } from "lucide-react";
import api from "../api/axios";

export default function ReviewModal({ isOpen, onClose, resource, onReviewSubmitted }) {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && resource) {
            fetchReviews();
        }
    }, [isOpen, resource]);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/api/reviews/${resource.id}`);
            setReviews(res.data);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/api/reviews', {
                resourceId: resource.id,
                rating: newReview.rating,
                comment: newReview.comment
            });
            setNewReview({ rating: 5, comment: "" });
            fetchReviews();
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (error) {
            console.error("Failed to submit review:", error);
            const msg = error.response?.data?.message || "Failed to submit review. Try again.";
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{resource.title}</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Orbital Feedback</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                            {/* Submit Review Form */}
                            <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Rating</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setNewReview({ ...newReview, rating: num })}
                                                className={`transition-all ${num <= newReview.rating ? "text-accent scale-110" : "text-gray-600 hover:text-gray-400"}`}
                                            >
                                                <Star size={20} fill={num <= newReview.rating ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Add your communal feedback..."
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none min-h-[80px]"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "TRANSMITTING..." : "PUBLISH REVIEW"}
                                    <Send size={14} />
                                </button>
                            </form>

                            {/* Reviews List */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Communal Intelligence</h4>
                                {isLoading ? (
                                    <div className="text-center py-4 text-gray-600 text-xs animate-pulse">Synchronizing field data...</div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 text-sm italic">No data transmissions yet. Be the first to analyze.</div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="p-4 rounded-xl border border-white/5 bg-white/2 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary border border-primary/20">
                                                        <User size={12} />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-300">{review.User?.name}</span>
                                                </div>
                                                <div className="flex text-accent">
                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                        <Star key={i} size={10} fill="currentColor" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed font-medium">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
