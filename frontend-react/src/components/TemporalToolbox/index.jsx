import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import Plot from 'react-plotly.js';

import ACIButton from './../AnalyticComponentItemButton';
import { getIconAsUrl } from '../../utils/utils';

// -- Icons éventuelles si besoin (exemple) --
import { VscPlay } from 'react-icons/vsc';
import { VscSparkle } from 'react-icons/vsc';

const PlayIconUrl = getIconAsUrl(<VscPlay />);
const SparkIconUrl = getIconAsUrl(<VscSparkle />);

// -- Container principal --
const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

// -- Partie haute : row avec titre + boutons --
const HeaderRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

// -- Petite zone conteneur pour les boutons (alignement à droite) --
const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`;

/**
 * IMPORTANT : ici on définit une hauteur maxi (ou fixe) pour
 * que le graphique ne déborde pas si le parent n’a pas de scroll vertical.
 */
const ChartContainer = styled.div`
    /* Tu peux adapter la hauteur max selon tes préférences.
       Par ex. max-height: 400px; ou un height fixe. */
    max-height: 400px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* Évite le scroll interne si on ne veut pas scroller */
`;

/**
 * Composant TemporalToolbox
 * @param {Object} props
 * @param {Object} props.timeData - Objet contenant par ex. { x: [array temps], y: [array amplitude], ... }
 * @param {Function} props.onPlay - Callback au clic sur Play
 * @param {Function} props.onSpark - Callback au clic sur Spark (requête IA)
 */
const TemporalToolbox = ({ timeData, onPlay, onSpark }) => {
    // Ex: timeData = { x: [0, 0.1, 0.2, ...], y: [0, 1, 0.7, ...], ... }

    // Prépare les “traces” Plotly.
    const plotData = [
        {
            x: timeData?.x || [],
            y: timeData?.y || [],
            type: 'scatter',
            mode: 'lines',
            line: { color: colors.primary },
            name: 'Réponse temporelle',
        },
    ];

    // On retire le titre Plotly (title) puisque tu préfères seulement le h2 externe.
    const layout = {
        xaxis: { title: 'Temps (s)' },
        yaxis: { title: 'Amplitude' },
        margin: { t: 0, r: 0, l: 0, b: 0 }, // Marges réduites
        paper_bgcolor: colors.backgroundLight,
        plot_bgcolor: colors.backgroundLight,
    };

    return (
        <Container>
            {/* Partie haute : Titre + Boutons */}
            <HeaderRow>
                <h2>Réponse temporelle</h2>
                <ButtonGroup>
                    <ACIButton
                        onClick={onPlay}
                        logoUrl={PlayIconUrl}
                        size="40px"
                    />
                    <ACIButton
                        onClick={onSpark}
                        logoUrl={SparkIconUrl}
                        size="40px"
                    />
                </ButtonGroup>
            </HeaderRow>

            {/* Partie basse : Graphique */}
            <ChartContainer>
                <Plot
                    data={plotData}
                    layout={layout}
                    /*
                     * Indique à react-plotly.js qu’on veut qu’il
                     * s’adapte automatiquement au resize du parent.
                     */
                    useResizeHandler
                    style={{ width: '100%', height: '180px' }}
                    config={{
                        responsive: true,
                        displaylogo: false,
                        modeBarButtonsToRemove: [
                            'toImage',
                            'lasso2d',
                            'select2d',
                        ],
                    }}
                />
            </ChartContainer>
        </Container>
    );
};

export default TemporalToolbox;
