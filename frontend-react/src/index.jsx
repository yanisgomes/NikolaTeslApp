import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Circuit from './pages/Circuit';
import Header from './components/Header/';
import Footer from './components/Footer/';
import Error from './components/Error/';
import Gallery from './pages/Gallery';
import GlobalStyle from './utils/style/GlobalStyle';
import ProfileContainer from './components/ProfileContainer/';

import { ThemeProvider, CircuitProvider } from './utils/context/';

import styled from 'styled-components';

import 'bootstrap/dist/css/bootstrap.min.css';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh; // 100% de la hauteur de la fenêtre
    padding-left: 30px;
    padding-right: 30px;
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the React application
root.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider>
                <CircuitProvider>
                    <MainContainer>
                        <GlobalStyle />

                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="*" element={<Error />} />
                            <Route path="/galerie/" element={<Gallery />} />
                            <Route
                                path="/circuit/" //path="/circuit/"
                                element={<Circuit />}
                            />
                            <Route
                                path="/profile/:id"
                                element={<ProfileContainer />}
                            />
                        </Routes>
                    </MainContainer>
                </CircuitProvider>
            </ThemeProvider>
        </Router>
    </React.StrictMode>
);
