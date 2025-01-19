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

    {
        /* METHODE A UTILISER OU EQUIVALENT : JSON.stringify(circuitGraph.getCells());*/
    }

    const parseCellData = (cell) => {
        return {
            id: cell.id,
            type: cell.type,
            position: cell.position,
            attrs: cell.attrs,
        };
    };

    return (
        <div
            style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '16px' }}
        >
            <ul>
                {circuitGraph.getCells().map((cell) => {
                    const parsedData = parseCellData(cell);
                    return (
                        <li key={parsedData.id}>
                            <div>
                                <strong>ID:</strong> {parsedData.id}
                            </div>
                            <div>
                                <strong>Type:</strong> {parsedData.type}
                            </div>
                            <div>
                                <strong>Position:</strong>{' '}
                                {`x: ${parsedData.position.x}, y: ${parsedData.position.y}`}
                            </div>

                            <div>
                                <strong>Attributes:</strong>{' '}
                                {JSON.stringify(parsedData.attrs)}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AnalyticComponentList;
