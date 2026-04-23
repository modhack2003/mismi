"use client"
import React, { useState, useEffect } from "react";
import Landing from "../components/landing";
import LoveLetter from "../components/Loveletter";
import Proposal from "../components/Proposal";
import Celebration from "../components/Celebration";
import FloatingHearts from "../components/FloatingHearts";
import PhotoStory from "../components/PhotoStory";

export default function App() {
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(true);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch(`/api/config?t=${new Date().getTime()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(e => console.error("Failed to load config", e));
  }, []);

  const handleStepChange = (nextStep) => {
    setFade(false);
    setTimeout(() => {
      setStep(nextStep);
      setFade(true);
    }, 1000);
  };

  const handleYes = () => {
    setCelebrationMessage(config?.celebration?.message || "Love you ❤️");
    handleStepChange(4);
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rose-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-rose-300 rounded-full mb-4"></div>
          <p className="text-xl text-rose-500 font-serif font-bold">Setting up our story...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-br from-purple-600 via-rose-200 to-pink-400 text-center font-serif transition-opacity duration-1000 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <FloatingHearts />
      {step === 0 && <Landing onNext={() => handleStepChange(1)} />}
      {step === 1 && <PhotoStory config={config} onNext={() => handleStepChange(2)} />}
      {step === 2 && <LoveLetter config={config} onNext={() => handleStepChange(3)} />}
      {step === 3 && <Proposal config={config} onYes={handleYes} />}
      {step === 4 && <Celebration message={celebrationMessage} config={config} />}
    </div>
  );
}
