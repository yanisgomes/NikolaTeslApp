import React, { useState } from 'react';
import { scaleValue } from '../../utils/utils';

// On réutilise ici les fonctions scaleValue(...) définies ci-dessus
// => Vous pouvez les mettre dans un fichier utils par exemple
function ValueEditor({ valueSi, unit, onValueChange }) {
    // On effectue l'auto-scaling à l'affichage
    const { scaledValue, scaledUnit, factor } = scaleValue(valueSi, unit);

    // Gérer la saisie
    const handleChange = (e) => {
        const newStr = e.target.value.trim().replace(',', '.');
        // Tenter de le parser en float
        const parsed = parseFloat(newStr);
        if (!isNaN(parsed)) {
            // On reconvertit en valeur SI
            const newValueSi = parsed * factor;
            onValueChange(newValueSi);
        } else {
            // Si c'est invalide, on peut choisir de ne rien faire
            // ou reset, etc. Ici on ne fait rien.
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
                type="text"
                value={scaledValue.toFixed(3)}
                onChange={handleChange}
                style={{ width: '40px', textAlign: 'right' }}
            />
            <span>{scaledUnit}</span>
        </div>
    );
}

export default ValueEditor;
