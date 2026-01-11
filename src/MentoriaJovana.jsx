import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
    Brain, Cpu, Zap, Clock, Target, TrendingUp, Users, ArrowRight,
    CheckCircle, Star, MessageCircle, FileText, Rocket, Settings,
    BarChart3, Sparkles, Shield, X, Award, BookOpen, Lightbulb,
    LayoutDashboard, PieChart, BarChart, Landmark, Scale, Briefcase
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
import content from './api/mentoria-gestao.json'

// --- Components ---

const GlassCard = ({ children, className = "" }) => (
    <div className={`backdrop-blur-xl bg-purple-950/30 border border-purple-200/5 rounded-3xl p-8 shadow-2xl ${className}`}>
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
        className="bg-gradient-to-br from-purple-950/60 to-slate-900/60 border border-purple-500/10 rounded-2xl p-6 md:p-8 hover:border-purple-400/30 transition-all duration-300 h-full"
    >
        <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mt-3">{title}</h3>
        </div>
        <p className="text-slate-400 mb-5 leading-relaxed">{description}</p>
        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </motion.div>
)

const TargetCard = ({ icon: Icon, title, description, isPositive = true }) => (
    <div className={`p-6 rounded-2xl border h-full ${isPositive ? 'bg-gradient-to-br from-purple-950/50 to-violet-950/30 border-purple-500/20' : 'bg-slate-900/30 border-slate-700/30'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isPositive ? 'bg-purple-500/20 text-purple-400' : 'bg-red-500/10 text-red-400'}`}>
            <Icon className="w-6 h-6" />
        </div>
        <h4 className={`font-bold mb-2 ${isPositive ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
        <p className={`text-sm leading-relaxed ${isPositive ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>
    </div>
)

const StatCard = ({ value, label, icon: Icon, suffix = '' }) => (
    <div className="text-center p-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Icon className="w-7 h-7 text-purple-400" />
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

// --- Jovana Mentorship Messages for Chat ---
const JOVANA_MENTORSHIP_MESSAGES = {
    initial: [
        { text: 'Olá! Sou Jovana Arantes. Que bom ver seu interesse na mentoria de Gestão de Escritório! 💼' },
        { text: 'Quer transformar seu escritório em uma operação lucrativa e organizada?' }
    ],
    followUp: [
        { text: 'Na mentoria, eu ensino como criar processos que funcionam sem que você precise apagar incêndios todo dia.' },
        { text: 'Vamos organizar seu time, suas finanças e seus indicadores para você crescer com previsibilidade.' },
        { text: 'É uma mentoria focada em quem quer sair da operação e focar no estratégico.' },
        { text: 'Posso te explicar como funciona cada etapa do Método V&A aplicado à gestão. Vamos conversar? 💬' }
    ]
}

// --- Countdown Timer Component ---
const COUNTDOWN_KEY_JOVANA = 'mentoria_jovana_countdown_end'

const CountdownTimer = () => {
    const getInitialTime = () => {
        const saved = localStorage.getItem(COUNTDOWN_KEY_JOVANA)
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
        localStorage.setItem(COUNTDOWN_KEY_JOVANA, newEndTime.toString())
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
                    localStorage.setItem(COUNTDOWN_KEY_JOVANA, newEndTime.toString())
                    return { hours: 23, minutes: 59, seconds: 59 }
                }
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const pad = (n) => n.toString().padStart(2, '0')

    return (
        <div className="flex items-center justify-center gap-3 text-white">
            <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl px-4 py-3 text-center min-w-[70px]">
                <div className="text-2xl md:text-3xl font-bold text-purple-400">{pad(timeLeft.hours)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Horas</div>
            </div>
            <span className="text-2xl text-purple-400 font-bold">:</span>
            <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl px-4 py-3 text-center min-w-[70px]">
                <div className="text-2xl md:text-3xl font-bold text-purple-400">{pad(timeLeft.minutes)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Min</div>
            </div>
            <span className="text-2xl text-purple-400 font-bold">:</span>
            <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl px-4 py-3 text-center min-w-[70px]">
                <div className="text-2xl md:text-3xl font-bold text-purple-400">{pad(timeLeft.seconds)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Seg</div>
            </div>
        </div>
    )
}

// --- Main Page ---

function MentoriaJovana() {
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
            icon: Scale,
            title: 'Processos e Padrão de Atendimento',
            description: 'Crie sistemas que funcionam mesmo sem você, garantindo qualidade em cada interação.',
            items: ['Mapeamento de jornada do cliente', 'Padrão de atendimento premium', 'Rotinas operacionais claras', 'Segurança jurídica nos prazos']
        },
        {
            icon: BarChart,
            title: 'Rotina de Gestão e Indicadores',
            description: 'Aprenda a ler os números do seu escritório e tomar decisões baseadas em dados reais.',
            items: ['Controle de fluxo de caixa', 'Precificação estratégica', 'Gestão tributária e impostas', 'Painel de indicadores gerenciais']
        },
        {
            icon: Users,
            title: 'Organização de Equipe e Funções',
            description: 'Monte um time de alta performance com papéis claros e responsabilidades definidas.',
            items: ['Contratação de associados', 'Integração de novos colaboradores', 'Definição de cargos e funções (KPIs)', 'Cultura de responsabilidade']
        },
        {
            icon: TrendingUp,
            title: 'Crescimento com Previsibilidade',
            description: 'Expanda seu escritório de forma estruturada, sustentável e lucrativa.',
            items: ['Controller jurídico e sistemas', 'Escala sem perda de qualidade', 'Gargalos ocultos na operação', 'Visão estratégica do negócio']
        }
    ]

    const targetAudience = [
        { icon: Landmark, title: 'Quer faturamento milionário', description: 'Sem mágica, sem atalhos — apenas trabalho estruturado e execução impecável com o Método V&A.', isPositive: true },
        { icon: TrendingUp, title: 'Busca crescer com previsibilidade', description: 'Escritórios que desejam expandir de forma organizada, sustentável e com resultados mensuráveis.', isPositive: true },
        { icon: BarChart3, title: 'Quer organização total', description: 'Transformar rotina caótica em processos claros, time alinhado e atendimento padronizado de excelência.', isPositive: true },
        { icon: Users, title: 'Deseja produtividade real', description: 'Implementar um sistema concreto e aplicável que libere o sócio para focar no que realmente importa.', isPositive: true },
    ]

    const notForYou = [
        { icon: X, title: 'Busca "atalho mágico"', description: 'Se acredita em fórmulas milagrosas que prometem resultados sem esforço, esta mentoria não é para você.', isPositive: false },
        { icon: X, title: 'Não quer implementar', description: 'Nosso método funciona apenas para quem está disposto a implementar, testar, ajustar e persistir.', isPositive: false },
        { icon: X, title: 'Quer apenas teoria', description: 'Se procura conteúdo genérico e superficial, há opções mais baratas. Nossa mentoria é prática e profunda.', isPositive: false },
        { icon: X, title: 'Sucesso antes do trabalho', description: 'No dicionário sucesso vem antes de trabalho. Na vida real, é exatamente o oposto.', isPositive: false },
    ]

    return (
        <div className="bg-[#020617] text-slate-100 min-h-screen overflow-x-hidden selection:bg-purple-500/30 font-sans">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-violet-500 origin-left z-50 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{ scaleX }}
            />

            <FloatingChatWidget
                mentorName="Jovana Arantes"
                mentorImage="/img/img128.jpg"
                customMessages={JOVANA_MENTORSHIP_MESSAGES}
                themeColor="purple"
            />

            {/* Background Ambience */}
            <motion.div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <GradientBlob className="bg-purple-900 top-[-10%] left-[-10%] w-[60vw] h-[60vw]" />
                <GradientBlob className="bg-violet-900 top-[40%] right-[-20%] w-[50vw] h-[50vw]" />
                <GradientBlob className="bg-indigo-900/10 bottom-[-10%] left-[10%] w-[70vw] h-[70vw]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </motion.div>

            <BackgroundIcons variant="purple" />

            <main className="relative z-10">

                {/* ========== HERO SECTION ========== */}
                <section className="relative w-full min-h-screen flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-[#020617]">
                        <ParticlesHero color="#a855f7" />
                        <div className="absolute inset-0 bg-[#020617]/80 md:bg-transparent pointer-events-none md:hidden" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent pointer-events-none hidden md:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
                    </div>

                    <Container className="relative z-20 min-h-screen flex flex-col justify-center pointer-events-none py-20">
                        <div className="space-y-6 md:space-y-8 max-w-[600px] relative z-30 pointer-events-auto text-left px-2 md:px-0">

                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20"
                            >
                                <Award className="w-4 h-4 text-purple-400" />
                                <span className="text-purple-400 text-sm font-bold uppercase tracking-wider">{content.hero.badge}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
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
                                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ delay: 1.2, duration: 1 }}
                                    className="bg-gradient-to-r from-purple-400 to-violet-400 text-transparent bg-clip-text block mt-2"
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2, duration: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <PrimaryButton onClick={() => scrollToSection('inscricao')} icon variant="purple">
                                    {content.hero.buttons.primary}
                                </PrimaryButton>
                                <SecondaryButton onClick={openChatWidget}>
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    {content.hero.buttons.secondary}
                                </SecondaryButton>
                            </motion.div>
                        </div>
                    </Container>
                </section>

                {/* ========== SUA MENTORA ========== */}
                <Section id="sobre" className="py-20 md:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal animation="slide-right">
                            <div className="relative">
                                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src="/img/img128.jpg"
                                        alt="Jovana Arantes"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal animation="slide-left">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase">
                                    <Star className="w-3 h-3" /> {content.mentor.badge}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white">
                                    {content.mentor.name}
                                </h2>
                                <p className="text-xl text-purple-400 font-medium font-bold uppercase tracking-wide">
                                    {content.mentor.role}
                                </p>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    {content.mentor.description}
                                </p>
                                <p className="text-slate-300 leading-relaxed italic border-l-4 border-purple-500 pl-6">
                                    {content.mentor.quote}
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-xs">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-slate-300 font-bold">{content.mentor.tags[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-xs">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-slate-300 font-bold">{content.mentor.tags[1]}</span>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </Section>

                {/* ========== O QUE VOCÊ VAI DOMINAR ========== */}
                <Section id="dominar" className="py-20 md:py-32">
                    <ParticlesSection id="particles-skills-jovana" density={30} color="#a855f7" className="opacity-30" />

                    <ScrollReveal animation="blur-up" className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
                            <BookOpen className="w-3 h-3" /> {content.mastery.badge}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            {content.mastery.title.prefix} <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">{content.mastery.title.highlight}</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                            {content.mastery.description}
                        </p>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 gap-8">
                        {masteryAreas.map((area, index) => (
                            <ScrollReveal key={index} animation={index % 2 === 0 ? "slide-right" : "slide-left"}>
                                <MasteryCard
                                    icon={area.icon}
                                    title={content.mastery.cards[index].title}
                                    description={content.mastery.cards[index].description}
                                    items={content.mastery.cards[index].items}
                                />
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal animation="fade-up" className="mt-12">
                        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-950/30 to-violet-950/30 border border-purple-500/10">
                            <p className="text-lg text-slate-300 leading-relaxed font-light">
                                {content.mastery.quote_box}
                            </p>
                        </div>
                    </ScrollReveal>
                </Section>

                {/* ========== TARGET AUDIENCE ========== */}
                <Section id="para-quem" className="py-20 md:py-32">
                    <ScrollReveal animation="blur-up" className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
                            <Target className="w-3 h-3" /> {content.audience.badge}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            {content.audience.title.prefix} <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent italic">{content.audience.title.highlight}</span>
                        </h2>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {targetAudience.map((item, index) => (
                            <ScrollReveal key={index} animation="fade-up" delay={index * 0.1}>
                                <TargetCard
                                    icon={item.icon}
                                    title={content.audience.target_cards[index].title}
                                    description={content.audience.target_cards[index].description}
                                    isPositive={item.isPositive}
                                />
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Not For You Section */}
                    <ScrollReveal animation="fade-up-large" duration={1} viewport={{ once: true, amount: 0.2 }} className="mt-20">
                        <GlassCard className="!bg-purple-900/40 border-purple-500/20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Shield className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{content.audience.not_for_you.title}</h3>
                                    <p className="text-slate-500 text-sm">{content.audience.not_for_you.subtitle}</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {notForYou.map((item, index) => (
                                    <ScrollReveal key={index} animation="fade-up" delay={index * 0.1}>
                                        <TargetCard
                                            icon={item.icon}
                                            title={content.audience.not_for_you.cards[index].title}
                                            description={content.audience.not_for_you.cards[index].description}
                                            isPositive={item.isPositive}
                                        />
                                    </ScrollReveal>
                                ))}
                            </div>
                            <p className="text-slate-500 text-sm mt-6 text-center font-medium">
                                {content.audience.not_for_you.warning}
                            </p>
                        </GlassCard>
                    </ScrollReveal>
                </Section>

                {/* ========== BENEFITS / RESULTS ========== */}
                <Section id="resultados" className="py-20 md:py-32 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal animation="slide-right">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase">
                                    <Rocket className="w-3 h-3" /> {content.results.badge}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                    {content.results.title.prefix} <br /> <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">{content.results.title.highlight}</span>
                                </h2>
                                <p className="text-slate-300 leading-relaxed text-lg font-light">
                                    {content.results.description}
                                </p>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-950/30 border border-purple-500/10">
                                        <Zap className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-xs">{content.results.highlights[0].title}</h4>
                                            <p className="text-slate-400 text-sm">{content.results.highlights[0].description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-950/30 border border-purple-500/10">
                                        <Briefcase className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-xs">{content.results.highlights[1].title}</h4>
                                            <p className="text-slate-400 text-sm">{content.results.highlights[1].description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal animation="slide-left">
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard value={content.results.stats[0].value} label={content.results.stats[0].label} icon={CheckCircle} suffix={content.results.stats[0].suffix} />
                                <StatCard value={content.results.stats[1].value} label={content.results.stats[1].label} icon={Star} suffix={content.results.stats[1].suffix} />
                                <StatCard value={content.results.stats[2].value} label={content.results.stats[2].label} icon={Users} suffix={content.results.stats[2].suffix} />
                                <StatCard value={content.results.stats[3].value} label={content.results.stats[3].label} icon={TrendingUp} />
                            </div>
                        </ScrollReveal>
                    </div>
                </Section>

                {/* ========== CTA SECTION ========== */}
                <Section id="inscricao" className="py-20 md:py-32">
                    <GlassCard className="relative overflow-hidden !bg-gradient-to-br !from-purple-950/50 !to-violet-950/50 border-purple-500/20">
                        <ParticlesSection id="particles-cta-jovana" density={30} color="#a855f7" className="opacity-30" />

                        <div className="relative z-10 text-center max-w-3xl mx-auto py-8">
                            <ScrollReveal animation="blur-up">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                                    <Zap className="w-4 h-4 text-purple-400" />
                                    <span className="text-purple-300 text-sm font-bold uppercase tracking-widest">{content.final_cta.badge}</span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    {content.final_cta.title.prefix} <br /> <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent italic">{content.final_cta.title.highlight}</span>
                                </h2>

                                <div className="mb-8">
                                    <p className="text-slate-400 text-xs mb-4 uppercase tracking-[0.2em] font-medium">{content.final_cta.offer.expires_label}</p>
                                    <CountdownTimer />
                                </div>

                                <div className="bg-slate-950/60 border border-purple-500/20 rounded-2xl p-8 mb-8 shadow-2xl">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <span className="text-slate-500 line-through text-xl">{content.final_cta.offer.old_price}</span>
                                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{content.final_cta.offer.discount_badge}</span>
                                    </div>
                                    <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tighter">
                                        {content.final_cta.offer.price}<span className="text-2xl text-purple-400/50">{content.final_cta.offer.cents}</span>
                                    </div>
                                    <p className="text-slate-400">{content.final_cta.offer.installments} <span className="text-white font-bold">{content.final_cta.offer.installment_value}</span></p>
                                </div>

                                <blockquote className="border-l-4 border-purple-600 pl-6 py-4 text-left bg-purple-950/10 rounded-r-xl mb-8 max-w-2xl mx-auto">
                                    <p className="text-slate-200 italic text-lg mb-2 font-light leading-relaxed">
                                        {content.final_cta.testimonial.text}
                                    </p>
                                    <footer className="text-purple-400 font-bold uppercase tracking-widest text-xs">{content.final_cta.testimonial.author}</footer>
                                </blockquote>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <PrimaryButton
                                        href={content.final_cta.links.checkout}
                                        icon
                                        variant="purple"
                                        className="text-lg px-10 py-5"
                                    >
                                        {content.final_cta.buttons.primary}
                                    </PrimaryButton>
                                    <SecondaryButton onClick={openChatWidget} className="text-lg px-10 py-5">
                                        {content.final_cta.buttons.secondary}
                                    </SecondaryButton>
                                </div>

                                <p className="text-slate-500 text-sm mt-8 flex items-center justify-center gap-2 font-medium">
                                    {content.final_cta.offer.secure_label}
                                </p>
                            </ScrollReveal>
                        </div>
                    </GlassCard>
                </Section>

                {/* ========== FOOTER ========== */}
                <Footer accentColor="purple" />

            </main>
        </div>
    )
}

export default MentoriaJovana
