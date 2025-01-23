import React, { useContext } from 'react';
import { ThemeContext } from '../../utils/context/';
import styled from 'styled-components';
import colors from '../../utils/style/colors.js';

// ------ Import des images (exemple) ------
import backgroundImg from '../../assets/background-electricity.jpg';
import imgHome from '../../assets/fonction-transfert-home.png';
import imgTesla from '../../assets/nikola-tesla-cartoon.png';

// ------ Import des composants existants ------
import Header from '../../components/Header/index.jsx';
import Footer from '../../components/Footer/index.jsx';

// ------ STYLED COMPONENTS ------

// Container qui gère l'image de fond + un overlay dégradé
const BackgroundContainer = styled.div`
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: url(${backgroundImg}) center/cover no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

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
    position: relative;
    z-index: 1;
    width: 80%;
    max-width: 1200px;
    margin: 40px auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

// Effet tilt 3D au survol
const TiltWrapper = styled.div`
    perspective: 1000px;
    transition: transform 0.3s ease-in-out;
    &:hover {
        transform: scale(1.03);
    }

    // L'image subit la rotation dans un conteneur interne
    div {
        transition: transform 0.3s ease-in-out;
    }
    &:hover div {
        transform: rotateX(5deg) rotateY(5deg);
    }
`;

// Style du titre principal
const StyledTitle = styled.h1`
    color: ${colors.text};
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px #00000055;
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
    background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
    background-size: 200%;
    color: ${colors.backgroundLight};
    border: none;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border-radius: 25px;
    cursor: pointer;
    transition: background-position 0.5s;

    &:hover {
        background-position: right center;
        box-shadow: 0 0 10px ${colors.primary};
    }
`;

// Image principale (par ex. schéma ou illustration)
const StyledImageMain = styled.img`
    max-width: 450px;
    width: 50vw;
    object-fit: contain;
`;

// Image de Tesla ou autre visuel
const StyledImageTesla = styled.img`
    max-height: 400px;
    margin-bottom: 2vh;
    object-fit: contain;
`;

function Home() {
    const { theme } = useContext(ThemeContext);

    return (
        <>
            <Header />

            <BackgroundContainer>
                <HeroContainer>
                    {/* Bloc Texte + CTA */}
                    <TextContainer>
                        <StyledTitle>
                            Déclenchez l'éclair de génie !
                        </StyledTitle>
                        <StyledSubtitle>
                            Plongez dans un univers d’exploration électrique et
                            découvrez comment réaliser des circuits en un clin
                            d’œil.
                        </StyledSubtitle>

                        <StyledList>
                            <li>
                                Interface interactive et intuitive pour
                                visualiser vos idées
                            </li>
                            <li>
                                Approche ludique des phénomènes électriques et
                                électroniques
                            </li>
                            <li>
                                Formalisation mathématique détaillée pour
                                approfondir vos circuits
                            </li>
                        </StyledList>

                        {/* Boutons d'appel à l'action */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <GradientButton>
                                Créer un nouveau circuit
                            </GradientButton>
                            <GradientButton>
                                Découvrir les fonctionnalités
                            </GradientButton>
                        </div>
                    </TextContainer>

                    {/* Bloc Illustration / Tesla */}
                    <TiltWrapper>
                        <div>
                            <StyledImageTesla
                                src={imgTesla}
                                alt="Illustration Nikola Tesla"
                            />
                        </div>
                    </TiltWrapper>

                    {/* Image supplémentaire (facultative) */}
                    <StyledImageMain src={imgHome} alt="Schéma de circuit" />
                </HeroContainer>
            </BackgroundContainer>

            <Footer />
        </>
    );
}

export default Home;
