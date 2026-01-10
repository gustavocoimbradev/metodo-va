import { motion } from "framer-motion"

export const BlurReveal = ({
    children,
    delay = 0,
    duration = 0.8,
    className = ""
}) => {
    const text = String(children)
    const words = text.split(" ")

    // Counter to keep track of total characters for global delay calculation
    let charIndex = 0

    return (
        <div className={`flex flex-wrap gap-x-[0.25em] ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="inline-flex whitespace-nowrap">
                    {word.split("").map((char, j) => {
                        const currentDelay = delay + (charIndex * 0.05)
                        charIndex++

                        return (
                            <motion.span
                                key={j}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                    filter: "blur(10px)",
                                    x: -5
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                    x: 0
                                }}
                                transition={{
                                    duration: duration,
                                    delay: currentDelay,
                                    ease: [0.2, 0.65, 0.3, 0.9],
                                }}
                                className="inline-block"
                            >
                                {char}
                            </motion.span>
                        )
                    })}
                </span>
            ))}
        </div>
    )
}
