import { useState, createContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const CircuitContext = createContext();

export const CircuitProvider = ({ children }) => {
    const [answers, setAnswers] = useState({});
    const saveAnswers = (newAnswers) => {
        setAnswers({ ...answers, ...newAnswers });
    };

    return (
        <CircuitContext.Provider value={{ answers, saveAnswers }}>
            {children}
        </CircuitContext.Provider>
    );
};
