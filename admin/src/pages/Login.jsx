import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const location = useLocation()

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  useEffect(() => {
    const role = new URLSearchParams(location.search).get('role')
    setState(role === 'doctor' ? 'Doctor' : 'Admin')
  }, [location.search])

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Admin') {

        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
          toast.success('Đăng nhập thành công')
          navigate('/admin-dashboard')
        } else {
          toast.error(data.message)
        }

      } else {

        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
          toast.success('Đăng nhập thành công')
          navigate('/doctor-dashboard')
        } else {
          toast.error(data.message)
        }

      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message || 'Đăng nhập thất bại')
    }

  }

  const roleLabel = state === 'Admin' ? 'Quản trị viên' : 'Bác sĩ'

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>Đăng nhập <span className='text-primary'>{roleLabel}</span></p>
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Mật khẩu</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Đăng nhập</button>
        {
          state === 'Admin'
            ? <p>Đăng nhập Bác sĩ? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Nhấn vào đây</span></p>
            : <p>Đăng nhập Quản trị viên? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Nhấn vào đây</span></p>
        }
      </div>
    </form>
  )
}

export default Login
