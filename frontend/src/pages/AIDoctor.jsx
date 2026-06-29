import React, { useState } from "react";
import axios from "axios";
import {
  Stethoscope,
  Send,
  Bot,
  User,
  Loader2,
  ClipboardList,
  CheckCircle2,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
} from "lucide-react";

const apiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_PROD_URL
  : import.meta.env.VITE_API_URL;

const AIDoctor = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [diagnosis, setDiagnosis] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    const newChats = [...chats, userMessage];

    setChats(newChats);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${apiUrl}messages`,
        {
          chats: newChats,
          system: "first",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const botResponse = response.data.response;

      setChats((prev) => [
        ...prev,
        {
          role: "assistant",
          content: botResponse.content,
        },
      ]);

      if (response.data.diagnosis) {
        setDiagnosis(response.data.diagnosis);
      }
    } catch (error) {
      console.log("AI error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-[700px] flex justify-center items-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Bác sĩ AI</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Đang hoạt động
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-blue-600"
              title="Gọi thoại"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-blue-600"
              title="Gọi video"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
              title="Tùy chọn khác"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat body */}
        <div className="h-[450px] overflow-y-auto space-y-4 px-2">
          {chats.length === 0 && !isTyping && (
            <p className="text-center text-gray-400 text-sm mt-2">
              Xin chào, hãy mô tả triệu chứng của bạn
            </p>
          )}

          {chats.map((chat, index) => (
            <div
              key={index}
              className={
                chat.role === "user"
                  ? "flex justify-end items-end gap-2"
                  : "flex justify-start items-end gap-2"
              }
            >
              {chat.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}

              <div
                className={
                  chat.role === "user"
                    ? "bg-blue-600 text-white rounded-xl px-4 py-3 max-w-[70%]"
                    : "bg-gray-100 rounded-xl px-4 py-3 max-w-[70%]"
                }
              >
                {chat.role === "assistant"
                  ? JSON.parse(chat.content).message
                  : chat.content}
              </div>

              {chat.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 rounded-xl px-4 py-3 w-fit flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                AI đang suy nghĩ...
              </div>
            </div>
          )}
        </div>

        {/* Diagnosis */}
        {diagnosis.length > 0 && (
          <div className="mt-5 bg-green-50 rounded-xl p-4">
            <h2 className="font-bold text-lg flex items-center gap-2 text-green-700">
              <ClipboardList className="w-5 h-5" />
              Kết quả tham khảo
            </h2>

            {diagnosis.map((item, index) => (
              <div key={index} className="mt-3 flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                <div>
                  <p>
                    <b>
                      {index + 1}. {item.disease_name}
                    </b>
                  </p>
                  <p>{item.course_of_action}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input bar */}
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 mt-5 bg-gray-100 rounded-full px-3 py-2"
        >
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 shrink-0"
            title="Đính kèm tệp/ảnh"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 shrink-0"
            title="Cảm xúc"
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập triệu chứng..."
            className="flex-1 bg-transparent outline-none px-1 py-2 text-sm"
          />

          {message.trim() ? (
            <button
              type="submit"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 shrink-0"
              title="Gửi"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 shrink-0"
              title="Ghi âm"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AIDoctor;
