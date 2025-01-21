import ReactDOMServer from 'react-dom/server'; // Pour convertir React en HTML

export const getIconAsUrl = (iconComponent) => {
    const svgString = ReactDOMServer.renderToStaticMarkup(iconComponent); // Convertit l'icône en chaîne SVG
    const encodedSvg = encodeURIComponent(svgString); // Encode la chaîne pour une URL
    return `data:image/svg+xml,${encodedSvg}`;
};

// Exemple de mapping cellType -> unité
// À adapter selon votre logique de détection
export function getUnitFromCellType(cellType) {
    // Ex. si cellType inclut "Resistor", on renvoie "Ω"
    if (cellType?.toLowerCase().includes('resistor')) {
        return 'Ω';
    }
    // Ex. si cellType inclut "Inductor", on renvoie "H"
    if (cellType?.toLowerCase().includes('inductor')) {
        return 'H';
    }
    // Ex. si cellType inclut "Capacitor", on renvoie "F"
    if (cellType?.toLowerCase().includes('capacitor')) {
        return 'F';
    }
    // Valeur par défaut (ou undefined)
    return '';
}

/**
 * scaleValue(valueSi, unit) renvoie { scaledValue, scaledUnit, factor } pour affichage.
 * - valueSi : la valeur en unité SI (par ex. en Farads si unit === 'F').
 * - unit : 'F' | 'Ω' | 'H' ou autre.
 */
export function scaleValue(valueSi, unit) {
    if (!unit) {
        return {
            scaledValue: valueSi,
            scaledUnit: '',
            factor: 1,
        };
    }

    // On va définir pour chaque unité SI un tableau de préfixes.
    // Chacun associe le nom du préfixe, et le "facteur" en base SI.
    // Pour Farads (F) : pF = 1e-12, nF = 1e-9, µF=1e-6, etc.
    // Pour Résistances (Ω) : MΩ = 1e6, kΩ = 1e3, Ω=1e0, mΩ=1e-3, µΩ=1e-6...
    // Pour Inductances (H) : pH=1e-12, nH=1e-9, µH=1e-6, mH=1e-3, H=1e0...

    const prefixesMap = {
        F: [
            { prefix: 'p', factor: 1e-12 },
            { prefix: 'n', factor: 1e-9 },
            { prefix: 'µ', factor: 1e-6 },
            { prefix: 'm', factor: 1e-3 },
            { prefix: '', factor: 1 },
            { prefix: 'k', factor: 1e3 }, // Rare en pratique, mais on le met en exemple
        ],
        Ω: [
            { prefix: 'p', factor: 1e-12 },
            { prefix: 'n', factor: 1e-9 },
            { prefix: 'µ', factor: 1e-6 },
            { prefix: 'm', factor: 1e-3 },
            { prefix: '', factor: 1 },
            { prefix: 'k', factor: 1e3 },
            { prefix: 'M', factor: 1e6 },
        ],
        H: [
            { prefix: 'p', factor: 1e-12 },
            { prefix: 'n', factor: 1e-9 },
            { prefix: 'µ', factor: 1e-6 },
            { prefix: 'm', factor: 1e-3 },
            { prefix: '', factor: 1 },
            { prefix: 'k', factor: 1e3 },
        ],
    };

    const prefixes = prefixesMap[unit] || [{ prefix: '', factor: 1 }]; // par défaut, pas de préfixe

    // On va chercher le préfixe dont la valeur "scaledValue = valueSi / factor"
    // reste entre ~1 et 999 (ou un autre critère, à votre convenance).
    const absValue = Math.abs(valueSi);
    if (absValue === 0) {
        // 0 reste 0
        return {
            scaledValue: 0,
            scaledUnit: prefixes[prefixes.length - 1].prefix + unit,
            factor: prefixes[prefixes.length - 1].factor,
        };
    }

    // On parcourt le tableau du plus petit facteur au plus grand
    let best = prefixes[0];
    for (let i = 0; i < prefixes.length; i++) {
        const testFactor = prefixes[i].factor;
        const scaled = absValue / testFactor;
        if (scaled >= 1 && scaled < 1000) {
            best = prefixes[i];
        }
    }

    const scaledValue = valueSi / best.factor;
    const scaledUnit = best.prefix + unit;
    return { scaledValue, scaledUnit, factor: best.factor };
}
