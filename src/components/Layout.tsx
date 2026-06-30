import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../api/portal';
import { PortalPermissions } from '../types/portal';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="portal-header">
        <div className="portal-header-inner">
          <div className="header-brand">
            <div className="header-logo" aria-hidden="true">GH</div>
            <div>
              <strong>GuestHub</strong>
              <small>Registro ospiti · Alloggiati Web / Ross1000</small>
            </div>
          </div>
          <div className="header-user">
            <span className="header-user-name">{user?.name || user?.username}</span>
            <button type="button" className="btn-logout" onClick={() => void logout()}>
              Esci
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <nav className="portal-nav">
          <NavLink to="/" className={({ isActive }) => `portal-nav-link${isActive ? ' is-active' : ''}`} end>
            Ricerca
          </NavLink>
          {hasPermission(user, PortalPermissions.STATISTICS) && (
            <NavLink to="/statistiche" className={({ isActive }) => `portal-nav-link${isActive ? ' is-active' : ''}`}>
              Statistiche
            </NavLink>
          )}
        </nav>
        <Outlet />
      </main>
    </div>
  );
}
