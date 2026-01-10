import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from "../hooks/useIsMobile";

export const ZoomReveal = ({ src, alt, className = "" }) => {
    const isMobile = useIsMobile();
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (isMobile) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Add a small delay/requestAnimationFrame to ensure layout is ready for transition
                    requestAnimationFrame(() => {
                        setIsVisible(true);
                    });
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isMobile]);

    const showImage = isVisible || isMobile;


    return (
        <div className={`overflow-hidden w-full h-full bg-blue-950`}>
            <img
                ref={ref}
                src={src}
                alt={alt}
                className={`w-full h-full object-cover ${!isMobile ? 'transition-transform duration-[8000ms] ease-out will-change-transform' : ''} ${showImage ? 'scale-100 origin-center' : 'scale-[1.08] origin-center'
                    } ${className}`}
            />
        </div>
    );
};
