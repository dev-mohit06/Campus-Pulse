import { memo } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const EventModal = memo(({ event, onClose }) => (
    <motion.div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="bg-zinc-900 p-8 rounded-lg max-w-4xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
        >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-4xl font-bold">{event.title}</h3>
                    <p className="text-gray-400 mt-2">{event.category}</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            <img
                src={event.image}
                alt={event.title}
                className="w-full aspect-video object-cover rounded-lg mb-8"
            />
            <div className="flex justify-between items-center">
                <span className="text-2xl">{event.date}</span>
                <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition-colors">
                    Register Now
                </button>
            </div>
        </motion.div>
    </motion.div>
));

export default EventModal;