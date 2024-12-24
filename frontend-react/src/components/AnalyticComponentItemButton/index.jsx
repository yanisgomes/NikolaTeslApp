// src/components/AnalyticComponentItemButton/index.jsx

import React from 'react';
import styled from 'styled-components';
import colors from './../../utils/style/colors';
import { useContext } from 'react';
import { ThemeContext } from '../../utils/context';

/**
 * StyledButton : bouton rond avec un logo, la bordure change au hover/click,
 * et un paramètre variant pour changer le background.
 */
const StyledButton = styled.button`
    position: relative;
    width: ${(props) => props.size || '50px'};
    height: ${(props) => props.size || '50px'};

    min-width: 30px;
    min-height: 30px;

    border: 1px solid transparent; /* Par défaut: pas de bordure apparente */
    border-radius: 50%;

    /* Gestion du background en fonction du theme et du variant */
    background-color: ${(props) => {
        const { theme, variant } = props;

        // Couleurs par défaut
        const defaultBg =
            theme === 'dark' ? colors.lightGrey2 : colors.lightGrey2;
        const clearBg =
            theme === 'dark' ? colors.lightGrey3 : colors.lightGrey3;

        if (variant === 'clear') {
            return clearBg;
        } else {
            return defaultBg;
        }
    }};

    /* Le logo en fond (centré, pas répété) */
    background-image: url(${(props) => props.logoUrl});
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;

    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s; /* On retire la transition de transform */

    /* Survol */
    &:hover {
        border-color: ${colors.primary};
    }

    /* Clic */
    &:active {
        border-color: ${colors.secondary};
    }
`;

const ACIButton = ({ onClick, logoUrl, size, variant }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <StyledButton
            onClick={onClick}
            size={size}
            logoUrl={logoUrl}
            theme={theme}
            variant={variant} // <-- nouvelle prop pour la couleur de fond
        />
    );
};

export default ACIButton;
