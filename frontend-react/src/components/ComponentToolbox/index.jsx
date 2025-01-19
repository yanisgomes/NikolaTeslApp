import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import ComponentToolboxCard from '../ComponentToolboxCard';

import ToolbarButton from './../ToolbarButton';

import { getIconAsUrl } from '../../utils/utils';

import { VscSparkle } from 'react-icons/vsc';

const VscSparkleUrl = getIconAsUrl(<VscSparkle />);

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const ToolboxHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

/** Conteneur du select, si besoin de marger ou styliser autour. */
const FilterContainer = styled.div``;

/**
 * On stylise le <select> pour être plus grand et avoir un style "hover" cohérent.
 */
const FilterSelect = styled.select`
    font-size: 16px;
    padding: 8px 12px;
    border: 1px solid ${colors.lightGrey2};
    border-radius: 6px;
    background-color: ${colors.backgroundLight};
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 1px ${colors.primary};
    }
`;

/**
 * Conteneur global qui gère le scroll horizontal.
 * On conserve le style de scrollbar que vous aviez.
 */
const ScrollWrapper = styled.div`
    width: 96vh;
    overflow-x: auto;
    padding-bottom: 24px; /* Espace sous les éléments pour laisser de la place en bas */
    &::-webkit-scrollbar {
        display: none;
    }
`;

/**
 * Conteneur horizontal (flex) pour les cartes.
 * - flex-wrap: nowrap => pour scroller en horizontal quand ça déborde
 * - gap => espace entre les cartes
 */
const HorizontalCardsRow = styled.div`
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    padding: 8px;
    align-items: flex-start;
`;

const ComponentToolbox = ({ items, handleDragStartFromToolbox }) => {
    const [filter, setFilter] = useState('all');

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Filtrage (optionnel)
    const filteredItems = items.filter((item) => {
        if (filter === 'all') return true;
        return item.tag === filter;
    });

    return (
        <Container>
            <ToolboxHeaderContainer>
                <h2>Composants</h2>
                <FilterContainer>
                    <FilterSelect value={filter} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="linear">Linear</option>
                        <option value="transistors">Transistors</option>
                        <option value="sources">Sources</option>
                        <option value="others">Others</option>
                    </FilterSelect>
                </FilterContainer>
            </ToolboxHeaderContainer>

            {/* Zone d’affichage des cartes (défilement horizontal) */}
            <ScrollWrapper>
                <HorizontalCardsRow>
                    {filteredItems.map((item) => (
                        <ComponentToolboxCard
                            key={item.id}
                            item={item}
                            onDragStart={handleDragStartFromToolbox}
                        />
                    ))}
                </HorizontalCardsRow>
            </ScrollWrapper>
        </Container>
    );
};

export default ComponentToolbox;
