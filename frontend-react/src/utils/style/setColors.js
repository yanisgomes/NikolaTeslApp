import colors from './colors';

const setCSSVariables = () => {
    const root = document.documentElement;
    Object.keys(colors).forEach((colorKey) => {
        root.style.setProperty(`--${colorKey}`, colors[colorKey]);
    });
};

export default setCSSVariables;
