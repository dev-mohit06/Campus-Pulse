import { memo } from 'react';
import { motion } from 'framer-motion';

const NavigationMenu = memo(({ isOpen, onClose }) => (
    <motion.div
        className="fixed inset-0 bg-white/90 z-40 flex items-center justify-center"
        initial={{ clipPath: 'circle(0% at 95% 5%)' }}
        animate={{
            clipPath: isOpen ? 'circle(150% at 95% 5%)' : 'circle(0% at 95% 5%)',
            transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] }
        }}
    >
        <nav className="text-black text-6xl font-bold space-y-8">
            <a href="#events" onClick={onClose}>
                <motion.div
                    className="cursor-pointer hover:text-purple-600 transition-colors"
                    whileHover={{ x: 20 }}
                >
                    Events
                </motion.div>
            </a>
        </nav>
    </motion.div>
));

export default NavigationMenu;