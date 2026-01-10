import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useIsMobile } from "../hooks/useIsMobile";

const ParticlesHero = ({ color = "#3b82f6" }) => {
    const [init, setInit] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (!isMobile) {
            initParticlesEngine(async (engine) => {
                await loadSlim(engine);
            }).then(() => {
                setInit(true);
            });
        }
    }, [isMobile]);

    if (!init || isMobile) return null;

    return (
        <Particles
            id="tsparticles"
            className="absolute inset-0 z-0"
            options={{
                fullScreen: {
                    enable: false,
                    zIndex: 0
                },
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                        },
                        onHover: {
                            enable: false,
                        },
                        resize: true,
                    },
                },
                particles: {
                    color: {
                        value: color,
                    },
                    shadow: {
                        enable: false, // Disabled for performance
                        blur: 15,
                        color: color
                    },
                    links: {
                        color: color,
                        distance: 150,
                        enable: true,
                        opacity: 0.3,
                        width: 1,
                        triangles: {
                            enable: false, // Disabled for performance
                            opacity: 0.05,
                            color: color
                        }
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: true,
                        speed: 0.4,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: isMobile ? 50 : 270, // Optimized for mobile
                    },
                    opacity: {
                        value: { min: 0.1, max: 0.6 },
                        animation: {
                            enable: true,
                            speed: 1,
                            sync: false
                        }
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 2, max: 6 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticlesHero;
