import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Si vous n'importez pas déjà Bootstrap ailleurs

/**
 * ChatBubble reçoit :
 * - text : le texte du message
 * - sender : "user" ou "llm"
 */
const ChatBubble = ({ text, sender }) => {
    // Classes Bootstrap permettant d'aligner la bulle à gauche ou à droite
    // selon l'expéditeur
    const bubbleClass =
        sender === 'user' ? 'justify-content-end' : 'justify-content-start';

    // Couleur de fond différente en fonction de l'expéditeur
    const bubbleStyle =
        sender === 'user'
            ? { backgroundColor: '#007bff', color: '#fff' }
            : { backgroundColor: '#f1f0f0', color: '#333' };

    return (
        <div className={`d-flex mb-2 ${bubbleClass}`}>
            <span
                style={{
                    ...bubbleStyle,
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    maxWidth: '60%',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                }}
            >
                {text}
            </span>
        </div>
    );
};

ChatBubble.propTypes = {
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(['user', 'llm']).isRequired,
};

export default ChatBubble;
