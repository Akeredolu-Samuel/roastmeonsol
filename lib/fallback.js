const LINES = {
  "Dust Swap Addict": {
    roast: "You spent a year swapping dust into dead tickers. The chain billed you for the privilege of going nowhere.",
    verdict: "You didn't go broke. You dripped there.",
  },
  "The Tourist": {
    roast: "Four transactions and a dream. You didn't degen — you window-shopped the casino and left with the brochure.",
    verdict: "Your wallet isn't a portfolio. It's a guestbook.",
  },
  "Professional Exit Liquidity": {
    roast: "You don't buy the dip. You buy the exact candle everyone else is dumping into.",
    verdict: "Your portfolio isn't diversified. It's just diversified ways to lose money.",
  },
  "The FOMO Merchant": {
    roast: "You chase every ticker like it's the last helicopter out of a rug. It never is.",
    verdict: "You don't have a strategy. You have a refresh button and a prayer.",
  },
  "Priority Fee Donor": {
    roast: "Half your personality is failed transactions. Solana didn't rug you — your timing did.",
    verdict: "You paid extra to lose faster. That's almost impressive.",
  },
  "JPEG Bagholder": {
    roast: "You collected pictures of monkeys while the floor fell through the floor. At least the JPEGs still load.",
    verdict: "Your bags have more pixels than profit.",
  },
  "Rekt Historian": {
    roast: "The chain remembers every ape. Your SOL balance is the after-credits scene.",
    verdict: "You didn't sell the top. You became the documentary about it.",
  },
  "Terminally Online": {
    roast: "You trade like sleep is a skill issue. The mempool knows your government name.",
    verdict: "Touch grass. Then sell whatever you bought instead.",
  },
  "One-Shot Ape": {
    roast: "Low activity, high delusion. You didn't trade — you donated to a ticker with a dog on it.",
    verdict: "One click. Lifetime membership in the bagholders' union.",
  },
  "The Lab Rat": {
    roast: "Twenty tokens, zero thesis. You're not diversified — you're running a toxicology study on your net worth.",
    verdict: "Your wallet is a junk drawer with worse returns.",
  },
  "Weekend Degen": {
    roast: "You show up, ape something, vanish, repeat. Consistency is not a personality, but here we are.",
    verdict: "Mid-tier degen. The chain expected more chaos.",
  },
};

export function fallbackRoast(stats) {
  const name = stats.personality?.name || "Weekend Degen";
  const pack = LINES[name] || LINES["Weekend Degen"];
  return {
    title: stats.personality.title,
    icon: stats.personality.icon || "degen",
    personality: stats.personality.name,
    roast: pack.roast,
    verdict: pack.verdict,
    model: "fallback",
  };
}
