import { motion } from 'framer-motion';
import { Scale, Gavel, FileText, Brain, Cpu, Code, Briefcase, Shield, TrendingUp, Users } from 'lucide-react';

const ICONS = [
    { Icon: Scale, x: '5%', y: '15%', size: 40, delay: 0 },
    { Icon: Gavel, x: '90%', y: '25%', size: 35, delay: 0.5 },
    { Icon: FileText, x: '15%', y: '45%', size: 32, delay: 1 },
    { Icon: Brain, x: '85%', y: '55%', size: 45, delay: 1.5 },
    { Icon: Cpu, x: '8%', y: '70%', size: 38, delay: 2 },
    { Icon: Code, x: '92%', y: '80%', size: 36, delay: 2.5 },
    { Icon: Briefcase, x: '3%', y: '35%', size: 30, delay: 0.3 },
    { Icon: Shield, x: '95%', y: '10%', size: 34, delay: 0.8 },
    { Icon: TrendingUp, x: '12%', y: '85%', size: 32, delay: 1.2 },
    { Icon: Users, x: '88%', y: '65%', size: 38, delay: 1.8 },
];

const FloatingIcon = ({ Icon, x, y, size, delay, variant }) => {
    const colorClass = variant === "purple" ? "text-purple-400/30" : "text-blue-400/30";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: [0.03, 0.08, 0.03],
                scale: [1, 1.1, 1],
                y: [0, -15, 0]
            }}
            transition={{
                duration: 8,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="absolute pointer-events-none"
            style={{
                left: x,
                top: y,
                filter: 'blur(1px)'
            }}
        >
            <Icon
                size={size}
                className={colorClass}
                strokeWidth={1}
            />
        </motion.div>
    );
};

const BackgroundIcons = ({ variant = "blue" }) => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {ICONS.map((icon, index) => (
                <FloatingIcon key={index} {...icon} variant={variant} />
            ))}
        </div>
    );
};


export default BackgroundIcons;
