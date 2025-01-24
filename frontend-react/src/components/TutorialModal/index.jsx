import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';

import { getIconAsUrl } from '../../utils/utils';

import {
    VscCircuitBoard,
    VscDebugStepInto,
    VscSymbolOperator,
    VscPulse,
    VscSparkle,
    VscQuestion,
} from 'react-icons/vsc';

// ---- IMPORT DES ICONES ----
const VscCircuitBoardUrl = getIconAsUrl(<VscCircuitBoard />);
const VscDebugStepIntoUrl = getIconAsUrl(<VscDebugStepInto />);
const VscSymbolOperatorUrl = getIconAsUrl(<VscSymbolOperator />);
const VscPulseUrl = getIconAsUrl(<VscPulse />);
const VscSparkleUrl = getIconAsUrl(<VscSparkle />);
const VscQuestionUrl = getIconAsUrl(<VscQuestion />);

// ---- STYLED COMPONENTS ----
// Overlay qui grise l’arrière-plan
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Conteneur de la fenêtre modale
const ModalContainer = styled.div`
    background: ${colors.backgroundLight};
    width: 600px;
    max-width: 90%;
    padding: 2rem;
    border-radius: 10px;
    position: relative;
`;

// Titre de la modale
const ModalTitle = styled.h2`
    margin-top: 0;
    color: ${colors.text};
    margin-bottom: 1rem;
`;

// Paragraphe / description
const ModalParagraph = styled.p`
    font-size: 1rem;
    color: ${colors.text};
    margin-bottom: 2rem;
    margin-top: 1rem;
`;

// Liste par exemple pour décrire les étapes
const ModalList = styled.ul`
    margin-bottom: 1rem;
    li {
        margin-bottom: 0.5rem;
        color: ${colors.text};
    }
`;

// Bouton de fermeture / validation (en bas à droite)
const ModalButton = styled.button`
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: ${colors.primary};
    color: ${colors.backgroundLight};
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 25px;
    cursor: pointer;

    margin-top: 16px;
    &:hover {
        background: ${colors.secondary};
    }
`;

// ---- COMPOSANT MODAL ----
function TutorialModal({ isOpen, onClose }) {
    if (!isOpen) return null; // Si la fenêtre doit être fermée, on ne renvoie rien.

    // Styled component for list items with icons
    const ModalListItem = styled.li`
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: ${colors.text};
        list-style: none;
        display: flex;
        align-items: center;
        gap: 0.8rem;

        &::before {
            content: '';
            display: inline-block;
            margin-right: 0.5rem;
            font-size: 1.5rem;
            background-size: contain;
            background-repeat: no-repeat;
            width: 2rem;
            height: 2rem;
        }

        &:nth-child(1)::before {
            background-image: url(${VscCircuitBoardUrl});
        }

        &:nth-child(2)::before {
            background-image: url(${VscDebugStepIntoUrl});
        }

        &:nth-child(3)::before {
            background-image: url(${VscSymbolOperatorUrl});
        }

        &:nth-child(4)::before {
            background-image: url(${VscPulseUrl});
        }

        &:nth-child(5)::before {
            background-image: url(${VscSparkleUrl});
        }

        &:nth-child(6)::before {
            background-image: url(${VscQuestionUrl});
        }

        &:hover {
            color: ${colors.primary};
            transform: scale(1.01);
            transition: transform 0.2s, color 0.2s;
        }
    `;

    return (
        <Overlay>
            <ModalContainer>
                <ModalTitle>Bienvenue dans l'éditeur de Circuit !</ModalTitle>

                <ModalParagraph>
                    Avant de commencer, voici un bref tutoriel pour découvrir
                    comment créer et explorer vos circuits électriques.
                </ModalParagraph>

                <ModalList>
                    <ModalListItem>
                        Utilisez le menu Composants pour glisser/déposer des
                        composants sur votre plan de travail un élément à votre
                        circuit.
                    </ModalListItem>
                    <ModalListItem>
                        Branchez l'Entrée Analytique et la Sortie Analytique à
                        votre circuit.
                    </ModalListItem>
                    <ModalListItem>
                        Lancez la résolution dans le menu Fonction de transfert.
                    </ModalListItem>
                    <ModalListItem>
                        Visualisez les réponses temporelles et fréquentielles.
                    </ModalListItem>
                    <ModalListItem>
                        Utilisez Nikola pour répondre à des questions sur votre
                        circuit.
                    </ModalListItem>
                    <ModalListItem>
                        Besoin d’aide ? Consultez le menu d’aide.
                    </ModalListItem>
                </ModalList>
                <ModalButton onClick={onClose}>Continuer</ModalButton>
            </ModalContainer>
        </Overlay>
    );
}

export default TutorialModal;
