export function PositionIndex({ expression }: { expression: string }): JSX.Element {
    const header = (
        <div className="flex flex-column border-1">
            <div className="flex align-items-center justify-content-center border-bottom-1 p-1">{'expression'}</div>
            <div className="flex align-items-center justify-content-center border-bottom-1 p-1 bg-gray-300">
                <i className="pi pi-map-marker text-xs"></i>
                {'position'}
            </div>
        </div>
    );
    const charArray = expression.split('').map((charItem, index) => {
        return (
            <div className="flex flex-column border-1">
                <div className="flex align-items-center justify-content-center border-bottom-1 p-1 w-2rem">
                    {charItem}
                </div>
                <div className="flex align-items-center justify-content-center border-bottom-1 p-1 bg-gray-300">
                    {index}
                </div>
            </div>
        );
    });

    return <div className="flex flex-row">{[header, ...charArray]}</div>;
}
