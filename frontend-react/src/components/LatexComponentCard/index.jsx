import React from 'react';
import Tex2SVG from 'react-hook-mathjax';

function LatexComponent({ latex }) {
    return (
        <div className="tex-container">
            <Tex2SVG
                className="tex" // Utilisez `className` au lieu de `class`
                tabIndex={-1} // Correction : utilisez `tabIndex` avec une majuscule
                latex={latex} // Affiche l'équation LaTeX passée en prop
            />
        </div>
    );
}

export default LatexComponent;
