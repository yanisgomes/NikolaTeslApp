// src/components/AnalyticResolutionPage/index.jsx
import React, { useContext } from 'react';
import AnalyticComponentList from '../AnalyticComponentList';
import styled from 'styled-components';

import ACIButton from './../AnalyticComponentItemButton';
import { getIconAsUrl } from '../../utils/utils';
import { VscSymbolOperator } from 'react-icons/vsc';

import { CircuitGraphContext, PaperContext } from '../../utils/context';

const VscSymbolOperatorUrl = getIconAsUrl(<VscSymbolOperator />);

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const AnalyticResolutionContainer = styled.div`
    padding: 0px;
`;

const AnalyticResolutionPage = ({
    netlist,
    onChangeValue,
    onRequestAI,
    onResolutionSubmit,
    onRemoveComponent,
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
        <AnalyticResolutionContainer>
            <TitleContainer>
                <h2>Résolution détaillée</h2>
                <ACIButton
                    onClick={onResolutionSubmit}
                    logoUrl={VscSymbolOperatorUrl}
                    size="40px"
                />
            </TitleContainer>
            <div
                style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '8px',
                    height: '25vh',
                }}
            >
                <p>
                    Voici l’expression de la fonction de transfert du circuit :
                </p>
            </div>

            <AnalyticComponentList
                netlist={netlist}
                onChangeValue={onChangeValue}
                onRequestAI={onRequestAI}
                onDelete={onRemoveComponent}
                // Sélection / Survol
                selectedItemId={selectedItemId}
                hoveredItemId={hoveredItemId}
                onSelect={onSelect}
                onHover={onHover}
                onUnhover={onUnhover}
            />
        </AnalyticResolutionContainer>
    );
};

export default AnalyticResolutionPage;
