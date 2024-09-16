import React from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faInfoCircle, faTerminal } from '@fortawesome/free-solid-svg-icons';

import './App.css';

import { HomePanel } from './panels/HomePanel';
import { OverViewPanel } from './panels/OverViewPanel';
import { TerminalPanel } from './panels/TerminalPanel';

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
                </div>
                <div className="flex flex-row m-2">
                    <Button
                        aria-label="overview"
                        icon={<FontAwesomeIcon icon={faBook} />}
                        onClick={() => (window.location.href = '/overview')}
                    />
                    <Button
                        aria-label="terminal"
                        icon={<FontAwesomeIcon icon={faTerminal} />}
                        onClick={() => (window.location.href = '/terminal')}
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
                    <Route path="/home" element={<HomePanel />} />
                    <Route path="/overview" element={<OverViewPanel />} />
                    <Route path="/terminal" element={<TerminalPanel />} />
                    <Route path="/about" element={<div>about</div>} />
                    <Route path="*" element={<div>not found</div>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
