// src/components/AnalyticResolutionPage/index.jsx
import React from 'react';
import AnalyticComponentList from '../AnalyticComponentList';
import styled from 'styled-components';

import ACIButton from './../AnalyticComponentItemButton';
import { getIconAsUrl } from '../../utils/utils';
import { VscSymbolOperator } from 'react-icons/vsc';

const VscSymbolOperatorUrl = getIconAsUrl(<VscSymbolOperator />);

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    return (
        <div style={{ padding: '16px' }}>
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
                    borderRadius: '4px',
                    padding: '16px',
                    marginBottom: '16px',
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
        </div>
    );
};

export default AnalyticResolutionPage;
