import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const HeroSection = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const gradientAngleRef = useRef(0);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const Particle = useMemo(() => {
    return class {
      constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight);
        this.z = Math.random() * 2;
      }

      reset(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.baseSpeed = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * this.baseSpeed;
        this.speedY = (Math.random() - 0.5) * this.baseSpeed;
        this.hue = Math.random() * 60 + 240;
        this.life = Math.random() * 0.5 + 0.5;
      }

      update(mouseX, mouseY, canvasWidth, canvasHeight) {
        const dx = this.x - mouseX * canvasWidth;
        const dy = this.y - mouseY * canvasHeight;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = Math.min(2000 / (distance * distance), 5);
        
        this.speedX += (dx / distance) * force * 0.02;
        this.speedY += (dy / distance) * force * 0.02;

        const maxSpeed = 5;
        const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (currentSpeed > maxSpeed) {
          this.speedX = (this.speedX / currentSpeed) * maxSpeed;
          this.speedY = (this.speedY / currentSpeed) * maxSpeed;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.003;

        if (this.life <= 0 || this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight) {
          this.reset(canvasWidth, canvasHeight);
        }
      }

      draw(ctx) {
        const alpha = this.life;
        ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.z, 0, Math.PI * 2);
        ctx.fill();

        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 50%, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };
  }, []);

  const setCanvasSize = useCallback((canvas, ctx) => {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(pixelRatio, pixelRatio);
  }, []);

  const initParticles = useCallback((canvasWidth, canvasHeight) => {
    const particles = [];
    for (let i = 0; i < 200; i++) {
      particles.push(new Particle(canvasWidth, canvasHeight));
    }
    return particles;
  }, [Particle]);

const animate = useCallback((ctx, canvas) => {
  timeRef.current += 0.01;
  gradientAngleRef.current += 0.002;

  const gradient = ctx.createLinearGradient(
    canvas.width / 2 + Math.sin(timeRef.current) * 200,
    0,
    canvas.width / 2 + Math.cos(timeRef.current) * 200,
    canvas.height
  );
  
  const hue1 = Math.sin(gradientAngleRef.current) * 60 + 240;
  const hue2 = Math.cos(gradientAngleRef.current) * 60 + 280;
  const hue3 = (hue1 + hue2) / 2;
  
  gradient.addColorStop(0, `hsla(${hue1}, 70%, 20%, 0.8)`);
  gradient.addColorStop(0.5, `hsla(${hue3}, 70%, 15%, 0.8)`);
  gradient.addColorStop(1, `hsla(${hue2}, 70%, 20%, 0.8)`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let i = 0; i < canvas.width; i += 30) {
    for (let j = 0; j < canvas.height; j += 20) {
      const x = i + Math.sin(j * 0.01 + timeRef.current) * 20;
      const y = j;
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  }
  ctx.stroke();

  particlesRef.current.forEach(particle => {
    particle.update(mousePosition.x, mousePosition.y, canvas.width, canvas.height);
    particle.draw(ctx);
  });

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const stride = 4; // RGBA values
  const pixelCount = data.length / stride;
  const noiseFrequency = 0.001; // Original noise frequency

  for (let i = 0; i < pixelCount; i++) {
    if (Math.random() < noiseFrequency) {
      const baseIndex = i * stride;
      const value = Math.random() * 255;
      data[baseIndex] = value;     // R
      data[baseIndex + 1] = value; // G
      data[baseIndex + 2] = value; // B
    }
  }
  ctx.putImageData(imageData, 0, 0);

  animationFrameId.current = requestAnimationFrame(() => animate(ctx, canvas));
}, [mousePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for non-transparent background

    setCanvasSize(canvas, ctx);
    particlesRef.current = initParticles(canvas.width, canvas.height);

    const handleResize = () => {
      setCanvasSize(canvas, ctx);
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    animate(ctx, canvas);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate, setCanvasSize, initParticles]);

  const buttonHoverVariants = useMemo(() => ({
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }), []);

  const floatingVariants = useMemo(() => ({
    animate: {
      y: [0, 10, 0],
      borderColor: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)']
    }
  }), []);

  return (
    <div className="relative h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'black' }}
      />
      
      <motion.div 
        className="relative z-10 h-full flex items-center"
        style={{ y, opacity }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-4xl"
          >
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-9xl font-bold mb-4 sm:mb-6 leading-tight"
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.3)',
                WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                '@media (min-width: 768px)': {
                  WebkitTextStroke: '2px rgba(255,255,255,0.1)'
                }
              }}
              animate={{
                textShadow: [
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 40px rgba(255,255,255,0.5)',
                  '0 0 20px rgba(255,255,255,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Campus
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400">
                Pulse
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-xl backdrop-blur-sm bg-white/5 p-4 sm:p-6 rounded-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              Where every moment becomes a memory, and every event tells a story.
            </motion.p>

            {/* Stats cards */}
            <div className="mt-8 flex flex-row space-x-6 mb-8">
              <motion.div
                className="backdrop-blur-lg bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="text-xl sm:text-3xl font-bold">2+</div>
                <div className="text-xs sm:text-sm text-white/60">Active Events</div>
              </motion.div>
              
              <motion.div
                className="backdrop-blur-lg bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <div className="text-xl sm:text-3xl font-bold">2K+</div>
                <div className="text-xs sm:text-sm text-white/60">Students</div>
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-medium text-base sm:text-lg relative overflow-hidden group w-full sm:w-auto text-center"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="relative z-10">Explore Events</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-lg rounded-full font-medium text-base sm:text-lg border border-white/20 hover:bg-white/20 transition-colors w-full sm:w-auto text-center"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <a href="https://linkedin.com/in/mohit-paddhariya" className="block truncate">
                  Designed & Developed by Mohit
                </a>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 sm:bottom-12 right-4 sm:right-12 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <a href="#events" className='flex items-center space-x-4 sm:space-x-6'>
          <div className="text-xs sm:text-sm font-medium opacity-60">Scroll to discover</div>
          <motion.div
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 flex items-center justify-center"
            variants={floatingVariants}
            animate="animate"
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ↓
          </motion.div>
        </a>
      </motion.div>
    </div>
  );
};
export default HeroSection;