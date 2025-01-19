import React from 'react';
import colors from '../../utils/style/colors';

import styled from 'styled-components';

const StyledListItem = styled.li`
    margin: 8px 0;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid ${colors.lightGrey2};
    transition: border-color 0.3s ease-out, transform 0.3s ease-out;
    border-color: ${({ isSelected, isHovered }) =>
        isSelected ? colors.primary : colors.lightGrey2};

    ${({ isHovered }) =>
        isHovered &&
        `
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        cursor: grab;
    `}
    cursor: pointer;
`;

const AnalyticComponentItem = ({
    cell,
    isSelected,
    isHovered,
    onHover,
    onUnhover,
    onClick,
}) => {
    // Pour simplifier, on extrait quelques infos du cell.
    const cellType = cell.get('type'); // e.g. "logic.Resistance"
    const symbol = cell.get('symbol'); // e.g. "R", "L", "C"
    const value = cell.get('value'); // e.g. 100, 0.001...
    const cellId = cell.id; // l'ID unique JointJS

    // Distinction composant vs lien
    const isLink = cell.isLink();

    // Exemple :
    // - S'il s'agit d'un lien, on récupère la source et la target
    // - On peut essayer de remonter au "type" ou "symbol" des extrémités
    const source = isLink ? cell.source() : null;
    const target = isLink ? cell.target() : null;

    // On personnalise l'affichage/les styles
    const itemStyle = {
        margin: '8px 0',
        padding: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        backgroundColor: isSelected
            ? '${colors.primary}'
            : isHovered
            ? '#f5f5f5'
            : 'white',
        cursor: 'pointer',
    };

    return (
        <StyledListItem
            isSelected={isSelected}
            isHovered={isHovered}
            // Survol
            onMouseEnter={() => onHover(cellId)}
            onMouseLeave={() => onUnhover(cellId)}
            // Clic
            onClick={() => onClick(cellId)}
        >
            <div>
                <strong>ID:</strong> {cellId}
            </div>
            <div>
                <strong>Type:</strong> {cellType}
            </div>

            {/* Si c'est un composant */}
            {!isLink && (
                <>
                    {symbol && (
                        <div>
                            <strong>Symbol:</strong> {symbol}
                        </div>
                    )}
                    {typeof value !== 'undefined' && (
                        <div>
                            <strong>Valeur:</strong> {value}
                        </div>
                    )}
                </>
            )}

            {/* Si c'est un lien */}
            {isLink && (
                <>
                    <div>
                        <strong>Source:</strong> {JSON.stringify(source)}
                    </div>
                    <div>
                        <strong>Target:</strong> {JSON.stringify(target)}
                    </div>
                </>
            )}
        </StyledListItem>
    );
};

export default AnalyticComponentItem;
