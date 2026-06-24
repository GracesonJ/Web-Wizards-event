import React, { useState, useEffect, useMemo } from 'react'
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

const ICON_POOL = [
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

const COLS = 5
const ROWS = 4
const TOTAL_CELLS = COLS * ROWS // 20
const TIMER_DURATION = 10
const BLANK_PROBABILITY = 0.18 // ~18% chance any given cell is left blank

const RULES = [
  `You'll see a ${COLS}×${ROWS} grid of tech icons for 10 seconds.`,
  'Some icons may repeat, and some cells may be left blank.',
  'Once it blurs, you\'ll get one question about what you saw.',
  'Study the whole grid carefully — rows, columns, and repeats all matter.',
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

// Build a random grid: each cell is either null (blank) or a random icon from the pool
function generateGrid() {
  const cells = []
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (Math.random() < BLANK_PROBABILITY) {
      cells.push(null)
    } else {
      const icon = ICON_POOL[Math.floor(Math.random() * ICON_POOL.length)]
      cells.push(icon)
    }
  }
  return cells
}

// Analyze the grid to compute answers to all possible question types
function analyzeGrid(cells) {
  const counts = {}
  cells.forEach((cell) => {
    if (cell) counts[cell.name] = (counts[cell.name] || 0) + 1
  })

  const countEntries = Object.entries(counts)
  const maxCount = countEntries.length ? Math.max(...countEntries.map(([, c]) => c)) : 0
  const mostRepeated = countEntries.filter(([, c]) => c === maxCount)

  const blankColumns = []
  for (let col = 0; col < COLS; col++) {
    let allBlank = true
    for (let row = 0; row < ROWS; row++) {
      if (cells[row * COLS + col] !== null) {
        allBlank = false
        break
      }
    }
    if (allBlank) blankColumns.push(col + 1)
  }

  const totalBlankCells = cells.filter((c) => c === null).length
  const iconsWithoutRepetition = countEntries.filter(([, c]) => c === 1).length
  const reactCount = counts['React'] || 0

  return {
    mostRepeated,
    maxCount,
    blankColumns,
    totalBlankCells,
    iconsWithoutRepetition,
    reactCount,
  }
}

function buildQuestions(stats) {
  return [
    // {
    //   id: 'mostRepeated',
    //   prompt: 'Which icon appeared the most times in the grid?',
    //   answer:
    //     stats.maxCount === 0
    //       ? 'No icon repeated — the grid had no duplicates.'
    //       : stats.mostRepeated.length > 1
    //       ? `It was a tie: ${stats.mostRepeated.map(([n]) => n).join(', ')} — each appeared ${stats.maxCount} times.`
    //       : `${stats.mostRepeated[0][0]} — it appeared ${stats.maxCount} times.`,
    // },
    // {
    //   id: 'blankColumn',
    //   prompt: 'Which column was completely blank (no icons at all)?',
    //   answer:
    //     stats.blankColumns.length === 0
    //       ? 'No column was fully blank — every column had at least one icon.'
    //       : stats.blankColumns.length === 1
    //       ? `Column ${stats.blankColumns[0]} was completely blank.`
    //       : `Columns ${stats.blankColumns.join(', ')} were completely blank.`,
    // },
    // {
    //   id: 'totalBlank',
    //   prompt: 'How many empty cells were there in total?',
    //   answer: `There were ${stats.totalBlankCells} empty cell${stats.totalBlankCells === 1 ? '' : 's'} in the grid.`,
    // },
    // {
    //   id: 'noRepeat',
    //   prompt: 'How many icons appeared exactly once (no repeats)?',
    //   answer: `${stats.iconsWithoutRepetition} icon${stats.iconsWithoutRepetition === 1 ? '' : 's'} appeared exactly once.`,
    // },
    {
      id: 'reactCount',
      prompt: 'How many times did the React icon appear?',
      answer:
        stats.reactCount === 0
          ? 'React didn\'t appear in this grid at all.'
          : `React appeared ${stats.reactCount} time${stats.reactCount === 1 ? '' : 's'}.`,
    },
  ]
}

function IconRecall() {
  const navigate = useNavigate()
  const [hasStarted, setHasStarted] = useState(false)
  const [grid, setGrid] = useState(() => generateGrid())
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [isBlurred, setIsBlurred] = useState(false)
  const [revealedAnswer, setRevealedAnswer] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(null)

  const stats = useMemo(() => analyzeGrid(grid), [grid])

  useEffect(() => {
    if (!hasStarted || isBlurred) return

    if (timeLeft <= 0) {
      setIsBlurred(true)
      const questions = buildQuestions(stats)
      const picked = questions[Math.floor(Math.random() * questions.length)]
      setActiveQuestion(picked)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, isBlurred, hasStarted, stats])

  useEffect(() => {
    document.body.style.overflow = revealedAnswer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [revealedAnswer])

  useEffect(() => {
    if (!revealedAnswer) return
    const onKey = (e) => {
      if (e.key === 'Escape') setRevealedAnswer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealedAnswer])

  const handleStart = () => {
    setGrid(generateGrid())
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
    setActiveQuestion(null)
    setHasStarted(true)
  }

  const handleBlurNow = () => {
    setIsBlurred(true)
    const questions = buildQuestions(stats)
    const picked = questions[Math.floor(Math.random() * questions.length)]
    setActiveQuestion(picked)
  }

  const handlePlayAgain = () => {
    setGrid(generateGrid())
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
    setActiveQuestion(null)
    setHasStarted(true)
  }

  const progressPercent = (timeLeft / TIMER_DURATION) * 100

  return (
    <div className="relative h-screen bg-neutral-950 text-neutral-100 overflow-hidden flex flex-col">
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

      <div className="relative w-full h-full max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Icon Recall
          </h1>
          <span className="w-12" />
        </div>

        {!hasStarted ? (
          /* ----------- Start / rules screen ----------- */
          <div className="flex-1 w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center overflow-y-auto">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4 sm:mb-6">
              <span className="text-2xl sm:text-4xl">🎯</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-br from-white to-indigo-400 bg-clip-text text-transparent mb-2">
              Icon Recall
            </h2>
            <p className="text-neutral-400 mb-5 sm:mb-8 max-w-md text-sm sm:text-base">
              Can you spot the patterns hiding in a grid of tech logos?
            </p>

            <ul className="w-full max-w-md text-left space-y-2 sm:space-y-3 mb-6 sm:mb-10">
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
          /* ----------- Game screen: grid left, timer panel right ----------- */
          <div className="flex-1 w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-3 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-6 overflow-hidden">
            {/* Left: grid */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className={`grid gap-1.5 sm:gap-3 w-full h-full max-h-full transition-all duration-500 ${
                    isBlurred ? 'blur-xl scale-[0.97] opacity-50' : 'blur-0 scale-100 opacity-100'
                  }`}
                  style={{
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
                  }}
                >
                  {grid.map((cell, i) => (
                    <div
                      key={i}
                      className="rounded-md sm:rounded-xl bg-[#0b0b0f] border border-neutral-800 flex items-center justify-center min-h-0"
                    >
                      {cell ? (
                        <cell.Icon
                          className="w-[55%] h-[55%] max-w-9 max-h-9 sm:max-w-12 sm:max-h-12"
                          style={{ color: cell.color }}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>

                {isBlurred && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 bg-neutral-950/80 px-3 py-1.5 rounded-full border border-neutral-700">
                      Grid locked
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: timer + question + controls */}
            <div className="flex flex-col items-center justify-center w-full sm:w-64 flex-shrink-0 gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-neutral-800 pt-4 sm:pt-0 sm:pl-6">
              {/* Big timer ring */}
              <div className="relative w-28 h-28 sm:w-40 sm:h-40">
                <svg className="w-28 h-28 sm:w-40 sm:h-40 -rotate-90" viewBox="0 0 80 80">
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
                <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-bold">
                  {isBlurred ? '⏱' : timeLeft}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-500 text-center -mt-2">
                {isBlurred ? 'Time\'s up!' : 'Study the grid'}
              </p>

              {/* Question */}
              {isBlurred && activeQuestion && (
                <p className="text-sm sm:text-base font-semibold text-neutral-100 text-center leading-snug">
                  {activeQuestion.prompt}
                </p>
              )}

              {/* Reveal trigger */}
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

              {/* Controls */}
              {!isBlurred && (
                <button
                  onClick={handleBlurNow}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition-colors border border-neutral-700"
                >
                  Blur now
                </button>
              ) 
              // : (
              //   <button
              //     onClick={handlePlayAgain}
              //     className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition-colors flex items-center gap-1"
              //   >
              //     New round
              //     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              //     </svg>
              //   </button>
              // )
              }
            </div>
          </div>
        )}
      </div>

      {/* Center-screen reveal modal */}
      {revealedAnswer && activeQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4
                     animate-[fadeIn_0.25s_ease-out]"
          onClick={() => setRevealedAnswer(false)}
        >
          <div
            className="relative w-full max-w-lg flex flex-col items-center px-8 py-10 sm:px-12 sm:py-12 rounded-3xl
                       bg-neutral-900 border border-neutral-700 max-h-[90vh] overflow-y-auto
                       animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 25px 80px -10px rgba(99,102,241,0.35)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-8 w-40 h-40 rounded-full blur-3xl opacity-30 bg-indigo-500" />

            <p className="relative text-sm uppercase tracking-[0.3em] text-neutral-500 mb-3">
              {activeQuestion.prompt}
            </p>

            <h2 className="relative text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-br from-white to-indigo-400 bg-clip-text text-transparent mb-2 leading-snug">
              {activeQuestion.answer}
            </h2>

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

export default IconRecall