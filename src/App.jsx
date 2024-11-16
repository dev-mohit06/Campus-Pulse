import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import HeroSection from './component/hero';
import NavigationMenu from './component/navbar';
import EventCard from './component/event-card';
import EventModal from './component/event-modal';
import { AnimatePresence } from 'framer-motion';

import EVENTS from './constants/events';

const App = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleEventSelect = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Floating Navigation */}
      <motion.div
        className="fixed top-8 right-8 z-50 mix-blend-difference"
        animate={{ scale: isMenuOpen ? 1 : 0.9 }}
      >
        <button
          onClick={handleMenuToggle}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </motion.div>

      {/* Navigation Menu */}
      <NavigationMenu isOpen={isMenuOpen} onClose={handleMenuToggle} />

      {/* Hero Section */}
      <HeroSection />

      {/* Events Grid */}
      <section id="events" className="py-32 px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {EVENTS.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onClick={handleEventSelect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={handleModalClose} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;