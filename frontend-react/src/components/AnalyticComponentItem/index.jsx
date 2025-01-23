import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { CircuitGraphContext } from '../../utils/context';
import {
    VscSymbolInterface,
    VscTypeHierarchy,
    VscCircuitBoard,
    VscDebugStepInto,
    VscDebugStepOut,
} from 'react-icons/vsc';
import ValueEditor from '../ComponentValueEditor';
import { getUnitFromCellType } from '../../utils/utils';

import LatexComponent from '../LatexComponent';

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

const StyledItemName = styled.div`
    font-weight: bold;
    margin-right: 16px;
`;

function renderName(cell) {
    const cellType = cell.get('type');
    if (
        cellType !== 'logic.Wire' &&
        cellType !== 'logic.AOP' &&
        cellType !== 'logic.AnalyticalInput' &&
        cellType !== 'logic.AnalyticalOutput' &&
        cellType !== 'logic.Ground'
    ) {
        return (
            <LatexComponent
                latex={`${cell.get('symbol')}_${cell.getNumber()}`}
            />
        );
    }
    if (cell.get('type') === 'logic.Wire') {
        return <p>Branche circuit</p>;
    } else if (cell.get('type') === 'logic.AOP') {
        return <p>Amplificateur Opérationnel {cell.get('number')}</p>;
    } else if (cell.get('type') === 'logic.Ground') {
        return <p>Potentiel nul</p>;
    } else if (cell.get('type') === 'logic.AnalyticalInput') {
        return <p>Entrée analytique</p>;
    } else if (cell.get('type') === 'logic.AnalyticalOutput') {
        return <p>Sortie analytique</p>;
    }
    return null;
}

function AnalyticComponentItem(props) {
    const { cell, isselected, ishovered, onHover, onUnhover, onClick } = props;
    const { circuitGraph, setCircuitGraph } = useContext(CircuitGraphContext);
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

    const iconSize = 24;
    const iconToDisplay = isLink ? (
        <VscSymbolInterface size={iconSize} />
    ) : cellType?.includes('CircuitNode') ? (
        <VscTypeHierarchy size={iconSize} />
    ) : cellType?.includes('Input') ? (
        <VscDebugStepInto size={iconSize} />
    ) : cellType?.includes('Output') ? (
        <VscDebugStepOut size={iconSize} />
    ) : (
        <VscCircuitBoard size={iconSize} />
    );

    // Nom français du composant
    //const frenchName = getFrenchNameForCellType(cellType);

    //nom complet du composant

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
            <StyledItemName style={{ marginRight: '16px', fontWeight: 'bold' }}>
                {renderName(cell)}
            </StyledItemName>

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
