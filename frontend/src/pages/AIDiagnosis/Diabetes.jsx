import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialFormState = {
  pregnancies: "",
  glucose: "",
  bloodpressure: "",
  skinthickness: "",
  insulin: "",
  bmi: "",
  dpf: "",
  age: "",
};

const fields = [
  { name: "pregnancies", placeholder: "Số lần mang thai (vd: 0)" },
  { name: "glucose", placeholder: "Glucose (mg/dL) (vd: 80)" },
  { name: "bloodpressure", placeholder: "Huyết áp (mmHg) (vd: 80)" },
  { name: "skinthickness", placeholder: "Độ dày da (mm) (vd: 20)" },
  { name: "insulin", placeholder: "Chỉ số Insulin (IU/mL) (vd: 80)" },
  { name: "bmi", placeholder: "Chỉ số BMI (kg/m²) (vd: 23.1)" },
  { name: "dpf", placeholder: "Hàm số di truyền tiểu đường (vd: 0.52)" },
  { name: "age", placeholder: "Tuổi (năm) (vd: 34)" },
];

const Diabetes = () => {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/diagnosis/diabetes`,
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
      navigate("/diagnosis/diabetes-predict", { state: { result: data } });
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
          Dự đoán tiểu đường
        </h1>
        {message && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-md px-4 py-3 mb-4">
            {message}
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map((field) => (
              <input
                key={field.name}
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            ))}
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

export default Diabetes;
