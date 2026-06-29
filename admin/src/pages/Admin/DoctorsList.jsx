import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { FaTrashAlt } from "react-icons/fa";
import { translateSpeciality } from "../../utils/i18n";

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors, deleteDoctor } =
    useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const handleDelete = (e, doctorId, doctorName) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa ${doctorName}?`,
    );

    if (confirmDelete) {
      deleteDoctor(doctorId);
    }
  };

  const handleCardClick = (doctorId) => {
    navigate(`/edit-doctor/${doctorId}`);
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">Tất cả bác sĩ</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item) => (
          <div
            key={item._id}
            onClick={() => handleCardClick(item._id)}
            className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-300"
          >
            <img
              className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500"
              src={item.image}
              alt={item.name}
            />

            <div className="p-4">
              <p className="text-[#262626] text-lg font-medium">{item.name}</p>

              <p className="text-[#5C5C5C] text-sm">{translateSpeciality(item.speciality)}</p>

              <div className="mt-3 flex items-center justify-between">
                <div
                  className="flex items-center gap-2 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                  />
                  <p>Còn trống</p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, item._id, item.name)}
                  className="p-2 rounded-md text-red-500 hover:bg-red-100 hover:text-red-600 transition duration-200"
                  title="Xóa bác sĩ"
                >
                  <FaTrashAlt size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
