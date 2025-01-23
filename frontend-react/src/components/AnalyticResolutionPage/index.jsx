// src/components/AnalyticResolutionPage/index.jsx
import React, { useContext } from 'react';
import AnalyticComponentList from '../AnalyticComponentList';
import styled from 'styled-components';

import ACIButton from './../AnalyticComponentItemButton';
import { getIconAsUrl } from '../../utils/utils';
import { VscSymbolOperator } from 'react-icons/vsc';

import { CircuitGraphContext, PaperContext } from '../../utils/context';

import LatexComponent from '../LatexComponentCard';

const VscSymbolOperatorUrl = getIconAsUrl(<VscSymbolOperator />);

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const AnalyticResolutionContainer = styled.div`
    padding: 0px;
`;

function CircuitDetails({ data }) {
    return (
        <div className="circuit-details">
            {/* Fonction de transfert */}
            <h2>Fonction de Transfert</h2>
            <div className="transfer-function">
                <LatexComponent
                    latex={`\\text{H(s)} = ${data.transfer_function}`}
                />
            </div>

            {/* Liste des explications et des équations */}
            <h3>Explications et Équations</h3>
            <ul className="explanations-list">
                {data.explanations.map((explanation, index) => (
                    <li key={index} className="explanation-item">
                        <p>{explanation}</p>
                        <LatexComponent latex={data.equations[index]} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

const AnalyticResolutionPage = ({ onResolutionSubmit, ResolutionResponse }) => {
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
                <CircuitDetails data={ResolutionResponse} />
            </div>

            <AnalyticComponentList />
        </AnalyticResolutionContainer>
    );
};

export default AnalyticResolutionPage;
