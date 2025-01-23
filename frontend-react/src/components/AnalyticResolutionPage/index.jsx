// src/components/AnalyticResolutionPage/index.jsx
import React, { useContext } from 'react';
import styled from 'styled-components';

import ACIButton from './../AnalyticComponentItemButton';
import { getIconAsUrl } from '../../utils/utils';
import { VscSymbolOperator } from 'react-icons/vsc';

import {
    CircuitGraphContext,
    PaperContext,
    CircuitInteractionContext,
} from '../../utils/context';

import LatexComponent from '../LatexComponent';
import { mathJaxOptionsDefault } from '../LatexComponent';

import colors from '../../utils/style/colors';

import AnalyticComponentItem from '../AnalyticComponentItem';

const VscSymbolOperatorUrl = getIconAsUrl(<VscSymbolOperator />);

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 8px;
`;

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    border: 1px solid ${colors.lightGrey2};
    border-radius: 8px;
    padding: 8px;
`;

const ScrollContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    min-height: 20vh;
    max-height: 25vh;

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

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const TransferFunctionContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;

    margin-bottom: 16px;

    overflow-x: hidden;
    overflow-y: hidden;

    &::-webkit-scrollbar {
        height: 4px; /* Adjust the width to make it extra thin */
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${colors.lightGrey2}; /* Customize the thumb color */
        border-radius: 2px; /* Optional: round the corners */
    }
`;

const StyledTitle = styled.h5`
    margin-bottom: 8px;
    font-weight: bold;
`;

const AnalyticResolutionPage = ({ onResolutionSubmit, ResolutionResponse }) => {
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

    return (
        <PageContainer>
            <TitleContainer>
                <h2>Fonction de transfert</h2>
                <ACIButton
                    onClick={onResolutionSubmit}
                    logoUrl={VscSymbolOperatorUrl}
                    size="40px"
                />
            </TitleContainer>

            <TransferFunctionContainer>
                <LatexComponent
                    latex={`\\Large{H(s) = ${ResolutionResponse.transfer_function}}`}
                />
            </TransferFunctionContainer>

            <StyledContainer>
                <StyledTitle>Équations</StyledTitle>
                <ScrollContainer>
                    {/* Liste des explications et des équations */}

                    <ul>
                        {ResolutionResponse.explanations.map(
                            (explanation, index) => (
                                <li key={index}>
                                    <p>{explanation}</p>
                                    <LatexComponent
                                        latex={
                                            ResolutionResponse.equations[index]
                                        }
                                    />
                                </li>
                            )
                        )}
                    </ul>
                </ScrollContainer>
            </StyledContainer>

            <StyledContainer>
                <StyledTitle>Circuit</StyledTitle>
                <ScrollContainer>
                    <List>
                        {cells.map((cell) => (
                            <AnalyticComponentItem
                                key={cell.id}
                                cell={cell}
                                isselected={cell.id === selectedElementId}
                                ishovered={cell.id === hoveredElementId}
                                onHover={() => setHoveredElementId(cell.id)}
                                onUnhover={() => setHoveredElementId(null)}
                                onClick={() => setSelectedElementId(cell.id)}
                            />
                        ))}
                    </List>
                </ScrollContainer>
            </StyledContainer>
        </PageContainer>
    );
};

export default AnalyticResolutionPage;
