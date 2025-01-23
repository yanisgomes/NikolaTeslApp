import React from 'react';
import Tex2SVG, { MathJaxProvider } from 'react-hook-mathjax';

// Change size : \tiny{ }, \scriptsize{ }, \small{ }, \normal{ }, \large{ }, \Large{ }, \LARGE{ }, \huge{ }, \Huge{ }.

export const mathJaxOptionsDefault = {
    svg: {
        scale: 1, // global scaling factor for all expressions
        minScale: 0.5, // smallest scaling factor to use
        mtextInheritFont: false, // true to make mtext elements use surrounding font
        merrorInheritFont: true, // true to make merror text use surrounding font
        mathmlSpacing: false, // true for MathML spacing rules, false for TeX rules
        skipAttributes: {}, // RFDa and other attributes NOT to copy to the output
        exFactor: 0.5, // default size of ex in em units
        displayAlign: 'center', // default for indentalign when set to 'auto'
        displayIndent: '0', // default for indentshift when set to 'auto'
        fontCache: 'local', // or 'global' or 'none'
        localID: null, // ID to use for local font cache (for single equation processing)
        internalSpeechTitles: true, // insert <title> tags with speech content
        titleID: 0, // initial id number to use for aria-labeledby titles
    },
};

function LatexComponent({ latex, mathJaxOptions = mathJaxOptionsDefault }) {
    return (
        <div className="tex-container">
            <MathJaxProvider options={mathJaxOptions}>
                <Tex2SVG
                    className="tex" // Utilisez `className` au lieu de `class`
                    tabIndex={-1} // Correction : utilisez `tabIndex` avec une majuscule
                    latex={latex} // Affiche l'équation LaTeX passée en prop
                />
            </MathJaxProvider>
        </div>
    );
}

export default LatexComponent;
