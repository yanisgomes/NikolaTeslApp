// src/components/AnalyticResolutionPage/index.jsx
import React from 'react';
import AnalyticComponentList from '../AnalyticComponentList';

const AnalyticResolutionPage = ({
    netlist,
    onChangeValue,
    onRequestAI,
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
            <h2>Résolution détaillée</h2>
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
