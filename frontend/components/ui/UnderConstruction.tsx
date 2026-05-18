import { Construction } from 'lucide-react';

interface UnderConstructionProps {
  title: string;
  description?: string;
}

const DEFAULT_DESCRIPTION =
  'Esta sección está en desarrollo. Pronto estará disponible.';

export function UnderConstruction({ title, description }: UnderConstructionProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-lg border border-border bg-card p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Construction className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description ?? DEFAULT_DESCRIPTION}</p>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-800">
          En desarrollo
        </span>
      </div>
    </div>
  );
}
