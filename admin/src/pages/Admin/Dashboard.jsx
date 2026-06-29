import React, { useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="w-full h-full flex flex-col m-5">
        <div className="flex flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 flex-1 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-400">Bác sĩ</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 flex-1 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Lịch hẹn</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 flex-1 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Bệnh nhân</p>
            </div>
          </div>
        </div>

        <div className="bg-white flex-1 flex flex-col mt-10 min-h-0">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border shrink-0">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Lịch hẹn mới nhất</p>
          </div>

          <div className="pt-4 border border-t-0 flex-1 overflow-y-auto">
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item.docData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-600 ">
                    Đặt lịch ngày {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Đã hủy</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Hoàn thành
                  </p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
