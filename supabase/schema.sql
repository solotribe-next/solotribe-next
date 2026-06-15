-- ===== SoloTribe Database Schema =====

-- 1. Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  city TEXT DEFAULT 'Bangkok',
  stage TEXT DEFAULT 'Early Stage' CHECK (stage IN ('Active Founder', 'Early Stage', 'Supporter')),
  industry TEXT DEFAULT '',
  working TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  activities TEXT[] DEFAULT '{}',
  color TEXT DEFAULT '#7A3EF0',
  is_pro BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Meetups
CREATE TABLE public.meetups (
  id SERIAL PRIMARY KEY,
  emoji TEXT DEFAULT '📅',
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  date_badge TEXT NOT NULL,
  time TEXT NOT NULL,
  time_note TEXT DEFAULT '',
  time_badge TEXT DEFAULT '',
  spots INTEGER NOT NULL,
  total_spots INTEGER NOT NULL,
  price NUMERIC(10,2) DEFAULT 0,
  location TEXT NOT NULL,
  address TEXT DEFAULT '',
  hosted_by TEXT DEFAULT 'SoloTribe',
  image_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  description_short TEXT DEFAULT '',
  expect TEXT[] DEFAULT '{}',
  "group" TEXT DEFAULT 'upcoming' CHECK ("group" IN ('upcoming', 'earlier')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Meetup members (who joined which meetup)
CREATE TABLE public.meetup_members (
  id SERIAL PRIMARY KEY,
  meetup_id INTEGER REFERENCES public.meetups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meetup_id, user_id)
);

-- 4. Chat rooms (group chats for meetups + general groups)
CREATE TABLE public.chat_rooms (
  id SERIAL PRIMARY KEY,
  meetup_id INTEGER REFERENCES public.meetups(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'group' CHECK (type IN ('group', 'general')),
  emoji TEXT DEFAULT '💬',
  color TEXT DEFAULT '#7A3EF0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DM threads (direct messages between two users)
CREATE TABLE public.dm_threads (
  id SERIAL PRIMARY KEY,
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- 6. Messages (for both group chats and DMs)
CREATE TABLE public.messages (
  id SERIAL PRIMARY KEY,
  chat_room_id INTEGER REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  dm_thread_id INTEGER REFERENCES public.dm_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (chat_room_id IS NOT NULL AND dm_thread_id IS NULL) OR
    (chat_room_id IS NULL AND dm_thread_id IS NOT NULL)
  )
);

-- ===== Row Level Security =====

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetup_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dm_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, users can update own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Meetups: anyone can read, authenticated can create
CREATE POLICY "Meetups are viewable by everyone" ON public.meetups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create meetups" ON public.meetups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Meetup members: anyone can read, users manage own
CREATE POLICY "Meetup members viewable by everyone" ON public.meetup_members FOR SELECT USING (true);
CREATE POLICY "Users can join meetups" ON public.meetup_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave meetups" ON public.meetup_members FOR DELETE USING (auth.uid() = user_id);

-- Chat rooms: anyone can read
CREATE POLICY "Chat rooms viewable by everyone" ON public.chat_rooms FOR SELECT USING (true);

-- DM threads: only participants can see
CREATE POLICY "Users can see own DMs" ON public.dm_threads FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create DMs" ON public.dm_threads FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages: readable by chat participants
CREATE POLICY "Messages viewable by everyone in room" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ===== Auto-create profile on signup =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== Indexes =====
CREATE INDEX idx_meetup_members_meetup ON public.meetup_members(meetup_id);
CREATE INDEX idx_meetup_members_user ON public.meetup_members(user_id);
CREATE INDEX idx_messages_chat_room ON public.messages(chat_room_id);
CREATE INDEX idx_messages_dm_thread ON public.messages(dm_thread_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);

-- ===== Seed Data: Meetups =====
INSERT INTO public.meetups (emoji, title, date, date_badge, time, time_note, time_badge, spots, total_spots, price, location, address, hosted_by, image_url, description, description_short, expect, "group") VALUES
('🎾', 'Padel @Kross On Nut', 'Thursday, 18 June 2026', '18 Jun', '18:00 - 19:30', 'Arrive 10 minutes early', 'Evening', 4, 4, 10, 'Kross Padel On Nut', '89 Soi Chinnamat, Khwaeng', 'SoloTribe (Self organized)', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop', 'Join a small group of founders for a relaxed padel session built around movement, conversation, and friendly competition.', 'Join a small group of founders for a relaxed padel session built around movement, conversation, and friendly competition...', ARRAY['A relaxed padel session with a small group of founders', 'Friendly games, no pressure to be highly competitive', 'Time to connect before, during, and after the session'], 'upcoming'),
('🏃', 'Morning Run @Lumpini Park', 'Saturday, 20 June 2026', '20 Jun', '06:30 - 07:30', 'Meet at main entrance gate', 'Morning', 8, 12, 0, 'Lumpini Park Main Gate', 'Rama IV Rd, Lumphini', 'Marcus T.', 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=400&fit=crop', 'Start your weekend right with a casual morning run through Lumpini Park. All paces welcome.', 'Start your weekend right with a casual morning run through Lumpini Park...', ARRAY['A casual group run', 'All fitness levels welcome', 'Post-run coffee and conversation'], 'upcoming'),
('🧊', 'Ice Bath & Breathwork @The Well', 'Tuesday, 24 June 2026', '24 Jun', '17:00 - 18:30', 'Bring a towel and change of clothes', 'Afternoon', 2, 6, 15, 'The Well Bangkok', 'Sukhumvit 39, Khlong Toei', 'Sophia L.', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop', 'Push your comfort zone with a guided breathwork and ice bath session.', 'Push your comfort zone with a guided breathwork and ice bath session...', ARRAY['Guided breathwork session', 'Ice bath experience with full coaching', 'Deep conversations over herbal tea after'], 'upcoming'),
('🍽️', 'Founders Dinner @Sala Rattanakosin', 'Friday, 27 June 2026', '27 Jun', '19:00 - 21:30', 'Smart casual dress code', 'Evening', 6, 10, 25, 'Sala Rattanakosin', '39 Maharat Rd', 'SoloTribe (Self organized)', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop', 'An intimate dinner with a curated group of founders.', 'An intimate dinner with a curated group of founders...', ARRAY['Curated group of 10 founders max', 'Multi-course Thai dinner with river views', 'A no-pitch, no-sell environment'], 'upcoming');

-- Seed: General chat room (Bangkok Founders)
INSERT INTO public.chat_rooms (name, type, emoji, color) VALUES
('Bangkok Founders', 'general', '🏙️', '#7A3EF0');
