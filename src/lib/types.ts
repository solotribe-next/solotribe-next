export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      meetups: {
        Row: Meetup
        Insert: Omit<Meetup, 'id' | 'created_at'>
        Update: Partial<Omit<Meetup, 'id'>>
      }
      meetup_members: {
        Row: MeetupMember
        Insert: Omit<MeetupMember, 'id' | 'joined_at'>
        Update: Partial<MeetupMember>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: Partial<Omit<Message, 'id'>>
      }
      chat_rooms: {
        Row: ChatRoom
        Insert: Omit<ChatRoom, 'id' | 'created_at'>
        Update: Partial<Omit<ChatRoom, 'id'>>
      }
      dm_threads: {
        Row: DmThread
        Insert: Omit<DmThread, 'id' | 'created_at'>
        Update: Partial<Omit<DmThread, 'id'>>
      }
    }
  }
}

export interface Profile {
  id: string
  email: string
  name: string
  age: number | null
  city: string
  stage: 'Active Founder' | 'Early Stage' | 'Supporter'
  industry: string
  working: string
  skills: string[]
  activities: string[]
  color: string
  is_pro: boolean
  avatar_url: string | null
  created_at: string
}

export interface Meetup {
  id: number
  emoji: string
  title: string
  date: string
  date_badge: string
  time: string
  time_note: string
  time_badge: string
  spots: number
  total_spots: number
  price: number
  location: string
  address: string
  hosted_by: string
  image_url: string
  description: string
  description_short: string
  expect: string[]
  group: 'upcoming' | 'earlier'
  created_at: string
}

export interface MeetupMember {
  id: number
  meetup_id: number
  user_id: string
  joined_at: string
}

export interface ChatRoom {
  id: number
  meetup_id: number | null
  name: string
  type: 'group' | 'general'
  emoji: string
  color: string
  created_at: string
}

export interface DmThread {
  id: number
  user1_id: string
  user2_id: string
  created_at: string
}

export interface Message {
  id: number
  chat_room_id: number | null
  dm_thread_id: number | null
  sender_id: string
  sender_name: string
  text: string
  created_at: string
}

// Frontend-only types
export interface MemberCard {
  name: string
  age: number
  city: string
  stage: string
  industry: string
  working: string
  skills: string[]
  activities: string[]
  color: string
  is_pro: boolean
}
