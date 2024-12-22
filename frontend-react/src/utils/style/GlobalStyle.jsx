import { useContext } from 'react';
import { ThemeContext } from '../context/';

import colors from './colors.js';

import { createGlobalStyle } from 'styled-components';

// const GlobalStyle = createGlobalStyle`
//   div {
//     font-family: 'Trebuchet MS', Helvetica, sans-serif;
//   }
//   h1 {
//     font-family: 'Trebuchet MS', Helvetica, sans-serif;
//     font-weight: 700;
//     font-size: 50px;
//     line-height: 80.25px;
//     color: ${colors.text};
//   }
//   button {
//     font-family: 'Comportaa', sans-serif;
//     font-weight: 700;
//     font-size: 20px;
//     line-height: 22.3px;
//     color: #FFFFFF;
//     border-radius: 20px;
//     border: none;
//     background-color: ${colors.primary};
//
//   }
// `;
const baseFontFamily = 'Montserrat, sans-serif';

const StyledGlobalStyle = createGlobalStyle`
    * {
        font-family: ${baseFontFamily};
    }
 
    body {
        margin: 0;  
    }
    div {
        font-family: ${baseFontFamily};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    h1 {
        font-family: ${baseFontFamily};
        font-weight: 700;
        font-size: 50px;
        line-height: 80.25px;
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    h2 {
        font-family: ${baseFontFamily};
        font-weight: 700;
        font-size: 30px;
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    h3 {
        font-family: ${baseFontFamily};
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    span {
        font-family: ${baseFontFamily};
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    li {
        font-family: ${baseFontFamily};
        color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkText : colors.lightText};
        background-color: ${({ isDarkMode }) =>
            isDarkMode ? colors.darkBackground : colors.lightBackground};
    }
    button {
        font-family: 'Comportaa', sans-serif;
        font-weight: 700;
        font-size: 20px;
        line-height: 22.3px;
        color: #FFFFFF;
        border-radius: 20px;
        border: none;
        background-color: ${colors.primary};
        padding: 10px 20px;
    }
`;

function GlobalStyle() {
    const { theme } = useContext(ThemeContext);

    return <StyledGlobalStyle isDarkMode={theme === 'dark'} />;
}

export default GlobalStyle;
