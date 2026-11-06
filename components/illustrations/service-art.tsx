import { cn } from "@/lib/utils";

export type ServiceArtVariant = "hvac" | "me" | "cooling" | "maintenance";

export function ServiceArt({
  variant,
  className,
}: {
  variant: ServiceArtVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 280 170"
      fill="none"
      className={cn("h-auto w-full", className)}
      aria-hidden
    >
      <defs>
        <pattern id={`dots-${variant}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#0027AA" opacity="0.12" />
        </pattern>
      </defs>
      <rect width="280" height="170" fill={`url(#dots-${variant})`} />

      {variant === "hvac" ? (
        <g>
          <path d="M36 40h112v78H36z" stroke="#0027AA" strokeWidth="1.3" />
          <path d="M36 54h112M36 68h112" stroke="#0027AA" strokeWidth="0.7" opacity="0.35" />
          <circle cx="92" cy="98" r="24" stroke="#0027AA" strokeWidth="1.4" />
          <path
            d="M92 74v48M68 98h48M75 81l34 34M109 81l-34 34"
            stroke="#0027AA"
            strokeWidth="0.9"
            opacity="0.55"
          />
          <circle cx="92" cy="98" r="5" fill="#DB0114" opacity="0.9" />
          <path
            d="M170 56c14 0 14 14 28 14s14-14 28-14M170 78c14 0 14 14 28 14s14-14 28-14M170 100c14 0 14 14 28 14s14-14 28-14"
            stroke="#0027AA"
            strokeWidth="1"
            opacity="0.4"
            strokeLinecap="round"
          />
          <path d="M172 130h78" stroke="#DB0114" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="172" cy="130" r="2.4" fill="#DB0114" />
          <circle cx="250" cy="130" r="2.4" fill="#DB0114" />
          <path d="M160 40v78" stroke="#0027AA" strokeWidth="0.8" opacity="0.3" strokeDasharray="3 4" />
        </g>
      ) : null}

      {variant === "me" ? (
        <g>
          <path d="M52 28h96v114H52z" stroke="#0027AA" strokeWidth="1.3" />
          <path d="M52 44h96" stroke="#0027AA" strokeWidth="1" />
          <path d="M64 56h24v64H64zM100 56h36v28h-36z" stroke="#0027AA" strokeWidth="1" opacity="0.7" />
          <path d="M64 126h72" stroke="#0027AA" strokeWidth="0.8" opacity="0.35" />
          <circle cx="118" cy="98" r="10" stroke="#DB0114" strokeWidth="1.3" />
          <path d="M114 98l3 3 6-7" stroke="#DB0114" strokeWidth="1.3" strokeLinecap="round" />
          <path
            d="M76 62v10M76 82v10M76 102v10M76 122v0"
            stroke="#0027AA"
            strokeWidth="2"
            opacity="0.35"
          />
          <path
            d="M176 130V62h36v68M176 84h36M176 106h36M194 62V46"
            stroke="#0027AA"
            strokeWidth="1.2"
          />
          <path d="M194 46l-8 14h9l-4 12 12-18h-9z" fill="#DB0114" opacity="0.9" />
          <path d="M212 130v16M194 130v16" stroke="#0027AA" strokeWidth="1" opacity="0.4" />
          <circle cx="230" cy="49" r="14" stroke="#0027AA" strokeWidth="0.8" opacity="0.3" />
          <path d="M230 35v28M216 49h28" stroke="#0027AA" strokeWidth="0.7" opacity="0.2" />
        </g>
      ) : null}

      {variant === "cooling" ? (
        <g>
          <path d="M84 40h112l18 100H66z" stroke="#0027AA" strokeWidth="1.4" />
          <path d="M84 40c0 14 25 20 56 20s56-6 56-20" stroke="#0027AA" strokeWidth="1.2" />
          <path d="M100 60l10 80M180 60l-10 80" stroke="#0027AA" strokeWidth="0.8" opacity="0.35" />
          <circle cx="140" cy="38" r="18" stroke="#0027AA" strokeWidth="1.2" />
          <path
            d="M140 20v36M122 38h36M127 25l26 26M153 25l-26 26"
            stroke="#0027AA"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <path d="M66 140h148" stroke="#DB0114" strokeWidth="1.3" strokeLinecap="round" />
          <path
            d="M108 150c4-6 8-6 12 0M128 150c4-6 8-6 12 0M148 150c4-6 8-6 12 0"
            stroke="#0027AA"
            strokeWidth="1"
            opacity="0.4"
            strokeLinecap="round"
          />
          <path d="M228 52v52M220 60l8 8 8-8" stroke="#0027AA" strokeWidth="1" opacity="0.45" strokeLinecap="round" />
          <circle cx="228" cy="118" r="4" fill="#DB0114" opacity="0.8" />
        </g>
      ) : null}

      {variant === "maintenance" ? (
        <g>
          <circle cx="108" cy="82" r="44" stroke="#0027AA" strokeWidth="1.4" />
          <circle cx="108" cy="82" r="34" stroke="#0027AA" strokeWidth="0.8" opacity="0.35" />
          <path d="M108 82l24-18" stroke="#DB0114" strokeWidth="2" strokeLinecap="round" />
          <circle cx="108" cy="82" r="4" fill="#0027AA" />
          <path
            d="M108 42v6M108 116v6M68 82h6M142 82h6M80 54l4 4M132 106l4 4M136 54l-4 4M84 106l-4 4"
            stroke="#0027AA"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M186 58l24 24-50 50-24-24zM160 108l-14 14M186 58l8-8 8 8 8 8-8 8"
            stroke="#0027AA"
            strokeWidth="1.2"
          />
          <path d="M190 42h32M190 50h22M190 58h12" stroke="#DB0114" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </g>
      ) : null}
    </svg>
  );
}
