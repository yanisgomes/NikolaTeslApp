import { Loader } from '../../utils/Loader.js';
import Card from '../../components/Card';
import DefaultPicture from '../../assets/profile.jpg';
import styled from 'styled-components';
import colors from '../../utils/style/colors.js';
import { useState, useEffect } from 'react';
import { useFetch } from '../../utils/hooks';
import { Link } from 'react-router-dom';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0px;
    margin-bottom: 50px;
`;

const MainText = styled.h2`
    color: ${colors.text};
    font-size: 24px;
    align-self: center;
`;

const SubText = styled.h3`
    color: ${colors.secondary};
    font-size: 20px;
    align-self: center;
`;

const CardsContainer = styled.div`
    display: grid;

    grid-template-rows: 350px 350px;
    grid-template-columns: repeat(2, 1fr);

    justify-content: center;
    align-items: center;
`;

const StyledImage = styled.img`
    object-fit: cover;
    border-radius: 10%;
`;

function Freelances() {
    const { data, isLoading, error } = useFetch(
        'http://localhost:8000/freelances'
    );
    const freelancesData = data?.freelancersList || [];

    freelancesData.map((freelancer) => {
        console.log(JSON.stringify(freelancer, null, 2)); // Utiliser JSON.stringify pour une sortie lisible
        // Ou accéder directement aux propriétés
        console.log(
            `ID: ${freelancer.id}, Name: ${freelancer.name}, Job: ${freelancer.job}, Picture: ${freelancer.picture}`
        );
    });

    if (error) {
        return <span>Il y a un problème</span>;
    }

    return (
        <MainContainer>
            <MainText>Trouver vos prestataires</MainText>
            <SubText>Nous réunissons les meilleurs profils pour vous.</SubText>

            {isLoading ? (
                <Loader />
            ) : (
                <CardsContainer>
                    {freelancesData.map(({ id, name, job, picture }, index) =>
                        isLoading ? (
                            <Loader />
                        ) : (
                            <Link key={`freelance-${id}`} to={`/profile/${id}`}>
                                <Card
                                    key={`${id}-${index}`}
                                    label={job}
                                    picture={picture}
                                    title={name}
                                />
                            </Link>
                        )
                    )}
                </CardsContainer>
            )}
        </MainContainer>
    );
}

export default Freelances;
