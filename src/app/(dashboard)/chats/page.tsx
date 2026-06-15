'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import './chats.css';

// ===== Types =====
interface ChatMessage {
  sender: string;
  text: string;
  initial?: string;
  color?: string;
  time?: string;
}

interface ChatItem {
  id: string;
  type: 'group' | 'dm';
  name: string;
  emoji?: string;
  initial?: string;
  color: string;
  members?: number;
  online?: boolean;
  lastMsg: string;
  time: string;
  unread: number;
  messages: ChatMessage[];
}

// ===== Chat templates =====
const MEETUP_CHAT_TEMPLATES: Record<
  number,
  {
    emoji: string;
    name: string;
    color: string;
    messages: ChatMessage[];
    lastMsg: string;
    time: string;
    unread: number;
  }
> = {
  1: {
    emoji: '\u{1F3BE}',
    name: 'Padel @Kross — 18 Jun',
    color: '#22c55e',
    messages: [
      { sender: 'system', text: 'Today' },
      { sender: 'Andrew J.', initial: 'A', color: '#7A3EF0', text: 'Hey everyone! Excited for padel this Thursday \u{1F3BE}', time: '10:15 AM' },
      { sender: 'Sophia L.', initial: 'S', color: '#10b981', text: 'Same here! First time playing padel. Any tips?', time: '10:22 AM' },
      { sender: 'Marcus T.', initial: 'M', color: '#f97316', text: "Just have fun! It's easier than tennis. The walls are your friend \u{1F604}", time: '11:45 AM' },
      { sender: 'Andrew J.', initial: 'A', color: '#7A3EF0', text: "Who's bringing extra rackets? I have 2 spares", time: '2:30 PM' },
    ],
    lastMsg: "Andrew J.: Who's bringing extra rackets?",
    time: '2:30 PM',
    unread: 2,
  },
  2: {
    emoji: '\u{1F3C3}',
    name: 'Morning Run — 20 Jun',
    color: '#3b82f6',
    messages: [
      { sender: 'system', text: 'Yesterday' },
      { sender: 'Marcus T.', initial: 'M', color: '#f97316', text: 'Morning run this Saturday! Lumpini Park main gate, 6:30 AM sharp', time: '9:00 AM' },
      { sender: 'Dirk B.', initial: 'D', color: '#3b82f6', text: 'What pace are we aiming for?', time: '11:20 AM' },
      { sender: 'Marcus T.', initial: 'M', color: '#f97316', text: "We'll do 5:30-6:00/km. No one gets left behind!", time: '11:25 AM' },
    ],
    lastMsg: 'Dirk B.: What pace are we aiming for?',
    time: '11:20 AM',
    unread: 0,
  },
  3: {
    emoji: '\u{1F9CA}',
    name: 'Ice Bath & Breathwork — 24 Jun',
    color: '#06b6d4',
    messages: [
      { sender: 'system', text: 'Monday' },
      { sender: 'Sophia L.', initial: 'S', color: '#10b981', text: 'Hey team! Quick reminder — our ice bath session is next Tuesday \u{1F9CA}', time: '3:00 PM' },
      { sender: 'Natalie K.', initial: 'N', color: '#ec4899', text: "Can't wait! Never done breathwork before", time: '3:15 PM' },
      { sender: 'Sophia L.', initial: 'S', color: '#10b981', text: 'Bring a thick towel, trust me! And maybe some warm clothes for after', time: '3:20 PM' },
    ],
    lastMsg: 'Sophia L.: Bring a thick towel, trust me!',
    time: 'Yesterday',
    unread: 0,
  },
  4: {
    emoji: '\u{1F37D}️',
    name: 'Founders Dinner — 27 Jun',
    color: '#f59e0b',
    messages: [
      { sender: 'system', text: 'Just now' },
      { sender: 'system', text: 'You joined this meetup group chat' },
    ],
    lastMsg: 'You joined!',
    time: 'Just now',
    unread: 0,
  },
};

const GENERAL_GROUPS: ChatItem[] = [
  {
    id: 'bangkok-general',
    type: 'group',
    name: 'Bangkok Founders',
    emoji: '\u{1F3D9}️',
    color: '#7A3EF0',
    members: 84,
    lastMsg: 'Seth A.: Anyone tried the new co-working at Ari?',
    time: '4:15 PM',
    unread: 5,
    messages: [
      { sender: 'system', text: 'Today' },
      { sender: 'Andrew J.', initial: 'A', color: '#7A3EF0', text: 'Welcome to all the new members this week! \u{1F44B}', time: '9:00 AM' },
      { sender: 'Natalie K.', initial: 'N', color: '#ec4899', text: 'Great to be here! Anyone working on healthtech?', time: '10:30 AM' },
      { sender: 'Dirk B.', initial: 'D', color: '#3b82f6', text: 'I know a few people. Let me connect you!', time: '11:00 AM' },
      { sender: 'Marcus T.', initial: 'M', color: '#f97316', text: 'Looking for a web designer for my e-commerce rebrand. Any recs?', time: '2:45 PM' },
      { sender: 'Seth A.', initial: 'S', color: '#8b5cf6', text: 'Anyone tried the new co-working at Ari? Looks promising', time: '4:15 PM' },
    ],
  },
];

// ===== localStorage helpers =====
function getJoinedMeetups(): Array<{
  id: number;
  emoji: string;
  title: string;
  date: string;
  time: string;
  members: number;
}> {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('solotribe-joined-meetups') || '[]');
  } catch {
    return [];
  }
}

function getDms(): Array<{
  id: string;
  name: string;
  initial: string;
  color: string;
}> {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('solotribe-dms') || '[]');
  } catch {
    return [];
  }
}

function getMsgCount(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('solotribe-msg-count') || '0');
}

function buildChatList(): ChatItem[] {
  const chats: ChatItem[] = [];

  // 1) Meetup group chats from localStorage joined meetups
  const joined = getJoinedMeetups();
  joined.forEach((meetup) => {
    const template = MEETUP_CHAT_TEMPLATES[meetup.id];
    if (template) {
      chats.push({
        id: 'meetup-' + meetup.id,
        type: 'group',
        name: template.name,
        emoji: template.emoji,
        color: template.color,
        members: meetup.members || 4,
        lastMsg: template.lastMsg,
        time: template.time,
        unread: template.unread,
        messages: [...template.messages],
      });
    } else {
      chats.push({
        id: 'meetup-' + meetup.id,
        type: 'group',
        name: meetup.emoji + ' ' + meetup.title,
        emoji: meetup.emoji || '\u{1F4C5}',
        color: '#7A3EF0',
        members: meetup.members || 4,
        lastMsg: 'You joined!',
        time: 'Just now',
        unread: 0,
        messages: [
          { sender: 'system', text: 'Just now' },
          { sender: 'system', text: 'You joined this meetup group chat' },
        ],
      });
    }
  });

  // 2) General groups (always visible)
  chats.push(
    ...GENERAL_GROUPS.map((g) => ({ ...g, messages: [...g.messages] }))
  );

  // 3) DMs from localStorage
  const dms = getDms();
  dms.forEach((dm) => {
    chats.push({
      id: dm.id,
      type: 'dm',
      name: dm.name,
      initial: dm.initial,
      color: dm.color,
      online: false,
      lastMsg: 'Start a conversation...',
      time: 'Just now',
      unread: 0,
      messages: [
        { sender: 'system', text: 'Today' },
        {
          sender: 'me',
          text: 'Hey! Saw your profile — would love to connect \u{1F44B}',
          time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
        },
      ],
    });
  });

  return chats;
}

// ===== Component =====
export default function ChatsPage() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'groups' | 'dms'>('dms');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const msgContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dmCount = 3 - getMsgCount();

  // Build chat list on mount and handle auto-open
  useEffect(() => {
    const chatList = buildChatList();
    setChats(chatList);

    const autoOpenChat = localStorage.getItem('solotribe-open-chat');
    if (autoOpenChat) {
      localStorage.removeItem('solotribe-open-chat');
      const targetChat = chatList.find((c) => c.id === autoOpenChat);
      if (targetChat) {
        setActiveFilter(targetChat.type === 'dm' ? 'dms' : 'groups');
        setActiveChatId(autoOpenChat);
        setMobileShowChat(true);
      }
    }
  }, []);

  // Scroll to bottom when active chat changes or messages update
  useEffect(() => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
    }
  }, [activeChatId, chats]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const openChat = useCallback(
    (chatId: string) => {
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c))
      );
      setActiveChatId(chatId);
      setMobileShowChat(true);
    },
    []
  );

  const handleBack = useCallback(() => {
    setActiveChatId(null);
    setMobileShowChat(false);
  }, []);

  const sendMessage = useCallback(() => {
    const text = inputRef.current?.value.trim();
    if (!text || !activeChatId) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c;
        return {
          ...c,
          messages: [...c.messages, { sender: 'me', text, time: timeStr }],
          lastMsg: text,
          time: timeStr,
        };
      })
    );

    if (inputRef.current) inputRef.current.value = '';
  }, [activeChatId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') sendMessage();
    },
    [sendMessage]
  );

  // Filter chats
  let filtered = chats;
  if (activeFilter === 'groups')
    filtered = chats.filter((c) => c.type === 'group');
  if (activeFilter === 'dms')
    filtered = chats.filter((c) => c.type === 'dm');
  if (searchVal) {
    const sv = searchVal.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(sv) ||
        c.lastMsg.toLowerCase().includes(sv)
    );
  }

  return (
    <div className="chat-layout">
      {/* Chat list panel */}
      <div
        className={`chat-list-panel${mobileShowChat ? ' hidden' : ''}`}
        id="chatListPanel"
      >
        <div className="chat-list-header">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Messages
          </h2>
        </div>
        <div className="chat-dm-banner">
          <div className="chat-dm-banner-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>
              <strong>{dmCount} of 3</strong> new messages left today
            </span>
          </div>
          <div className="chat-dm-banner-row upgrade-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Upgrade to PRO for unlimited DMs</span>
          </div>
        </div>
        <div className="chat-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
        <div className="chat-tabs">
          <button
            className={`chat-tab${activeFilter === 'groups' ? ' active' : ''}`}
            onClick={() => setActiveFilter('groups')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Meetups
          </button>
          <button
            className={`chat-tab${activeFilter === 'dms' ? ' active' : ''}`}
            onClick={() => setActiveFilter('dms')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            DMs
          </button>
        </div>
        <div className="chat-list">
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '2rem 1.25rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
              }}
            >
              {activeFilter === 'dms' ? (
                <>
                  No direct messages yet.
                  <br />
                  {"Say hello from a member's profile!"}
                </>
              ) : (
                'Join a meetup to see its group chat here.'
              )}
            </div>
          ) : (
            filtered.map((chat) => (
              <div
                key={chat.id}
                className={`chat-list-item${chat.id === activeChatId ? ' active' : ''}`}
                onClick={() => openChat(chat.id)}
              >
                {chat.type === 'group' ? (
                  <div
                    className="chat-item-avatar group"
                    style={{ background: chat.color }}
                  >
                    {chat.emoji}
                  </div>
                ) : (
                  <div
                    className="chat-item-avatar"
                    style={{ background: chat.color }}
                  >
                    {chat.initial}
                    {chat.online && <span className="chat-item-online"></span>}
                  </div>
                )}
                <div className="chat-item-content">
                  <div className="chat-item-top">
                    <span className="chat-item-name">
                      {chat.name}
                      {chat.type === 'group' && chat.members && (
                        <span className="chat-item-group-badge">
                          {chat.members}
                        </span>
                      )}
                    </span>
                    <span className="chat-item-time">{chat.time}</span>
                  </div>
                  <div className="chat-item-preview">{chat.lastMsg}</div>
                </div>
                {chat.unread > 0 && (
                  <span className="chat-item-badge">{chat.unread}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat window */}
      <div
        className={`chat-window${!mobileShowChat ? ' hidden' : ''}`}
        id="chatWindow"
      >
        {!activeChat ? (
          <div className="chat-empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <h3>No direct messages yet.</h3>
            <p>
              Say hello to someone from your matches or meetups and your chats
              will show up here.
            </p>
          </div>
        ) : (
          <div className="chat-active" style={{ display: 'flex' }}>
            <div className="chat-active-header">
              <button className="chat-back-btn" onClick={handleBack}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div
                className={`chat-active-avatar${activeChat.type === 'group' ? ' group' : ''}`}
                style={{ background: activeChat.color }}
              >
                {activeChat.type === 'group'
                  ? activeChat.emoji
                  : activeChat.initial}
              </div>
              <div className="chat-active-info">
                <div className="chat-active-name">{activeChat.name}</div>
                <div className="chat-active-status">
                  {activeChat.type === 'group'
                    ? `${activeChat.members} members`
                    : activeChat.online
                      ? 'Online'
                      : 'Last seen recently'}
                </div>
              </div>
              <button className="chat-info-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </button>
            </div>
            <div className="chat-messages" ref={msgContainerRef}>
              {activeChat.messages.map((msg, i) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={i} className="chat-date-divider">
                      <span>{msg.text}</span>
                    </div>
                  );
                }
                if (msg.sender === 'me') {
                  return (
                    <div key={i} className="chat-msg sent">
                      <div>
                        <div className="chat-msg-bubble">{msg.text}</div>
                        <div className="chat-msg-time">{msg.time}</div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={i} className="chat-msg">
                    <div
                      className="chat-msg-avatar"
                      style={{ background: msg.color }}
                    >
                      {msg.initial}
                    </div>
                    <div>
                      {activeChat.type === 'group' && (
                        <div className="chat-msg-sender">{msg.sender}</div>
                      )}
                      <div className="chat-msg-bubble">{msg.text}</div>
                      <div className="chat-msg-time">{msg.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chat-input-area">
              <button className="chat-attach-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <input
                type="text"
                className="chat-input"
                ref={inputRef}
                placeholder="Type a message..."
                onKeyDown={handleKeyDown}
              />
              <button className="chat-send-btn" onClick={sendMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
