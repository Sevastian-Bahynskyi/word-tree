import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useAddSuggestionForm } from './hooks/useAddSuggestionForm';

interface Props {
    onAddSuggestion: (text: string) => void;
}

export const AddSuggestionForm = ({ onAddSuggestion }: Props) => {
    const {
        newSuggestion,
        setNewSuggestion,
        isSubmitting,
        submit,
    } = useAddSuggestionForm(onAddSuggestion);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit();
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <div className="relative">
                <input
                    type="text"
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    placeholder="Propose your alternative..."
                    className="w-full bg-primary/50 border-2 border-primary/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 placeholder-base/40"
                    disabled={isSubmitting}
                />
                {newSuggestion.trim() && (
                    <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    </motion.div>
                )}
            </div>            <motion.div className="relative group">
                {/* Floating particles background */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-accent/30 rounded-full"
                        initial={{
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 60 - 30,
                            opacity: 0
                        }}
                        animate={{
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 60 - 30,
                            opacity: [0, 0.6, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                        style={{
                            left: '50%',
                            top: '50%'
                        }}
                    />
                ))}

                {/* Expanding ring effect */}
                <motion.div
                    className="absolute inset-0 border-2 border-accent/20 rounded-xl"
                    initial={{ scale: 1, opacity: 0 }}
                    whileHover={{
                        scale: [1, 1.05, 1.02],
                        opacity: [0, 0.3, 0]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                />

                {/* Main button with morphing effect */}
                <motion.button
                    type="submit"
                    disabled={!newSuggestion.trim() || isSubmitting}
                    className="relative w-full sm:w-auto flex items-center justify-center gap-3 bg-accent text-secondary font-semibold px-6 py-3 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ borderRadius: "0.75rem" }}
                    whileHover={{
                        borderRadius: ["0.75rem", "2rem", "0.75rem"],
                        backgroundColor: "var(--color-accent-secondary)"
                    }}
                    whileTap={{
                        scale: 0.95,
                        borderRadius: "2rem"
                    }}
                    transition={{
                        borderRadius: { duration: 0.6, ease: "easeInOut" },
                        backgroundColor: { duration: 0.3 },
                        scale: { duration: 0.1 }
                    }}
                >
                    {/* Animated background shimmer */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 1
                        }}
                    />

                    {/* Content with stagger animation */}
                    <motion.div
                        className="relative flex items-center gap-3"
                        initial="rest"
                        whileHover="hover"
                        variants={{
                            rest: {},
                            hover: {
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                    >
                        {isSubmitting ? (
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Cool loading animation with multiple rings */}
                                <div className="relative w-5 h-5">
                                    <motion.div
                                        className="absolute inset-0 border-2 border-secondary/30 border-t-secondary rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <motion.div
                                        className="absolute inset-1 border border-secondary/50 border-b-secondary rounded-full"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                                <motion.span
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    Growing...
                                </motion.span>
                            </motion.div>
                        ) : (
                            <>
                                {/* Icon with bounce and rotate */}
                                <motion.div
                                    variants={{
                                        rest: { scale: 1, rotate: 0 },
                                        hover: {
                                            scale: [1, 1.3, 1.1],
                                            rotate: [0, 180, 360]
                                        }
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <PlusCircle size={20} />
                                </motion.div>

                                {/* Text with letter animation */}
                                <motion.span
                                    variants={{
                                        rest: {},
                                        hover: {}
                                    }}
                                >
                                    {"Propose Alternative".split("").map((letter, index) => (
                                        <motion.span
                                            key={index}
                                            variants={{
                                                rest: { y: 0 },
                                                hover: { y: [0, -8, 0] }
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                delay: index * 0.02,
                                                ease: "easeInOut"
                                            }}
                                            className="inline-block"
                                        >
                                            {letter === " " ? "\u00A0" : letter}
                                        </motion.span>
                                    ))}
                                </motion.span>
                            </>
                        )}
                    </motion.div>

                    {/* Ripple effect on click */}
                    <motion.div
                        className="absolute inset-0 bg-secondary/20 rounded-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{
                            scale: [0, 1.5],
                            opacity: [0.5, 0]
                        }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.button>
            </motion.div>
        </motion.form>
    );
};
