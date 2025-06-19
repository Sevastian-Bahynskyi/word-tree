import { motion } from 'framer-motion';
import { MessageCircleDashed } from 'lucide-react';

export const EmptyState = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-secondary/60 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-xl p-8"
        >
            <div className="flex flex-col items-center justify-center text-center h-48">
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mb-6"
                >
                    <MessageCircleDashed size={64} className="text-base/20" />
                </motion.div>
                <motion.h4
                    className="font-bold text-xl mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Select a Word to Begin
                </motion.h4>
                <motion.p
                    className="text-base/50 max-w-sm leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Click on any word above to see existing suggestions or propose your own alternatives
                </motion.p>
            </div>
        </motion.div>
    );
};
