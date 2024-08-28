import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { type ParserNode } from '../lib/parser/parser-node';

import { drawTree } from '../lib/util/node-to-mermaid';
import { sha256Hash } from '../lib/util/sha256hash';

export function ParserPanel({ node }: { node: ParserNode | undefined }) {
    const ref = useRef<HTMLDivElement>(null);
    const [src, setSrc] = useState<string | undefined>(undefined);
    const [key, setKey] = useState<string>('');

    useEffect(() => {
        console.log('update mermaid');
        if (node) {
            const mermaidSrc = drawTree(node);
            sha256Hash(mermaidSrc).then((hash) => {
                setSrc(mermaidSrc);
                setKey(hash);

                mermaid.init({}, ref.current === null ? undefined : ref.current);
            });
        }
    }, [node, src]);

    return src && node ? (
        <div className="mermaid" ref={ref} key={key}>
            {src}
        </div>
    ) : (
        <div key={key} />
    );
}
