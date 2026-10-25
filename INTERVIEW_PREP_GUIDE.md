# 🏛️ ValueScraper Quant Terminal: Comprehensive Interview & System Architecture Guide
### *Master Study Handbook for Wealth Management, Investment Banking, and Institutional Asset Management Interviews*

---

## 🎯 Executive Summary & Interview Framing

**How to introduce this project in an interview:**
> *"I designed and engineered **ValueScraper**, an institutional-grade mutual fund quantitative terminal and fixed-income arbitrage platform built on the official daily AMFI (Association of Mutual Funds in India) data ingestion pipeline. Rather than building a generic retail mutual fund screener, I focused on high-stakes institutional wealth management problems: Modern Portfolio Theory (MPT) risk attribution, asymmetric capture ratios, portfolio overlap analysis, post-2023 debt mutual fund vs. corporate bond tax parity arbitrage, and a dynamic Lump Sum vs. STP cash deployment engine with daily liquid accrual."*

---

# SECTION A: THE FINANCIAL ENGINES
### *Concepts, Exact Formulas, Practical Indian Market Examples, & Recruiter Q&A*

---

### 1. Risk-Adjusted Returns & Modern Portfolio Theory (MPT)

#### A. Standard Deviation (Annualized Total Volatility — $\sigma$)
* **The Plain-English Concept:** Measures how wildly a mutual fund’s returns swing around its historical average. It quantifies **total risk** (both market-wide systematic risk and stock-specific idiosyncratic risk).
* **The Exact Mathematical Formula:**
  $$\sigma_{\text{monthly}} = \sqrt{\frac{1}{N - 1} \sum_{t=1}^{N} (R_t - \bar{R})^2}$$
  $$\sigma_{\text{annualized}} = \sigma_{\text{monthly}} \times \sqrt{12}$$
  *(In our codebase, daily or monthly NAV returns are annualized using $\sqrt{12}$ for monthly series or $\sqrt{252}$ for daily trading days).*
* **Practical Indian Market Example:**
  - *Large Cap Fund (e.g., Mirae Asset Large Cap):* $\sigma \approx 13.5\%$
  - *Small Cap Fund (e.g., Quant Small Cap):* $\sigma \approx 19.8\%$
  - A client investing ₹1 Crore in a small-cap fund must psychologically tolerate periodic 20% annualized swings in portfolio value compared to a large-cap fund.
* **Tech Implementation:** `src/lib/riskMetrics.ts` -> `calculateStandardDeviation()`.

---

#### B. Beta ($\beta$ — Systematic Market Sensitivity)
* **The Plain-English Concept:** Measures how sensitively a fund’s NAV moves in reaction to movements in its primary benchmark index (e.g., Nifty 50 TRI or Nifty 500 TRI).
* **The Exact Mathematical Formula:**
  $$\beta = \frac{\text{Covariance}(R_{\text{fund}}, R_{\text{benchmark}})}{\text{Variance}(R_{\text{benchmark}})} = \frac{\sum (R_{f,t} - \bar{R}_f)(R_{b,t} - \bar{R}_b)}{\sum (R_{b,t} - \bar{R}_b)^2}$$
* **Interpretation Benchmarks:**
  - $\beta = 1.0$: Fund moves in lockstep with the market.
  - $\beta = 0.85$: Defensive fund. If the market crashes $-10\%$, the fund is expected to drop only $-8.5\%$.
  - $\beta = 1.25$: High-beta aggressive fund. Amplifies market rallies by $+25\%$, but suffers $25\%$ deeper drops during market sell-offs.
* **Tech Implementation:** `src/lib/riskMetrics.ts` -> `calculateBeta()`.

---

#### C. Sharpe Ratio (Total Risk Efficiency)
* **The Plain-English Concept:** Developed by Nobel laureate William F. Sharpe. It measures the "miles per gallon" of an investment: **how much excess return did the fund generate for every unit of total volatility endured above the risk-free rate?**
* **The Exact Mathematical Formula:**
  $$\text{Sharpe Ratio} = \frac{R_{\text{fund}} - R_f}{\sigma_{\text{fund}}}$$
  Where:
  - $R_{\text{fund}}$ = Annualized Compound Return (CAGR)
  - $R_f$ = Risk-Free Rate (Hardcoded to **6.50%**, reflecting the benchmark Indian 10-Year Government Securities Sovereign Yield — G-Sec)
  - $\sigma_{\text{fund}}$ = Annualized Standard Deviation
* **Practical Example:**
  - Fund A: CAGR = $18\%$, $\sigma = 15\% \implies \text{Sharpe} = \frac{18 - 6.5}{15} = 0.767$
  - Fund B: CAGR = $20\%$, $\sigma = 22\% \implies \text{Sharpe} = \frac{20 - 6.5}{22} = 0.613$
  - *Interview Insight:* Fund A is fundamentally superior to Fund B despite delivering a lower raw return, because Fund B took reckless, uncompensated volatility to achieve its extra 2%.
* **Tech Implementation:** `src/lib/riskMetrics.ts` -> `calculateSharpeRatio()`.

---

#### D. Sortino Ratio & Downside Deviation
* **The Plain-English Concept:** The primary flaw of the Sharpe Ratio is that it penalizes upward volatility (rapid price surges) equally with downward crashes. The Sortino Ratio penalizes **only harmful downside volatility** below a Minimum Acceptable Return (MAR).
* **The Exact Mathematical Formula:**
  $$\text{Downside Deviation } (\sigma_d) = \sqrt{\frac{1}{N} \sum_{t=1}^{N} \left[\min(0, R_t - \text{MAR})\right]^2}$$
  $$\text{Sortino Ratio} = \frac{R_{\text{fund}} - R_f}{\sigma_{d, \text{annualized}}}$$
* **Practical Wealth Management Application:**
  - High Net Worth Individuals (HNIs) and family offices care about wealth preservation. A fund with a Sortino Ratio $> 1.0$ demonstrates that the fund manager protects capital during bear markets while capturing upside.
* **Tech Implementation:** `src/lib/riskMetrics.ts` -> `calculateDownsideDeviation()` and `calculateSortinoRatio()`.

---

#### E. Jensen's Alpha ($\alpha$ — True Manager Skill)
* **The Plain-English Concept:** Derived from the Capital Asset Pricing Model (CAPM). It isolates whether the fund manager generated true outperformance through superior stock picking and sector allocation, or simply rode a rising market tide.
* **The Exact Mathematical Formula:**
  $$\alpha = R_{\text{fund}} - \underbrace{\left[ R_f + \beta \times (R_{\text{benchmark}} - R_f) \right]}_{\text{CAPM Expected Return}}$$
* **Interpretation:**
  - $\alpha > 0$: The manager added genuine value above the risk taken.
  - $\alpha < 0$: The manager destroyed value after factoring in fees and systematic risk exposure.
* **Tech Implementation:** `src/lib/riskMetrics.ts` -> `calculateAlpha()`.

---

### 2. Asymmetric Market Capture & Active Risk Management

#### A. Upside & Downside Capture Ratios
* **The Plain-English Concept:** Shows how much of the market’s gains the fund captured during positive months versus how much of the market’s losses it absorbed during negative months.
* **The Exact Mathematical Formula:**
  $$\text{Upside Capture Ratio (\%)} = \left[ \frac{\prod_{t \in \text{Up Months}} (1 + R_{f,t}) - 1}{\prod_{t \in \text{Up Months}} (1 + R_{b,t}) - 1} \right] \times 100$$
  $$\text{Downside Capture Ratio (\%)} = \left[ \frac{\prod_{t \in \text{Down Months}} (1 + R_{f,t}) - 1}{\prod_{t \in \text{Down Months}} (1 + R_{b,t}) - 1} \right] \times 100$$
* **The "Capture Ratio Spread" (Institutional Holy Grail):**
  - If a fund has an **Upside Capture of 115%** and a **Downside Capture of 80%**, the spread is $+35\%$.
  - In a bull market (+10%), the fund gains $+11.5\%$. In a crash (-10%), the fund drops only $-8.0\%$. Over multiple full market cycles, this asymmetry produces exponential compounded outperformance.
* **Tech Implementation:** `src/lib/riskMetrics.ts` -> `calculateCaptureRatios()`.

---

#### B. Tracking Error (TE) & Information Ratio (IR)
* **The Plain-English Concept:**
  - **Tracking Error:** The volatility of excess returns (active risk taken by deviating from the index).
  - **Information Ratio:** The efficiency of that active risk—how much alpha was generated per unit of tracking error.
* **The Exact Mathematical Formula:**
  $$\text{Active Return}_t = D_t = R_{\text{fund}, t} - R_{\text{benchmark}, t}$$
  $$\text{Tracking Error (TE)} = \sigma(D_t) \times \sqrt{12}$$
  $$\text{Information Ratio (IR)} = \frac{\text{Annualized Active Return}}{\text{Tracking Error}} = \frac{\bar{D} \times 12}{\text{TE}}$$
* **Interview Benchmarks:**
  - $\text{IR} < 0$: Negative alpha. Active manager underperformed passive index fund after charging active fees.
  - $\text{IR} = 0.50$: Good active manager.
  - $\text{IR} \ge 1.00$: Exceptional, institutional-grade active manager.
* **Tech Implementation:** `src/lib/riskMetrics.ts` -> `calculateInformationRatio()`.

---

### 3. The Diversification Illusion & Portfolio Overlap Math

* **The Problem in Retail Wealth Management:**
  Retail investors frequently buy 5 to 8 equity mutual funds (e.g., Parag Parikh Flexi Cap, HDFC Flexi Cap, ICICI Pru Bluechip, SBI Focused Equity) thinking they are well-diversified. In reality, Indian large-cap mutual funds are all constrained by the liquidity of the same top 50 Nifty stocks.
* **The Exact Mathematical Formula (Minimum Weight Intersection):**
  For two portfolios $P_A$ and $P_B$ containing weights $W_{A,i}$ and $W_{B,i}$ for each company $i$:
  $$\text{Portfolio Overlap Percentage} = \sum_{i \in P_A \cap P_B} \min\left(W_{A,i}, W_{B,i}\right)$$
* **Real-World Case Study:**
  - If Fund A holds 8.4% in HDFC Bank and Fund B holds 7.8% in HDFC Bank, the common overlap contribution is $\min(8.4, 7.8) = 7.8\%$.
  - When summed across the top 30 holdings, two seemingly distinct flexi-cap funds often share **45% to 65% identical stock exposure**.
  - **The Investor Harm:** The investor pays two separate sets of Total Expense Ratios (TERs) to two asset management companies for holding identical underlying stock baskets.
* **Tech Implementation:** `src/lib/overlapCalculator.ts` -> `calculatePortfolioOverlap()`.

---

### 4. Fixed Income Arbitrage & The Post-2023 Tax Parity

* **The Regulatory Catalyst (Finance Act 2023 — Section 50AA):**
  Prior to April 1, 2023, debt mutual funds held for $> 3$ years enjoyed Long-Term Capital Gains (LTCG) tax of $20\%$ with **indexation benefits** (adjusting purchase price for inflation via the Cost Inflation Index — CII).
  The Finance Act 2023 **stripped indexation** from debt mutual funds with $\le 35\%$ equity exposure. All gains are now categorized as short-term capital gains and taxed at the investor's **marginal income tax slab rate** (up to $39\%$ with surcharge).
* **The Arbitrage Opportunity:**
  Direct secondary corporate bonds are also taxed at marginal slab rates on interest coupons. **The tax advantage of debt mutual funds is zero.**
* **The TER Fee Drag Equation:**
  $$\text{Net Yield}_{\text{Fund}} = \text{Gross Portfolio YTM} - \text{Total Expense Ratio (TER)}$$
  $$\text{Net Yield}_{\text{Direct Bond}} = \text{Secondary Market YTM} - 0.00\% \text{ (Zero Fee Drag)}$$
  $$\text{Yield Spread Arbitrage} = \text{Net Yield}_{\text{Direct Bond}} - \text{Net Yield}_{\text{Fund}} \approx +25\text{ to }+75\text{ bps}$$
* **Modified Duration Matching:**
  To ensure the arbitrage carries zero extra interest rate risk, the bond must match the fund's duration:
  $$MD = \frac{\text{Macaulay Duration}}{1 + \frac{\text{YTM}}{m}}$$
* **Rupee Impact on Corporate Treasuries:**
  On a ₹50 Crore corporate treasury deployment over 3 years:
  $$\Delta \text{Wealth} = \text{INR } 50,00,00,000 \times 0.65\% \times 3 \text{ Years} = \text{INR } 97,50,000 \text{ in extra cash flow!}$$
* **Tech Implementation:** `src/lib/bondArbitrageEngine.ts` -> `calculateArbitrageEconomics()`.

---

### 5. Tactical Cash Deployment: Lump Sum vs. STP Optimizer

* **The Behavioral Finance Dilemma:**
  A client sells a business or receives an inheritance of ₹1 Crore when the Nifty is trading at an All-Time High (e.g., P/E > 24).
  - *Option A (Lump Sum):* Deploy 100% on Day 1. Vulnerable to an immediate $-15\%$ market correction.
  - *Option B (Systematic Transfer Plan — STP):* Park ₹1 Crore in a Liquid Debt Fund earning 7.00% annualized interest. Transfer $\frac{1}{N}$th of the capital each month into the equity fund over 3, 6, or 12 months.
* **The Math Behind the Terminal Simulator:**
  1. **Daily Liquid Interest Accrual:**
     $$\text{Daily Accrual} = \text{LiquidBalance}_t \times \left[\left(1 + \frac{0.07}{365}\right)^{\Delta d} - 1\right]$$
  2. **Dollar-Cost Averaging Acquisition Price:**
     $$\text{Average NAV}_{\text{STP}} = \frac{\text{Total Capital Deployed}}{\sum_{k=1}^{N} \text{Units Acquired}_k}$$
  3. **The Regret Index (Drawdown Cushioning):**
     $$\text{Drawdown Mitigation} = \text{MaxDrawdown}_{\text{LumpSum}} - \text{MaxDrawdown}_{\text{STP}}$$
     Because up to 80% of capital remains in cash during early market drops, the portfolio's drawdown is mathematically dampened.
* **Tech Implementation:** `src/lib/stpSimulator.ts` -> `simulateLumpSumVsStp()`.

---

### 6. XIRR vs. CAGR: True Unit Accumulation

* **Why CAGR Fails for Periodic Investments:**
  CAGR assumes a single lump sum invested at $t=0$ and redeemed at $t=T$:
  $$\text{CAGR} = \left(\frac{\text{NAV}_T}{\text{NAV}_0}\right)^{\frac{1}{n}} - 1$$
  For monthly SIPs, each installment has a different holding period ($T - t_i$) and purchases a different quantity of units depending on that day's NAV.
* **The Newton-Raphson XIRR Algorithm:**
  XIRR solves for the internal rate of return $r$ where the Net Present Value (NPV) of all cash inflows and the terminal portfolio value equals zero:
  $$f(r) = \sum_{i=1}^{N} \frac{C_i}{(1 + r)^{\frac{d_i - d_0}{365}}} + \frac{\text{Terminal Value}}{(1 + r)^{\frac{d_N - d_0}{365}}} = 0$$
  The derivative $f'(r)$ is computed, and the root is discovered iteratively:
  $$r_{k+1} = r_k - \frac{f(r_k)}{f'(r_k)}$$
* **Tech Implementation:** `src/lib/sipCalculator.ts` -> `calculateTrueSipReturns()`.

---

# SECTION B: PLATFORM WALKTHROUGH & UI ARCHITECTURE

---

### 1. Main Fund Analyzer (`/`)
* **Core Function:** Complete diagnostic health checkup for any of India’s 15,000+ mutual fund schemes.
* **Key Components:**
  - `FundHeader.tsx`: Live spot NAV, daily fluctuation percentage, AMC manager metadata, SEBI riskometer badge.
  - `NavChart.tsx`: Historical daily NAV interactive timeline with custom tooltip.
  - `TriLineBenchmarkChart.tsx`: Base-100 normalized growth race comparing **Fund vs. Category Average vs. Nifty 50 TRI**.
  - `RollingReturnsChart.tsx`: Rolling 3Y and 5Y CAGR distributions, analyzing the percentage of times the fund beat 8%, 12%, and 15% hurdle rates.
  - `DrawdownChart.tsx`: Underwater chart plotting peak-to-trough capital contractions and recovery durations.
  - `ReturnsTable.tsx`: Trailing returns across 1M, 3M, 6M, 1Y, 3Y, 5Y, and Inception with peer quartile rankings.
  - `RiskMeasuresTable.tsx`: CAPM risk table featuring the **Institutional Metrics Toggle** for capture ratios and tracking error.
  - `StpOptimizerCard.tsx`: Collapsible dynamic cash-flow deployment engine.
  - `TopHoldingsTable.tsx` & `PortfolioAllocationCharts.tsx`: Equity, debt, cash asset allocation breakdown and top 10 company weights.

---

### 2. SEBI Category Screener (`/screener`)
* **Core Function:** High-speed quantitative discovery engine across 14,400+ schemes.
* **Key Components:**
  - `CategoryHeatmap.tsx`: Multi-timeframe return momentum heatmap across all SEBI categories (Small Cap, Mid Cap, Large Cap, ELSS, Flexi Cap, Liquid, Corporate Bond).
  - `RiskReturnScatterPlot.tsx`: 4-Quadrant visual matrix plotting Volatility vs. 3Y CAGR to identify high-alpha/low-volatility outliers.
  - `ScreenerTable.tsx`: Virtualized data grid with multi-column sorting, AMC filtering, and direct/regular plan toggles.

---

### 3. Multi-Fund Comparison Engine (`/compare`)
* **Core Function:** Simultaneous evaluation of up to 3 mutual funds on an equal footing.
* **Key Components:**
  - `ComparisonChart.tsx`: Normalized Base-100 compounding chart comparing performance across identical historical start dates.
  - `ComparisonTable.tsx`: Matrix comparing expense ratios, Sharpe ratios, Betas, and historical returns with dynamic "Best in Class" badges.

---

### 4. Portfolio Overlap Analyzer (`/overlap`)
* **Core Function:** Solves the portfolio duplication problem by identifying common stocks between any two funds.
* **Key Components:**
  - `OverlapGauge.tsx`: SVG radial percentage gauge with color-coded risk bands ($< 20\%$ High Diversification, $20\text{--}40\%$ Moderate, $> 40\%$ Redundant).
  - `OverlapVenn.tsx`: Shared vs. unique portfolio concentration breakdown.
  - `OverlapTable.tsx`: Granular stock-by-stock common allocation table.

---

### 5. Fixed Income Arbitrage Terminal (`/bond-arbitrage`)
* **Core Function:** Institutional corporate treasury and HNI advisory tool quantifying the fee drag elimination of direct AAA bonds vs. debt mutual funds post-Finance Act 2023.
* **Key Components:**
  - `FundBondComparisonCard.tsx`: Side-by-side comparison of debt fund net yield vs. secondary bond YTM.
  - `MatchedBondsTable.tsx`: SEBI CRA-verified AAA/SOV corporate bonds duration-matched to the debt mutual fund.
  - `RupeeSavingsCalculator.tsx`: Compounded cash flow and interest simulation over 1 to 5-year investment horizons.

---

### 6. UI Engineering Decisions
1. **Progressive Disclosure:** Advanced quantitative concepts (Information Ratio, Capture Ratios, STP Simulator) are hidden behind sleek, full-width action bars. Novice users see a clean overview, while institutional allocators can expand full quantitative depth.
2. **DOM Virtualization (`@tanstack/react-virtual`):** Rendering 15,000+ mutual fund rows in standard HTML causes severe browser memory crashes. Virtualization renders only the ~25 rows currently visible in the user's viewport, maintaining a constant **60 FPS** scroll rate.
3. **Fintech Design System:** Strict dual-mode token pairing using Tailwind CSS (`bg-slate-50 dark:bg-slate-950`, `bg-white dark:bg-slate-900`, `border-slate-200 dark:border-slate-800`). Recharts custom tooltips utilize backdrop blur (`backdrop-blur-md`) with high-contrast text.

---

# SECTION C: TECHNICAL ARCHITECTURE & DATA PIPELINE

---

### 1. Technology Stack
```
+-------------------------------------------------------------------------+
|                              FRONTEND LAYER                             |
|  Next.js 15 (App Router) • React 19 • TypeScript • Tailwind CSS         |
|  Recharts (Data Visualizations) • Lucide React • TanStack Virtual       |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                           QUANTITATIVE ENGINES                          |
|  riskMetrics.ts • stpSimulator.ts • overlapCalculator.ts               |
|  bondArbitrageEngine.ts • sipCalculator.ts • categoryAnalytics.ts       |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                        DATA INGESTION & STORAGE                         |
|  Direct AMFI Master Text Feed Parser • Supabase (PostgreSQL)            |
|  Next.js Edge API Routes (`/api/funds/[id]`, `/api/funds/screener`)     |
+-------------------------------------------------------------------------+
```

---

### 2. The AMFI Data Pipeline & Database Design
* **The Official Source of Truth:**
  AMFI publishes daily Net Asset Values for all Indian mutual funds at `https://www.amfiindia.com/spages/NAVAll.txt`.
* **The Parsing Engine (`src/lib/extractors/amfiParser.ts`):**
  - Parses semicolon-delimited text files containing 15,000+ lines.
  - Extracts: `Scheme Code`, `ISIN Div Payout / Growth`, `ISIN Div Reinvestment`, `Scheme Name`, `Net Asset Value`, `Date`.
  - Normalizes fund category headers (e.g., `Open Ended Schemes (Equity Scheme - Flexi Cap Fund)`).
* **Database Schema (Supabase / PostgreSQL):**
  - Table `funds`: Master scheme metadata (`scheme_code` PK, `scheme_name`, `category`, `fund_house`, `plan_type`).
  - Table `nav_history`: Time-series table (`scheme_code` FK, `nav_date`, `nav`). Indexed on `(scheme_code, nav_date DESC)` for $O(1)$ latest spot lookups and sub-10ms range scans.
* **Resilience & In-Memory Fallback:**
  When external network limits or database maintenance windows occur, the API automatically falls back to an in-memory seed cache for tier-1 benchmark funds (Parag Parikh, Quant, HDFC, Mirae Asset, Nippon India).

---

# SECTION D: TOP 10 INTERVIEW QUESTIONS & MODEL ANSWERS
### *Ready-to-Use Responses for Placement Panels*

#### Q1: "Why did you build an overlap tool? Isn't buying more funds always safer?"
> *"In portfolio management, holding more assets is only beneficial if the correlation between them is low. In India, most large-cap and flexi-cap fund managers draw from the same universe of 75 liquid companies. By calculating the minimum-weight intersection of stock holdings, my platform revealed that many retail investors have a 50%+ portfolio overlap between their funds. They aren't diversifying—they are simply paying double the management fees for the same underlying HDFC Bank and Reliance exposure."*

#### Q2: "How does your fixed income arbitrage tool exploit the Finance Act 2023?"
> *"Section 50AA eliminated the indexation tax advantage for debt funds purchased post-April 2023. Today, both debt mutual funds and secondary corporate bonds are taxed at marginal slab rates upon exit. However, debt funds deduct a 0.35% to 1.15% Total Expense Ratio daily from the NAV. By matching the modified duration of the fund with AAA secondary market corporate bonds from issuers like PFC, REC, and NABARD, an investor can capture up to +75 basis points in net yield spread with zero incremental interest rate risk."*

#### Q3: "What is the difference between Sharpe and Sortino ratios, and when would you use Sortino?"
> *"The Sharpe ratio divides excess return by total standard deviation, which penalizes both upward and downward price movements. The Sortino ratio substitutes total standard deviation with downside deviation, penalizing only returns that fall below a minimum acceptable return or the risk-free rate. In wealth management, Sortino is the preferred metric for assessing asymmetric strategies or aggressive growth funds because it rewards managers who capture upside surges without creating severe portfolio drawdowns."*

#### Q4: "Why can't you use CAGR to calculate returns on a mutual fund SIP?"
> *"CAGR assumes a single lump sum deployed over a static timeframe. In a Systematic Investment Plan (SIP), capital enters in periodic tranches at different prevailing NAVs. Each tranche accumulates units at different rates and compounds over a different duration. To calculate the true annualized internal rate of return, we must solve for the root of the cash-flow polynomial using the Newton-Raphson XIRR method."*

#### Q5: "What is the Information Ratio and what does it tell you about a fund manager?"
> *"The Information Ratio divides a manager's annualized active return (alpha) by the tracking error (standard deviation of active returns). While Alpha tells you how much the manager beat the benchmark by, the Information Ratio tells you if that outperformance was consistent or the result of a single lucky bet. An Information Ratio above 0.50 signifies that the manager consistently generates active alpha per unit of active risk taken."*

#### Q6: "How did you optimize your application to display 15,000+ mutual fund schemes smoothly?"
> *"Rendering 15,000 DOM rows in React causes massive memory overhead and frame drops. I implemented virtualized windowing using `@tanstack/react-virtual`. The engine calculates the user's scroll offset and renders only the ~25 rows currently visible in the viewport. When the user scrolls, the off-screen elements are recycled instantly, maintaining a silky-smooth 60 FPS experience."*

#### Q7: "What is the 'Regret Index' in your Lump Sum vs. STP Optimizer?"
> *"The Regret Index is a behavioral finance metric. When deploying a large lump sum at an all-time high, investors experience severe psychological regret if the market immediately corrects. Our STP engine models the downside mitigation achieved by keeping the majority of capital in a liquid fund earning 7% interest while staggering equity purchases. It quantifies the exact drawdown reduction and dollar-cost average entry price achieved compared to Day-1 lump sum deployment."*

#### Q8: "What are Upside and Downside Capture Ratios, and why do institutional allocators care about them?"
> *"Capture ratios isolate manager performance across different market regimes. Upside Capture measures how much of the index gains the fund retained during positive months, while Downside Capture measures how much of the losses it absorbed during negative months. Institutional allocators seek managers with an asymmetric 'capture ratio spread' (e.g., Upside 110%, Downside 80%) because compounding higher bull market gains while truncating bear market drawdowns creates massive long-term outperformance."*

#### Q9: "Why did you use 6.50% as your risk-free rate?"
> *"In quantitative finance, the risk-free rate must reflect the sovereign yield of the domestic currency in which the investments are denominated. For Indian Rupee assets, the benchmark standard is the Indian 10-Year Government Securities (G-Sec) bond yield, which currently trades around 6.50% to 6.80%. Using the US 10-Year Treasury yield (e.g. 4.0%) for INR assets would produce misleadingly high Sharpe and Alpha values."*

#### Q10: "Explain the architecture of your data ingestion pipeline."
> *"ValueScraper connects directly to the official AMFI master daily NAV feed published every evening. An automated ingestion worker parses the raw text feed, normalizes scheme categories into standardized SEBI classifications, and upserts time-series records into Supabase PostgreSQL. Front-end queries leverage Next.js Edge API routes with optimized database indexes on `(scheme_code, nav_date DESC)` to deliver sub-10ms query responses."*

---

*Document compiled and verified for PGDM / MBA Finance Recruitment & Placement Interviews.*
