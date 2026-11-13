import 'dotenv/config';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

interface RepositoryLocation {
  ten_co_quan: string;
  xa_phuong: string;
  tinh_thanh: string;
}

interface SourceCitation {
  ten_nguon: string;
  tac_gia: string;
  duong_dan: string;
  ngay_truy_cap: string;
}

interface TreasureRecord {
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
  hinh_anh: {
    duong_dan: string;
    chu_thich: string;
    nguon_anh: string;
    loai_hinh_anh: string;
  };
  kich_thuoc_nien_dai: string;
  mo_ta_ngan: string;
}

interface TreasureDataset {
  metadata: Record<string, unknown>;
  records: TreasureRecord[];
}

function loadDataset(): TreasureDataset {
  const dataPath = path.join(process.cwd(), 'baovat_data.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw) as TreasureDataset;
}

function escapeCsvCell(value: string): string {
  const normalized = value.replace(/\r?\n/g, ' ').trim();
  if (normalized.includes('"') || normalized.includes(',') || normalized.includes(';')) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

function buildCsvContent(records: TreasureRecord[]): string {
  const headers = [
    'Mã bảo vật',
    'Tên bảo vật',
    'Đợt công nhận',
    'Loại hình',
    'Chất liệu',
    'Thời kỳ lịch sử',
    'Cơ quan lưu giữ',
    'Xã/Phường',
    'Tỉnh/Thành phố',
    'Quyết định công nhận',
    'Loại bản đang hiển thị',
    'Tình trạng bản gốc',
    'Người cho phép công bố',
    'Phạm vi được phép',
    'Phần không công bố',
    'Mức kiểm chứng',
    'Tên nguồn tư liệu',
    'Tác giả nguồn',
    'Đường dẫn nguồn',
    'Ngày truy cập',
  ];

  const rows = records.map((r) => [
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
    r.loai_ban_hien_thi,
    r.tinh_trang_ban_goc,
    r.nguoi_cho_phep_cong_bo,
    r.pham_vi_duoc_phep,
    r.phan_khong_cong_bo,
    r.muc_kiem_chung,
    r.nguon_tu_lieu.ten_nguon,
    r.nguon_tu_lieu.tac_gia,
    r.nguon_tu_lieu.duong_dan,
    r.nguon_tu_lieu.ngay_truy_cap,
  ]);

  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map((cell) => escapeCsvCell(String(cell ?? ''))).join(',')),
  ];

  return '\uFEFF' + lines.join('\r\n');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/treasures', (_req: Request, res: Response) => {
    try {
      const dataset = loadDataset();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json(dataset);
    } catch (error) {
      console.error('Lỗi đọc tệp baovat_data.json:', error);
      res.status(500).json({ error: 'Không thể đọc tệp dữ liệu baovat_data.json.' });
    }
  });

  app.get('/api/export', (req: Request, res: Response) => {
    try {
      const dataset = loadDataset();
      const format = req.query.format === 'csv' ? 'csv' : 'json';
      const dotParam = req.query.dot ? Number(req.query.dot) : null;
      const loaiHinhParam = typeof req.query.loai_hinh === 'string' ? req.query.loai_hinh.trim() : '';
      const chatLieuParam = typeof req.query.chat_lieu === 'string' ? req.query.chat_lieu.trim() : '';
      const tinhThanhParam = typeof req.query.tinh_thanh === 'string' ? req.query.tinh_thanh.trim() : '';
      const queryParam = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

      let filtered = dataset.records;
      if (dotParam && !Number.isNaN(dotParam)) {
        filtered = filtered.filter((r) => r.dot_cong_nhan === dotParam);
      }
      if (loaiHinhParam) {
        filtered = filtered.filter((r) => r.loai_hinh === loaiHinhParam);
      }
      if (chatLieuParam) {
        filtered = filtered.filter((r) => r.chat_lieu === chatLieuParam);
      }
      if (tinhThanhParam) {
        filtered = filtered.filter((r) => r.noi_luu_giu.tinh_thanh === tinhThanhParam);
      }
      if (queryParam) {
        filtered = filtered.filter((r) => {
          const hay = [
            r.ma_bao_vat,
            r.ten_bao_vat,
            r.loai_hinh,
            r.chat_lieu,
            r.thoi_ky_lich_su,
            r.noi_luu_giu.ten_co_quan,
            r.noi_luu_giu.tinh_thanh,
            r.quyet_dinh_cong_nhan,
          ]
            .join(' ')
            .toLowerCase();
          return hay.includes(queryParam);
        });
      }

      if (format === 'csv') {
        const csv = buildCsvContent(filtered);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="baovat_data.csv"');
        res.send(csv);
        return;
      }

      const exportedPayload = {
        metadata: {
          ...dataset.metadata,
          so_ban_ghi_xuat: filtered.length,
          ngay_xuat: new Date().toISOString().split('T')[0],
        },
        records: filtered,
      };
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="baovat_data.json"');
      res.send(JSON.stringify(exportedPayload, null, 2));
    } catch (error) {
      console.error('Lỗi xuất dữ liệu:', error);
      res.status(500).json({ error: 'Không thể xuất tệp dữ liệu.' });
    }
  });

  app.post('/api/ai/ask', async (req: Request, res: Response) => {
    try {
      const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
      const history = Array.isArray(req.body?.history) ? req.body.history : [];

      if (!question) {
        res.status(400).json({ error: 'Vui lòng nhập câu hỏi tra cứu.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(503).json({
          error:
            'Chưa cấu hình biến môi trường GEMINI_API_KEY trên máy chủ. Vui lòng thiết lập khóa API trong phần Secrets.',
        });
        return;
      }

      const dataset = loadDataset();
      const groundedData = dataset.records.map((r) => ({
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

      const systemInstruction = `Bạn là Trợ lý Tra cứu Học thuật của cổng thông tin BaoVatQuocGiaPedia.
NHIỆM VỤ: Trả lời câu hỏi của người dùng bằng tiếng Việt chuẩn có dấu, HOÀN TOÀN DỰA TRÊN tệp dữ liệu thật baovat_data.json dưới đây.

QUY TẮC BẮT BUỘC (TUYỆT ĐỐI KHÔNG VI PHẠM):
1. KHÔNG tự suy đoán, KHÔNG bịa đặt thông tin, KHÔNG sử dụng kiến thức bên ngoài tệp dữ liệu baovat_data.json.
2. Nếu câu hỏi đề cập đến bảo vật, đợt công nhận, địa phương, chất liệu hoặc chi tiết KHÔNG có trong tệp dữ liệu dưới đây, bạn BẮT BUỘC phải trả lời rõ ràng: "Chưa có tư liệu về nội dung này trong kho dữ liệu BaoVatQuocGiaPedia hiện tại." và nêu ngắn gọn phạm vi dữ liệu hiện có (18 bảo vật tiêu biểu từ Đợt 1 đến Đợt 14 tháng 02/2026).
3. MỖI câu trả lời có nhắc tới bảo vật trong dữ liệu BẮT BUỘC phải ghi đầy đủ 3 thành phần trích dẫn cho từng bảo vật:
   - Mã bản ghi (ví dụ: BVQG-D01-001)
   - Nơi lưu giữ đầy đủ (cơ quan, xã/phường, tỉnh/thành phố)
   - Quyết định công nhận và nguồn trích dẫn chính thức (tên nguồn, đường dẫn, ngày truy cập)
4. Văn phong khách quan, chuẩn mực lưu trữ bảo tàng, trình bày rõ ràng, dễ đọc trên điện thoại.

DỮ LIỆU GỐC (baovat_data.json — ${dataset.records.length} bản ghi):
${JSON.stringify(groundedData, null, 2)}`;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const recentContext = history
        .slice(-6)
        .filter((item: { role?: string; text?: string }) => item && typeof item.text === 'string')
        .map((item: { role?: string; text?: string }) =>
          `${item.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${item.text}`
        )
        .join('\n\n');

      const promptContents = recentContext
        ? `Ngữ cảnh hội thoại gần đây:\n${recentContext}\n\nCâu hỏi hiện tại của người dùng: ${question}`
        : question;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: promptContents,
        config: {
          systemInstruction,
        },
      });

      const answer = response.text?.trim() || 'Chưa có tư liệu phản hồi từ mô hình.';
      const codeMatches = answer.match(/BVQG-D\d{2}-\d{3}/g) || [];
      const validCodes = new Set(dataset.records.map((r) => r.ma_bao_vat));
      const citedCodes = Array.from(new Set(codeMatches)).filter((code) => validCodes.has(code));

      res.json({
        answer,
        citedCodes,
      });
    } catch (error: unknown) {
      console.error('Lỗi gọi Gemini API:', error);
      const errObj = error as { status?: number; message?: string };
      const statusCode = typeof errObj?.status === 'number' ? errObj.status : 500;
      let userMessage = 'Đã xảy ra lỗi khi kết nối với Trợ lý AI Gemini. Vui lòng thử lại sau.';

      if (statusCode === 401 || statusCode === 403 || statusCode === 400) {
        userMessage =
          'Khóa API Gemini không hợp lệ hoặc chưa đủ quyền truy cập. Vui lòng kiểm tra cấu hình trong mục Settings > Secrets.';
      } else if (statusCode === 429) {
        userMessage = 'Hệ thống đang đạt giới hạn lượt truy vấn. Vui lòng đợi ít phút rồi thử lại.';
      }

      res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
        error: userMessage,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BaoVatQuocGiaPedia server đang chạy tại http://localhost:${PORT}`);
  });
}

startServer();
