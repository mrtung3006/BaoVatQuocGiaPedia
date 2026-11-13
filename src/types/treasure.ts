export interface RepositoryLocation {
  ten_co_quan: string;
  xa_phuong: string;
  tinh_thanh: string;
}

export interface SourceCitation {
  ten_nguon: string;
  tac_gia: string;
  duong_dan: string;
  ngay_truy_cap: string;
}

export interface ArtifactImageInfo {
  duong_dan: string;
  chu_thich: string;
  nguon_anh: string;
  loai_hinh_anh: 'photo' | 'plate';
}

export interface TreasureRecord {
  ma_bao_vat: string;
  ten_bao_vat: string;
  dot_cong_nhan: number;
  dot_cong_nhan_label: string;
  loai_hinh: string;
  chat_lieu: string;
  thoi_ky_lich_su: string;
  noi_luu_giu: RepositoryLocation;
  quyet_dinh_cong_nhan: string;
  loai_ban_hien_thi: string;
  tinh_trang_ban_goc: string;
  nguoi_cho_phep_cong_bo: string;
  pham_vi_duoc_phep: string;
  phan_khong_cong_bo: string;
  muc_kiem_chung: string;
  nguon_tu_lieu: SourceCitation;
  hinh_anh: ArtifactImageInfo;
  kich_thuoc_nien_dai: string;
  mo_ta_ngan: string;
}

export interface DatasetMetadata {
  ten_bo_du_lieu: string;
  phien_ban: string;
  cap_nhat_den: string;
  tong_so_ban_ghi: number;
  co_quan_quan_ly_chinh_thong: string;
  quyen_cong_khai: string;
}

export interface TreasureDataset {
  metadata: DatasetMetadata;
  records: TreasureRecord[];
}

export interface FilterState {
  q: string;
  dot: string;
  loai_hinh: string;
  chat_lieu: string;
  thoi_ky: string;
  tinh_thanh: string;
  co_quan: string;
}

export type ScreenId = 'home' | 'catalog' | 'detail' | 'ai' | 'sources' | 'about';

export interface ReferenceSourceItem {
  id: string;
  ten_nguon: string;
  don_vi_phat_hanh: string;
  nhom_nguon: 'Cổng chính thống Nhà nước' | 'Bảo tàng & Di tích lưu giữ' | 'Tư liệu quốc tế & Báo chí chính thống';
  mo_khai_truc_tiep: boolean;
  duong_dan: string;
  ngay_truy_cap: string;
  pham_vi_su_dung: string;
}
