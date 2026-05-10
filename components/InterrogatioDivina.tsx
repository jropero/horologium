
import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Sparkles } from 'lucide-react';
import { OvidDialogue } from '../utils/ovidFastiData';

interface InterrogatioDivinaProps {
    isOpen: boolean;
    onClose: () => void;
    dialogue: OvidDialogue;
}

const InterrogatioDivina: React.FC<InterrogatioDivinaProps> = ({ isOpen, onClose, dialogue }) => {
    const [messages, setMessages] = useState<{ type: 'user' | 'god'; text: string; ref?: string }[]>([]);
    const [availableQuestions, setAvailableQuestions] = useState(dialogue.questions);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMessages([{ 
                type: 'god', 
                text: `Soy ${dialogue.god}. Las puertas de mi numen se abren para ti. ¿Qué buscas saber de los ritos antiguos?` 
            }]);
            setAvailableQuestions(dialogue.questions);
        } else {
            setMessages([]);
        }
    }, [isOpen, dialogue]);

    const handleAsk = (index: number) => {
        const qData = availableQuestions[index];
        
        // Add user question
        setMessages(prev => [...prev, { type: 'user', text: qData.question, ref: qData.qRef }]);
        
        // Remove from available
        setAvailableQuestions(prev => prev.filter((_, i) => i !== index));
        
        // Simulated "typing" of the god
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'god', text: qData.answer, ref: qData.aRef }]);
            setIsTyping(false);
        }, 1200);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn" onClick={onClose}>
            <div 
                className="bg-stone-900 border-2 border-gold-leaf rounded-2xl shadow-[0_0_50px_rgba(207,181,59,0.3)] w-full max-w-lg h-[80vh] flex flex-col overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Aged Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

                {/* Header */}
                <div className="p-4 border-b border-gold-leaf/30 flex justify-between items-center bg-stone-950/50 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gold-leaf/10 rounded-full border border-gold-leaf/40">
                            <Sparkles className="w-5 h-5 text-gold-leaf" />
                        </div>
                        <div>
                            <h2 className="font-serif text-xl font-bold text-gold-leaf uppercase tracking-widest">Interrogatio Divina</h2>
                            <p className="text-[10px] text-parchment/60 uppercase tracking-tighter">Coloquio con {dialogue.god}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-parchment/50 hover:text-roman-red p-2 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Chat History Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar relative z-10">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} animate-slideUp`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl font-serif text-sm relative shadow-xl
                                ${msg.type === 'user' 
                                    ? 'bg-stone-800 border border-gold-dim/30 text-parchment rounded-tr-none' 
                                    : 'bg-gold-leaf/10 border border-gold-leaf/40 text-gold-leaf rounded-tl-none'}`}
                            >
                                <div className="flex items-start gap-2">
                                    <span className="text-lg shrink-0">{msg.type === 'user' ? '🪶' : '🏛️'}</span>
                                    <p className="leading-relaxed pt-0.5">
                                        {msg.text}
                                    </p>
                                </div>
                                {msg.ref && (
                                    <div className={`text-[9px] mt-2 uppercase tracking-widest opacity-50 font-bold ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        — {msg.ref}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-center gap-2 text-gold-leaf/50 animate-pulse ml-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs font-serif italic">El dios responde...</span>
                        </div>
                    )}
                </div>

                {/* User Options / Question Selector Area */}
                <div className="p-4 border-t border-gold-leaf/30 bg-stone-900/90 z-10">
                    {availableQuestions.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-[9px] text-gold-dim uppercase tracking-widest font-black mb-2 opacity-70">Selecciona tu interrogación:</p>
                            {availableQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAsk(i)}
                                    disabled={isTyping}
                                    className="w-full text-left p-3 rounded-xl border border-gold-dim/20 bg-white/5 hover:bg-gold-leaf/10 hover:border-gold-leaf/50 transition-all text-xs font-serif italic text-parchment/80 flex items-start gap-3 group shadow-sm"
                                >
                                    <MessageSquare className="w-4 h-4 mt-0.5 text-gold-dim group-hover:text-gold-leaf shrink-0" />
                                    <span>{q.question}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="text-2xl mb-2 opacity-30">✨</div>
                            <p className="text-xs font-serif italic text-gold-dim/80">El numen se retira. El coloquio ha concluido.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterrogatioDivina;
