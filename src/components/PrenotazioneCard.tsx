import type { Prenotazione } from '../types/portal';

function formatDate(date: string | null | undefined): string {
  if (!date) return '—';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

type Props = {
  prenotazione: Prenotazione;
  canSubmit: boolean;
  onSubmit?: (codice: string, payload: Record<string, unknown>) => void;
};

export function PrenotazioneCard({ prenotazione, canSubmit, onSubmit }: Props) {
  const codice = prenotazione.codice_prenotazione;
  const mainGuest = prenotazione.ospiti.find((o) => o.is_main_guest);
  const ospitiCount = prenotazione.ospiti.length;
  const submissionEnabled = !!prenotazione.submission_enabled;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!onSubmit) return;
    const form = new FormData(e.currentTarget);
    const arrivalDate = String(form.get('arrival_date') || '');
    const nights = Number(form.get('nights') || prenotazione.default_nights);

    const ospiti = prenotazione.ospiti.map((ospite, idx) => ({
      selected: form.get(`ospite_${idx}_selected`) === '1',
      alloggiato_id: ospite.alloggiato_id,
      submit_alloggiati: form.get(`ospite_${idx}_aw`) === '1',
      submit_ross1000: form.get(`ospite_${idx}_r1000`) === '1',
    }));

    onSubmit(codice, {
      property_id: prenotazione.property_id,
      check_in_date: prenotazione.check_in_date,
      check_out_date: prenotazione.check_out_date,
      arrival_date: arrivalDate,
      nights,
      ospiti,
    });
  }

  return (
    <details className="card reservation-box portal-collapse">
      <summary className="portal-collapse-summary">
        <div className="portal-collapse-summary-main">
          <span className="portal-collapse-chevron" aria-hidden="true">›</span>
          <div>
            <div className="portal-collapse-title">Prenotazione {codice}</div>
            <div className="portal-collapse-meta muted">
              <span>{prenotazione.property_name}</span>
              <span>·</span>
              <span>{formatDate(prenotazione.check_in_date)} → {formatDate(prenotazione.check_out_date)}</span>
              <span>·</span>
              <span>{prenotazione.default_nights} notti</span>
              <span>·</span>
              <span>{ospitiCount} {ospitiCount === 1 ? 'ospite' : 'ospiti'}</span>
            </div>
            {mainGuest && (
              <div className="portal-collapse-guest">
                <strong>{mainGuest.cognome} {mainGuest.nome}</strong>
                {mainGuest.main_guest_label && (
                  <span className="badge badge-primary">{mainGuest.main_guest_label}</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="portal-collapse-badges">
          {submissionEnabled ? (
            <span className="badge badge-ok">Invio disponibile</span>
          ) : (
            <span className="badge badge-muted">Invio non disponibile</span>
          )}
          {prenotazione.aw_already_sent && <span className="badge badge-ok">AW inviato</span>}
        </div>
      </summary>

      <div className="portal-collapse-body">
        {!prenotazione.property_id && (
          <div className="alert alert-error">Property non mappata su appbnb-core.</div>
        )}

        {prenotazione.property_id && !submissionEnabled && (
          <>
            <div className="alert alert-error">
              {prenotazione.submission_disabled_reason || 'Invio non disponibile per questa prenotazione.'}
            </div>
            <GuestList ospiti={prenotazione.ospiti} />
          </>
        )}

        {prenotazione.property_id && submissionEnabled && canSubmit && (
          <form onSubmit={handleSubmit}>
            <div className="grid" style={{ marginBottom: '1rem' }}>
              <div>
                <label>Data inizio (AW + Ross1000)</label>
                <select name="arrival_date" defaultValue={prenotazione.default_arrival_date} required>
                  {(prenotazione.allowed_arrival_dates || []).map((date) => (
                    <option key={date} value={date}>{formatDate(date)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Notti (AW + Ross1000)</label>
                <input
                  type="number"
                  name="nights"
                  min={1}
                  max={30}
                  defaultValue={prenotazione.default_nights}
                  required
                />
              </div>
            </div>
            {prenotazione.aw_already_sent && (
              <div className="alert alert-success">Alloggiati Web già inviato: il reinvio AW è disabilitato.</div>
            )}
            <div className="guest-cards">
              {prenotazione.ospiti.map((ospite, idx) => (
                <div
                  key={ospite.alloggiato_id}
                  className={`guest-card${ospite.is_main_guest ? ' guest-card-main' : ''}`}
                >
                  <div className="guest-card-head">
                    <label>
                      <input type="checkbox" name={`ospite_${idx}_selected`} value="1" defaultChecked />
                      <strong>{ospite.cognome} {ospite.nome}</strong>
                    </label>
                    {ospite.main_guest_label && (
                      <span className="badge badge-primary">{ospite.main_guest_label}</span>
                    )}
                  </div>
                  <div className="guest-card-meta muted">alloggiati #{ospite.alloggiato_id}</div>
                  <div className="guest-card-actions">
                    {!prenotazione.aw_already_sent && (
                      <label>
                        <input type="checkbox" name={`ospite_${idx}_aw`} value="1" defaultChecked />
                        Alloggiati Web
                      </label>
                    )}
                    <label>
                      <input type="checkbox" name={`ospite_${idx}_r1000`} value="1" defaultChecked />
                      Ross1000
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-row">
              <button type="submit" className="btn btn-primary">Invia selezionati</button>
            </div>
          </form>
        )}

        {prenotazione.property_id && submissionEnabled && !canSubmit && (
          <>
            <p className="muted">Solo visualizzazione (permesso invio non assegnato).</p>
            <GuestList ospiti={prenotazione.ospiti} />
          </>
        )}
      </div>
    </details>
  );
}

function GuestList({ ospiti }: { ospiti: Prenotazione['ospiti'] }) {
  return (
    <div className="guest-cards">
      {ospiti.map((ospite) => (
        <div key={ospite.alloggiato_id} className={`guest-card${ospite.is_main_guest ? ' guest-card-main' : ''}`}>
          <div className="guest-card-head">
            <strong>{ospite.cognome} {ospite.nome}</strong>
            {ospite.main_guest_label && <span className="badge badge-primary">{ospite.main_guest_label}</span>}
          </div>
          <div className="guest-card-meta muted">alloggiati #{ospite.alloggiato_id}</div>
        </div>
      ))}
    </div>
  );
}
