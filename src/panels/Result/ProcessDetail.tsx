interface ProcessDetailProps {
    from: JSX.Element;
    to: JSX.Element;
    description: JSX.Element;
}
export function ProcessDetail(args: ProcessDetailProps): JSX.Element {
    return (
        <div className="flex flex-column gap-2">
            <div className="flex flex-row">
                <div className="flex-auto flex justify-content-center align-items-center">{args.from}</div>
                <div className="flex-shrink-0 flex justify-content-center align-items-center font-medium">
                    <i className="pi pi-chevron-right" />
                </div>
                <div className="flex-auto flex justify-content-center align-items-center">{args.to}</div>
            </div>
            <div>{args.description}</div>
        </div>
    );
}
