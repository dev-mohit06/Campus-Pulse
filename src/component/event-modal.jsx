import { memo } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const EventModal = memo(({ event, onClose }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
        >
            <motion.div
                className="bg-zinc-900 p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
            >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4 sm:mb-6 md:mb-8">
                    <div className="pr-4">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">{event.title}</h3>
                        <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">{event.category}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center hover:bg-white/20 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Image Section */}
                <div className="relative w-full mb-4 sm:mb-6 md:mb-8 rounded-lg overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full aspect-video object-cover rounded-lg"
                        loading="lazy"
                    />
                </div>

                {/* Description Section - Optional */}
                {event.description && (
                    <div className="mb-4 sm:mb-6 md:mb-8">
                        <p className="text-sm sm:text-base text-gray-300">
                            {event.description}
                        </p>
                    </div>
                )}

                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <div className="flex flex-col w-full sm:w-auto">
                        <span className="text-lg sm:text-xl md:text-2xl font-medium">
                            {event.date}
                        </span>
                        {event.time && (
                            <span className="text-sm sm:text-base text-gray-400 mt-1">
                                {event.time}
                            </span>
                        )}
                    </div>
                    <button 
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base flex items-center justify-center"
                    >
                        Register Now
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
});

export default EventModal;