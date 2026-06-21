import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiGit,
  SiGithub,
  SiBootstrap,
  SiTailwindcss,
  SiNpm,
  SiDocker,
  SiFirebase,
  SiRedux,
  SiExpress,
  SiVercel,
  SiNetlify,
  SiPostman,
  SiTypescript,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'

const ICONS = [
  { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', Icon: SiCss, color: '#1572B6' },
  { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
  { name: 'Git', Icon: SiGit, color: '#F05032' },
  { name: 'GitHub', Icon: SiGithub, color: '#ffffff' },
  { name: 'Bootstrap', Icon: SiBootstrap, color: '#7952B3' },
  { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38BDF8' },
  { name: 'VS Code', Icon: VscVscode, color: '#007ACC' },
  { name: 'npm', Icon: SiNpm, color: '#CB3837' },
  { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
  { name: 'Firebase', Icon: SiFirebase, color: '#FFCA28' },
  { name: 'Redux', Icon: SiRedux, color: '#764ABC' },
  { name: 'Express.js', Icon: SiExpress, color: '#ffffff' },
  { name: 'Vercel', Icon: SiVercel, color: '#ffffff' },
  { name: 'Netlify', Icon: SiNetlify, color: '#00C7B7' },
  { name: 'Postman', Icon: SiPostman, color: '#FF6C37' },
]

const RULES = [
  'You\'ll see one tech logo at a time, picked in random order.',
  'You get 10 seconds to study it before it blurs out.',
  'Once blurred, try to recall the name before revealing the answer.',
  'Each icon appears only once — there\'s no repeats in a round.',
  `This round has ${ICONS.length} icons total.`,
]

// Fisher-Yates shuffle
function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const TIMER_DURATION = 10

function IconRecall() {
  const navigate = useNavigate()
  const [hasStarted, setHasStarted] = useState(false)
  const [shuffled, setShuffled] = useState(() => shuffleArray(ICONS))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [isBlurred, setIsBlurred] = useState(false)
  const [revealedAnswer, setRevealedAnswer] = useState(false)

  const current = shuffled[currentIndex]
  const isLastIcon = currentIndex >= shuffled.length - 1

  // Countdown timer — only runs once the round has actually started
  useEffect(() => {
    if (!hasStarted || isBlurred) return

    if (timeLeft <= 0) {
      setIsBlurred(true)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, isBlurred, hasStarted])

  // Lock body scroll while the reveal modal is open
  useEffect(() => {
    document.body.style.overflow = revealedAnswer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [revealedAnswer])

  // Close reveal modal with Escape key
  useEffect(() => {
    if (!revealedAnswer) return
    const onKey = (e) => {
      if (e.key === 'Escape') setRevealedAnswer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealedAnswer])

  const handleStart = () => {
    setShuffled(shuffleArray(ICONS))
    setCurrentIndex(0)
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
    setHasStarted(true)
  }

  const handleNext = useCallback(() => {
    if (isLastIcon) return
    setCurrentIndex((i) => i + 1)
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
  }, [isLastIcon])

  const handleRestart = () => {
    setShuffled(shuffleArray(ICONS))
    setCurrentIndex(0)
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
  }

  const progressPercent = (timeLeft / TIMER_DURATION) * 100

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-indigo-600/25 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] bg-emerald-600/15 rounded-full blur-[120px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 flex flex-col items-center min-h-screen">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Icon Recall
          </h1>
          {hasStarted ? (
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6">
              <span className="text-3xl sm:text-4xl">🎯</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-white to-indigo-400 bg-clip-text text-transparent mb-2">
              Icon Recall
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md">
              How many tech logos can you remember at a glance?
            </p>

            <ul className="w-full max-w-md text-left space-y-3 mb-10">
              {RULES.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-neutral-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-base font-semibold transition-colors flex items-center gap-2"
            >
              Start Round
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            {/* Card */}
            <div className="w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 sm:p-10 flex flex-col items-center">
              {/* Timer ring */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgb(38 38 38)" strokeWidth="6" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={isBlurred ? '#ef4444' : '#6366f1'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - progressPercent / 100)}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl font-semibold">
                  {isBlurred ? '⏱' : timeLeft}
                </div>
              </div>

              {/* Icon display */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-6 sm:mb-8">
                <div
                  key={currentIndex}
                  className={`transition-all duration-500 ${
                    isBlurred ? 'blur-xl scale-95 opacity-60' : 'blur-0 scale-100 opacity-100'
                  }`}
                >
                  <current.Icon
                    className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-[0_0_25px_rgba(99,102,241,0.25)]"
                    style={{ color: current.color }}
                  />
                </div>

                {isBlurred && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs uppercase tracking-wider text-neutral-500 bg-neutral-950/70 px-3 py-1 rounded-full border border-neutral-800">
                      Guess it!
                    </span>
                  </div>
                )}
              </div>

              {/* Reveal trigger */}
              <div className="h-10 mb-4 sm:mb-6">
                {isBlurred && (
                  <button
                    onClick={() => setRevealedAnswer(true)}
                    className="text-sm px-4 py-2 rounded-lg border border-indigo-500/40 text-indigo-300
                               hover:bg-indigo-500/10 hover:border-indigo-400 transition-colors
                               flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Reveal answer
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                {!isBlurred && (
                  <button
                    onClick={() => setIsBlurred(true)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition-colors border border-neutral-700"
                  >
                    Blur now
                  </button>
                )}

                {isLastIcon && isBlurred ? (
                  <button
                    onClick={handleRestart}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition-colors"
                  >
                    Restart
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!isBlurred}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1
                      ${
                        isBlurred
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                      }`}
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex flex-wrap gap-2 mt-6 sm:mt-8 justify-center max-w-md">
              {shuffled.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < currentIndex
                      ? 'bg-indigo-500'
                      : i === currentIndex
                      ? 'bg-indigo-400 scale-125'
                      : 'bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </>
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
            className="relative flex flex-col items-center px-10 py-12 sm:px-20 sm:py-16 rounded-3xl
                       bg-neutral-900 border border-neutral-700
                       animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 25px 80px -10px ${current.color}55`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* glow behind icon */}
            <div
              className="absolute top-10 w-40 h-40 rounded-full blur-3xl opacity-40"
              style={{ backgroundColor: current.color }}
            />

            <current.Icon
              className="relative w-24 h-24 mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              style={{ color: current.color }}
            />

            <p className="relative text-sm uppercase tracking-[0.3em] text-neutral-500 mb-2">
              That was
            </p>
            <h2
              className="relative text-5xl sm:text-6xl font-extrabold text-center bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff, ${current.color})`,
              }}
            >
              {current.name}
            </h2>

            <button
              onClick={() => setRevealedAnswer(false)}
              className="relative mt-10 px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700
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

export default IconRecall