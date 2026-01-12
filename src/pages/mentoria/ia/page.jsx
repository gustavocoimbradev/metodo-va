import content from '../../../texts/mentoria-ia.json'
import MentorshipPageTemplate from '../../../components/MentorshipPageTemplate'
import { Brain, X, CheckCircle } from 'lucide-react'

function MentoriaIA() {
    // Content is now fully loaded from the JSON file
    const pageContent = content

    return (
        <MentorshipPageTemplate
            content={pageContent}
            theme={{
                primary: 'cyan',
                secondary: 'blue',
                hex: '#06b6d4'
            }}
            heroPersonaImage="/img/tulio-profile-removebg-preview(1).png"
            mentorImage="/img/tulio.webp"
            countdownKey="mentoria_ia_countdown_end"
            HeroBadgeIcon={Brain}
            ProblemIcon={X}
            SolutionIcon={CheckCircle}
        />
    )
}

export default MentoriaIA
