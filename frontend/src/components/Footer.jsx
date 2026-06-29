import React from "react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm">
        <div>
          <img className="mb-5 w-40" src={logo} alt="Logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            MediCare là nền tảng quản lý y tế giúp bạn đặt lịch khám bác sĩ
            nhanh chóng, tiện lợi và an toàn. Chúng tôi kết nối bạn với đội ngũ
            bác sĩ uy tín, hỗ trợ chăm sóc sức khỏe toàn diện mọi lúc mọi nơi.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">CÔNG TY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Trang chủ</li>
            <li>Giới thiệu</li>
            <li>Dịch vụ</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">LIÊN HỆ</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+84-212-456-7890</li>
            <li>medicare@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Bản quyền 2024 @ MediCare.com - Mọi quyền được bảo lưu.
        </p>
      </div>
    </div>
  );
};

export default Footer;
