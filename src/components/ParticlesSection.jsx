import { useEffect, useState, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion, useInView } from "framer-motion";

const ParticlesSection = ({ id, className, density = 30, color = "#3b82f6" }) => {
    const [init, setInit] = useState(false);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className={`absolute inset-0 z-0 pointer-events-none ${className}`}
            style={{ filter: "blur(0.5px)" }}
        >
            <Particles
                id={id || "tsparticles-section-" + Math.random()}
                className="absolute inset-0"
                options={{
                    fullScreen: { enable: false },
                    background: { color: { value: "transparent" } },
                    fpsLimit: 60,
                    interactivity: { events: { onHover: { enable: false }, resize: true } },
                    particles: {
                        color: { value: color },
                        links: {
                            color: color,
                            distance: 150,
                            enable: true,
                            opacity: 0.25,
                            width: 1,
                        },
                        move: {
                            enable: true,
                            speed: 0.4,
                            direction: "none",
                            random: true,
                            straight: false,
                            outModes: "out",
                        },
                        number: {
                            density: { enable: true, area: 900 },
                            value: density,
                        },
                        opacity: {
                            value: { min: 0.2, max: 0.6 },
                            animation: {
                                enable: true,
                                speed: 0.5,
                                minimumValue: 0.1,
                                sync: false
                            }
                        },
                        shape: { type: "circle" },
                        size: {
                            value: { min: 1, max: 4 },
                        },
                        // Blur effect simulation via shadow
                        shadow: {
                            blur: 3,
                            color: { value: color },
                            enable: true,
                            offset: { x: 0, y: 0 }
                        }
                    },
                    detectRetina: true,
                }}
            />
            {/* Blurred background layer for depth effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 30% 70%, ${color}08 0%, transparent 50%), radial-gradient(circle at 70% 30%, ${color}05 0%, transparent 50%)`,
                    filter: "blur(40px)"
                }}
            />
        </motion.div>
    );
};

export default ParticlesSection;
