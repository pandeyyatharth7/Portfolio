import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/common/SectionHeader'
import Reveal from '@/components/common/Reveal'
import { profile } from '@/data/portfolio'

/**
 * Contact page.
 * - Direct contact points (email, phone, LinkedIn, GitHub) as clickable cards.
 * - A client-side contact form. By default it opens a prefilled mailto: (zero-config).
 *   If `VITE_FORMSPREE_ID` is set in env, it POSTs to Formspree instead.
 */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'

  const FORMSPREE = import.meta.env.VITE_FORMSPREE_ID

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    // Basic client-side validation — friendly, not annoying.
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setStatus('error')
      return
    }

    // If Formspree is configured, use it. Otherwise fall back to mailto: so
    // the form works out of the box with no backend.
    if (FORMSPREE) {
      setStatus('sending')
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          setStatus('sent')
          setForm({ name: '', email: '', message: '' })
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
      return
    }

    // mailto: fallback.
    const subject = encodeURIComponent(`Portfolio contact — ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.contact.email}?subject=${subject}&body=${body}`
    setStatus('sent')
  }

  return (
    <div className="container-page pt-32 pb-20">
      <SectionHeader
        eyebrow="Contact"
        title="The best way to start a conversation."
        subtitle="If you’re hiring for an AI/ML or SWE role — or you just want to compare notes on a model, a deployment, or a problem — drop a line. I read everything."
      />

      <div className="mt-14 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        {/* ---- Direct contact points ---- */}
        <div className="space-y-3">
          <ContactCard
            label="Email"
            value={profile.contact.email}
            href={`mailto:${profile.contact.email}`}
            cta="Send an email"
          />
          <ContactCard
            label="Phone"
            value={profile.contact.phone}
            href={`tel:${profile.contact.phone.replace(/\s+/g, '')}`}
            cta="Call"
          />
          <ContactCard
            label="LinkedIn"
            value="linkedin.com/in/pandeyyatharth7"
            href={profile.contact.linkedin}
            cta="Open profile"
          />
          <ContactCard
            label="GitHub"
            value="github.com/pandeyyatharth7"
            href={profile.contact.github}
            cta="See code"
          />
        </div>

        {/* ---- Form ---- */}
        <Reveal>
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-ink-600 bg-ink-800/50 p-6 sm:p-8"
            noValidate
          >
            <p className="eyebrow text-lime">Or send a message</p>
            <h2 className="mt-2 text-xl font-medium text-ink-100">
              Tell me a little about what you have in mind.
            </h2>
            <p className="mt-2 text-sm text-ink-300">
              {FORMSPREE
                ? 'Submissions go straight to my inbox via Formspree.'
                : 'Submissions open your email client with the message pre-filled — no backend needed.'}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Your name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
              <Field
                label="Your email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-ink-200" htmlFor="message">
                Message <span className="text-lime">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={onChange}
                placeholder="Hi Yatharth — we’re hiring for…"
                required
                className="mt-1.5 w-full resize-y rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-300 transition-colors focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="btn-primary"
                disabled={status === 'sending'}
                data-cursor="link"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
                <span aria-hidden="true">→</span>
              </button>

              <StatusPill status={status} />
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  )
}

function ContactCard({ label, value, href, cta }) {
  return (
    <Reveal>
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noreferrer"
        className="card-lift group flex items-center justify-between gap-3 rounded-2xl border border-ink-600 bg-ink-800/40 p-4"
        data-cursor="link"
      >
        <div className="min-w-0">
          <p className="eyebrow text-ink-300">{label}</p>
          <p className="mt-1 truncate font-mono text-sm text-ink-100">{value}</p>
        </div>
        <span className="shrink-0 text-xs uppercase tracking-widest text-ink-300 transition-colors group-hover:text-lime">
          {cta} ↗
        </span>
      </a>
    </Reveal>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder, autoComplete, required }) {
  return (
    <div>
      <label className="block text-sm text-ink-200" htmlFor={name}>
        {label} {required && <span className="text-lime">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-300 transition-colors focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime"
      />
    </div>
  )
}

function StatusPill({ status }) {
  if (status === 'idle') return null
  if (status === 'sending') {
    return <span className="text-xs text-ink-300">Sending…</span>
  }
  if (status === 'sent') {
    return (
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-lime"
      >
        ✓ Message sent — talk soon.
      </motion.span>
    )
  }
  // error
  return (
    <span className="text-xs text-amber-300">
      Please fill in all fields with a valid email.
    </span>
  )
}
