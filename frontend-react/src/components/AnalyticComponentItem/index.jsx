import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';

import {
    VscSymbolInterface,
    VscTypeHierarchy,
    VscCircuitBoard,
} from 'react-icons/vsc';
import ValueEditor from '../ComponentValueEditor';
import { getUnitFromCellType } from '../../utils/utils';

// Notre fonction de mapping
function getFrenchNameForCellType(cellType) {
    if (!cellType) return 'Composant inconnu';
    const lowerType = cellType.toLowerCase();

    if (lowerType.includes('resistor')) {
        return 'Résistance';
    }
    if (lowerType.includes('aop')) {
        return 'Amplificateur Opérationnel';
    }
    if (lowerType.includes('inductor')) {
        return 'Inductance';
    }
    if (lowerType.includes('capacitor')) {
        return 'Capacité';
    }

    return 'Composant générique';
}

const StyledListItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;

    margin: 8px 0;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid ${colors.lightGrey2};

    border-color: ${({ isSelected }) =>
        isSelected ? colors.primary : colors.lightGrey2};
    transition: border-color 0.3s ease, transform 0.3s ease,
        box-shadow 0.3s ease;

    ${({ isHovered }) =>
        isHovered &&
        `
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    `}
`;

function AnalyticComponentItem(props) {
    const { cell, isselected, ishovered, onHover, onUnhover, onClick } = props;

    // Infos basiques
    const cellType = cell.get('type'); // ex: "logic.Resistor"
    const cellId = cell.id;
    const isLink = cell.isLink();

    // Récupération de la valeur si elle existe (ex: un condo ou une résistance).
    // Certains composants, comme un AOP, n’en ont pas.
    const initialValueSi = cell.has('value') ? cell.get('value') : null;

    // État local pour la valeur (en unité SI)
    const [currentValueSi, setCurrentValueSi] = useState(initialValueSi);

    // Déduction de l’unité en se basant sur le cellType ("Ω", "F", "H", etc.)
    const unit = getUnitFromCellType(cellType);

    // Gestion de l'icône
    const iconToDisplay = isLink ? (
        <VscSymbolInterface />
    ) : cellType?.includes('CircuitNode') ? (
        <VscTypeHierarchy />
    ) : (
        <VscCircuitBoard />
    );

    // Nom français du composant
    const frenchName = getFrenchNameForCellType(cellType);

    // Callback de mise à jour
    const handleValueChange = (newValueSi) => {
        setCurrentValueSi(newValueSi);
        // Pour persister dans votre modèle JointJS, vous pouvez faire :
        // cell.set('value', newValueSi)
    };

    return (
        <StyledListItem
            isSelected={isselected}
            isHovered={ishovered}
            onMouseEnter={() => onHover(cellId)}
            onMouseLeave={() => onUnhover(cellId)}
            onClick={() => onClick(cellId)}
        >
            {/* Icône */}
            <div style={{ marginRight: '8px' }}>{iconToDisplay}</div>

            {/* Nom français du composant */}
            <div style={{ marginRight: '16px', fontWeight: 'bold' }}>
                {frenchName}
            </div>

            {/*
                Condition pour afficher le ValueEditor :
                1) Ce n'est pas un lien
                2) Le composant dispose d'une valeur (ex: Résistance, Condensateur, etc.)
            */}
            {!isLink && initialValueSi !== null && (
                <ValueEditor
                    valueSi={currentValueSi}
                    unit={unit}
                    onValueChange={handleValueChange}
                />
            )}
        </StyledListItem>
    );
}

export default AnalyticComponentItem;
