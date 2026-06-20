import { type Platform } from "@/lib/content/unified-content-model";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

export function LibraryIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function ReturnKeyIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <path d="M20 6v4a2 2 0 0 1-2 2H5" />
      <path d="m8 9-3 3 3 3" />
    </svg>
  );
}

export function SpinnerIcon({ size = 16, className, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} className={className} aria-hidden>
      <path d="M12 3a9 9 0 1 0 9 9" opacity={0.9} />
    </svg>
  );
}

/**
 * Custom, intentionally minimal platform marks (currentColor). We draw our own
 * rather than ship brand logos, to keep one consistent line weight across the UI.
 */
export function PlatformGlyph({
  platform,
  size = 14,
  className,
}: {
  platform: Platform;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    className,
    "aria-hidden": true,
  } as const;

  switch (platform) {
    case "youtube":
      return (
        <svg {...common} fill="none">
          <rect
            x="2"
            y="5"
            width="20"
            height="14"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path d="M10 9.2v5.6l5-2.8-5-2.8Z" fill="currentColor" />
        </svg>
      );
    case "twitter":
      return (
        <svg {...common} fill="none">
          <path
            d="M4 4l16 16M20 4 4 20"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      );
    case "reddit":
      return (
        <svg {...common} fill="none">
          <circle
            cx="12"
            cy="14"
            r="7"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M16 6.5 14 4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="14" cy="3.4" r="1.5" fill="currentColor" />
          <circle cx="9.4" cy="13.4" r="1.1" fill="currentColor" />
          <circle cx="14.6" cy="13.4" r="1.1" fill="currentColor" />
          <path
            d="M9.5 16.5c1.5 1.2 3.5 1.2 5 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "github":
      return (
        <svg {...common} fill="none">
          <path
            d="M9 19c-4 1.3-4-2.2-5.5-2.7M15 21v-3.3a2.9 2.9 0 0 0-.8-2.2c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.2 4.4 4.4 0 0 0-.1-3.3s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C5.7 1.7 4.6 2 4.6 2a4.4 4.4 0 0 0-.1 3.3A4.7 4.7 0 0 0 3.2 8.5c0 4.6 2.8 5.7 5.5 6a2.9 2.9 0 0 0-.8 2.1V21"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
