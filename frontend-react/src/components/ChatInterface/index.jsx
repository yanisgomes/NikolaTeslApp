import React, { useState } from 'react';
import MessageList from '../MessageList';
import ChatForm from '../ChatForm';

/**
 * ChatInterface is the parent component of the chat UI.
 * - The ChatForm is "pinned" at the bottom via `position: sticky; bottom: 0`.
 * - MessageList is scrollable inside a fixed-height container.
 */
const ChatInterface = () => {
    const [messages, setMessages] = useState([]);

    /**
     * handleSend is called when the user clicks "Envoyer" in ChatForm.
     *  1) Adds the user message
     *  2) Simulates or calls an API for the LLM's response
     */
    const handleSend = (userMessage) => {
        // 1. Add the user's message
        const newMessage = { text: userMessage, sender: 'user' };
        setMessages((prev) => [...prev, newMessage]);

        // 2. Simulate a delay for LLM response
        setTimeout(() => {
            const llmResponse = {
                text: `Réponse simulée pour : "${userMessage}"`,
                sender: 'llm',
            };
            setMessages((prev) => [...prev, llmResponse]);
        }, 1500);
    };

    return (
        <div
            className="container d-flex flex-column"
            style={{
                height: '78vh',
                position: 'relative',
                /* Hides extra scroll on the container itself */
                overflow: 'hidden',
            }}
        >
            <h2 className="mb-3">Demande à Nikola !</h2>

            {/* SCROLLABLE Messages */}
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                }}
            >
                <MessageList messages={messages} />
            </div>

            {/* Sticky Form */}
            <div
                style={{
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: '#fff',
                    paddingTop: '1rem',
                }}
            >
                <ChatForm onSend={handleSend} />
            </div>
        </div>
    );
};

export default ChatInterface;
