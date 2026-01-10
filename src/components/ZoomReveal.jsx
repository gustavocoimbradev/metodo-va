import { useState, useEffect, useRef } from 'react';

export const ZoomReveal = ({ src, alt, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
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
    }, []);

    return (
        <div className={`overflow-hidden w-full h-full bg-blue-950`}>
            <img
                ref={ref}
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out will-change-transform ${isVisible ? 'scale-100 origin-center' : 'scale-[1.08] origin-center'
                    } ${className}`}
            />
        </div>
    );
};
