import { useState, useContext } from 'react';
import GraphContext from '../../utils/context/';
import ACIButton from '../AnalyticComponentItemButton';

import './index.css';

import { getIconAsUrl } from '../../utils/utils';

import {
    VscZoomOut,
    VscZoomIn,
    VscDebugRestart,
    VscCopy,
    VscCheck,
} from 'react-icons/vsc';

const VscZoomOutUrl = getIconAsUrl(<VscZoomOut />);
const VscZoomInUrl = getIconAsUrl(<VscZoomIn />);
const VscDebugRestartUrl = getIconAsUrl(<VscDebugRestart />);
const VscCopyUrl = getIconAsUrl(<VscCopy />);
const VscCheckUrl = getIconAsUrl(<VscCheck />);

function Toolbar({ zoomOut, zoomIn, reset }) {
    const [copied, setCopied] = useState(false);
    const graph = useContext(GraphContext);

    const copyJSONToClipboard = async () => {
        await navigator.clipboard.writeText(
            JSON.stringify(graph.current.toJSON())
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div
            className="toolbar"
            style={{ position: 'absolute', zIndex: 100, right: 0 }}
        >
            <div style={{ display: 'flex', alignItems: 'right', gap: '10px' }}>
                <ACIButton
                    onClick={zoomIn}
                    logoUrl={VscZoomInUrl}
                    size="30px"
                />
                <ACIButton
                    onClick={zoomOut}
                    logoUrl={VscZoomOutUrl}
                    size="30px"
                />
                <ACIButton
                    onClick={reset}
                    logoUrl={VscDebugRestartUrl}
                    size="30px"
                />
                <ACIButton
                    onClick={copyJSONToClipboard}
                    logoUrl={copied ? VscCheckUrl : VscCopyUrl}
                    size="30px"
                />
            </div>
        </div>
    );
}

export default Toolbar;
