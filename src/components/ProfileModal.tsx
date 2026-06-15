'use client';

import { useState } from 'react';
import { MemberData, getStageClass, getStageEmoji } from './MemberCard';

interface ProfileModalProps {
  member: MemberData | null;
  isOpen: boolean;
  onClose: () => void;
  onMessage: (member: MemberData) => void;
  onUpgrade: () => void;
  msgCount: number;
}

export default function ProfileModal({
  member,
  isOpen,
  onClose,
  onMessage,
  onUpgrade,
  msgCount,
}: ProfileModalProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    working: true,
    business: true,
    skills: true,
    activities: true,
  });
  const [saved, setSaved] = useState(false);
  const [connected, setConnected] = useState(false);

  if (!member) return null;

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const lockedSections = [
    { emoji: '❤️', label: 'Looking for' },
    { emoji: '⏳', label: 'Biggest challenge' },
    { emoji: '\u{1F50D}', label: 'Needs help with' },
    { emoji: '\u{1F3C6}', label: 'Proudest recent win' },
    { emoji: '✨', label: 'Founder qualities' },
    { emoji: '✉️', label: 'Contact' },
  ];

  return (
    <div
      className={`modal-overlay${isOpen ? ' open' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="modal-card profile-modal">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="profile-header">
          <div
            className="profile-avatar"
            style={{ background: member.color }}
          >
            {member.name.charAt(0)}
          </div>
          <div className="profile-info">
            <h2>{member.name}</h2>
            <p>
              {member.city} &middot; {member.age}
            </p>
            <span className={`stage-tag ${getStageClass(member.stage)}`}>
              {getStageEmoji(member.stage)} {member.stage}
            </span>
          </div>
          <button
            className={`action-icon connect-btn profile-connect${connected ? ' connected' : ''}`}
            title="Connect"
            onClick={() => setConnected(!connected)}
          >
            {connected ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
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

        <div className="profile-sections">
          {/* Working on */}
          <div className={`profile-section${openSections.working ? ' open' : ''}`}>
            <button
              className="profile-section-header"
              onClick={() => toggleSection('working')}
            >
              <span>{'\u{1F3E0}'} Working on</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="profile-section-body">
              <p>{member.working}</p>
            </div>
          </div>

          {/* Business */}
          <div className={`profile-section${openSections.business ? ' open' : ''}`}>
            <button
              className="profile-section-header"
              onClick={() => toggleSection('business')}
            >
              <span>{'\u{1F3E2}'} Business</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="profile-section-body">
              <span className="help-tag">{member.industry}</span>
            </div>
          </div>

          {/* Can help with */}
          <div className={`profile-section${openSections.skills ? ' open' : ''}`}>
            <button
              className="profile-section-header"
              onClick={() => toggleSection('skills')}
            >
              <span>{'\u{1F6E1}️'} Can help with</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="profile-section-body">
              <div className="help-tags">
                {member.skills.map((s) => (
                  <span key={s} className="help-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Activity interests */}
          <div className={`profile-section${openSections.activities ? ' open' : ''}`}>
            <button
              className="profile-section-header"
              onClick={() => toggleSection('activities')}
            >
              <span>{'⚡'} Activity interests</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="profile-section-body">
              <div className="help-tags">
                {(member.activities || []).map((a) => (
                  <span key={a} className="help-tag">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* PRO-locked sections */}
          {lockedSections.map((section) => (
            <div key={section.label} className="profile-section locked">
              <button
                className="profile-section-header"
                onClick={() => {
                  onClose();
                  setTimeout(onUpgrade, 200);
                }}
              >
                <span>
                  {section.emoji} {section.label}
                </span>
                <span className="pro-lock">{'\u{1F512}'} PRO</span>
              </button>
            </div>
          ))}
        </div>

        <button
          className="unlock-pro-btn"
          onClick={() => {
            onClose();
            setTimeout(onUpgrade, 200);
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Unlock full profile with PRO
        </button>

        <div className="profile-bottom-actions">
          <button
            className="card-btn msg-btn profile-save"
            onClick={() => setSaved(true)}
            style={saved ? { color: '#ef4444' } : undefined}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {saved ? 'Saved' : 'Save'}
          </button>
          <button
            className="card-btn msg-btn profile-msg"
            onClick={() => onMessage(member)}
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
        </div>
      </div>
    </div>
  );
}
