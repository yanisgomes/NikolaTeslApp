import { useContext } from 'react';
import { ThemeContext } from '../../utils/context/';

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import lightLogo from '../../assets/logo_ENS1.png';
import darkLogo from '../../assets/logo_ENS1.png';
import colors from '../../utils/style/colors';

const StyledImage = styled.img`
    object-fit: cover;
    border-radius: 5%;
    height: 180px;
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

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    display-direction: row;
    padding: 50px;
    gap: 50px;
    transition: 300ms;
    & img:hover {
        cursor: pointer;
        box-shadow: 3px 3px 10px ${colors.secondary};
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
`;

function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <StyledHeader>
            <StyledImage
                src={theme === 'dark' ? darkLogo : lightLogo}
                alt="doleances-logo"
            />

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
