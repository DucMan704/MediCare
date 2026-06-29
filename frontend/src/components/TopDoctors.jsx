import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { translateSpeciality } from "../utils/i18n";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10">
      <h1 className="text-3xl font-medium">Bác sĩ hàng đầu</h1>

      <p className="sm:w-1/3 text-center text-sm text-gray-600">
        Duyệt qua danh sách bác sĩ đáng tin cậy của chúng tôi.
      </p>

      <div className="w-full grid grid-cols-auto gap-6 pt-5 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item) => (
          <div
            key={item._id}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="group flex flex-col overflow-hidden rounded-xl border border-[#C9D8FF] bg-white cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            {/* Ảnh bác sĩ */}
            <div className="w-full h-64 overflow-hidden bg-[#EAEFFF]">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Nội dung */}
            <div className="flex-1 p-4">
              <div
                className={`flex items-center gap-2 text-sm mb-2 ${
                  item.available ? "text-green-500" : "text-gray-500"
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.available ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></span>

                <span>{item.available ? "Còn trống" : "Không có lịch"}</span>
              </div>

              <h3 className="text-lg font-semibold text-[#262626]">
                {item.name}
              </h3>

              <p className="text-sm text-[#5C5C5C] mt-1">
                {translateSpeciality(item.speciality)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="mt-10 rounded-full bg-[#EAEFFF] px-12 py-3 text-gray-600 transition hover:bg-[#dbe6ff]"
      >
        Xem thêm
      </button>
    </div>
  );
};

export default TopDoctors;
