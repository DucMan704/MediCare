import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const StrokePredict = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;
  const pred = result?.pred;

  if (pred === undefined) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-xl">
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 text-sm rounded-md px-4 py-3 mb-4 text-center">
            Không tìm thấy dữ liệu dự đoán. Vui lòng gửi biểu mẫu lại.
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/diagnosis/stroke")}
              className="px-6 py-2.5 rounded-md bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-all"
            >
              Quay lại dự đoán đột quỵ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasStroke = pred === 1;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <div
          className={`rounded-xl border px-6 py-8 text-center text-base font-medium mb-6 ${
            hasStroke
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-green-50 border-green-300 text-green-700"
          }`}
        >
          {hasStroke
            ? "Bạn có nguy cơ đột quỵ. Vui lòng tham khảo ý kiến bác sĩ."
            : "Bạn không có dấu hiệu đột quỵ theo kết quả dự đoán."}
        </div>

        <div className="flex justify-center">
          <Link
            to="/"
            className="px-6 py-2.5 rounded-md bg-primary text-white font-medium text-sm text-center hover:bg-primary/90 transition-all"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StrokePredict;
