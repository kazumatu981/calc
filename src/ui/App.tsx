import React from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import './App.css';

import { Home } from './panels/Home';
import { OverView } from './panels/OverView';

library.add(faHome, faBook, faInfoCircle);

function App() {
    const startContent = (
        <React.Fragment>
            <div className="flex flex-row">
                <div className="flex flex-row m-2">
                    <Button
                        aria-label="Home"
                        icon={<FontAwesomeIcon icon={faHome} />}
                        onClick={() => {
                            window.location.href = '/home';
                        }}
                    />
                    <Button
                        aria-label="overview"
                        icon={<FontAwesomeIcon icon={faBook} />}
                        onClick={() => (window.location.href = '/overview')}
                    />
                </div>
            </div>
        </React.Fragment>
    );

    const centerContent = (
        <div className="flex flex-row m-2">
            <h1 className="m-2">Calculator</h1>
        </div>
    );

    const endContent = (
        <React.Fragment>
            <Button
                aria-label="about"
                icon={<FontAwesomeIcon icon={faInfoCircle} />}
                onClick={() => (window.location.href = '/about')}
            />
        </React.Fragment>
    );

    return (
        <div className="App">
            <Toolbar start={startContent} center={centerContent} end={endContent} />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/overview" element={<OverView />} />
                    <Route path="/about" element={<div>about</div>} />
                    <Route path="*" element={<div>not found</div>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
