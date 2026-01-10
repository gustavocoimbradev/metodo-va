import { motion } from "framer-motion";

export const ScrollReveal = ({
    children,
    animation = "fade-up", // fade-up, fade-in, slide-left, slide-right, scale-up
    delay = 0,
    duration = 0.6,
    className = "",
    viewport = { once: true, margin: "-50px" }
}) => {

    const variants = {
        "fade-up": {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
        },
        "fade-in": {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        },
        "slide-left": {
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 }
        },
        "slide-right": {
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 }
        },
        "scale-up": {
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 }
        },
        "blur-up": {
            hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" }
        },
        "fade-up-large": {
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={variants[animation] || variants["fade-up"]}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
