import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const phrases = [
    "Advocacia de Excelência",
    "Gestão & Tecnologia",
    "Transformação de Carreiras"
];

const Preloader = ({ onComplete }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Cycle through phrases
        if (index < phrases.length) {
            const timeout = setTimeout(() => {
                setIndex((prev) => prev + 1);
            }, 1200); // Speed up slightly: 1.2s per phrase
            return () => clearTimeout(timeout);
        } else {
            // Finished phrases, wait a bit then complete
            const timeout = setTimeout(() => {
                onComplete();
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [index, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] text-white"
            initial={{ opacity: 1 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
            <div className="relative">
                <motion.div
                    key={index}
                    initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-100%", opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-2xl md:text-4xl font-bold tracking-tight text-center px-4 py-4"
                >
                    {index < phrases.length ? (
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            {phrases[index]}
                        </span>
                    ) : (
                        <span className="text-white text-5xl md:text-7xl font-black tracking-tighter">
                            Método V&A
                        </span>
                    )}
                </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-24 left-0 w-full px-10 md:px-20">
                <div className="w-full h-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4.5, ease: "linear" }}
                    />
                </div>
            </div>

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        </motion.div>
    );
};

export default Preloader;
