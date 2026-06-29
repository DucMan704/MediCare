import React from "react";
import { useNavigate } from "react-router-dom";

const AIChatButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/ai-doctor")}
      className="
fixed
bottom-6
right-6
z-[999]

w-16
h-16

rounded-full

bg-blue-600
hover:bg-blue-700

text-white

shadow-xl

flex
items-center
justify-center

text-3xl

transition
hover:scale-110
"
    >
      💬
    </button>
  );
};

export default AIChatButton;
