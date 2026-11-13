import { ExternalLink, ShieldCheck } from 'lucide-react';
import { OFFICIAL_REFERENCE_SOURCES } from '../data/officialSources';

export function SourcesScreen() {
  const officialCount = OFFICIAL_REFERENCE_SOURCES.filter(
    (s) => s.nhom_nguon === 'Cổng chính thống Nhà nước' || s.nhom_nguon === 'Bảo tàng & Di tích lưu giữ'
  ).length;

  return (
    <div className="py-8 sm:py-10 space-y-10">
      <div className="border-b border-[#E4DDD0] pb-6">
        <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
          Minh bạch học thuật & Pháp lý di sản
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Nguồn tư liệu tham khảo & Ghi nhận quyền công khai
        </h1>
        <p className="mt-2.5 text-base text-[#44403C] max-w-3xl leading-relaxed">
          Danh mục <span className="tabular-nums font-medium">{OFFICIAL_REFERENCE_SOURCES.length}</span> nguồn
          tư liệu đối chiếu phục vụ xây dựng kho dữ liệu BaoVatQuocGiaPedia, trong đó có{' '}
          <span className="tabular-nums font-medium">{officialCount}</span> cổng thông tin chính thống của
          cơ quan nhà nước, bảo tàng và di tích lưu giữ trực tiếp.
        </p>
      </div>

      {/* Public Release Charter */}
      <section
        aria-labelledby="public-rights-heading"
        className="bg-white border border-[#E4DDD0] p-6 sm:p-8 space-y-4"
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-[#14532D] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2
              id="public-rights-heading"
              className="font-serif text-2xl font-bold text-[#1C1917]"
            >
              Ghi nhận quyền công khai tư liệu và quy chuẩn hiển thị
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#292524] leading-relaxed">
              Quyền công khai thông tin và sử dụng tư liệu minh họa trong ứng dụng này dựa trên các
              Quyết định công nhận Bảo vật Quốc gia được Thủ tướng Chính phủ ban hành công khai và
              thông tin phổ biến di sản của Cục Di sản Văn hóa (Bộ Văn hóa, Thể thao và Du lịch), các
              bảo tàng công lập và ban quản lý di tích trên toàn quốc.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-[#EFE9DD] text-sm text-[#44403C]">
          <div>
            <p className="font-semibold text-[#1C1917]">Phạm vi được phép</p>
            <p className="mt-1 leading-relaxed">
              Phục vụ tra cứu công khai, học tập của học sinh – sinh viên, giảng dạy và nghiên cứu
              khoa học phi lợi nhuận. Không sử dụng cho mục đích thương mại.
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#1C1917]">Chuẩn hóa hình ảnh</p>
            <p className="mt-1 leading-relaxed">
              Toàn bộ ảnh chụp và bản đồ họa lưu trữ đều được hiển thị ở kích thước giảm nhẹ để
              tải nhanh trên điện thoại, luôn kèm chú thích và nguồn gốc ngay dưới ảnh.
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#1C1917]">Phần không công bố</p>
            <p className="mt-1 leading-relaxed">
              Hệ thống chủ động không thu thập và không công bố thông số an ninh bảo vệ, tọa độ kho
              lưu trữ nội bộ hay bản quét kỹ thuật độ phân giải gốc của đơn vị quản lý.
            </p>
          </div>
        </div>
      </section>

      {/* Reference Sources List (>= 7 sources, with open-access official portals) */}
      <section aria-labelledby="sources-list-heading" className="space-y-5">
        <h2
          id="sources-list-heading"
          className="font-serif text-2xl font-bold text-[#1C1917]"
        >
          Danh mục nguồn tư liệu chính ({OFFICIAL_REFERENCE_SOURCES.length} nguồn)
        </h2>

        <div className="divide-y divide-[#E4DDD0] border border-[#E4DDD0] bg-white">
          {OFFICIAL_REFERENCE_SOURCES.map((source, index) => (
            <article key={source.id} className="p-5 sm:p-6 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                <span className="font-mono font-semibold text-[#9A3412] tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#1E3A8A]">{source.nhom_nguon}</span>
                <span aria-hidden="true">·</span>
                <span>{source.mo_khai_truc_tiep ? 'Nguồn mở trực tuyến' : 'Tài liệu tham chiếu'}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Truy cập: {source.ngay_truy_cap}</span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                {source.ten_nguon}
              </h3>

              <p className="text-sm text-[#44403C]">
                <strong className="font-medium text-[#1C1917]">Đơn vị phát hành: </strong>
                {source.don_vi_phat_hanh}
              </p>

              <p className="text-sm text-[#44403C] leading-relaxed">
                <strong className="font-medium text-[#1C1917]">Phạm vi đối chiếu: </strong>
                {source.pham_vi_su_dung}
              </p>

              <div className="pt-1">
                <a
                  href={source.duong_dan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1E3A8A] underline underline-offset-4 hover:text-[#9A3412] break-all"
                >
                  <span>Mở nguồn tư liệu: {source.duong_dan}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
