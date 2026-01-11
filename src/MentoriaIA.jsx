import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
    Brain, Cpu, Zap, Clock, Target, TrendingUp, Users, ArrowRight,
    CheckCircle, Star, MessageCircle, FileText, Rocket, Settings,
    BarChart3, Sparkles, Shield, X, Award, BookOpen, Lightbulb,
    Landmark, Briefcase, FileSearch
} from 'lucide-react'
import { BlurReveal } from './components/BlurReveal'
import { ScrollReveal } from './components/ScrollReveal'
import { FloatingChatWidget } from './components/FloatingChatWidget'
import ParticlesHero from './components/ParticlesHero'
import ParticlesSection from './components/ParticlesSection'
import Container from './components/Container'
import { PrimaryButton, SecondaryButton } from './components/Button'
import BackgroundIcons from './components/BackgroundIcons'
import { CountUp } from './components/CountUp'
import Footer from './components/Footer'
import { useIsMobile } from './hooks/useIsMobile'

// --- Components ---

const GlassCard = ({ children, className = "" }) => (
    <div className={`backdrop-blur-xl bg-blue-950/30 border border-blue-200/5 rounded-3xl p-8 shadow-2xl ${className}`}>
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

const MasteryCard = ({ icon: Icon, title, description, items }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-gradient-to-br from-blue-950/60 to-slate-900/60 border border-blue-500/10 rounded-2xl p-6 md:p-8 hover:border-cyan-500/30 transition-all duration-300 h-full"
    >
        <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mt-3">{title}</h3>
        </div>
        <p className="text-slate-400 mb-5 leading-relaxed">{description}</p>
        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </motion.div>
)

const TargetCard = ({ icon: Icon, title, description, isPositive = true }) => (
    <div className={`p-6 rounded-2xl border h-full ${isPositive ? 'bg-gradient-to-br from-blue-950/50 to-cyan-950/30 border-cyan-500/20' : 'bg-slate-900/30 border-slate-700/30'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isPositive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
            <Icon className="w-6 h-6" />
        </div>
        <h4 className={`font-bold mb-2 ${isPositive ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
        <p className={`text-sm leading-relaxed ${isPositive ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>
    </div>
)

const StatCard = ({ value, label, icon: Icon, suffix = '' }) => (
    <div className="text-center p-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Icon className="w-7 h-7 text-cyan-400" />
        </div>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
            {typeof value === 'number' ? (
                <><CountUp to={value} duration={2.5} />{suffix}</>
            ) : (
                value
            )}
        </div>
        <div className="text-slate-400 text-sm">{label}</div>
    </div>
)

// --- AI Mentorship Messages for Chat ---
const AI_MENTORSHIP_MESSAGES = {
    initial: [
        { text: 'Olá! Sou Túlio Viana. Vi que você está interessado na mentoria de IA para Advocacia! 🤖' },
        { text: 'Quer saber como usar inteligência artificial para produzir 10x mais com qualidade no seu escritório?' }
    ],
    followUp: [
        { text: 'Na mentoria, ensino como usar IA para criar petições, contratos e pareceres de forma rápida e precisa.' },
        { text: 'Você vai aprender a automatizar tarefas repetitivas e reduzir seus custos operacionais em até 80%.' },
        { text: 'A mentoria é 100% prática. Nada de teoria vazia. Você vai sair aplicando no seu dia a dia!' },
        { text: 'Posso te explicar como rodar seu escritório 100% com IA. Vamos conversar? 💬' }
    ]
}

// --- Countdown Timer Component ---
const COUNTDOWN_KEY_IA = 'mentoria_ia_countdown_end'

const CountdownTimer = () => {
    const getInitialTime = () => {
        const saved = localStorage.getItem(COUNTDOWN_KEY_IA)
        if (saved) {
            const endTime = parseInt(saved, 10)
            const now = Date.now()
            const diff = endTime - now

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                return { hours, minutes, seconds }
            }
        }
        // No saved time or expired - set new 24h countdown
        const newEndTime = Date.now() + (24 * 60 * 60 * 1000)
        localStorage.setItem(COUNTDOWN_KEY_IA, newEndTime.toString())
        return { hours: 23, minutes: 59, seconds: 59 }
    }

    const [timeLeft, setTimeLeft] = useState(getInitialTime)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 }
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
                } else {
                    // Timer ended - reset localStorage and restart
                    const newEndTime = Date.now() + (24 * 60 * 60 * 1000)
                    localStorage.setItem(COUNTDOWN_KEY_IA, newEndTime.toString())
                    return { hours: 23, minutes: 59, seconds: 59 }
                }
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const pad = (n) => n.toString().padStart(2, '0')

    return (
        <div className="flex items-center justify-center gap-3 text-white">
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-center min-w-[70px]">
                <div className="text-2xl md:text-3xl font-bold text-cyan-400">{pad(timeLeft.hours)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Horas</div>
            </div>
            <span className="text-2xl text-cyan-400 font-bold">:</span>
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-center min-w-[70px]">
                <div className="text-2xl md:text-3xl font-bold text-cyan-400">{pad(timeLeft.minutes)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Min</div>
            </div>
            <span className="text-2xl text-cyan-400 font-bold">:</span>
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-center min-w-[70px]">
                <div className="text-2xl md:text-3xl font-bold text-cyan-400">{pad(timeLeft.seconds)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Seg</div>
            </div>
        </div>
    )
}

// --- Main Page ---

function MentoriaIA() {
    const isMobile = useIsMobile()
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const openChatWidget = () => {
        window.dispatchEvent(new CustomEvent('openChatWidget'))
    }

    const masteryAreas = [
        {
            icon: FileSearch,
            title: 'IA Aplicada a Conteúdo e Produção',
            description: 'Gere petições, contratos, pareceres e conteúdos de marketing com velocidade e precisão.',
            items: ['Petições iniciais e contestações', 'Impugnações e recursos com um clique', 'Pareceres técnicos aprofundados', 'Conteúdo de marketing instantâneo']
        },
        {
            icon: Sparkles,
            title: 'Padronização e Velocidade',
            description: 'Crie templates inteligentes que mantêm qualidade enquanto aceleram entregas.',
            items: ['Templates inteligentes e dinâmicos', 'Redução drástica de erros humanos', 'Padronização de escrita do sócio', 'Alta velocidade sem perda de rigor']
        },
        {
            icon: Settings,
            title: 'Templates e Fluxos de Trabalho',
            description: 'Automatize tarefas repetitivas e libere tempo para o que realmente importa.',
            items: ['IA no dia a dia do advogado', 'Eliminação de tarefas burocráticas', 'Fluxos de produção otimizados', 'Automação de rotinas repetitivas']
        },
        {
            icon: Users,
            title: 'Produtividade e Escala do Time',
            description: 'Faça sua equipe produzir mais sem trabalhar mais — com ferramentas de IA integradas.',
            items: ['Multiplicação da força produtiva', 'Custos reduzidos em até 80%', 'Produção 10x superior comprovada', 'Escritório rodando 100% com IA']
        }
    ]

    const targetAudience = [
        { icon: Landmark, title: 'Quer faturamento milionário', description: 'Sem mágica, sem atalhos — apenas trabalho estruturado e execução impecável com o Método V&A.', isPositive: true },
        { icon: TrendingUp, title: 'Busca crescer com previsibilidade', description: 'Escritórios que desejam expandir de forma organizada, sustentável e com resultados mensuráveis.', isPositive: true },
        { icon: BarChart3, title: 'Quer organização total', description: 'Transformar rotina caótica em processos claros, time alinhado e atendimento padronizado de excelência.', isPositive: true },
        { icon: Brain, title: 'Deseja produtividade com IA', description: 'Usar inteligência artificial para ganhar tempo, produzir 10x mais e manter padrão de qualidade elevado.', isPositive: true },
    ]

    const notForYou = [
        { icon: X, title: 'Busca "atalho mágico"', description: 'Se você acredita em fórmulas milagrosas que prometem resultados sem esforço, esta mentoria não é para você.', isPositive: false },
        { icon: X, title: 'Não quer implementar', description: 'Nosso método funciona apenas para quem está disposto a implementar, testar, ajustar e persistir.', isPositive: false },
        { icon: X, title: 'Quer apenas teoria', description: 'Se procura conteúdo genérico e superficial, há opções mais baratas. Nossa mentoria é prática e profunda.', isPositive: false },
        { icon: X, title: 'Sucesso antes do trabalho', description: 'No dicionário sucesso vem antes de trabalho. Na vida real, é exatamente o oposto.', isPositive: false },
    ]

    return (
        <div className="bg-[#020617] text-slate-100 min-h-screen overflow-x-hidden selection:bg-cyan-500/30 font-sans">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-400 origin-left z-50 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ scaleX }}
            />

            <FloatingChatWidget
                mentorName="Túlio Viana"
                mentorImage="/img/tulio-profile.webp"
                customMessages={AI_MENTORSHIP_MESSAGES}
                themeColor="blue"
            />

            {/* Background Ambience */}
            <motion.div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <GradientBlob className="bg-cyan-900 top-[-10%] left-[-10%] w-[60vw] h-[60vw]" />
                <GradientBlob className="bg-blue-900 top-[40%] right-[-20%] w-[50vw] h-[50vw]" />
                <GradientBlob className="bg-indigo-900/30 bottom-[-10%] left-[10%] w-[70vw] h-[70vw]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </motion.div>

            <BackgroundIcons variant="blue" />

            <main className="relative z-10">

                {/* ========== HERO SECTION ========== */}
                <section className="relative w-full min-h-screen flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-[#020617]">
                        <ParticlesHero color="#06b6d4" />
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
                                transition={{ duration: 0.8 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                            >
                                <Brain className="w-4 h-4 text-cyan-400" />
                                <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">IA para Advocacia</span>
                            </motion.div>

                            <motion.div
                                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                                animate={isMobile ? undefined : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <span className="text-lg md:text-xl font-bold tracking-tighter bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 bg-clip-text text-transparent">
                                    Método V&A • Com Túlio Viana
                                </span>
                            </motion.div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                                <BlurReveal delay={0.3} duration={1}>
                                    Impulsione seu Escritório
                                </BlurReveal>
                                <motion.span
                                    initial={isMobile ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(10px)" }}
                                    animate={isMobile ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ delay: 1.2, duration: 1 }}
                                    className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text block mt-2"
                                >
                                    usando IA
                                </motion.span>
                            </h1>


                            <p className="text-base md:text-lg lg:text-xl text-slate-300 max-w-xl leading-relaxed font-light drop-shadow-lg">
                                <BlurReveal delay={1.5} duration={1}>
                                    A IA não é o futuro — é o presente para quem quer competir no mais alto nível. Aprenda a usar inteligência artificial para produzir 10x mais com qualidade superior.
                                </BlurReveal>
                            </p>

                            <motion.div
                                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                animate={isMobile ? undefined : { opacity: 1, y: 0 }}
                                transition={{ delay: 2, duration: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <PrimaryButton onClick={() => scrollToSection('inscricao')} icon>
                                    Quero Me Inscrever
                                </PrimaryButton>
                                <SecondaryButton onClick={openChatWidget}>
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Falar com Túlio
                                </SecondaryButton>
                            </motion.div>
                        </div>


                    </Container>
                </section>

                {/* ========== ABOUT MENTOR ========== */}
                <Section id="sobre" className="py-20 md:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal animation="slide-right">
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src="/img/tulio.webp"
                                        alt="Túlio Viana"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal animation="slide-left">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                                    <Brain className="w-3 h-3" /> Seu Mentor
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white">
                                    Túlio Viana
                                </h2>
                                <p className="text-xl text-cyan-400 font-medium font-bold uppercase tracking-wide">
                                    Especialista em Inteligência Artificial e Direito do Trabalho
                                </p>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    Túlio é pioneiro na aplicação de IA na advocacia brasileira. Ele revolucionou a forma como o escritório produz conteúdo, atende clientes e escala resultados — tudo com inteligência artificial.
                                </p>
                                <p className="text-slate-300 leading-relaxed italic border-l-4 border-cyan-500 pl-6">
                                    &quot;Minha mentoria ensina advogados a rodarem seus escritórios 100% em IA, multiplicando produtividade sem perder qualidade, segurança ou personalização no atendimento.&quot;
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-xs">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-slate-300 font-bold">Pioneiro em IA Jurídica</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-xs">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-slate-300 font-bold">Escala Sem Barreiras</span>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </Section>

                {/* ========== WHAT YOU'LL MASTER ========== */}
                <Section id="dominar" className="py-20 md:py-32">
                    <ParticlesSection id="particles-skills" density={30} color="#22d3ee" className="opacity-30" />

                    <ScrollReveal animation="blur-up" className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
                            <BookOpen className="w-3 h-3" /> Conhecimento Prático
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            O Que Você Vai <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Dominar</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                            Uso prático de IA para produzir mais, com mais qualidade e consistência — sem perder segurança e método.
                        </p>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 gap-8">
                        {masteryAreas.map((area, index) => (
                            <ScrollReveal key={index} animation={index % 2 === 0 ? "slide-right" : "slide-left"}>
                                <MasteryCard {...area} />
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal animation="fade-up" className="mt-12">
                        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/10">
                            <p className="text-lg text-slate-300 leading-relaxed font-light">
                                &quot;Esta mentoria leva seu escritório para a era da inteligência artificial — onde produtividade e qualidade não são mais trade-offs.&quot;
                            </p>
                        </div>
                    </ScrollReveal>
                </Section>

                {/* ========== TARGET AUDIENCE ========== */}
                <Section id="para-quem" className="py-20 md:py-32">
                    <ScrollReveal animation="blur-up" className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
                            <Target className="w-3 h-3" /> Para Quem é Esta Mentoria
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Esta Mentoria é Para <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent italic">Você Se:</span>
                        </h2>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {targetAudience.map((item, index) => (
                            <ScrollReveal key={index} animation="fade-up" delay={index * 0.1}>
                                <TargetCard {...item} />
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Not For You Section */}
                    <ScrollReveal animation="fade-up-large" duration={1} viewport={{ once: true, amount: 0.2 }} className="mt-20">
                        <GlassCard className="!bg-slate-900/50 border-slate-700/30">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Shield className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Atenção: Essa mentoria não é para você, se:</h3>
                                    <p className="text-slate-500 text-sm">Seja honesto consigo mesmo antes de seguir em frente.</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {notForYou.map((item, index) => (
                                    <ScrollReveal key={index} animation="fade-up" delay={index * 0.1}>
                                        <TargetCard {...item} />
                                    </ScrollReveal>
                                ))}
                            </div>
                            <p className="text-slate-500 text-sm mt-6 text-center font-medium">
                                O Método V&A é para advogados sérios, comprometidos e determinados a transformar suas carreiras.
                            </p>
                        </GlassCard>
                    </ScrollReveal>
                </Section>

                {/* ========== AUTHORITY / RESULTS ========== */}
                <Section id="resultados" className="py-20 md:py-32 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal animation="slide-right">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                                    <Rocket className="w-3 h-3" /> Impacto Real
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                    Escritório Viana & Arantes <br /> <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Autoridade Comprovada</span>
                                </h2>
                                <p className="text-slate-300 leading-relaxed text-lg font-light">
                                    Somos o escritório que saiu do zero e se consolidou como uma referência nacional no Direito do Trabalho, com faturamento milionário e excelência operacional.
                                </p>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-950/30 border border-blue-500/10">
                                        <Zap className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-xs">Produtividade 10x</h4>
                                            <p className="text-slate-400 text-sm">Nossa equipe produz em escala industrial com qualidade artesanal através do uso inteligente de IA.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-950/30 border border-blue-500/10">
                                        <Briefcase className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-xs">Escritório Milionário</h4>
                                            <p className="text-slate-400 text-sm">Mais de 15 colaboradores diretos e sede própria operada com tecnologia de ponta.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal animation="slide-left">
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard value={1500} label="Processos Ativos" icon={CheckCircle} suffix="+" />
                                <StatCard value={700} label="5 estrelas no Google" icon={Star} suffix="+" />
                                <StatCard value={15} label="Colaboradores" icon={Users} suffix="+" />
                                <StatCard value={10} label="Aumento de Velocidade" icon={Zap} suffix="x" />
                            </div>
                        </ScrollReveal>
                    </div>
                </Section>

                {/* ========== CTA SECTION ========== */}
                <Section id="inscricao" className="py-20 md:py-32">
                    <GlassCard className="relative overflow-hidden !bg-gradient-to-br !from-cyan-950/50 !to-blue-950/50 border-cyan-500/20">
                        <ParticlesSection id="particles-cta" density={30} color="#22d3ee" className="opacity-30" />

                        <div className="relative z-10 text-center max-w-3xl mx-auto py-8">
                            <ScrollReveal animation="blur-up">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-6">
                                    <Zap className="w-4 h-4 text-cyan-400" />
                                    <span className="text-cyan-300 text-sm font-bold uppercase tracking-widest">Inscrições Abertas</span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    Assuma a Liderança <br /> <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent italic">da era da Inteligência Artificial</span>
                                </h2>

                                <div className="mb-8">
                                    <p className="text-slate-400 text-xs mb-4 uppercase tracking-[0.2em] font-medium">Esta oferta expira em:</p>
                                    <CountdownTimer />
                                </div>

                                {/* Pricing */}
                                <div className="bg-slate-950/60 border border-cyan-500/20 rounded-2xl p-8 mb-8 shadow-2xl">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <span className="text-slate-500 line-through text-xl">R$ 5.997,00</span>
                                        <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">33% OFF</span>
                                    </div>
                                    <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tighter">
                                        R$ 3.997<span className="text-2xl text-cyan-400/50">,00</span>
                                    </div>
                                    <p className="text-slate-400">ou em até 12x de <span className="text-white font-bold">R$ 399,08</span></p>
                                </div>

                                <blockquote className="border-l-4 border-cyan-600 pl-6 py-4 text-left bg-cyan-950/10 rounded-r-xl mb-8 max-w-2xl mx-auto">
                                    <p className="text-slate-200 italic text-lg mb-2 font-light leading-relaxed">
                                        &quot;IA Jurídica reduz custos em até 80% e aumenta a produtividade em até 10 vezes. O Método V&A é estratégia comprovada por quem já construiu o sucesso.&quot;
                                    </p>
                                    <footer className="text-cyan-400 font-bold uppercase tracking-widest text-xs">— Túlio Viana</footer>
                                </blockquote>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <PrimaryButton
                                        href="https://pay.hotmart.com/tulio-mentoria"
                                        icon
                                        className="text-lg px-10 py-5 shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all"
                                    >
                                        Garantir Minha Vaga Agora
                                    </PrimaryButton>
                                    <SecondaryButton onClick={openChatWidget} className="text-lg px-10 py-5">
                                        Falar com um Especialista
                                    </SecondaryButton>
                                </div>

                                <p className="text-slate-500 text-sm mt-8 flex items-center justify-center gap-2 font-medium">
                                    🔒 Pagamento 100% seguro • Garantia de 7 dias
                                </p>
                            </ScrollReveal>
                        </div>
                    </GlassCard>
                </Section>

                {/* ========== FOOTER ========== */}
                <Footer accentColor="cyan" />

            </main>
        </div>
    )
}

export default MentoriaIA
