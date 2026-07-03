const STORYBOOK_BASE = 'https://storybook.morphos.praxisjs.org';

interface StorybookEmbedProps {
  /** Storybook story id, e.g. "inputs-button--default" (kebab-case title + "--" + kebab-case story name). */
  story: string;
  /** iframe title for accessibility. Defaults to the story id. */
  title?: string;
  /** iframe height in pixels. */
  height?: number;
}

export function StorybookEmbed({ story, title, height = 380 }: StorybookEmbedProps) {
  const iframeSrc = `${STORYBOOK_BASE}/iframe.html?id=${story}&viewMode=story`;
  const linkHref = `${STORYBOOK_BASE}/?path=/story/${story}`;

  return (
    <div
      className="not-prose my-6 overflow-hidden rounded-xl border"
      style={{ borderColor: 'var(--color-fd-border)' }}
    >
      <iframe
        src={iframeSrc}
        title={title ?? `${story} — interactive example`}
        loading="lazy"
        className="w-full bg-fd-card"
        style={{ height, border: 0, display: 'block' }}
      />
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 border-t px-4 py-2.5 text-sm text-fd-muted-foreground no-underline transition-colors hover:bg-fd-accent hover:text-fd-foreground"
        style={{ borderColor: 'var(--color-fd-border)' }}
      >
        <span className="flex items-center gap-2 font-medium">
          {/* Storybook bookmark icon */}
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0">
            <path d="M3 2h12v14l-6-4-6 4V2z" stroke="#FF4785" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M6.5 7.5h5" stroke="#FF4785" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Open in Storybook
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 13 13"
          fill="none"
          aria-hidden
          className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          <path d="M1 12L12 1M12 1H5M12 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
