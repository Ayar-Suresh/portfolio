import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Emotion Types & Mapping ---
// --- Emotion Types & Mapping ---
export type Emotion =
    | 'idle' | 'list-checked' | 'love' | 'middle-finger-angry' | 'no-no' | 'okay-done'
    | 'quetionmark' | 'raining' | 'rocket-scare' | 'shit' | 'sleeping'
    | 'socked' | 'star' | 'wait-time-loop' | 'work-burdon' | '100thbirthday'
    | 'angel' | 'angry-attack' | 'bathing' | 'brainstorm' | 'coffee-mug'
    | 'cool-walk-with-snel' | 'cry' | 'demon-inside' | 'eating'
    | 'effords-put-pant' | 'eyes-on-you' | 'fulllove' | 'full-stomach'
    | 'hellow' | 'hide-quetions' | 'laughing';

const animationMap: Record<Emotion, string> = {
    'idle': '/Animation/hellow.lottie',
    'list-checked': '/Animation/list-checked.lottie',
    'love': '/Animation/love.lottie',
    'middle-finger-angry': '/Animation/middle-finger-angry.lottie',
    'no-no': '/Animation/no-no.lottie',
    'okay-done': '/Animation/okay-done.lottie',
    'quetionmark': '/Animation/quetionmark.lottie',
    'raining': '/Animation/raining.lottie',
    'rocket-scare': '/Animation/rocket-scare.lottie',
    'shit': '/Animation/shit.lottie',
    'sleeping': '/Animation/sleeping.lottie',
    'socked': '/Animation/socked.lottie',
    'star': '/Animation/star.lottie',
    'wait-time-loop': '/Animation/wait-time-loop.lottie',
    'work-burdon': '/Animation/work-burdon.lottie',
    '100thbirthday': '/Animation/100thbirthday.lottie',
    'angel': '/Animation/angel.lottie',
    'angry-attack': '/Animation/angry-attack.lottie',
    'bathing': '/Animation/bathing.lottie',
    'brainstorm': '/Animation/brainstorm.lottie',
    'coffee-mug': '/Animation/coffee-mug.lottie',
    'cool-walk-with-snel': '/Animation/cool-walk-with-snel.lottie',
    'cry': '/Animation/cry.lottie',
    'demon-inside': '/Animation/demon-inside.lottie',
    'eating': '/Animation/eating.lottie',
    'effords-put-pant': '/Animation/effords-put-pant.lottie',
    'eyes-on-you': '/Animation/eyes-on-you.lottie',
    'fulllove': '/Animation/fulllove.lottie',
    'full-stomach': '/Animation/full-stomach.lottie',
    'hellow': '/Animation/hellow.lottie',
    'hide-quetions': '/Animation/hide-quetions.lottie',
    'laughing': '/Animation/laughing.lottie',
};

// Priority: Higher number overrides lower.
const emotionPriority: Record<Emotion, number> = {
    'idle': 0,
    'wait-time-loop': 1,
    'sleeping': 1,
    'coffee-mug': 1,
    'cool-walk-with-snel': 1,
    'hellow': 1,
    'eyes-on-you': 1,
    'hide-quetions': 1,
    'brainstorm': 2, // Thinking
    'work-burdon': 3,
    'effords-put-pant': 3,
    'laughing': 4,
    'cry': 4,
    'love': 4,
    'fulllove': 4,
    'socked': 4,
    'rocket-scare': 4,
    'angel': 4,
    'demon-inside': 4,
    'no-no': 4,
    'okay-done': 4,
    'shit': 4,
    'star': 5,
    '100thbirthday': 5,
    'eating': 5,
    'full-stomach': 5,
    'bathing': 5,
    'list-checked': 5,
    'quetionmark': 6,
    'angry-attack': 6,
    'middle-finger-angry': 6,
    'raining': 6,
};


interface CharacterStageProps {
    currentEmotion: Emotion;
    isTyping?: boolean; // Chatbot typing state
    className?: string;
}

const CharacterStage = React.memo(function CharacterStage({ currentEmotion, className = "" }: CharacterStageProps) {
    const [displayedEmotion, setDisplayedEmotion] = useState<Emotion>('idle');
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Refs for logic
    const lastEmotionTimeRef = useRef<number>(Date.now());

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Visibility & Performance ---
    useEffect(() => {
        // 1. Visibility Change (Tab switch)
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };

        // 2. Intersection Observer (Scroll off-screen)
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 } // At least 10% visible
        );

        if (containerRef.current) observer.observe(containerRef.current);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);


    // --- Emotion Logic (Debounce, Priority, Decay) ---
    useEffect(() => {
        const handleEmotionChange = () => {
            const now = Date.now();
            const timeSinceLastChange = now - lastEmotionTimeRef.current;
            const MIN_DISPLAY_TIME = 1000; // 1s minimum

            // Check Priority
            const currentPriority = emotionPriority[displayedEmotion];
            const newPriority = emotionPriority[currentEmotion];

            // If new emotion is LOWER priority, ignore unless minimum time passed
            // OR unless it's a critical state reset (like going back to idle from high priority after decay)
            // Ideally, we let the parent component handle the holistic logic, but we enforce debounce here.

            // Actually, the prompt says "Emotion priority rules... Higher priority emotions override lower ones."
            // And "Prevent idle from interrupting critical states."

            // Let's implement a safe switching logic:
            // 1. If new priority > current priority -> Switch immediately (cancel debounce).
            // 2. If new priority <= current priority -> Wait for min display time.

            const shouldSwitchImmediately = newPriority > currentPriority;

            if (shouldSwitchImmediately || timeSinceLastChange >= MIN_DISPLAY_TIME) {
                setDisplayedEmotion(currentEmotion);
                lastEmotionTimeRef.current = now;
            } else {
                // Debounce/Queue: If we are blocked, we could schedule a check, 
                // but if the parent changes 'currentEmotion' rapidly, we might miss intermediate ones.
                // For a mascot, skipping rapid intermediates is actually DESIRED (prevent flickering).
                // However, we must ensure we eventually process the latest state if it persists.

                if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

                debounceTimeoutRef.current = setTimeout(() => {
                    setDisplayedEmotion(currentEmotion);
                    lastEmotionTimeRef.current = Date.now();
                }, MIN_DISPLAY_TIME - timeSinceLastChange);
            }
        };

        handleEmotionChange();

        return () => {
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        };
    }, [currentEmotion, displayedEmotion]);


    // --- Idle System logic is handled in the PARENT (AIChat) as per instructions?
    // "After 6 seconds of inactivity: trigger random idle animation... Return to idle afterward."
    // Wait, if I implement it here, I don't know about "user typing" or "chat lifecycle".
    // The Prompt says: "Idle system: After 6 seconds of inactivity... Goal: mascot feels alive even when chat is quiet."
    // It's better if `AIChat` passes `idle` and `internal idle logic` handles the variations.
    // OR `AIChat` passes the explicit random idle states.
    // The Prompt says "Add new section -> Idle Character Logic... Return to idle afterward."
    // This implies the standard state is 'idle', but the system injects variety.
    // I will implement this in `AIChat` to keep `CharacterStage` "dumb" and purely reactive to props,
    // OR I can make `CharacterStage` smart about "visual idling".
    // Let's make `CharacterStage` handle purely VISUAL idle variations if the prop is 'idle'.
    // NO, `AIChat` has the "chat lifecycle" context (user typing vs long delay).
    // So `AIChat` should drive the state. 
    // `CharacterStage` just renders what it's told. 
    // I will implement the timer logic in `AIChat`.


    // --- Error Handling ---
    const handleLoadError = () => {
        console.warn(`Failed to load animation: ${displayedEmotion}`);
        setHasError(true);
        // Fallback to idle if specific emotion fails
        if (displayedEmotion !== 'idle') {
            setDisplayedEmotion('idle');
        }
    };

    const handleLoadSuccess = () => {
        setIsLoading(false);
        setHasError(false);
    };


    // --- Render ---
    const animSrc = import.meta.env.BASE_URL + (animationMap[displayedEmotion] || animationMap['idle']).replace(/^\//, '');

    return (
        <div
            ref={containerRef}
            className={`relative mx-auto select-none pointer-events-none ${className}`}
            style={{
                contain: 'layout paint'
            }}
        >
            {/* Cinematic Backgrounds - Glassmorphism & Parallax feel */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Cosmic Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#7e6ee3] opacity-10 blur-[100px] rounded-full animate-pulse-slow" />

                {/* Floor Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Grid/Context */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 80%, transparent)'
                    }}
                />
            </div>

            {/* Animation Container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {isVisible && (
                        <motion.div
                            key={displayedEmotion} // Key change triggers transition
                            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                            transition={{
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1] // Cubic bezier for smooth feeling
                            }}
                            className="w-full h-full flex items-center justify-center"
                        >


                            {!hasError ? (
                                <DotLottieReact
                                    src={animSrc}
                                    loop
                                    autoplay

                                    width="100%"
                                    height="100%"
                                    onError={handleLoadError}
                                    onLoad={handleLoadSuccess}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        maxWidth: '500px' // Prevent being too huge on wide screens
                                    }}
                                />
                            ) : (
                                // Fallback visual if lottie completely fails 
                                <div className="text-white/20 text-4xl font-mono animate-pulse">
                                    (Wait...)
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Particles Overlay (Optional cinematic touch) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Can add simple CSS particles here if needed, keeping it clean for now */}
            </div>
        </div>
    );
});

export { CharacterStage };
