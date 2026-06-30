import type { HistoryGroup } from '../types/portal';

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: string | null): string {
  if (!date) return '—';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

function statusPill(status?: string) {
  if (status === 'success') return <span className="channel-pill ok">OK</span>;
  if (status === 'failed' || status === 'error') return <span className="channel-pill fail">ERR</span>;
  if (!status) return <span className="channel-pill na">—</span>;
  return <span className="channel-pill badge-muted">{status}</span>;
}

type Props = { group: HistoryGroup };

export function HistoryGroupCard({ group }: Props) {
  const groupClass = group.summary.has_errors ? 'has-errors' : 'all-ok';

  return (
    <details className={`card history-group ${groupClass} portal-collapse`} style={{ marginTop: '0.75rem', marginBottom: 0 }}>
      <summary className="portal-collapse-summary history-group-header">
        <div className="portal-collapse-summary-main">
          <span className="portal-collapse-chevron" aria-hidden="true">›</span>
          <div>
            <div className="history-group-title">Prenotazione {group.codice_prenotazione}</div>
            <div className="history-group-meta muted">
              <span>{group.property_name}</span>
              <span>·</span>
              <span>{formatDateTime(group.submitted_at)}</span>
              {group.movement_date && (
                <>
                  <span>·</span>
                  <span>mov. {formatDate(group.movement_date)}</span>
                </>
              )}
              {group.nights_count != null && (
                <>
                  <span>·</span>
                  <span>{group.nights_count} notti</span>
                </>
              )}
              <span>·</span>
              <span>{group.ospiti_count} {group.ospiti_count === 1 ? 'ospite' : 'ospiti'}</span>
            </div>
            {group.main_guest && (
              <div className="portal-collapse-guest">
                <strong>{group.main_guest.ospite_nome}</strong>
                {group.main_guest.main_guest_label && (
                  <span className="badge badge-primary">{group.main_guest.main_guest_label}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </summary>

      <div className="portal-collapse-body">
        <div className="guest-grid">
          {group.ospiti.map((ospite) => {
            const aw = ospite.channels.alloggiati_web;
            const ra = ospite.channels.ross1000_arrivo;
            const rp = ospite.channels.ross1000_partenza;
            return (
              <div
                key={ospite.ospite_nome}
                className={`guest-row${ospite.is_main_guest ? ' guest-row-main' : ''}`}
              >
                <div className="guest-name">
                  {ospite.ospite_nome}
                  {ospite.main_guest_label && (
                    <span className="badge badge-primary">{ospite.main_guest_label}</span>
                  )}
                </div>
                <div className="channel-cell">
                  <span className="channel-label">AW</span>
                  {statusPill(aw?.status)}
                </div>
                <div className="channel-cell">
                  <span className="channel-label">R1000</span>
                  {ra?.status === 'success' && rp?.status === 'success' ? (
                    <span className="channel-pill ok">OK</span>
                  ) : (
                    <span className="channel-pill fail">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {group.receipt_download_url && (
          <div style={{ marginTop: '0.75rem' }}>
            <a href={group.receipt_download_url} target="_blank" rel="noreferrer">Scarica ricevuta AW</a>
          </div>
        )}
      </div>
    </details>
  );
}
