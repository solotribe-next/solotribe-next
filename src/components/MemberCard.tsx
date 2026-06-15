'use client';

import { useState } from 'react';

export interface MemberData {
  name: string;
  age: number;
  city: string;
  stage: 'Active Founder' | 'Early Stage' | 'Supporter';
  industry: string;
  working: string;
  skills: string[];
  activities: string[];
  pro: boolean;
  color: string;
}

const INDUSTRIES: Record<string, string> = {
  Technology: '#3b82f6',
  Marketing: '#f97316',
  'F&B': '#ef4444',
  Healthcare: '#10b981',
  Education: '#8b5cf6',
  AI: '#06b6d4',
  Advertising: '#f59e0b',
  'Real Estate': '#ec4899',
  Gaming: '#6366f1',
  Finance: '#14b8a6',
  'E-commerce': '#f43f5e',
  SaaS: '#a855f7',
};

function getStageClass(stage: string) {
  if (stage === 'Active Founder') return 'active-founder';
  if (stage === 'Early Stage') return 'early-stage';
  return 'supporter';
}

function getStageEmoji(stage: string) {
  if (stage === 'Active Founder') return '\u{1F680}';
  if (stage === 'Early Stage') return '\u{1F331}';
  return '\u{1F91D}';
}

interface MemberCardProps {
  member: MemberData;
  onMessage: (member: MemberData) => void;
  onProfile: (member: MemberData) => void;
  msgCount: number;
}

export default function MemberCard({
  member,
  onMessage,
  onProfile,
  msgCount,
}: MemberCardProps) {
  const [liked, setLiked] = useState(false);
  const [connected, setConnected] = useState(false);

  return (
    <div className="member-card">
      <div className="member-header">
        <div
          className="member-avatar-placeholder"
          style={{ background: member.color }}
        >
          {member.name.charAt(0)}
        </div>
        <div className="member-info">
          <div className="member-name-row">
            <span className="member-name">{member.name}</span>
          </div>
          <div className="member-meta">
            {member.age} &middot; {member.city}
          </div>
        </div>
        <div className="member-actions-top">
          <button
            className={`action-icon heart-btn${liked ? ' liked' : ''}`}
            title="Like"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            className={`action-icon connect-btn${connected ? ' connected' : ''}`}
            title="Connect"
            onClick={(e) => {
              e.stopPropagation();
              setConnected(!connected);
            }}
          >
            {connected ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
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
            )}
          </button>
        </div>
      </div>

      <div className="member-tags">
        <span className={`stage-tag ${getStageClass(member.stage)}`}>
          {getStageEmoji(member.stage)} {member.stage}
        </span>
        <span className="industry-tag">
          <span
            className="industry-dot"
            style={{
              background: INDUSTRIES[member.industry] || '#888',
            }}
          ></span>
          {member.industry}
        </span>
      </div>

      <div className="member-section-title">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Working on
      </div>
      <p className="member-working-on">{member.working}</p>

      <div className="member-section-title">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Can help with
      </div>
      <div className="help-tags">
        {member.skills.map((s) => (
          <span key={s} className="help-tag">
            {s}
          </span>
        ))}
      </div>

      <div className="member-card-actions">
        <button
          className="card-btn msg-btn"
          onClick={(e) => {
            e.stopPropagation();
            onMessage(member);
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Message <span className="msg-limit">{msgCount}/3</span>
        </button>
        <button
          className="card-btn profile-btn"
          onClick={(e) => {
            e.stopPropagation();
            onProfile(member);
          }}
        >
          Full Profile
        </button>
      </div>
    </div>
  );
}

export { INDUSTRIES, getStageClass, getStageEmoji };
