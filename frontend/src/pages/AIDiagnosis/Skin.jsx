import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import { FiUploadCloud } from "react-icons/fi";

const MODEL_URL = "/models/skin/model.json";

const TARGET_CLASSES = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"];

const Skin = () => {
  const navigate = useNavigate();

  const modelRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const [imageSrc, setImageSrc] = useState("/images/nope.png");
  const [modelLoading, setModelLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Load model
  useEffect(() => {
    let mounted = true;

    const loadModel = async () => {
      try {
        await tf.ready();

        const model = await tf.loadLayersModel(MODEL_URL);

        if (!mounted) return;

        modelRef.current = model;
        console.log("Skin model loaded.");
      } catch (err) {
        console.error(err);
        if (mounted) {
          setMessage("Không thể tải model AI.");
        }
      } finally {
        if (mounted) {
          setModelLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      mounted = false;
    };
  }, []);

  // Xử lý chung khi file được chọn hoặc kéo thả vào
  const processFile = (file) => {
    if (!file) return;

    // Kiểm tra định dạng (chỉ cho phép ảnh)
    if (!file.type.startsWith("image/")) {
      setMessage("Vui lòng chọn định dạng ảnh (PNG, JPG, JPEG).");
      return;
    }

    setMessage("");

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Chọn ảnh qua input duyệt file
  const handleImageChange = (e) => {
    processFile(e.target.files?.[0]);
  };

  // Các sự kiện kéo thả (Drag & Drop)
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  // Dự đoán
  const predict = async () => {
    const image = imageRef.current;

    if (!image) {
      throw new Error("Image not found");
    }

    // Đảm bảo ảnh load xong
    if (!image.complete) {
      await new Promise((resolve) => {
        image.onload = resolve;
      });
    }

    const prediction = tf.tidy(() => {
      const offset = tf.scalar(127.5);

      const tensor = tf.browser
        .fromPixels(image)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .sub(offset)
        .div(offset)
        .expandDims();

      return modelRef.current.predict(tensor);
    });

    const values = await prediction.data();

    prediction.dispose();

    const results = Array.from(values)
      .map((value, index) => ({
        className: TARGET_CLASSES[index],
        probability: value,
      }))
      .sort((a, b) => b.probability - a.probability);

    return results;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!modelRef.current) {
      setMessage("Model chưa sẵn sàng.");
      return;
    }

    if (imageSrc === "/images/nope.png") {
      setMessage("Vui lòng chọn ảnh.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const predictions = await predict();

      navigate("/diagnosis/skin-predict", {
        state: {
          result: {
            image: imageSrc,
            predictions,
            topPrediction: predictions[0],
          },
        },
      });
    } catch (err) {
      console.error(err);
      setMessage("Không thể phân tích ảnh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Dự đoán bệnh da</h1>

        {modelLoading && (
          <div className="mb-4 rounded-md bg-blue-50 border border-blue-300 text-blue-700 p-3 text-center">
            Đang tải AI Model...
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-300 text-red-700 p-3">
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow border p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Vùng kéo thả file */}
            <div className="w-full">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative w-full h-64 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {imageSrc === "/images/nope.png" ? (
                  <div className="flex flex-col items-center text-center p-6">
                    <FiUploadCloud size={50} className="text-blue-500 mb-3" />
                    <p className="text-base font-semibold text-gray-700">
                      Kéo thả ảnh vào đây
                    </p>
                    <p className="text-sm text-gray-400 mt-1 mb-4">hoặc</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 focus:outline-none transition-colors"
                    >
                      Duyệt tìm file
                    </button>
                    <p className="text-xs text-gray-400 mt-4">
                      Hỗ trợ: PNG, JPG, JPEG
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-full group">
                    <img
                      ref={imageRef}
                      src={imageSrc}
                      alt="preview"
                      crossOrigin="anonymous"
                      className="w-full h-full object-contain bg-black/5"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white rounded-md font-medium text-sm text-gray-800 hover:bg-gray-100 shadow-lg"
                      >
                        Đổi ảnh khác
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                disabled={modelLoading}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Nút Submit (đã đổi sang bg-blue-600) */}
            <button
              type="submit"
              disabled={modelLoading || loading}
              className="w-full px-6 py-2.5 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang phân tích..." : "Dự đoán"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Skin;
