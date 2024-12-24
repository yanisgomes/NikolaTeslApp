import { useContext } from 'react';
import { ThemeContext } from '../context/';

import colors from './colors.js';
import fonts from './fonts.js';

import { createGlobalStyle } from 'styled-components';

const StyledGlobalStyle = createGlobalStyle`
    * {
        font-family: ${fonts.mainFont};
    }
 
    body {
        margin: 0;  
    }
    div {
        font-family: ${fonts.mainFont};
        font-size: 12px;
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    h1 {
        font-family: ${fonts.mainFont};
        font-weight: 700;
        font-size: 50px;
        line-height: 80.25px;
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    h2 {
        font-family: ${fonts.mainFont};
        font-weight: 700;
        font-size: 30px;
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    h3 {
        font-family: ${fonts.mainFont};
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    h4 {
        font-family: ${fonts.mainFont};
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    span {
        font-family: ${fonts.mainFont};
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    li {
        font-family: ${fonts.mainFont};
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    button {
        font-family: ${fonts.mainFont};
        font-weight: 700;
        font-size: 20px;
        line-height: 22.3px;
        color: #FFFFFF;
        border-radius: 20px;
        border: none;
        background-color: ${colors.primary};
    }
`;

function GlobalStyle() {
    const { theme } = useContext(ThemeContext);

    return <StyledGlobalStyle isDarkMode={theme === 'dark'} />;
}

export default GlobalStyle;
