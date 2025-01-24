import React, { useContext } from 'react';
import { ThemeContext } from '../../utils/context/';
import styled from 'styled-components';
import colors from '../../utils/style/colors.js';

import { Link } from 'react-router-dom';
import fonts from '../../utils/style/fonts';

import LatexComponent from '../../components/LatexComponent';

// ------ Import des images (exemple) ------
import backgroundImg from '../../assets/background-electricity.jpg';
import imgHome from '../../assets/fonction-transfert-home.png';
import imgTesla from '../../assets/nikola-tesla-cartoon.png';

// ------ Import des composants existants ------
import Header from '../../components/Header/index.jsx';
import Footer from '../../components/Footer/index.jsx';

// ------ STYLED COMPONENTS ------

const MainContainer = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0px 24px;
    justify-content: space-between;
`;

// Container qui gère l'image de fond + un overlay dégradé
const BackgroundContainer = styled.div`
    position: relative;
    z-index: 1;
    width: 70%;
    height: 60vh;
    background: url(${backgroundImg}) center/cover no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transition: transform 0.3s ease-in-out;
    &:hover {
        transform: scale(1.04);
    }

    // overlay dégradé pour uniformiser et rendre le texte plus lisible
    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: linear-gradient(
            135deg,
            ${colors.backgroundLight}aa,
            ${colors.primary}66
        );
        z-index: 0;
    }
`;

// Conteneur principal pour placer le contenu au-dessus de l’overlay
const HeroContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

// Style du titre principal
const StyledTitle = styled.h1`
    text-align: left;
    color: ${colors.text};
    font-size: 3.5rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    transition: all 0.4s ease-in-out;

    /* Au survol, on applique un effet de texte en dégradé */
    &:hover {
        background: linear-gradient(
            90deg,
            ${colors.primary},
            ${colors.secondary}
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`;

// Style du sous-titre / phrase d’accroche
const StyledSubtitle = styled.h2`
    color: ${colors.text};
    font-size: 1.5rem;
    margin-bottom: 2rem;
`;

// Container pour les textes + CTAs
const TextContainer = styled.div`
    flex: 1;
    padding: 1rem;
`;

// Exemple de liste ou descriptif
const StyledList = styled.ul`
    margin-bottom: 1.5rem;
    li {
        color: ${colors.text};
        margin-bottom: 0.75rem;
        font-size: 1.1em;
        &:hover {
            color: ${colors.primary};
        }
    }
`;

// Bouton avec un dégradé animé
const GradientButton = styled.button`
    z-index: 0!!;
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

// Image principale (par ex. schéma ou illustration)
const StyledImageMain = styled.img`
    max-width: 450px;
    width: 50vh;
    object-fit: contain;
`;

// Image de Tesla ou autre visuel
const StyledImageTesla = styled.img`
    max-height: 400px;
    margin-bottom: 2vh;
    object-fit: contain;
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

const LatexButton = styled.button`
    z-index: 0!!;
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

const LatexComponentContainer = styled.div`
    border-radius: 25px;
    background-color: '#ffffff';
    padding: 4px;
`;

function Home() {
    const { theme } = useContext(ThemeContext);

    return (
        <MainContainer>
            <Header />

            {/* Nouveau titre moderne */}
            <div style={{ alignItems: 'left' }}>
                <StyledTitle>
                    Solveur analytique pour l’électronique.
                    <br />
                    Dessiner. Brancher. Exprimer.
                </StyledTitle>
            </div>

            <BackgroundContainer>
                <LatexButton as={StyledLinkForButton} to="/circuit/">
                    <LatexComponentContainer>
                        <LatexComponent
                            latex={`\\Large{H(s) = \\frac{S(p)}{E(p)}} ?`}
                        />
                    </LatexComponentContainer>
                </LatexButton>
            </BackgroundContainer>

            <Footer />
        </MainContainer>
    );
}

export default Home;
