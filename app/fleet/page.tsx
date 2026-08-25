import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

const groups: { name: string; people: { name: string; role: string }[] }[] = [
  { name: 'Overseer', people: [{ name: 'Rose', role: 'overseer' }] },
  {
    name: 'Personal',
    people: [
      { name: 'Adriana', role: 'jobs' },
      { name: 'Cynda', role: 'research' },
      { name: 'Ezra', role: 'life' },
      { name: 'Katrina', role: 'health' },
      { name: 'Kloe', role: 'calendar' },
      { name: 'Maria', role: 'Linux tutor' },
    ],
  },
  {
    name: 'Publishing',
    people: [
      { name: 'Gloria', role: 'posts' },
      { name: 'Molly', role: 'stories' },
    ],
  },
  {
    name: 'Intel',
    people: [
      { name: 'Cathy', role: 'AI / Quantum' },
      { name: 'Sarah', role: 'cyber' },
    ],
  },
  {
    name: 'Build',
    people: [
      { name: 'Penelope', role: 'code' },
      { name: 'Jennifer', role: 'sites' },
      { name: 'Seraphina', role: 'monitoring' },
    ],
  },
  {
    name: 'Ops',
    people: [{ name: 'Bianca', role: 'files and host hygiene' }],
  },
];

export default function FleetPage() {
  return (
    <main className="min-h-screen relative z-10">
      <header className="py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/30 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Portal</span>
          </Link>
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-light gradient-text">The Fleet</h1>
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Rose oversees a small set of assistants around James Ortega.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-8">
        <section className="rounded-2xl border border-white/10 bg-black/25 p-3 shadow-[0_0_30px_rgba(168,139,250,0.12)] backdrop-blur-sm">
          <img
            src="/fleet.jpg"
            alt="The Fleet org chart"
            className="block h-auto w-full rounded-xl"
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
            >
              <h2 className="text-sm uppercase tracking-wide text-cyan-300 mb-2">{group.name}</h2>
              <ul className="space-y-1 text-sm text-gray-300">
                {group.people.map((person) => (
                  <li key={person.name}>
                    <span className="text-white">{person.name}</span>
                    <span className="text-gray-500"> — {person.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
