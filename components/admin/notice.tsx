import { CheckCircle2, AlertTriangle } from "lucide-react";

const okMessages: Record<string, string> = {
  saved: "Đã lưu thay đổi.",
  deleted: "Đã xoá mục đã chọn.",
  updated: "Đã cập nhật trạng thái.",
};

const errorMessages: Record<string, string> = {
  "missing-name": "Vui lòng nhập tên dự án.",
  "missing-title": "Vui lòng nhập tiêu đề.",
  unauthorized: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
};

export function AdminNotice({
  ok,
  error,
}: {
  ok?: string | string[];
  error?: string | string[];
}) {
  const okKey = Array.isArray(ok) ? ok[0] : ok;
  const errorKey = Array.isArray(error) ? error[0] : error;
  const okText = okKey ? (okMessages[okKey] ?? "Đã thực hiện.") : null;
  const errorText = errorKey
    ? (errorMessages[errorKey] ?? "Không thể thực hiện. Vui lòng thử lại.")
    : null;

  if (!okText && !errorText) return null;

  return (
    <div className="mb-5 space-y-2">
      {okText ? (
        <p className="flex items-center gap-2 border border-green/25 bg-green/[0.05] px-3.5 py-2.5 text-[0.78rem] text-green">
          <CheckCircle2 className="size-4 shrink-0" strokeWidth={1.8} />
          {okText}
        </p>
      ) : null}
      {errorText ? (
        <p className="flex items-center gap-2 border border-accent/25 bg-accent/[0.04] px-3.5 py-2.5 text-[0.78rem] text-accent">
          <AlertTriangle className="size-4 shrink-0" strokeWidth={1.8} />
          {errorText}
        </p>
      ) : null}
    </div>
  );
}
