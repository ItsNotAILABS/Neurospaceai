// NEUROEMERGENCE CORE — MARKET FEEDS ENGINE
// HTTP outcalls: CoinGecko BTC/ETH/ICP + 9 more chains
// Price normalization, trend detection, regime classification
// Owner: Alfredo Medina Hernandez | MedinaSITech@outlook.com

module {

  // Market state
  public type MarketState = {
    btcPrice    : Float;     // raw USD
    ethPrice    : Float;
    icpPrice    : Float;
    solPrice    : Float;
    bnbPrice    : Float;
    adaPrice    : Float;
    dotPrice    : Float;
    avaxPrice   : Float;
    maticPrice  : Float;
    linkPrice   : Float;
    uniPrice    : Float;
    aavePrice   : Float;
    // Normalized (0-1 relative to 90-day range)
    btcNorm     : Float;
    ethNorm     : Float;
    icpNorm     : Float;
    // Trend (-1 = bear, 0 = neutral, +1 = bull)
    btcTrend    : Float;
    ethTrend    : Float;
    icpTrend    : Float;
    globalTrend : Float;
    // Regime
    regime      : Nat;    // 0=crash, 1=bear, 2=neutral, 3=bull, 4=mania
    volatility  : Float;  // 0-1
    // Price history EMA
    btcEMA7     : Float;  // 7-beat EMA
    btcEMA30    : Float;  // 30-beat EMA
    ethEMA7     : Float;
    ethEMA30    : Float;
    icpEMA7     : Float;
    icpEMA30    : Float;
    // Reference prices for anchoring
    btcAnchor   : Float;
    ethAnchor   : Float;
    icpAnchor   : Float;
    anchorSet   : Bool;
  };

  // ── Price normalization ─────────────────────────────────────────────
  // Maps raw price to 0-1 using assumed range
  // BTC: 0-200,000, ETH: 0-20,000, ICP: 0-200
  public func normalizeBTC(price: Float) : Float { _clamp(price / 200_000.0, 0.0, 1.0) };
  public func normalizeETH(price: Float) : Float { _clamp(price / 20_000.0,  0.0, 1.0) };
  public func normalizeICP(price: Float) : Float { _clamp(price / 200.0,     0.0, 1.0) };

  // ── EMA update ───────────────────────────────────────────────────────────
  // EMA(t) = alpha * price(t) + (1-alpha) * EMA(t-1)
  let ALPHA7  : Float = 2.0 / 8.0;   // 7-period EMA
  let ALPHA30 : Float = 2.0 / 31.0;  // 30-period EMA

  func ema(current: Float, price: Float, alpha: Float) : Float {
    alpha * price + (1.0 - alpha) * current
  };

  // ── Trend detection ───────────────────────────────────────────────────
  // trend = (EMA7 - EMA30) / EMA30 ... normalized to [-1, +1]
  public func computeTrend(ema7: Float, ema30: Float) : Float {
    if (ema30 < 0.001) { return 0.0; };
    let ratio = (ema7 - ema30) / ema30;
    _clamp(ratio * 5.0, -1.0, 1.0)  // 20% move = full signal
  };

  // ── Global trend: weighted average of BTC/ETH/ICP ────────────────────
  public func globalTrend(btcT: Float, ethT: Float, icpT: Float) : Float {
    (btcT * 0.5 + ethT * 0.3 + icpT * 0.2)  // BTC leads
  };

  // ── Volatility ────────────────────────────────────────────────────────────
  // Spread between EMA7 and EMA30 as measure of volatility
  public func computeVolatility(ema7: Float, ema30: Float) : Float {
    if (ema30 < 0.001) { return 0.0; };
    _clamp(Float.abs(ema7 - ema30) / ema30 * 10.0, 0.0, 1.0)
  };

  // ── Market regime classification ──────────────────────────────────────
  // 0=crash, 1=bear, 2=neutral, 3=bull, 4=mania
  public func classifyRegime(globalT: Float, volatility: Float) : Nat {
    if      (globalT < -0.6)               { 0 }  // crash
    else if (globalT < -0.2)               { 1 }  // bear
    else if (globalT < 0.2)                { 2 }  // neutral
    else if (globalT < 0.6 or volatility < 0.5) { 3 }  // bull
    else                                   { 4 }  // mania
  };

  // ── Market beat update (called with new prices from HTTP outcall) ────────
  public func beatMarket(
    state   : MarketState,
    newBTC  : Float,
    newETH  : Float,
    newICP  : Float
  ) : MarketState {
    // Anchor setting (first real price)
    let anchorSet = state.anchorSet or newBTC > 0.0;
    let btcAnch   = if (not state.anchorSet and newBTC > 0.0) { newBTC } else { state.btcAnchor };
    let ethAnch   = if (not state.anchorSet and newETH > 0.0) { newETH } else { state.ethAnchor };
    let icpAnch   = if (not state.anchorSet and newICP > 0.0) { newICP } else { state.icpAnchor };

    // EMA updates
    let newBtcEMA7  = ema(state.btcEMA7,  newBTC, ALPHA7);
    let newBtcEMA30 = ema(state.btcEMA30, newBTC, ALPHA30);
    let newEthEMA7  = ema(state.ethEMA7,  newETH, ALPHA7);
    let newEthEMA30 = ema(state.ethEMA30, newETH, ALPHA30);
    let newIcpEMA7  = ema(state.icpEMA7,  newICP, ALPHA7);
    let newIcpEMA30 = ema(state.icpEMA30, newICP, ALPHA30);

    // Trends
    let btcT  = computeTrend(newBtcEMA7, newBtcEMA30);
    let ethT  = computeTrend(newEthEMA7, newEthEMA30);
    let icpT  = computeTrend(newIcpEMA7, newIcpEMA30);
    let gT    = globalTrend(btcT, ethT, icpT);
    let vol   = computeVolatility(newBtcEMA7, newBtcEMA30);
    let regime= classifyRegime(gT, vol);

    {
      btcPrice = newBTC; ethPrice = newETH; icpPrice = newICP;
      solPrice = state.solPrice; bnbPrice = state.bnbPrice;
      adaPrice = state.adaPrice; dotPrice = state.dotPrice;
      avaxPrice= state.avaxPrice; maticPrice=state.maticPrice;
      linkPrice= state.linkPrice; uniPrice = state.uniPrice;
      aavePrice= state.aavePrice;
      btcNorm  = normalizeBTC(newBTC);
      ethNorm  = normalizeETH(newETH);
      icpNorm  = normalizeICP(newICP);
      btcTrend = btcT; ethTrend = ethT; icpTrend = icpT;
      globalTrend = gT;
      regime   = regime;
      volatility = vol;
      btcEMA7  = newBtcEMA7;  btcEMA30 = newBtcEMA30;
      ethEMA7  = newEthEMA7;  ethEMA30 = newEthEMA30;
      icpEMA7  = newIcpEMA7;  icpEMA30 = newIcpEMA30;
      btcAnchor = btcAnch; ethAnchor = ethAnch; icpAnchor = icpAnch;
      anchorSet = anchorSet;
    }
  };

  // ── CoinGecko URL ───────────────────────────────────────────────────────
  public let COINGECKO_URL : Text =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,internet-computer&vs_currencies=usd";

  // JSON path extraction (simplified)
  // Response: {"bitcoin":{"usd":50000},"ethereum":{"usd":3000},"internet-computer":{"usd":15}}
  public func parseBTCPrice(json: Text) : Float {
    // Look for "bitcoin":{"usd":
    let prefix = "bitcoin\":{\"usd\":";
    switch (textFind(json, prefix)) {
      case (?idx) { parseFloat(json, idx + prefix.size()) };
      case null   { 0.0 };
    }
  };

  public func parseETHPrice(json: Text) : Float {
    let prefix = "ethereum\":{\"usd\":";
    switch (textFind(json, prefix)) {
      case (?idx) { parseFloat(json, idx + prefix.size()) };
      case null   { 0.0 };
    }
  };

  public func parseICPPrice(json: Text) : Float {
    let prefix = "internet-computer\":{\"usd\":";
    switch (textFind(json, prefix)) {
      case (?idx) { parseFloat(json, idx + prefix.size()) };
      case null   { 0.0 };
    }
  };

  // Simple text find: returns index of needle in haystack
  func textFind(haystack: Text, needle: Text) : ?Nat {
    let h = Text.toArray(haystack);
    let n = Text.toArray(needle);
    let hl = h.size();
    let nl = n.size();
    if (nl > hl) { return null; };
    for (i in Iter.range(0, hl - nl)) {
      var match = true;
      for (j in Iter.range(0, nl - 1)) {
        if (h[i+j] != n[j]) { match := false; };
      };
      if (match) { return ?i; };
    };
    null
  };

  // Parse float from text starting at position
  func parseFloat(text: Text, start: Nat) : Float {
    let chars = Text.toArray(text);
    var i = start;
    var result : Float = 0.0;
    var decimal = false;
    var decimals : Float = 1.0;
    while (i < chars.size()) {
      let c = chars[i];
      if (c >= '0' and c <= '9') {
        let d = Float.fromInt(Char.toNat32(c) - Char.toNat32('0') |> Int32.toInt(Int32.fromNat32(_)));
        if (decimal) {
          decimals *= 10.0;
          result += d / decimals;
        } else {
          result := result * 10.0 + d;
        };
      } else if (c == '.') {
        decimal := true;
      } else {
        return result; // stop at non-numeric
      };
      i += 1;
    };
    result
  };

  // ── Arbitrage signal ───────────────────────────────────────────────────
  // High spread between assets = arbitrage opportunity
  public func arbitrageSignal(
    btcNorm : Float,
    ethNorm : Float,
    icpNorm : Float
  ) : Float {
    let maxP = Float.max(btcNorm, Float.max(ethNorm, icpNorm));
    let minP = Float.min(btcNorm, Float.min(ethNorm, icpNorm));
    _clamp(maxP - minP, 0.0, 1.0)
  };

  // ── Market impact on organism ─────────────────────────────────────────
  // Bull market boosts minting, bear market boosts defense
  public func marketMintMod(globalTrend: Float) : Float {
    1.0 + globalTrend * 0.3  // +/-30% based on market
  };
  public func marketThreatMod(globalTrend: Float) : Float {
    _clamp(0.3 - globalTrend * 0.3, 0.0, 0.6)  // bear = more threat
  };

  private func _clamp(x: Float, lo: Float, hi: Float) : Float {
    if (x < lo) lo else if (x > hi) hi else x
  };
}
