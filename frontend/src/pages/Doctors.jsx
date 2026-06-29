import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { specialityList, translateSpeciality } from "../utils/i18n";

const Doctors = () => {
  const { speciality } = useParams();

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">
        Duyệt qua danh sách bác sĩ theo chuyên khoa.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Button hiển thị bộ lọc trên mobile */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-2 px-5 min-w-[120px] border rounded-lg text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
        >
          Bộ lọc
        </button>

        {/* Danh sách chuyên khoa */}
        <div
          className={`flex-col gap-3 text-sm text-gray-700 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {specialityList.map((spec) => (
            <button
              key={spec}
              onClick={() =>
                speciality === spec
                  ? navigate("/doctors")
                  : navigate(`/doctors/${spec}`)
              }
              className={`w-full sm:w-60 px-5 py-3 text-left border border-gray-300 rounded-lg transition-all duration-300 hover:bg-[#EEF2FF] ${
                speciality === spec
                  ? "bg-[#E2E5FF] border-primary text-primary font-medium"
                  : "bg-white"
              }`}
            >
              {translateSpeciality(spec)}
            </button>
          ))}
        </div>

        {/* Danh sách bác sĩ */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
            >
              <img
                className="bg-[#EAEFFF] w-full"
                src={item.image}
                alt={item.name}
              />

              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm ${
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

                <h3 className="mt-2 text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {translateSpeciality(item.speciality)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
