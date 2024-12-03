import { useContext } from 'react';
import { SurveyContext } from '../../utils/context';

import styled from 'styled-components';
import { ThemeContext } from '../../utils/context';

const ResultsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

function Results() {
    const { answers, saveAnswers } = useContext(SurveyContext);

    return (
        <ResultsContainer>
            <h2>
                Les compétences dont vous avez besoin : UX Design, frontend,
                backend
            </h2>
            <ul>
                {Object.entries(answers).map(([key, value]) => (
                    <li key={key}>
                        {key}: {value ? 'Oui' : 'Non'}
                    </li>
                ))}
            </ul>
        </ResultsContainer>
    );
}

export default Results;
