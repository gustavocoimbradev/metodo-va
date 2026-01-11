import { useState, useEffect } from 'react';

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(max-width: 768px)').matches
        }
        return false
    })

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches)
        }

        // Add listener for changes
        const mediaQuery = window.matchMedia('(max-width: 768px)')
        // Modern browsers use addEventListener on mediaQuery, specifically for 'change'
        // but the previous code used window resize which is also fine.
        // Let's stick to the simpler window resize listener for broad compatibility or media query listener.
        // Using the previous logic's resize listener is robust enough for simple breakpoints.
        window.addEventListener('resize', checkIsMobile)

        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    return isMobile
}
