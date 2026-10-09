-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Watchlists
CREATE TABLE public.watchlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Watchlist items
CREATE TABLE public.watchlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  watchlist_id UUID REFERENCES public.watchlists(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('account', 'asset')),
  target TEXT NOT NULL,
  label TEXT,
  metadata JSONB DEFAULT '{}' NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(watchlist_id, target)
);

-- Alert preferences
CREATE TABLE public.alert_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  watchlist_item_id UUID REFERENCES public.watchlist_items(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('balance_change', 'new_transaction', 'price_threshold')),
  config JSONB DEFAULT '{}' NOT NULL,
  enabled BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Saved queries (chat history)
CREATE TABLE public.saved_queries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sources JSONB DEFAULT '[]' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX idx_watchlist_items_watchlist_id ON public.watchlist_items(watchlist_id);
CREATE INDEX idx_watchlist_items_target ON public.watchlist_items(target);
CREATE INDEX idx_alert_preferences_user_id ON public.alert_preferences(user_id);
CREATE INDEX idx_saved_queries_user_id ON public.saved_queries(user_id);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own watchlists" ON public.watchlists
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can manage own watchlists" ON public.watchlists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view watchlist items" ON public.watchlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.watchlists
      WHERE watchlists.id = watchlist_items.watchlist_id
      AND (watchlists.user_id = auth.uid() OR watchlists.is_public = true)
    )
  );

CREATE POLICY "Users can manage own watchlist items" ON public.watchlist_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.watchlists
      WHERE watchlists.id = watchlist_items.watchlist_id
      AND watchlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own alerts" ON public.alert_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own queries" ON public.saved_queries
  FOR ALL USING (auth.uid() = user_id);
