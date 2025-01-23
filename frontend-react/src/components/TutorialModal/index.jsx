import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';

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
    color: ${colors.text};
    margin-bottom: 1rem;
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
    &:hover {
        background: ${colors.secondary};
    }
`;

// ---- COMPOSANT MODAL ----
function TutorialModal({ isOpen, onClose }) {
    if (!isOpen) return null; // Si la fenêtre doit être fermée, on ne renvoie rien.

    return (
        <Overlay>
            <ModalContainer>
                <ModalTitle>Bienvenue sur la page Circuit</ModalTitle>

                <ModalParagraph>
                    Avant de commencer, voici un bref tutoriel pour découvrir
                    comment créer et explorer vos circuits électriques.
                </ModalParagraph>

                <ModalList>
                    <li>
                        1. Cliquez sur <strong>“Créer un composant”</strong>{' '}
                        pour ajouter un élément à votre circuit.
                    </li>
                    <li>
                        2. Faites glisser vos composants pour les organiser et
                        les relier.
                    </li>
                    <li>
                        3. Visualisez les équations et la simulation en temps
                        réel.
                    </li>
                    <li>
                        4. Sauvegardez votre circuit ou partagez-le avec vos
                        collègues.
                    </li>
                </ModalList>

                <ModalParagraph>
                    Vous pouvez retrouver ce didacticiel à tout moment dans le
                    menu d’aide. Bonne exploration !
                </ModalParagraph>

                {/* Bouton pour fermer la modale et commencer à utiliser le site */}
                <ModalButton onClick={onClose}>Commencer</ModalButton>
            </ModalContainer>
        </Overlay>
    );
}

export default TutorialModal;
