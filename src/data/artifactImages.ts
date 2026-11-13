import trongDongNgocLuImg from '../assets/images/trong_dong_ngoc_lu_1794580032462.jpg';
import tuongQuanAmButThapImg from '../assets/images/tuong_quan_am_but_thap_1794580032647.jpg';
import anHoangDeChiBaoImg from '../assets/images/an_hoang_de_chi_bao_1794580033547.jpg';
import biaTienSiVanMieuImg from '../assets/images/bia_tien_si_van_mieu_1794580035374.jpg';
import thapDongDaoThinhImg from '../assets/images/thap_dong_dao_thinh_1794580034336.jpg';
import gomHoaNauLyTranImg from '../assets/images/gom_hoa_nau_ly_tran_1794580035652.jpg';

const PHOTO_MAP: Record<string, string> = {
  trong_dong_ngoc_lu: trongDongNgocLuImg,
  tuong_quan_am_but_thap: tuongQuanAmButThapImg,
  an_hoang_de_chi_bao: anHoangDeChiBaoImg,
  bia_tien_si_van_mieu: biaTienSiVanMieuImg,
  thap_dong_dao_thinh: thapDongDaoThinhImg,
  gom_hoa_nau_ly_tran: gomHoaNauLyTranImg,
};

export function resolveArtifactImage(duongDan: string): string {
  if (PHOTO_MAP[duongDan]) {
    return PHOTO_MAP[duongDan];
  }
  return duongDan;
}
