/* Subtle stylized Ontario map outline (decorative). */
export function OntarioMap({ size = 220, color = 'rgba(20, 83, 184, 0.18)', showTrillium = true }) {
  return (
    <svg
      width={size}
      height={size * 0.78}
      viewBox="0 0 220 172"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <pattern id="oarOntarioDots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="0.85" fill={color} />
        </pattern>
      </defs>
      {/* Stylised Ontario silhouette */}
      <path
        d="M14 56c2-8 8-12 16-12l18 4 14-6 22 2 16-8 18 4 22-2 18 4 16 6 18 8 8 12-4 16-12 14-18 6-12 14-16 6-12-2-14 6-18-2-16-8-12-12-10-14-8-12-4-14z"
        fill="url(#oarOntarioDots)"
        stroke={color}
        strokeWidth="0.6"
      />
      {/* Trillium pin */}
      {showTrillium && (
        <g transform="translate(132, 70)">
          <circle r="22" fill="#fff" stroke="rgba(20, 83, 184, 0.22)" strokeWidth="1.2" />
          <g transform="translate(-9.5, -10) scale(0.85)">
            <path d="M11 1 L13 9 L21 9 L15 14 L17 22 L11 17 L5 22 L7 14 L1 9 L9 9 Z" fill="rgba(20, 83, 184, 0.55)" />
          </g>
        </g>
      )}
    </svg>
  );
}
