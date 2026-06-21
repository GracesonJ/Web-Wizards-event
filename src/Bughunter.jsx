import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const SNIPPETS = [
  {
    title: 'Centering a div',
    lang: 'CSS',
    code: `.box {
  display: flex;
  align-item: center;
  justify-content: center;
}`,
    buggyLines: [3],
    explanation: "Typo: it's align-items (plural), not align-item. The browser silently ignores unknown properties, so vertical centering never applies.",
  },
  {
    title: 'Looping through an array',
    lang: 'JavaScript',
    code: `let total = 0;
for (let i = 0; i <= arr.length; i++) {
  total += arr[i];
}`,
    buggyLines: [2],
    explanation: 'Off-by-one error: i <= arr.length runs one extra iteration, reading arr[arr.length] which is undefined, turning total into NaN.',
  },
  {
    title: 'Bootstrap button + onclick',
    lang: 'HTML',
    code: `<button class="btn btn-primary"
  onclick="handleClick()">
  Submit
</button>`,
    buggyLines: [2],
    explanation: 'Nothing technically wrong with vanilla HTML, but in JSX this needs onClick (camelCase) — onclick is silently ignored by React.',
  },
  {
    title: 'While loop counter',
    lang: 'JavaScript',
    code: `let i = 0;
while (i < 5) {
  console.log(i);
}`,
    buggyLines: [3],
    explanation: 'i is never incremented inside the loop, causing an infinite loop. Missing i++; before the closing brace.',
  },
  {
    title: 'Flex container gap',
    lang: 'CSS',
    code: `.container {
  display: flex
  gap: 16px;
}`,
    buggyLines: [2],
    explanation: 'Missing semicolon after flex — this breaks parsing of the next line in some minifiers/older browsers and is easy to miss.',
  },
  {
    title: 'Bootstrap grid columns',
    lang: 'HTML',
    code: `<div class="row">
  <div class="col-md-6">Left</div>
  <div class="col-md-7">Right</div>
</div>`,
    buggyLines: [2, 3],
    explanation: 'col-md-6 + col-md-7 = 13 columns, exceeding the 12-column grid. The "Right" column will wrap onto a new row unexpectedly.',
  },
  {
    title: 'String comparison',
    lang: 'JavaScript',
    code: `function isAdult(age) {
  if (age = 18) {
    return true;
  }
  return false;
}`,
    buggyLines: [2],
    explanation: 'Single = is assignment, not comparison. This sets age to 18 (always truthy) instead of checking if (age === 18).',
  },
  {
    title: 'For loop with array length',
    lang: 'JavaScript',
    code: `const items = ['a', 'b', 'c'];
for (let i = 0; i < items.length; i++) {
  console.log(item[i]);
}`,
    buggyLines: [3],
    explanation: "Variable name typo: the array is items but the loop logs item[i] (no 's'), which throws a ReferenceError.",
  },
  {
    title: 'Bootstrap navbar toggler',
    lang: 'HTML',
    code: `<button class="navbar-toggler" type="button"
  data-bs-toggle="collapse"
  data-bs-traget="#navbarNav">
</button>`,
    buggyLines: [3],
    explanation: 'Typo: data-bs-traget should be data-bs-target. The navbar toggle button will render but silently fail to open the menu.',
  },
  {
    title: 'CSS box sizing',
    lang: 'CSS',
    code: `.card {
  width: 300px;
  padding: 20px;
  border: 2px solid #333;
}`,
    buggyLines: [2, 3, 4],
    explanation: 'Without box-sizing: border-box, padding and border add to the 300px width, making the actual rendered box 344px wide instead of 300px.',
  },
  {
    title: 'Function default parameter',
    lang: 'JavaScript',
    code: `function greet(name = 'Guest') {
  console.log('Hello, ' + name);
}
greet(null);`,
    buggyLines: [4],
    explanation: 'Default parameters only kick in for undefined, not null. Calling greet(null) logs "Hello, null" instead of using the default.',
  },
  {
    title: 'Nested loop sum',
    lang: 'JavaScript',
    code: `let sum = 0;
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    sum += i * j;
  }
}
console.log(sum)`,
    buggyLines: [7],
    explanation: 'Missing semicolon at the end of the console.log statement. Harmless here due to ASI, but inconsistent style can cause real bugs in minified or chained code.',
  },
  {
    title: 'React useEffect dependency',
    lang: 'JavaScript',
    code: `useEffect(() => {
  fetchData(userId);
}, []);`,
    buggyLines: [3],
    explanation: 'Empty dependency array means this only runs once on mount. If userId changes, fetchData is never re-called. userId should be in the deps array: [userId].',
  },
  {
    title: 'CSS z-index not working',
    lang: 'CSS',
    code: `.tooltip {
  z-index: 999;
  color: white;
}`,
    buggyLines: [2],
    explanation: 'z-index has no effect without a positioning context. The element needs position: relative, absolute, fixed, or sticky for z-index to apply.',
  },
  {
    title: 'Bootstrap modal trigger',
    lang: 'HTML',
    code: `<button type="button"
  data-bs-toggle="modal"
  data-bs-target="myModal">
  Open
</button>`,
    buggyLines: [3],
    explanation: 'data-bs-target needs a CSS selector with a # prefix: data-bs-target="#myModal". Without #, Bootstrap cannot find the modal element.',
  },
  {
    title: 'Array destructuring',
    lang: 'JavaScript',
    code: `const [name, age] = { name: 'Ali', age: 25 };
console.log(name);`,
    buggyLines: [1],
    explanation: 'Array destructuring cannot be used on a plain object. Objects must use curly braces: const { name, age } = { name: "Ali", age: 25 }.',
  },
  {
    title: 'CSS specificity override',
    lang: 'CSS',
    code: `p {
  color: blue;
}
.intro p {
  color: red;
}
p {
  color: green;
}`,
    buggyLines: [7, 8, 9],
    explanation: '.intro p has higher specificity than a bare p selector, so the last p { color: green } block will NOT override .intro p { color: red } inside .intro.',
  },
  {
    title: 'Promise then chaining',
    lang: 'JavaScript',
    code: `fetch('/api/data')
  .then(res => res.json())
  .then(data => {
    return data;
  })
  .catch(err => console.log(err));
  .finally(() => setLoading(false));`,
    buggyLines: [7],
    explanation: 'There is a stray semicolon after the .catch() line, which terminates the expression early. The .finally() call is then a syntax error — remove the semicolon on line 6.',
  },
  {
    title: 'Input placeholder styling',
    lang: 'CSS',
    code: `input::placeholder {
  color: #999;
  font-size: 14px;
  font-weight: bold;
}`,
    buggyLines: [4],
    explanation: 'font-weight is not inherited by ::placeholder in all browsers and may be silently ignored. Use opacity or color tweaks instead; bold placeholder text is also a UX anti-pattern.',
  },
  {
    title: 'React state update',
    lang: 'JavaScript',
    code: `const [count, setCount] = useState(0);

function increment() {
  setCount(count + 1);
  setCount(count + 1);
}`,
    buggyLines: [4, 5],
    explanation: 'Both setCount calls read the same stale count value, so the counter only increments by 1 instead of 2. Use the functional form: setCount(prev => prev + 1) to always build on the latest state.',
  },
]

const RULES = [
  "You'll see one buggy code snippet at a time, picked in random order.",
  'You get 10 seconds to study it before it blurs out.',
  'Once blurred, try to recall which line has the bug before revealing the answer.',
  "Each snippet appears only once — there's no repeats in a round.",
  `This round has ${SNIPPETS.length} snippets total.`,
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

const LANG_COLORS = {
  HTML: { text: '#E34F26', bg: 'rgba(227,79,38,0.12)' },
  CSS: { text: '#38BDF8', bg: 'rgba(56,189,248,0.12)' },
  JavaScript: { text: '#F7DF1E', bg: 'rgba(247,223,30,0.12)' },
}

function Bughunter() {
  const navigate = useNavigate()
  const [hasStarted, setHasStarted] = useState(false)
  const [shuffled, setShuffled] = useState(() => shuffleArray(SNIPPETS))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [isBlurred, setIsBlurred] = useState(false)
  const [revealedAnswer, setRevealedAnswer] = useState(false)

  const current = shuffled[currentIndex]
  const isLastSnippet = currentIndex >= shuffled.length - 1
  const langColor = LANG_COLORS[current.lang] || LANG_COLORS.JavaScript

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
    setShuffled(shuffleArray(SNIPPETS))
    setCurrentIndex(0)
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
    setHasStarted(true)
  }

  const handleNext = useCallback(() => {
    if (isLastSnippet) return
    setCurrentIndex((i) => i + 1)
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
  }, [isLastSnippet])

  const handleRestart = () => {
    setShuffled(shuffleArray(SNIPPETS))
    setCurrentIndex(0)
    setTimeLeft(TIMER_DURATION)
    setIsBlurred(false)
    setRevealedAnswer(false)
    setHasStarted(false)
  }

  const progressPercent = (timeLeft / TIMER_DURATION) * 100

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-rose-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-amber-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] bg-indigo-600/15 rounded-full blur-[120px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 py-12 flex flex-col items-center min-h-screen">
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
          <h1 className="text-xl sm:text-4xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Bug Hunter
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6">
              <span className="text-3xl sm:text-4xl">🐛</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-white to-rose-400 bg-clip-text text-transparent mb-2">
              Bug Hunter Memory
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md">
              Can you spot the bug before the clock runs out?
            </p>

            <ul className="w-full max-w-md text-left space-y-3 mb-10">
              {RULES.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-neutral-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-base font-semibold transition-colors flex items-center gap-2"
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
            <div className="w-full bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center">
              {/* Timer ring + language tag */}
              <div className="w-full flex items-center justify-between mb-6">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                  style={{ color: langColor.text, backgroundColor: langColor.bg }}
                >
                  {current.lang}
                </span>

                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="23" fill="none" stroke="rgb(38 38 38)" strokeWidth="5" />
                    <circle
                      cx="28"
                      cy="28"
                      r="23"
                      fill="none"
                      stroke={isBlurred ? '#ef4444' : '#f43f5e'}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 23}
                      strokeDashoffset={2 * Math.PI * 23 * (1 - progressPercent / 100)}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {isBlurred ? '⏱' : timeLeft}
                  </div>
                </div>
              </div>

              {/* Snippet title */}
              <h3 className="w-full text-left text-sm font-medium text-neutral-400 mb-3">
                {current.title}
              </h3>

              {/* Code block */}
              <div className="relative w-full mb-6">
                <div
                  className={`rounded-xl border border-neutral-800 bg-[#0b0b0f] overflow-hidden transition-all duration-500 ${
                    isBlurred ? 'blur-md scale-[0.99] opacity-50' : 'blur-0 scale-100 opacity-100'
                  }`}
                >
                  {/* Fake terminal dots */}
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-neutral-800 bg-neutral-900/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <pre className="px-5 py-4 text-sm leading-relaxed overflow-x-auto font-mono text-neutral-200">
                    <code>
                      {current.code.split('\n').map((line, idx) => (
                        <div key={idx} className="flex">
                          <span className="select-none text-neutral-600 w-6 flex-shrink-0 text-right mr-4">
                            {idx + 1}
                          </span>
                          <span className="whitespace-pre">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {isBlurred && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 bg-neutral-950/80 px-3 py-1.5 rounded-full border border-neutral-700">
                      Did you spot it?
                    </span>
                  </div>
                )}
              </div>

              {/* Reveal trigger */}
              <div className="h-10 mb-4">
                {isBlurred && (
                  <button
                    onClick={() => setRevealedAnswer(true)}
                    className="text-sm px-4 py-2 rounded-lg border border-rose-500/40 text-rose-300
                               hover:bg-rose-500/10 hover:border-rose-400 transition-colors
                               flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Reveal the bug
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

                {isLastSnippet && isBlurred ? (
                  <button
                    onClick={handleRestart}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-sm font-semibold transition-colors"
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
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
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
            <div className="flex flex-wrap gap-2 mt-8 justify-center max-w-md">
              {shuffled.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < currentIndex ? 'bg-rose-500' : i === currentIndex ? 'bg-rose-400 scale-125' : 'bg-neutral-700'
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
            className="relative w-full max-w-lg flex flex-col items-center px-8 py-10 sm:px-12 sm:py-12 rounded-3xl
                       bg-neutral-900 border border-neutral-700
                       animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 25px 80px -10px rgba(244,63,94,0.35)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-8 w-40 h-40 rounded-full blur-3xl opacity-30 bg-rose-500" />

            <span
              className="relative px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4"
              style={{ color: langColor.text, backgroundColor: langColor.bg }}
            >
              {current.lang}
            </span>

            <p className="relative text-sm uppercase tracking-[0.3em] text-neutral-500 mb-2">
              The bug was on
            </p>
            <h2 className="relative text-5xl sm:text-6xl font-extrabold text-center bg-gradient-to-br from-white to-rose-400 bg-clip-text text-transparent mb-6">
              Line {current.buggyLines.join(', ')}
            </h2>

            {/* Highlighted code with the buggy line marked */}
            <div className="relative w-full rounded-xl border border-rose-500/30 bg-[#0b0b0f] overflow-hidden mb-6">
              <pre className="px-5 py-4 text-sm leading-relaxed overflow-x-auto font-mono text-neutral-200">
                <code>
                  {current.code.split('\n').map((line, idx) => {
                    const lineNum = idx + 1
                    const isBuggy = current.buggyLines.includes(lineNum)
                    return (
                      <div
                        key={idx}
                        className={`flex ${isBuggy ? 'bg-rose-500/15 -mx-5 px-5' : ''}`}
                      >
                        <span
                          className={`select-none w-6 flex-shrink-0 text-right mr-4 ${
                            isBuggy ? 'text-rose-400 font-bold' : 'text-neutral-600'
                          }`}
                        >
                          {lineNum}
                        </span>
                        <span className={`whitespace-pre ${isBuggy ? 'text-rose-300' : ''}`}>
                          {line}
                        </span>
                      </div>
                    )
                  })}
                </code>
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

export default Bughunter