import colors from './style/colors.js';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
 
    to {
    transform: rotate(360deg);
    }
`;

export const Loader = styled.div`
    display: inline-block;
    padding: 10px;
    border: 6px solid ${colors.primary};
    border-bottom-color: transparent;
    border-radius: 20px;
    animation: ${rotate} 1s infinite linear;
    height: 0;
    width: 0;
`;
