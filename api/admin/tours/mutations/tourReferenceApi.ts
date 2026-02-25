import type { SupabaseClient } from '@supabase/supabase-js';

export type TourReferenceOption = {
  value: string;
  label: string;
};

export type AdminTourReferences = {
  destinations: TourReferenceOption[];
  tourTypes: TourReferenceOption[];
};

type ReferenceRow = {
  id: number;
  name: string;
};

function mapReferenceRows(rows: ReferenceRow[] | null | undefined): TourReferenceOption[] {
  return (rows ?? []).map((row) => ({
    value: String(row.id),
    label: row.name,
  }));
}

export async function fetchAdminTourReferences(
  supabase: SupabaseClient,
): Promise<AdminTourReferences> {
  const [destinationsResult, typesResult] = await Promise.all([
    supabase.from('destinations').select('id,name').order('name', { ascending: true }),
    supabase.from('tour_types').select('id,name').order('name', { ascending: true }),
  ]);

  if (destinationsResult.error) {
    throw new Error(`TOUR_REFERENCES_FETCH_FAILED:${destinationsResult.error.message}`);
  }
  if (typesResult.error) {
    throw new Error(`TOUR_REFERENCES_FETCH_FAILED:${typesResult.error.message}`);
  }

  return {
    destinations: mapReferenceRows(destinationsResult.data as ReferenceRow[]),
    tourTypes: mapReferenceRows(typesResult.data as ReferenceRow[]),
  };
}
