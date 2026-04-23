import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-rose-400">404 — Not Found</h1>
      <p className="mt-2 text-slate-400">This route doesn't exist.</p>
      <Link to="/" className="mt-4 inline-block text-emerald-400 underline">
        Go home
      </Link>
    </div>
  );
}
