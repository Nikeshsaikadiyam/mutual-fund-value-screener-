-- ==============================================================================
-- ValueScraper: Production Mutual Fund PostgreSQL Schema (Supabase)
-- ==============================================================================

-- 1. Table: funds (Master Registry of all Mutual Fund schemes)
CREATE TABLE IF NOT EXISTS public.funds (
    scheme_code VARCHAR(20) PRIMARY KEY,
    scheme_name TEXT NOT NULL,
    category TEXT NOT NULL,
    amc_name TEXT NOT NULL,
    plan_type VARCHAR(20) DEFAULT 'Direct',
    option_type VARCHAR(20) DEFAULT 'Growth',
    isin_growth VARCHAR(30),
    isin_div_reinvestment VARCHAR(30),
    rating INTEGER DEFAULT 4 CHECK (rating >= 1 AND rating <= 5),
    expense_ratio NUMERIC(5, 2) DEFAULT 0.65,
    riskometer VARCHAR(30) DEFAULT 'Very High',
    benchmark TEXT DEFAULT 'NIFTY 500 TRI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: nav_history (Daily Historical Net Asset Values)
CREATE TABLE IF NOT EXISTS public.nav_history (
    id BIGSERIAL PRIMARY KEY,
    scheme_code VARCHAR(20) NOT NULL REFERENCES public.funds(scheme_code) ON DELETE CASCADE,
    nav_date DATE NOT NULL,
    nav_price NUMERIC(12, 4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_scheme_nav_date UNIQUE (scheme_code, nav_date)
);

-- 3. Table: risk_metrics (Computed Quantitative & Modern Portfolio Theory Ratios)
CREATE TABLE IF NOT EXISTS public.risk_metrics (
    scheme_code VARCHAR(20) PRIMARY KEY REFERENCES public.funds(scheme_code) ON DELETE CASCADE,
    standard_deviation NUMERIC(6, 2) NOT NULL,
    beta NUMERIC(6, 2) NOT NULL,
    sharpe_ratio NUMERIC(6, 2) NOT NULL,
    sortino_ratio NUMERIC(6, 2) NOT NULL,
    alpha NUMERIC(6, 2) NOT NULL,
    risk_free_rate NUMERIC(5, 2) DEFAULT 6.50 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Optimized Indexes for High-Speed Queries & Autocomplete
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_funds_category ON public.funds(category);
CREATE INDEX IF NOT EXISTS idx_funds_amc_name ON public.funds(amc_name);
CREATE INDEX IF NOT EXISTS idx_funds_scheme_name_trgm ON public.funds USING gin(to_tsvector('english', scheme_name));

CREATE INDEX IF NOT EXISTS idx_nav_history_scheme_date ON public.nav_history(scheme_code, nav_date DESC);
CREATE INDEX IF NOT EXISTS idx_nav_history_date ON public.nav_history(nav_date DESC);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_metrics ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all mutual fund data
CREATE POLICY "Public Read Access on Funds" ON public.funds FOR SELECT USING (true);
CREATE POLICY "Public Read Access on Nav History" ON public.nav_history FOR SELECT USING (true);
CREATE POLICY "Public Read Access on Risk Metrics" ON public.risk_metrics FOR SELECT USING (true);

-- Allow service role full management access
CREATE POLICY "Service Role Full Access on Funds" ON public.funds FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access on Nav History" ON public.nav_history FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access on Risk Metrics" ON public.risk_metrics FOR ALL USING (auth.role() = 'service_role');
