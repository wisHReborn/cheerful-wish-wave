interface BearCakeProps {
  blown?: boolean;
  cheering?: boolean;
}

// Cute bear behind a birthday cake with a candle that can be blown out
export function BearCake({ blown = false, cheering = false }: BearCakeProps) {
  return (
    <div className={`relative mx-auto ${cheering ? "animate-wiggle" : "animate-float-bob"}`}>
      <svg
        viewBox="0 0 240 240"
        className="w-56 h-56 sm:w-72 sm:h-72 drop-shadow-[0_8px_0_color-mix(in_oklab,var(--primary)_20%,transparent)]"
        aria-hidden="true"
      >
        {/* Ears */}
        <circle cx="78" cy="78" r="22" fill="#b07a52" />
        <circle cx="78" cy="78" r="11" fill="#e8c5a0" />
        <circle cx="162" cy="78" r="22" fill="#b07a52" />
        <circle cx="162" cy="78" r="11" fill="#e8c5a0" />
        {/* Head */}
        <circle cx="120" cy="110" r="58" fill="#c98e63" />
        <ellipse cx="120" cy="128" rx="30" ry="22" fill="#f1d6b6" />
        {/* Eyes */}
        <ellipse cx="100" cy="108" rx="5" ry={cheering ? 2 : 6} fill="#2a1810" />
        <ellipse cx="140" cy="108" rx="5" ry={cheering ? 2 : 6} fill="#2a1810" />
        {/* Cheeks */}
        <circle cx="92" cy="128" r="6" fill="#ff9eb5" opacity="0.6" />
        <circle cx="148" cy="128" r="6" fill="#ff9eb5" opacity="0.6" />
        {/* Nose */}
        <ellipse cx="120" cy="124" rx="4" ry="3" fill="#2a1810" />
        {/* Mouth - O shape for blowing, smile for cheering */}
        {blown && cheering ? (
          <path
            d="M112 138 Q120 146 128 138"
            stroke="#2a1810"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <ellipse cx="120" cy="140" rx="4" ry="5" fill="#2a1810" />
        )}

        {/* Arms holding plate */}
        <ellipse cx="70" cy="180" rx="14" ry="10" fill="#c98e63" transform="rotate(-20 70 180)" />
        <ellipse cx="170" cy="180" rx="14" ry="10" fill="#c98e63" transform="rotate(20 170 180)" />

        {/* Cake plate */}
        <ellipse cx="120" cy="200" rx="70" ry="8" fill="#ffffff" stroke="#e0c8b0" strokeWidth="2" />
        {/* Cake base */}
        <rect x="70" y="170" width="100" height="30" rx="4" fill="#ffd6e0" />
        <rect x="70" y="170" width="100" height="6" fill="#ff9eb5" />
        {/* Frosting drips */}
        <path
          d="M70 176 Q80 184 90 176 Q100 184 110 176 Q120 184 130 176 Q140 184 150 176 Q160 184 170 176 L170 170 L70 170 Z"
          fill="#ff9eb5"
        />
        {/* Sprinkles */}
        <circle cx="85" cy="188" r="1.5" fill="var(--sprinkle-yellow)" />
        <circle cx="105" cy="192" r="1.5" fill="var(--sprinkle-mint)" />
        <circle cx="125" cy="187" r="1.5" fill="var(--sprinkle-sky)" />
        <circle cx="145" cy="193" r="1.5" fill="var(--sprinkle-yellow)" />
        <circle cx="155" cy="188" r="1.5" fill="var(--sprinkle-mint)" />

        {/* Candle */}
        <rect
          x="116"
          y="150"
          width="8"
          height="22"
          rx="1"
          fill="#fff"
          stroke="#ffb8c8"
          strokeWidth="1.5"
        />
        <rect x="116" y="156" width="8" height="3" fill="#ffb8c8" />
        <rect x="116" y="164" width="8" height="3" fill="#ffb8c8" />

        {/* Flame */}
        {!blown && (
          <g className="origin-center">
            <ellipse cx="120" cy="144" rx="4" ry="7" fill="#ffb347">
              <animate attributeName="ry" values="7;5;7" dur="0.6s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="120" cy="143" rx="2" ry="4" fill="#fff3b0">
              <animate attributeName="ry" values="4;2.5;4" dur="0.6s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}
        {/* Smoke after blown */}
        {blown && (
          <g opacity="0.5">
            <circle cx="120" cy="142" r="3" fill="#cfcfcf">
              <animate attributeName="cy" from="142" to="120" dur="2s" repeatCount="indefinite" />
              <animate
                attributeName="opacity"
                from="0.6"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="124" cy="138" r="2" fill="#cfcfcf">
              <animate
                attributeName="cy"
                from="138"
                to="116"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.6"
                to="0"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
}
