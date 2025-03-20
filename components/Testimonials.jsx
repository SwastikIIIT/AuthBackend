import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "This authentication system has transformed how we handle user security. The implementation was seamless and our users love the experience.",
    author: "Alex Morgan",
    role: "CTO, TechSolutions Inc."
  },
  {
    quote: "We've reduced our authentication-related support tickets by 80% since implementing this system. The reliability and user experience are outstanding.",
    author: "Sarah Chen",
    role: "Head of Product, DataFlow"
  },
  {
    quote: "The flexibility of this auth solution allowed us to customize the flow exactly to our brand's needs. Our conversion rate has improved dramatically.",
    author: "Michael Rodriguez",
    role: "CEO, Startup Ventures"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <section className="w-full bg-black py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Enhanced background gradient with multiple layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
      
      {/* Multiple purple glow effects with different sizes and positions */}
      <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-800/10 blur-[80px]"></div>
      <div className="absolute top-2/3 left-2/3 h-64 w-64 rounded-full bg-purple-500/10 blur-[120px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="inline-block py-1 px-3 text-xs font-medium tracking-wider text-purple-400 uppercase bg-purple-900/30 rounded-full mb-4">Testimonials</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
          >
            What Our Clients Say
          </motion.h2>
        </div>

        <div className="relative flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl h-80 relative">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-full h-full"
              >
                <div className={cn(
                  "p-8 sm:p-10 md:p-12 h-full flex flex-col justify-center",
                  "bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg",
                  "shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                )}>
                  <Quote className="text-purple-500 w-10 h-10 mb-6 opacity-60" />
                  <p className="text-white text-lg sm:text-xl mb-6 leading-relaxed">{testimonials[currentIndex].quote}</p>
                  <div>
                    <h4 className="text-purple-400 font-semibold">{testimonials[currentIndex].author}</h4>
                    <p className="text-gray-400 text-sm">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full mx-1.5 transition-all duration-300 ${
                  currentIndex === index ? "bg-purple-600 w-8" : "bg-white/20 hover:bg-white/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;