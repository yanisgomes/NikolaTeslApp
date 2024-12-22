import { Loader } from '../../utils/Loader.js';
// import Card from '../../components/Card/index.jsx';
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

// Ajout de Hugo : 
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
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
        return <span>Il y a un problème</span>;
    }

    // Hugo : Modification de la page pour afficher les circuits de la galerie
    return (
        <div>
            <h1 style={{ textAlign: 'center', color: '#34495e' }}>Galerie de Circuits</h1>
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
                Parcourez les circuits disponibles dans la collection.
            </p>

            {isLoading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Loader /> {/* Assurez-vous que Loader est défini */}
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
                                <strong>Description :</strong> {circuit.description}
                            </CircuitDetails>
                            <CircuitDetails>
                                <strong>Auteur :</strong> {circuit.auteur}
                            </CircuitDetails>
                            <CircuitDetails>
                                <strong>Date :</strong> {circuit.date}
                            </CircuitDetails>
                            <CircuitDetails>
                                <strong>Netlist :</strong>
                                <pre style={{ background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                                    {circuit.netlist}
                                </pre>
                            </CircuitDetails>
                        </Card>
                    ))}
                </GridContainer>
            )}
        </div>
    );
}

export default Gallery;
