import Link from 'next/link';
import type { MediaDetails } from '@/types';
import { getDetailsDate, getDetailsTitle, isMovie, isTVShow } from '@/types';
import { formatCurrency, getYear } from '@/lib/utils';

interface MetadataPanelProps {
  details: MediaDetails;
  mediaType: 'movie' | 'tv';
}

interface MetaRowProps {
  label: string;
  value: string | React.ReactNode;
}

function MetaRow({ label, value }: MetaRowProps) {
  if (!value || value === 'N/A') return null;
  return (
    <div className="border-b border-white/10 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-white">{value}</dd>
    </div>
  );
}

export default function MetadataPanel({
  details,
  mediaType,
}: MetadataPanelProps) {
  const title = getDetailsTitle(details);
  const releaseDate = getDetailsDate(details);

  return (
    <aside className="rounded-lg border border-white/10 bg-surface/80 p-6 backdrop-blur-sm">
      <h3 className="mb-4 font-display text-lg tracking-wide text-white">
        Details
      </h3>
      <dl>
        <MetaRow label="Title" value={title} />
        <MetaRow
          label="Type"
          value={mediaType === 'movie' ? 'Movie' : 'TV Series'}
        />
        <MetaRow
          label={mediaType === 'movie' ? 'Runtime' : 'Seasons'}
          value={
            isMovie(details)
              ? details.runtime
                ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
                : 'N/A'
              : isTVShow(details) && details.number_of_seasons
                ? `${details.number_of_seasons}`
                : 'N/A'
          }
        />
        {isTVShow(details) && details.number_of_episodes && (
          <MetaRow
            label="Episodes"
            value={String(details.number_of_episodes)}
          />
        )}
        <MetaRow
          label="Language"
          value={details.original_language?.toUpperCase() ?? 'N/A'}
        />
        <MetaRow
          label={mediaType === 'movie' ? 'Release Date' : 'First Air Date'}
          value={
            releaseDate
              ? `${getYear(releaseDate)} (${releaseDate})`
              : 'N/A'
          }
        />
        {isTVShow(details) && details.last_air_date && (
          <MetaRow label="Last Air Date" value={details.last_air_date} />
        )}
        {isMovie(details) && (
          <>
            <MetaRow label="Budget" value={formatCurrency(details.budget)} />
            <MetaRow label="Revenue" value={formatCurrency(details.revenue)} />
            {details.belongs_to_collection && (
              <MetaRow
                label="Collection"
                value={
                  <Link
                    href={`/search?q=${encodeURIComponent(details.belongs_to_collection!.name)}`}
                    className="text-accent hover:underline"
                  >
                    {details.belongs_to_collection.name}
                  </Link>
                }
              />
            )}
          </>
        )}
        <MetaRow label="Status" value={details.status ?? 'N/A'} />
        <MetaRow
          label="Rating"
          value={`${details.vote_average.toFixed(1)} / 10 (${details.vote_count.toLocaleString()} votes)`}
        />
      </dl>
    </aside>
  );
}
