import { useContext } from 'react';
import { ThemeContext } from '../../utils/context/';

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import fonts from '../../utils/style/fonts';
import imgTesla from '../../assets/logo_lissajous.png';

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0px;
    width: 100%;
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
    text-decoration: none;

    font-family: ${fonts.mainFont};
    font-size: 18px;
    font-weight: bold;
    margin-left: 20px;
    color: ${(props) =>
        props.theme === 'dark'
            ? colors.darkBackgroundSecondary
            : colors.lightText};

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

const StyledLinkForButton = styled(Link)`
    padding: 12px;
    text-decoration: none;

    font-family: ${fonts.mainFont};
    font-size: 18px;
    font-weight: bold;
    margin-left: 20px;
    color: ${(props) =>
        props.theme === 'dark' ? colors.darkBackgroundSecondary : '#ffffff'};

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
            background-color: #ffffff;
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
        props.theme === 'light' ? colors.lightText : colors.backgroundLight};
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    height: auto;
`;

const GradientButton = styled.button`
    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
    background-size: 300%;
    color: ${colors.backgroundLight};
    border: none;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border-radius: 25px;
    cursor: pointer;
    transition: background-position 0.5s, box-shadow 0.3s;

    &:hover {
        background-position: right center;
    }
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
                    <GradientButton as={StyledLinkForButton} to="/circuit/">
                        Créer un circuit
                    </GradientButton>
                </ButtonWrapper>
            </nav>
        </StyledHeader>
    );
}

export default Header;
