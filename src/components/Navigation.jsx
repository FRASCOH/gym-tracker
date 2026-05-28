import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Dumbbell, History } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/plans', icon: ClipboardList, label: 'Schede' },
  { to: '/workout', icon: Dumbbell, label: 'Allenati' },
  { to: '/history', icon: History, label: 'Storico' },
];

export default function Navigation() {
  return (
    <nav className="bottom-nav" id="main-navigation">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end={to === '/'}
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
