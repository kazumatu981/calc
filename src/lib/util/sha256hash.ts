export async function sha256Hash(input: string): Promise<string> {
    // https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/digest
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}
