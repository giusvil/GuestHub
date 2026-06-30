import { useEffect, useState } from 'react';
import { fetchStatistics } from '../api/portal';

export function StatisticsPage() {
  const [year, setYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [report, setReport] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const data = await fetchStatistics() as {
          year: number;
          available_years: number[];
          report: unknown;
        };
        setYear(data.year);
        setAvailableYears(data.available_years);
        setReport(data.report);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function changeYear(nextYear: number) {
    setYear(nextYear);
    setLoading(true);
    try {
      const data = await fetchStatistics(nextYear) as { year: number; report: unknown };
      setReport(data.report);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Statistiche notti caricate</h1>
      <p className="page-intro">Presenze come persone × notti sugli invii trasmessi (data movimento).</p>
      {availableYears.length > 0 && year !== null && (
        <div style={{ maxWidth: 220, marginTop: '1rem' }}>
          <label htmlFor="year">Anno</label>
          <select
            id="year"
            value={year}
            onChange={(e) => void changeYear(Number(e.target.value))}
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}
      {loading && <p className="muted" style={{ marginTop: '1rem' }}>Caricamento…</p>}
      {!loading && report != null && (
        <pre className="stats-json" style={{ marginTop: '1rem', overflow: 'auto' }}>
          {JSON.stringify(report, null, 2)}
        </pre>
      )}
    </div>
  );
}
