// src/components/AnalyticComponentItem/index.jsx
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import fonts from './../../utils/style/fonts';

import ACIButton from './../AnalyticComponentItemButton';

import {
    VscSparkle,
    VscTrash,
    VscChevronUp,
    VscChevronDown,
} from 'react-icons/vsc';

import { getIconAsUrl } from '../../utils/utils';

const VscSparkleUrl = getIconAsUrl(<VscSparkle />);
const VscTrashUrl = getIconAsUrl(<VscTrash />);
const VscChevronUpUrl = getIconAsUrl(<VscChevronUp />);
const VscChevronDownUrl = getIconAsUrl(<VscChevronDown />);

const ACItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid transparent;
    border-radius: 8px;
    margin-bottom: 8px;
    padding: 8px;
    transition: border 0.3s, transform 0.3s;

    /* Au survol, on change la bordure et on décale légèrement vers la droite */
    ${({ isHovered }) =>
        isHovered &&
        css`
            border-color: #ccc;
        `}
`;

const HoverButtonContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const AnalyticComponentItem = ({
    name,
    value,
    symbol,
    onChangeValue,
    onRequestAI,
    onDelete,
    // Ajout pour la sélection / survol
    isSelected = false,
    isHovered = false,
    onSelect,
    onHover,
    onUnhover,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const handleToggleExpand = () => setIsExpanded((prev) => !prev);
    const symbolDictionary = {
        R: 'Résistance',
        L: 'Inductance',
        C: 'Capacité',
        V: 'Tension',
        I: 'Courant',
    };

    return (
        <ACItemContainer
            onMouseEnter={() => onHover?.()}
            onMouseLeave={() => onUnhover?.()}
            onClick={() => onSelect?.()}
            isSelected={isSelected}
            isHovered={isHovered}
        >
            {/* Partie supérieure (nom, valeur, icônes conditionnelles) */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <span
                    style={{
                        marginRight: '14px',
                        fontFamily: fonts.mainFont,
                        fontSize: '16px',
                    }}
                >
                    {symbolDictionary[symbol] || symbol} : {name}
                </span>

                {/* Champ de saisie de la valeur numérique */}
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChangeValue(e.target.value)}
                    style={{ marginRight: '16px', width: '80px' }}
                />

                {/* Boutons visibles uniquement au survol */}
                {isHovered && (
                    <HoverButtonContainer>
                        <ACIButton
                            onClick={onRequestAI}
                            logoUrl={VscSparkleUrl}
                            size="30px"
                        />
                        <ACIButton
                            onClick={onDelete}
                            logoUrl={VscTrashUrl}
                            size="30px"
                        />
                        <ACIButton
                            onClick={handleToggleExpand}
                            logoUrl={
                                isExpanded ? VscChevronUpUrl : VscChevronDownUrl
                            }
                            size="30px"
                            variant="variation"
                        />
                    </HoverButtonContainer>
                )}
            </div>

            {/* Contenu additionnel, affiché si déplié */}
            {isExpanded && (
                <div
                    style={{
                        marginTop: '8px',
                        backgroundColor: '#f9f9f9',
                        padding: '8px',
                        borderRadius: '4px',
                    }}
                >
                    <p>Informations supplémentaires sur {name}…</p>
                    {/* ... */}
                </div>
            )}
        </ACItemContainer>
    );
};

export default AnalyticComponentItem;
