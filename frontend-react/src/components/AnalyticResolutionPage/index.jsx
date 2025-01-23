// src/components/AnalyticResolutionPage/index.jsx
import React, { useContext } from 'react';
import AnalyticComponentList from '../AnalyticComponentList';
import styled from 'styled-components';

import ACIButton from './../AnalyticComponentItemButton';
import { getIconAsUrl } from '../../utils/utils';
import { VscSymbolOperator } from 'react-icons/vsc';

import { CircuitGraphContext, PaperContext } from '../../utils/context';

import LatexComponent from '../LatexComponent';

import colors from '../../utils/style/colors';

const VscSymbolOperatorUrl = getIconAsUrl(<VscSymbolOperator />);

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const AnalyticResolutionContainer = styled.div`
    padding: 0px;
`;

const AnalyticContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    border: '1px solid #ddd',
    border-radius: 8px,
    padding: 16px,
    margin-top: 16px,

    min-height: 20vh;
    max-height: 35vh;

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

            <AnalyticContainer>
                {/* Fonction de transfert */}
                <h5>Fonction de Transfert</h5>
                <div className="transfer-function">
                    <LatexComponent
                        latex={`\\text{H(s)} = ${ResolutionResponse.transfer_function}`}
                    />
                </div>

                {/* Liste des explications et des équations */}
                <h5>Explications et Équations</h5>
                <ul className="explanations-list">
                    {ResolutionResponse.explanations.map(
                        (explanation, index) => (
                            <li key={index} className="explanation-item">
                                <p>{explanation}</p>
                                <LatexComponent
                                    latex={ResolutionResponse.equations[index]}
                                />
                            </li>
                        )
                    )}
                </ul>
            </AnalyticContainer>
            <hr
                style={{
                    margin: '20px 0',
                    border: `1px solid ${colors.darkGrey}`,
                    borderRadius: '3px',
                }}
            />
            <AnalyticComponentList />
        </AnalyticResolutionContainer>
    );
};

export default AnalyticResolutionPage;
