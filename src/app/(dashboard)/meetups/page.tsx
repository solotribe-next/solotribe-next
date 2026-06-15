'use client';

import { useState, useEffect, useCallback } from 'react';
import UpgradeModal from '@/components/UpgradeModal';
import './meetups.css';

// ===== Types =====
interface Attendee {
  initial: string;
  color: string;
}

interface EventData {
  id: number;
  emoji: string;
  title: string;
  date: string;
  dateBadge: string;
  time: string;
  timeNote: string;
  timeBadge: string;
  spots: number;
  totalSpots: number;
  price: number;
  location: string;
  address: string;
  hostedBy: string;
  image: string;
  desc: string;
  descShort: string;
  expect: string[];
  attending: Attendee[];
  group: 'upcoming' | 'earlier';
}

// ===== Event Data =====
const INITIAL_EVENTS: EventData[] = [
  {
    id: 1,
    emoji: '\u{1F3BE}',
    title: 'Padel @Kross On Nut',
    date: 'Thursday, 18 June 2026',
    dateBadge: '18 Jun',
    time: '18:00 - 19:30',
    timeNote: 'Arrive 10 minutes early',
    timeBadge: 'Evening',
    spots: 4,
    totalSpots: 4,
    price: 10,
    location: 'Kross Padel On Nut',
    address: '89 Soi Chinnamat, Khwaeng',
    hostedBy: 'SoloTribe (Self organized)',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop',
    desc: 'Join a small group of founders for a relaxed padel session built around movement, conversation, and friendly competition. This meetup is a simple way to get out of your normal work environment, move your body, and connect with other entrepreneurs in a more natural setting. No need to be an expert, the goal is to play, have fun, and meet other founders through a shared experience that feels more energising than a typical networking event.',
    descShort: 'Join a small group of founders for a relaxed padel session built around movement, conversation, and friendly competition. This meetup is a simple way to get out of your normal work environment, move your body, and connect with other entrepreneurs in a more natural setting. No need to be an expert, the go...',
    expect: [
      'A relaxed padel session with a small group of founders',
      'Friendly games, no pressure to be highly competitive',
      'Time to connect before, during, and after the session',
      'A fun way to move your body and reset after work',
      'A natural environment to meet other entrepreneurs without the awkward networking feel',
    ],
    attending: [],
    group: 'upcoming',
  },
  {
    id: 2,
    emoji: '\u{1F3C3}',
    title: 'Morning Run @Lumpini Park',
    date: 'Saturday, 20 June 2026',
    dateBadge: '20 Jun',
    time: '06:30 - 07:30',
    timeNote: 'Meet at main entrance gate',
    timeBadge: 'Morning',
    spots: 8,
    totalSpots: 12,
    price: 0,
    location: 'Lumpini Park Main Gate',
    address: 'Rama IV Rd, Lumphini',
    hostedBy: 'Marcus T.',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=400&fit=crop',
    desc: 'Start your weekend right with a casual morning run through Lumpini Park. All paces welcome — whether you run 3K or 10K, we stick together for the warm-up and cool-down. Great way to meet active founders who take their health seriously. Coffee after at a nearby cafe.',
    descShort: 'Start your weekend right with a casual morning run through Lumpini Park. All paces welcome — whether you run 3K or 10K, we stick together for the warm-up and cool-down. Great way to meet active founders who take their health...',
    expect: [
      "A casual group run through one of Bangkok's best parks",
      'All fitness levels welcome',
      'Warm-up and cool-down together as a group',
      'Post-run coffee and conversation',
      'Connect with health-conscious founders',
    ],
    attending: [
      { initial: 'A', color: '#7A3EF0' },
      { initial: 'D', color: '#3b82f6' },
      { initial: 'S', color: '#10b981' },
      { initial: 'N', color: '#ec4899' },
    ],
    group: 'upcoming',
  },
  {
    id: 3,
    emoji: '\u{1F9CA}',
    title: 'Ice Bath & Breathwork @The Well',
    date: 'Tuesday, 24 June 2026',
    dateBadge: '24 Jun',
    time: '17:00 - 18:30',
    timeNote: 'Bring a towel and change of clothes',
    timeBadge: 'Afternoon',
    spots: 2,
    totalSpots: 6,
    price: 15,
    location: 'The Well Bangkok',
    address: 'Sukhumvit 39, Khlong Toei',
    hostedBy: 'Sophia L.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop',
    desc: 'Push your comfort zone with a guided breathwork and ice bath session. Perfect for founders who want to build mental resilience and meet like-minded people who challenge themselves. Led by a certified breathwork instructor. No experience needed.',
    descShort: 'Push your comfort zone with a guided breathwork and ice bath session. Perfect for founders who want to build mental resilience and meet like-minded people who challenge themselves...',
    expect: [
      'Guided breathwork session (Wim Hof method)',
      'Ice bath experience with full coaching',
      'A safe, supportive group environment',
      'Build mental toughness and stress resilience',
      'Deep conversations over herbal tea after the session',
    ],
    attending: [
      { initial: 'M', color: '#f97316' },
      { initial: 'L', color: '#06b6d4' },
      { initial: 'K', color: '#ef4444' },
      { initial: 'J', color: '#8b5cf6' },
    ],
    group: 'upcoming',
  },
  {
    id: 4,
    emoji: '\u{1F37D}️',
    title: 'Founders Dinner @Sala Rattanakosin',
    date: 'Friday, 27 June 2026',
    dateBadge: '27 Jun',
    time: '19:00 - 21:30',
    timeNote: 'Smart casual dress code',
    timeBadge: 'Evening',
    spots: 6,
    totalSpots: 10,
    price: 25,
    location: 'Sala Rattanakosin',
    address: '39 Maharat Rd, Phra Borom Maha Ratchawang',
    hostedBy: 'SoloTribe (Self organized)',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    desc: 'An intimate dinner with a curated group of founders. Great food, great views of Wat Arun, and meaningful conversations about building businesses in Southeast Asia. Expect real talk, no pitching, just genuine connection over an incredible meal.',
    descShort: 'An intimate dinner with a curated group of founders. Great food, great views of Wat Arun, and meaningful conversations about building businesses in Southeast Asia...',
    expect: [
      'Curated group of 10 founders max',
      'Multi-course Thai dinner with river views',
      'Structured conversation starters — no awkward small talk',
      'A no-pitch, no-sell environment',
      'Leave with genuine founder friendships',
    ],
    attending: [
      { initial: 'W', color: '#14b8a6' },
      { initial: 'R', color: '#f43f5e' },
    ],
    group: 'upcoming',
  },
  {
    id: 5,
    emoji: '\u{1F3D0}',
    title: 'Beach Volleyball @Bangsaen',
    date: 'Sunday, 1 June 2026',
    dateBadge: '1 Jun',
    time: '08:00 - 10:00',
    timeNote: '',
    timeBadge: 'Morning',
    spots: 0,
    totalSpots: 8,
    price: 5,
    location: 'Bangsaen Beach',
    address: 'Bangsaen, Chonburi',
    hostedBy: 'Andrew J.',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=400&fit=crop',
    desc: 'Beach volleyball and networking by the sea.',
    descShort: 'Beach volleyball and networking by the sea.',
    expect: ['Fun beach games', 'Relaxed atmosphere', 'Team-based activities'],
    attending: [
      { initial: 'A', color: '#7A3EF0' },
      { initial: 'D', color: '#3b82f6' },
      { initial: 'S', color: '#10b981' },
      { initial: 'M', color: '#f97316' },
      { initial: 'N', color: '#ec4899' },
      { initial: 'K', color: '#ef4444' },
      { initial: 'J', color: '#8b5cf6' },
      { initial: 'L', color: '#06b6d4' },
    ],
    group: 'earlier',
  },
  {
    id: 6,
    emoji: '☕',
    title: 'Co-working @ Hubba-TO',
    date: 'Wednesday, 4 June 2026',
    dateBadge: '4 Jun',
    time: '10:00 - 16:00',
    timeNote: '',
    timeBadge: 'All Day',
    spots: 0,
    totalSpots: 15,
    price: 0,
    location: 'Hubba-TO Coworking',
    address: 'Ekkamai Soi 4',
    hostedBy: 'SoloTribe (Self organized)',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
    desc: 'A full day of focused co-working with fellow founders.',
    descShort: 'A full day of focused co-working with fellow founders.',
    expect: ['Quiet focus time', 'Lunch together', 'Afternoon check-in'],
    attending: [
      { initial: 'W', color: '#14b8a6' },
      { initial: 'A', color: '#7A3EF0' },
      { initial: 'M', color: '#f97316' },
      { initial: 'S', color: '#10b981' },
    ],
    group: 'earlier',
  },
  {
    id: 7,
    emoji: '\u{1F9D8}',
    title: 'Yoga & Meditation @Thonglor',
    date: 'Saturday, 7 June 2026',
    dateBadge: '7 Jun',
    time: '07:00 - 08:30',
    timeNote: '',
    timeBadge: 'Morning',
    spots: 0,
    totalSpots: 10,
    price: 8,
    location: 'Yoga Inc.',
    address: 'Thonglor Soi 13',
    hostedBy: 'Natalie K.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop',
    desc: 'Morning yoga flow followed by guided meditation.',
    descShort: 'Morning yoga flow followed by guided meditation.',
    expect: ['Guided yoga session', 'Meditation practice', 'Healthy smoothies after'],
    attending: [
      { initial: 'N', color: '#ec4899' },
      { initial: 'S', color: '#10b981' },
      { initial: 'L', color: '#06b6d4' },
    ],
    group: 'earlier',
  },
];

// ===== localStorage helpers =====
function getJoinedMeetups(): Array<{ id: number; emoji: string; title: string; date: string; time: string; members: number }> {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('solotribe-joined-meetups') || '[]');
  } catch {
    return [];
  }
}

function saveJoinedMeetup(event: EventData) {
  const joined = getJoinedMeetups();
  if (!joined.find((j) => j.id === event.id)) {
    joined.push({
      id: event.id,
      emoji: event.emoji,
      title: event.title,
      date: event.date,
      time: event.time,
      members: event.attending.length,
    });
    localStorage.setItem('solotribe-joined-meetups', JSON.stringify(joined));
  }
}

function removeJoinedMeetup(eventId: number) {
  const joined = getJoinedMeetups().filter((j) => j.id !== eventId);
  localStorage.setItem('solotribe-joined-meetups', JSON.stringify(joined));
}

// ===== Component =====
export default function MeetupsPage() {
  const [events, setEvents] = useState<EventData[]>(() =>
    INITIAL_EVENTS.map((e) => ({ ...e, attending: [...e.attending] }))
  );
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set());
  const [activeMonth, setActiveMonth] = useState('June');
  const [earlierOpen, setEarlierOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<EventData | null>(null);
  const [calendarClicked, setCalendarClicked] = useState(false);

  // Restore joined state from localStorage on mount
  useEffect(() => {
    const joined = getJoinedMeetups();
    const ids = new Set(joined.map((j) => j.id));
    setJoinedIds(ids);
  }, []);

  const handleJoin = useCallback(
    (eventId: number) => {
      if (joinedIds.has(eventId)) return;

      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e;
          const updated = {
            ...e,
            attending: [...e.attending, { initial: 'W', color: '#14b8a6' }],
            spots: Math.max(0, e.spots - 1),
          };
          saveJoinedMeetup(updated);
          return updated;
        })
      );
      setJoinedIds((prev) => new Set(prev).add(eventId));
    },
    [joinedIds]
  );

  const handleLeave = useCallback((eventId: number) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          attending: e.attending.filter(
            (a) => !(a.initial === 'W' && a.color === '#14b8a6')
          ),
          spots: Math.min(e.totalSpots, e.spots + 1),
        };
      })
    );
    setJoinedIds((prev) => {
      const next = new Set(prev);
      next.delete(eventId);
      return next;
    });
    removeJoinedMeetup(eventId);
  }, []);

  const openDetail = useCallback(
    (eventId: number) => {
      const ev = events.find((e) => e.id === eventId);
      if (ev) {
        setDetailEvent(ev);
        setCalendarClicked(false);
      }
    },
    [events]
  );

  const closeDetail = useCallback(() => {
    setDetailEvent(null);
  }, []);

  const upcoming = events.filter((e) => e.group === 'upcoming');
  const earlier = events.filter((e) => e.group === 'earlier');

  // Group upcoming by date
  const grouped: Record<string, EventData[]> = {};
  upcoming.forEach((e) => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  return (
    <>
      {/* City tabs */}
      <div className="city-tabs">
        <button className="city-tab" onClick={() => setUpgradeOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Go PRO
        </button>
        <button className="city-tab active">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          Bangkok <span className="city-count">128</span>
        </button>
        <button className="city-tab">
          Chiang Mai <span className="city-count">32</span>
        </button>
        <button className="city-tab">
          Phuket <span className="city-count">18</span>
        </button>
        <button className="city-tab">
          Bali <span className="city-count">45</span>
        </button>
        <button className="city-tab">
          Ho Chi Minh <span className="city-count">27</span>
        </button>
      </div>

      {/* Meetups header */}
      <div className="meetups-header">
        <div>
          <h1 className="meetups-title">Meetups</h1>
          <p className="meetups-subtitle">
            Show up, move, and meet founders in Bangkok
          </p>
        </div>
        <button className="create-btn" onClick={() => setUpgradeOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Create
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      {/* Month tabs */}
      <div className="month-tabs">
        {['June', 'July', 'August'].map((month) => (
          <button
            key={month}
            className={`month-tab${activeMonth === month ? ' active' : ''}`}
            onClick={() => setActiveMonth(month)}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Earlier this month */}
      <div className={`earlier-section${earlierOpen ? ' open' : ''}`}>
        <button
          className="earlier-toggle"
          onClick={() => setEarlierOpen(!earlierOpen)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          Earlier this month{' '}
          <span className="earlier-count">({earlier.length} events)</span>
        </button>
        {earlierOpen && (
          <div className="earlier-events">
            {earlier.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isJoined={joinedIds.has(event.id)}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onOpenDetail={openDetail}
              />
            ))}
          </div>
        )}
      </div>

      {/* Events list */}
      <div className="events-list">
        {Object.entries(grouped).map(([date, dateEvents]) => (
          <div className="event-date-group" key={date}>
            <div className="event-date-header">
              <div className="event-date-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {date}
              </div>
              <span className="event-date-badge">{dateEvents[0].dateBadge}</span>
            </div>
            {dateEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isJoined={joinedIds.has(event.id)}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onOpenDetail={openDetail}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Event Detail Modal */}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={closeDetail}
          calendarClicked={calendarClicked}
          onCalendarClick={() => setCalendarClicked(true)}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </>
  );
}

// ===== EventCard Component =====
function EventCard({
  event,
  isJoined,
  onJoin,
  onLeave,
  onOpenDetail,
}: {
  event: EventData;
  isJoined: boolean;
  onJoin: (id: number) => void;
  onLeave: (id: number) => void;
  onOpenDetail: (id: number) => void;
}) {
  const spotsClass =
    event.spots === 0 ? 'full' : event.spots <= 2 ? 'limited' : 'available';
  const spotsText = event.spots === 0 ? 'Full' : `${event.spots} spots left`;
  const isPast = event.group === 'earlier';

  return (
    <div className="event-card" data-event-id={event.id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="event-card-img"
        src={event.image}
        alt={event.title}
        loading="lazy"
      />
      <div className="event-card-body">
        <div className="event-card-top">
          <div className="event-card-title">
            {event.emoji} {event.title}
          </div>
          <span className="event-time-badge">{event.timeBadge}</span>
        </div>
        <div className="event-meta">
          <span className="event-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {event.time}
          </span>
          <span className="event-meta-item">
            <span className={`spots-dot ${spotsClass}`}></span>
            {spotsText}
          </span>
        </div>
        <button
          className="event-details-toggle"
          onClick={() => onOpenDetail(event.id)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          View meetup details
        </button>
        <p className="event-desc">{event.descShort}</p>
        <button
          className="event-read-more"
          onClick={() => onOpenDetail(event.id)}
        >
          read more
        </button>
        <div className="event-attending">
          <div className="event-attending-label">Members attending:</div>
          <div className="event-attending-avatars">
            {event.attending.length > 0 ? (
              event.attending.map((a, i) => (
                <div
                  key={i}
                  className="event-attending-avatar"
                  style={{ background: a.color }}
                >
                  {a.initial}
                </div>
              ))
            ) : (
              <span className="event-attending-empty">
                Be the first to join. Limited spots available {'\u{1F525}'}
              </span>
            )}
          </div>
        </div>
        <div className="event-actions">
          {isPast ? (
            <button
              className="event-join-btn"
              disabled
              style={{ opacity: 0.5, cursor: 'default' }}
            >
              Event Ended
            </button>
          ) : (
            <>
              <button
                className={`event-join-btn${isJoined ? ' joined' : ''}`}
                onClick={() => onJoin(event.id)}
              >
                {isJoined ? 'Joined ✓' : 'Join Meetup'}
              </button>
              <button
                className={`event-leave-btn${isJoined ? ' visible' : ''}`}
                onClick={() => onLeave(event.id)}
              >
                Leave
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== EventDetailModal Component =====
function EventDetailModal({
  event,
  onClose,
  calendarClicked,
  onCalendarClick,
}: {
  event: EventData;
  onClose: () => void;
  calendarClicked: boolean;
  onCalendarClick: () => void;
}) {
  const isPast = event.group === 'earlier';
  const spotsUsed = event.totalSpots - event.spots;
  const fillPct = (spotsUsed / event.totalSpots) * 100;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay open" onClick={handleBackdrop}>
      <div className="modal-card event-detail-modal">
        <button className="modal-close" onClick={onClose}>
          {'✕'}
        </button>
        <div className="event-detail-content">
          <div className="event-detail-title">
            {event.emoji} {event.title}
          </div>
          <div className="event-detail-meta">
            <div className="event-detail-meta-item">
              {'\u{1F4C5}'} {event.date}
            </div>
            <div className="event-detail-meta-item">
              {'⏰'} {event.time}
              {event.timeNote ? ` (${event.timeNote})` : ''}
            </div>
          </div>

          <div className="event-detail-section">
            <h3>Overview</h3>
            <p>{event.desc}</p>
          </div>

          {!isPast && (
            <div className="event-detail-section">
              <p style={{ color: 'var(--lime)', fontSize: '0.85rem' }}>
                {'\u{1F4CC}'} Use the group chat to introduce yourself, see who
                else is joining, and confirm the final meetup details before the
                day. Remember to make a booking.
              </p>
            </div>
          )}

          <div className="event-detail-section">
            <h3>{'\u{1F465}'} Spots Available</h3>
            <p>
              {event.spots} of {event.totalSpots} spots remaining
            </p>
            <div className="spots-progress">
              <div className="spots-bar">
                <div
                  className="spots-bar-fill"
                  style={{ width: `${fillPct}%` }}
                ></div>
              </div>
              <div className="spots-text">
                {spotsUsed}/{event.totalSpots}
              </div>
            </div>
          </div>

          <div className="event-detail-section">
            <h3>{'\u{1F465}'} Hosted by</h3>
            <p>{event.hostedBy}</p>
          </div>

          <div className="event-detail-section">
            <h3>{'\u{1F4CD}'} Meeting Point</h3>
            <p>{event.location}</p>
            <div className="event-map">
              <div className="event-map-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {event.address}
              </div>
            </div>
          </div>

          <div className="event-detail-section">
            <h3>{'\u{1F4CB}'} What to Expect</h3>
            <ul className="expect-list">
              {event.expect.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="event-detail-actions">
            <button
              className="btn-calendar"
              onClick={onCalendarClick}
              style={
                calendarClicked ? { color: 'var(--lime)' } : undefined
              }
            >
              {calendarClicked ? (
                'Added to Calendar ✓'
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Add to Calendar
                </>
              )}
            </button>
            {event.price > 0 ? (
              <BookButton label={`Book Tickets, $${event.price}`} />
            ) : (
              <BookButton label="Join — Free" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookButton({ label }: { label: string }) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      const t = setTimeout(() => setClicked(false), 2000);
      return () => clearTimeout(t);
    }
  }, [clicked]);

  return (
    <button className="btn-book" onClick={() => setClicked(true)}>
      {clicked ? (
        'Booked ✓'
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
