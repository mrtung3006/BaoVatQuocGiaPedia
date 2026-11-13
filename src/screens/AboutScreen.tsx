import { Download, FileSpreadsheet, FileJson } from 'lucide-react';
import { FilterState, TreasureDataset } from '../types/treasure';

interface AboutScreenProps {
  dataset: TreasureDataset;
  filteredCount: number;
  filters: FilterState;
}

export function AboutScreen({ dataset, filteredCount, filters }: AboutScreenProps) {
  const hasActiveFilter = Object.values(filters).some((v) => v.trim() !== '');

  const buildExportUrl = (format: 'json' | 'csv', onlyFiltered: boolean) => {
    const params = new URLSearchParams({ format });
    if (onlyFiltered) {
      if (filters.q) params.set('q', filters.q);
      if (filters.dot) params.set('dot', filters.dot);
      if (filters.loai_hinh) params.set('loai_hinh', filters.loai_hinh);
      if (filters.chat_lieu) params.set('chat_lieu', filters.chat_lieu);
      if (filters.tinh_thanh) params.set('tinh_thanh', filters.tinh_thanh);
    }
    return `/api/export?${params.toString()}`;
  };

  return (
    <div className="py-8 sm:py-10 space-y-10">
      <div className="border-b border-[#E4DDD0] pb-6">
        <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
          Thông tin dự án & Dữ liệu mở học thuật
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Giới thiệu BaoVatQuocGiaPedia
        </h1>
      </div>

      {/* Mandatory Intern Attribution Block */}
      <section
        aria-labelledby="intern-credit-heading"
        className="bg-[#F3EFE7] border border-[#D6CEBE] p-6 sm:p-8 space-y-3"
      >
        <h2
          id="intern-credit-heading"
          className="text-xs font-semibold uppercase tracking-wider text-[#9A3412]"
        >
          Thông tin tác giả & Đơn vị thực hiện
        </h2>
        <p className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] leading-relaxed">
          Sản phẩm thực tập của Nguyễn Văn Tùng, MSV: PH62340, Chương trình Thực tập sinh FPT Polytechnic & IMTA TECH, dự án xã hội phi lợi nhuận.
        </p>
        <p className="text-sm sm:text-base text-[#44403C] leading-relaxed">
          Ứng dụng được xây dựng nhằm phục vụ học sinh, sinh viên, giáo viên, nhà nghiên cứu văn hóa
          – lịch sử và công chúng yêu mến di sản Việt Nam tra cứu nhanh các Bảo vật Quốc gia trên thiết
          bị di động, máy tính bảng và máy tính cá nhân.
        </p>
      </section>

      {/* Data Export Section */}
      <section
        aria-labelledby="export-data-heading"
        className="bg-white border border-[#E4DDD0] p-6 sm:p-8 space-y-6"
      >
        <div>
          <h2
            id="export-data-heading"
            className="font-serif text-2xl font-bold text-[#1C1917]"
          >
            Xuất dữ liệu ra tệp để tái sử dụng học thuật
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#44403C] leading-relaxed">
            Người dùng có thể tải xuống toàn bộ bộ dữ liệu chuẩn hóa{' '}
            <code className="font-mono text-sm bg-[#F3EFE7] px-1.5 py-0.5 rounded">
              baovat_data.json
            </code>{' '}
            ({dataset.records.length} bản ghi) hoặc tệp bảng tính CSV mã hóa UTF-8 (tương thích tiếng
            Việt có dấu trên Excel / Google Sheets) để phục vụ nghiên cứu, giảng dạy phi lợi nhuận.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={buildExportUrl('json', false)}
            download="baovat_data.json"
            className="flex items-center justify-between gap-4 p-4 min-h-[56px] bg-[#FBF9F5] hover:bg-[#F3EFE7] border border-[#D6CEBE] rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileJson className="w-6 h-6 text-[#9A3412] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm sm:text-base font-semibold text-[#1C1917]">
                  Tải tệp JSON đầy đủ (baovat_data.json)
                </p>
                <p className="text-xs text-[#57534E] tabular-nums">
                  {dataset.records.length} bản ghi · Đầy đủ trường cấu trúc & nguồn trích dẫn
                </p>
              </div>
            </div>
            <Download className="w-5 h-5 text-[#9A3412] shrink-0" aria-hidden="true" />
          </a>

          <a
            href={buildExportUrl('csv', false)}
            download="baovat_data.csv"
            className="flex items-center justify-between gap-4 p-4 min-h-[56px] bg-[#FBF9F5] hover:bg-[#F3EFE7] border border-[#D6CEBE] rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-6 h-6 text-[#1E3A8A] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm sm:text-base font-semibold text-[#1C1917]">
                  Tải tệp CSV đầy đủ (baovat_data.csv)
                </p>
                <p className="text-xs text-[#57534E] tabular-nums">
                  {dataset.records.length} bản ghi · Mã hóa UTF-8 BOM mở chuẩn trên Excel
                </p>
              </div>
            </div>
            <Download className="w-5 h-5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
          </a>
        </div>

        {hasActiveFilter && (
          <div className="pt-4 border-t border-[#EFE9DD] space-y-3">
            <p className="text-sm font-medium text-[#292524]">
              Bạn đang áp dụng bộ lọc tại Danh mục ({filteredCount} bản ghi phù hợp):
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={buildExportUrl('json', true)}
                download="baovat_data_loc.json"
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#9A3412] text-white text-sm font-medium rounded-md hover:bg-[#7C2D12] transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Xuất {filteredCount} bản ghi đã lọc (JSON)</span>
              </a>
              <a
                href={buildExportUrl('csv', true)}
                download="baovat_data_loc.csv"
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#1C1917] text-white text-sm font-medium rounded-md hover:bg-[#292524] transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Xuất {filteredCount} bản ghi đã lọc (CSV)</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Methodology & Dataset Governance */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E4DDD0] p-6 space-y-3">
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            Cấu trúc chuẩn hóa của tệp dữ liệu
          </h3>
          <p className="text-sm sm:text-base text-[#44403C] leading-relaxed">
            Mỗi bản ghi trong <code className="font-mono text-sm">baovat_data.json</code> được
            chuẩn hóa đồng bộ với đầy đủ các trường: mã bảo vật, tên bảo vật, đợt công nhận, loại
            hình, chất liệu, thời kỳ lịch sử, nơi lưu giữ (tên cơ quan, xã/phường, tỉnh/thành phố),
            quyết định công nhận, loại bản đang hiển thị, tình trạng bản gốc, người cho phép công bố,
            phạm vi được phép, phần không công bố, mức kiểm chứng và nguồn tư liệu.
          </p>
        </div>

        <div className="bg-white border border-[#E4DDD0] p-6 space-y-3">
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            Phiên bản & Cập nhật gần nhất
          </h3>
          <dl className="space-y-2 text-sm sm:text-base">
            <div className="flex justify-between gap-4 py-1.5 border-b border-[#EFE9DD]">
              <dt className="text-[#57534E]">Phiên bản dữ liệu</dt>
              <dd className="font-mono font-medium text-[#1C1917]">{dataset.metadata.phien_ban}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 border-b border-[#EFE9DD]">
              <dt className="text-[#57534E]">Cập nhật tới</dt>
              <dd className="text-[#1C1917] font-medium text-right">{dataset.metadata.cap_nhat_den}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5">
              <dt className="text-[#57534E]">Cơ quan tham chiếu gốc</dt>
              <dd className="text-[#1C1917] text-right">{dataset.metadata.co_quan_quan_ly_chinh_thong}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
