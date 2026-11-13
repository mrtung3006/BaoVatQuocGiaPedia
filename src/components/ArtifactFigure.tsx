import { useState } from 'react';
import { Landmark } from 'lucide-react';
import { TreasureRecord } from '../types/treasure';
import { resolveArtifactImage } from '../data/artifactImages';

interface ArtifactFigureProps {
  treasure: TreasureRecord;
  aspectClass?: string;
  compact?: boolean;
}

export function ArtifactFigure({
  treasure,
  aspectClass = 'aspect-[4/3]',
  compact = false,
}: ArtifactFigureProps) {
  const [hasError, setHasError] = useState(false);
  const src = resolveArtifactImage(treasure.hinh_anh.duong_dan);

  return (
    <figure className="w-full">
      <div
        className={`relative w-full ${aspectClass} overflow-hidden bg-[#F1ECE2] border border-[#E4DDD0]`}
      >
        {!hasError ? (
          <img
            src={src}
            alt={`${treasure.ten_bao_vat} — ${treasure.noi_luu_giu.ten_co_quan}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EFE9DD] text-[#57534E]">
            <Landmark className="w-8 h-8 mb-2 text-[#9A3412]" aria-hidden="true" />
            <span className="font-serif text-base font-semibold text-[#1C1917]">
              {treasure.ten_bao_vat}
            </span>
            <span className="font-mono text-xs text-[#78716C] mt-1">
              {treasure.ma_bao_vat}
            </span>
          </div>
        )}
      </div>

      <figcaption
        className={`mt-2.5 text-[#57534E] leading-relaxed ${
          compact ? 'text-xs' : 'text-[13px]'
        }`}
      >
        <span className="block font-medium text-[#292524]">
          {treasure.hinh_anh.chu_thich}
        </span>
        <span className="block mt-0.5 text-[#78716C]">
          Nguồn ảnh: {treasure.hinh_anh.nguon_anh}
        </span>
      </figcaption>
    </figure>
  );
}
