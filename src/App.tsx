import { useMemo, useState } from 'react';
import rawDataset from '../baovat_data.json';
import { FilterState, ScreenId, TreasureDataset, TreasureRecord } from './types/treasure';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { DetailScreen } from './screens/DetailScreen';
import { AiAssistantScreen } from './screens/AiAssistantScreen';
import { SourcesScreen } from './screens/SourcesScreen';
import { AboutScreen } from './screens/AboutScreen';

const DATASET = rawDataset as TreasureDataset;

const INITIAL_FILTERS: FilterState = {
  q: '',
  dot: '',
  loai_hinh: '',
  chat_lieu: '',
  thoi_ky: '',
  tinh_thanh: '',
  co_quan: '',
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedTreasure, setSelectedTreasure] = useState<TreasureRecord>(
    DATASET.records[0]
  );
  const [pendingAiPrompt, setPendingAiPrompt] = useState<string | null>(null);

  const navigateTo = (screen: ScreenId) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFilterAndGoCatalog = (partial: Partial<FilterState>) => {
    setFilters({ ...INITIAL_FILTERS, ...partial });
    navigateTo('catalog');
  };

  const handleUpdateFilters = (next: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleOpenDetail = (treasure: TreasureRecord) => {
    setSelectedTreasure(treasure);
    navigateTo('detail');
  };

  const handleAskAiAboutTreasure = (treasure: TreasureRecord) => {
    setPendingAiPrompt(
      `Hãy cung cấp hồ sơ tóm tắt, nơi lưu giữ, tình trạng bản gốc và quyết định công nhận của bảo vật "${treasure.ten_bao_vat}" (mã ${treasure.ma_bao_vat}).`
    );
    navigateTo('ai');
  };

  const filteredRecords = useMemo(() => {
    const qLower = filters.q.trim().toLowerCase();

    return DATASET.records.filter((r) => {
      if (filters.dot && String(r.dot_cong_nhan) !== filters.dot) return false;
      if (filters.loai_hinh && r.loai_hinh !== filters.loai_hinh) return false;
      if (filters.chat_lieu && r.chat_lieu !== filters.chat_lieu) return false;
      if (filters.thoi_ky && r.thoi_ky_lich_su !== filters.thoi_ky) return false;
      if (filters.tinh_thanh && r.noi_luu_giu.tinh_thanh !== filters.tinh_thanh) return false;
      if (filters.co_quan && r.noi_luu_giu.ten_co_quan !== filters.co_quan) return false;

      if (qLower) {
        const searchable = [
          r.ma_bao_vat,
          r.ten_bao_vat,
          r.dot_cong_nhan_label,
          r.loai_hinh,
          r.chat_lieu,
          r.thoi_ky_lich_su,
          r.noi_luu_giu.ten_co_quan,
          r.noi_luu_giu.xa_phuong,
          r.noi_luu_giu.tinh_thanh,
          r.quyet_dinh_cong_nhan,
          r.mo_ta_ngan,
        ]
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(qLower)) return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      <Header activeScreen={activeScreen} onNavigate={navigateTo} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {activeScreen === 'home' && (
          <HomeScreen
            dataset={DATASET}
            onApplyFilterAndGoCatalog={handleApplyFilterAndGoCatalog}
            onOpenDetail={handleOpenDetail}
            onNavigate={navigateTo}
          />
        )}

        {activeScreen === 'catalog' && (
          <CatalogScreen
            records={DATASET.records}
            filteredRecords={filteredRecords}
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onResetFilters={handleResetFilters}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {activeScreen === 'detail' && selectedTreasure && (
          <DetailScreen
            treasure={selectedTreasure}
            allRecords={DATASET.records}
            onBackToCatalog={() => navigateTo('catalog')}
            onSelectTreasure={handleOpenDetail}
            onAskAiAboutTreasure={handleAskAiAboutTreasure}
          />
        )}

        {activeScreen === 'ai' && (
          <AiAssistantScreen
            records={DATASET.records}
            initialPrompt={pendingAiPrompt}
            onConsumeInitialPrompt={() => setPendingAiPrompt(null)}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {activeScreen === 'sources' && <SourcesScreen />}

        {activeScreen === 'about' && (
          <AboutScreen
            dataset={DATASET}
            filteredRecords={filteredRecords}
            filters={filters}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
