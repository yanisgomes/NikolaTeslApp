import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Survey from './pages/Survey/';
import Header from './components/Header/';
import Footer from './components/Footer/';
import Error from './components/Error/';
import Results from './pages/Results/';
import Freelances from './pages/Freelances/';
import GlobalStyle from './utils/style/GlobalStyle';
import ProfileContainer from './components/ProfileContainer/';

import { ThemeProvider, SurveyProvider } from './utils/context/';

import styled from 'styled-components';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh; // 100% de la hauteur de la fenêtre
    padding-left: 30px;
    padding-right: 30px;
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider>
                <SurveyProvider>
                    <MainContainer>
                        <GlobalStyle />
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="*" element={<Error />} />
                            <Route
                                path="/survey/:questionNumber"
                                element={<Survey />}
                            />
                            <Route path="/results/" element={<Results />} />
                            <Route
                                path="/freelances/"
                                element={<Freelances />}
                            />
                            <Route
                                path="/profile/:id"
                                element={<ProfileContainer />}
                            />
                        </Routes>
                        <Footer />
                    </MainContainer>
                </SurveyProvider>
            </ThemeProvider>
        </Router>
    </React.StrictMode>
);
