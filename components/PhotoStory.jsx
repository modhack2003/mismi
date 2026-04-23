"use client"
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const TypedLine = ({ line, onComplete }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed(""); // reset
    let index = 0;
    const type = () => {
      if (index <= line.length) {
        setDisplayed(line.slice(0, index));
        index++;
        setTimeout(type, 50);
      } else {
        if (onComplete) onComplete();
      }
    };
    const initialDelay = setTimeout(type, 50);
    return () => clearTimeout(initialDelay);
  }, [line, onComplete]);

  return (
    <p className="text-3xl sm:text-4xl text-rose-600 text-center font-bold italic leading-relaxed whitespace-pre-wrap font-serif drop-shadow-sm">
      {displayed}
    </p>
  );
};

const PhotoStory = ({ config, onNext }) => {
  // Use config directly from props
  const shuffledPhotos = useMemo(() => {
    if (!config || !config.photoStory) return [];
    // We filter out entirely empty slides
    return shuffle(config.photoStory.filter(p => p.src || p.fallbackText));
  }, [config]);

  const [index, setIndex] = useState(0);
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const audioRef = useRef(null);

  const currentPhoto = shuffledPhotos[index];

  useEffect(() => {
    toast("This will be too long, you can skip but I love if you watch 💖", {
      position: "top-center",
      autoClose: 9000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  }, []);

  // Update lyrics lines directly from Admin-verified fallbackText
  useEffect(() => {
    if (currentPhoto) {
      setLines((currentPhoto.fallbackText || "Instrumental vibes 🎵").split('\n').filter(l => l.trim().length > 0));
      setCurrentLine(0);
    }
  }, [currentPhoto]);

  const handleLineComplete = useCallback(() => {
    const delaySpeedMultiplier = currentPhoto?.lyricsSpeed || 1; // 1x default
    const waitTime = 1500 / delaySpeedMultiplier; // Standard 1.5s scaled by speed
    
    setTimeout(() => {
      setCurrentLine((prev) => prev + 1);
    }, waitTime);
  }, [currentPhoto]);

  // Audio Cropping Logic
  useEffect(() => {
    if (!currentPhoto) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (currentPhoto.audioUrl || currentPhoto.audio) {
      const audio = new Audio(currentPhoto.audioUrl || currentPhoto.audio);
      audioRef.current = audio;
      
      const crop = currentPhoto.crop || { start: 0, end: 0 };
      audio.currentTime = crop.start || 0;
      
      audio.play().catch(e => console.warn("Audio play blocked by browser. User interaction needed.", e));

      const checkTime = () => {
        // Stop audio if it passes the crop boundary
        if ((crop.end && audio.currentTime >= crop.end) || audio.currentTime >= audio.duration) {
          audio.pause();
          audio.removeEventListener("timeupdate", checkTime);
          if (index < shuffledPhotos.length - 1) {
            setIndex(index + 1);
          } else {
            onNext();
          }
        }
      };

      audio.addEventListener("timeupdate", checkTime);
      audio.addEventListener("ended", checkTime);

      return () => {
        audio.pause();
        audio.removeEventListener("timeupdate", checkTime);
        audio.removeEventListener("ended", checkTime);
      };
    } else {
      // If no audio, wait a few seconds and then go to next
      const to = setTimeout(() => {
         if (index < shuffledPhotos.length - 1) setIndex(index + 1);
         else onNext();
      }, 5000);
      return () => clearTimeout(to);
    }
  }, [index, currentPhoto, onNext, shuffledPhotos.length]);

  if (!currentPhoto) return <div className="h-screen flex items-center justify-center">No photos configured!</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 px-4 py-10 transition-opacity duration-700 animate-fadeIn relative z-10 block">
      <ToastContainer className="pt-16" />

      <button
        onClick={onNext}
        className="absolute top-4 right-4 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-300 z-50 cursor-pointer"
      >
        Skip
      </button>

      <div className="absolute top-6 left-6 bg-white bg-opacity-70 text-rose-700 text-sm sm:text-base font-bold px-3 py-1 rounded-full shadow-md z-10">
        {index + 1} / {shuffledPhotos.length}
      </div>

      {currentPhoto.src && (
        <div className="w-full max-w-[85vw] md:max-w-md h-[45vh] sm:h-[55vh] flex justify-center items-center drop-shadow-xl z-20">
          <img
            src={currentPhoto.src}
            alt={`Photo ${index + 1}`}
            className="max-w-full max-h-full object-contain rounded-2xl border-4 border-rose-100 shadow-2xl bg-white/50 backdrop-blur-sm p-1"
            crossOrigin="anonymous"
          />
        </div>
      )}

      <div className="bg-white/90 backdrop-blur border-2 border-rose-100 rounded-3xl px-6 py-8 w-full max-w-2xl shadow-xl relative overflow-hidden transition-all duration-500 min-h-[160px] flex items-center justify-center z-20">
        <div className="flex w-full items-center justify-center text-center">
          {lines[currentLine] && (
            <TypedLine key={currentLine} line={lines[currentLine]} onComplete={handleLineComplete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoStory;
