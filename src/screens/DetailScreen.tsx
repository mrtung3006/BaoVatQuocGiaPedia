import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { TreasureRecord } from '../types/treasure';
import { ArtifactFigure } from '../components/ArtifactFigure';

interface DetailScreenProps {
  treasure: TreasureRecord;
  allRecords: TreasureRecord[];
  onBackToCatalog: () => void;
  onSelectTreasure: (treasure: TreasureRecord) => void;
  onAskAiAboutTreasure: (treasure: TreasureRecord) => void;
}

export function DetailScreen({
  treasure,
  allRecords,
  onBackToCatalog,
  onSelectTreasure,
  onAskAiAboutTreasure,
}: DetailScreenProps) {
  const currentIndex = allRecords.findIndex((r) => r.ma_bao_vat === treasure.ma_bao_vat);
  const prevItem = currentIndex > 0 ? allRecords[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < allRecords.length - 1
      ? allRecords[currentIndex + 1]
      : null;

  return (
    <div className="py-8 sm:py-10 space-y-8">
      {/* Top Breadcrumb & Sequential Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E4DDD0]">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#1C1917] min-h-[40px] self-start"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Quay lại danh mục bảo vật</span>
        </button>

        <div className="flex items-center gap-3 text-sm">
          {prevItem && (
            <button
              type="button"
              onClick={() => onSelectTreasure(prevItem)}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] bg-white border border-[#E4DDD0] rounded-md hover:bg-[#F3EFE7] text-[#292524]"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Bản ghi trước</span>
            </button>
          )}
          {nextItem && (
            <button
              type="button"
              onClick={() => onSelectTreasure(nextItem)}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] bg-white border border-[#E4DDD0] rounded-md hover:bg-[#F3EFE7] text-[#292524]"
            >
              <span>Bản ghi tiếp theo</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Main Accession Header */}
      <div>
        <div className="text-xs sm:text-sm text-[#57534E] flex flex-wrap items-center gap-2">
          <span className="font-mono font-semibold text-[#9A3412]">
            {treasure.ma_bao_vat}
          </span>
          <span aria-hidden="true">·</span>
          <span>{treasure.dot_cong_nhan_label}</span>
          <span aria-hidden="true">·</span>
          <span>{treasure.loai_hinh}</span>
        </div>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] leading-tight">
          {treasure.ten_bao_vat}
        </h1>
      </div>

      {/* Two-Column Accession Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image + Caption + Quick AI Action */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-[#E4DDD0] p-4 sm:p-5">
            <ArtifactFigure treasure={treasure} aspectClass="aspect-[4/3]" />
            <div className="mt-4 pt-3.5 border-t border-[#EFE9DD] text-xs sm:text-sm text-[#44403C]">
              <p>
                <span className="font-semibold text-[#1C1917]">Loại bản đang hiển thị: </span>
                {treasure.loai_ban_hien_thi}
              </p>
            </div>
          </div>

          <div className="bg-[#F3EFE7] border border-[#D6CEBE] p-5 space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Mô tả khái quát hiện vật
            </h2>
            <p className="text-sm sm:text-base text-[#292524] leading-relaxed">
              {treasure.mo_ta_ngan}
            </p>
            <p className="text-xs sm:text-sm text-[#57534E]">
              <strong className="text-[#1C1917]">Kích thước & Niên đại: </strong>
              {treasure.kich_thuoc_nien_dai}
            </p>
            <button
              type="button"
              onClick={() => onAskAiAboutTreasure(treasure)}
              className="w-full min-h-[44px] mt-2 px-4 py-2.5 bg-[#9A3412] text-white text-sm font-medium rounded-md hover:bg-[#7C2D12] transition-colors inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Hỏi Trợ lý AI về bảo vật này</span>
            </button>
          </div>
        </div>

        {/* Right Column: Normalized Accession Specification Table */}
        <div className="lg:col-span-7 bg-white border border-[#E4DDD0] p-5 sm:p-7 space-y-8">
          <section>
            <h2 className="font-serif text-xl font-bold text-[#1C1917] pb-3 border-b border-[#E4DDD0]">
              1. Hồ sơ định danh & Bảo quản bản gốc
            </h2>
            <dl className="divide-y divide-[#EFE9DD] text-sm sm:text-base">
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Mã bảo vật</dt>
                <dd className="sm:col-span-2 font-mono font-semibold text-[#1C1917]">
                  {treasure.ma_bao_vat}
                </dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Đợt công nhận</dt>
                <dd className="sm:col-span-2 text-[#1C1917] font-medium">
                  {treasure.dot_cong_nhan_label}
                </dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Quyết định công nhận</dt>
                <dd className="sm:col-span-2 text-[#1E3A8A] font-medium">
                  {treasure.quyet_dinh_cong_nhan}
                </dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Loại hình</dt>
                <dd className="sm:col-span-2 text-[#1C1917]">{treasure.loai_hinh}</dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Chất liệu</dt>
                <dd className="sm:col-span-2 text-[#1C1917]">{treasure.chat_lieu}</dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Thời kỳ lịch sử</dt>
                <dd className="sm:col-span-2 text-[#1C1917]">{treasure.thoi_ky_lich_su}</dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Nơi lưu giữ hiện nay</dt>
                <dd className="sm:col-span-2 text-[#1C1917] space-y-0.5">
                  <p className="font-semibold">{treasure.noi_luu_giu.ten_co_quan}</p>
                  <p className="text-[#44403C]">
                    Địa bàn: {treasure.noi_luu_giu.xa_phuong}, {treasure.noi_luu_giu.tinh_thanh}
                  </p>
                </dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Tình trạng bản gốc</dt>
                <dd className="sm:col-span-2 text-[#1C1917] leading-relaxed">
                  {treasure.tinh_trang_ban_goc}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1C1917] pb-3 border-b border-[#E4DDD0]">
              2. Quyền công khai, phạm vi sử dụng & Kiểm chứng
            </h2>
            <dl className="divide-y divide-[#EFE9DD] text-sm sm:text-base">
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Loại bản đang hiển thị</dt>
                <dd className="sm:col-span-2 text-[#1C1917]">{treasure.loai_ban_hien_thi}</dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Người cho phép công bố</dt>
                <dd className="sm:col-span-2 text-[#1C1917]">{treasure.nguoi_cho_phep_cong_bo}</dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Phạm vi được phép</dt>
                <dd className="sm:col-span-2 text-[#1C1917]">{treasure.pham_vi_duoc_phep}</dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Phần không công bố</dt>
                <dd className="sm:col-span-2 text-[#44403C]">{treasure.phan_khong_cong_bo}</dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Mức kiểm chứng</dt>
                <dd className="sm:col-span-2 font-medium text-[#14532D]">
                  {treasure.muc_kiem_chung}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#1C1917] pb-3 border-b border-[#E4DDD0]">
              3. Nguồn tư liệu chính thức
            </h2>
            <dl className="divide-y divide-[#EFE9DD] text-sm sm:text-base">
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Tên nguồn tư liệu</dt>
                <dd className="sm:col-span-2 font-medium text-[#1C1917]">
                  {treasure.nguon_tu_lieu.ten_nguon}
                </dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Tác giả / Cơ quan</dt>
                <dd className="sm:col-span-2 text-[#1C1917]">{treasure.nguon_tu_lieu.tac_gia}</dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Đường dẫn gốc</dt>
                <dd className="sm:col-span-2 break-all">
                  <a
                    href={treasure.nguon_tu_lieu.duong_dan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#1E3A8A] underline underline-offset-4 hover:text-[#9A3412]"
                  >
                    <span>{treasure.nguon_tu_lieu.duong_dan}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </dd>
              </div>
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <dt className="text-[#57534E] font-medium">Ngày truy cập</dt>
                <dd className="sm:col-span-2 font-mono text-[#1C1917] tabular-nums">
                  {treasure.nguon_tu_lieu.ngay_truy_cap}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
