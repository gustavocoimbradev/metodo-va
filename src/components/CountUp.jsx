import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export const CountUp = ({
    to,
    from = 0,
    direction = "up",
    delay = 0,
    duration = 2,
    className = "",
    startWhen = true,
    separator = ".",
    suffix = "",
    prefix = ""
}) => {
    const ref = useRef(null);
    const [displayValue, setDisplayValue] = useState(from);

    // Changed margin from -100px to 0px (or even positive) to ensure early triggering
    // Use "once: true" so it plays once.
    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (isInView && startWhen) {
            let startTime;
            let animationFrame;

            const animate = (time) => {
                if (!startTime) startTime = time;
                const progress = Math.min((time - startTime) / (duration * 1000), 1);
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);

                const current = from + (to - from) * ease;
                setDisplayValue(current);

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate);
                }
            };

            const timeoutId = setTimeout(() => {
                animationFrame = requestAnimationFrame(animate);
            }, delay * 1000);

            return () => {
                cancelAnimationFrame(animationFrame);
                clearTimeout(timeoutId);
            };
        }
    }, [isInView, startWhen, from, to, delay, duration]);

    // Format the number
    const formatted = Math.floor(displayValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return (
        <span ref={ref} className={className}>
            {prefix}{formatted}{suffix}
        </span>
    );
};
