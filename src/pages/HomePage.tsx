import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { downloadReceipt, fetchDashboard, hasPermission, submitPrenotazioni } from '../api/portal';
import { PortalPermissions, type DashboardData, type SearchFilters } from '../types/portal';
import { SearchForm } from '../components/SearchForm';
import { PrenotazioneCard } from '../components/PrenotazioneCard';
import { HistoryGroupCard } from '../components/HistoryGroupCard';

export function HomePage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [receiptPropertyId, setReceiptPropertyId] = useState('');
  const [receiptDate, setReceiptDate] = useState('');

  const canSubmit = hasPermission(user, PortalPermissions.SUBMIT);
  const canReceipts = hasPermission(user, PortalPermissions.RECEIPTS);

  const load = useCallback(async (searchFilters: SearchFilters) => {
    setLoading(true);
    try {
      const dashboard = await fetchDashboard(searchFilters);
      setData(dashboard);
      if (!receiptPropertyId && dashboard.receipt_properties[0]) {
        setReceiptPropertyId(String(dashboard.receipt_properties[0].property_id));
      }
    } catch {
      setFlash({ type: 'error', text: 'Errore nel caricamento dei dati.' });
    } finally {
      setLoading(false);
    }
  }, [receiptPropertyId]);

  useEffect(() => {
    void load({});
  }, [load]);

  async function handleSearch() {
    setFlash(null);
    await load(filters);
  }

  async function handleReset() {
    setFilters({});
    setFlash(null);
    await load({});
  }

  async function handlePrenotazioneSubmit(codice: string, payload: Record<string, unknown>) {
    setFlash(null);
    try {
      const result = await submitPrenotazioni({ prenotazioni: { [codice]: payload } });
      setFlash({
        type: result.success ? 'success' : 'error',
        text: `${result.message}\n${result.results.join('\n')}`,
      });
      await load(filters);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
        || 'Invio non riuscito.';
      setFlash({ type: 'error', text: msg });
    }
  }

  async function handleReceiptDownload(e: React.FormEvent) {
    e.preventDefault();
    if (!receiptPropertyId || !receiptDate) return;
    try {
      const blob = await downloadReceipt(Number(receiptPropertyId), receiptDate);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ricevuta-aw-${receiptDate}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setFlash({ type: 'error', text: 'Download ricevuta non riuscito.' });
    }
  }

  return (
    <>
      <SearchForm
        filters={filters}
        onChange={setFilters}
        onSubmit={() => void handleSearch()}
        onReset={() => void handleReset()}
      />

      {flash && (
        <div className={`alert alert-${flash.type === 'success' ? 'success' : 'error'}`} style={{ whiteSpace: 'pre-line' }}>
          {flash.text}
        </div>
      )}

      {loading && <div className="card"><p className="muted">Caricamento…</p></div>}

      {!loading && data?.has_filters && data.prenotazioni.length === 0 && (
        <div className="card"><p className="muted">Nessun risultato. Prova altri filtri.</p></div>
      )}

      {!loading && data?.prenotazioni.map((p) => (
        <PrenotazioneCard
          key={p.codice_prenotazione}
          prenotazione={p}
          canSubmit={canSubmit}
          onSubmit={canSubmit ? (codice, payload) => void handlePrenotazioneSubmit(codice, payload) : undefined}
        />
      ))}

      <div className="card">
        <h2>Storico invii recenti</h2>
        <p className="page-intro">Raggruppato per prenotazione e batch di invio. Clicca per i dettagli ospiti.</p>
        {!loading && data?.recent_submission_groups.length === 0 && (
          <p className="muted">Nessun invio registrato.</p>
        )}
        {data?.recent_submission_groups.map((group, i) => (
          <HistoryGroupCard key={`${group.codice_prenotazione}-${group.submitted_at}-${i}`} group={group} />
        ))}
      </div>

      {canReceipts && data && (
        <div className="card">
          <h2>Ricevute Alloggiati Web</h2>
          <form className="grid" onSubmit={(e) => void handleReceiptDownload(e)}>
            <div>
              <label htmlFor="receipt_property">Struttura</label>
              <select
                id="receipt_property"
                value={receiptPropertyId}
                onChange={(e) => setReceiptPropertyId(e.target.value)}
                required
                disabled={data.receipt_properties.length === 0}
              >
                {data.receipt_properties.map((p) => (
                  <option key={p.property_id} value={p.property_id}>{p.property_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="receipt_date">Data trasmissione</label>
              <input
                id="receipt_date"
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                required
              />
            </div>
            <div className="btn-row" style={{ alignSelf: 'end' }}>
              <button type="submit" className="btn btn-secondary" disabled={data.receipt_properties.length === 0}>
                Scarica PDF
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
