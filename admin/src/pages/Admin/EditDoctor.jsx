import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import { specialityList, translateSpeciality } from "../../utils/i18n";

const EditDoctor = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { aToken, getDoctorById, updateDoctor } = useContext(AdminContext);

  const [docImg, setDocImg] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!aToken) return;
      const doc = await getDoctorById(doctorId);
      if (doc) {
        setName(doc.name || "");
        setEmail(doc.email || "");
        setExperience(doc.experience || "1 Year");
        setFees(doc.fees || "");
        setAbout(doc.about || "");
        setSpeciality(doc.speciality || "General physician");
        setDegree(doc.degree || "");
        setCurrentImage(doc.image || "");
        try {
          const parsedAddress =
            typeof doc.address === "string"
              ? JSON.parse(doc.address)
              : doc.address;
          setAddress1(parsedAddress?.line1 || "");
          setAddress2(parsedAddress?.line2 || "");
        } catch {
          setAddress1("");
          setAddress2("");
        }
      } else {
        toast.error("Không tìm thấy thông tin bác sĩ");
        navigate("/doctor-list");
      }
      setLoading(false);
    };

    fetchDoctor();
  }, [aToken, doctorId]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    if (docImg) formData.append("image", docImg);
    formData.append("name", name);
    formData.append("experience", experience);
    formData.append("fees", Number(fees));
    formData.append("about", about);
    formData.append("speciality", speciality);
    formData.append("degree", degree);
    formData.append(
      "address",
      JSON.stringify({ line1: address1, line2: address2 }),
    );

    const success = await updateDoctor(formData);
    if (success) {
      navigate("/doctor-list");
    }
  };

  if (loading) {
    return <p className="m-5">Đang tải dữ liệu...</p>;
  }

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-4 text-xl font-medium">Chỉnh sửa bác sĩ</p>

      <div className="bg-white px-10 py-10 border rounded-lg w-full max-w-5xl shadow-sm">
        <div className="flex items-center gap-6 mb-10 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-24 h-24 bg-gray-100 rounded-full cursor-pointer object-cover border"
              src={
                docImg
                  ? URL.createObjectURL(docImg)
                  : currentImage || "https://via.placeholder.com/100"
              }
              alt="doctor"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-base">
            Tải lên ảnh <br /> bác sĩ
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-16 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <p className="font-medium">Họ và tên</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-4 py-3"
                type="text"
                placeholder="Họ và tên"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <p className="font-medium">Email bác sĩ</p>
              <input
                value={email}
                className="border rounded px-4 py-3 bg-gray-100 cursor-not-allowed"
                type="email"
                disabled
                title="Không thể thay đổi email"
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <p className="font-medium">Kinh nghiệm</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-4 py-3"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} năm
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <p className="font-medium">Phí khám</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-4 py-3"
                type="number"
                placeholder="Phí khám"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <p className="font-medium">Chuyên khoa</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-4 py-3"
              >
                {specialityList.map((spec) => (
                  <option key={spec} value={spec}>
                    {translateSpeciality(spec)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <p className="font-medium">Bằng cấp</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-4 py-3"
                type="text"
                placeholder="Bằng cấp"
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <p className="font-medium">Địa chỉ</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-4 py-3"
                type="text"
                placeholder="Địa chỉ dòng 1"
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-4 py-3 mt-3"
                type="text"
                placeholder="Địa chỉ dòng 2"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 font-medium text-lg">Giới thiệu bác sĩ</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full border rounded px-4 py-3"
            placeholder="Viết giới thiệu về bác sĩ"
            rows={10}
          />
        </div>

        <div className="flex gap-4 mt-10">
          <button
            type="submit"
            className="bg-primary px-12 py-3 text-white rounded-full text-base"
          >
            Lưu thay đổi
          </button>
          <button
            type="button"
            onClick={() => navigate("/doctor-list")}
            className="border border-gray-400 px-12 py-3 rounded-full text-base"
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditDoctor;
