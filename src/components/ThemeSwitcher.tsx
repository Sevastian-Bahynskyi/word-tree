import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [hover, setHover] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light')

    // NEW: A clear boolean to drive the conditional animations
    const isLight = theme === 'light'
    const sunOpacity = isLight ? 0 : 1

    return (
        <div
            className="fixed top-4 left-4 w-20 h-20 cursor-pointer"
            onClick={toggle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* background */}
            <div
                className={`absolute inset-0 rounded-full border-2 shadow-lg transition-colors duration-500
          ${isLight
                        ? 'bg-gradient-to-br from-sky-100 to-sky-200 border-sky-300'
                        : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600'}`}
            />

            {/* sun */}
            <motion.div
                className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 shadow-lg"
                style={{
                    top: '50%', left: '50%',
                    translate: '-50% -50%',
                    pointerEvents: 'none'
                }}
                animate={{ opacity: sunOpacity }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Orbital container */}
            <motion.div
                className="absolute inset-0"
                // MODIFIED: Rotation is now conditional. It animates to 0 in light mode.
                animate={{ rotate: isLight ? 0 : 360 }}
                // MODIFIED: Transition is also conditional to enable/disable the infinite loop.
                transition={isLight
                    ? { duration: 0.8, ease: 'easeInOut' } // Smoothly stop rotation
                    : { duration: 16, repeat: Infinity, ease: 'linear' } // Start and maintain rotation
                }
            >
                {/* earth+moon container */}
                <motion.div
                    className="absolute left-1/2" // Base horizontal centering
                    // MODIFIED: All positional and scale animations are now conditional
                    animate={{
                        scale: isLight ? 1 : 0.3,
                        top: isLight ? '50%' : '10px',      // Center vs Orbit
                        y: isLight ? '-50%' : '0%',         // Center vs Orbit
                        x: '-50%',                          // Always horizontally centered
                    }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    {/* earth */}
                    <motion.div
                        className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-green-400 to-blue-500 shadow-md"
                        animate={{ rotate: 360, scale: hover ? 1.1 : 1 }}
                        transition={{
                            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                            scale: { duration: 0.3 }
                        }}
                    >
                        <div className="absolute top-1 left-1 w-2 h-2 bg-green-600 rounded-full opacity-80" />
                        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-green-600 rounded-full opacity-80" />
                    </motion.div>

                    {/* moon orbit */}
                    <motion.div
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: 0, height: 0,
                            transformOrigin: '0px 0px'
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: hover ? 2 : 4,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    >
                        <div
                            className="absolute w-3 h-3 rounded-full bg-gray-300 shadow-sm"
                            style={{
                                top: '-20px', left: '0px',
                                translate: '-50% -50%'
                            }}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}