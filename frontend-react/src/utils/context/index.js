import { useState, createContext } from 'react';
import * as joint from 'jointjs';

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

export const CircuitGraphContext = createContext();
export const PaperContext = createContext();

export const CircuitGraphProvider = ({ children }) => {
    const defaultGraph = new joint.dia.Graph();
    const [circuitGraph, setCircuitGraph] = useState(defaultGraph); // A completer

    return (
        <CircuitGraphContext.Provider value={{ circuitGraph, setCircuitGraph }}>
            {children}
        </CircuitGraphContext.Provider>
    );
};

export const PaperProvider = ({ children }) => {
    const [paper, setPaper] = useState(null);

    return (
        <PaperContext.Provider value={{ paper, setPaper }}>
            {children}
        </PaperContext.Provider>
    );
};

export const GraphContext = createContext();

export const GraphProvider = GraphContext.Provider;

export default GraphContext;
