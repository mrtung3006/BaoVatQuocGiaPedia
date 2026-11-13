import { ScreenId } from '../types/treasure';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-[#E4DDD0] bg-[#F5F1E8] mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#E4DDD0]">
          <div>
            <p className="font-serif text-lg font-bold text-[#1C1917]">
              BaoVatQuocGiaPedia
            </p>
            <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
              Cổng thông tin tra cứu Bảo vật Quốc gia Việt Nam theo đợt công nhận,
              loại hình, chất liệu, thời kỳ lịch sử và nơi lưu giữ (cập nhật đến Đợt 14 tháng 02/2026).
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#1C1917] mb-3">
              Chuyên mục tra cứu
            </p>
            <ul className="space-y-2 text-sm text-[#57534E]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#9A3412] transition-colors"
                >
                  Trang chủ & Tra cứu tổng quan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#9A3412] transition-colors"
                >
                  Danh sách & Bộ lọc chi tiết
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('ai')}
                  className="hover:text-[#9A3412] transition-colors"
                >
                  Trợ lý AI Gemini tra cứu học thuật
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#1C1917] mb-3">
              Minh bạch tư liệu & Dự án
            </p>
            <ul className="space-y-2 text-sm text-[#57534E]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('sources')}
                  className="hover:text-[#9A3412] transition-colors"
                >
                  Nguồn tư liệu chính thống & Quyền công khai
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#9A3412] transition-colors"
                >
                  Giới thiệu & Xuất tệp baovat_data
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#78716C]">
          <p>
            Sản phẩm thực tập của Nguyễn Văn Tùng, MSV: PH62340, Chương trình Thực tập sinh FPT Polytechnic & IMTA TECH, dự án xã hội phi lợi nhuận.
          </p>
          <p className="shrink-0">
            Tư liệu công khai phục vụ học tập & nghiên cứu
          </p>
        </div>
      </div>
    </footer>
  );
}
