import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Rocket, Check, X, Brain, LayoutDashboard, ArrowRight, ShieldCheck, TrendingUp, Users, Scale, FileText, Globe, ChevronDown, Award } from 'lucide-react'
import { BlurReveal } from './components/BlurReveal'
import { ScrollReveal } from './components/ScrollReveal'
import { FloatingChatWidget } from './components/FloatingChatWidget'
import ParticlesHero from './components/ParticlesHero'
import ParticlesSection from './components/ParticlesSection'
import Container from './components/Container'
import { CountUp } from './components/CountUp'
import { ZoomReveal } from './components/ZoomReveal'
import Preloader from './components/Preloader'
import { PrimaryButton, SecondaryButton } from './components/Button'
import BackgroundIcons from './components/BackgroundIcons'
import Footer from './components/Footer'
import content from './api/home.json'

// --- Components ---

const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-xl bg-slate-950/30 border border-white/5 rounded-3xl p-8 shadow-2xl ${className}`}>
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

const TargetCard = ({ icon: Icon, title, description, isPositive = true }) => (
  <div className={`p-6 rounded-2xl border h-full ${isPositive ? 'bg-gradient-to-br from-blue-950/50 to-slate-950/30 border-blue-500/20' : 'bg-slate-900/30 border-slate-700/30'}`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isPositive ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
      <Icon className="w-6 h-6" />
    </div>
    <h4 className={`font-bold mb-2 ${isPositive ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
    <p className={`text-sm leading-relaxed ${isPositive ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>
  </div>
)

const StatCard = ({ value, label, icon: Icon, suffix = '' }) => (
  <div className="text-center p-6">
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-7 h-7 text-blue-400" />
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

const GradientBlob = ({ className }) => (
  <div className={`absolute rounded-full blur-[100px] opacity-40 pointer-events-none mix-blend-screen ${className}`} />
)

const ListItem = ({ children, icon: Icon, color = "text-slate-300", active }) => (
  <li className="flex items-start gap-4">
    <div className={`mt-0.5 p-1 rounded-lg ${active ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800/50 text-slate-600'}`}>
      <Icon size={18} />
    </div>
    <span className={`flex-1 text-base ${color}`}>{children}</span>
  </li>
)

const CheckItem = ({ children, dotColor = "bg-cyan-500" }) => (
  <li className="flex items-center gap-3 text-slate-300">
    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${dotColor}`} />
    <span className="text-sm font-medium">{children}</span>
  </li>
)

// --- Main App ---

function App() {
  const [loading, setLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yParticles = useTransform(scrollYProgress, [0, 0.2], ["0%", "20%"]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openChatWidget = () => {
    window.dispatchEvent(new CustomEvent('openChatWidget'));
  };

  return (
    <div className="bg-[#020617] text-slate-100 min-h-screen overflow-x-hidden selection:bg-cyan-500/30 font-sans">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 origin-left z-50 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
        style={{ scaleX }}
      />

      <FloatingChatWidget />

      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-all duration-1000"
        style={{
          background: useTransform(
            scrollYProgress,
            [0, 0.25, 0.5, 0.75, 1],
            [
              'radial-gradient(ellipse at 20% 20%, rgba(30, 58, 138, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(6, 78, 59, 0.2) 0%, transparent 50%), #020617',
              'radial-gradient(ellipse at 50% 30%, rgba(49, 46, 129, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(30, 64, 175, 0.2) 0%, transparent 50%), #020617',
              'radial-gradient(ellipse at 80% 40%, rgba(15, 118, 110, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 30% 60%, rgba(30, 58, 138, 0.25) 0%, transparent 50%), #020617',
              'radial-gradient(ellipse at 40% 50%, rgba(30, 64, 175, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(21, 94, 117, 0.2) 0%, transparent 50%), #020617',
              'radial-gradient(ellipse at 60% 70%, rgba(30, 58, 138, 0.35) 0%, transparent 50%), radial-gradient(ellipse at 20% 20%, rgba(8, 145, 178, 0.15) 0%, transparent 50%), #020617'
            ]
          )
        }}
      >
        <motion.div style={{ y: yBackground }} className="absolute inset-0 top-0 left-0 w-full h-[120%]">
          <GradientBlob className="bg-blue-900 top-[-10%] left-[-10%] w-[60vw] h-[60vw]" />
          <GradientBlob className="bg-indigo-900 top-[40%] right-[-20%] w-[50vw] h-[50vw]" />
          <GradientBlob className="bg-cyan-900/30 bottom-[-10%] left-[10%] w-[70vw] h-[70vw]" />
        </motion.div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </motion.div>

      <BackgroundIcons />

      <main className="relative z-10">

        {/* Page 1: Hero Section */}
        <section className="relative w-full min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[#020617]">
            <motion.div className="absolute inset-0" style={{ y: yParticles }}>
              <ParticlesHero />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent pointer-events-none hidden md:block" />
            <div className="absolute inset-0 bg-[#020617]/80 md:bg-transparent pointer-events-none md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
          </div>

          <Container className="relative z-20 h-screen flex flex-col justify-center pointer-events-none">
            <div className="space-y-6 md:space-y-8 max-w-[650px] relative z-30 pointer-events-auto text-left px-4 md:px-0">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-block"
              >
                <span className="text-2xl md:text-3xl font-bold tracking-tighter bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-lg">
                  {content.hero.badge}
                </span>
              </motion.div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight drop-shadow-2xl flex flex-col gap-1 md:gap-2">
                <BlurReveal delay={0.2} duration={1}>
                  {content.hero.title.prefix}
                </BlurReveal>
                <motion.span
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text w-fit pb-2"
                >
                  {content.hero.title.highlight}
                </motion.span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-slate-300 max-w-xl leading-relaxed font-light drop-shadow-lg">
                <BlurReveal delay={1.2} duration={1}>
                  {content.hero.description}
                </BlurReveal>
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <PrimaryButton onClick={() => scrollToSection('mentorias')}>
                  {content.hero.buttons.primary}
                </PrimaryButton>
                <SecondaryButton onClick={() => scrollToSection('visao')}>
                  {content.hero.buttons.secondary}
                </SecondaryButton>
              </motion.div>
            </div>

            <div className="absolute bottom-0 right-0 h-[90vh] lg:h-[105vh] w-full lg:w-[65%] items-end justify-end pointer-events-none hidden md:flex">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative h-full w-auto right-[-5%] lg:right-[-2%] z-10 flex items-end"
              >
                <img
                  src="/img/hero-persona.png"
                  alt="Túlio Viana e Jovana Arantes"
                  className="h-full w-auto object-contain object-bottom drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] contrast-[1] brightness-[.9] saturate-[1.1]"
                />
                <div
                  className="absolute inset-0 w-full h-full bg-blue-600/15 mix-blend-color pointer-events-none"
                  style={{
                    maskImage: 'url(/img/hero-persona.png)',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'bottom',
                    WebkitMaskImage: 'url(/img/hero-persona.png)',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'bottom'
                  }}
                />
              </motion.div>
            </div>

            <motion.a
              href="#visao"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 text-slate-400 hover:text-white transition-colors cursor-pointer animate-bounce"
            >
              <ChevronDown size={32} />
            </motion.a>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-[40vh] bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent z-20 pointer-events-none" />
          </Container>
        </section>

        {/* Page 2: Vision Section */}
        <Section id="visao" className="bg-[#020617]">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0.1, 0.4], [50, -50]) }}
              className="order-2 md:order-1 relative group"
            >
              <div className="absolute inset-0 bg-blue-600/20 blur-[80px] -rotate-12 rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] aspect-[4/5]">
                <ZoomReveal src={content.vision.image} alt="Fundadores" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-1">{content.vision.image_caption.title}</h3>
                  <p className="text-cyan-400 font-medium">{content.vision.image_caption.subtitle}</p>
                </div>
              </div>
            </motion.div>

            <div className="order-1 md:order-2 space-y-10">
              <ScrollReveal animation="blur-up">
                <h2 className="text-xl md:text-3xl font-bold leading-tight">
                  {content.vision.title.prefix} <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{content.vision.title.highlight}</span>
                </h2>
              </ScrollReveal>

              <div className="space-y-6 text-slate-300 leading-relaxed text-lg font-light">
                <ScrollReveal animation="blur-up" delay={0.1}>
                  <p dangerouslySetInnerHTML={{ __html: content.vision.descriptions[0] }} />
                </ScrollReveal>
                <ScrollReveal animation="blur-up" delay={0.2}>
                  <p className="border-l-4 border-blue-500 pl-6 italic text-slate-400" dangerouslySetInnerHTML={{ __html: content.vision.descriptions[1] }} />
                </ScrollReveal>
              </div>

              <ScrollReveal animation="blur-up" delay={0.4}>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="bg-blue-950/20 rounded-2xl p-6 border border-blue-500/10 hover:border-blue-500/30 transition-colors">
                    <div className="text-3xl font-bold text-white mb-1 whitespace-nowrap">
                      <CountUp to={content.vision.stats[0].value} suffix={content.vision.stats[0].suffix} duration={2.5} />
                    </div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide">{content.vision.stats[0].label}</p>
                  </div>
                  <div className="bg-blue-950/20 rounded-2xl p-6 border border-blue-500/10 hover:border-blue-500/30 transition-colors">
                    <div className="text-3xl font-bold text-white mb-1 whitespace-nowrap">
                      R$ <CountUp to={content.vision.stats[1].value} suffix={content.vision.stats[1].suffix} duration={2} />
                    </div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide">{content.vision.stats[1].label}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Section>

        {/* Page 3: Conheça Seus Mentores */}
        <Section id="mentores" className="relative overflow-hidden">
          <ParticlesSection id="particles-mentores" density={60} color="#60a5fa" className="opacity-70" />
          <ScrollReveal className="mb-16" animation="blur-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Users className="w-4 h-4" /> {content.mentors.badge}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{content.mentors.title}</h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Túlio */}
            <ScrollReveal animation="scale-up" delay={0.2} duration={0.8} className="h-full">
              <GlassCard className="flex flex-col h-full !p-0 overflow-hidden group border-0 shadow-2xl bg-[#050b1d]">
                <div className="relative h-[400px] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050b1d] via-transparent to-transparent opacity-80 z-10" />
                  <img src="/img/img127.jpg" alt="Túlio Viana" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8 relative z-20">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {content.mentors.tulio.name.first} <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{content.mentors.tulio.name.last}</span>
                  </h3>
                  <p className="text-blue-400 font-medium text-sm mb-6 uppercase tracking-wider">{content.mentors.tulio.role}</p>
                  <p className="text-slate-300 leading-relaxed text-sm mb-8">
                    {content.mentors.tulio.bio}
                  </p>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-slate-400 text-sm italic" dangerouslySetInnerHTML={{ __html: content.mentors.tulio.quote }} />
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>

            {/* Jovana */}
            <ScrollReveal animation="scale-up" delay={0.4} duration={0.8} className="h-full">
              <GlassCard className="flex flex-col h-full !p-0 overflow-hidden group border-0 shadow-2xl bg-[#050b1d]">
                <div className="relative h-[400px] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050b1d] via-transparent to-transparent opacity-80 z-10" />
                  <img src="/img/img128.jpg" alt="Jovana Arantes" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8 relative z-20">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {content.mentors.jovana.name.first} <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">{content.mentors.jovana.name.last}</span>
                  </h3>
                  <p className="text-indigo-400 font-medium text-sm mb-6 uppercase tracking-wider">{content.mentors.jovana.role}</p>
                  <p className="text-slate-300 leading-relaxed text-sm mb-8">
                    {content.mentors.jovana.bio}
                  </p>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-slate-400 text-sm italic" dangerouslySetInnerHTML={{ __html: content.mentors.jovana.quote }} />
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </Section>

        {/* Page 4: Duas Mentorias */}
        <Section id="page-4" className="bg-blue-950/10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 relative hidden md:block">
              <div className="relative aspect-square max-w-[500px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-400/20 rounded-full blur-[100px] opacity-40 animate-pulse pointer-events-none" />
                <div className="w-full h-full relative z-10 grid grid-cols-2 gap-6 items-center">
                  <ScrollReveal animation="slide-right" delay={0.1} className="h-[85%]">
                    <div className="h-full bg-[#0f172a]/80 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl group transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                        <Brain className="text-blue-400 w-8 h-8" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-3 whitespace-pre-line">{content.two_mentorships.card_ia.title}</h3>
                        <p className="text-slate-400 text-sm leading-tight mb-4">{content.two_mentorships.card_ia.subtitle}</p>
                        <div className="w-12 h-1.5 bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  </ScrollReveal>
                  <ScrollReveal animation="slide-left" delay={0.3} className="h-[85%] mt-20">
                    <div className="h-full bg-[#0f172a]/80 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl group transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="w-16 h-16 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                        <LayoutDashboard className="text-indigo-400 w-8 h-8" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-3 whitespace-pre-line">{content.two_mentorships.card_gestao.title}</h3>
                        <p className="text-slate-400 text-sm leading-tight mb-4">{content.two_mentorships.card_gestao.subtitle}</p>
                        <div className="w-12 h-1.5 bg-indigo-500 rounded-full" />
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <ScrollReveal animation="blur-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
                  <ShieldCheck className="w-4 h-4" /> {content.two_mentorships.badge}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                  {content.two_mentorships.title.main} <br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">{content.two_mentorships.title.highlight}</span>
                </h2>
              </ScrollReveal>
              <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-light">
                <ScrollReveal animation="blur-up" delay={0.1}>
                  <p dangerouslySetInnerHTML={{ __html: content.two_mentorships.description }} />
                </ScrollReveal>
                <ScrollReveal animation="blur-up" delay={0.2}>
                  <p className="p-6 bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl">
                    {content.two_mentorships.highlight_box}
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </Section>

        {/* Audience Section */}
        <Section id="para-quem" className="py-32 relative">
          <ParticlesSection id="particles-audience" density={50} color="#60a5fa" className="opacity-60" />
          <div className="text-center mb-20 relative z-10">
            <ScrollReveal animation="blur-up">
              <h2 className="text-2xl md:text-4xl font-bold mb-6">{content.audience.title.main} <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">{content.audience.title.highlight}</span> {content.audience.title.suffix}</h2>
              <p className="text-slate-400 mx-auto text-xl leading-relaxed">
                {content.audience.subtitle}
              </p>
            </ScrollReveal>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto relative z-10">
            <ScrollReveal animation="slide-left" duration={0.8} delay={0.2} className="h-full">
              <GlassCard className="hover:border-blue-500/30 transition-all duration-500 h-full !bg-gradient-to-br !from-blue-950/40 !to-slate-900/40">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-400/30 shadow-2xl">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">{content.audience.ideal_profile.badge}</p>
                    <h3 className="text-2xl font-bold text-white">{content.audience.ideal_profile.title}</h3>
                  </div>
                </div>
                <ul className="space-y-6">
                  <ListItem icon={LayoutDashboard} active>{content.audience.ideal_profile.items[0]}</ListItem>
                  <ListItem icon={TrendingUp} active><span dangerouslySetInnerHTML={{ __html: content.audience.ideal_profile.items[1] }} /></ListItem>
                  <ListItem icon={Users} active>{content.audience.ideal_profile.items[2]}</ListItem>
                  <ListItem icon={Brain} active>{content.audience.ideal_profile.items[3]}</ListItem>
                </ul>
              </GlassCard>
            </ScrollReveal>
            <ScrollReveal animation="slide-right" duration={0.8} delay={0.4} className="h-full">
              <GlassCard className="hover:border-red-500/20 transition-all duration-500 opacity-80 h-full !bg-transparent border-dashed">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-400/20 shadow-2xl">
                    <X className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-red-400/80 text-xs font-bold uppercase tracking-widest mb-1">{content.audience.contra_indication.badge}</p>
                    <h3 className="text-2xl font-bold text-slate-300">{content.audience.contra_indication.title}</h3>
                  </div>
                </div>
                <ul className="space-y-6 text-slate-400">
                  <ListItem icon={X} color="text-red-400/50">{content.audience.contra_indication.items[0]}</ListItem>
                  <ListItem icon={X} color="text-red-400/50">{content.audience.contra_indication.items[1]}</ListItem>
                  <ListItem icon={X} color="text-red-400/50">{content.audience.contra_indication.items[2]}</ListItem>
                  <ListItem icon={X} color="text-red-400/50">{content.audience.contra_indication.items[3]}</ListItem>
                </ul>
              </GlassCard>
            </ScrollReveal>
          </div>
        </Section>

        {/* History Section */}
        <Section id="historia" className="relative overflow-hidden py-32">
          <ParticlesSection id="particles-historia" density={50} color="#60a5fa" className="opacity-50" />
          <Container>
            <GlassCard className="relative overflow-hidden !bg-[#050b1d] border-none shadow-2xl">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
              <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10 p-6 md:p-10">
                <div className="space-y-8">
                  <ScrollReveal animation="blur-up">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight whitespace-pre-line">{content.history.title}</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                  </ScrollReveal>
                  <div className="space-y-6 text-slate-300 leading-relaxed text-lg font-light">
                    <ScrollReveal animation="blur-up" delay={0.1}>
                      <p dangerouslySetInnerHTML={{ __html: content.history.paragraphs[0] }} />
                    </ScrollReveal>
                    <ScrollReveal animation="blur-up" delay={0.2}>
                      <p dangerouslySetInnerHTML={{ __html: content.history.paragraphs[1] }} />
                    </ScrollReveal>
                  </div>
                  <ScrollReveal animation="blur-up" delay={0.3}>
                    <div className="border-l-4 border-indigo-500 pl-6 py-4 bg-indigo-950/20 italic text-slate-400">
                      {content.history.quote}
                    </div>
                  </ScrollReveal>
                </div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] group">
                  <ZoomReveal src="/img/jovana.e.tulio-63_1_-683x1024.webp" alt="Túlio e Jovana" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050b1d] to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="font-bold text-xl mb-1">{content.history.image_caption.title}</p>
                    <p className="text-slate-400 text-sm">{content.history.image_caption.subtitle}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Container>
        </Section>

        {/* Mentorships Section */}
        <Section id="mentorias" className="pb-32">
          <div className="text-center mb-24">
            <ScrollReveal animation="blur-up">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
                {content.mentorships_cta.title}
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                {content.mentorships_cta.subtitle}
              </p>
            </ScrollReveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
            {/* Túlio - IA */}
            <ScrollReveal animation="blur-up" delay={0.2} className="h-full">
              <div className="relative group rounded-[2.5rem] bg-gradient-to-b from-blue-500 via-blue-800 to-slate-900 p-[1px] shadow-[0_0_50px_rgba(37,99,235,0.15)] hover:shadow-[0_0_80px_rgba(37,99,235,0.25)] transition-all duration-500 h-full">
                <div className="bg-[#020617] rounded-[2.4rem] h-full p-8 md:p-12 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-48 bg-blue-600/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-all" />
                  <div className="relative z-10 flex-1">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
                          {content.mentorships_cta.card_tulio.badge}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{content.mentorships_cta.card_tulio.title}</h2>
                        <h3 className="text-lg text-slate-400 mt-2">{content.mentorships_cta.card_tulio.subtitle}</h3>
                      </div>
                      <div className="p-4 bg-blue-950 text-blue-400 rounded-2xl shadow-inner border border-blue-900/50">
                        <Brain size={40} />
                      </div>
                    </div>
                    <p className="text-slate-300 mb-10 leading-relaxed font-light text-lg">
                      {content.mentorships_cta.card_tulio.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-12">
                      <CheckItem>{content.mentorships_cta.card_tulio.benefits[0]}</CheckItem>
                      <CheckItem>{content.mentorships_cta.card_tulio.benefits[1]}</CheckItem>
                      <CheckItem>{content.mentorships_cta.card_tulio.benefits[2]}</CheckItem>
                      <CheckItem>{content.mentorships_cta.card_tulio.benefits[3]}</CheckItem>
                    </div>
                  </div>
                  <motion.a
                    whileTap={{ scale: 0.98 }}
                    href={content.mentorships_cta.card_tulio.link}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3"
                  >
                    {content.mentorships_cta.card_tulio.button}
                    <ArrowRight size={20} />
                  </motion.a>
                </div>
              </div>
            </ScrollReveal>

            {/* Jovana - Gestão */}
            <ScrollReveal animation="blur-up" delay={0.4} className="h-full">
              <div className="relative group rounded-[2.5rem] bg-gradient-to-b from-indigo-500 via-indigo-800 to-slate-900 p-[1px] shadow-[0_0_50px_rgba(79,70,229,0.15)] hover:shadow-[0_0_80px_rgba(79,70,229,0.25)] transition-all duration-500 h-full">
                <div className="bg-[#020617] rounded-[2.4rem] h-full p-8 md:p-12 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-48 bg-indigo-600/10 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all" />
                  <div className="relative z-10 flex-1">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
                          {content.mentorships_cta.card_jovana.badge}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{content.mentorships_cta.card_jovana.title}</h2>
                        <h3 className="text-lg text-slate-400 mt-2">{content.mentorships_cta.card_jovana.subtitle}</h3>
                      </div>
                      <div className="p-4 bg-indigo-950 text-indigo-400 rounded-2xl shadow-inner border border-indigo-900/50">
                        <LayoutDashboard size={40} />
                      </div>
                    </div>
                    <p className="text-slate-300 mb-10 leading-relaxed font-light text-lg">
                      {content.mentorships_cta.card_jovana.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-12 opacity-70">
                      <CheckItem dotColor="bg-indigo-500">{content.mentorships_cta.card_jovana.benefits[0]}</CheckItem>
                      <CheckItem dotColor="bg-indigo-500">{content.mentorships_cta.card_jovana.benefits[1]}</CheckItem>
                      <CheckItem dotColor="bg-indigo-500">{content.mentorships_cta.card_jovana.benefits[2]}</CheckItem>
                      <CheckItem dotColor="bg-indigo-500">{content.mentorships_cta.card_jovana.benefits[3]}</CheckItem>
                    </div>
                  </div>
                  <motion.a
                    whileTap={{ scale: 0.98 }}
                    href={content.mentorships_cta.card_jovana.link}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3"
                  >
                    {content.mentorships_cta.card_jovana.button}
                    <ArrowRight size={20} />
                  </motion.a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Section>

        {/* Final CTA */}
        <section className="py-24 bg-[#020617] border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />
          <Container className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group h-[700px]">
                <img src="/img/img344.jpg" alt="Transformação" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="space-y-8 text-left">
                <ScrollReveal animation="blur-up">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] whitespace-pre-line">
                    {content.footer.title}
                  </h2>
                </ScrollReveal>
                <ScrollReveal animation="blur-up" delay={0.1}>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {content.footer.description}
                  </p>
                </ScrollReveal>
                <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                  <PrimaryButton onClick={() => scrollToSection('mentorias')} className="flex-1">{content.footer.buttons.primary}</PrimaryButton>
                  <SecondaryButton onClick={openChatWidget} className="flex-1">{content.footer.buttons.secondary}</SecondaryButton>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <Footer accentColor="blue" />
      </main>
    </div>
  )
}

export default App
