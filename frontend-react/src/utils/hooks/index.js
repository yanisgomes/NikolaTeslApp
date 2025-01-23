import { useState, useEffect } from 'react';

export function useFetch(url) {
    const [data, setData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!url) return;

        setLoading(true);

        async function fetchData() {
            try {
                const response = await fetch(url);

                const data = await response.json();

                setData(data);
            } catch (err) {
                console.log(err);

                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [url]);

    return { isLoading, data, error };
}

export function useTheme() {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}

export function getSmallestUnusedNameIndex(graph, symbol) {
    // Retrieve all elements in the graph
    const elements = graph.getElements();

    // Extract the indices from names of elements with the same symbol
    const usedIndices = elements
        .filter((element) => element.getSymbol() === symbol) // Match symbol
        .map((element) => {
            const number = element.getNumber();
            return number;
        })
        .filter((index) => index !== null) // Remove null values
        .sort((a, b) => a - b); // Sort in ascending order

    // Find the smallest missing integer
    let smallestUnused = 0; // Start from 0
    for (const index of usedIndices) {
        if (index === smallestUnused) {
            smallestUnused++;
        } else {
            break; // Exit early when the gap is found
        }
    }
    return smallestUnused;
}
