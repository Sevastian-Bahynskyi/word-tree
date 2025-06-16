import React, { useMemo, useState, useEffect } from 'react';
import { 
  motion, 
  useTime, 
  useTransform,
  useMotionValue, // <-- Import useMotionValue
  animate,          // <-- Import animate
  type Variants, 
} from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { createNoise3D } from 'simplex-noise';
import seedrandom from 'seedrandom';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

const seed = seedrandom(Date.now().toString());

const useNoiseGenerators = () => useMemo(() => {
  return Array.from({ length: 8 }, () => createNoise3D(seed));
}, []);

const AddNodeButton: React.FC<Props> = ({ onClick, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const noiseGenerators = useNoiseGenerators();
  const time = useTime();

  // --- THE SEAMLESS TRANSITION FIX ---
  // 1. Amplitude is now a MotionValue, initialized to 0.
  const amplitude = useMotionValue(0); 

  const targetAmplitude = 20;
  const freq = 3500;

  // 3. This effect animates the amplitude on hover change.
  useEffect(() => {
    // When isHovered is true, animate amplitude to 28.
    // When isHovered is false, animate amplitude back to 0.
    animate(amplitude, isHovered ? targetAmplitude : 0, {
      duration: 0.5, // Controls the speed of the "fade in" effect
      ease: 'easeOut',
    });
  }, [isHovered, amplitude]);

  // --- Making the animation intensity-aware ---
  // The useTransform hooks now depend on BOTH time and our new animated amplitude.
  const createTransform = (noiseIndex: number, zOffset: number) => {
    return useTransform([time, amplitude], ([t, a]) => {
      // The amount of distortion is now driven by the animated amplitude `a`.
      const noiseValue = noiseGenerators[noiseIndex](t / freq, noiseIndex * 5, zOffset);
      return 50 + noiseValue * a; 
    });
  };

  const r1 = createTransform(0, 1);
  const r2 = createTransform(1, 1);
  const r3 = createTransform(2, 1);
  const r4 = createTransform(3, 1);
  const r5 = createTransform(4, 101);
  const r6 = createTransform(5, 101);
  const r7 = createTransform(6, 101);
  const r8 = createTransform(7, 101);
  
  const borderRadius = useTransform(
    [r1, r2, r3, r4, r5, r6, r7, r8],
    (latest) => `${latest.slice(0, 4).map(v => `${v}%`).join(' ')} / ${latest.slice(4).map(v => `${v}%`).join(' ')}`
  );

  // ... (variants remain the same)
  const buttonContainerVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    disabled: { scale: 0.9, opacity: 0.6 },
    tap: { scale: 0.95 },
  };

  const morpherVariants: Variants = {
    initial: { boxShadow: '0 10px 20px -5px rgb(0 0 0 / 0.1)' },
    hover: { boxShadow: '0 15px 30px -5px rgb(139 92 246 / 0.4)' },
  };

  const iconVariants: Variants = {
    initial: { rotate: 0 },
    hover: { rotate: 90 },
  };
  
  const currentVariant = disabled ? 'disabled' : isHovered ? 'hover' : 'initial';

  return (
    <motion.div
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 w-24 h-24 flex items-center justify-center"
      variants={buttonContainerVariants}
      animate={currentVariant}
      whileTap={!disabled ? "tap" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.button
        onClick={onClick}
        disabled={disabled}
        title={disabled ? 'Select a node to add a child' : 'Add child node'}
        className={`
          w-20 h-20
          flex items-center justify-center
          text-2xl font-bold
          ${disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 text-white cursor-pointer'
          }
        `}
        variants={morpherVariants}
        // borderRadius is now always applied, because its initial value will be 50%
        style={{ borderRadius }}
      >
        <motion.div variants={iconVariants} animate={currentVariant}>
          <FaPlus />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default AddNodeButton;