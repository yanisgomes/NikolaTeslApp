import { useContext } from 'react';
import { ThemeContext } from '../../utils/context/';

import { Link } from 'react-router-dom';

import colors from '../../utils/style/colors.js';
import styled from 'styled-components';
import Header from '../Header/index.jsx';

import image404 from '../../assets/logo_lissajous.png';

const ErrorContainer = styled.div`
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const StyledSpan = styled.span`
    color: ${colors.text};
`;

const StyledLink = styled(Link)`
    padding: 12px;
    margin: 5px;
    text-decoration: none;
    font-size: 18px;

    color: ${(props) =>
        props.theme === 'light'
            ? colors.darkBackgroundSecondary
            : colors.backgroundLight};

    &:hover {
        color: ${colors.secondary};
    }

    ${(props) =>
        props.$isFullLink &&
        `color: white;
        border-radius: 30px;
        background-color: ${colors.primary};
        text-decoration: none;

        &:hover {
            color: white;
            background-color: ${colors.secondary}
        }
        `}
`;

function Error() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <>
            <Header />
            <ErrorContainer>
                <StyledSpan>Error 404</StyledSpan>
                <StyledLink to="/" theme={theme}>
                    Retourner sur NikolaTeslApp
                </StyledLink>
            </ErrorContainer>
        </>
    );
}

export default Error;
