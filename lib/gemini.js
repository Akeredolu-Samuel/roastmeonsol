const MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-flash-latest",
];

function extractJson(text) {
  if (!text) return null;
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

function buildPrompt({ wallet, stats }) {
  return `You are the house comedian at roastmeonsol — a savage, funny Solana wallet roaster.
Roast this wallet using ONLY the stats. Be mean in a crypto-twitter way, never hateful, no slurs, no real-world violence, no bigotry.
Keep it specific to the numbers. Short punches land harder than essays.

Wallet: ${wallet}
Degen score: ${stats.score}/100
Personality hint: ${stats.personality.name}
Title hint: ${stats.personality.title}
Transactions sampled: ${stats.txCount}
Tokens touched: ${stats.tokensTouched}
Meme coins: ${stats.memeCoins}
Biggest native transfer: ${stats.biggestTxSol} SOL
Best month: ${stats.bestMonth} (${stats.bestMonthTxs || 0} txs in the sample)
Failed txs: ${stats.failedTx}
Swaps: ${stats.swaps}
NFT-ish hits: ${stats.nftHits}
SOL balance now: ${stats.solBalance}
Fees burned: ${stats.feesSol} SOL
Wallet age days: ${stats.ageDays}
Txs per day: ${stats.txsPerDay}
Recent activity:
${(stats.descriptions || []).slice(0, 8).map((d) => `- ${d}`).join("\n") || "- (quiet ledger)"}

No emojis. No emoji in any field.

Return JSON only:
{
  "title": "CERTIFIED … (2-5 words, all caps)",
  "personality": "short nickname, 2-4 words",
  "roast": "two short sentences, line-break friendly",
  "verdict": "one quotable line"
}`;
}

function stripEmoji(value) {
  return String(value || "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function generateWithModel(model, prompt, apiKey, signal) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.95,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    }),
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${model} ${res.status} ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  const parsed = extractJson(text);
  if (!parsed || !parsed.roast) {
    throw new Error(`${model} returned no roast`);
  }
  return parsed;
}

export async function generateRoast({ wallet, stats, signal }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const prompt = buildPrompt({ wallet, stats });
  let lastError;

  for (const model of MODELS) {
    try {
      const parsed = await generateWithModel(model, prompt, apiKey, signal);
      return {
        title: stripEmoji(parsed.title || stats.personality.title).toUpperCase(),
        icon: stats.personality.icon || "degen",
        personality: stripEmoji(parsed.personality || stats.personality.name),
        roast: stripEmoji(parsed.roast),
        verdict: stripEmoji(parsed.verdict),
        model,
      };
    } catch (err) {
      lastError = err;
      console.error("[gemini]", model, err?.message || err);
    }
  }

  throw lastError || new Error("Gemini roast failed");
}
