import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { useContext } from 'react';

import { ThemeContext } from '../../utils/context/';

const FooterContainer = styled.footer`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
`;

const NightModeButton = styled.button`
    margin: 20px;
    background-color: transparent;
    cursor: pointer;
    color: ${colors.secondary};
    border-radius: 30px;
    border: none;
    transition: 200ms;
    &:hover {
        box-shadow: 3px 3px 10px
            ${({ isDarkMode }) =>
                isDarkMode === 'dark'
                    ? colors.backgroundLight
                    : colors.primary};
    }
`;

function Footer() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <FooterContainer>
            <NightModeButton onClick={() => toggleTheme()}>
                Mode {theme === 'light' ? '☀️' : '🌙'}
            </NightModeButton>
        </FooterContainer>
    );
}

export default Footer;
