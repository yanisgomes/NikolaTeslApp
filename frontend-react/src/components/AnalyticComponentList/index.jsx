// src/components/AnalyticComponentList/index.jsx
import React, { useContext } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';

import AnalyticComponentItem from '../AnalyticComponentItem';

import { CircuitGraphContext, PaperContext } from '../../utils/context';

const AnalyticComponentList = ({
    // exemple:
    // "netlist", "onChangeValue", "onRequestAI", "onDelete", etc.
    // Sélection / survol
    selectedItemId,
    hoveredItemId,
    onSelect,
    onHover,
    onUnhover,
}) => {
    const { circuitGraph, setCircuitGraph } = useContext(CircuitGraphContext);
    const { paper, setCircuitPaper } = useContext(PaperContext);

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
                {cells.map((cell) => {
                    return (
                        <AnalyticComponentItem
                            key={cell.id}
                            cell={cell}
                            isSelected={cell.id === selectedItemId}
                            isHovered={cell.id === hoveredItemId}
                            onHover={(id) => {
                                onHover?.(id);
                                if (paper) {
                                    const cellView =
                                        paper.findViewByModel(cell);
                                    if (cellView) {
                                        cellView.highlight();
                                    }
                                }
                            }}
                            onUnhover={(id) => {
                                onUnhover?.(id);
                                if (paper) {
                                    const cellView =
                                        paper.findViewByModel(cell);
                                    if (cellView) {
                                        cellView.unhighlight();
                                    }
                                }
                            }}
                            onClick={(id) => {
                                onSelect?.(id);
                            }}
                        />
                    );
                })}
            </List>
        </Container>
    );
};

export default AnalyticComponentList;
