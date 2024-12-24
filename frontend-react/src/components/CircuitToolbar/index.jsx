import React, { useContext } from 'react';
import styled from 'styled-components';
import {
    VscZoomIn,
    VscZoomOut,
    VscHome,
    VscTrash,
    VscDebugRestart,
} from 'react-icons/vsc';

import ToolbarButton from './../ToolbarButton';
import colors from '../../utils/style/colors';
import { ThemeContext } from '../../utils/context';

import { getIconAsUrl } from '../../utils/utils';

const VscZoomInUrl = getIconAsUrl(<VscZoomIn />);
const VscZoomOutUrl = getIconAsUrl(<VscZoomOut />);
const VscHomeUrl = getIconAsUrl(<VscHome />);
const VscRestartUrl = getIconAsUrl(<VscDebugRestart />);
const VscTrashUrl = getIconAsUrl(<VscTrash />);

const Toolbar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 6px 6px;

    background: ${(props) =>
        props.theme === 'dark'
            ? colors.backgroundLight
            : colors.backgroundLight};
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    background: ${(props) =>
        props.theme === 'dark'
            ? colors.backgroundLight
            : colors.backgroundLight};
`;

const CircuitToolbar = ({
    zoom,
    setZoom,
    resetZoomAndPan,
    handleUndo,
    handleDropInTrash,
    handleDragOver,
}) => {
    const { theme } = useContext(ThemeContext);

    return (
        <Toolbar theme={theme}>
            <input
                type="text"
                placeholder="Search..."
                style={{
                    marginRight: '12px',
                    padding: '6px',
                    borderRadius: '4px',
                    border: `1px solid ${
                        theme === 'dark' ? colors.darkGrey : colors.lightGrey2
                    }`,
                    backgroundColor:
                        theme === 'dark'
                            ? colors.backgroundLight
                            : colors.backgroundLight,
                    color: theme === 'dark' ? colors.darkGrey : colors.darkGrey,
                }}
            />
            <ButtonContainer theme={theme}>
                <ToolbarButton
                    onClick={resetZoomAndPan}
                    logoUrl={VscHomeUrl}
                    size="30px"
                />
                <ToolbarButton
                    onClick={() => setZoom((prev) => Math.min(prev + 0.1, 3))}
                    logoUrl={VscZoomInUrl}
                    size="30px"
                />
                <ToolbarButton
                    onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
                    logoUrl={VscZoomOutUrl}
                    size="30px"
                />
                <ToolbarButton
                    onClick={handleUndo}
                    logoUrl={VscRestartUrl}
                    size="30px"
                />
                <ToolbarButton
                    onClick={handleUndo}
                    logoUrl={VscTrashUrl}
                    size="30px"
                />
            </ButtonContainer>
        </Toolbar>
    );
};

export default CircuitToolbar;
