import { Loader } from '../../utils/Loader.js';
import Card from '../../components/Card/index.jsx';
import DefaultPicture from '../../assets/profile.jpg';
import styled from 'styled-components';
import colors from '../../utils/style/colors.js';
import { useState, useEffect } from 'react';
import { useFetch } from '../../utils/hooks/index.js';
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
    grid-template-columns: repeat(3, 1fr);

    justify-content: center;
    align-items: center;
`;

const BackgroundText = styled.h1`
    font-size: 100px;
    color: ${colors.background};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    opacity: 0.1;
`;

const StyledImage = styled.img`
    object-fit: cover;
    border-radius: 10%;
`;

function Gallery() {
    const { data, isLoading, error } = useFetch(
        // 'http://localhost:8000/freelances'
        // 'http://NikolaTeslApp-backend:3000/galerie'
        // 'http://localhost:9008/galerie' // TODO : Mettre en place un proxy
        '/api/galerie' // <== Utilisation du proxy
    );
    // const freelancesData = data?.freelancersList || [];

    // freelancesData.map((freelancer) => {
    //     console.log(JSON.stringify(freelancer, null, 2)); // Utiliser JSON.stringify pour une sortie lisible
    //     // Ou accéder directement aux propriétés
    //     console.log(
    //         `ID: ${freelancer.id}, Name: ${freelancer.name}, Job: ${freelancer.job}, Picture: ${freelancer.picture}`
    //     );
    // });

    if (error) {
        return <span>Il y a un problème</span>;
    }

    // Hugo : Modification de la page pour afficher les circuits de la galerie
    return (
        <MainContainer>
            <MainText>Voici la galerie de circuits</MainText>
            <SubText>Vous pouvez voir les circuits disponibles</SubText>

            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {data.map((circuit) => (
                            <li
                                key={circuit.id}
                                style={{
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <h3 style={{ margin: '0 0 10px' }}>{circuit.nom}</h3>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Description :</strong> {circuit.description}
                                </p>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Auteur :</strong> {circuit.auteur}
                                </p>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Date :</strong> {circuit.date}
                                </p>
                                {/* <img
                                    src={circuit.image}
                                    alt={circuit.nom}
                                    style={{ width: '100%', maxWidth: '300px', borderRadius: '5px' }}
                                /> */}
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Netlist :</strong> {circuit.netlist}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </MainContainer>
    );


    {/* return (
        <MainContainer>
            <MainText>Trouver vos prestataires</MainText>
            <SubText>Nous réunissons les meilleurs profils pour vous.</SubText>

            <BackgroundText>Gallery</BackgroundText>
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
    ); */}
}

export default Gallery;
