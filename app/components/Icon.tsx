// =====================================================
// ITO ikon seti — premium ton için ince çizgili (stroke) ikonlar.
// Emoji yerine kullanılır: emoji tüketici/samimi okunur, danışmanlık
// konumlandırmasında ucuzlatıcı etki yapar.
// Tümü currentColor kullanır; bulunduğu metnin rengini alır.
// =====================================================

type IconName =
  | 'message' | 'plan' | 'plane' | 'landmark' | 'medical' | 'briefcase'
  | 'globe' | 'lock' | 'instagram' | 'whatsapp' | 'sun' | 'moon'
  | 'menu' | 'close' | 'sparkle';

const paths: Record<IconName, React.ReactNode> = {
  message: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.4-.7L3 21l1.9-5.1A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z" />,
  plan: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  plane: <path d="M21 15.5 3 10.2V8l3 1 2.2-1L4.5 5.6l2-1.1 5.4 1.7L17 4.3a1.9 1.9 0 0 1 1.6 3.4l-3.2 2.4 1.4 5.5-1.9.9-2.6-4.2-3 1.7Z" />,
  landmark: <><path d="M4 10h16M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18M12 3 3.5 7.5h17L12 3Z" /></>,
  medical: <><path d="M12 7v10M7 12h10" /><rect x="3" y="3" width="18" height="18" rx="4" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3.5 9h17M3.5 15h17M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></>,
  lock: <><rect x="4" y="10" width="16" height="10" rx="2.5" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" /></>,
  whatsapp: <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3a8.5 8.5 0 1 1 15.6-4.5ZM9 8.6c-.3 0-.6.1-.9.4-.3.4-1 1-1 2.3s1 2.7 1.2 2.9c.1.2 2 3 4.8 4.1 2.4.9 2.9.7 3.4.7.5-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.1-1.3l-.8-.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.2l-.8 1c-.1.2-.3.2-.6.1-.3-.2-1.2-.5-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.5-.5c.1-.2.2-.3.3-.5v-.5c-.1-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.6Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" /></>,
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  sparkle: <path d="M12 3.5l1.7 4.9 4.8 1.6-4.8 1.7L12 16.5l-1.7-4.8-4.8-1.7 4.8-1.6L12 3.5Z" />,
};

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  style,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0, ...style }}
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
