"use client";
const Landing = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 animate-fadeIn">
      <h1 className="text-4xl sm:text-6xl font-bold text-rose-600 animate-pulse font-love">
        Something special is going to happen... 💌
      </h1>
      <button
        onClick={onNext}
        className="mt-18 w-18 h-16 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold shadow-lg transition-transform transform hover:scale-110 heart-shape relative"
      >
        {/* Optional Emoji or Icon */}
        <span className="absolute top-[-5%] left-[-10%] rotate-45 text-9xl z-50">💖</span>
      </button>
    </div>
  );
};

export default Landing;
