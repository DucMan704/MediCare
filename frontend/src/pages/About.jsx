import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
            <p>GIỚI THIỆU <span className='text-gray-700 font-medium'>VỀ CHÚNG TÔI</span></p>
        </div>
        <div className='my-10 flex flex-col md:flex-row gap-12'>
            <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
            <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
                <p>Chào mừng bạn đến với MediCare — đối tác đáng tin cậy trong việc quản lý nhu cầu chăm sóc sức khỏe một cách thuận tiện và hiệu quả.
                    Tại MediCare, chúng tôi hiểu những thách thức mà mỗi người gặp phải khi đặt lịch khám bác sĩ và quản lý hồ sơ sức khỏe cá nhân.
                </p>
                <p>MediCare cam kết xuất sắc trong công nghệ y tế.
                    Chúng tôi không ngừng cải tiến nền tảng, tích hợp những tiến bộ mới nhất để nâng cao trải nghiệm người dùng và cung cấp dịch vụ chất lượng cao.
                    Dù bạn đặt lịch khám lần đầu hay quản lý quá trình điều trị dài hạn, MediCare luôn đồng hành cùng bạn.
                </p>
                <b className='text-gray-800'>Tầm nhìn</b>
                <p>Tầm nhìn của MediCare là tạo ra trải nghiệm chăm sóc sức khỏe liền mạch cho mọi người.
                    Chúng tôi hướng tới việc thu hẹp khoảng cách giữa bệnh nhân và cơ sở y tế, giúp bạn tiếp cận dịch vụ chăm sóc đúng lúc, đúng nhu cầu.
                </p>
            </div>
        </div>
        <div className='text-xl my-4'>
            <p>TẠI SAO <span className='text-gray-700 font-semibold'>CHỌN CHÚNG TÔI</span></p>
        </div>
        <div className='flex flex-col md:flex-row mb-20'>
            <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                <b>HIỆU QUẢ:</b>
                <p>Quy trình đặt lịch khám tối ưu, phù hợp với lịch trình bận rộn của bạn.</p>
            </div>
            <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                <b>TIỆN LỢI:</b>
                <p>Tiếp cận mạng lưới bác sĩ và chuyên gia y tế uy tín trong khu vực.</p>
            </div>
            <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                <b>CÁ NHÂN HÓA:</b>
                <p>Gợi ý và nhắc nhở phù hợp giúp bạn chủ động theo dõi sức khỏe.</p>
            </div>
        </div>
    </div>
  )
}

export default About
