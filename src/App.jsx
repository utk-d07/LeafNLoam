import React, { useState, useEffect, useRef } from 'react';
import { Camera, Menu, X, CheckCircle, Activity, MessageSquare, Send, Image as ImageIcon, RefreshCw, Leaf, Globe, Droplet, TrendingDown, ThumbsUp, ThumbsDown, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- IMPORT YOUR ASSETS ---
import lnlLogo from './assets/lnl_logo.png'; 

// --- CONFIGURATION ---
const ENABLE_REAL_BACKEND = true; 

// --- THEME COLORS ---
const THEME = {
  textDark: "#1F291F", 
  sage: "#D4E5A8",  
  primary: "#7BAE5E",
  glass: "bg-white/70 backdrop-blur-xl border border-white/50"
};

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    brand: "Leaf & Loam",
    title: "AI Doctor", 
    subtitle: "Your pocket botanist for a greener tomorrow.",
    tapToScan: "Tap to Scan Leaf",
    selectSource: "Select Camera or Gallery",
    useCamera: "Use Camera",
    uploadFile: "Upload File",
    analyzing: "Scanning Leaf Tissue...",
    detecting: "Calculating Infection Vectors...",
    diagnosis: "Diagnosis Report",
    severity: "Danger Level",
    confidence: "AI Precision",
    harvest: "Harvest Recommendation",
    harvest_yes: "SAFE TO PLUCK",
    harvest_no: "DO NOT PLUCK",
    symptoms: "Visual Symptoms",
    action: "Prescribed Action",
    save: "Save PDF Report",
    scanNew: "Scan Another",
    chatPlaceholder: "Ask Leaf & Loam AI...",
    introTitle: "LEAF & LOAM",
    dosage: "Chemical Mix",
    tracker: "Recovery Forecast",
    week: "Week"
  },
  as: {
    brand: "লিফ এণ্ড লোম",
    title: "এ আই ডাক্টৰ", 
    subtitle: "আপোনাৰ সেউজ ভৱিষ্যতৰ বাবে এক ডিজিটেল উদ্ভিদবিদ।", 
    tapToScan: "পাত স্কেন কৰিবলৈ টিপক",
    selectSource: "কেমেৰা বা গেলেৰী বাছনি কৰক",
    useCamera: "কেমেৰা ব্যৱহাৰ কৰক",
    uploadFile: "ফাইল আপলোড কৰক",
    analyzing: "পাতৰ গঠন বিশ্লেষণ কৰা হৈছে...",
    detecting: "গছৰ স্বাস্থ্য পৰীক্ষা কৰা হৈছে...",
    diagnosis: "ৰোগ নিৰ্ণয় প্ৰতিবেদন",
    severity: "বিপদৰ মাত্ৰা",
    confidence: "AI সঠিকতা",
    harvest: "চিন কটোৱা পৰামৰ্শ",
    harvest_yes: "ছিঙিব পাৰি",
    harvest_no: "ছিঙিব নালাগে",
    symptoms: "চিনাক্ত কৰা লক্ষণসমূহ",
    action: "পৰামৰ্শিত ব্যৱস্থা",
    save: "ৰিপৰ্ট সংৰক্ষণ কৰক",
    scanNew: "নতুন স্কেন",
    chatPlaceholder: "লিফ এণ্ড লোমক সোধক...",
    introTitle: "লিফ এণ্ড লোম",
    dosage: "ঔষধৰ মাত্ৰা",
    tracker: "আৰোগ্যৰ পূৰ্বাভাস",
    week: "সপ্তাহ"
  }
};

// --- DISEASE DATABASE ---
const GET_DISEASE_DB = (lang) => [
  {
    name: lang === 'en' ? "Blister Blight" : "ব্লাইষ্টাৰ ব্লাইট",
    severity: 85,
    confidence: 99.2, 
    harvestable: false,
    symptoms: lang === 'en' ? "Translucent spots turning into white blisters. Leaves curl and turn black." : "পাতত বগা ফোহা। পাতবোৰ ক’লা পৰি কোঁচ খাই যায়।",
    chemical: "Copper Oxychloride 50 WP",
    mix_ratio: "25g / 10L Water",
    visual_mix: "1/4 Packet per Tank",
    color: "#D87B6B",
    progression: [85, 60, 35, 5] 
  },
  {
    name: lang === 'en' ? "Red Rust" : "ৰঙা মামৰ",
    severity: 65,
    confidence: 96.5,
    harvestable: false,
    symptoms: lang === 'en' ? "Orange-red algal spots on leaves/stems. Sign of poor drainage." : "পাত আৰু ডালত কমলা-ৰঙা নোমাল দাগ।",
    chemical: "SOP + Copper Oxychloride",
    mix_ratio: "20g / 10L Water",
    visual_mix: "1/5 Packet per Tank",
    color: "#E89F8C",
    progression: [65, 50, 20, 0]
  },
  {
    name: lang === 'en' ? "Healthy Leaf" : "নিৰোগী পাত",
    severity: 2,
    confidence: 99.9,
    harvestable: true,
    symptoms: lang === 'en' ? "Vibrant green lamina. No lesions or discoloration detected." : "পাতবোৰ উজ্জ্বল সেউজীয়া আৰু কোনো দাগ নাই।",
    chemical: "Organic Booster",
    mix_ratio: "Standard NPK",
    visual_mix: "Routine Schedule",
    color: "#7BAE5E",
    progression: [2, 1, 0, 0]
  }
];

// --- COMPONENT: LEAF TRAIL ---
const LeafTrail = () => {
  const [leaves, setLeaves] = useState([]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.85) { 
        const newLeaf = { id: Date.now(), x: e.clientX, y: e.clientY, rotation: Math.random() * 360, color: Math.random() > 0.5 ? "#9BC474" : "#7BAE5E" };
        setLeaves((prev) => [...prev.slice(-15), newLeaf]);
        setTimeout(() => setLeaves((prev) => prev.filter((l) => l.id !== newLeaf.id)), 1000);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      <AnimatePresence>{leaves.map((leaf) => (
        <motion.div key={leaf.id} initial={{ opacity: 0.8, x: leaf.x, y: leaf.y, scale: 0.5, rotate: leaf.rotation }} animate={{ opacity: 0, y: leaf.y + 50, rotate: leaf.rotation + 90 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute">
          <Leaf size={16} fill={leaf.color} color={leaf.color} />
        </motion.div>
      ))}</AnimatePresence>
    </div>
  );
};

// --- COMPONENT: PARTICLE SCATTER (BIKHAR JANA) ---
const ParticleScatter = ({ isHovered }) => {
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * 360;
    const x = Math.cos(angle * (Math.PI / 180)) * 140;
    const y = Math.sin(angle * (Math.PI / 180)) * 140;
    return { id: i, x, y };
  });
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute left-1/2 top-1/2 w-12 h-12 bg-white/40 backdrop-blur-md rounded-full"
          initial={{ x: "-50%", y: "-50%", scale: 0, opacity: 0 }}
          animate={isHovered ? { x: p.x, y: p.y, scale: [0, 1, 0], opacity: [0, 0.8, 0], rotate: Math.random() * 180 } : { x: "-50%", y: "-50%", scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

// --- COMPONENT: HARVEST BADGE ---
const HarvestBadge = ({ isHarvestable, t }) => (
  <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 backdrop-blur-md shadow-lg ${isHarvestable ? 'bg-green-50/80 border-green-500 text-green-800' : 'bg-red-50/80 border-red-500 text-red-800'}`}>
    <div className={`p-2 rounded-full ${isHarvestable ? 'bg-green-200' : 'bg-red-200'}`}>
      {isHarvestable ? <ThumbsUp size={24} /> : <ThumbsDown size={24} />}
    </div>
    <div>
      <div className="text-xs font-black uppercase opacity-60 tracking-widest mb-1">{t('harvest')}</div>
      <div className="font-extrabold text-xl leading-none tracking-tight">{isHarvestable ? t('harvest_yes') : t('harvest_no')}</div>
    </div>
  </div>
);

// --- MAIN APP ---
export default function App() {
  const [lang, setLang] = useState('en');
  const [appLoaded, setAppLoaded] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const bgVideoRef = useRef(null);
  const videoRef = useRef(null);
  
  const t = (key) => TRANSLATIONS[lang][key] || key;
  const fontStyle = lang === 'en' ? { fontFamily: "'Kranky', cursive" } : { fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700 };

  useEffect(() => {
    const linkKranky = document.createElement('link'); linkKranky.href = 'https://fonts.googleapis.com/css2?family=Kranky&display=swap'; linkKranky.rel = 'stylesheet'; document.head.appendChild(linkKranky);
    const linkHind = document.createElement('link'); linkHind.href = 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@700&display=swap'; linkHind.rel = 'stylesheet'; document.head.appendChild(linkHind);
    setTimeout(() => setAppLoaded(true), 2500);
  }, []);

  useEffect(() => { if (bgVideoRef.current && appLoaded) bgVideoRef.current.playbackRate = 0.85; }, [appLoaded]);

  const handleFileUpload = (e) => { const file = e.target.files[0]; setShowOptions(false); if (file) processFile(file); };
  const processFile = (file) => { setImage(URL.createObjectURL(file)); simulateAnalysis(); };
  const simulateAnalysis = () => { setLoading(true); setResult(null); setTimeout(() => { setLoading(false); setResult(GET_DISEASE_DB(lang)[0]); }, 2500); };
  const resetApp = () => { setImage(null); setResult(null); setLoading(false); setShowOptions(false); setIsCameraActive(false); };

  const startCamera = async () => { setShowOptions(false); setIsCameraActive(true); try { const stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } catch (err) { alert("Camera denied"); setIsCameraActive(false); } };
  const capturePhoto = () => { const video = videoRef.current; if (video) { const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext('2d').drawImage(video, 0, 0); canvas.toBlob((blob) => { const file = new File([blob], "webcam.jpg", { type: "image/jpeg" }); setIsCameraActive(false); if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t=>t.stop()); processFile(file); }, 'image/jpeg'); } };

  return (
    <div className="min-h-screen text-[#000000] font-sans overflow-hidden cursor-default selection:bg-[#D4E5A8] relative">
      
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#F5EDD6]">
        <motion.video ref={bgVideoRef} src="./Video_Animation_Leaves_Blowing_in_Wind.mp4" autoPlay muted loop playsInline initial={{ opacity: 0 }} animate={appLoaded ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 1 }} className="w-full h-full object-cover scale-[1.35]" />
        <div className="absolute inset-0 bg-[#F5EDD6]/40 mix-blend-soft-light"></div> 
      </div>

      <LeafTrail />
      
      <AnimatePresence>{!appLoaded && (
        <motion.div className="fixed inset-0 z-[9999] bg-[#D4E5A8] flex flex-col items-center justify-center overflow-hidden" exit={{ opacity: 0 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }} className="w-56 h-56 mb-6"><img src={lnlLogo} className="w-full h-full object-contain drop-shadow-2xl" /></motion.div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-6xl text-center px-4" style={{ ...fontStyle, color: THEME.textDark, textShadow: "4px 4px 0px #C8E096" }}>{t('introTitle')}</motion.h1>
        </motion.div>
      )}</AnimatePresence>

      <motion.header 
        initial={{ backgroundColor: "rgba(255, 255, 255, 0.25)", backdropFilter: "blur(8px)" }}
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0)", backdropFilter: "blur(0px)" }} 
        transition={{ duration: 0.4 }}
        className="fixed top-0 w-full z-50"
      >
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
            <img src={lnlLogo} className="h-12 w-auto" />
            <h1 className="text-xl pt-1 font-black tracking-wide" style={{ ...fontStyle, color: "#D4E5A8", WebkitTextStroke: "1px #000000", paintOrder: "stroke fill" }}>{t('brand')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'as' : 'en')} className="bg-[#9BC474] text-white px-4 py-1.5 rounded-full text-xs font-bold border border-white/20 flex items-center gap-2 shadow-lg active:scale-95 transition-transform"><Globe size={14} />{lang === 'en' ? 'অসমীয়া' : 'ENGLISH'}</button>
          </div>
        </div>
      </motion.header>

      <main className="h-screen pt-16 overflow-hidden">
        <AnimatePresence mode="wait"><motion.div key={lang} initial={{ opacity: 0, filter: "blur(5px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} className="h-full">
            {!image ? (
              <div className="h-full flex flex-col items-center justify-center p-4">
                <div className="mb-12 flex flex-col items-center">
                  {/* AI DOCTOR: No BG, Correct Color */}
                  <h2 className="text-6xl text-center select-text drop-shadow-md" style={{ ...fontStyle, color: "#D4E5A8", textShadow: "2px 2px 0px #000000" }}>{t('title')}</h2>
                  {/* SUBTITLE: Tight BG, Correct Color */}
                  <div className="mt-4 bg-[#D4E5A8] px-3 py-1 inline-block shadow-sm rounded-sm">
                    <p className="text-xl font-bold font-sans tracking-wide text-[#1F291F]">{t('subtitle')}</p>
                  </div>
                </div>
                
                {/* SCATTER ANIMATION */}
                <motion.div 
                  className="w-full max-w-md h-64 relative flex items-center justify-center cursor-pointer"
                  onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} onClick={() => setShowOptions(true)}
                >
                  <ParticleScatter isHovered={isHovered} />
                  <motion.div className={`absolute inset-0 rounded-3xl ${THEME.glass}`} animate={isHovered ? { opacity: 0, scale: 1.15, filter: "blur(12px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 0.8, ease: "easeInOut" }} />
                  <motion.div className="absolute top-10 z-10" animate={isHovered ? { opacity: 0, y: -30, filter: "blur(8px)" } : { opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}><h3 className="text-3xl" style={{ ...fontStyle, color: THEME.textDark }}>{t('tapToScan')}</h3></motion.div>
                  <motion.div className="relative z-20 w-24 h-24 bg-[#D4E5A8] rounded-full flex items-center justify-center shadow-xl border-4 border-white" animate={isHovered ? { scale: 1.1 } : { scale: 1 }} transition={{ type: "spring", stiffness: 200 }}><Camera className="w-12 h-12 drop-shadow-md" style={{ color: "#D87B6B" }} /></motion.div>
                  <motion.div className="absolute bottom-10 z-10" animate={isHovered ? { opacity: 0, y: 30, filter: "blur(8px)" } : { opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}><p className="text-base font-bold font-sans" style={{ color: "#5a4835" }}>{t('selectSource')}</p></motion.div>
                </motion.div>
              </div>
            ) : (
              // --- DIAGNOSIS PAGE (FIXED & FULLY FEATURED) ---
              <div className="h-full flex flex-col md:flex-row">
                
                {/* LEFT: IMAGE PREVIEW */}
                <div className="w-full md:w-1/2 h-[40vh] md:h-full p-6 flex items-center justify-center">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 h-full w-full max-w-lg aspect-[4/5] bg-black">
                    <img src={image} className="w-full h-full object-cover" />
                    <button onClick={resetApp} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-[#D87B6B] hover:scale-110 transition"><X size={24} /></button>
                  </div>
                </div>

                {/* RIGHT: RESULTS DASHBOARD (SCROLLABLE & SPACED) */}
                <div className="w-full md:w-1/2 h-[60vh] md:h-full bg-white/40 backdrop-blur-2xl border-l border-white/30 p-8 overflow-y-auto">
                  {loading ? ( 
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <Activity className="w-20 h-20 text-[#2F3E28] animate-spin" />
                      <div className="text-4xl text-[#1F291F]" style={fontStyle}>{t('analyzing')}</div>
                      <div className="text-lg font-bold text-gray-700 animate-pulse">{t('detecting')}</div>
                    </div> 
                  ) : result && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8 pb-20">
                      
                      {/* 1. HEADER & HARVEST STATUS */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-black opacity-60 uppercase tracking-[0.2em]">{t('diagnosis')}</h2>
                          <div className="flex items-center gap-2 bg-[#1F291F] text-[#D4E5A8] px-3 py-1 rounded-full text-xs font-bold">
                            <ShieldCheck size={14} /> AI ACCURACY: {result.confidence}%
                          </div>
                        </div>
                        <h1 className="text-6xl font-bold text-[#1F291F] leading-none drop-shadow-sm" style={fontStyle}>{result.name}</h1>
                        <HarvestBadge isHarvestable={result.harvestable} t={t} />
                      </div>

                      {/* 2. DANGER LEVEL (SEVERITY) */}
                      <div className={`p-6 rounded-2xl border-2 ${result.severity > 50 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                        <div className="flex justify-between items-end mb-2">
                          <h3 className="font-black text-gray-500 uppercase tracking-widest text-xs">{t('severity')}</h3>
                          <span className={`text-3xl font-extrabold ${result.severity > 50 ? 'text-red-600' : 'text-green-600'}`}>{result.severity}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${result.severity}%` }} transition={{ duration: 1 }} className={`h-full ${result.severity > 50 ? 'bg-red-500' : 'bg-green-500'}`} />
                        </div>
                      </div>

                      {/* 3. SYMPTOMS & TREATMENT GRID */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className={`${THEME.glass} p-6 rounded-2xl`}>
                           <h3 className="flex items-center gap-2 text-[#2F3E28] font-black text-xs uppercase tracking-widest mb-3"><AlertTriangle size={16} /> {t('symptoms')}</h3>
                           <p className="text-[#1F291F] font-bold text-lg leading-snug">{result.symptoms}</p>
                        </div>
                        
                        <div className={`${THEME.glass} p-6 rounded-2xl`}>
                           <h3 className="flex items-center gap-2 text-blue-800 font-black text-xs uppercase tracking-widest mb-3"><Droplet size={16} /> {t('action')}</h3>
                           <div className="font-bold text-[#1F291F] text-xl leading-tight">{result.chemical}</div>
                           <div className="text-blue-600 font-extrabold text-lg mt-1">{result.mix_ratio}</div>
                        </div>
                      </div>

                      {/* 4. RECOVERY GRAPH */}
                      <div className={`${THEME.glass} p-6 rounded-2xl`}>
                        <h4 className="text-xs font-black text-gray-500 tracking-widest mb-6 flex items-center gap-2"><TrendingDown size={16} /> {t('tracker')}</h4>
                        <div className="flex items-end h-32 gap-6 px-2">
                          {result.progression.map((val, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                              <div className="text-xs text-gray-500 font-bold">{val}%</div>
                              <div className="w-full bg-gray-200/50 rounded-t-lg h-full overflow-hidden relative">
                                <motion.div initial={{ height: "0%" }} animate={{ height: `${val}%` }} transition={{ duration: 1, delay: idx * 0.2 }} className={`absolute bottom-0 w-full rounded-t-lg ${val > 50 ? 'bg-red-400' : 'bg-green-400'}`} />
                              </div>
                              <div className="text-xs font-bold text-gray-400">{t('week')} {idx + 1}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 5. ACTIONS */}
                      <div className="flex gap-4 mt-4">
                        <button className="flex-1 bg-white hover:bg-gray-50 text-[#1F291F] font-bold py-4 rounded-xl shadow-sm border border-gray-200 transition-colors">{t('save')}</button>
                        <button onClick={resetApp} className="flex-1 bg-[#2F3E28] hover:bg-[#1a231a] text-white font-bold py-4 rounded-xl shadow-lg transition-colors">{t('scanNew')}</button>
                      </div>

                    </motion.div>
                  )}
                </div>
              </div>
            )}
        </motion.div></AnimatePresence>
        
        <ChatBot isOpen={chatOpen} setIsOpen={setChatOpen} t={t} />
        
        {/* MODALS */}
        {showOptions && !isCameraActive && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-4" onClick={() => setShowOptions(false)}>
            <div className="bg-white/90 backdrop-blur-xl w-full max-w-sm rounded-3xl p-6 relative border-t-4 border-[#7BAE5E]" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowOptions(false)} className="absolute top-4 right-4 text-[#8B7355] hover:text-[#000000]"><X size={24}/></button>
              <h3 className="text-2xl mb-6 text-center" style={{ ...fontStyle, color: "#2F3E28" }}>{t('selectSource')}</h3>
              <div className="flex flex-col gap-4">
                <div onClick={startCamera} className="flex items-center gap-4 p-4 bg-[#D4E5A8]/50 rounded-2xl cursor-pointer hover:bg-[#D4E5A8] transition-colors"><div className="w-12 h-12 bg-[#7BAE5E] text-white rounded-full flex items-center justify-center"><Camera size={24} /></div><div className="font-bold text-[#000000]">{t('useCamera')}</div></div>
                <label className="flex items-center gap-4 p-4 bg-[#F5EDD6] rounded-2xl cursor-pointer hover:bg-[#E8DFC5] transition-colors"><div className="w-12 h-12 bg-white text-[#8B7355] rounded-full flex items-center justify-center"><ImageIcon size={24} /></div><div className="font-bold text-[#000000]">{t('uploadFile')}</div><input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" /></label>
              </div>
            </div>
          </div>
        )}
        {isCameraActive && (
           <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
             <div className="relative w-full max-w-lg bg-black rounded-3xl overflow-hidden border-2 border-[#D4E5A8] shadow-2xl aspect-[3/4] md:aspect-video">
               <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" /> 
               <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8">
                 <button onClick={() => { setIsCameraActive(false); if(videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t=>t.stop()); }} className="bg-white/20 p-4 rounded-full text-white hover:bg-white/30 backdrop-blur-md transition"><X size={24} /></button>
                 <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-[#7BAE5E] flex items-center justify-center shadow-lg hover:scale-105 transition"><div className="w-16 h-16 bg-[#9BC474] rounded-full"></div></button>
               </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
}

// --- SMART CHATBOT DEMO ---
const ChatBot = ({ isOpen, setIsOpen, t }) => {
  const [messages, setMessages] = useState([{ text: "🌿 Hello! I am your Leaf & Loam AI assistant.", isBot: true }]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = (e) => {
    e.preventDefault(); if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    const userInput = input.toLowerCase();
    setInput("");
    
    // DEMO: Smart Responses without Backend
    setTimeout(() => {
        let reply = "I can analyze your plant's health. Please upload a photo for a detailed diagnosis.";
        if (userInput.includes("blister")) reply = "Blister Blight is common in humid conditions. I recommend applying Copper Oxychloride (25g/10L) immediately to stop the spread.";
        else if (userInput.includes("rust")) reply = "Red Rust indicates weak plants. Improve drainage and apply SOP + Copper Oxychloride to boost vitality.";
        else if (userInput.includes("mix") || userInput.includes("dosage")) reply = "Standard fungicide mix is 25g per 10L water tank. Always wear protective gear when spraying.";
        else if (userInput.includes("pluck") || userInput.includes("harvest")) reply = "Only pluck if the AI Confidence is high and Severity is below 10%. Avoid plucking leaves with visible lesions.";
        else if (userInput.includes("weather") || userInput.includes("rain")) reply = "If rain is expected, delay spraying fungicides by 24 hours to ensure effectiveness.";
        else if (userInput.includes("hello") || userInput.includes("hi")) reply = "Hello! I am ready to help. Ask me about tea diseases, dosage, or harvesting.";
        
        setMessages(prev => [...prev, { text: reply, isBot: true }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>{isOpen && (
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="mb-4 w-80 md:w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-[#D9C4A8] flex flex-col h-[500px]">
          <div className="bg-[#7BAE5E] p-4 text-white font-bold flex items-center gap-3 shadow-md"><img src={lnlLogo} className="h-8 w-8 bg-white rounded-full p-1" /><span>Leaf & Loam AI</span></div>
          <div className="flex-1 overflow-y-auto p-4 bg-white/50" ref={scrollRef}>{messages.map((m, i) => (<div key={i} className={`flex mb-3 ${m.isBot ? 'justify-start' : 'justify-end'}`}><div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.isBot ? "bg-white border text-gray-900 font-medium shadow-sm" : "bg-[#7BAE5E] text-white shadow-md"}`}>{m.text}</div></div>))}</div>
          <form onSubmit={handleSend} className="p-3 bg-white/80 border-t flex gap-2"><input value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-gray-100/80 rounded-xl px-4 py-3 text-sm outline-none font-medium" placeholder={t('chatPlaceholder')} /><button type="submit" className="bg-[#2F3E28] text-white p-3 rounded-xl"><Send size={18}/></button></form>
        </motion.div>
      )}</AnimatePresence>
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-[#2F3E28] rounded-full flex items-center justify-center text-white border-4 border-[#D4E5A8] shadow-xl">{isOpen ? <X size={28} /> : <MessageSquare size={28} />}</button>
    </div>
  );
}
