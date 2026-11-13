import { TreasureRecord } from '../types/treasure';

export function buildGroundedSystemInstruction(records: TreasureRecord[]): string {
  const groundedData = records.map((r) => ({
    ma_bao_vat: r.ma_bao_vat,
    ten_bao_vat: r.ten_bao_vat,
    dot_cong_nhan: r.dot_cong_nhan_label,
    loai_hinh: r.loai_hinh,
    chat_lieu: r.chat_lieu,
    thoi_ky_lich_su: r.thoi_ky_lich_su,
    noi_luu_giu: `${r.noi_luu_giu.ten_co_quan}, ${r.noi_luu_giu.xa_phuong}, ${r.noi_luu_giu.tinh_thanh}`,
    quyet_dinh_cong_nhan: r.quyet_dinh_cong_nhan,
    loai_ban_hien_thi: r.loai_ban_hien_thi,
    tinh_trang_ban_goc: r.tinh_trang_ban_goc,
    nguoi_cho_phep_cong_bo: r.nguoi_cho_phep_cong_bo,
    pham_vi_duoc_phep: r.pham_vi_duoc_phep,
    phan_khong_cong_bo: r.phan_khong_cong_bo,
    muc_kiem_chung: r.muc_kiem_chung,
    nguon_tu_lieu: `${r.nguon_tu_lieu.ten_nguon} — ${r.nguon_tu_lieu.tac_gia} (${r.nguon_tu_lieu.duong_dan}, truy cập ${r.nguon_tu_lieu.ngay_truy_cap})`,
    kich_thuoc_nien_dai: r.kich_thuoc_nien_dai,
    mo_ta_ngan: r.mo_ta_ngan,
  }));

  return `Bạn là Trợ lý Tra cứu Học thuật của cổng thông tin BaoVatQuocGiaPedia.
NHIỆM VỤ: Trả lời câu hỏi của người dùng bằng tiếng Việt chuẩn có dấu, HOÀN TOÀN DỰA TRÊN tệp dữ liệu thật baovat_data.json dưới đây.

QUY TẮC BẮT BUỘC (TUYỆT ĐỐI KHÔNG VI PHẠM):
1. KHÔNG tự suy đoán, KHÔNG bịa đặt thông tin, KHÔNG sử dụng kiến thức bên ngoài tệp dữ liệu baovat_data.json.
2. Nếu câu hỏi đề cập đến bảo vật, đợt công nhận, địa phương, chất liệu hoặc chi tiết KHÔNG có trong tệp dữ liệu dưới đây, bạn BẮT BUỘC phải trả lời rõ ràng: "Chưa có tư liệu về nội dung này trong kho dữ liệu BaoVatQuocGiaPedia hiện tại." và nêu ngắn gọn phạm vi dữ liệu hiện có (${records.length} bảo vật tiêu biểu từ Đợt 1 đến Đợt 14 tháng 02/2026).
3. MỖI câu trả lời có nhắc tới bảo vật trong dữ liệu BẮT BUỘC phải ghi đầy đủ 3 thành phần trích dẫn cho từng bảo vật:
   - Mã bản ghi (ví dụ: BVQG-D01-001)
   - Nơi lưu giữ đầy đủ (cơ quan, xã/phường, tỉnh/thành phố)
   - Quyết định công nhận và nguồn trích dẫn chính thức (tên nguồn, đường dẫn, ngày truy cập)
4. Văn phong khách quan, chuẩn mực lưu trữ bảo tàng, trình bày rõ ràng, dễ đọc trên điện thoại.

DỮ LIỆU GỐC (baovat_data.json — ${records.length} bản ghi):
${JSON.stringify(groundedData, null, 2)}`;
}

export function extractCitedCodes(answer: string, records: TreasureRecord[]): string[] {
  const codeMatches = answer.match(/BVQG-D\d{2}-\d{3}/g) || [];
  const validCodes = new Set(records.map((r) => r.ma_bao_vat));
  return Array.from(new Set(codeMatches)).filter((code) => validCodes.has(code));
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'la', 'gi', 'nao', 'o', 'dau', 'cua', 'va', 'nhung', 'cac', 'hay', 'cho', 'biet',
  'thong', 'tin', 've', 'bao', 'vat', 'quoc', 'gia', 'duoc', 'luu', 'giu', 'tai',
  'hien', 'co', 'trong', 'du', 'lieu', 'kem', 'ma', 'ban', 'ghi', 'quyet', 'dinh',
  'cong', 'nhan', 'tinh', 'trang', 'goc', 'nguon', 'trich', 'dan', 'so', 'sanh',
  'tom', 'tat', 'ho', 'cham', 'lam', 'bang', 'hoac', 'thuoc', 'thoi', 'ky', 'dot',
  'nam', 'thang', 'nay', 'giup', 'toi', 'minh', 'hoi',
]);

export function answerFromLocalDataset(
  question: string,
  records: TreasureRecord[]
): { answer: string; citedCodes: string[] } {
  const qRaw = question.toLowerCase().trim();
  const qNorm = normalizeText(question);

  // Check explicit batch number e.g. "đợt 14", "dot 1"
  const batchMatch = qNorm.match(/\bdot\s*(\d{1,2})\b/);
  const requestedBatch = batchMatch ? Number(batchMatch[1]) : null;

  // Check explicit code e.g. BVQG-D01-001
  const explicitCodes: string[] = qRaw.toUpperCase().match(/BVQG-D\d{2}-\d{3}/g) ?? [];

  const tokens = qNorm
    .split(' ')
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));

  const scored = records
    .map((r) => {
      let score = 0;

      if (explicitCodes.includes(r.ma_bao_vat)) {
        score += 100;
      }

      if (requestedBatch !== null && r.dot_cong_nhan === requestedBatch) {
        score += 40;
      }

      const nameNorm = normalizeText(r.ten_bao_vat);
      const repoNorm = normalizeText(
        `${r.noi_luu_giu.ten_co_quan} ${r.noi_luu_giu.xa_phuong} ${r.noi_luu_giu.tinh_thanh}`
      );
      const metaNorm = normalizeText(
        `${r.loai_hinh} ${r.chat_lieu} ${r.thoi_ky_lich_su} ${r.quyet_dinh_cong_nhan}`
      );
      const descNorm = normalizeText(`${r.mo_ta_ngan} ${r.kich_thuoc_nien_dai}`);

      // Exact phrase matches for artifact names or repository names
      if (qNorm.includes(nameNorm) || nameNorm.includes(qNorm)) {
        score += 80;
      }
      if (qNorm.includes(normalizeText(r.noi_luu_giu.ten_co_quan))) {
        score += 50;
      }
      if (qNorm.includes(normalizeText(r.noi_luu_giu.tinh_thanh))) {
        score += 35;
      }

      let matchedTokenCount = 0;
      for (const tok of tokens) {
        let hit = false;
        if (nameNorm.includes(tok)) {
          score += 12;
          hit = true;
        }
        if (repoNorm.includes(tok)) {
          score += 10;
          hit = true;
        }
        if (metaNorm.includes(tok)) {
          score += 8;
          hit = true;
        }
        if (descNorm.includes(tok)) {
          score += 4;
          hit = true;
        }
        if (hit) matchedTokenCount++;
      }

      // Require meaningful overlap if no explicit code or batch matched
      const hasStrongSignal =
        explicitCodes.includes(r.ma_bao_vat) ||
        (requestedBatch !== null && r.dot_cong_nhan === requestedBatch) ||
        matchedTokenCount >= Math.min(2, Math.max(1, tokens.length));

      return { record: r, score: hasStrongSignal ? score : 0 };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      answer:
        `Chưa có tư liệu về nội dung này trong kho dữ liệu BaoVatQuocGiaPedia hiện tại.\n\n` +
        `Kho dữ liệu hiện lưu trữ ${records.length} Bảo vật Quốc gia tiêu biểu từ Đợt 1 (10/2012) đến Đợt 14 (02/2026). ` +
        `Bạn có thể chuyển sang mục Danh mục để lọc theo đợt công nhận, loại hình, chất liệu hoặc địa phương lưu giữ.`,
      citedCodes: [],
    };
  }

  const topScore = scored[0].score;
  const selected = scored
    .filter((item) => item.score >= Math.max(12, topScore * 0.45))
    .slice(0, 6)
    .map((item) => item.record);

  const formattedItems = selected
    .map(
      (r, idx) =>
        `${idx + 1}. ${r.ten_bao_vat} (Mã bản ghi: ${r.ma_bao_vat})\n` +
        `- Đợt công nhận: ${r.dot_cong_nhan_label} — ${r.quyet_dinh_cong_nhan}\n` +
        `- Loại hình / Chất liệu / Thời kỳ: ${r.loai_hinh} · ${r.chat_lieu} · ${r.thoi_ky_lich_su}\n` +
        `- Nơi lưu giữ: ${r.noi_luu_giu.ten_co_quan}, ${r.noi_luu_giu.xa_phuong}, ${r.noi_luu_giu.tinh_thanh}\n` +
        `- Tình trạng bản gốc: ${r.tinh_trang_ban_goc}\n` +
        `- Tóm tắt tư liệu: ${r.mo_ta_ngan}\n` +
        `- Nguồn trích dẫn chính thức: ${r.nguon_tu_lieu.ten_nguon} — ${r.nguon_tu_lieu.tac_gia} (${r.nguon_tu_lieu.duong_dan}, truy cập ngày ${r.nguon_tu_lieu.ngay_truy_cap})`
    )
    .join('\n\n');

  return {
    answer:
      `Kết quả tra cứu trực tiếp từ tệp dữ liệu baovat_data.json (${selected.length} bản ghi phù hợp):\n\n` +
      formattedItems,
    citedCodes: selected.map((r) => r.ma_bao_vat),
  };
}
