import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ScreenId } from '../types/treasure';

interface HeaderProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const NAV_ITEMS: Array<{ id: ScreenId; label: string }> = [
  { id: 'home', label: 'Tổng quan' },
  { id: 'catalog', label: 'Danh mục' },
  { id: 'sources', label: 'Nguồn tư liệu' },
  { id: 'about', label: 'Giới thiệu' },
];

export function Header({ activeScreen, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (screen: ScreenId) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E4DDD0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="text-left font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A3412]"
        >
          BaoVatQuocGiaPedia
        </button>

        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#57534E]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              activeScreen === item.id ||
              (activeScreen === 'detail' && item.id === 'catalog');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A3412] ${
                  isActive
                    ? 'text-[#1C1917] border-[#9A3412] font-semibold'
                    : 'border-transparent hover:text-[#1C1917] hover:border-[#D6CEBE]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('ai')}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A3412] ${
              activeScreen === 'ai'
                ? 'bg-[#7C2D12] text-white'
                : 'bg-[#9A3412] text-white hover:bg-[#7C2D12]'
            }`}
          >
            Trợ lý AI
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-[#1C1917] hover:bg-[#F3EFE7] focus-visible:outline-2 focus-visible:outline-[#9A3412]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Điều hướng di động"
          className="md:hidden border-t border-[#E4DDD0] bg-[#FBF9F5] px-4 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              activeScreen === item.id ||
              (activeScreen === 'detail' && item.id === 'catalog');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3 py-3 rounded-md text-base font-medium min-h-[44px] transition-colors ${
                  isActive
                    ? 'bg-[#F3EFE7] text-[#9A3412] font-semibold'
                    : 'text-[#292524] hover:bg-[#F3EFE7]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
