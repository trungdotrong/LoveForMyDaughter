const PATHS = {
  home: "M4 11 L12 4 L20 11 V20 H14 V14 H10 V20 H4 Z",
  gear: "M12 8.5 A3.5 3.5 0 1 0 12 15.5 A3.5 3.5 0 1 0 12 8.5 M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.3 5.3 L7 7 M17 17 L18.7 18.7 M5.3 18.7 L7 17 M17 7 L18.7 5.3",
  sound: "M4 9 H8 L13 5 V19 L8 15 H4 Z M16.5 8.5 Q19 12 16.5 15.5 M18.8 6 Q23 12 18.8 18",
  mute: "M4 9 H8 L13 5 V19 L8 15 H4 Z M16.5 9.5 L21.5 14.5 M21.5 9.5 L16.5 14.5",
  close: "M6 6 L18 18 M18 6 L6 18",
  camera: "M3 8 H7 L9 5 H15 L17 8 H21 V19 H3 Z M12 10 A3.5 3.5 0 1 0 12 17 A3.5 3.5 0 1 0 12 10",
  check: "M5 12.5 L10 17.5 L19 7",
  printer: "M7 9 V3 H17 V9 M7 17 H4 V9 H20 V17 H17 M7 14 H17 V21 H7 Z",
  arrow: "M5 12 H19 M13 6 L19 12 L13 18",
  back: "M19 12 H5 M11 6 L5 12 L11 18",
  replay: "M4 12 A8 8 0 1 0 7 5.8 M4 4 V9 H9",
  keyboard: "M3 6 H21 V18 H3 Z M7 10 H7.01 M11 10 H11.01 M15 10 H15.01 M7 14 H17",
  logout: "M10 4 H4 V20 H10 M15 8 L19 12 L15 16 M19 12 H9",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "size-6" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
