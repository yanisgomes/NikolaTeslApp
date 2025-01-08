import ReactDOMServer from 'react-dom/server'; // Pour convertir React en HTML

export const getIconAsUrl = (iconComponent) => {
    const svgString = ReactDOMServer.renderToStaticMarkup(iconComponent); // Convertit l'icône en chaîne SVG
    const encodedSvg = encodeURIComponent(svgString); // Encode la chaîne pour une URL
    return `data:image/svg+xml,${encodedSvg}`;
};
