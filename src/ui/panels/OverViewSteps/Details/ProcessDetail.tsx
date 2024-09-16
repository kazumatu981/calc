interface ProcessDetailProps {
    figure: JSX.Element;
    description: JSX.Element;
}

export function ProcessDetail(args: ProcessDetailProps): JSX.Element {
    return (
        <div className="flex flex-column gap-2">
            <div className="flex-auto flex justify-content-center align-items-center">{args.figure}</div>
            <div>{args.description}</div>
        </div>
    );
}
