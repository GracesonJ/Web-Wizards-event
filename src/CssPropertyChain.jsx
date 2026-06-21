import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const CHALLENGES = [
  {
    title: 'Centered card with shadow',
    preview: {
      width: 220,
      height: 130,
      background: '#1e1b4b',
      borderRadius: 20,
      boxShadow: '0 16px 40px -8px rgba(99,102,241,0.6)',
      border: '1px solid rgba(99,102,241,0.4)',
    },
    code: `.card {
  width: 220px;
  height: 130px;
  background: #1e1b4b;
  border-radius: 20px;
  box-shadow: 0 16px 40px -8px rgba(99,102,241,0.6);
  border: 1px solid rgba(99,102,241,0.4);
}`,
    explanation: 'A negative vertical offset in box-shadow with no horizontal spread creates that soft "floating" glow look, common in dark-themed cards.',
  },
  {
    title: 'Pill-shaped button',
    preview: {
      padding: '18px 48px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: 999,
      color: '#fff',
      fontWeight: 700,
      fontSize: 22,
      display: 'inline-block',
    },
    code: `.btn {
  padding: 18px 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 999px;
  color: #fff;
  font-weight: 700;
}`,
    explanation: 'border-radius: 999px (or any value larger than half the height) forces fully rounded pill ends regardless of button width.',
  },
  {
    title: 'Text with letter spacing',
    preview: {
      color: '#34d399',
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
    },
    isText: true,
    text: 'LOADING',
    code: `.label {
  color: #34d399;
  font-weight: 800;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}`,
    explanation: 'letter-spacing adds gaps between characters; combined with text-transform: uppercase it gives that "badge/label" feel seen in tags and status pills.',
  },
  {
    title: 'Striped background',
    preview: {
      width: 240,
      height: 130,
      backgroundImage:
        'repeating-linear-gradient(45deg, #f43f5e 0px, #f43f5e 16px, #fb7185 16px, #fb7185 32px)',
      borderRadius: 12,
    },
    code: `.stripes {
  width: 240px;
  height: 130px;
  background-image: repeating-linear-gradient(
    45deg,
    #f43f5e 0px, #f43f5e 16px,
    #fb7185 16px, #fb7185 32px
  );
}`,
    explanation: 'repeating-linear-gradient with hard color stops (same color twice at different positions) creates sharp stripes instead of a smooth blend.',
  },
  {
    title: 'Inset pressed effect',
    preview: {
      width: 220,
      height: 100,
      background: '#27272a',
      borderRadius: 14,
      boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.6)',
    },
    code: `.pressed {
  width: 220px;
  height: 100px;
  background: #27272a;
  border-radius: 14px;
  box-shadow: inset 0 4px 10px rgba(0,0,0,0.6);
}`,
    explanation: 'The inset keyword flips the shadow to render inside the box edges, simulating a pressed/recessed surface instead of a floating one.',
  },
  {
    title: 'Rotated tag',
    preview: {
      padding: '12px 28px',
      background: '#ec4899',
      color: '#fff',
      fontSize: 20,
      fontWeight: 800,
      transform: 'rotate(-6deg)',
      borderRadius: 8,
      display: 'inline-block',
    },
    isText: true,
    text: 'NEW',
    code: `.tag {
  padding: 12px 28px;
  background: #ec4899;
  color: #fff;
  font-weight: 800;
  transform: rotate(-6deg);
  border-radius: 8px;
}`,
    explanation: 'transform: rotate() tilts the element without affecting surrounding layout flow — a common trick for playful "NEW" or "SALE" badges.',
  },
  {
    title: 'Truncated text with ellipsis',
    preview: {
      width: 220,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#e5e5e5',
      fontSize: 22,
      border: '2px dashed #525252',
      padding: '14px 18px',
      borderRadius: 10,
    },
    isText: true,
    text: 'This is a very long title that overflows',
    code: `.truncate {
  width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`,
    explanation: 'All three properties are required together: nowrap stops wrapping, overflow: hidden clips it, and text-overflow: ellipsis adds the "…".',
  },
  {
    title: 'Bordered badge with ring',
    preview: {
      padding: '14px 30px',
      background: '#0ea5e9',
      color: '#fff',
      fontSize: 18,
      fontWeight: 700,
      borderRadius: 12,
      boxShadow: '0 0 0 4px rgba(14,165,233,0.3)',
      display: 'inline-block',
    },
    isText: true,
    text: 'Active',
    code: `.badge {
  padding: 14px 30px;
  background: #0ea5e9;
  color: #fff;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 0 0 4px rgba(14,165,233,0.3);
}`,
    explanation: 'A box-shadow with no blur (0 0 0 4px) acts like a second outer border — a common focus-ring style used for active states.',
  },
  {
    title: 'Two-tone gradient text',
    preview: {
      fontSize: 32,
      fontWeight: 800,
      backgroundImage: 'linear-gradient(90deg, #f97316, #ec4899)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    },
    isText: true,
    text: 'Hello',
    code: `.gradient-text {
  font-weight: 800;
  background-image: linear-gradient(90deg, #f97316, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}`,
    explanation: 'background-clip: text clips the gradient background to the shape of the text, while color: transparent reveals it instead of solid text color.',
  },
  {
    title: 'Bottom border underline link',
    preview: {
      color: '#facc15',
      fontSize: 22,
      fontWeight: 600,
      borderBottom: '3px solid #facc15',
      paddingBottom: 6,
      display: 'inline-block',
    },
    isText: true,
    text: 'Learn more',
    code: `.link {
  color: #facc15;
  font-weight: 600;
  border-bottom: 3px solid #facc15;
  padding-bottom: 6px;
}`,
    explanation: 'A solid border-bottom paired with padding-bottom creates a clean underline with breathing room, instead of using text-decoration which sits flush against descenders.',
  },
  {
    title: 'Outlined ghost button',
    preview: {
      padding: '14px 36px',
      background: 'transparent',
      color: '#a78bfa',
      fontSize: 18,
      fontWeight: 700,
      border: '2px solid #a78bfa',
      borderRadius: 10,
      display: 'inline-block',
    },
    isText: true,
    text: 'Cancel',
    code: `.ghost-btn {
  padding: 14px 36px;
  background: transparent;
  color: #a78bfa;
  font-weight: 700;
  border: 2px solid #a78bfa;
  border-radius: 10px;
}`,
    explanation: 'Matching the border-color to the text color with a transparent background gives the "outline" / secondary button look, common alongside a solid primary button.',
  },
  {
    title: 'Circular avatar placeholder',
    preview: {
      width: 110,
      height: 110,
      background: 'linear-gradient(135deg, #fbbf24, #f97316)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 32,
      fontWeight: 800,
    },
    isText: true,
    text: 'A',
    code: `.avatar {
  width: 110px;
  height: 110px;
  background: linear-gradient(135deg, #fbbf24, #f97316);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
    explanation: 'border-radius: 50% on an equal width/height box makes a perfect circle, while flex centering keeps the initial letter dead-center regardless of font.',
  },
  {
    title: 'Card with left accent border',
    preview: {
      width: 240,
      padding: '18px 20px',
      background: '#18181b',
      borderLeft: '5px solid #22d3ee',
      borderRadius: 8,
      color: '#d4d4d8',
      fontSize: 16,
    },
    isText: true,
    text: 'New message received',
    code: `.notice {
  width: 240px;
  padding: 18px 20px;
  background: #18181b;
  border-left: 5px solid #22d3ee;
  border-radius: 8px;
}`,
    explanation: 'A thick border-left in an accent color is a quick way to add a "status stripe" to notices or alert cards without extra markup.',
  },
  {
    title: 'Soft glow text shadow',
    preview: {
      color: '#f87171',
      fontSize: 30,
      fontWeight: 800,
      textShadow: '0 0 16px rgba(248,113,113,0.8)',
    },
    isText: true,
    text: 'ALERT',
    code: `.glow-text {
  color: #f87171;
  font-weight: 800;
  text-shadow: 0 0 16px rgba(248,113,113,0.8);
}`,
    explanation: 'text-shadow with 0 0 offsets and a large blur radius creates a neon/glow effect around the letters instead of a directional drop shadow.',
  },
  {
    title: 'Striped border bottom tab',
    preview: {
      padding: '12px 24px',
      color: '#fff',
      fontSize: 16,
      fontWeight: 600,
      borderBottom: '3px solid transparent',
      borderImage: 'linear-gradient(90deg, #6366f1, #ec4899) 1',
      display: 'inline-block',
    },
    isText: true,
    text: 'Dashboard',
    code: `.tab {
  padding: 12px 24px;
  color: #fff;
  font-weight: 600;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, #6366f1, #ec4899) 1;
}`,
    explanation: 'border-image lets a gradient render as a border by slicing it into the border area — here applied only to the bottom edge as an active-tab indicator.',
  },
  {
    title: 'Dotted divider line',
    preview: {
      width: 220,
      height: 0,
      borderTop: '3px dotted #71717a',
    },
    code: `.divider {
  width: 220px;
  height: 0;
  border-top: 3px dotted #71717a;
}`,
    explanation: 'border-style: dotted on a zero-height element creates a simple dotted divider line, often used instead of <hr> for more style control.',
  },
  {
    title: 'Skewed background banner',
    preview: {
      width: 240,
      height: 90,
      background: '#16a34a',
      transform: 'skewY(-3deg)',
      borderRadius: 6,
    },
    code: `.banner {
  width: 240px;
  height: 90px;
  background: #16a34a;
  transform: skewY(-3deg);
  border-radius: 6px;
}`,
    explanation: 'transform: skewY() tilts the box along the vertical axis, a common technique for dynamic-looking section dividers and banners.',
  },
  {
    title: 'Faded edge overlay box',
    preview: {
      width: 220,
      height: 120,
      background: 'linear-gradient(to bottom, #3b82f6, transparent)',
      borderRadius: 12,
    },
    code: `.fade-box {
  width: 220px;
  height: 120px;
  background: linear-gradient(to bottom, #3b82f6, transparent);
  border-radius: 12px;
}`,
    explanation: 'A linear-gradient fading to transparent is the standard trick for image/text overlays that blend smoothly into the background.',
  },
  {
    title: 'Spaced-out icon row spacing',
    preview: {
      display: 'flex',
      gap: 18,
      fontSize: 28,
    },
    isText: true,
    text: '★ ★ ★',
    code: `.icon-row {
  display: flex;
  gap: 18px;
}`,
    explanation: 'The flex gap property adds consistent spacing between flex children without needing margin on each item individually — far less error-prone.',
  },
  {
    title: 'Uppercase spaced section label',
    preview: {
      color: '#94a3b8',
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      borderBottom: '1px solid #334155',
      paddingBottom: 10,
      display: 'inline-block',
    },
    isText: true,
    text: 'Account Settings',
    code: `.section-label {
  color: #94a3b8;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border-bottom: 1px solid #334155;
  padding-bottom: 10px;
}`,
    explanation: 'Combining uppercase, letter-spacing, and a thin bottom border is the classic pattern for muted section headers seen in settings panels and dashboards.',
  },
]

const RULES = [
  "You'll see one live-rendered CSS preview at a time, picked in random order.",
  'You get 10 seconds to study it before it blurs out.',
  'Once blurred, try to recall the CSS properties that produced it before revealing the answer.',
  "Each challenge appears only once — there's no repeats in a round.",
  `This round has ${CHALLENGES.length} challenges total.`,
]

function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const TIMER_DURATION = 10

function CssPropertyChain() {
  const navigate = useNavigate()
  const [hasStarted, setHasStarted] = useState(false)
  const [shuffled, setShuffled] = useState(() => shuffleArray(CHALLENGES))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [isBlurred, setIsBlurred] = useState(false)
  const [revealedAnswer, setRevealedAnswer] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const current = shuffled[currentIndex]
  const isLastChallenge = currentIndex >= shuffled.length - 1
  const isFirstChallenge = currentIndex === 0

  // Countdown timer — only runs once the round has actually started
  useEffect(() => {
    if (!hasStarted || isBlurred || isFinished) return

    if (timeLeft <= 0) {
      setIsBlurred(true)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, isBlurred, isFinished, hasStarted])

  // Lock body scroll while reveal modal is open
  useEffect(() => {
    document.body.style.overflow = revealedAnswer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [revealedAnswer])

  // Close modal with Escape
  useEffect(() => {
    if (!revealedAnswer) return
    const onKey = (e) => {
      if (e.key === 'Escape') setRevealedAnswer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealedAnswer])

  const handleStart = () => {
    setShuffled(shuffleArray(CHALLENGES))
    setCurrentIndex(0)
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
    setIsFinished(false)
    setHasStarted(true)
  }

  const handleNext = useCallback(() => {
    if (isLastChallenge) {
      setRevealedAnswer(false)
      setIsFinished(true)
      return
    }
    setCurrentIndex((i) => i + 1)
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
  }, [isLastChallenge])

  const handleBack = useCallback(() => {
    if (isFirstChallenge) return
    setCurrentIndex((i) => i - 1)
    setIsBlurred(true)
    setTimeLeft(0)
    setRevealedAnswer(false)
  }, [isFirstChallenge])

  const handlePlayAgain = () => {
    setShuffled(shuffleArray(CHALLENGES))
    setCurrentIndex(0)
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
    setIsFinished(false)
    setHasStarted(false)
  }

  const progressPercent = (timeLeft / TIMER_DURATION) * 100

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-fuchsia-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-cyan-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] bg-amber-600/15 rounded-full blur-[120px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 py-12 flex flex-col items-center min-h-screen">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            CSS Property Chain
          </h1>
          {hasStarted && !isFinished ? (
            <span className="text-sm text-neutral-500">
              {currentIndex + 1} / {shuffled.length}
            </span>
          ) : (
            <span className="w-12" />
          )}
        </div>

        {!hasStarted ? (
          /* ----------- Start / rules screen ----------- */
          <div className="w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 sm:p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center mb-6">
              <span className="text-3xl sm:text-4xl">🎨</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-white to-fuchsia-400 bg-clip-text text-transparent mb-2">
              CSS Property Chain
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md">
              Can you recall the CSS that produced each visual before it blurs away?
            </p>

            <ul className="w-full max-w-md text-left space-y-3 mb-10">
              {RULES.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-neutral-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-base font-semibold transition-colors flex items-center gap-2"
            >
              Start Round
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        ) : isFinished ? (
          /* ----------- Finish screen ----------- */
          <div className="w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-10 sm:p-14 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-white to-fuchsia-400 bg-clip-text text-transparent mb-3">
              You finished!
            </h2>
            <p className="text-neutral-400 mb-10 max-w-sm">
              You went through all {shuffled.length} CSS challenges. Nice work training that visual recall.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-sm font-semibold transition-colors"
              >
                Play again
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition-colors border border-neutral-700"
              >
                Back home
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Card */}
            <div className="w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center">
              {/* Timer ring */}
              <div className="relative w-16 h-16 mb-6">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="27" fill="none" stroke="rgb(38 38 38)" strokeWidth="5" />
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke={isBlurred ? '#ef4444' : '#d946ef'}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 27}
                    strokeDashoffset={2 * Math.PI * 27 * (1 - progressPercent / 100)}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-base font-semibold">
                  {isBlurred ? '⏱' : timeLeft}
                </div>
              </div>

              <h3 className="text-sm font-medium text-neutral-400 mb-1">{current.title}</h3>
              <p className="text-xs text-neutral-500 mb-6">What CSS made this?</p>

              {/* Live rendered preview */}
              <div className="relative w-full flex items-center justify-center bg-[#0b0b0f] border border-neutral-800 rounded-xl py-16 sm:py-20 mb-6 min-h-[280px] sm:min-h-[320px]">
                <div
                  key={currentIndex}
                  className={`transition-all duration-500 ${
                    isBlurred ? 'blur-xl scale-95 opacity-50' : 'blur-0 scale-100 opacity-100'
                  }`}
                  style={{ transform: 'scale(1.4)', ...current.preview }}
                >
                  {current.isText ? current.text : null}
                </div>

                {isBlurred && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 bg-neutral-950/80 px-3 py-1.5 rounded-full border border-neutral-700">
                      Recall the CSS
                    </span>
                  </div>
                )}
              </div>

              {/* Reveal trigger */}
              <div className="h-10 mb-4">
                {isBlurred && (
                  <button
                    onClick={() => setRevealedAnswer(true)}
                    className="text-sm px-4 py-2 rounded-lg border border-fuchsia-500/40 text-fuchsia-300
                               hover:bg-fuchsia-500/10 hover:border-fuchsia-400 transition-colors
                               flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Reveal the CSS
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  disabled={isFirstChallenge}
                  title="Go back to the previous question"
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 border
                    ${
                      isFirstChallenge
                        ? 'bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                {!isBlurred && (
                  <button
                    onClick={() => setIsBlurred(true)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition-colors border border-neutral-700"
                  >
                    Blur now
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={!isBlurred}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1
                    ${
                      isBlurred
                        ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                    }`}
                >
                  {isLastChallenge ? 'Finish' : 'Next'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex flex-wrap gap-2 mt-8 justify-center max-w-md">
              {shuffled.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < currentIndex
                      ? 'bg-fuchsia-500'
                      : i === currentIndex
                      ? 'bg-fuchsia-400 scale-125'
                      : 'bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Center-screen reveal modal */}
      {revealedAnswer && !isFinished && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4
                     animate-[fadeIn_0.25s_ease-out]"
          onClick={() => setRevealedAnswer(false)}
        >
          <div
            className="relative w-full max-w-xl flex flex-col items-center px-8 py-10 sm:px-12 sm:py-12 rounded-3xl
                       bg-neutral-900 border border-neutral-700 max-h-[90vh] overflow-y-auto
                       animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 25px 80px -10px rgba(217,70,239,0.35)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-8 w-40 h-40 rounded-full blur-3xl opacity-30 bg-fuchsia-500" />

            <div className="relative flex items-center justify-center mb-6 py-2">
              <div style={current.preview}>{current.isText ? current.text : null}</div>
            </div>

            <p className="relative text-sm uppercase tracking-[0.3em] text-neutral-500 mb-2">
              Here's the CSS
            </p>
            <h2 className="relative text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-br from-white to-fuchsia-400 bg-clip-text text-transparent mb-6">
              {current.title}
            </h2>

            <div className="relative w-full rounded-xl border border-fuchsia-500/30 bg-[#0b0b0f] overflow-hidden mb-6">
              <pre className="px-5 py-4 text-sm leading-relaxed overflow-x-auto font-mono text-neutral-200 text-left">
                <code>{current.code}</code>
              </pre>
            </div>

            <p className="relative text-sm text-neutral-300 leading-relaxed text-center">
              {current.explanation}
            </p>

            <button
              onClick={() => setRevealedAnswer(false)}
              className="relative mt-8 px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700
                         text-sm font-medium border border-neutral-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default CssPropertyChain