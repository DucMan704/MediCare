import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CLASS_LABELS = {
  akiec: "Dày sừng quang hóa (Actinic Keratoses)",
  bcc: "Ung thư biểu mô tế bào đáy (Basal Cell Carcinoma)",
  bkl: "Tổn thương sừng hóa lành tính (Benign Keratosis)",
  df: "U xơ da (Dermatofibroma)",
  nv: "Nốt ruột sắc tố (Melanocytic Nevi)",
  vasc: "Tổn thương mạch máu (Vascular Lesion)",
};

const SkinPredict = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;
  const predictions = result?.predictions;
  const image = result?.image;

  if (!predictions || predictions.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-xl">
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 text-sm rounded-md px-4 py-3 mb-4 text-center">
            Không tìm thấy dữ liệu dự đoán. Vui lòng gửi biểu mẫu lại.
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/diagnosis/skin")}
              className="px-6 py-2.5 rounded-md bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-all"
            >
              Quay lại dự đoán da liễu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const topResult = predictions[0];

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        {image && (
          <div className="flex justify-center mb-6">
            <img
              src={image}
              alt="Ảnh đã phân tích"
              className="w-56 h-56 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 mb-6">
          <p className="text-sm text-gray-500 mb-4 text-center">
            Khả năng cao nhất:{" "}
            <span className="font-semibold text-gray-800">
              {CLASS_LABELS[topResult.className] || topResult.className}
            </span>
          </p>

          <ul className="space-y-2">
            {predictions.map((p, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center text-sm border-b border-gray-100 py-2"
              >
                <span className="text-gray-700">
                  {CLASS_LABELS[p.className] || p.className}
                </span>
                <span className="font-medium text-gray-800">
                  {(p.probability * 100).toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 text-sm rounded-md px-4 py-3 mb-6 text-center">
          Đây chỉ là kết quả dự đoán sơ bộ từ AI, không phải chẩn đoán y khoa.
          Vui lòng tham khảo ý kiến bác sĩ chuyên khoa da liễu để được chẩn đoán
          chính xác.
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

export default SkinPredict;
