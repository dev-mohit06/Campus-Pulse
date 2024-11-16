import {motion} from 'framer-motion';
import {memo} from 'react';


const EventCard = memo(({ event, index, onClick }) => (
    <motion.div
        className="group cursor-pointer"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 }}
        viewport={{ once: true }}
        onClick={() => onClick(event)}
    >
        <div className="relative overflow-hidden">
            <img
                src={event.image}
                alt={event.title}
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
            />
            <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${event.color} opacity-0 group-hover:opacity-70 transition-opacity`}
            />
        </div>
        <div className="mt-6 flex justify-between items-start">
            <div>
                <h3 className="text-3xl font-bold">{event.title}</h3>
                <p className="text-gray-400 mt-2">{event.category}</p>
            </div>
            <span className="text-xl">{event.date}</span>
        </div>
    </motion.div>
));

export default EventCard;