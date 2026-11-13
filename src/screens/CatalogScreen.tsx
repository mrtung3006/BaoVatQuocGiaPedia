import { ArrowRight, RotateCcw, Search } from 'lucide-react';
import { FilterState, TreasureRecord } from '../types/treasure';
import { ArtifactFigure } from '../components/ArtifactFigure';

interface CatalogScreenProps {
  records: TreasureRecord[];
  filteredRecords: TreasureRecord[];
  filters: FilterState;
  onUpdateFilters: (next: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onOpenDetail: (treasure: TreasureRecord) => void;
}

export function CatalogScreen({
  records,
  filteredRecords,
  filters,
  onUpdateFilters,
  onResetFilters,
  onOpenDetail,
}: CatalogScreenProps) {
  const batches = Array.from(
    new Map(records.map((r) => [r.dot_cong_nhan, r.dot_cong_nhan_label])).entries()
  ).sort((a, b) => a[0] - b[0]);

  const types = Array.from(new Set(records.map((r) => r.loai_hinh))).sort();
  const materials = Array.from(new Set(records.map((r) => r.chat_lieu))).sort();
  const periods = Array.from(new Set(records.map((r) => r.thoi_ky_lich_su))).sort();
  const provinces = Array.from(
    new Set(records.map((r) => r.noi_luu_giu.tinh_thanh))
  ).sort();
  const repositories = Array.from(
    new Set(records.map((r) => r.noi_luu_giu.ten_co_quan))
  ).sort();

  const hasActiveFilter = Object.values(filters).some((v) => v.trim() !== '');

  return (
    <div className="py-8 sm:py-10 space-y-8">
      <div className="border-b border-[#E4DDD0] pb-6">
        <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
          Danh mục & Bộ lọc chi tiết
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Danh sách Bảo vật Quốc gia
        </h1>
        <p className="mt-2 text-base text-[#57534E]">
          Lọc chi tiết theo đợt công nhận, loại hình hiện vật, chất liệu, thời kỳ lịch sử và cơ quan lưu giữ.
        </p>
      </div>

      {/* Filter Panel */}
      <section
        aria-label="Bộ lọc chi tiết bảo vật"
        className="bg-white border border-[#E4DDD0] p-4 sm:p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="filter-q"
              className="block text-sm font-medium text-[#292524] mb-1.5"
            >
              Từ khóa (tên, mã, quyết định)
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="filter-q"
                type="search"
                value={filters.q}
                onChange={(e) => onUpdateFilters({ q: e.target.value })}
                placeholder="Ví dụ: Ngọc Lũ, 236/QĐ-TTg..."
                className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-sm sm:text-base text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="filter-dot"
              className="block text-sm font-medium text-[#292524] mb-1.5"
            >
              Đợt công nhận
            </label>
            <select
              id="filter-dot"
              value={filters.dot}
              onChange={(e) => onUpdateFilters({ dot: e.target.value })}
              className="w-full min-h-[44px] px-3 py-2 bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-sm sm:text-base text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
            >
              <option value="">Tất cả các đợt (Đợt 1 – 14)</option>
              {batches.map(([dotNum, label]) => (
                <option key={dotNum} value={String(dotNum)}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-type"
              className="block text-sm font-medium text-[#292524] mb-1.5"
            >
              Loại hình hiện vật
            </label>
            <select
              id="filter-type"
              value={filters.loai_hinh}
              onChange={(e) => onUpdateFilters({ loai_hinh: e.target.value })}
              className="w-full min-h-[44px] px-3 py-2 bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-sm sm:text-base text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
            >
              <option value="">Tất cả loại hình</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-material"
              className="block text-sm font-medium text-[#292524] mb-1.5"
            >
              Chất liệu
            </label>
            <select
              id="filter-material"
              value={filters.chat_lieu}
              onChange={(e) => onUpdateFilters({ chat_lieu: e.target.value })}
              className="w-full min-h-[44px] px-3 py-2 bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-sm sm:text-base text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
            >
              <option value="">Tất cả chất liệu</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-period"
              className="block text-sm font-medium text-[#292524] mb-1.5"
            >
              Thời kỳ lịch sử
            </label>
            <select
              id="filter-period"
              value={filters.thoi_ky}
              onChange={(e) => onUpdateFilters({ thoi_ky: e.target.value })}
              className="w-full min-h-[44px] px-3 py-2 bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-sm sm:text-base text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
            >
              <option value="">Tất cả thời kỳ</option>
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-province"
              className="block text-sm font-medium text-[#292524] mb-1.5"
            >
              Tỉnh / Thành phố lưu giữ
            </label>
            <select
              id="filter-province"
              value={filters.tinh_thanh}
              onChange={(e) => onUpdateFilters({ tinh_thanh: e.target.value })}
              className="w-full min-h-[44px] px-3 py-2 bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-sm sm:text-base text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
            >
              <option value="">Tất cả tỉnh / thành phố</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-[#EFE9DD]">
          <div className="w-full sm:max-w-md">
            <label
              htmlFor="filter-repo"
              className="block text-sm font-medium text-[#292524] mb-1.5"
            >
              Cơ quan / Bảo tàng / Di tích lưu giữ
            </label>
            <select
              id="filter-repo"
              value={filters.co_quan}
              onChange={(e) => onUpdateFilters({ co_quan: e.target.value })}
              className="w-full min-h-[44px] px-3 py-2 bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-sm sm:text-base text-[#1C1917] focus:outline-none focus:border-[#9A3412]"
            >
              <option value="">Tất cả đơn vị lưu giữ</option>
              {repositories.map((repo) => (
                <option key={repo} value={repo}>
                  {repo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-6">
            <p className="text-sm text-[#44403C]">
              Hiển thị{' '}
              <strong className="font-semibold text-[#1C1917] tabular-nums">
                {filteredRecords.length}
              </strong>{' '}
              / <span className="tabular-nums">{records.length}</span> bảo vật
            </p>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] text-sm font-medium text-[#9A3412] bg-[#FBF9F5] border border-[#D6CEBE] rounded-md hover:bg-[#F3EFE7] transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-[#E4DDD0] p-10 text-center">
          <p className="font-serif text-xl font-semibold text-[#1C1917]">
            Chưa tìm thấy bảo vật phù hợp với điều kiện lọc
          </p>
          <p className="mt-2 text-sm sm:text-base text-[#57534E]">
            Kho dữ liệu hiện tại lưu trữ {records.length} bảo vật quốc gia tiêu biểu từ Đợt 1 đến Đợt 14 (02/2026).
            Hãy thử mở rộng bộ lọc hoặc xóa từ khóa tìm kiếm.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 px-5 py-2.5 min-h-[44px] bg-[#9A3412] text-white text-sm font-medium rounded-md hover:bg-[#7C2D12] transition-colors"
          >
            Hiển thị lại toàn bộ danh sách
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((item) => (
            <article
              key={item.ma_bao_vat}
              className="group bg-white border border-[#E4DDD0] p-5 flex flex-col justify-between hover:border-[#C8BFA8] transition-colors"
            >
              <div>
                <div className="text-xs text-[#57534E] mb-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono font-medium text-[#9A3412]">
                    {item.ma_bao_vat}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.dot_cong_nhan_label}</span>
                </div>

                <h2 className="font-serif text-xl font-bold text-[#1C1917] leading-snug mb-3.5">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="text-left hover:text-[#9A3412] transition-colors focus-visible:outline-2 focus-visible:outline-[#9A3412]"
                  >
                    {item.ten_bao_vat}
                  </button>
                </h2>

                <ArtifactFigure treasure={item} compact />

                <dl className="mt-4 space-y-2 text-sm border-t border-[#EFE9DD] pt-3.5">
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#78716C] shrink-0">Loại hình</dt>
                    <dd className="text-[#1C1917] font-medium text-right">
                      {item.loai_hinh}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#78716C] shrink-0">Chất liệu</dt>
                    <dd className="text-[#1C1917] font-medium text-right">
                      {item.chat_lieu}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#78716C] shrink-0">Thời kỳ</dt>
                    <dd className="text-[#292524] text-right">{item.thoi_ky_lich_su}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#78716C] shrink-0">Nơi lưu giữ</dt>
                    <dd className="text-[#292524] text-right">
                      {item.noi_luu_giu.ten_co_quan} ({item.noi_luu_giu.tinh_thanh})
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#EFE9DD]">
                <button
                  type="button"
                  onClick={() => onOpenDetail(item)}
                  className="w-full min-h-[44px] px-4 py-2 bg-[#F3EFE7] hover:bg-[#EAE3D5] text-[#1C1917] text-sm font-semibold rounded-md transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>Xem hồ sơ chi tiết</span>
                  <ArrowRight className="w-4 h-4 text-[#9A3412]" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
