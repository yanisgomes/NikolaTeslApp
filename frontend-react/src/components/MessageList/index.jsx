import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChatBubble from '../ChatBubble';
import 'bootstrap/dist/css/bootstrap.min.css';

const MessageList = ({ messages }) => {
    const messagesEndRef = useRef(null);

    // Permet de scroller automatiquement en bas lorsqu’un nouveau message arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div
            className="p-3 mb-3"
            style={{
                flex: '1 1 auto',
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 200px)', // Ajustez la hauteur selon votre mise en page
            }}
        >
            {messages.map((msg, idx) => (
                <ChatBubble key={idx} text={msg.text} sender={msg.sender} />
            ))}

            {/* Élément invisible qui sert de cible pour scroller */}
        </div>
    );
};

MessageList.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string,
            sender: PropTypes.oneOf(['user', 'llm']),
        })
    ).isRequired,
};

export default MessageList;
