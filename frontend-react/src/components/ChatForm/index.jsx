import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * ChatForm reçoit :
 * - onSend : fonction à appeler quand l'utilisateur envoie un message
 */
const ChatForm = ({ onSend }) => {
    const [currentMessage, setCurrentMessage] = useState('');

    const handleSendClick = () => {
        const trimmed = currentMessage.trim();
        if (trimmed.length > 0) {
            onSend(trimmed);
            setCurrentMessage('');
        }
    };

    // Permet d'envoyer via la touche Entrée (optionnel)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    return (
        <div className="input-group">
            <textarea
                className="form-control"
                rows={1}
                placeholder="Écrivez votre message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className="btn btn-primary" onClick={handleSendClick}>
                Envoyer
            </button>
        </div>
    );
};

ChatForm.propTypes = {
    onSend: PropTypes.func.isRequired,
};

export default ChatForm;
