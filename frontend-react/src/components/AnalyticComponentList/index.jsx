// src/components/AnalyticComponentList/index.jsx
import React, { useContext } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';

import AnalyticComponentItem from '../AnalyticComponentItem';

import {
    CircuitGraphContext,
    PaperContext,
    CircuitInteractionContext,
} from '../../utils/context';

function AnalyticComponentList() {
    const { circuitGraph, setCircuitGraph } = useContext(CircuitGraphContext);
    const { paper, setCircuitPaper } = useContext(PaperContext);

    const {
        hoveredElementId,
        setHoveredElementId,
        selectedElementId,
        setSelectedElementId,
    } = useContext(CircuitInteractionContext);

    // On récupère toutes les cellules du graphe
    const cells = circuitGraph.getCells(); // Array of joint.dia.Cell

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding-top: 16px;
        margin-top: 16px;
        max-height: 45vh;
        overflow-y: auto;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 4px; /* Adjust the width to make it extra thin */
        }

        &::-webkit-scrollbar-thumb {
            background-color: ${colors.lightGrey2}; /* Customize the thumb color */
            border-radius: 2px; /* Optional: round the corners */
        }
    `;

    const List = styled.ul`
        list-style-type: none;
        padding: 0;

        &::-webkit-scrollbar {
            width: 4px; /* Adjust the width to make it extra thin */
        }

        &::-webkit-scrollbar-thumb {
            background-color: ${colors.primary}; /* Customize the thumb color */
            border-radius: 2px; /* Optional: round the corners */
        }
    `;

    return (
        <Container>
            <List>
                {cells.map((cell) => (
                    <AnalyticComponentItem
                        key={cell.id}
                        cell={cell}
                        isSelected={cell.id === selectedElementId}
                        isHovered={cell.id === hoveredElementId}
                        onHover={() => setHoveredElementId(cell.id)}
                        onUnhover={() => setHoveredElementId(null)}
                        onClick={() => setSelectedElementId(cell.id)}
                    />
                ))}
            </List>
        </Container>
    );
}

export default AnalyticComponentList;
