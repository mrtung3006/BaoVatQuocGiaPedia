import { useState } from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { FilterState, ScreenId, TreasureDataset, TreasureRecord } from '../types/treasure';
import { ArtifactFigure } from '../components/ArtifactFigure';

interface HomeScreenProps {
  dataset: TreasureDataset;
  onApplyFilterAndGoCatalog: (partial: Partial<FilterState>) => void;
  onOpenDetail: (treasure: TreasureRecord) => void;
  onNavigate: (screen: ScreenId) => void;
}

const FEATURED_CODES = [
  'BVQG-D01-001',
  'BVQG-D01-003',
  'BVQG-D12-015',
  'BVQG-D14-017',
];

export function HomeScreen({
  dataset,
  onApplyFilterAndGoCatalog,
  onOpenDetail,
  onNavigate,
}: HomeScreenProps) {
  const [searchInput, setSearchInput] = useState('');

  const featuredTreasures = FEATURED_CODES.map((code) =>
    dataset.records.find((r) => r.ma_bao_vat === code)
  ).filter((item): item is TreasureRecord => Boolean(item));

  const uniqueRepositories = new Set(
    dataset.records.map((r) => r.noi_luu_giu.ten_co_quan)
  ).size;
  const uniqueProvinces = new Set(
    dataset.records.map((r) => r.noi_luu_giu.tinh_thanh)
  ).size;

  const quickBatches = [
    { label: 'Đợt 14 (02/2026)', value: '14' },
    { label: 'Đợt 13 (12/2024)', value: '13' },
    { label: 'Đợt 12 (01/2024)', value: '12' },
    { label: 'Đợt 1 (10/2012)', value: '1' },
  ];

  const quickMaterials = ['Đồng', 'Đá', 'Vàng', 'Gốm hoa nâu', 'Gỗ sơn son thếp vàng'];
  const quickProvinces = ['TP. Hà Nội', 'TP. Hồ Chí Minh', 'TP. Huế', 'Tỉnh Bắc Ninh'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilterAndGoCatalog({ q: searchInput.trim() });
  };

  return (
    <div className="space-y-14 sm:space-y-18">
      {/* Institutional Hero & Smart Search */}
      <section className="pt-8 sm:pt-12 pb-10 border-b border-[#E4DDD0]">
        <div className="max-w-4xl">
          <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
            Cổng thông tin Tra cứu Bảo vật Quốc gia Việt Nam · Cập nhật đến Đợt 14 (02/2026)
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917] leading-[1.15]">
            Tra cứu bảo vật quốc gia theo đợt công nhận, loại hình và nơi lưu giữ
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#44403C] leading-relaxed max-w-3xl">
            Hệ thống tổng hợp hồ sơ chuẩn hóa các Bảo vật Quốc gia tiêu biểu qua 14 đợt công nhận
            của Thủ tướng Chính phủ, phục vụ sinh viên, giáo viên, nhà nghiên cứu và cộng đồng tra cứu
            tập trung trên điện thoại và máy tính.
          </p>
        </div>

        {/* Smart Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 max-w-3xl flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search
              className="w-5 h-5 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nhập tên bảo vật, mã số, chất liệu, quyết định hoặc nơi lưu giữ..."
              aria-label="Tìm kiếm bảo vật quốc gia"
              className="w-full min-h-[48px] pl-11 pr-4 py-3 bg-white border border-[#D6CEBE] rounded-md text-base text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#9A3412] focus:ring-1 focus:ring-[#9A3412]"
            />
          </div>
          <button
            type="submit"
            className="min-h-[48px] px-6 py-3 bg-[#9A3412] text-white font-medium text-base rounded-md hover:bg-[#7C2D12] transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
          >
            <span>Tra cứu danh mục</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        {/* Quick Filters */}
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#57534E] font-medium mr-1">Lọc nhanh theo đợt:</span>
            {quickBatches.map((batch) => (
              <button
                key={batch.value}
                type="button"
                onClick={() => onApplyFilterAndGoCatalog({ dot: batch.value })}
                className="px-3 py-1.5 min-h-[36px] bg-[#F3EFE7] hover:bg-[#EAE3D5] text-[#292524] border border-[#E4DDD0] rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0"
              >
                {batch.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#57534E] font-medium mr-1">Chất liệu & Địa phương:</span>
            {quickMaterials.map((mat) => (
              <button
                key={mat}
                type="button"
                onClick={() => onApplyFilterAndGoCatalog({ chat_lieu: mat })}
                className="px-3 py-1.5 min-h-[36px] bg-white hover:bg-[#F3EFE7] text-[#292524] border border-[#E4DDD0] rounded-md text-sm transition-colors whitespace-nowrap shrink-0"
              >
                {mat}
              </button>
            ))}
            {quickProvinces.map((prov) => (
              <button
                key={prov}
                type="button"
                onClick={() => onApplyFilterAndGoCatalog({ tinh_thanh: prov })}
                className="px-3 py-1.5 min-h-[36px] bg-white hover:bg-[#F3EFE7] text-[#1E3A8A] border border-[#E4DDD0] rounded-md text-sm transition-colors whitespace-nowrap shrink-0"
              >
                {prov}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Pillars of Corpus Scope, Repositories, and Public Rights */}
      <section aria-labelledby="corpus-pillars-heading">
        <h2
          id="corpus-pillars-heading"
          className="font-serif text-2xl font-bold text-[#1C1917] mb-6"
        >
          Phạm vi tư liệu, đơn vị lưu giữ và quyền công khai
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E4DDD0] p-6">
            <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
              01. Khối tư liệu & Hiện vật
            </p>
            <h3 className="mt-2 font-serif text-lg font-semibold text-[#1C1917]">
              Bảo vật Quốc gia qua 14 đợt công nhận
            </h3>
            <p className="mt-2.5 text-sm sm:text-base text-[#44403C] leading-relaxed">
              Bao gồm {dataset.records.length} hồ sơ bảo vật tiêu biểu thuộc nhiều loại hình (khảo cổ,
              điêu khắc tôn giáo, văn bia, ấn triện, nhạc khí cổ, mộc bản, gốm sứ), cập nhật đến
              Quyết định số 236/QĐ-TTg ngày 03/02/2026.
            </p>
          </div>

          <div className="bg-white border border-[#E4DDD0] p-6">
            <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
              02. Đơn vị & Nơi lưu giữ
            </p>
            <h3 className="mt-2 font-serif text-lg font-semibold text-[#1C1917]">
              Bảo tàng, Di tích & Kho lưu trữ toàn quốc
            </h3>
            <p className="mt-2.5 text-sm sm:text-base text-[#44403C] leading-relaxed">
              Ghi nhận chính xác tên cơ quan lưu giữ, địa bàn xã/phường và tỉnh/thành phố tại{' '}
              <span className="tabular-nums font-medium">{uniqueRepositories}</span> bảo tàng, di tích và
              trung tâm lưu trữ trên <span className="tabular-nums font-medium">{uniqueProvinces}</span>{' '}
              địa phương từ Hà Giang đến TP. Hồ Chí Minh.
            </p>
          </div>

          <div className="bg-white border border-[#E4DDD0] p-6">
            <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
              03. Quyền công khai tư liệu
            </p>
            <h3 className="mt-2 font-serif text-lg font-semibold text-[#1C1917]">
              Công khai học thuật & Phi lợi nhuận
            </h3>
            <p className="mt-2.5 text-sm sm:text-base text-[#44403C] leading-relaxed">
              Thực hiện trên cơ sở các quyết định công nhận công khai của cơ quan nhà nước (Cục Di sản
              Văn hóa — Bộ VHTTDL). Ảnh hiển thị là bản giảm kích thước có chú thích, nguồn trích dẫn
              và nêu rõ phạm vi không công bố.
            </p>
          </div>
        </div>
      </section>

      {/* 4-column quantitative strip */}
      <section
        aria-label="Số liệu tổng hợp kho dữ liệu"
        className="grid grid-cols-2 lg:grid-cols-4 border-y border-[#E4DDD0] bg-[#F5F1E8]"
      >
        <div className="p-5 sm:p-6 border-b lg:border-b-0 border-r border-[#E4DDD0]">
          <p className="text-xs text-[#57534E]">Số bản ghi đã chuẩn hóa</p>
          <p className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tabular-nums">
            {dataset.records.length}
          </p>
        </div>
        <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#E4DDD0]">
          <p className="text-xs text-[#57534E]">Phạm vi đợt công nhận</p>
          <p className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tabular-nums">
            Đợt 1 – 14
          </p>
        </div>
        <div className="p-5 sm:p-6 border-r border-[#E4DDD0]">
          <p className="text-xs text-[#57534E]">Đơn vị bảo tàng & di tích</p>
          <p className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] tabular-nums">
            {uniqueRepositories}
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-xs text-[#57534E]">Cập nhật đợt gần nhất</p>
          <p className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#9A3412] tabular-nums">
            02/2026
          </p>
        </div>
      </section>

      {/* Featured Treasures */}
      <section aria-labelledby="featured-treasures-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
              Hiện vật tiêu biểu trong bộ sưu tập
            </p>
            <h2
              id="featured-treasures-heading"
              className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]"
            >
              Hồ sơ bảo vật nổi bật qua các thời kỳ
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#9A3412] hover:text-[#7C2D12] self-start sm:self-auto"
          >
            <span>Xem toàn bộ {dataset.records.length} bảo vật</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredTreasures.map((item) => (
            <article
              key={item.ma_bao_vat}
              className="group bg-white border border-[#E4DDD0] p-5 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-[#57534E] mb-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono font-medium text-[#9A3412]">
                    {item.ma_bao_vat}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.dot_cong_nhan_label}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.chat_lieu}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1C1917] leading-snug mb-4">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="text-left hover:text-[#9A3412] transition-colors focus-visible:outline-2 focus-visible:outline-[#9A3412]"
                  >
                    {item.ten_bao_vat}
                  </button>
                </h3>

                <ArtifactFigure treasure={item} compact />

                <p className="mt-4 text-sm sm:text-base text-[#44403C] leading-relaxed">
                  {item.mo_ta_ngan}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E4DDD0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs sm:text-sm text-[#57534E]">
                  Lưu giữ: <strong className="font-medium text-[#1C1917]">{item.noi_luu_giu.ten_co_quan}</strong> ({item.noi_luu_giu.tinh_thanh})
                </p>
                <button
                  type="button"
                  onClick={() => onOpenDetail(item)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9A3412] hover:text-[#7C2D12] whitespace-nowrap shrink-0 min-h-[40px]"
                >
                  <span>Xem hồ sơ</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* AI Research Assistant Banner */}
      <section className="bg-[#F3EFE7] border border-[#D6CEBE] p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
            Hỗ trợ tra cứu có kiểm chứng
          </p>
          <h2 className="mt-1.5 font-serif text-2xl font-bold text-[#1C1917]">
            Hỏi đáp với Trợ lý AI Gemini dựa trên baovat_data.json
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#44403C] leading-relaxed">
            Đặt câu hỏi bằng ngôn ngữ tự nhiên để tra cứu nhanh quyết định công nhận, nơi lưu giữ,
            chất liệu và nguồn trích dẫn. Mọi phản hồi đều ràng buộc chặt chẽ theo dữ liệu thật của hệ thống.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('ai')}
          className="px-5 py-3 min-h-[48px] bg-[#1C1917] text-white text-sm sm:text-base font-medium rounded-md hover:bg-[#292524] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>Mở Trợ lý AI Gemini</span>
        </button>
      </section>
    </div>
  );
}
