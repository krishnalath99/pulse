import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

function Nav() {
  return (
    <nav className="flex items-center gap-6 border-b border-slate-800 bg-slate-900 px-8 py-4">
      <span className="text-xl font-bold text-emerald-400">Pulse</span>
      <Link to="/" className="text-slate-300 hover:text-white">
        Dashboard
      </Link>
      <Link to="/settings" className="text-slate-300 hover:text-white">
        Settings
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        <Nav />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
