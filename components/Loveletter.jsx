"use client";
import React from 'react';

const LoveLetter = ({ config, onNext }) => {
  const content = config?.loveLetter?.content || [
    "My dearest,",
    "I haven't written the letter yet, but I love you!"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-3 py-6 bg-rose-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md border border-rose-200">
        <h2 className="text-xl sm:text-2xl font-bold text-rose-700 mb-4 font-serif">Dear {config?.names?.partner || "Love"},</h2>

        <div className="text-gray-700 leading-snug text-sm sm:text-base space-y-4 font-serif">
          {content.map((paragraph, i) => (
             <p key={i}>{paragraph}</p>
          ))}
        </div>

        <p className="mt-6 text-right text-rose-500 text-sm font-semibold italic">
          With love,<br />{config?.names?.user || "Me"} 💖
        </p>
      </div>

      <button
        onClick={onNext}
        className="mt-8 px-6 py-2 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-600 transition shadow-lg"
      >
        Continue
      </button>
    </div>
  );
};

export default LoveLetter;
