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

const FilterHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    button {
        background: ${colors.primary};
        color: white;
        border: none;
        padding: 8px;
        cursor: pointer;
        border-radius: 4px;

        &:hover {
            opacity: 0.9;
        }
    }
`;

const FilterPanel = styled.div`
    margin-bottom: 8px;
    border: 1px solid ${colors.lightGrey2};
    border-radius: 4px;
    padding: 8px;
`;

const ScrollWrapper = styled.div`
    width: 94vh;
    max-width: 94vh;
    overflow-x: auto; /* Active un défilement horizontal localisé */
    padding-bottom: 8px; /* Espace sous les éléments pour le scroll */
    display: grid;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
        height: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${colors.lightGrey2};
        border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: ${colors.grey};
    }
`;

const GridContainer = styled.div`
    display: grid;
    grid-auto-flow: column; /* Organise les éléments en ligne (défilement horizontal) */
    grid-auto-columns: minmax(
        200px,
        1fr
    ); /* Taille minimale et flexible des colonnes */
    gap: 4px; /* Espace entre les cartes */
    align-items: center;
    padding: 8px;
`;

const ToolboxHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const ComponentToolbox = ({ items, handleDragStartFromToolbox }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState('all');

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

    const toggleFilterPanel = () => {
        setIsFilterOpen(!isFilterOpen);
    };

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

            <ScrollWrapper>
                <GridContainer>
                    {filteredItems.map((item) => (
                        <ComponentToolboxCard
                            key={item.id}
                            item={item}
                            onDragStart={handleDragStartFromToolbox}
                        />
                    ))}
                </GridContainer>
            </ScrollWrapper>
        </Container>
    );
};

export default ComponentToolbox;
