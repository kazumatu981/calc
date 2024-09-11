import React from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

import './App.css';

import { Home } from './panels/Home';
import { OverView } from './panels/OverView';

function App() {
    const startContent = (
        <React.Fragment>
            <div className="flex flex-row">
                <div className="flex flex-row m-2">
                    <Button
                        aria-label="Home"
                        icon="pi pi-fw pi-home"
                        onClick={() => {
                            window.location.href = '/home';
                        }}
                    />
                    <Button
                        aria-label="overview"
                        icon="pi pi-fw pi-file"
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
                icon="pi pi-fw pi-info-circle"
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
