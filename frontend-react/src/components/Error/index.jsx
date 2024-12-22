import image404 from '../../assets/image404.png';
import colors from '../../utils/style/colors.js';
import styled from 'styled-components';
import Header from '../Header/index.jsx';

const ErrorContainer = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
    display-direction: column;

    background-color: ${colors.backgroundLight};
    margin: 23px 63px;
    padding: 50px;
`;

const StyledSpan = styled.span`
    font-family: 'Comportaa', sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 22.3px;
    color: ${colors.text};
`;

function Error() {
    return (
        <>
            <Header />
            <ErrorContainer>
                <StyledSpan>Oups...</StyledSpan>
                <img src={image404} alt="404" />
                <StyledSpan>Il semblerait qu'il y ait un problème</StyledSpan>
            </ErrorContainer>
        </>
    );
}

export default Error;
