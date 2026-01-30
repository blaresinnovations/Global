import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import assets from '../assets/images/images'

const GlobalGatePreloader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo with subtle animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8
          }}
          className="mb-6"
        >
          <div className="relative w-40 h-40">
            <img
              src={assets.logo2}
              alt="Global Gate"
              className="w-full h-full object-contain"
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-100"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        

        {/* Loading dots */}
        <div className="flex items-center justify-center space-x-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalGatePreloader;