import React, { useState, useEffect } from 'react';
import './InterrogatioDivina.css';
import { X, MessageSquare, Sparkles } from 'lucide-react';
import { OvidDialogue } from '../utils/ovidFastiData';

interface InterrogatioDivinaProps {
  isOpen: boolean;
  onClose: () => void;
  dialogue: OvidDialogue;
}

const InterrogatioDivina: React.FC<InterrogatioDivinaProps> = ({
  isOpen,
  onClose,
  dialogue,
}) => {
  const [messages, setMessages] = useState<
    { type: 'user' | 'god'; text: string; ref?: string }[]
  >([]);
  const [availableQuestions, setAvailableQuestions] = useState(dialogue.questions);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([
        {
          type: 'god',
          text: `Soy ${dialogue.god}. Las puertas de mi numen se abren para ti. ¿Qué buscas saber de los ritos antiguos?`,
        },
      ]);
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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="interrogatio-divina animate-fadeIn" onClick={onClose}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="interrogatio-divina__dialog" onClick={e => e.stopPropagation()}>
        {/* Aged Paper Texture Overlay */}
        <div className="interrogatio-divina__texture" />

        {/* Header */}
        <div className="interrogatio-divina__header">
          <div className="interrogatio-divina__header-left">
            <div className="interrogatio-divina__icon-badge">
              <Sparkles className="interrogatio-divina__sparkles-icon" />
            </div>
            <div>
              <h2 className="interrogatio-divina__title">Interrogatio Divina</h2>
              <p className="interrogatio-divina__subtitle">Coloquio con {dialogue.god}</p>
            </div>
          </div>
          <button onClick={onClose} className="interrogatio-divina__close-btn">
            <X className="interrogatio-divina__close-icon" />
          </button>
        </div>

        {/* Chat History Area */}
        <div className="interrogatio-divina__chat custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`interrogatio-divina__message animate-slideUp${
                msg.type === 'user'
                  ? ' interrogatio-divina__message--user'
                  : ' interrogatio-divina__message--god'
              }`}
            >
              <div
                className={`interrogatio-divina__msg-bubble${
                  msg.type === 'user'
                    ? ' interrogatio-divina__msg-bubble--user'
                    : ' interrogatio-divina__msg-bubble--god'
                }`}
              >
                <div className="interrogatio-divina__msg-content">
                  <span className="interrogatio-divina__msg-icon">
                    {msg.type === 'user' ? '🪶' : '🏛️'}
                  </span>
                  <p className="interrogatio-divina__msg-text">{msg.text}</p>
                </div>
                {msg.ref && <div className="interrogatio-divina__msg-ref">— {msg.ref}</div>}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="interrogatio-divina__typing">
              <Sparkles className="interrogatio-divina__typing-icon" />
              <span className="interrogatio-divina__typing-text">El dios responde...</span>
            </div>
          )}
        </div>

        {/* User Options / Question Selector Area */}
        <div className="interrogatio-divina__footer">
          {availableQuestions.length > 0 ? (
            <div className="interrogatio-divina__questions">
              <p className="interrogatio-divina__questions-label">
                Selecciona tu interrogación:
              </p>
              {availableQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(i)}
                  disabled={isTyping}
                  className="interrogatio-divina__question-btn"
                >
                  <MessageSquare className="interrogatio-divina__question-icon" />
                  <span>{q.question}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="interrogatio-divina__empty">
              <div className="interrogatio-divina__empty-icon">✨</div>
              <p className="interrogatio-divina__empty-text">
                El numen se retira. El coloquio ha concluido.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterrogatioDivina;
