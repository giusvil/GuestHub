import type { SearchFilters } from '../types/portal';

type Props = {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export function SearchForm({ filters, onChange, onSubmit, onReset }: Props) {
  return (
    <div className="card">
      <h1>Cerca ospiti / prenotazioni</h1>
      <p className="page-intro">
        Dati ospiti dal DB AppBnb. Invio abilitato solo durante il soggiorno (o fino al giorno dopo il check-out).
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid">
          <div>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              value={filters.nome || ''}
              onChange={(e) => onChange({ ...filters, nome: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="cognome">Cognome</label>
            <input
              id="cognome"
              value={filters.cognome || ''}
              onChange={(e) => onChange({ ...filters, cognome: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="codice_prenotazione">N. prenotazione</label>
            <input
              id="codice_prenotazione"
              value={filters.codice_prenotazione || ''}
              onChange={(e) => onChange({ ...filters, codice_prenotazione: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="data">Data soggiorno</label>
            <input
              id="data"
              type="date"
              value={filters.data || ''}
              onChange={(e) => onChange({ ...filters, data: e.target.value })}
            />
          </div>
        </div>
        <div className="btn-row">
          <button type="submit" className="btn btn-primary">Cerca</button>
          <button type="button" className="btn btn-secondary" onClick={onReset}>Reset</button>
        </div>
      </form>
    </div>
  );
}
