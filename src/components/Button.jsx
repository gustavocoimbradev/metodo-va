import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Primary Button - Gradient with shimmer effect
export const PrimaryButton = ({
    children,
    onClick,
    href,
    icon = false,
    className = "",
    variant = "blue", // blue | purple
    ...props
}) => {
    const variants = {
        blue: "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)]",
        purple: "bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600 shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]"
    };

    const baseClasses = `px-8 py-4 ${variants[variant] || variants.blue} bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap`;

    if (href) {
        return (
            <motion.a
                href={href}
                whileTap={{ scale: 0.98 }}
                className={`${baseClasses} ${className}`}
                {...props}
            >
                {children}
                {icon && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            </motion.a>
        );
    }

    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className={`${baseClasses} ${className}`}
            {...props}
        >
            {children}
            {icon && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
        </motion.button>
    );
};

// Secondary Button - Glass/outline style (Sober)
export const SecondaryButton = ({
    children,
    onClick,
    href,
    className = "",
    ...props
}) => {
    const baseClasses = "px-8 py-4 bg-white/5 border border-white/10 text-slate-200 hover:text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-md cursor-pointer whitespace-nowrap hover:bg-white/10 hover:border-white/20";

    if (href) {
        return (
            <motion.a
                href={href}
                whileTap={{ scale: 0.98 }}
                className={`${baseClasses} ${className}`}
                {...props}
            >
                {children}
            </motion.a>
        );
    }

    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className={`${baseClasses} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};


