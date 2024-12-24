import React from 'react';
import styled from 'styled-components';
import colors from './../../utils/style/colors';
import { useContext } from 'react';
import { ThemeContext } from '../../utils/context';

const StyledButton = styled.button`
    position: relative;
    width: ${(props) => props.size || '50px'}; /* Taille ajustable */
    height: ${(props) => props.size || '50px'};

    min-width: 30px; /* Taille minimale pour éviter la disparition */
    min-height: 30px;

    border: none;
    border-radius: 50%;

    background-color: ${(props) =>
        props.theme === 'dark' ? colors.lightGrey2 : colors.lightGrey2};

    background-image: url(${(props) =>
        props.logoUrl}); /* Utilisation du logo comme image de fond */

    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;

    &:hover {
        transform: translateY(-2px);
        background-color: ${(props) =>
            props.theme === 'dark' ? colors.lightGrey3 : colors.lightGrey3};
    }

    &:active {
        transform: translateY(2px);
        background-color: ${(props) =>
            props.theme === 'dark' ? colors.lightGrey2 : colors.lightGrey2};
    }
`;

const ToolbarButton = ({ onClick, logoUrl, size }) => {
    const { theme } = useContext(ThemeContext);
    return (
        <StyledButton
            onClick={onClick}
            size={size}
            logoUrl={logoUrl}
            theme={theme}
        />
    );
};

export default ToolbarButton;
