import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialFormState = {
  gender: "",
  age: "",
  hypertension: "",
  heart_disease: "",
  ever_married: "",
  work_type: "",
  residence_type: "",
  avg_glucose_level: "",
  bmi: "",
  smoking_status: "",
};

const fields = [
  {
    name: "gender",
    type: "select",
    placeholder: "Giới tính",
    options: [
      { value: "Male", label: "Nam" },
      { value: "Female", label: "Nữ" },
    ],
  },
  { name: "age", type: "text", placeholder: "Tuổi (năm) (vd: 45)" },
  {
    name: "hypertension",
    type: "select",
    placeholder: "Tăng huyết áp?",
    options: [
      { value: "1", label: "Có" },
      { value: "0", label: "Không" },
    ],
  },
  {
    name: "heart_disease",
    type: "select",
    placeholder: "Bệnh tim?",
    options: [
      { value: "1", label: "Có" },
      { value: "0", label: "Không" },
    ],
  },
  {
    name: "ever_married",
    type: "select",
    placeholder: "Đã từng kết hôn?",
    options: [
      { value: "Yes", label: "Đã từng" },
      { value: "No", label: "Chưa từng" },
    ],
  },
  {
    name: "work_type",
    type: "select",
    placeholder: "Loại công việc",
    options: [
      { value: "Private", label: "Tư nhân" },
      { value: "Self-employed", label: "Tự kinh doanh" },
      { value: "Government job", label: "Nhà nước" },
      { value: "Children", label: "Trẻ em" },
      { value: "Never Worked", label: "Chưa từng đi làm" },
    ],
  },
  {
    name: "residence_type",
    type: "select",
    placeholder: "Loại nơi cư trú",
    options: [
      { value: "Urban", label: "Thành thị" },
      { value: "Rural", label: "Nông thôn" },
    ],
  },
  {
    name: "avg_glucose_level",
    type: "text",
    placeholder: "Mức Glucose trung bình (mg/dL) (vd: 100.5)",
  },
  { name: "bmi", type: "text", placeholder: "Chỉ số BMI (kg/m²) (vd: 23.1)" },
  {
    name: "smoking_status",
    type: "select",
    placeholder: "Tình trạng hút thuốc",
    options: [
      { value: "Never Smoked", label: "Chưa từng hút" },
      { value: "Formerly Smoked", label: "Đã từng hút" },
      { value: "Smokes", label: "Đang hút" },
      { value: "Unknown", label: "Không rõ" },
    ],
  },
];

const Stroke = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/diagnosis/stroke`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        return;
      }
      navigate("/diagnosis/stroke-predict", { state: { result: data } });
    } catch (err) {
      setMessage("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Dự đoán đột quỵ
        </h1>
        {message && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-md px-4 py-3 mb-4">
            {message}
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map((field) =>
              field.type === "select" ? (
                <select
                  key={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={field.name}
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              ),
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-2.5 rounded-md text-white font-medium text-sm transition-all
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

export default Stroke;
