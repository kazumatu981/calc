import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

library.add(faLocationDot);

export function PositionViewer({ expression }: { expression: string }): JSX.Element {
    const header =
        expression.length === 0 ? (
            <></>
        ) : (
            <div className="flex flex-column border-1">
                <div className="flex align-items-center justify-content-center border-bottom-1 p-1">{'character'}</div>
                <div className="flex align-items-center justify-content-center border-bottom-1 p-1 bg-gray-300">
                    <FontAwesomeIcon icon={faLocationDot} size="xs" />
                    {'position'}
                </div>
            </div>
        );
    const charArray = expression.split('').map((charItem, index) => {
        return (
            <div className="flex flex-column border-1">
                <div className="flex align-items-center justify-content-center border-bottom-1 p-1 w-2rem">
                    {charItem === ' ' ? <>&nbsp;</> : charItem}
                </div>
                <div className="flex align-items-center justify-content-center border-bottom-1 p-1 bg-gray-300">
                    {index}
                </div>
            </div>
        );
    });

    return <div className="flex flex-row">{[header, ...charArray]}</div>;
}
