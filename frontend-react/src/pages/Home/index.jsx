import imageNikola from '../../assets/NikolaTesla.png';
import colors from '../../utils/style/colors.js';
import styled from 'styled-components';

const HorizontalContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 50px;
    margin-top: 10px;
    margin-bottom: 20px;
    margin-left: 30px;
    margin-right: 30px;
    padding: 50px 50px;
    border-radius: 30px;
    background-color: ${colors.backgroundLight};
    transition: box-shadow 0.3s ease-in-out;
    &:hover {
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    }
`;

const VerticalContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 40%;
    background-color: ${colors.backgroundLight};
`;

const StyledTitle = styled.h1`
    background-color: ${colors.backgroundLight};
`;

const StyledButton = styled.button`
    width: 50%;
`;

const StyledImage = styled.img`
    height: 10%;
`;

function App() {
    return (
        <HorizontalContainer>
            <VerticalContainer>
                <StyledTitle>
                    Projet Nikola
                </StyledTitle>
                <StyledButton>Créer un nouveau circuit</StyledButton>
            </VerticalContainer>
            <StyledImage src={imageNikola} alt="404" />
        </HorizontalContainer>
    );
}

export default App;
