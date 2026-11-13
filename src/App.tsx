import { useEffect, useMemo, useState } from 'react';
import { FilterState, ScreenId, TreasureDataset, TreasureRecord } from './types/treasure';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { DetailScreen } from './screens/DetailScreen';
import { AiAssistantScreen } from './screens/AiAssistantScreen';
import { SourcesScreen } from './screens/SourcesScreen';
import { AboutScreen } from './screens/AboutScreen';

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
  const [dataset, setDataset] = useState<TreasureDataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedTreasure, setSelectedTreasure] = useState<TreasureRecord | null>(null);
  const [pendingAiPrompt, setPendingAiPrompt] = useState<string | null>(null);

  const fetchDataset = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch('/api/treasures');
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu từ máy chủ.');
      }
      const data = (await response.json()) as TreasureDataset;
      setDataset(data);
      if (data.records.length > 0 && !selectedTreasure) {
        setSelectedTreasure(data.records[0]);
      }
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? err.message
          : 'Đã xảy ra lỗi khi tải tệp dữ liệu baovat_data.json.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!dataset) return [];
    const qLower = filters.q.trim().toLowerCase();

    return dataset.records.filter((r) => {
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
  }, [dataset, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      <Header activeScreen={activeScreen} onNavigate={navigateTo} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {loading && (
          <div className="py-20 text-center space-y-3">
            <p className="font-serif text-xl font-semibold text-[#1C1917]">
              Đang tải dữ liệu Bảo vật Quốc gia...
            </p>
            <p className="text-sm text-[#57534E]">
              Đang đồng bộ kho tư liệu baovat_data.json
            </p>
          </div>
        )}

        {!loading && loadError && (
          <div className="my-12 bg-white border border-[#FECACA] p-8 text-center space-y-4">
            <p className="font-serif text-xl font-bold text-[#991B1B]">
              Không thể tải kho tư liệu
            </p>
            <p className="text-sm sm:text-base text-[#44403C]">{loadError}</p>
            <button
              type="button"
              onClick={fetchDataset}
              className="px-5 py-2.5 min-h-[44px] bg-[#9A3412] text-white text-sm font-medium rounded-md hover:bg-[#7C2D12]"
            >
              Thử tải lại
            </button>
          </div>
        )}

        {!loading && !loadError && dataset && (
          <>
            {activeScreen === 'home' && (
              <HomeScreen
                dataset={dataset}
                onApplyFilterAndGoCatalog={handleApplyFilterAndGoCatalog}
                onOpenDetail={handleOpenDetail}
                onNavigate={navigateTo}
              />
            )}

            {activeScreen === 'catalog' && (
              <CatalogScreen
                records={dataset.records}
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
                allRecords={dataset.records}
                onBackToCatalog={() => navigateTo('catalog')}
                onSelectTreasure={handleOpenDetail}
                onAskAiAboutTreasure={handleAskAiAboutTreasure}
              />
            )}

            {activeScreen === 'ai' && (
              <AiAssistantScreen
                records={dataset.records}
                initialPrompt={pendingAiPrompt}
                onConsumeInitialPrompt={() => setPendingAiPrompt(null)}
                onOpenDetail={handleOpenDetail}
              />
            )}

            {activeScreen === 'sources' && <SourcesScreen />}

            {activeScreen === 'about' && (
              <AboutScreen
                dataset={dataset}
                filteredCount={filteredRecords.length}
                filters={filters}
              />
            )}
          </>
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
