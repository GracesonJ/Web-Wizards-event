import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const cards = [
    {
      title: 'Icon Recall',
      description: 'Test your memory of common UI icons and their meanings.',
      path: '/iconrecall',
      emoji: '🎯',
      glow: 'from-indigo-500/20 via-indigo-500/5',
      ring: 'group-hover:ring-indigo-500/40',
    },
    {
      title: 'Bug Hunter Memory',
      description: 'Sharpen your eye for spotting bugs hidden in code snippets.',
      path: '/bughunter',
      emoji: '🐞',
      glow: 'from-emerald-500/20 via-emerald-500/5',
      ring: 'group-hover:ring-emerald-500/40',
    },
    {
      title: 'CSS Property Chain',
      description: 'Practice chaining and recalling CSS properties in order.',
      path: '/csspropertychain',
      emoji: '🎨',
      glow: 'from-fuchsia-500/20 via-fuchsia-500/5',
      ring: 'group-hover:ring-fuchsia-500/40',
    },
  ]

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-indigo-600/25 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-fuchsia-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] bg-emerald-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Fade at the bottom for depth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-neutral-950 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* App title / brand header */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 flex-wrap text-center">
          <span className="text-2xl sm:text-3xl md:text-4xl">🧙</span>
          <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Web Wizards
          </span>
        </div>

        <p className="text-neutral-400 text-base sm:text-xl md:text-2xl text-center mb-8 sm:mb-12 px-2">
          Pick a game to start
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
          {cards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className={`group relative text-left rounded-2xl p-5 sm:p-6 overflow-hidden
                         bg-neutral-900/70 backdrop-blur-sm
                         border border-neutral-800 ring-1 ring-transparent
                         transition-all duration-300 ease-out
                         hover:-translate-y-1 hover:border-neutral-700
                         hover:shadow-xl hover:shadow-black/50
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         ${card.ring}`}
            >
              {/* Per-card gradient glow */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow} to-transparent
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative">
                <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-800/80 text-xl sm:text-2xl mb-4
                                group-hover:scale-105 transition-transform duration-300">
                  {card.emoji}
                </div>
                <h2 className="text-base sm:text-lg font-semibold mb-2 text-neutral-50">
                  {card.title}
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {card.description}
                </p>
                <span className="inline-flex items-center mt-4 text-sm text-indigo-400 group-hover:text-indigo-300">
                  Start
                  <svg
                    className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home