
const Container = ({ children, className = "" }) => {
    return (
        <div className={`w-full max-w-[1216px] mx-auto px-2 sm:px-4 md:px-12 ${className}`}>
            {children}
        </div>
    );
};

export default Container;
