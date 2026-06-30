export const PortalPermissions = {
  ACCESS: 'portal.access',
  SUBMIT: 'portal.submit',
  STATISTICS: 'portal.statistics',
  RECEIPTS: 'portal.receipts',
} as const;

export type PortalUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
};

export type SearchFilters = {
  nome?: string;
  cognome?: string;
  codice_prenotazione?: string;
  data?: string;
};

export type Ospite = {
  alloggiato_id: number;
  nome: string;
  cognome: string;
  is_main_guest?: boolean;
  main_guest_label?: string | null;
  aw_inviato?: boolean;
  submissions?: Record<string, { status?: string; error_message?: string | null } | null>;
};

export type Prenotazione = {
  codice_prenotazione: string;
  property_id: number | null;
  property_name: string;
  check_in_date: string | null;
  check_out_date: string | null;
  default_nights: number;
  default_arrival_date?: string;
  allowed_arrival_dates?: string[];
  submission_enabled?: boolean;
  submission_disabled_reason?: string | null;
  aw_already_sent?: boolean;
  ospiti: Ospite[];
};

export type HistoryGroup = {
  codice_prenotazione: string;
  property_name: string;
  submitted_at: string | null;
  movement_date: string | null;
  nights_count: number | null;
  ospiti_count: number;
  main_guest?: {
    ospite_nome: string;
    main_guest_label?: string | null;
    is_main_guest?: boolean;
  } | null;
  ospiti: Array<{
    ospite_nome: string;
    is_main_guest?: boolean;
    main_guest_label?: string | null;
    channels: Record<string, { status?: string; error_message?: string | null } | undefined>;
  }>;
  summary: {
    has_errors: boolean;
  };
  receipt_download_url?: string | null;
  receipt_date?: string | null;
};

export type DashboardData = {
  filters: SearchFilters;
  has_filters: boolean;
  prenotazioni: Prenotazione[];
  recent_submission_groups: HistoryGroup[];
  receipt_properties: Array<{ property_id: number; property_name: string }>;
};
