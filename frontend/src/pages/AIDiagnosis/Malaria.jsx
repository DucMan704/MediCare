import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Malaria = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!imageFile) {
      setMessage("Vui lòng tải lên hình ảnh tế bào.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        `${import.meta.env.VITE_AI_BACKEND_URL || "http://localhost:4001"}/api/diagnosis/malaria`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        return;
      }

      navigate("/diagnosis/malaria-predict", { state: { result: data } });
    } catch (err) {
      setMessage("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center" style={{ marginBottom: "300px" }}>
      <div className="w-full max-w-xl">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Dự đoán sốt rét
        </h1>

        {message && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-md px-4 py-3 mb-4">
            {message}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center">
            Vui lòng tải lên hình ảnh tế bào
          </h3>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 w-full"
          >
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20 cursor-pointer"
            />

            <img
              className="rounded-lg border border-gray-200 object-cover"
              src={previewUrl || "#"}
              alt="HÌNH ẢNH TẢI LÊN SẼ HIỂN THỊ TẠI ĐÂY"
              style={{
                width: previewUrl ? "300px" : "0px",
                height: previewUrl ? "300px" : "0px",
                display: previewUrl ? "block" : "none",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-md text-white font-medium text-sm transition-all
                ${
                  loading
                    ? "bg-primary/60 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 cursor-pointer"
                }`}
            >
              {loading ? "Đang phân tích..." : "Dự đoán"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Malaria;
