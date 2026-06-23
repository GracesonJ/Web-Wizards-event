import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Each challenge: a CSS rule's lines, already in "correct" conventional order.
// We shuffle the lines for display, and reveal shows them back in this order
// with a short note on why that's the conventional sequence.
// Convention used: Positioning -> Display/Box model -> Sizing -> Spacing -> Border/Background -> Typography -> Visual effects (shadow/transform/transition)
const CHALLENGES = [
  {
    title: 'Card layout',
    selector: '.card',
    lines: [
      'position: relative;',
      'display: flex;',
      'width: 280px;',
      'padding: 20px;',
      'background: #1e1b4b;',
      'border-radius: 16px;',
      'color: #fff;',
      'box-shadow: 0 10px 30px rgba(0,0,0,0.4);',
    ],
    note: 'Positioning comes first (it affects layout context), then display and sizing, then spacing, then visual styling like background and borders, then typography, and finally effects like shadows.',
  },
  {
    title: 'Navigation bar',
    selector: '.navbar',
    lines: [
      'position: fixed;',
      'display: flex;',
      'width: 100%;',
      'padding: 12px 24px;',
      'background: #18181b;',
      'border-bottom: 1px solid #27272a;',
      'font-size: 16px;',
    ],
    note: 'Fixed positioning is set first since it determines how the element behaves in the document, followed by display/layout, sizing, spacing, then background and border, then typography last.',
  },
  {
    title: 'Primary button',
    selector: '.btn-primary',
    lines: [
      'display: inline-block;',
      'padding: 12px 28px;',
      'background: #6366f1;',
      'border-radius: 8px;',
      'color: #fff;',
      'font-weight: 600;',
      'transition: background 0.2s ease;',
    ],
    note: 'Display and spacing come first to establish the box shape, then background and border styling, then text styling, with transition (a visual effect) placed last.',
  },
  {
    title: 'Modal overlay',
    selector: '.modal-overlay',
    lines: [
      'position: fixed;',
      'top: 0;',
      'width: 100vw;',
      'height: 100vh;',
      'background: rgba(0,0,0,0.7);',
      'display: flex;',
      'align-items: center;',
    ],
    note: 'Positioning and offsets (top) come first since they place the element on the page, then sizing (width/height), then background, then flex alignment which controls its children.',
  },
  {
    title: 'Input field',
    selector: '.input-field',
    lines: [
      'display: block;',
      'width: 100%;',
      'padding: 10px 14px;',
      'margin-bottom: 12px;',
      'border: 1px solid #3f3f46;',
      'border-radius: 6px;',
      'font-size: 14px;',
    ],
    note: 'Display and width set the box first, then internal spacing (padding) before external spacing (margin), then border styling, then typography last.',
  },
]

const RULES = [
  'You\'ll see one CSS rule with its property lines shuffled out of order.',
  'No timer here — take your time figuring out the conventional order.',
  'Conventional order: positioning → layout/sizing → spacing → background/border → typography → effects.',
  `This round has ${CHALLENGES.length} quick questions.`,
]

function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function CssPropertyChain() {
  const navigate = useNavigate()
  const [hasStarted, setHasStarted] = useState(false)
  const [shuffledChallenges, setShuffledChallenges] = useState(() => shuffleArray(CHALLENGES))
  const [shuffledLines, setShuffledLines] = useState(() => shuffleArray(CHALLENGES[0].lines))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealedAnswer, setRevealedAnswer] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const current = shuffledChallenges[currentIndex]
  const isLastChallenge = currentIndex >= shuffledChallenges.length - 1
  const isFirstChallenge = currentIndex === 0

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
    const freshChallenges = shuffleArray(CHALLENGES)
    setShuffledChallenges(freshChallenges)
    setShuffledLines(shuffleArray(freshChallenges[0].lines))
    setCurrentIndex(0)
    setRevealedAnswer(false)
    setIsFinished(false)
    setHasStarted(true)
  }

  const handleNext = () => {
    if (isLastChallenge) {
      setRevealedAnswer(false)
      setIsFinished(true)
      return
    }
    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)
    setShuffledLines(shuffleArray(shuffledChallenges[nextIndex].lines))
    setRevealedAnswer(false)
  }

  const handleBack = () => {
    if (isFirstChallenge) return
    const prevIndex = currentIndex - 1
    setCurrentIndex(prevIndex)
    setShuffledLines(shuffleArray(shuffledChallenges[prevIndex].lines))
    setRevealedAnswer(false)
  }

  const handlePlayAgain = () => {
    setHasStarted(false)
  }

  return (
    <div className="relative h-screen bg-neutral-950 text-neutral-100 overflow-hidden flex flex-col">
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

      <div className="relative w-full h-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            CSS Property Chain
          </h1>
          {hasStarted && !isFinished ? (
            <span className="text-sm text-neutral-500">
              {currentIndex + 1} / {shuffledChallenges.length}
            </span>
          ) : (
            <span className="w-12" />
          )}
        </div>

        {!hasStarted ? (
          /* ----------- Start / rules screen ----------- */
          <div className="flex-1 w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center mb-4 sm:mb-6">
              <span className="text-2xl sm:text-4xl">🎨</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-br from-white to-fuchsia-400 bg-clip-text text-transparent mb-2">
              CSS Property Chain
            </h2>
            <p className="text-neutral-400 mb-5 sm:mb-8 max-w-md text-sm sm:text-base">
              Can you figure out the conventional order CSS properties should be written in?
            </p>

            <ul className="w-full max-w-md text-left space-y-2 sm:space-y-3 mb-6 sm:mb-10">
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
          <div className="flex-1 w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 sm:p-14 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-br from-white to-fuchsia-400 bg-clip-text text-transparent mb-3">
              You finished!
            </h2>
            <p className="text-neutral-400 mb-8 sm:mb-10 max-w-sm text-sm sm:text-base">
              You went through all {shuffledChallenges.length} ordering challenges. Nice work training that CSS instinct.
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
          /* ----------- Game screen ----------- */
          <div className="flex-1 w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-5 sm:p-8 flex flex-col items-center">
            <h3 className="text-sm sm:text-base font-medium text-neutral-300 mb-1">{current.title}</h3>
            <p className="text-xs sm:text-sm text-neutral-500 mb-5 text-center">
              These lines are shuffled — what's the conventional order?
            </p>

            {/* Shuffled CSS block */}
            <div className="w-full rounded-xl border border-neutral-800 bg-[#0b0b0f] overflow-hidden mb-6">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-neutral-800 bg-neutral-900/60">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <pre className="px-5 py-4 text-sm sm:text-base leading-relaxed overflow-x-auto font-mono text-neutral-200">
                <code>
                  <span className="text-fuchsia-400">{current.selector}</span> {'{'}
                  {shuffledLines.map((line, idx) => (
                    <div key={idx} className="pl-4 sm:pl-6 text-neutral-200">
                      {line}
                    </div>
                  ))}
                  {'}'}
                </code>
              </pre>
            </div>

            {/* Reveal trigger */}
            <button
              onClick={() => setRevealedAnswer(true)}
              className="text-sm px-4 py-2 rounded-lg border border-fuchsia-500/40 text-fuchsia-300
                         hover:bg-fuchsia-500/10 hover:border-fuchsia-400 transition-colors
                         flex items-center gap-2 mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Reveal correct order
            </button>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                disabled={isFirstChallenge}
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

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-sm font-semibold transition-colors flex items-center gap-1"
              >
                {isLastChallenge ? 'Finish' : 'Next'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Progress dots */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-md">
              {shuffledChallenges.map((_, i) => (
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
          </div>
        )}
      </div>

      {/* Center-screen reveal modal */}
      {revealedAnswer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4
                     animate-[fadeIn_0.25s_ease-out]"
          onClick={() => setRevealedAnswer(false)}
        >
          <div
            className="relative w-full max-w-xl flex flex-col items-center px-6 py-8 sm:px-10 sm:py-10 rounded-3xl
                       bg-neutral-900 border border-neutral-700 max-h-[90vh] overflow-y-auto
                       animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 25px 80px -10px rgba(217,70,239,0.35)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-8 w-40 h-40 rounded-full blur-3xl opacity-30 bg-fuchsia-500" />

            <p className="relative text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">
              Correct order
            </p>

            <div className="relative w-full rounded-xl border border-fuchsia-500/30 bg-[#0b0b0f] overflow-hidden mb-6">
              <pre className="px-5 py-4 text-sm sm:text-base leading-relaxed overflow-x-auto font-mono text-left">
                <code>
                  <span className="text-fuchsia-400">{current.selector}</span> {'{'}
                  {current.lines.map((line, idx) => (
                    <div key={idx} className="pl-4 sm:pl-6 text-emerald-300">
                      {line}
                    </div>
                  ))}
                  {'}'}
                </code>
              </pre>
            </div>

            <p className="relative text-sm text-neutral-300 leading-relaxed text-center">
              {current.note}
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