/* Trava de interface local. Não substitui autenticação de servidor.
   A publicação pública continua controlada pelo acesso ao repositório. */
window.PortfolioPanel = Object.freeze({
  async verify(password) {
    if (!globalThis.crypto?.subtle) throw new Error('Abra o site publicado com HTTPS para acessar o painel.');
    const bytes = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', bytes.encode(password), 'PBKDF2', false, ['deriveBits']);
    const result = await crypto.subtle.deriveBits({name:'PBKDF2', salt:bytes.encode('5aafd36f2981f6038b144407c5cc4ef2'), iterations:210000, hash:'SHA-256'}, key, 256);
    const hex = Array.from(new Uint8Array(result), n=>n.toString(16).padStart(2,'0')).join('');
    return hex === 'caa993089b72a8262e24f4804a8d6bbd85a409c8c2f0e08e3a48d15e7baca905';
  }
});
