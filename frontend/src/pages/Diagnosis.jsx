import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const Diagnosis = () => {
  const navItems = [
    { name: "TIỂU ĐƯỜNG", path: "/diagnosis/diabetes" },
    { name: "SỐT RÉT", path: "/diagnosis/malaria" },
    { name: "VIÊM PHỔI", path: "/diagnosis/pneumonia" },
    { name: "ĐỘT QUỴ", path: "/diagnosis/stroke" },
    { name: "DA LIỄU", path: "/diagnosis/skin" },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="sticky top-0 h-screen w-64 flex-shrink-0 bg-white border-r shadow-sm overflow-y-auto">
        <div className="px-5 py-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 px-3">
            Chẩn đoán
          </h2>
          <ul className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 rounded-md cursor-pointer transition-all hover:text-primary hover:bg-gray-50 border-l-4 ${
                      isActive
                        ? "text-primary bg-primary/10 border-primary font-semibold"
                        : "border-transparent"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 w-full px-5 py-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Diagnosis;
