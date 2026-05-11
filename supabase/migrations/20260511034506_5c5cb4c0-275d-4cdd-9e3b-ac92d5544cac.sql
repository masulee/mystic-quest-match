
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.auth_provider AS ENUM ('google', 'instagram', 'apple', 'email');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE public.rarity_type AS ENUM ('common', 'rare', 'legendary');
CREATE TYPE public.match_status AS ENUM ('active', 'ended', 'blocked');
CREATE TYPE public.attempt_result AS ENUM ('success', 'failed');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  gender gender_type,
  birthdate DATE,
  age INTEGER,
  provider auth_provider,
  avatar_url TEXT,
  bio TEXT,
  profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ============ LOCATIONS ============
CREATE TABLE public.locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- ============ QUIZZES ============
CREATE TABLE public.quizzes (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.quiz_options (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  trait TEXT NOT NULL,
  response_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;

-- ============ REWARDS ============
CREATE TABLE public.rewards (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  trait TEXT NOT NULL,
  item_name TEXT NOT NULL,
  icon TEXT,
  rarity rarity_type NOT NULL DEFAULT 'common',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- ============ USER PROGRESS ============
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_location_id INTEGER REFERENCES public.locations(id),
  unlocked_locations JSONB NOT NULL DEFAULT '[1]'::jsonb,
  trait_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- ============ COLLECTED ITEMS ============
CREATE TABLE public.collected_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  reward_id INTEGER NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, location_id)
);
ALTER TABLE public.collected_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_collected_items_user ON public.collected_items(user_id);

-- ============ QUIZ ANSWERS ============
CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id INTEGER NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES public.quiz_options(id) ON DELETE CASCADE,
  trait TEXT NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_quiz_answers_user ON public.quiz_answers(user_id);

-- ============ MATCHES ============
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_percentage INTEGER NOT NULL DEFAULT 0,
  dominant_trait TEXT,
  temperature INTEGER NOT NULL DEFAULT 36,
  status match_status NOT NULL DEFAULT 'active',
  matched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (user_a_id <> user_b_id)
);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_matches_user_a ON public.matches(user_a_id);
CREATE INDEX idx_matches_user_b ON public.matches(user_b_id);

-- ============ MATCH ATTEMPTS ============
CREATE TABLE public.match_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  result attempt_result NOT NULL,
  percentage INTEGER,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.match_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_match_attempts_user ON public.match_attempts(user_id);

-- ============ CHAT MESSAGES ============
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_chat_messages_match ON public.chat_messages(match_id, created_at);

-- ============ CHAT WORD BANK ============
CREATE TABLE public.chat_word_bank (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  word TEXT NOT NULL,
  color TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category, word)
);
ALTER TABLE public.chat_word_bank ENABLE ROW LEVEL SECURITY;

-- ============ HELPER: is_match_participant ============
CREATE OR REPLACE FUNCTION public.is_match_participant(_match_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matches
    WHERE id = _match_id AND (user_a_id = _user_id OR user_b_id = _user_id)
  )
$$;

-- ============ HELPER: are_users_matched ============
CREATE OR REPLACE FUNCTION public.are_users_matched(_user_a UUID, _user_b UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matches
    WHERE status = 'active'
      AND ((user_a_id = _user_a AND user_b_id = _user_b)
        OR (user_a_id = _user_b AND user_b_id = _user_a))
  )
$$;

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view matched profiles" ON public.profiles
  FOR SELECT USING (public.are_users_matched(auth.uid(), id));
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- locations / quizzes / quiz_options / rewards / chat_word_bank: public read, admin write
CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage locations" ON public.locations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view quizzes" ON public.quizzes FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage quizzes" ON public.quizzes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view quiz_options" ON public.quiz_options FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage quiz_options" ON public.quiz_options FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view rewards" ON public.rewards FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage rewards" ON public.rewards FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view word bank" ON public.chat_word_bank FOR SELECT USING (active = TRUE);
CREATE POLICY "Admins manage word bank" ON public.chat_word_bank FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- user_progress
CREATE POLICY "Users manage own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- collected_items
CREATE POLICY "Users manage own items" ON public.collected_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- quiz_answers
CREATE POLICY "Users manage own answers" ON public.quiz_answers
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- matches
CREATE POLICY "Users view own matches" ON public.matches
  FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY "Users update own matches" ON public.matches
  FOR UPDATE USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- match_attempts
CREATE POLICY "Users manage own attempts" ON public.match_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- chat_messages
CREATE POLICY "Participants view messages" ON public.chat_messages
  FOR SELECT USING (public.is_match_participant(match_id, auth.uid()));
CREATE POLICY "Participants send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND public.is_match_participant(match_id, auth.uid())
  );
CREATE POLICY "Senders update own messages" ON public.chat_messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- ============ TRIGGERS ============

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_user_progress_updated BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url, provider)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'email'::auth_provider
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.user_progress (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
