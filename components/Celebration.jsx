"use client";
import dynamic from 'next/dynamic';
import heartAnimation from "../public/assets/heart-animation.json";

// Import Lottie with SSR disabled since it relies on window
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const Celebration = ({ message, config }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-pink-100 to-rose-200 text-center overflow-auto">
      <h1 className="text-5xl sm:text-6xl font-love text-rose-700 mb-6">
        {message || "She said YES! 💍"}
      </h1>
      <p className="text-lg text-gray-700 font-light mb-6">
        You & Me – the beginning of forever 💖
      </p>

      <Lottie
        animationData={heartAnimation}
        loop={true}
        autoplay={true}
        className="w-72 h-72"
      />
    </div>
  );
};

export default Celebration;
