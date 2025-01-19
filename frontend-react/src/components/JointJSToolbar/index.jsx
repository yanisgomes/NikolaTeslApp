import { useState, useContext } from 'react';
import GraphContext from '../../utils/context/';
import './index.css';

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
        <div className="toolbar" style={{ position: 'absolute', zIndex: 100 }}>
            <button onClick={zoomOut}>Zoom Out</button>
            <button onClick={zoomIn}>Zoom In</button>
            <button onClick={reset}>Reset</button>
            <button
                onClick={copyJSONToClipboard}
                style={{
                    backgroundColor: copied ? '#019e01' : '#F8F9FB',
                    color: copied ? '#fff' : '#000',
                }}
            >
                {copied ? 'Copied' : 'JSON to clipboard'}
            </button>
        </div>
    );
}

export default Toolbar;
