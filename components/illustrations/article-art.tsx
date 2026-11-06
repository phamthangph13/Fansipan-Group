import { cn } from "@/lib/utils";
import type { ArticleCategory } from "@/lib/types";

export function ArticleArt({
  category,
  className,
}: {
  category: ArticleCategory;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 240"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <rect width="400" height="240" fill="#F2F7FE" />
      <g opacity="0.5">
        {Array.from({ length: 11 }).map((_, index) => (
          <line
            key={`v-${index}`}
            x1={index * 40}
            y1="0"
            x2={index * 40}
            y2="240"
            stroke="#0027AA"
            strokeWidth="0.4"
            opacity="0.22"
          />
        ))}
        {Array.from({ length: 7 }).map((_, index) => (
          <line
            key={`h-${index}`}
            x1="0"
            y1={index * 40}
            x2="400"
            y2={index * 40}
            stroke="#0027AA"
            strokeWidth="0.4"
            opacity="0.22"
          />
        ))}
      </g>

      {category === "du-an" ? (
        <g>
          <path d="M72 190V92l54-26 54 26v98" stroke="#0027AA" strokeWidth="1.6" />
          <path d="M72 122h108M72 152h108M99 66v124M126 66v20M153 66v124" stroke="#0027AA" strokeWidth="0.9" opacity="0.5" />
          <path d="M196 190V70h88v120M196 96h88M196 124h88M196 152h88M220 70V48h40v22" stroke="#0027AA" strokeWidth="1.2" />
          <path d="M300 190V44M300 44h-44M300 56h34" stroke="#0027AA" strokeWidth="1.3" />
          <path d="M256 44v18M334 56v16" stroke="#DB0114" strokeWidth="1.4" />
          <circle cx="256" cy="66" r="3" fill="#DB0114" />
          <path d="M56 190h296" stroke="#DB0114" strokeWidth="2" />
        </g>
      ) : null}

      {category === "dich-vu" ? (
        <g>
          <circle cx="140" cy="118" r="46" stroke="#0027AA" strokeWidth="1.5" />
          <circle cx="140" cy="118" r="30" stroke="#0027AA" strokeWidth="0.8" opacity="0.4" />
          <path
            d="M140 72v14M140 150v14M94 118h14M172 118h14M107 85l10 10M163 141l10 10M173 85l-10 10M117 141l-10 10"
            stroke="#0027AA"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="140" cy="118" r="10" fill="#DB0114" opacity="0.85" />
          <path
            d="M236 78l44 10-14 40-40-10zM250 102l8 2"
            stroke="#0027AA"
            strokeWidth="1.3"
          />
          <path d="M266 128v46M266 128l34 12v28" stroke="#0027AA" strokeWidth="1.2" />
          <circle cx="300" cy="168" r="10" stroke="#DB0114" strokeWidth="1.4" />
          <path d="M60 190h280" stroke="#0027AA" strokeWidth="0.9" opacity="0.35" />
        </g>
      ) : null}

      {category === "kien-thuc" ? (
        <g>
          <path d="M98 62h130v130H98z" stroke="#0027AA" strokeWidth="1.4" />
          <path d="M118 86h90M118 102h90M118 118h64M118 134h74M118 150h50" stroke="#0027AA" strokeWidth="1" opacity="0.55" />
          <path d="M228 78h70v114h-70z" stroke="#0027AA" strokeWidth="1.1" opacity="0.6" />
          <path d="M244 96h36M244 110h36M244 124h24" stroke="#0027AA" strokeWidth="0.9" opacity="0.4" />
          <circle cx="290" cy="168" r="26" stroke="#DB0114" strokeWidth="1.5" />
          <path d="M290 152v16l10 6" stroke="#DB0114" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M62 190h284" stroke="#DB0114" strokeWidth="1.8" />
        </g>
      ) : null}

      {category === "tin-tuc" ? (
        <g>
          <path d="M84 72h174v106H84z" stroke="#0027AA" strokeWidth="1.4" />
          <path d="M84 96h174M104 116h68M104 132h54M104 148h74M180 116h52M180 132h52" stroke="#0027AA" strokeWidth="1" opacity="0.5" />
          <path d="M258 98h44v80h-44z" stroke="#0027AA" strokeWidth="1.2" />
          <path d="M274 118h12M274 132h12M274 146h12" stroke="#DB0114" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="304" cy="62" r="18" stroke="#0027AA" strokeWidth="1" opacity="0.4" />
          <path d="M304 44v36M286 62h36" stroke="#0027AA" strokeWidth="0.8" opacity="0.3" />
          <path d="M62 190h276" stroke="#DB0114" strokeWidth="1.8" />
        </g>
      ) : null}
    </svg>
  );
}
