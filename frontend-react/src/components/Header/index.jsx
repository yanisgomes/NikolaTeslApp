import { useContext } from 'react';
import { ThemeContext } from '../../utils/context/';

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import imgTesla from '../../assets/nikola-tesla-cartoon.png';

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
`;

const StyledImage = styled.img`
    object-fit: cover;
    border-radius: 5%;
    width: 10%;
    transition: transform 0.2s ease-in-out;
    &:hover {
        transform: scale(1.15);
    }
`;

const StyledLink = styled(Link)`
    padding: 15px;
    color: #8186a0;
    text-decoration: none;
    font-size: 18px;
    ${(props) =>
        props.$isFullLink &&
        `color: white; border-radius: 30px; background-color: #5843E4;`}
`;

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    height: auto;
`;

function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <StyledHeader>
            <TitleWrapper style={{ marginRigth: 'auto' }}>
                <StyledImage src={imgTesla} alt="nikola-tesla-logo" />
                <h2
                    style={{
                        color:
                            theme === 'light'
                                ? colors.darkBackground
                                : colors.lightBackground,
                    }}
                >
                    NikolaTeslApp
                </h2>
            </TitleWrapper>
            <nav>
                <ButtonWrapper>
                    <StyledLink to="/">Accueil</StyledLink>
                    {/*<StyledLink to="/freelances">Profils</StyledLink>*/}
                    <StyledLink to="/survey/1" $isFullLink>
                        Créer un circuit
                    </StyledLink>
                </ButtonWrapper>
            </nav>
        </StyledHeader>
    );
}

export default Header;
