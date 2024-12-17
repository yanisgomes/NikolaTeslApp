import { useState, Component } from 'react';
import PropTypes from 'prop-types';
import DefaultPicture from '../../assets/profile.jpg';
import styled from 'styled-components';
import colors from '../../utils/style/colors.js';

const CardWrapper = styled.div`
    padding: 20px 0;
    margin: 20px;
    gap: 10px;
    display: flex;
    flex-direction: column;

    background-color: ${({ isDarkMode }) =>
        isDarkMode === 'dark' ? colors.darkSecondary : colors.backgroundLight};
    border-radius: 20px;
    width: 350px;

    transition: 300ms;
    justify-content: center;
    align-items: center;

    &:hover {
        cursor: pointer;
        box-shadow: 3px 3px 10px ${colors.primary};
        transform: rotate(-3deg);
        transform: rotate(-3deg) translate(0px, -10px);
    }
`;

const CardImage = styled.img`
    height: 100px;
    width: 100px;
    border-radius: 50%;
    justify-content: center;
`;

const DevJobLabel = styled.h3`
    color: ${colors.primary};
    background-color: ${({ isDarkMode }) =>
        isDarkMode === 'dark' ? colors.darkSecondary : colors.backgroundLight};
    font-size: 24px;
    font-weight: 700;
    align-text: left;
`;

const DevProfileLabel = styled.span`
    color: ${colors.text};
    background-color: ${({ isDarkMode }) =>
        isDarkMode === 'dark' ? colors.darkSecondary : colors.backgroundLight};
    font-size: 20px;
    font-weight: 500;
    align-self: center;
    margin: 20px 0;
`;

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: false,
        };
    }

    render() {
        const { label, title, picture } = this.props;
        const { isFavorite } = this.state;
        const star = isFavorite ? '★' : '';
        return (
            <CardWrapper
                onClick={() => this.setState({ isFavorite: !isFavorite })}
            >
                <DevJobLabel>{label}</DevJobLabel>
                <CardImage src={picture} alt="freelance" />
                <DevProfileLabel>
                    {star} {title} {star}
                </DevProfileLabel>
            </CardWrapper>
        );
    }
}

Card.propTypes = {
    label: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
};

Card.defaultProps = {
    label: 'Job title Yo',
    title: 'Name',
    picture: DefaultPicture,
};

export default Card;
