-- ========================================================
-- SCHEMA SQL POUR IZIANALYTICS (SUPABASE POSTGRESQL)
-- Copier-coller ce script directement dans l'éditeur SQL de Supabase
-- ========================================================

-- 1. Table des profils utilisateurs (synchronisée avec auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    currency TEXT DEFAULT 'XOF',
    plan TEXT DEFAULT 'free', -- 'free', 'pro_monthly', 'pro_annual'
    subscription_status TEXT DEFAULT 'trial',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Table des sites Web / Projets à suivre
CREATE TABLE IF NOT EXISTS public.websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    tracking_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs gèrent uniquement leurs propres sites"
ON public.websites FOR ALL USING (auth.uid() = user_id);

-- 3. Table des visites (Pageviews) ultra-légère
CREATE TABLE IF NOT EXISTS public.pageviews (
    id BIGSERIAL PRIMARY KEY,
    website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    path TEXT NOT NULL DEFAULT '/',
    referrer TEXT DEFAULT 'direct',
    source TEXT DEFAULT 'direct', -- 'tiktok', 'instagram', 'whatsapp', 'google', 'direct'
    country TEXT DEFAULT 'UNKNOWN',
    device TEXT DEFAULT 'mobile', -- 'mobile', 'desktop', 'tablet'
    browser TEXT DEFAULT 'other',
    session_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour des requêtes ultra-rapides sur le dashboard
CREATE INDEX IF NOT EXISTS idx_pageviews_website_created ON public.pageviews (website_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_source ON public.pageviews (website_id, source);

-- Activer RLS
ALTER TABLE public.pageviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les propriétaires de sites peuvent lire les stats de leurs sites"
ON public.pageviews FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.websites WHERE id = pageviews.website_id AND user_id = auth.uid())
);

-- 4. Table des conversions et paiements trackés
CREATE TABLE IF NOT EXISTS public.conversions (
    id BIGSERIAL PRIMARY KEY,
    website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL, -- 'checkout_click', 'payment_success'
    amount NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'XOF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversions_website_created ON public.conversions (website_id, created_at DESC);

ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les propriétaires peuvent lire leurs conversions"
ON public.conversions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.websites WHERE id = conversions.website_id AND user_id = auth.uid())
);
