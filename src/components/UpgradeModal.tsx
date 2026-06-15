'use client';

import { useState } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    value: 'week',
    label: '1 Week',
    sub: 'Try it out, get a feel for the experience',
    price: '$7',
    priceLabel: '$7/week',
    badge: 'MOST POPULAR',
    save: null,
  },
  {
    value: 'month',
    label: '1 Month',
    sub: 'Start building real founder connections',
    price: '$19',
    priceLabel: '$19/month',
    badge: null,
    save: 'Save 38%',
  },
  {
    value: 'year',
    label: '1 Year',
    sub: 'The smartest choice for serious builders',
    price: '$180',
    priceLabel: '$180/year',
    badge: null,
    save: 'Save 51%',
  },
];

const FEATURES = [
  'Global access, every city, every member',
  'Priority visibility',
  'See who viewed your profile',
  'Unlimited DMs',
  'Access full member profiles',
  'Host your own meetups',
  'Access advanced smart filters',
];

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('month');
  const [ctaState, setCtaState] = useState<'idle' | 'processing' | 'done'>('idle');

  const currentPlan = PLANS.find((p) => p.value === selectedPlan)!;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUpgrade = () => {
    setCtaState('processing');
    setTimeout(() => {
      setCtaState('done');
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setCtaState('idle');
        }, 500);
      }, 1500);
    }, 1500);
  };

  return (
    <div
      className={`modal-overlay${isOpen ? ' open' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="modal-card upgrade-modal">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2 className="upgrade-title">Choose your membership</h2>
        <p className="upgrade-desc">
          Go PRO to unlock every city, every member, and the full founder
          experience.
        </p>

        <div className="plan-options">
          {PLANS.map((plan) => (
            <label key={plan.value} className="plan-option">
              <input
                type="radio"
                name="plan"
                value={plan.value}
                checked={selectedPlan === plan.value}
                onChange={() => setSelectedPlan(plan.value)}
              />
              <div
                className={`plan-card${selectedPlan === plan.value ? ' selected' : ''}`}
              >
                {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                <div className="plan-info">
                  <strong>
                    {plan.label}
                    {plan.save && (
                      <>
                        {' '}
                        <span className="plan-save">{plan.save}</span>
                      </>
                    )}
                  </strong>
                  <span className="plan-sub">{plan.sub}</span>
                </div>
                <span className="plan-price">{plan.price}</span>
              </div>
            </label>
          ))}
        </div>

        <button
          className="upgrade-cta"
          onClick={handleUpgrade}
          style={ctaState === 'processing' ? { opacity: 0.7 } : undefined}
          disabled={ctaState !== 'idle'}
        >
          {ctaState === 'idle' && (
            <>
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
              Upgrade to PRO, {currentPlan.priceLabel}
            </>
          )}
          {ctaState === 'processing' && 'Processing...'}
          {ctaState === 'done' && (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Welcome to PRO!
            </>
          )}
        </button>
        <p className="upgrade-note">
          Great for serious networking {'\u{1F91D}'}, cancel anytime
        </p>

        <div className="pro-features">
          <div className="pro-features-title">
            Included with SoloTribe PRO
          </div>
          <ul>
            {FEATURES.map((feature) => (
              <li key={feature}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--lime)"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
