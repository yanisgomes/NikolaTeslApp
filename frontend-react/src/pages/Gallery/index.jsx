import { Loader } from '../../utils/Loader.js';
// import Card from '../../components/Card/index.jsx';
import DefaultPicture from '../../assets/profile.jpg';
import styled from 'styled-components';
import colors from '../../utils/style/colors.js';

import { useState, useEffect } from 'react';
import { useFetch } from '../../utils/hooks/index.js';

import { Link } from 'react-router-dom';

import Header from '../../components/Header/index.jsx';
import Footer from '../../components/Footer/index.jsx';

const MainContainer = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0px 24px;
    justify-content: space-between;
`;

// Style du titre principal
const StyledTitle = styled.h1`
    text-align: left;
    color: ${colors.text};
    font-size: 3.5rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    transition: all 0.4s ease-in-out;

    /* Au survol, on applique un effet de texte en dégradé */
    &:hover {
        background: linear-gradient(
            90deg,
            ${colors.primary},
            ${colors.secondary}
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
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

// Ajout de Hugo :
const GridContainer = styled.div`
    display: flex; /* Utilisation de Flexbox */
    flex-wrap: wrap; /* Autorise le retour à la ligne */
    gap: 20px; /* Espace entre les éléments */
    padding: 20px;
    justify-content: center; /* Centre les éléments sur la ligne */
    background-color: #f5f5f5;
`;

const Card = styled.div`
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    background: #fff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
    }
`;

const Image = styled.img`
    display: block;
    max-width: 100%;
    height: auto;
    max-height: 300px;
    border-radius: 10px;
    margin: 0 auto;
    margin-bottom: 15px;
`;

const CircuitName = styled.h3`
    margin: 10px 0;
    color: #2c3e50;
`;

const CircuitDetails = styled.p`
    margin: 5px 0;
    font-size: 14px;
    color: #555;
`;

function Gallery() {
    const { data, isLoading, error } = useFetch(
        // 'http://localhost:8000/freelances'
        '/api/galerie/' // <== Utilisation du proxy
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
        return (
            <MainContainer>
                <Header />
                {/* Nouveau titre moderne */}
                <div style={{ alignItems: 'left' }}>
                    <StyledTitle>
                        Galerie des circuits
                    </StyledTitle>
                </div>
                <span>Il y a un problème</span>
                <Footer />
            </MainContainer>
        );
    }

    // Hugo : Modification de la page pour afficher les circuits de la galerie
    return (
        <MainContainer>
            <Header />
            {/* Nouveau titre moderne */}
            <div style={{ alignItems: 'left' }}>
                <StyledTitle>
                    Galerie des circuits
                </StyledTitle>
            </div>
            <div>
                {isLoading ? (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Loader />
                    </div>
                ) : (
                    <GridContainer>
                        {data.map((circuit) => (
                            <Card key={circuit.id}>
                                <CircuitName>{circuit.nom}</CircuitName>
                                <Image
                                    src={`/api/uploads/${circuit.image}`} // Chemin dynamique pour l'image
                                    alt={circuit.nom}
                                />
                                <CircuitDetails>
                                    <strong>Description :</strong>{' '}
                                    {circuit.description}
                                </CircuitDetails>
                                <CircuitDetails>
                                    <strong>Auteur :</strong> {circuit.auteur}
                                </CircuitDetails>
                                <CircuitDetails>
                                    <strong>Date :</strong> {circuit.date}
                                </CircuitDetails>
                                <CircuitDetails>
                                    <strong>Netlist :</strong>
                                    <pre
                                        style={{
                                            padding: '10px',
                                            borderRadius: '16px',
                                        }}
                                    >
                                        {circuit.netlist}
                                    </pre>
                                </CircuitDetails>
                            </Card>
                        ))}
                    </GridContainer>
                )}
            </div>
            <Footer />
        </MainContainer>
    );
}

export default Gallery;
