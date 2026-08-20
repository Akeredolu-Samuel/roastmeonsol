# roastmeonsol

Paste a Solana wallet. Get roasted. Nothing is saved.

User enters a wallet → `POST /api/roast` → Helius reads the chain → the server scores the degen → Gemini writes the roast → you share the card.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Keys live in `.env.local` (never the client):

```
HELIUS_API_KEY=
GEMINI_API_KEY=
```

Copy `.env.example` if you are setting this up on a new machine.

## Notes

- No database. No wallet connect. Address in, roast out.
- Share on X attaches the landscape card (native share) and posts a link so the image unfurls once the site is live.
- Share card is watermarked `roastmeonsol`.
- Put keys only in `.env.local`. Never commit them.
