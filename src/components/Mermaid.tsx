import mermaid from 'mermaid';
import { useRef, useEffect } from 'react';

type Props = {
    src: string;
    className: string;
};

export function Mermaid({ src, className }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (src) {
            mermaid.init({}, ref.current === null ? undefined : ref.current);
        }
        // }, [ref.current, src]);
    }, [src]);

    return src ? (
        <div className={className} ref={ref} key={src}>
            {src}
        </div>
    ) : (
        <div className={className} key={src} />
    );
}
