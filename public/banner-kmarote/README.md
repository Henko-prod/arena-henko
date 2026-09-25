# Banner Promo Kmarote — card isolado

Só o card do banner (foto + logo + textos), sem dependências: sem build, sem
framework, sem CDN. As **fontes estão embutidas no CSS** (base64), então
renderizam certo em qualquer lugar — inclusive abrindo o `index.html` direto
no navegador (via `file://`).

## Estrutura

```
banner-kmarote/
├── index.html          → exemplo (abra no navegador pra ver)
├── style.css           → estilo + fontes embutidas, escopado em .kmarote-banner
└── images/
    ├── show-bts.webp      → foto de fundo do card
    └── logo-kmarote.webp  → logo
```

## Como usar em outro lugar

1. Copie a pasta pro projeto de destino (mantendo `images/` ao lado do `style.css`).
2. Inclua o CSS no `<head>`:
   ```html
   <link rel="stylesheet" href="caminho/para/style.css" />
   ```
3. Cole o bloco `.kmarote-banner` (entre os comentários `COPIE A PARTIR DAQUI`
   / `ATÉ AQUI` no `index.html`) onde quiser.

O card ocupa 100% da largura do container até no máximo **1230px**, e empilha
no mobile (≤ 767px). Pra centralizar, é só o container pai cuidar disso
(ex.: `display:flex; justify-content:center`).

## Detalhes

- **Fontes:** Gasoek One (headline + pílula) e Inter (título e textos),
  embutidas em base64 no `style.css` — não precisam de arquivo separado nem
  de internet. (Google Fonts, Open Font License.)
- **Isolado:** todo o CSS vive sob `.kmarote-banner` e não afeta o resto da
  página; as fontes usam nomes próprios (`Gasoek One`, `InterKB`) pra não
  colidir com as do site host.
- **Link do "participe":** `https://kmarote.klove.fan/` (edite o `href` no
  `index.html`).
- **Só as imagens ficam como arquivo** (funcionam via `file://` normalmente).
  Se quiser um único arquivo 100% autossuficiente, dá pra embutir as imagens
  também em base64 — é só pedir.
