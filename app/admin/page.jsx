"use client";
import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Music, Save, Plus, Trash2, Link, Settings, Type } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPanel() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (!data.photoStory) data.photoStory = [];
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success('Configuration saved successfully! 🚀');
    } catch(e) {
      toast.error('Save failed: ' + e.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center text-xl font-bold flex items-center justify-center min-h-screen">Loading Editor...</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-8 font-sans">
      <ToastContainer />
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-pink-600">💖 Story Studio</h1>
            <p className="text-gray-500 text-sm">Manage the photos, songs, and lyrics in a social media style editor.</p>
          </div>
          <button 
            onClick={saveConfig} 
            disabled={saving}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-pink-200 transition-all active:scale-95"
          >
            <Save size={20} /> {saving ? "Saving..." : "Publish Changes"}
          </button>
        </div>

        {/* GENERAL SETTINGS */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">⚙️ General Names</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Your Name (The Proposer)</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                value={config.names?.user || ""}
                onChange={(e) => setConfig({...config, names: { ...config.names, user: e.target.value }})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Her Name (The Proposal Receiver)</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                value={config.names?.partner || ""}
                onChange={(e) => setConfig({...config, names: { ...config.names, partner: e.target.value }})}
              />
            </div>
          </div>
        </section>

        {/* LOVE LETTER */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">💌 The Love Letter</h2>
          <textarea 
            className="w-full h-40 p-5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none leading-relaxed transition-all resize-none"
            value={config.loveLetter?.content?.join('\n\n') || ""}
            onChange={(e) => setConfig({...config, loveLetter: { content: e.target.value.split('\n\n') } })}
            placeholder="Type your paragraphs here (double enter to separate)..."
          />
        </section>

        {/* PHOTO STORY */}
        <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-700">📸 Story Slides</h2>
            <button 
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all active:scale-95"
              onClick={() => setConfig({
                ...config, 
                photoStory: [...config.photoStory, { src: "", trackName: "", artist: "", audioUrl: "", crop: {start:0, end:30}, fallbackText: "" }]
              })}
            >
              <Plus size={18} /> Add New Slide
            </button>
          </div>

          <div className="space-y-12">
            {config.photoStory.map((slide, index) => (
              <SlideEditor 
                key={index} 
                slide={slide} 
                index={index} 
                updateSlide={(newSlide) => {
                  const updated = [...config.photoStory];
                  updated[index] = newSlide;
                  setConfig({...config, photoStory: updated});
                }}
                removeSlide={() => {
                  setConfig({...config, photoStory: config.photoStory.filter((_, i) => i !== index)});
                }}
              />
            ))}
            {config.photoStory.length === 0 && (
              <div className="text-center py-20 text-gray-400 bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl">
                No slides yet. Click "Add New Slide" to start your story!
              </div>
            )}
          </div>
        </section>

        {/* PROPOSAL SETTINGS */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">💍 Proposal Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Proposal Question</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                value={config.proposal?.question || ""}
                onChange={(e) => setConfig({...config, proposal: { ...config.proposal, question: e.target.value }})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Proposal Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                  value={config.proposal?.image || ""}
                  onChange={(e) => setConfig({...config, proposal: { ...config.proposal, image: e.target.value }})}
                />
                <label className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer px-4 py-3 rounded-xl font-semibold transition whitespace-nowrap">
                  <UploadCloud size={18} /> Upload
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    if(!e.target.files[0]) return;
                    const formData = new FormData();
                    formData.append('file', e.target.files[0]);
                    try {
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if(data.url) {
                        setConfig({...config, proposal: { ...config.proposal, image: data.url }});
                        toast.success("Image uploaded!");
                      } else throw new Error(data.error);
                    } catch(err) {
                      toast.error('Upload failed: ' + err.message);
                    }
                  }} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Yes Button Text</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                  value={config.proposal?.yesButton || ""}
                  onChange={(e) => setConfig({...config, proposal: { ...config.proposal, yesButton: e.target.value }})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">No Button Text</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                  value={config.proposal?.noButton || ""}
                  onChange={(e) => setConfig({...config, proposal: { ...config.proposal, noButton: e.target.value }})}
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold text-gray-700 mb-2 text-sm">Friendzone Message (After 7 'No's)</h3>
              <div className="space-y-4">
                <textarea 
                  className="w-full h-20 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                  value={config.proposal?.friendMessageTitle?.replace(/<br \/>/g, '\n') || ""}
                  onChange={(e) => setConfig({...config, proposal: { ...config.proposal, friendMessageTitle: e.target.value.replace(/\n/g, '<br />') }})}
                  placeholder="Title (e.g. If you need time...)"
                />
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                  value={config.proposal?.friendMessageBody || ""}
                  onChange={(e) => setConfig({...config, proposal: { ...config.proposal, friendMessageBody: e.target.value }})}
                  placeholder="Body (e.g. We can be best friends)"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold text-gray-700 mb-2 text-sm flex items-center gap-2">📧 EmailJS Settings <span className="text-xs font-normal text-gray-500">(For receiving their response)</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <input type="text" placeholder="Service ID" className="p-3 bg-gray-50 border rounded-xl text-sm outline-none focus:border-pink-400"
                  value={config.proposal?.emailjs?.serviceID || ""} onChange={(e) => setConfig({...config, proposal: { ...config.proposal, emailjs: { ...config.proposal?.emailjs, serviceID: e.target.value } }})} />
                <input type="text" placeholder="Template ID" className="p-3 bg-gray-50 border rounded-xl text-sm outline-none focus:border-pink-400"
                  value={config.proposal?.emailjs?.templateID || ""} onChange={(e) => setConfig({...config, proposal: { ...config.proposal, emailjs: { ...config.proposal?.emailjs, templateID: e.target.value } }})} />
                <input type="text" placeholder="Public Key" className="p-3 bg-gray-50 border rounded-xl text-sm outline-none focus:border-pink-400"
                  value={config.proposal?.emailjs?.publicKey || ""} onChange={(e) => setConfig({...config, proposal: { ...config.proposal, emailjs: { ...config.proposal?.emailjs, publicKey: e.target.value } }})} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input type="email" placeholder="Her Email Address (to_email)" className="p-3 bg-gray-50 border rounded-xl text-sm outline-none focus:border-pink-400"
                  value={config.proposal?.emailjs?.toEmail || ""} onChange={(e) => setConfig({...config, proposal: { ...config.proposal, emailjs: { ...config.proposal?.emailjs, toEmail: e.target.value } }})} />
                <div className="flex gap-2">
                  <input type="text" placeholder="Certificate Image URL (certificate_url)" className="flex-1 p-3 bg-gray-50 border rounded-xl text-sm outline-none focus:border-pink-400"
                    value={config.proposal?.emailjs?.certificateUrl || ""} onChange={(e) => setConfig({...config, proposal: { ...config.proposal, emailjs: { ...config.proposal?.emailjs, certificateUrl: e.target.value } }})} />
                  <label className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer px-4 rounded-xl text-sm font-semibold transition whitespace-nowrap">
                    Upload
                    <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                      if(!e.target.files[0]) return;
                      const formData = new FormData();
                      formData.append('file', e.target.files[0]);
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        const data = await res.json();
                        if(data.url) {
                          setConfig({...config, proposal: { ...config.proposal, emailjs: { ...config.proposal?.emailjs, certificateUrl: data.url } }});
                          toast.success("Certificate uploaded!");
                        } else throw new Error(data.error);
                      } catch(err) {
                        toast.error('Upload failed: ' + err.message);
                      }
                    }} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CELEBRATION */}
        <section className="bg-white p-6 rounded-2xl shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">🎉 Celebration Screen</h2>
          <input 
            type="text" 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all text-lg font-medium"
            value={config.celebration?.message || ""}
            onChange={(e) => setConfig({...config, celebration: { ...config.celebration, message: e.target.value } })}
            placeholder="She said YES! 💍"
          />
        </section>

      </div>
    </div>
  );
}

const SlideEditor = ({ slide, index, updateSlide, removeSlide }) => {
  const [songQuery, setSongQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [igUrl, setIgUrl] = useState("");
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(slide.crop?.end || 30);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    if (slide.src) {
      const img = new window.Image();
      img.onload = () => {
        setIsLandscape(img.width > img.height);
      };
      img.src = slide.src;
    }
  }, [slide.src]);

  const searchSongs = async () => {
    if (!songQuery) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/songs?q=${encodeURIComponent(songQuery)}`);
      const data = await res.json();
      if(data.results) setSearchResults(data.results);
    } catch(e) {
      toast.error('Search failed');
    }
    setSearching(false);
  };

  const selectSong = async (song) => {
    toast.info(`Fetching lyrics for ${song.trackName}...`);
    let newLyrics = slide.fallbackText || "";
    
    try {
      const res = await fetch(`/api/lyrics?track=${encodeURIComponent(song.trackName)}&artist=${encodeURIComponent(song.artist)}`);
      const data = await res.json();
      if(data.lyrics) {
         newLyrics = data.lyrics.split('\n').filter(l => l.trim().length > 0).slice(0, 6).join('\n');
         toast.success("Lyrics fetched successfully!");
      } else {
         toast.warn("No lyrics found. Typing default.");
      }
    } catch(err) {}

    updateSlide({ 
      ...slide, 
      trackName: song.trackName, 
      artist: song.artist, 
      audioUrl: song.audioUrl,
      fallbackText: newLyrics,
      crop: { start: 0, end: 30 }
    });
    setSearchResults([]);
  };

  const uploadFile = async (e, type) => {
    const isAudio = type === 'audio';
    const setLoader = isAudio ? setUploadingAudio : setUploadingImage;
    setLoader(true);

    const formData = new FormData();
    if(type === 'image' || type === 'audio') {
      if(!e.target.files[0]) { setLoader(false); return; }
      formData.append('file', e.target.files[0]);
    } else if (type === 'url') {
      if(!igUrl) { setLoader(false); return; }
      formData.append('url', igUrl);
    }
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if(data.url) {
         if (isAudio) {
           updateSlide({ ...slide, audioUrl: data.url, trackName: e.target.files[0].name, artist: "Custom Upload", crop: { start: 0, end: 30 } });
         } else {
           updateSlide({ ...slide, src: data.url });
           setIgUrl("");
         }
         toast.success("Upload successful!");
      } else throw new Error(data.error);
    } catch(err) {
      toast.error('Upload failed: ' + err.message);
    }
    setLoader(false);
  };

  const handleAudioLoad = (e) => {
    if (e.target.duration && !isNaN(e.target.duration) && e.target.duration !== Infinity) {
      setDuration(Math.floor(e.target.duration));
    }
  };

  const handleCropChange = (e, field) => {
    let val = parseFloat(e.target.value) || 0;
    let crop = slide.crop || { start: 0, end: 30 };
    
    if (field === 'start') {
      if (val >= crop.end) val = crop.end - 1;
    } else {
      if (val <= crop.start) val = crop.start + 1;
    }
    
    updateSlide({ ...slide, crop: { ...crop, [field]: val } });
  };

  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${isLandscape ? '' : 'lg:flex-row'} relative group transition-all duration-500`}>
      
      {/* Delete Button */}
      <button onClick={removeSlide} className="absolute top-4 right-4 lg:right-6 lg:top-6 bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-full transition-colors z-10" title="Delete Slide">
        <Trash2 size={20} />
      </button>

      {/* MOBILE PHONE MOCKUP / PREVIEW COLUMN */}
      <div className={`${isLandscape ? 'w-full border-b' : 'lg:w-[360px] lg:border-r border-b lg:border-b-0'} bg-gray-50 flex-shrink-0 p-8 flex flex-col items-center justify-center border-gray-100 transition-all duration-500`}>
        <div className={`${isLandscape ? 'w-[480px] h-[270px] rounded-[30px]' : 'w-[280px] h-[550px] rounded-[40px]'} bg-black shadow-2xl p-2 relative overflow-hidden flex flex-col transition-all duration-500 max-w-full`}>
          <div className={`absolute ${isLandscape ? 'top-1/2 left-0 -translate-y-1/2 w-6 h-32 rounded-r-[20px]' : 'top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-[20px]'} bg-black z-30 transition-all duration-500`}></div>
          
          <div className={`w-full h-full bg-gray-900 ${isLandscape ? 'rounded-[22px]' : 'rounded-[32px]'} overflow-hidden relative group`}>
             {slide.src ? (
               <img src={slide.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview"/>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium">No Media</div>
             )}

             {/* Mock UI Overlays */}
             <div className="absolute top-8 left-4 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20">Slide {index + 1}</div>
             
             {/* Mock Captions */}
             <div className="absolute bottom-16 left-0 right-0 px-4 text-center">
                 <p className="text-white font-serif text-shadow text-lg font-bold drop-shadow-md">
                   {slide.fallbackText ? slide.fallbackText.split('\n')[0] : "Lyrics preview..."}
                 </p>
             </div>

             {/* Mock Audio Playing UI */}
             <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-lg rounded-2xl p-3 border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                  <Music size={14} className="text-white"/>
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="text-white text-xs font-bold truncate">{slide.trackName || "No song selected"}</div>
                  <div className="text-gray-400 text-[10px] truncate">{slide.artist || "..."}</div>
                </div>
             </div>
          </div>
        </div>

        {/* Unified Image Upload directly under preview */}
        <div className="mt-6 w-full px-4">
           {uploadingImage ? (
              <div className="bg-blue-50 text-blue-500 text-sm font-bold text-center py-3 rounded-xl animate-pulse">Uploading Media...</div>
           ) : (
              <label className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer px-4 py-3 rounded-xl font-semibold transition w-full">
                <UploadCloud size={18} /> Upload Image
                <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadFile(e, 'image')} />
              </label>
           )}
        </div>
      </div>

      {/* EDITOR PANELS */}
      <div className="flex-1 p-6 lg:p-10 space-y-8 bg-white">
        
        {/* AUDIO MANAGER */}
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Settings size={18} className="text-gray-400"/> Sound & Music Track</h3>
          
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-4">
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Search iTunes (e.g. Arijit Singh)" 
                value={songQuery} onChange={(e) => setSongQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchSongs()}
                className="bg-white border border-gray-200 p-3 rounded-xl text-sm flex-1 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              />
              <button disabled={searching} onClick={searchSongs} className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black transition whitespace-nowrap">
                {searching ? "Searching..." : "Search"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-xl mb-4 shadow-sm divide-y">
                 {searchResults.map((song, i) => (
                   <div key={i} className="p-3 hover:bg-pink-50 cursor-pointer transition flex justify-between items-center group"
                        onClick={() => selectSong(song)}>
                     <div className="flex flex-col">
                       <span className="font-bold text-gray-800 text-sm">{song.trackName}</span>
                       <span className="text-gray-500 text-xs">{song.artist}</span>
                     </div>
                     <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Select</span>
                   </div>
                 ))}
              </div>
            )}

            <div className="flex items-center gap-4 py-4 border-t border-gray-200 mt-2">
               <span className="text-gray-400 font-bold text-sm">OR</span>
               <label className="flex items-center gap-2 bg-purple-50 text-purple-600 hover:bg-purple-100 cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition">
                 {uploadingAudio ? "Uploading..." : <><UploadCloud size={16} /> Upload Custom MP3</>}
                 <input type="file" className="hidden" accept="audio/*" disabled={uploadingAudio} onChange={(e) => uploadFile(e, 'audio')} />
               </label>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
             <div className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Selected Track</div>
             <div className="font-bold text-lg mb-4 text-gray-800">{slide.trackName || "None"}</div>
             {slide.audioUrl && (
               <div className="space-y-6">
                 <audio ref={audioRef} src={slide.audioUrl} onLoadedMetadata={handleAudioLoad} controls className="w-full h-10 outline-none rounded-lg" />
                 
                 {/* CUSTOM CROPPING UI */}
                 <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-gray-700">Audio Crop Settings</span>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 border rounded shadow-sm">
                         {((slide.crop?.end || 30) - (slide.crop?.start || 0)).toFixed(1)}s Total
                      </span>
                    </div>

                    <div className="flex flex-col gap-5">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 font-bold">
                           <span>Start: {slide.crop?.start || 0}s</span>
                        </div>
                        <input type="range" 
                               min="0" max={duration} step="0.5" 
                               value={slide.crop?.start || 0}
                               onChange={(e) => handleCropChange(e, 'start')}
                               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 font-bold">
                           <span>End: {slide.crop?.end || 30}s</span>
                           <span>Total: {duration}s</span>
                        </div>
                        <input type="range" 
                               min="0" max={duration} step="0.5" 
                               value={slide.crop?.end || 30}
                               onChange={(e) => handleCropChange(e, 'end')}
                               className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600" />
                      </div>
                    </div>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* LYRICS / TEXT MANAGER */}
        <div>
           <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg flex items-center gap-2"><Type size={18} className="text-gray-400"/> Scene Text / Lyrics</h3>
           </div>
           
           <div className="relative">
             <textarea 
               value={slide.fallbackText || ""}
               onChange={(e) => updateSlide({...slide, fallbackText: e.target.value})}
               className="w-full h-40 p-5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 font-medium leading-relaxed outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all resize-none shadow-inner"
               placeholder="Write lyrics line by line here..."
             />
             <div className="absolute inset-y-0 left-4 py-5 pointer-events-none text-gray-300 font-mono text-xs hidden sm:flex flex-col space-y-6">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
             </div>
           </div>

           {/* LYRICS SPEED CONTROLLER */}
           <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 border border-gray-200 rounded-xl">
              <div>
                <span className="text-sm font-bold text-gray-700 block">Lyrics Transition Speed</span>
                <span className="text-xs text-gray-500">How fast to move to the next line after finishing typing.</span>
              </div>
              <div className="flex gap-2 mt-3 sm:mt-0">
                {[0.5, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => updateSlide({...slide, lyricsSpeed: speed})}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${(slide.lyricsSpeed || 1) === speed ? 'bg-pink-500 text-white shadow-md' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

