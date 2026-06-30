import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const Diagnosis = () => {
  const navItems = [
    {
      name: "TIỂU ĐƯỜNG",
      shortName: "Tiểu đường",
      path: "/diagnosis/diabetes",
    },
    { name: "SỐT RÉT", shortName: "Sốt rét", path: "/diagnosis/malaria" },
    { name: "VIÊM PHỔI", shortName: "Viêm phổi", path: "/diagnosis/pneumonia" },
    { name: "ĐỘT QUỴ", shortName: "Đột quỵ", path: "/diagnosis/stroke" },
    { name: "DA LIỄU", shortName: "Da liễu", path: "/diagnosis/skin" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar: thanh ngang gọn trên mobile, sidebar dọc từ md trở lên */}
      <aside
        className="
          w-full md:w-64 md:flex-shrink-0
          bg-white border-b md:border-b-0 md:border-r shadow-sm
          sticky top-0 z-20
          md:h-screen md:overflow-y-auto
        "
      >
        <div className="px-2 py-2 md:px-5 md:py-6">
          <h2 className="hidden md:block text-lg font-bold text-gray-800 mb-6 px-3">
            Chẩn đoán
          </h2>

          <ul
            className="
              flex md:flex-col gap-1
              overflow-x-auto md:overflow-x-visible
              text-xs md:text-sm font-medium text-gray-700
              [-ms-overflow-style:none] [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {navItems.map((item) => (
              <li key={item.path} className="flex-shrink-0 md:flex-shrink">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block whitespace-nowrap text-center md:text-left px-2.5 py-1.5 md:px-3 md:py-2 rounded-md cursor-pointer transition-all hover:text-primary hover:bg-gray-50 border-b-4 md:border-b-0 md:border-l-4 ${
                      isActive
                        ? "text-primary bg-primary/10 border-primary font-semibold"
                        : "border-transparent"
                    }`
                  }
                >
                  <span className="md:hidden">{item.shortName}</span>
                  <span className="hidden md:inline">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 w-full px-4 py-6 md:px-5 md:py-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Diagnosis;
