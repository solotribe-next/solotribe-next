'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MemberCard, { MemberData } from '@/components/MemberCard';
import ProfileModal from '@/components/ProfileModal';
import UpgradeModal from '@/components/UpgradeModal';

// ===== Member Data =====
const NAMES: MemberData[] = [
  { name: 'Andrew J.', age: 40, city: 'Bangkok', stage: 'Active Founder', industry: 'Advertising', working: 'Digital marketing. SEO. AI. Old school but looking to grow.', skills: ['Getting first customers', 'Operations', 'Staying sane as a founder'], activities: ['Swimming', 'Ice baths', 'Sauna', 'Gym', 'Co-working sessions', 'Dinners'], pro: true, color: '#7A3EF0' },
  { name: 'Dirk B.', age: 52, city: 'Bangkok', stage: 'Supporter', industry: 'Technology', working: 'Fractional CTO with 30+ years across IoT, fintech, SaaS. Co-founder of The Product Architect.', skills: ['Technical architecture', 'Hiring & team building', 'Product strategy'], activities: ['Cycling', 'Coffee meetups', 'Hiking'], pro: false, color: '#3b82f6' },
  { name: 'Sophia L.', age: 28, city: 'Bangkok', stage: 'Early Stage', industry: 'AI', working: 'Building an AI-powered personal finance assistant for millennials in Southeast Asia.', skills: ['Customer discovery', 'Brainstorming', 'Data analytics'], activities: ['Yoga', 'Running', 'Rooftop drinks', 'Paddleboarding'], pro: true, color: '#06b6d4' },
  { name: 'Marcus T.', age: 35, city: 'Bangkok', stage: 'Active Founder', industry: 'E-commerce', working: 'Running a sustainable fashion marketplace connecting local Thai designers with global buyers.', skills: ['Brand building', 'Social media', 'Growing revenue'], activities: ['Surfing', 'Tennis', 'Dinner parties'], pro: false, color: '#f43f5e' },
  { name: 'Natalie K.', age: 31, city: 'Bangkok', stage: 'Early Stage', industry: 'Healthcare', working: 'Creating a modern mental health platform for men through counseling-informed content and community spaces.', skills: ['Sharing learnings', 'Brainstorming', 'Social media'], activities: ['Meditation', 'Yoga', 'Journaling', 'Breathwork'], pro: false, color: '#10b981' },
  { name: 'Seth A.', age: 32, city: 'Bangkok', stage: 'Early Stage', industry: 'Education', working: 'A credential training program AI+human hybrid model called Foundry where we train fresh graduates for career readiness.', skills: ['Sharing learnings', 'Brainstorming', 'Staying motivated'], activities: ['Basketball', 'Co-working sessions', 'Muay Thai'], pro: false, color: '#8b5cf6' },
  { name: 'Natnuja B.', age: 27, city: 'Bangkok', stage: 'Active Founder', industry: 'Real Estate', working: 'Founder of Lavis Estate, curating exceptional luxury residences across Thailand and key global markets.', skills: ['Operations', 'Sales strategy', 'Managing a co-founder relationship'], activities: ['Pilates', 'Wine tasting', 'Dinner parties'], pro: false, color: '#ec4899' },
  { name: 'Enric B.', age: 31, city: 'Bangkok', stage: 'Active Founder', industry: 'AI', working: 'Competitor intelligence SaaS to help users increase their revenue through market insights.', skills: ['Hiring the right people', 'Marketing that actually works', 'Growing revenue'], activities: ['CrossFit', 'Padel', 'Coffee meetups'], pro: true, color: '#06b6d4' },
  { name: 'Patipol A.', age: 22, city: 'Bangkok', stage: 'Active Founder', industry: 'Gaming', working: 'Mobile Game Studio + Publisher and Affiliate Platform for indie game developers.', skills: ['Fundraising & pitching', 'Content creation', 'Community building'], activities: ['Gym / Weights', 'Badminton', 'Co-working sessions'], pro: false, color: '#6366f1' },
  { name: 'Lily C.', age: 29, city: 'Bangkok', stage: 'Supporter', industry: 'Marketing', working: 'Freelance brand strategist helping startups find their voice and build authentic connections.', skills: ['Brand building', 'Content creation', 'Social media'], activities: ['Yoga', 'Running', 'Rooftop drinks', 'Social dancing'], pro: false, color: '#f97316' },
  { name: 'James W.', age: 38, city: 'Bangkok', stage: 'Active Founder', industry: 'SaaS', working: 'Building project management tools designed specifically for remote-first creative agencies.', skills: ['Product strategy', 'Technical architecture', 'Hiring the right people'], activities: ['Tennis', 'Hiking', 'Sauna', 'Co-working sessions'], pro: true, color: '#a855f7' },
  { name: 'Rina P.', age: 26, city: 'Bangkok', stage: 'Early Stage', industry: 'F&B', working: 'Launching a plant-based meal prep delivery service targeting busy professionals in Bangkok.', skills: ['Operations', 'Customer discovery', 'Brand building'], activities: ['Pilates', 'Coffee meetups', 'Cycling'], pro: false, color: '#ef4444' },
];

const CITY_TABS = [
  { label: 'Bangkok', count: 84, isHome: true },
  { label: 'Chiang Mai', count: 32 },
  { label: 'Phuket', count: 18 },
  { label: 'Bali', count: 45 },
  { label: 'Ho Chi Minh', count: 27 },
];

const STAGE_FILTERS = ['All', 'Active Founder', 'Early Stage', 'Supporter'];
const INDUSTRY_FILTERS = ['All', 'Technology', 'Marketing', 'F&B', 'Healthcare', 'Education', 'AI'];

// ===== localStorage helpers =====
function getMsgCount(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('solotribe-msg-count') || '0');
}

function setMsgCount(n: number) {
  localStorage.setItem('solotribe-msg-count', String(n));
}

function getDms(): Array<Record<string, string>> {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('solotribe-dms') || '[]');
  } catch {
    return [];
  }
}

function addDm(member: MemberData): string {
  const dms = getDms();
  const id = 'dm-' + member.name.toLowerCase().replace(/[^a-z]/g, '');
  if (!dms.find((d) => d.id === id)) {
    dms.push({
      id,
      name: member.name,
      initial: member.name.charAt(0),
      color: member.color,
      working: member.working,
      industry: member.industry,
    });
    localStorage.setItem('solotribe-dms', JSON.stringify(dms));
  }
  return id;
}

export default function DashboardPage() {
  const router = useRouter();
  const [msgCount, setMsgCountState] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState('Bangkok');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeStages, setActiveStages] = useState<string[]>(['All']);
  const [activeIndustries, setActiveIndustries] = useState<string[]>(['All']);
  const [profileMember, setProfileMember] = useState<MemberData | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    setMsgCountState(getMsgCount());
  }, []);

  // Filter members
  const filteredMembers = useMemo(() => {
    let result = NAMES;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.industry.toLowerCase().includes(q) ||
          m.working.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Stage filter
    if (!activeStages.includes('All')) {
      result = result.filter((m) => activeStages.includes(m.stage));
    }

    // Industry filter
    if (!activeIndustries.includes('All')) {
      result = result.filter((m) => activeIndustries.includes(m.industry));
    }

    return result;
  }, [searchQuery, activeStages, activeIndustries]);

  const handleStageFilter = (tag: string) => {
    if (tag === 'All') {
      setActiveStages(['All']);
    } else {
      setActiveStages((prev) => {
        const without = prev.filter((t) => t !== 'All' && t !== tag);
        const isActive = prev.includes(tag);
        if (isActive) {
          const next = without;
          return next.length === 0 ? ['All'] : next;
        }
        return [...without, tag];
      });
    }
  };

  const handleIndustryFilter = (tag: string) => {
    if (tag === 'All') {
      setActiveIndustries(['All']);
    } else {
      setActiveIndustries((prev) => {
        const without = prev.filter((t) => t !== 'All' && t !== tag);
        const isActive = prev.includes(tag);
        if (isActive) {
          const next = without;
          return next.length === 0 ? ['All'] : next;
        }
        return [...without, tag];
      });
    }
  };

  const openDmWithMember = (member: MemberData) => {
    const count = getMsgCount();
    if (count >= 3) {
      setUpgradeOpen(true);
      return;
    }
    setMsgCount(count + 1);
    setMsgCountState(count + 1);
    const chatId = addDm(member);
    localStorage.setItem('solotribe-open-chat', chatId);
    router.push('/chats');
  };

  const handleMessage = (member: MemberData) => {
    setProfileOpen(false);
    openDmWithMember(member);
  };

  const handleOpenProfile = (member: MemberData) => {
    setProfileMember(member);
    setProfileOpen(true);
  };

  return (
    <>
      {/* City tabs */}
      <div className="city-tabs">
        <button
          className="city-tab"
          data-filter="go-pro"
          onClick={() => setUpgradeOpen(true)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Go PRO
        </button>
        {CITY_TABS.map((city) => (
          <button
            key={city.label}
            className={`city-tab${activeCity === city.label ? ' active' : ''}`}
            onClick={() => setActiveCity(city.label)}
          >
            {city.isHome && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            )}
            {city.label} <span className="city-count">{city.count}</span>
          </button>
        ))}
      </div>

      {/* Welcome banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="welcome-icon">{'\u{1F44B}'}</div>
          <div>
            <h2>Welcome back, Wasita</h2>
            <p>Here&apos;s your last 30 days</p>
          </div>
        </div>
        <div className="welcome-stats">
          <div className="welcome-stat">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="stat-number">12</span>
            <span className="stat-label">Profile views</span>
          </div>
          <div className="welcome-stat">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span className="stat-number">84</span>
            <span className="stat-label">New members</span>
          </div>
          <div className="welcome-stat">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="stat-number">3</span>
            <span className="stat-label">Conversations</span>
          </div>
        </div>
      </div>

      {/* Search & filters */}
      <div className="search-bar-wrap">
        <div className="search-input-wrap">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="search-actions">
          <button
            className={`filter-btn${filterOpen ? ' active' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
          </button>
          <button
            className={`view-btn${viewMode === 'grid' ? ' active' : ''}`}
            data-view="grid"
            onClick={() => setViewMode('grid')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            className={`view-btn${viewMode === 'list' ? ' active' : ''}`}
            data-view="list"
            onClick={() => setViewMode('list')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className={`filter-panel${filterOpen ? ' open' : ''}`}>
        <div className="filter-group">
          <label>Stage</label>
          <div className="filter-tags">
            {STAGE_FILTERS.map((tag) => (
              <button
                key={tag}
                className={`filter-tag${activeStages.includes(tag) ? ' active' : ''}`}
                onClick={() => handleStageFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>Industry</label>
          <div className="filter-tags">
            {INDUSTRY_FILTERS.map((tag) => (
              <button
                key={tag}
                className={`filter-tag${activeIndustries.includes(tag) ? ' active' : ''}`}
                onClick={() => handleIndustryFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Member count */}
      <div className="member-count-row">
        <span className="member-count">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>{filteredMembers.length}</span> founders
        </span>
        <span
          className="upgrade-hint"
          style={{ cursor: 'pointer' }}
          onClick={() => setUpgradeOpen(true)}
        >
          Upgrade to PRO for unlimited DMs
        </span>
      </div>

      {/* Members grid */}
      <div
        className={`members-grid${viewMode === 'list' ? ' list-view' : ''}`}
      >
        {filteredMembers.map((member) => (
          <MemberCard
            key={member.name}
            member={member}
            onMessage={handleMessage}
            onProfile={handleOpenProfile}
            msgCount={msgCount}
          />
        ))}
      </div>

      {/* Modals */}
      <ProfileModal
        member={profileMember}
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onMessage={handleMessage}
        onUpgrade={() => setUpgradeOpen(true)}
        msgCount={msgCount}
      />
      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
      />
    </>
  );
}
