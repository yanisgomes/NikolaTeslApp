import styled from 'styled-components';
import colors from '../../utils/style/colors';
import imgTesla from '../../assets/logo_lissajous.png';

const FooterContainer = styled.footer`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex: 0 0 auto;
    padding: 16px 0;
    width: 100%;
`;

const CompanyInfo = styled.div`
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: ${colors.secondary};
`;

const StyledImage = styled.img`
    border-radius: 5%;
    width: 5%;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    &:hover {
        transform: scale(1.15);
    }
    margin-right: 16px;
`;

const GitHubLink = styled.a`
    color: ${colors.primary};
    text-decoration: none;
    font-size: 1.5rem;
    transition: color 200ms;

    &:hover {
        color: ${colors.secondary};
    }

    & > svg {
        width: 32px;
        height: 32px;
    }
`;

function Footer() {
    return (
        <FooterContainer>
            <CompanyInfo>
                <StyledImage src={imgTesla} alt="nikola-tesla-logo" />
                <span>&copy; 2024 Nikola Tesla Company, Inc.</span>
            </CompanyInfo>
            <GitHubLink
                href="https://github.com/yanisgomes/NikolaTeslApp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.15 6.84 9.49.5.09.66-.22.66-.49 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.14-1.1-1.44-1.1-1.44-.9-.61.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.29.1-2.7 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.41.2 2.44.1 2.7.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.91.68 1.84 0 1.33-.01 2.4-.01 2.73 0 .27.16.59.67.49A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
                </svg>
            </GitHubLink>
        </FooterContainer>
    );
}

export default Footer;
