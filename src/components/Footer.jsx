import Container from './Container'

const Footer = ({ accentColor = "blue" }) => {
    const currentYear = new Date().getFullYear()

    const colors = {
        blue: "text-blue-500/50 hover:text-blue-400",
        cyan: "text-cyan-500/50 hover:text-cyan-400",
        purple: "text-purple-500/50 hover:text-purple-400"
    }

    const linkColorClass = colors[accentColor] || colors.blue
    const heartEmoji = accentColor === 'purple' ? '💜' : '💙'

    return (
        <footer className="relative py-12 border-t border-white/5 bg-[#020617]">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 text-xs font-bold uppercase tracking-widest">
                    <p>© {currentYear} Método V&A. Todos os direitos reservados.</p>
                    <p>
                        Feito com {heartEmoji} por <a href="https://www.insiderblue.com.br" target="_blank" rel="noopener noreferrer" className={`${linkColorClass} transition-colors`}>Insiderblue</a>
                    </p>
                </div>
            </Container>
        </footer>
    )
}

export default Footer
