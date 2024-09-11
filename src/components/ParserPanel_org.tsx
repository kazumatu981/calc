import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { type ParserNode } from '../lib/parser/parser-node';

import { drawTree } from '../lib/util/node-to-mermaid';
import { sha256Hash } from '../lib/util/sha256hash';

export function ParserPanel({ parsedNode }: { parsedNode: ParserNode | undefined }) {
    const ref = useRef<HTMLDivElement>(null);
    const [src, setSrc] = useState<string | undefined>(undefined);
    const [key, setKey] = useState<string>('');

    useEffect(() => {
        console.log('update mermaid');
        if (parsedNode) {
            const mermaidSrc = drawTree(parsedNode);
            sha256Hash(mermaidSrc).then((hash) => {
                setSrc(mermaidSrc);
                setKey(hash);
            });
        }
    }, [parsedNode]);

    useEffect(() => {
        if (src) {
            mermaid.init({}, ref.current === null ? undefined : ref.current);
        }
    }, [src]);

    return src && parsedNode ? (
        <div className="mermaid" ref={ref} key={key}>
            {src}
        </div>
    ) : (
        <div key={key} />
    );
}
