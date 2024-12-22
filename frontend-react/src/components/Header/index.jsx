import { useContext } from 'react';
import { ThemeContext } from '../../utils/context/';

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import imgTesla from '../../assets/logo_lissajous.png';

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;

    border-bottom: 2px solid
        ${(props) =>
            props.theme === 'dark'
                ? colors.lightBackground
                : colors.darkBackground};
`;

const StyledImage = styled.img`
    border-radius: 5%;
    width: 10%;
    transition: transform 0.2s ease-in-out;
    &:hover {
        transform: scale(1.15);
    }
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

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
`;

const TitleApp = styled.h2`
    color: ${(props) =>
        props.theme === 'light'
            ? colors.darkBackgroundSecondary
            : colors.backgroundLight};
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    height: auto;
`;

function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <StyledHeader theme={theme}>
            <TitleWrapper style={{ marginRigth: 'auto' }}>
                <StyledImage src={imgTesla} alt="nikola-tesla-logo" />
                <TitleApp theme={theme}>NikolaTeslApp</TitleApp>
            </TitleWrapper>
            <nav>
                <ButtonWrapper>
                    <StyledLink to="/" theme={theme}>
                        Accueil
                    </StyledLink>
                    <StyledLink to="/galerie/" theme={theme}>
                        Galerie
                    </StyledLink>
                    <StyledLink to="/freelances" theme={theme}>
                        Profils
                    </StyledLink>
                    <StyledLink to="/circuit/" theme={theme} $isFullLink>
                        Créer un circuit
                    </StyledLink>
                </ButtonWrapper>
            </nav>
        </StyledHeader>
    );
}

export default Header;
