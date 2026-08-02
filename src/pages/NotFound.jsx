import { Link } from 'react-router-dom'

/**
 * 404 page — kept light, on-theme.
 */
export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
      <p className="eyebrow text-lime">404</p>
      <h1 className="h-display mt-3 text-4xl text-ink-100 sm:text-5xl">
        That page doesn’t exist.
      </h1>
      <p className="mt-4 max-w-md text-pretty text-ink-200">
        The link may be old, or I may have re-organized things. Head back to the
        home page and try again.
      </p>
      <Link to="/" className="btn-primary mt-8" data-cursor="link">
        Back home
      </Link>
    </div>
  )
}
