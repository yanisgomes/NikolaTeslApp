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
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
    &:hover {
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
        transform: scale(1.01);
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

const StyledList = styled.ul`
    li {
        color: ${colors.text};
        background-color: ${colors.backgroundLight};
        margin-bottom: 10px;
        font-size: 1.2em;
        &:hover {
            color: ${colors.primary};
        }
    }
`;

const StyledButton = styled.button`
    width: 50%;
`;

const StyledImageMain = styled.img`
    width: 60vh;
`;

const StyledImageTesla = styled.img`
    height: 30vh;
    margin-bottom: 2vh;
`;

function App() {
    return (
        <HorizontalContainer>
            <VerticalContainer>
                <StyledTitle>Déclenchez l'éclair de génie !</StyledTitle>
                <StyledList>
                    <li>
                        Explorez les phénomènes électriques grâce à une
                        interface interactive et intuitive qui donne vie aux
                        concepts.
                    </li>
                    <li>
                        Plongez au cœur des circuits électroniques pour en
                        comprendre la phyique
                    </li>
                    <li>
                        Concevez vos propres circuits et obtenez leur
                        formalisation mathématique détaillées
                    </li>
                </StyledList>
                <StyledImageTesla src={imgTesla} alt="404" />
                <StyledButton>Créer un nouveau circuit</StyledButton>
            </VerticalContainer>
            <StyledImageMain src={imgHome} alt="404" />
        </HorizontalContainer>
    );
}

export default App;
