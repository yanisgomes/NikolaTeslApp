// src/components/ComponentToolbox/index.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import ComponentToolboxCard from '../ComponentToolboxCard';
import { VscBook } from 'react-icons/vsc';

import ToolbarButton from './../ToolbarButton';
import { getIconAsUrl } from '../../utils/utils';

const VscBookUrl = getIconAsUrl(<VscBook />);

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const FilterPanel = styled.div`
    margin-bottom: 8px;
    border: 1px solid ${colors.lightGrey2};
    border-radius: 4px;
    padding: 8px;

    /* On pourra gérer la visibilité via isOpen s'il on veut 
     animer ou conditionnellement rendre visible. */
`;

/**
 * Zone de scroll horizontal
 */
const CardScroller = styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    scroll-behavior: smooth; /* pour un défilement plus doux */

    &::-webkit-scrollbar {
        height: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${colors.darkGrey};
        border-radius: 4px;
    }
`;

const ToolboxHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow-x: hidden;
`;

/**
 * @param {Array} props.items Tableau des composants { id, src, name, tag }
 * @param {function} props.handleDragStartFromToolbox Callback pour le drag
 */
const ComponentToolbox = ({ items, handleDragStartFromToolbox }) => {
    // Gestion du filtre
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState('all');

    // Tableau des tags disponibles
    const availableTags = [
        'all',
        'linear components',
        'transistors',
        'transformers',
        'diodes',
        'semiconductor devices',
        'sources',
        'basic logic blocks',
    ];

    // Ouverture/fermeture du panneau de filtre
    const toggleFilterPanel = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    // Filtrer les items en fonction du tag choisi
    const filteredItems =
        selectedTag === 'all'
            ? items
            : items.filter((item) => item.tag === selectedTag);

    return (
        <Container>
            <ToolboxHeaderContainer>
                <h2>Composants</h2>

                {isFilterOpen && (
                    <FilterPanel>
                        <label htmlFor="tag-filter">Filtre : </label>
                        <select
                            id="tag-filter"
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                        >
                            {availableTags.map((tag) => (
                                <option value={tag} key={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                    </FilterPanel>
                )}

                <ToolbarButton
                    onClick={toggleFilterPanel}
                    logoUrl={VscBookUrl}
                    size="30px"
                />
            </ToolboxHeaderContainer>

            <CardScroller>
                {filteredItems.map((item) => (
                    <ComponentToolboxCard
                        key={item.id}
                        item={item}
                        onDragStart={handleDragStartFromToolbox}
                    />
                ))}
            </CardScroller>
        </Container>
    );
};

export default ComponentToolbox;
