import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useSpring, AnimatePresence, useMotionValueEvent } from 'framer-motion'
import {
    Brain, X, CheckCircle, Check, BookOpen, PlayCircle, MessageCircle,
    ChevronDown, ChevronUp, Users, Award, Star, ShieldCheck, Download, Instagram,
    Video, Phone, Target, Cpu
} from 'lucide-react'
import { BlurReveal } from '../components/BlurReveal'
import { ScrollReveal } from '../components/ScrollReveal'
import { FloatingChatWidget } from '../components/FloatingChatWidget'
import ParticlesHero from '../components/ParticlesHero'
import Container from '../components/Container'
import { PrimaryButton, SecondaryButton } from '../components/Button'
import BackgroundIcons from '../components/BackgroundIcons'
import Footer from '../components/Footer'
import { useIsMobile } from '../hooks/useIsMobile'

// --- Theme Configuration ---
const themeConfig = {
    cyan: {
        badgeBg: "bg-cyan-500/10",
        badgeBorder: "border-cyan-500/20",
        badgeText: "text-cyan-400",
        textHighlight: "text-cyan-400",
        gradientText: "from-cyan-400 to-blue-400",
        gradientBg: "from-cyan-500 to-blue-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]",
        blobPrimary: "bg-cyan-900",
        blobSecondary: "bg-blue-900",
        buttonVariant: "default",
        selection: "selection:bg-cyan-500/30",
        checkIcon: "text-cyan-400",
        checkBg: "bg-cyan-950/20",
        checkBorder: "border-cyan-500/20",
        checkShadow: "shadow-[0_0_15px_rgba(34,211,238,0.05)]",
        iconContainer: "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20",
        cardBorderHover: "hover:border-cyan-500/30",
        footerAccent: "blue", // Fallback to blue for now as footer prop might expect specific strings
        accordionBorder: "border-cyan-500/10",
        accordionIcon: "text-cyan-400",
        accordionContentBorder: "border-cyan-500/5",
        ctaButtonShadow: "shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)]",
        heroOverlay: "bg-blue-600/10",
        countdownBorder: "border-cyan-500/30",
        countdownText: "text-cyan-400",
        glassCardBg: "bg-blue-950/30",
        glassCardBorder: "border-blue-200/5",
        // Deliverables specific
        deliverablesBoxBg: "bg-[#0b1025]",
        deliverablesBoxBorder: "border-blue-900/30",
        deliverablesIconBorder: "border-blue-500",
        deliverablesIconColor: "text-blue-500",
        deliverablesCardBg: "bg-blue-900/20",
        deliverablesCardBorder: "border-blue-800/30",
        deliverablesCardBgHover: "hover:bg-blue-900/30",
        deliverablesCardIconBg: "bg-blue-600/20",
        deliverablesCardIconColor: "text-blue-400"
    },
    purple: {
        badgeBg: "bg-purple-500/10",
        badgeBorder: "border-purple-500/20",
        badgeText: "text-purple-400",
        textHighlight: "text-purple-400",
        gradientText: "from-purple-400 to-violet-400",
        gradientBg: "from-purple-500 to-violet-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]",
        blobPrimary: "bg-purple-900",
        blobSecondary: "bg-violet-900",
        buttonVariant: "purple",
        selection: "selection:bg-purple-500/30",
        checkIcon: "text-purple-400",
        checkBg: "bg-purple-950/20",
        checkBorder: "border-purple-500/20",
        checkShadow: "shadow-[0_0_15px_rgba(168,85,247,0.05)]",
        iconContainer: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20",
        cardBorderHover: "hover:border-purple-500/30",
        footerAccent: "purple", // Fallback to purple
        accordionBorder: "border-purple-500/10",
        accordionIcon: "text-purple-400",
        accordionContentBorder: "border-purple-500/5",
        ctaButtonShadow: "shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]",
        heroOverlay: "bg-purple-600/10",
        countdownBorder: "border-purple-500/30",
        countdownText: "text-purple-400",
        glassCardBg: "bg-purple-950/30",
        glassCardBorder: "border-purple-200/5",
        // Deliverables specific
        deliverablesBoxBg: "bg-[#180b25]",
        deliverablesBoxBorder: "border-purple-900/30",
        deliverablesIconBorder: "border-purple-500",
        deliverablesIconColor: "text-purple-500",
        deliverablesCardBg: "bg-purple-900/20",
        deliverablesCardBorder: "border-purple-800/30",
        deliverablesCardBgHover: "hover:bg-purple-900/30",
        deliverablesCardIconBg: "bg-purple-600/20",
        deliverablesCardIconColor: "text-purple-400"
    }
}

// --- Components ---

const GlassCard = ({ children, className = "", themeStyles }) => (
    <div className={`backdrop-blur-xl rounded-3xl p-8 shadow-2xl ${themeStyles.glassCardBg} border ${themeStyles.glassCardBorder} ${className}`}>
        {children}
    </div>
)

const Section = ({ children, className = "", id = "" }) => (
    <section id={id} className={`relative py-20 md:py-32 ${className}`}>
        <Container>
            {children}
        </Container>
    </section>
)

const GradientBlob = ({ className }) => (
    <div className={`absolute rounded-full blur-[100px] opacity-40 pointer-events-none mix-blend-screen ${className}`} />
)

// --- Countdown Timer Component ---
const CountdownTimer = ({ countdownKey, themeStyles, compact = false }) => {
    // Helper to calculate time left from a target end timestamp
    const calculateTimeLeft = (target) => {
        const now = Date.now()
        const diff = target - now
        if (diff <= 0) return { total: 0, hours: 0, minutes: 0, seconds: 0 }

        return {
            total: diff,
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
        }
    }

    // Initialize: ensure we have a valid end time in localStorage
    const getEndTime = () => {
        const saved = localStorage.getItem(countdownKey)
        const now = Date.now()
        if (saved) {
            const parsed = parseInt(saved, 10)
            if (parsed > now) return parsed
        }
        // If missing or expired, set new 24h from now
        const newTime = now + (24 * 60 * 60 * 1000)
        localStorage.setItem(countdownKey, newTime.toString())
        return newTime
    }

    // Single source of truth for the end time
    const [endTime] = useState(getEndTime)
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endTime))

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft(endTime)
            setTimeLeft(remaining)

            // If expired, reset (optional logic, keeping consistent with previous behavior)
            if (remaining.total <= 0) {
                const now = Date.now()
                const newTime = now + (24 * 60 * 60 * 1000)
                localStorage.setItem(countdownKey, newTime.toString())
                // Force a reload or just let the next mount handle it? 
                // For now, let's just stop or restart. 
                // To behave exactly like before (loop 24h), we'd need to update 'endTime' state too.
                // But simply letting it hit 00:00:00 is often safer than indefinite loops.
                // The previous code reset it. Let's strict sync for now.
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [endTime, countdownKey])

    const pad = (n) => n.toString().padStart(2, '0')

    if (compact) {
        return (
            <div className="flex items-center gap-1 font-mono font-bold text-white tabular-nums leading-none text-sm md:text-base">
                <div className="bg-slate-800/80 rounded px-1.5 py-1 min-w-[24px] text-center">{pad(timeLeft.hours)}</div>
                <span className="text-slate-500 opacity-50">:</span>
                <div className="bg-slate-800/80 rounded px-1.5 py-1 min-w-[24px] text-center">{pad(timeLeft.minutes)}</div>
                <span className="text-slate-500 opacity-50">:</span>
                <div className="bg-slate-800/80 rounded px-1.5 py-1 min-w-[24px] text-center text-white">{pad(timeLeft.seconds)}</div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center gap-3 text-white mb-6">
            <div className={`bg-slate-900/80 border rounded-xl px-4 py-3 text-center min-w-[70px] ${themeStyles.countdownBorder}`}>
                <div className={`text-2xl md:text-3xl font-bold ${themeStyles.countdownText}`}>{pad(timeLeft.hours)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Horas</div>
            </div>
            <span className={`text-2xl font-bold ${themeStyles.countdownText}`}>:</span>
            <div className={`bg-slate-900/80 border rounded-xl px-4 py-3 text-center min-w-[70px] ${themeStyles.countdownBorder}`}>
                <div className={`text-2xl md:text-3xl font-bold ${themeStyles.countdownText}`}>{pad(timeLeft.minutes)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Min</div>
            </div>
            <span className={`text-2xl font-bold ${themeStyles.countdownText}`}>:</span>
            <div className={`bg-slate-900/80 border rounded-xl px-4 py-3 text-center min-w-[70px] ${themeStyles.countdownBorder}`}>
                <div className={`text-2xl md:text-3xl font-bold ${themeStyles.countdownText}`}>{pad(timeLeft.seconds)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Seg</div>
            </div>
        </div>
    )
}

const FAQItem = ({ question, answer, themeStyles, isOpen, onToggle }) => {
    return (
        <div className={`border rounded-2xl bg-slate-900/40 overflow-hidden ${themeStyles.accordionBorder}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition-colors"
                type="button"
            >
                <span className="font-bold text-white text-lg">{question}</span>
                {isOpen ? <ChevronUp className={themeStyles.accordionIcon} /> : <ChevronDown className="text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className={`p-6 pt-0 text-slate-300 leading-relaxed border-t ${themeStyles.accordionContentBorder}`}>
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function DownloadIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download w-8 h-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
    )
}

// --- Main Template ---

export default function MentorshipPageTemplate({
    content,
    theme, // { primary: 'cyan', secondary: 'blue', text: 'cyan', hex: '#06b6d4' }
    heroPersonaImage,
    heroPersonaImageStyle, // { maskImage: ... }
    mentorImage,
    countdownKey,
    HeroBadgeIcon, // Component
    ProblemIcon, // Component
    SolutionIcon // Component
}) {
    const isMobile = useIsMobile()
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const [openFaqIndex, setOpenFaqIndex] = useState(null)

    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setShowStickyCTA(latest > 500); // Show after 500px scroll
    });

    const scrollToCheckout = () => {
        if (content.cta?.links?.checkout) {
            window.location.href = content.cta.links.checkout;
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const openChatWidget = () => {
        window.dispatchEvent(new CustomEvent('openChatWidget'))
    }


    // Get Static Styles
    const themeStyles = themeConfig[theme.primary] || themeConfig.cyan;

    return (
        <div className={`bg-[#020617] text-slate-100 min-h-screen overflow-x-hidden ${themeStyles.selection} font-sans`}>
            <motion.div
                className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r ${themeStyles.gradientBg} origin-left z-50`}
                style={{ scaleX }}
            />

            <FloatingChatWidget
                mentorName={content.chat.mentor_name}
                mentorImage={mentorImage}
                customMessages={content.chat.custom_messages}
                themeColor={theme.primary}
                customBottom={showStickyCTA ? "bottom-24" : "bottom-8"}
            />

            {/* Background Ambience */}
            <motion.div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <GradientBlob className={`${themeStyles.blobPrimary} top-[-10%] left-[-10%] w-[60vw] h-[60vw]`} />
                <GradientBlob className={`${themeStyles.blobSecondary} top-[40%] right-[-20%] w-[50vw] h-[50vw]`} />
                <GradientBlob className="bg-indigo-900/30 bottom-[-10%] left-[10%] w-[70vw] h-[70vw]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </motion.div>

            <BackgroundIcons variant={theme.primary} />

            <main className="relative z-10">

                {/* ========== HERO SECTION ========== */}
                <section className="relative w-full min-h-screen flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-[#020617]">
                        <ParticlesHero color={theme.hex} />
                        <div className="absolute inset-0 bg-[#020617]/80 md:bg-transparent pointer-events-none md:hidden" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent pointer-events-none hidden md:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
                    </div>

                    <Container className="relative z-20 min-h-screen flex flex-col justify-center pointer-events-none py-20">
                        <div className="space-y-6 md:space-y-8 max-w-[600px] relative z-30 pointer-events-auto text-left px-2 md:px-0">

                            {/* Badge */}
                            <motion.div
                                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                                animate={isMobile ? undefined : { opacity: 1, y: 0 }}
                                transition={isMobile ? { duration: 0 } : { duration: 0.8 }}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${themeStyles.badgeBg} border ${themeStyles.badgeBorder}`}
                            >
                                <HeroBadgeIcon className={`w-4 h-4 ${themeStyles.badgeText}`} />
                                <span className={`${themeStyles.badgeText} text-sm font-bold uppercase tracking-wider`}>{content.hero.badge}</span>
                            </motion.div>

                            <motion.div
                                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                                animate={isMobile ? undefined : { opacity: 1, y: 0 }}
                                transition={isMobile ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
                            >
                                <span className="text-lg md:text-xl font-bold tracking-tighter bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 bg-clip-text text-transparent">
                                    {content.hero.header}
                                </span>
                            </motion.div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                                <BlurReveal delay={0.3} duration={1}>
                                    {content.hero.title.prefix}
                                </BlurReveal>
                                <motion.span
                                    initial={isMobile ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(10px)" }}
                                    animate={isMobile ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={isMobile ? { duration: 0 } : { delay: 1.2, duration: 1 }}
                                    className={`bg-gradient-to-r ${themeStyles.gradientText} text-transparent bg-clip-text block mt-2`}
                                >
                                    {content.hero.title.highlight}
                                </motion.span>
                            </h1>

                            <p className="text-base md:text-lg lg:text-xl text-slate-300 max-w-xl leading-relaxed font-light drop-shadow-lg">
                                <BlurReveal delay={1.5} duration={1}>
                                    {content.hero.description}
                                </BlurReveal>
                            </p>

                            <motion.div
                                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                animate={isMobile ? undefined : { opacity: 1, y: 0 }}
                                transition={isMobile ? { duration: 0 } : { delay: 2, duration: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <PrimaryButton onClick={() => scrollToSection('inscricao-final')} icon variant={themeStyles.buttonVariant}>
                                    {content.hero.buttons.primary}
                                </PrimaryButton>
                                <SecondaryButton onClick={openChatWidget} variant={themeStyles.buttonVariant}>
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    {content.hero.buttons.secondary}
                                </SecondaryButton>
                            </motion.div>
                        </div>

                        {/* Persona Image */}
                        {heroPersonaImage && (
                            <div className="absolute bottom-0 right-0 h-[90vh] lg:h-[105vh] w-full lg:w-[65%] items-end justify-end pointer-events-none hidden md:flex">
                                <motion.div
                                    initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                                    animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                                    transition={isMobile ? { duration: 0 } : { duration: 1, delay: 0.5 }}
                                    className="relative h-full w-auto right-[-5%] lg:right-[-2%] z-10 flex items-end"
                                >
                                    <img
                                        src={heroPersonaImage}
                                        alt="Mentor"
                                        className={`h-full w-auto object-contain object-bottom drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] contrast-[1] brightness-[.8] saturate-[1.1]`}
                                        style={heroPersonaImageStyle && heroPersonaImageStyle.filter ? { filter: heroPersonaImageStyle.filter } : {}}
                                    />
                                    <div
                                        className={`absolute inset-0 w-full h-full mix-blend-color pointer-events-none ${themeStyles.heroOverlay}`}
                                        style={{
                                            ...heroPersonaImageStyle,
                                            maskImage: `url('${heroPersonaImage}')`,
                                            maskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            maskPosition: 'bottom',
                                            WebkitMaskImage: `url('${heroPersonaImage}')`,
                                            WebkitMaskSize: 'contain',
                                            WebkitMaskRepeat: 'no-repeat',
                                            WebkitMaskPosition: 'bottom'
                                        }}
                                    />
                                </motion.div>
                            </div>
                        )}
                    </Container>
                </section>

                {/* ========== PROBLEM / SOLUTION ========== */}
                <Section id="solucao" className="bg-slate-950/50">
                    <ScrollReveal animation="fade-up" className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            O que esta mentoria <span className={`bg-gradient-to-r ${themeStyles.gradientText} bg-clip-text text-transparent`}>Resolve</span>
                        </h2>
                        <p className="text-slate-400 text-lg uppercase tracking-widest font-bold text-xs line-clamp-1">(Promessa forte, sem mágica)</p>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <ScrollReveal animation="slide-right">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <X className="text-red-400" /> {content.problem ? content.problem.title : "Dores Comuns"}
                                </h3>
                                <ul className="space-y-4">
                                    {(content.problem?.items || [
                                        "Você gasta horas pesquisando manual?",
                                        "Sente insegurança ao aplicar o método?",
                                        "Tem medo de errar na estratégia?",
                                        "Sente que seu escritório parou no tempo?"
                                    ]).map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-400 bg-red-950/20 p-4 rounded-xl border border-red-500/10">
                                            <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal animation="slide-left">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <CheckCircle className={themeStyles.checkIcon} /> {content.solution ? content.solution.title : "Com o Método V&A"}
                                </h3>
                                <ul className="space-y-4">
                                    {(content.solution?.items || [
                                        "Triplicar sua velocidade de produção",
                                        "Reduzir custos operacionais drasticamente",
                                        "Segurança técnica no uso do método",
                                        "Escalar seu escritório sem aumentar equipe"
                                    ]).map((item, i) => (
                                        <li key={i} className={`flex items-start gap-3 text-slate-200 ${themeStyles.checkBg} p-4 rounded-xl border ${themeStyles.checkBorder} ${themeStyles.checkShadow}`}>
                                            <Check className={`w-5 h-5 ${themeStyles.checkIcon} shrink-0 mt-0.5`} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal animation="fade-up" className="mt-16 text-center">
                        <p className="text-xl text-slate-300 mb-8">
                            Resultados validados por <strong className="text-white">centenas de advogados</strong>.
                        </p>
                        <PrimaryButton onClick={() => scrollToSection('inscricao-final')} variant={themeStyles.buttonVariant} className="mx-auto !w-fit !px-10 !py-3 !text-base">
                            QUERO AVANÇAR AGORA
                        </PrimaryButton>
                    </ScrollReveal>
                </Section>

                {/* ========== WHAT YOU WILL LEARN ========== */}
                <Section id="aprendizado">
                    <ScrollReveal animation="blur-up" className="text-center mb-16">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeStyles.badgeBg} border ${themeStyles.badgeBorder} ${themeStyles.badgeText} text-xs font-bold tracking-widest uppercase mb-4`}>
                            <BookOpen className="w-3 h-3" /> Conteúdo Programático
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            O Que Você Vai <span className={`bg-gradient-to-r ${themeStyles.gradientText} bg-clip-text text-transparent`}>Aprender</span>
                        </h2>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {(content.mastery?.cards || []).map((item, idx) => (
                            <ScrollReveal key={idx} animation="fade-up" delay={idx * 0.1}>
                                <div className={`bg-slate-900/40 border border-slate-700/50 ${themeStyles.cardBorderHover} p-8 rounded-2xl transition-all hover:bg-slate-800/60 h-full group`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-6 transition-colors ${themeStyles.iconContainer}`}>
                                        {item.icon === 'Cpu' ? <Cpu className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-400 leading-relaxed font-light mb-4">{item.description || item.desc}</p>

                                    {/* Render Sub-items if available */}
                                    {item.items && item.items.length > 0 && (
                                        <ul className="space-y-2 border-t border-slate-700/30 pt-4 mt-4">
                                            {item.items.map((subItem, sIdx) => (
                                                <li key={sIdx} className="flex items-start gap-2 text-sm text-slate-500">
                                                    <Check className={`w-3 h-3 mt-0.5 ${themeStyles.checkIcon}`} />
                                                    <span>{subItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12 w-full">
                        <ScrollReveal animation="fade-up">
                            <PrimaryButton onClick={() => scrollToSection('inscricao-final')} variant={themeStyles.buttonVariant}>
                                QUERO ADQUIRIR AGORA
                            </PrimaryButton>
                        </ScrollReveal>
                    </div>
                </Section>

                {/* ========== HOW IT WORKS ========== */}
                <Section id="como-funciona" className="bg-gradient-to-b from-slate-950 to-[#020617]">
                    <ScrollReveal animation="blur-up" className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Como <span className={themeStyles.textHighlight}>Funciona</span>
                        </h2>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <ScrollReveal animation="fade-up" delay={0}>
                            <div className="text-center">
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border mb-6 ${themeStyles.badgeBg} ${themeStyles.badgeBorder} ${themeStyles.badgeText}`}>
                                    <PlayCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Encontros Ao Vivo</h3>
                                <p className="text-slate-400">Aulas síncronas para aprofundamento e prática guiada.</p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal animation="fade-up" delay={0.2}>
                            <div className="text-center">
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border mb-6 ${themeStyles.badgeBg} ${themeStyles.badgeBorder} ${themeStyles.badgeText}`}>
                                    <MessageCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Community & Networking</h3>
                                <p className="text-slate-400">Grupo exclusivo para troca de experiências e networking.</p>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal animation="fade-up" delay={0.4}>
                            <div className="text-center">
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border mb-6 ${themeStyles.badgeBg} ${themeStyles.badgeBorder} ${themeStyles.badgeText}`}>
                                    <Download className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Materiais Exclusivos</h3>
                                <p className="text-slate-400">Acesso a prompts, templates e materiais de apoio.</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </Section>

                {/* ========== CTA AFTER HOW IT WORKS ========== */}
                <Section className="py-10">
                    <ScrollReveal animation="fade-up">
                        <div className="flex justify-center">
                            <PrimaryButton onClick={() => scrollToSection('inscricao-final')} variant={themeStyles.buttonVariant}>
                                QUERO DESTRAVAR MEU ESCRITÓRIO
                            </PrimaryButton>
                        </div>
                    </ScrollReveal>
                </Section>

                {/* ========== CALENDAR (Only renders if content exists) ========== */}
                {content.calendar && content.calendar.length > 0 && (
                    <Section id="calendario">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
                            <ScrollReveal animation="blur-up" className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-white mb-4">Roteiro dos Encontros</h2>
                                <p className="text-slate-400">Programe-se para não perder nada.</p>
                            </ScrollReveal>

                            <div className="space-y-4 max-w-3xl mx-auto">
                                {content.calendar.map((item, idx) => (
                                    <ScrollReveal key={idx} animation="fade-up" delay={idx * 0.1}>
                                        <div className={`flex items-center gap-6 p-6 rounded-xl bg-slate-950/50 border border-slate-800 ${themeStyles.cardBorderHover} transition-colors`}>
                                            <div className="shrink-0 w-32 text-center">
                                                <span className="block text-xl md:text-2xl font-bold text-white">{item.date}</span>
                                            </div>
                                            <div className="grow">
                                                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                        {/* ========== CTA AFTER CALENDAR ========== */}
                        <div className="flex justify-center mt-12">
                            <ScrollReveal animation="fade-up">
                                <PrimaryButton onClick={() => scrollToSection('inscricao-final')} variant={themeStyles.buttonVariant}>
                                    COMPRAR NA KIWIFY
                                </PrimaryButton>
                            </ScrollReveal>
                        </div>
                    </Section>
                )}


                {/* ========== TARGET AUDIENCE ========== */}
                <Section id="para-quem" className="bg-[#020617]">
                    <ScrollReveal animation="blur-up" className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Para Quem é <span className={themeStyles.textHighlight}>Esta Mentoria</span>
                        </h2>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 mb-20">
                        {/* Positive Audience Header */}
                        <div className="order-1 md:order-none md:col-start-1">
                            <ScrollReveal animation="slide-right">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                    <CheckCircle className={`w-6 h-6 ${themeStyles.checkIcon}`} />
                                    Para Quem É
                                </h3>
                            </ScrollReveal>
                        </div>

                        {/* Negative Audience Header */}
                        <div className="order-3 md:order-none md:col-start-2">
                            <ScrollReveal animation="slide-left">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                    <X className="w-6 h-6 text-red-500" />
                                    Para Quem NÃO É
                                </h3>
                            </ScrollReveal>
                        </div>

                        {Array.from({ length: Math.max((content.audience?.cards || []).length, (content.audience?.not_for_you?.cards || []).length) }).map((_, idx) => {
                            const itemPos = (content.audience?.cards || [])[idx];
                            const itemNeg = (content.audience?.not_for_you?.cards || [])[idx];

                            return [
                                <div key={`aud-pos-${idx}`} className="order-2 md:order-none md:col-start-1 h-full">
                                    {itemPos && (
                                        <ScrollReveal animation="fade-up" delay={idx * 0.1}>
                                            <div className={`p-6 rounded-2xl bg-slate-900/40 border border-slate-700/30 flex gap-4 h-full ${itemPos.isPositive === false ? 'opacity-50' : ''}`}>
                                                <div className={`mt-1 shrink-0 w-8 h-8 rounded-full ${themeStyles.checkBg} flex items-center justify-center`}>
                                                    <Check className={`w-4 h-4 ${themeStyles.checkIcon}`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{itemPos.title}</h4>
                                                    <p className="text-slate-400 text-sm mt-1">{itemPos.desc || itemPos.description}</p>
                                                </div>
                                            </div>
                                        </ScrollReveal>
                                    )}
                                </div>,
                                <div key={`aud-neg-${idx}`} className="order-4 md:order-none md:col-start-2 h-full">
                                    {itemNeg && (
                                        <ScrollReveal animation="fade-up" delay={idx * 0.1}>
                                            <div className="p-6 rounded-2xl bg-slate-900/40 border border-red-900/30 flex gap-4 h-full">
                                                <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-red-950/20 border border-red-500/20 flex items-center justify-center">
                                                    <X className="w-4 h-4 text-red-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{itemNeg.title}</h4>
                                                    <p className="text-slate-400 text-sm mt-1">{itemNeg.desc || itemNeg.description}</p>
                                                </div>
                                            </div>
                                        </ScrollReveal>
                                    )}
                                </div>
                            ];
                        })}
                    </div>
                </Section>

                {/* ========== CTA AFTER AUDIENCE ========== */}
                <Section className="py-10">
                    <ScrollReveal animation="fade-up">
                        <div className="flex justify-center">
                            <PrimaryButton onClick={() => scrollToSection('inscricao-final')} variant={themeStyles.buttonVariant}>
                                SIM, QUERO FAZER PARTE!
                            </PrimaryButton>
                        </div>
                    </ScrollReveal>
                </Section>

                {/* ========== ABOUT MENTOR ========== */}
                <Section id="sobre" className="py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-900/30 rounded-3xl p-8 md:p-12 border border-slate-800">
                        <ScrollReveal animation="slide-right">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative">
                                <motion.img
                                    src={mentorImage}
                                    alt={content.mentor.name}
                                    animate={{ scale: [1, 1.03, 1] }}
                                    transition={{ duration: 30, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1.0] }} // Ultra smooth cubic-bezier
                                    style={{ willChange: 'transform' }}
                                    className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal animation="slide-left">
                            <div className="space-y-6">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-widest uppercase ${themeStyles.badgeBg} ${themeStyles.badgeBorder} ${themeStyles.badgeText}`}>
                                    <Star className="w-3 h-3" /> {content.mentor.badge || 'Seu Mentor'}
                                </div>
                                <h2 className="text-4xl font-bold text-white">
                                    {content.mentor.name}
                                </h2>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    {content.mentor.bio || content.mentor.description}
                                </p>
                                <p className="text-slate-300 leading-relaxed italic border-l-4 border-slate-600 pl-6">
                                    &quot;{content.mentor.quote}&quot;
                                </p>

                                {content.mentor.instagram && (
                                    <div className="pt-4">
                                        <a
                                            href={content.mentor.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-500 transition-all duration-500 group ${themeStyles.textHighlight}`}

                                        >
                                            <Instagram className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                            <span className="font-bold opacity-80 group-hover:opacity-100 transition-opacity">Seguir no Instagram</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>
                    </div>
                </Section>

                {/* ========== DELIVERABLES (WHAT YOU RECEIVE) ========== */}
                {content.deliverables && (
                    <Section className="py-10">
                        <div className="max-w-6xl mx-auto">
                            {/* Prova de Autoridade Box */}
                            <ScrollReveal animation="fade-up">
                                <div className={`${themeStyles.deliverablesBoxBg} rounded-t-2xl p-6 md:p-8 flex gap-4 border ${themeStyles.deliverablesBoxBorder} mb-8`}>
                                    <div className="shrink-0 mt-1">
                                        <div className={`w-6 h-6 rounded border ${themeStyles.deliverablesIconBorder} flex items-center justify-center`}>
                                            <Check className={`w-4 h-4 ${themeStyles.deliverablesIconColor}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                            <strong className="text-white block mb-1">Prova de autoridade:</strong>
                                            {content.deliverables.authority_text}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal animation="fade-up" delay={0.2}>
                                <h3 className="text-2xl font-bold text-white mb-8">O que você recebe</h3>
                            </ScrollReveal>

                            <div className="grid md:grid-cols-3 gap-6">
                                {(content.deliverables.cards || []).map((card, idx) => (
                                    <ScrollReveal key={idx} animation="fade-up" delay={0.3 + (idx * 0.1)}>
                                        <div className={`${themeStyles.deliverablesCardBg} border ${themeStyles.deliverablesCardBorder} rounded-2xl p-6 ${themeStyles.deliverablesCardBgHover} transition-colors`}>
                                            <div className={`w-10 h-10 rounded-full ${themeStyles.deliverablesCardIconBg} flex items-center justify-center ${themeStyles.deliverablesCardIconColor} mb-4`}>
                                                {/* Dynamic Icon Rendering could go here, simplifying for now */}
                                                {idx === 0 ? <Video className="w-5 h-5" /> : idx === 1 ? <Phone className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-2">{card.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    </Section>
                )}

                {/* ========== FAQ ========== */}
                <Section id="faq">
                    <ScrollReveal animation="blur-up" className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Perguntas Frequentes</h2>
                    </ScrollReveal>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {(content.faq?.items || [
                            { question: "Preciso saber de programação?", answer: "Não." },
                            { question: "Serve para qualquer área?", answer: "Sim." }
                        ]).map((item, idx) => (
                            <ScrollReveal key={idx} animation="fade-up" delay={idx * 0.05}>
                                <FAQItem
                                    question={item.question}
                                    answer={item.answer}
                                    themeStyles={themeStyles}
                                    isOpen={openFaqIndex === idx}
                                    onToggle={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                />
                            </ScrollReveal>
                        ))}
                    </div>
                </Section>


                {/* ========== FINAL CTA ========== */}
                <Section id="inscricao-final" className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 ${themeStyles.blobSecondary}`} />
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto">
                        <ScrollReveal animation="fade-up" className="w-full">
                            <div className={`backdrop-blur-xl bg-slate-900/40 border-y md:border ${themeStyles.glassCardBorder} md:rounded-[3rem] p-8 md:p-16 text-center shadow-2xl overflow-hidden`}>
                                <div className="relative z-10">
                                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                        Transforme seu Escritório <br /> <span className={themeStyles.textHighlight}>Ainda Hoje.</span>
                                    </h2>
                                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                                        Não perca mais tempo com processos manuais. Junte-se aos advogados que estão liderando o mercado com IA.
                                    </p>

                                    <div className="flex justify-center mb-10 scale-90 md:scale-100">
                                        <CountdownTimer countdownKey={countdownKey} themeStyles={themeStyles} />
                                    </div>

                                    {content.cta?.pricing && (
                                        <div className="mb-10 text-center">
                                            <div className="text-slate-400 line-through text-lg mb-2">{content.cta.pricing.old}</div>
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <span className="text-4xl md:text-6xl font-black text-white">{content.cta.pricing.current}</span>
                                                <span className="text-xl text-slate-400 top-0">{content.cta.pricing.cents}</span>
                                            </div>
                                            {content.cta.pricing.installments_text && (
                                                <div className={`text-sm font-medium px-4 py-1 rounded-full bg-blue-500/10 ${themeStyles.textHighlight} inline-block`}>
                                                    {content.cta.pricing.installments_text} {content.cta.pricing.installment_value}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex flex-col items-center gap-4">
                                        <PrimaryButton
                                            href={content.cta?.links?.checkout}
                                            className={`text-lg px-10 py-4 w-full md:w-auto ${themeStyles.ctaButtonShadow}`}
                                            variant={themeStyles.buttonVariant}

                                        >
                                            COMPRAR NA KIWIFY
                                        </PrimaryButton>
                                        <p className="text-slate-500 text-sm flex items-center gap-2 mt-4">
                                            <ShieldCheck className="w-4 h-4" /> Satisfação garantida ou seu dinheiro de volta.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </Section>

                {/* ========== FOOTER ========== */}
                <Footer accentColor={themeStyles.footerAccent} />
                <div className="h-[180px] md:h-[80px]" />

            </main>

            {/* ========== STICKY CTA ========== */}
            <AnimatePresence>
                {showStickyCTA && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#020617]/90 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] pb-safe"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
                            {/* Desktop Left: Text + Countdown */}
                            <div className="hidden md:flex items-center gap-6">
                                <div>
                                    <p className="text-white font-bold text-sm uppercase tracking-wide">Desconto por Tempo Limitado</p>
                                    <p className="text-slate-400 text-xs">Garanta seu acesso agora</p>
                                </div>
                                <div className="flex items-center gap-2 pl-6 border-l border-white/10">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Oferta expira em:</span>
                                    <CountdownTimer countdownKey={countdownKey} themeStyles={themeStyles} compact={true} />
                                </div>
                            </div>

                            {/* Right/Mobile: Price + Button */}
                            <div className="flex items-center justify-between gap-4 w-full md:w-auto">
                                <div className="flex flex-col">
                                    {/* Mobile Countdown */}
                                    <div className="flex md:hidden items-center gap-2 mb-1">
                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Expira em:</span>
                                        <CountdownTimer countdownKey={countdownKey} themeStyles={themeStyles} compact={true} />
                                    </div>

                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-slate-500 line-through mb-0.5">{content.cta?.pricing?.old}</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className={`text-lg md:text-2xl font-black text-white ${themeStyles.textHighlight}`}>{content.cta?.pricing?.current}</span>
                                            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">ou 12x de {content.cta?.pricing?.installment_value}</span>
                                        </div>
                                    </div>
                                </div>

                                <PrimaryButton
                                    href={content.cta?.links?.checkout}
                                    className={`!py-2.5 !px-5 !text-sm !rounded-xl active:scale-95 ${themeStyles.ctaButtonShadow}`}
                                    variant={themeStyles.buttonVariant}
                                >
                                    COMPRAR NA KIWIFY
                                </PrimaryButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
