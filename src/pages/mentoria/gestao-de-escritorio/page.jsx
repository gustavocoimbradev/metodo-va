import content from '../../../texts/mentoria-gestao.json'
import MentorshipPageTemplate from '../../../components/MentorshipPageTemplate'
import { Award, X, CheckCircle } from 'lucide-react'

function MentoriaJovana() {
    // Content is now fully loaded from the JSON file
    const pageContent = content

    return (
        <MentorshipPageTemplate
            content={pageContent}
            theme={{
                primary: 'purple',
                secondary: 'violet',
                hex: '#a855f7'
            }}
            heroPersonaImage="/img/jovana.e.tulio-7-scaled-removebg-preview(1).png"
            mentorImage="/img/img128.jpg"
            countdownKey="mentoria_gestao_countdown_end"
            HeroBadgeIcon={Award}
            ProblemIcon={X}
            SolutionIcon={CheckCircle}
        />
    )
}

export default MentoriaJovana
