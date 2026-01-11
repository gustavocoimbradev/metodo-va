import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User } from "lucide-react";

// Initial Hook + Value Value Proposition (Pairs)
// Now loaded from ../texts/chat.json
import defaultChatContent from '../texts/chat.json'

const INITIAL_PAIRS = defaultChatContent.defaults.initial_pairs;
const FOLLOW_UP_MESSAGES = defaultChatContent.defaults.follow_up_messages;

export const FloatingChatWidget = ({
    mentorName = "Equipe V&A",
    mentorImage = null,
    customMessages = null,
    themeColor = "blue"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const hasOpenedRef = useRef(false);
    const chatBodyRef = useRef(null);

    // Dynamic classes based on theme
    const themeShadow = themeColor === "purple" ? "shadow-[0_0_30px_rgba(168,85,247,0.5)]" : "shadow-[0_0_30px_rgba(59,130,246,0.5)]";
    const themeBg = themeColor === "purple" ? "from-purple-600 to-violet-600" : "from-blue-600 to-cyan-600";
    const themeButton = themeColor === "purple" ? "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20" : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20";
    const themeBorder = themeColor === "purple" ? "border-purple-500/30" : "border-blue-500/30";
    const themeFloatingBtn = themeColor === "purple" ? "from-purple-500 to-violet-500" : "from-blue-500 to-cyan-500";
    const themeStatusBorder = themeColor === "purple" ? "border-purple-600" : "border-blue-600";
    const themeSubtext = themeColor === "purple" ? "text-purple-100" : "text-blue-100";

    // Sound effect
    const playNotificationSound = () => {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play failed:", e));
    };

    // Auto-scroll to bottom whenever messages change
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Listen for external open event
    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('openChatWidget', handleOpenChat);
        return () => window.removeEventListener('openChatWidget', handleOpenChat);
    }, []);


    // Message flow logic
    useEffect(() => {
        let timeouts = [];

        // Helper to start the continuous loop of random messages
        const startContinuousFlow = () => {
            const minDelay = 25000; // 25 seconds
            const maxDelay = 60000; // 60 seconds

            const nextMessageDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);

            const tId = setTimeout(() => {
                setIsTyping(true); // Start typing before message

                // Typing for 2-4 seconds
                const typeId = setTimeout(() => {
                    const followUpMsgs = customMessages?.followUp || FOLLOW_UP_MESSAGES;
                    const randomMsg = Array.isArray(followUpMsgs)
                        ? (typeof followUpMsgs[0] === 'object'
                            ? followUpMsgs[Math.floor(Math.random() * followUpMsgs.length)].text
                            : followUpMsgs[Math.floor(Math.random() * followUpMsgs.length)])
                        : followUpMsgs;
                    setMessages(prev => [...prev, randomMsg]);
                    playNotificationSound();
                    setIsTyping(false);

                    // Schedule next message recursively
                    startContinuousFlow();
                }, Math.random() * 2000 + 2000);

                timeouts.push(typeId);

            }, nextMessageDelay);
            timeouts.push(tId);
        };

        if (isOpen) {
            // Check if we need to start fresh or just resume
            if (messages.length === 0) {
                // Pick initial messages
                let firstMsg, secondMsg;
                if (customMessages?.initial) {
                    firstMsg = customMessages.initial[0]?.text || customMessages.initial[0];
                    secondMsg = customMessages.initial[1]?.text || customMessages.initial[1];
                } else {
                    const randomPair = INITIAL_PAIRS[Math.floor(Math.random() * INITIAL_PAIRS.length)];
                    firstMsg = randomPair.first;
                    secondMsg = randomPair.second;
                }

                // Start typing immediately
                setIsTyping(true);

                // 1. First Message
                timeouts.push(setTimeout(() => {
                    setMessages([firstMsg]);
                    playNotificationSound();
                }, 1500));

                // 2. Second Message
                timeouts.push(setTimeout(() => {
                    setMessages(prev => [...prev, secondMsg]);
                    playNotificationSound();
                    setIsTyping(false); // Stop typing briefly
                }, 4000));

                // 3. Start Continuous Random Messages Loop
                timeouts.push(setTimeout(startContinuousFlow, 4000));
            } else {
                // Messages already exist (user re-opened chat). 
                // Just resume the continuous flow after a short delay so it feels alive.
                timeouts.push(setTimeout(startContinuousFlow, 5000));
            }

        } else {
            // When closed:
            // 1. Stop typing animation
            setIsTyping(false);
            // 2. Clear all pending timers (stops new messages from arriving)
            timeouts.forEach(clearTimeout);
            // 3. DO NOT clear messages (persist history)
        }

        return () => timeouts.forEach(clearTimeout);
    }, [isOpen, customMessages]);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
                        className={`bg-[#0f172a] border ${themeBorder} rounded-2xl shadow-2xl w-80 overflow-hidden backdrop-blur-xl`}
                    >
                        {/* Header */}
                        <div className={`bg-gradient-to-r ${themeBg} p-4 flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    {mentorImage ? (
                                        <img src={mentorImage} alt={mentorName} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                                            <User size={20} />
                                        </div>
                                    )}
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 ${themeStatusBorder} rounded-full`}></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{mentorName}</h3>
                                    <p className={`${themeSubtext} text-xs`}>{defaultChatContent.ui.status_online}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="text-white/80 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div
                            ref={chatBodyRef}
                            className="p-4 space-y-4 bg-slate-900/50 h-[300px] flex flex-col overflow-y-auto scroll-smooth custom-scrollbar"
                        >

                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10, x: -10 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed shadow-lg border border-white/5">
                                        {msg}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-xs text-slate-500 italic pl-2 pt-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                        <span>{mentorName} {defaultChatContent.ui.typing_suffix}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Action Footer */}
                        <div className="p-4 bg-slate-900 border-t border-white/5">
                            <a
                                href="https://wa.me/5562999999999" // Replace with actual link
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center gap-2 w-full py-3 ${themeButton} rounded-xl text-white font-bold transition-all shadow-lg group`}
                            >
                                <span>{defaultChatContent.ui.cta_button}</span>
                                <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-16 h-16 bg-gradient-to-r ${themeFloatingBtn} rounded-full flex items-center justify-center text-white ${themeShadow} group z-50 border-4 border-[#020617] cursor-pointer`}
            >
                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 animate-ping duration-1000"></span>
                {isOpen ? (
                    <X size={32} />
                ) : (
                    <MessageCircle size={32} className="fill-white/20" />
                )}
            </motion.button>
        </div>
    );
};
