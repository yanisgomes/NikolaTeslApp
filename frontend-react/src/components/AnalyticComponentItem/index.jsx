// src/components/AnalyticComponentItem/index.jsx
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import fonts from './../../utils/style/fonts';

const ACItemContainer = styled.div`
    /* idem que précédemment */
    /* highlight si sélectionné ou survolé */
    ${({ isSelected, isHovered }) =>
        isSelected
            ? css`
                  border-color: #ff5555;
                  transform: translateX(2px);
              `
            : isHovered
            ? css`
                  border-color: #ffaa00;
                  transform: translateX(2px);
              `
            : css`
                  border-color: transparent;
              `}
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
                    {name}
                    {symbol ? `${symbol}` : ''}
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Bouton pour IA */}
                        <button
                            onClick={onRequestAI}
                            style={{
                                marginRight: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            IA
                        </button>

                        {/* Bouton de suppression */}
                        <button
                            onClick={onDelete}
                            style={{ cursor: 'pointer' }}
                        >
                            🗑
                        </button>

                        {/* Flèche de dépliage/repliage */}
                        <button
                            onClick={handleToggleExpand}
                            style={{
                                marginLeft: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            {isExpanded ? '▲' : '▼'}
                        </button>
                    </div>
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
