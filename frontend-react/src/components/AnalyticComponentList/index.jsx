// src/components/AnalyticComponentList/index.jsx
import React, { useContext } from 'react';
import AnalyticComponentItem from '../AnalyticComponentItem';

import { CircuitGraphContext, PaperContext } from '../../utils/context';

const AnalyticComponentList = ({
    netlist,
    onChangeValue,
    onRequestAI,
    onDelete,
    // Sélection / survol
    selectedItemId,
    hoveredItemId,
    onSelect,
    onHover,
    onUnhover,
}) => {
    const { circuitGraph, setCircuitGraph } = useContext(CircuitGraphContext);
    const { paper, setPaper } = useContext(PaperContext);
    return (
        <div
            style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '16px' }}
        >
            {netlist.map((comp) => (
                <AnalyticComponentItem
                    key={comp.id}
                    name={comp.name}
                    value={comp.value}
                    symbol={comp.symbole}
                    onChangeValue={(newVal) => onChangeValue(comp.id, newVal)}
                    onRequestAI={() => onRequestAI(comp.id)}
                    onDelete={() => onDelete(comp.id)}
                    // Indication si sélectionné / survolé
                    isSelected={selectedItemId === comp.id}
                    isHovered={hoveredItemId === comp.id}
                    // Callbacks
                    onSelect={() => onSelect(comp.id)}
                    onHover={() => onHover(comp.id)}
                    onUnhover={() => onUnhover(comp.id)}
                />
            ))}
        </div>
    );
};

export default AnalyticComponentList;
