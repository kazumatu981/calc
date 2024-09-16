import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';
import { useEffect } from 'react';

import { resolveAsync } from '../../lib/resolver';
import './TerminalPanel.css';

export function TerminalPanel(): JSX.Element {
    useEffect(() => {
        TerminalService.on('command', (command: string) => {
            resolveAsync(command)
                .then((result) => {
                    TerminalService.emit('response', result);
                })
                .catch((e) => {
                    TerminalService.emit('response', e.message);
                });
        });
        return () => {
            TerminalService.off('command', () => {});
        };
    }, []);
    return (
        <div className="m-4">
            <Terminal
                welcomeMessage='Welcome to the Calculator.Please enter an "expression" and press Enter'
                prompt="expression>"
            />
        </div>
    );
}
