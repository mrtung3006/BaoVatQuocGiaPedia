import { useEffect, useState } from 'react';
import { ArrowRight, Send, Trash2 } from 'lucide-react';
import { TreasureRecord } from '../types/treasure';

interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citedCodes?: string[];
  error?: boolean;
}

interface AiAssistantScreenProps {
  records: TreasureRecord[];
  initialPrompt: string | null;
  onConsumeInitialPrompt: () => void;
  onOpenDetail: (treasure: TreasureRecord) => void;
}

const SUGGESTED_QUESTIONS = [
  'Đợt 14 tháng 02/2026 gồm những bảo vật nào trong dữ liệu và được lưu giữ ở đâu?',
  'Những bảo vật quốc gia nào đang được lưu giữ tại Bảo tàng Lịch sử Quốc gia?',
  'Hãy cho biết thông tin quyết định công nhận và tình trạng bản gốc của Ấn vàng Hoàng đế chi bảo.',
  'Cho biết thông tin về Trống đồng Ngọc Lũ và Thạp đồng Đào Thịnh kèm mã bảo vật.',
  'Trống đồng Quảng Chính hiện lưu giữ ở đâu?',
];

export function AiAssistantScreen({
  records,
  initialPrompt,
  onConsumeInitialPrompt,
  onOpenDetail,
}: AiAssistantScreenProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitQuestion = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: AiMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            role: 'assistant',
            text: data?.error || 'Không thể kết nối với Trợ lý AI Gemini. Vui lòng thử lại.',
            error: true,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.answer,
          citedCodes: Array.isArray(data.citedCodes) ? data.citedCodes : [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          text: 'Lỗi kết nối mạng tới máy chủ tra cứu. Vui lòng kiểm tra kết nối và thử lại.',
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      const p = initialPrompt.trim();
      onConsumeInitialPrompt();
      submitQuestion(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuestion(question);
  };

  const resolveCitedTreasures = (codes?: string[]): TreasureRecord[] => {
    if (!codes || codes.length === 0) return [];
    return codes
      .map((code) => records.find((r) => r.ma_bao_vat === code))
      .filter((item): item is TreasureRecord => Boolean(item));
  };

  return (
    <div className="py-8 sm:py-10 space-y-8">
      <div className="border-b border-[#E4DDD0] pb-6">
        <p className="text-xs font-medium tracking-wider uppercase text-[#9A3412]">
          Trợ lý Tra cứu Học thuật · Mô hình Gemini
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Trợ lý AI Gemini tra cứu Bảo vật Quốc gia
        </h1>
        <p className="mt-2.5 text-base text-[#44403C] max-w-3xl leading-relaxed">
          Trợ lý trả lời câu hỏi hoàn toàn dựa trên dữ liệu thật trong tệp{' '}
          <code className="font-mono text-sm bg-[#F3EFE7] px-1.5 py-0.5 rounded">
            baovat_data.json
          </code>{' '}
          ({records.length} bản ghi). Mọi câu trả lời đều phải kèm mã bảo vật, nơi lưu giữ và quyết
          định/nguồn trích dẫn chính thức; nội dung ngoài dữ liệu sẽ được thông báo chưa có tư liệu.
        </p>
      </div>

      {/* Rules + Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E4DDD0] p-5 space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Nguyên tắc kiểm chứng bắt buộc
            </h2>
            <ul className="space-y-2 text-sm text-[#44403C] leading-relaxed list-disc pl-5">
              <li>Chỉ sử dụng thông tin có trong {records.length} bản ghi của hệ thống.</li>
              <li>Luôn trích dẫn mã bản ghi (BVQG-...), nơi lưu giữ và số quyết định.</li>
              <li>Không tự suy diễn hoặc bổ sung dữ liệu ngoài kho lưu trữ.</li>
              <li>Thông báo &ldquo;Chưa có tư liệu&rdquo; khi không tìm thấy trong dữ liệu.</li>
            </ul>
          </div>

          <div className="bg-[#F5F1E8] border border-[#E4DDD0] p-5 space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Câu hỏi tra cứu gợi ý
            </h2>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={isLoading}
                  onClick={() => submitQuestion(q)}
                  className="w-full text-left px-3.5 py-2.5 min-h-[44px] bg-white border border-[#E4DDD0] hover:border-[#9A3412] rounded-md text-sm text-[#292524] transition-colors disabled:opacity-60"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Conversation Area */}
        <section
          aria-label="Khung hỏi đáp Trợ lý AI"
          className="lg:col-span-8 bg-white border border-[#E4DDD0] flex flex-col min-h-[520px]"
        >
          <div className="px-5 py-3.5 border-b border-[#E4DDD0] flex items-center justify-between gap-4 bg-[#FAF7F0]">
            <p className="text-sm font-medium text-[#292524]">
              Phiên tra cứu trực tiếp trên kho tư liệu baovat_data.json
            </p>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] hover:text-[#9A3412] min-h-[36px] px-2"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Xóa lịch sử hỏi</span>
              </button>
            )}
          </div>

          <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[600px]">
            {messages.length === 0 ? (
              <div className="py-12 text-center max-w-lg mx-auto space-y-3">
                <p className="font-serif text-xl font-semibold text-[#1C1917]">
                  Nhập câu hỏi tra cứu bảo vật quốc gia
                </p>
                <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
                  Bạn có thể hỏi theo đợt công nhận (từ Đợt 1 đến Đợt 14 tháng 02/2026), theo bảo tàng
                  hoặc tỉnh/thành phố lưu giữ, chất liệu, hay đối chiếu số quyết định công nhận.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const citedItems =
                  msg.role === 'assistant' ? resolveCitedTreasures(msg.citedCodes) : [];
                return (
                  <div
                    key={msg.id}
                    className={`space-y-3 ${
                      msg.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[92%] sm:max-w-[85%] px-4 py-3.5 rounded-md text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-[#1C1917] text-white'
                          : msg.error
                          ? 'bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]'
                          : 'bg-[#FBF9F5] border border-[#E4DDD0] text-[#1C1917]'
                      }`}
                    >
                      <p className="text-xs font-medium mb-1 opacity-75">
                        {msg.role === 'user' ? 'Câu hỏi của bạn' : 'Trợ lý AI Gemini (BaoVatQuocGiaPedia)'}
                      </p>
                      <div>{msg.text}</div>
                    </div>

                    {citedItems.length > 0 && (
                      <div className="w-full max-w-[92%] sm:max-w-[85%] space-y-2">
                        <p className="text-xs font-medium text-[#57534E]">
                          Hồ sơ được trích dẫn trong câu trả lời:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {citedItems.map((item) => (
                            <button
                              key={item.ma_bao_vat}
                              type="button"
                              onClick={() => onOpenDetail(item)}
                              className="text-left p-3 bg-[#F3EFE7] hover:bg-[#EAE3D5] border border-[#D6CEBE] rounded-md transition-colors flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="font-mono text-xs font-medium text-[#9A3412]">
                                  {item.ma_bao_vat}
                                </p>
                                <p className="text-sm font-semibold text-[#1C1917] truncate">
                                  {item.ten_bao_vat}
                                </p>
                                <p className="text-xs text-[#57534E] truncate">
                                  {item.noi_luu_giu.ten_co_quan}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-[#9A3412] shrink-0" aria-hidden="true" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="bg-[#FBF9F5] border border-[#E4DDD0] px-4 py-3.5 rounded-md text-sm text-[#57534E] max-w-[85%]">
                Đang đối chiếu kho dữ liệu baovat_data.json và tổng hợp trích dẫn chính thức...
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleFormSubmit}
            className="p-4 border-t border-[#E4DDD0] bg-[#FAF7F0] flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              placeholder="Ví dụ: Những bảo vật nào làm bằng vàng hoặc gỗ sơn son thếp vàng?"
              aria-label="Câu hỏi dành cho Trợ lý AI Gemini"
              className="flex-1 min-h-[46px] px-4 py-2.5 bg-white border border-[#D6CEBE] rounded-md text-sm sm:text-base text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#9A3412]"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="min-h-[46px] px-5 py-2.5 bg-[#9A3412] text-white text-sm sm:text-base font-medium rounded-md hover:bg-[#7C2D12] disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Gửi câu hỏi</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
