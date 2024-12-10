import imgHome from '../../assets/fonction-transfert-home.png';
import imgTesla from '../../assets/nikola-tesla-cartoon.png';
import colors from '../../utils/style/colors.js';
import styled from 'styled-components';

const HorizontalContainer = styled.div`
    display: flex;
    flex: 1 0 auto;
    flex-direction: row;

    justify-content: center;
    align-items: center;
    gap: 50px;
    border-radius: 30px;

    background-color: ${colors.backgroundLight};
    transition: box-shadow 0.3s ease-in-out;
    &:hover {
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    }
`;

const VerticalContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 40%;
    background-color: ${colors.backgroundLight};
    padding: 20px;
    height: 80%;
`;

const StyledTitle = styled.h2`
    color: ${colors.text};
    background-color: ${colors.backgroundLight};
`;

const StyledButton = styled.button`
    width: 50%;
`;

const StyledImageMain = styled.img`
    width: 60vh;
`;

const StyledImageTesla = styled.img`
    height: 50vh;
`;

function App() {
    return (
        <HorizontalContainer>
            <VerticalContainer>
                <StyledTitle>Déclenchez l'éclair de génie !</StyledTitle>
                <StyledImageTesla src={imgTesla} alt="404" />
                <StyledButton>Créer un nouveau circuit</StyledButton>
            </VerticalContainer>
            <StyledImageMain src={imgHome} alt="404" />
        </HorizontalContainer>
    );
}

export default App;
