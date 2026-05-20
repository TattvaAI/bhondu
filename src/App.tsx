import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronRight, 
  Heart
} from 'lucide-react';

// ==========================================
// 1. Web Audio API Premium Sound Synthesizer
// ==========================================
class SoundSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  playTap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio synthesise error:", e);
    }
  }

  playEvade() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) {
      console.warn("Audio synthesise error:", e);
    }
  }

  playLevelUp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const playNote = (freq: number, startOffset: number, duration: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startOffset);

        gain.gain.setValueAtTime(0.12, startOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, startOffset + duration - 0.01);

        osc.start(startOffset);
        osc.stop(startOffset + duration);
      };

      playNote(523.25, now, 0.08); // C5
      playNote(659.25, now + 0.06, 0.08); // E5
      playNote(783.99, now + 0.12, 0.08); // G5
      playNote(1046.50, now + 0.18, 0.22); // C6
    } catch (e) {
      console.warn("Audio synthesise error:", e);
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const start = now + idx * 0.05;
        const duration = 0.35;
        
        const osc = this.ctx.createOscillator();
        const oscDetune = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        oscDetune.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        oscDetune.type = 'triangle';
        oscDetune.frequency.setValueAtTime(freq * 1.006, start);
        
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.start(start);
        oscDetune.start(start);
        osc.stop(start + duration);
        oscDetune.stop(start + duration);
      });
    } catch (e) {
      console.warn("Audio synthesise error:", e);
    }
  }
}

// ==========================================
// 2. Custom Floating SVGs
// ==========================================
const MomoSVG = () => (
  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
    {/* Cute stylized Momo/Dumpling path */}
    <path 
      d="M50,15 C35,15 22,28 22,48 C22,68 50,85 50,85 C50,85 78,68 78,48 C78,28 65,15 50,15 Z" 
      fill="currentColor" 
    />
    <path d="M50,15 C46,25 40,38 30,45" stroke="rgba(0,0,0,0.12)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M50,15 C54,25 60,38 70,45" stroke="rgba(0,0,0,0.12)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M50,15 L50,48" stroke="rgba(0,0,0,0.12)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </svg>
);

const HeartSVG = () => (
  <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
    <path 
      d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" 
      fill="currentColor" 
    />
  </svg>
);

const SparkleSVG = () => (
  <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
    <path 
      d="M12,2L14.7,8.6L21,10L16,14.5L17.7,21L12,17.2L6.3,21L8,14.5L3,10L9.3,8.6L12,2Z" 
      fill="currentColor" 
    />
  </svg>
);

// ==========================================
// 2.5. Mobile Haptic Feedback Helper
// ==========================================
const triggerHaptic = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.warn("Haptic feedback error:", e);
    }
  }
};

// Pre-calculate randomized floating path details once to ensure render purity
const FLOATING_ITEMS = Array.from({ length: 16 }).map((_, i) => {
  const types = ['momo', 'heart', 'sparkle'];
  const randomX = Math.random() * 120 - 60;
  return {
    id: i,
    type: types[Math.floor(Math.random() * types.length)],
    size: Math.random() * 26 + 18,
    left: (Math.random() * 90 + 5) + "%",
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 4,
    color: ['#ff0a54', '#ff7096', '#8338ec', '#00f5d4'][Math.floor(Math.random() * 4)],
    xPath: [0, randomX, 0],
  };
});

// ==========================================
// 3. Main App Component Redesign
// ==========================================
export default function App() {
  // Sync core props with URL Query parameter configuration (The engine design)
  const searchParams = new URLSearchParams(window.location.search);
  const targetName = searchParams.get('name') || searchParams.get('target') || 'Bhondu';
  const senderName = searchParams.get('sender') || 'Shivansh';
  const rewardName = searchParams.get('reward') || searchParams.get('prize') || 'Momos';
  const customEvadeText = searchParams.get('evade') || 'Nahi jana 🤢';
  const customConfirmText = searchParams.get('confirm') || 'Chal done 💖';

  // UI state
  const [step, setStep] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isBhonduChecked, setIsBhonduChecked] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('bhondu-theme') as 'light' | 'dark' : null;
    return savedTheme || 'light';
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Evasive button physics state
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noRotate, setNoRotate] = useState(0);
  const baseLayoutRef = useRef<HTMLDivElement>(null);

  // Form customizer states
  const [creatorTarget, setCreatorTarget] = useState('');
  const [creatorSender, setCreatorSender] = useState('');
  const [creatorReward, setCreatorReward] = useState('');
  const [creatorEvade, setCreatorEvade] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Sound Synth Ref
  const soundSynth = useRef<SoundSynth | null>(null);
  const hasTriggeredLevelUp = useRef(false);

  useEffect(() => {
    soundSynth.current = new SoundSynth();
    // Synchronize HTML attribute on mount
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('bhondu-theme', nextTheme);
    triggerHaptic(15);
    if (soundSynth.current) soundSynth.current.playTap();
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    triggerHaptic(15);
    if (soundSynth.current) {
      soundSynth.current.setMuted(nextMuted);
      if (!nextMuted) soundSynth.current.playTap();
    }
  };

  // Safe vector-based evasive physics engine
  const handleEvade = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    triggerHaptic(20);

    if (soundSynth.current) {
      soundSynth.current.playEvade();
    }

    // Capture button and viewport references
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // Calculate natural unshifted layout origin of the button
    const originalLeft = rect.left - noPos.x;
    const originalTop = rect.top - noPos.y;

    // Get exact cursor coordinate points
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Direct push vector calculations
    let dx = btnCenterX - clientX;
    let dy = btnCenterY - clientY;

    if (dx === 0 && dy === 0) {
      dx = Math.random() - 0.5;
      dy = Math.random() - 0.5;
    }

    const dist = Math.hypot(dx, dy);
    const normX = dx / (dist || 1);
    const normY = dy / (dist || 1);

    // Apply rapid cinematic pop velocity
    const jumpDistance = 140 + Math.random() * 60; 
    let targetAbsX = btnCenterX + normX * jumpDistance - rect.width / 2;
    let targetAbsY = btnCenterY + normY * jumpDistance - rect.height / 2;

    // Query glassmorphic container bounds to restrict movement inside it
    const container = document.querySelector('.content-wrapper');
    const containerRect = container ? container.getBoundingClientRect() : null;

    const safeMargin = 16;
    const minW = containerRect ? containerRect.left + safeMargin : safeMargin;
    const maxW = containerRect ? containerRect.right - rect.width - safeMargin : viewportW - rect.width - safeMargin;
    const minH = containerRect ? containerRect.top + safeMargin : safeMargin;
    const maxH = containerRect ? containerRect.bottom - rect.height - safeMargin : viewportH - rect.height - safeMargin;

    // Constrained card bounds check with fallback handling
    let finalMinW = minW;
    let finalMaxW = maxW;
    if (finalMaxW < finalMinW) {
      finalMinW = safeMargin;
      finalMaxW = viewportW - rect.width - safeMargin;
    }
    
    let finalMinH = minH;
    let finalMaxH = maxH;
    if (finalMaxH < finalMinH) {
      finalMinH = safeMargin;
      finalMaxH = viewportH - rect.height - safeMargin;
    }

    if (targetAbsX < finalMinW) targetAbsX = finalMinW + Math.random() * Math.min(30, (finalMaxW - finalMinW) / 2 || 1);
    if (targetAbsX > finalMaxW) targetAbsX = finalMaxW - Math.random() * Math.min(30, (finalMaxW - finalMinW) / 2 || 1);
    if (targetAbsY < finalMinH) targetAbsY = finalMinH + Math.random() * Math.min(30, (finalMaxH - finalMinH) / 2 || 1);
    if (targetAbsY > finalMaxH) targetAbsY = finalMaxH - Math.random() * Math.min(30, (finalMaxH - finalMinH) / 2 || 1);

    // Calculate translation metrics relative to unshifted origin coordinate points
    const relX = targetAbsX - originalLeft;
    const relY = targetAbsY - originalTop;

    setNoPos({ x: relX, y: relY });
    // Bouncy visual tumble effect
    setNoRotate(prev => prev + (Math.random() > 0.5 ? 90 : -90));
  };

  const nextStep = () => {
    triggerHaptic(15);
    if (soundSynth.current) {
      soundSynth.current.playTap();
    }
    setStep(prev => prev + 1);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    if (val === 100) {
      if (!hasTriggeredLevelUp.current) {
        triggerHaptic([50, 50, 100]);
        if (soundSynth.current) soundSynth.current.playLevelUp();
        hasTriggeredLevelUp.current = true;
      }
    } else {
      hasTriggeredLevelUp.current = false;
      if (val % 8 === 0) {
        triggerHaptic(8); // Subtle clicks during drag
      }
    }
  };

  const handleCheckboxClick = () => {
    triggerHaptic(20);
    if (soundSynth.current) soundSynth.current.playTap();
    setIsBhonduChecked(!isBhonduChecked);
  };

  const celebrate = () => {
    triggerHaptic([100, 30, 80, 30, 150]);
    if (soundSynth.current) {
      soundSynth.current.playSuccess();
    }
    setStep(6);

    const duration = 6 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 42, spread: 360, ticks: 60, zIndex: 110 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 65 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff0a54', '#ff477e', '#8338ec', '#ffb3c6', '#00f5d4'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff0a54', '#ff477e', '#8338ec', '#ffb3c6', '#00f5d4'],
      });
    }, 250);
  };

  // Generate customized link share engine
  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic([30, 50, 30]);
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();

    if (creatorTarget.trim()) params.set('name', creatorTarget.trim());
    if (creatorSender.trim()) params.set('sender', creatorSender.trim());
    if (creatorReward.trim()) params.set('reward', creatorReward.trim());
    if (creatorEvade.trim()) params.set('evade', creatorEvade.trim());

    const finalUrl = `${baseUrl}?${params.toString()}`;
    setGeneratedLink(finalUrl);
    navigator.clipboard.writeText(finalUrl);
    setIsCopied(true);
    if (soundSynth.current) soundSynth.current.playLevelUp();
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Curate dynamic slider label statuses
  const getSliderBadgeText = () => {
    if (sliderValue === 0) return `Normal Dimaag: 100% 🧠`;
    if (sliderValue <= 25) return `Dheere Dheere Khisak Raha Hai 🤨`;
    if (sliderValue <= 55) return `50% Tubelight Level 🔦`;
    if (sliderValue <= 80) return `Certified Crackpot Status 🤯`;
    if (sliderValue < 100) return `Dangerously Close to ${targetName}! ⚠️`;
    return `👑 Absolute 100% ${targetName}!`;
  };

  const isCustom = targetName !== 'Bhondu' || senderName !== 'Shivansh' || rewardName !== 'Momos';

  const screens = [
    {
      emoji: "👋",
      title: "Oye Bhondu...",
      subtitle: isCustom ? `Custom Proposal for ${targetName}` : "",
      buttonText: "Kisko bola? 🤨",
      action: nextStep
    },
    {
      emoji: "🤔",
      title: "Mera dimaag khaate khaate tujhe itna time ho gaya hai...",
      subtitle: "Toh maine socha teri iss mehnat ko finally reward kar hi doon.",
      buttonText: "Kaisa reward? 🤔",
      action: nextStep
    },
    {
      emoji: "🔐",
      title: "Par pehle, ek security check.",
      subtitle: `Prove kar ki tu kitni badi ${targetName} hai.`,
      buttonText: "", // Interactive Slider
      action: () => {}
    },
    {
      emoji: "😂",
      title: "Haan, mujhe pata hi tha.",
      subtitle: `100% certified ${targetName} hai tu. Report aa chuki hai.`,
      buttonText: "Chup kar 😡",
      action: nextStep
    },
    {
      emoji: "🏆",
      title: "Isiliye...",
      subtitle: `Tujhe officially milti hai 'Biggest ${targetName} of the Year' ki trophy ✨`,
      buttonText: "Acha... toh? 🙄",
      action: nextStep
    },
    {
      emoji: "🥟",
      title: "Tera Grand Prize:",
      subtitle: `Iss weekend mere saath ${rewardName} khane chalegi. (Chalna hi padega, option nahi hai)`,
      buttonText: "", // Final evasive phase
      action: () => {}
    }
  ];

  return (
    <div className="layout">
      {/* Floating Animated Shapes */}
      <div className="floating-shapes">
        {FLOATING_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            style={{
              position: 'absolute',
              left: item.left,
              bottom: -120,
              width: item.size,
              height: item.size,
              color: item.color,
            }}
            animate={{
              y: [-120, -window.innerHeight - 150],
              x: item.xPath,
              rotate: [0, 360],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "linear",
            }}
          >
            {item.type === 'momo' && <MomoSVG />}
            {item.type === 'heart' && <HeartSVG />}
            {item.type === 'sparkle' && <SparkleSVG />}
          </motion.div>
        ))}
      </div>

      {/* Top Header Utilities */}
      <header className="header-bar animate-fade">
        <div className="logo-text" onClick={() => { if (soundSynth.current) soundSynth.current.playTap(); setStep(0); }}>
          <Heart className="w-6 h-6 fill-current animate-pulse" />
          {targetName} 2.0
        </div>
        <div className="controls-row">
          <button className="icon-btn" onClick={toggleMute} aria-label="Toggle sound">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Central Interactive Panel */}
      <AnimatePresence mode="popLayout">
        {step < 6 && (
          <motion.main
            key={step}
            initial={{ opacity: 0, scale: 0.88, rotate: -2, y: 15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, rotate: 2, y: -15 }}
            transition={{ type: "spring", damping: 20, stiffness: 220 }}
            className="content-wrapper"
          >
            {/* Visual Emoji Header */}
            <div className="emoji-bubble-container">
              <div className="emoji-glow-ring" />
              <div className="emoji-header">
                {screens[step].emoji}
              </div>
            </div>

            {/* Display Text & Detail descriptions */}
            <h1 className="display-text">{screens[step].title}</h1>
            <p className="subtitle-text">{screens[step].subtitle}</p>

            {/* Step Content Conditional Triggers */}
            {step !== 2 && step !== 3 && step !== 5 && (
              <button className="action-btn" onClick={screens[step].action}>
                {screens[step].buttonText}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Step 2: Custom Interactive Range Slider Security Check */}
            {step === 2 && (
              <div className="slider-container">
                <span className="slider-value-badge">{getSliderBadgeText()}</span>
                
                <div className="custom-slider-track">
                  <div className="custom-slider-fill" style={{ width: `${sliderValue}%` }} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="custom-slider-input"
                  />
                </div>

                <AnimatePresence>
                  {sliderValue === 100 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      style={{ width: '100%' }}
                    >
                      <motion.div 
                        className={`checkbox-container ${isBhonduChecked ? 'checked' : ''}`}
                        onClick={handleCheckboxClick}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="custom-checkbox-box">
                          {isBhonduChecked && (
                            <svg width="18" height="18" viewBox="0 0 18 18">
                              <motion.path
                                d="M3 9.5L6.5 13L15 4.5"
                                fill="none"
                                strokeWidth="3.5"
                                stroke="#fff"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                              />
                            </svg>
                          )}
                        </div>
                        <span className="checkbox-label">
                          {targetName === 'Bhondu' 
                            ? "Main kabool karti hu ki main Bhondu hu. 🤚" 
                            : `Haan, main officially kabool karti hu ki main sabse badi ${targetName} hu. 🤚`}
                        </span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {sliderValue === 100 && isBhonduChecked && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="action-btn"
                      style={{ marginTop: '1.2rem' }}
                      onClick={nextStep}
                    >
                      Security Check Clear 🔒
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Step 3: Diagnostic Report Certificate Reveal */}
            {step === 3 && (
              <div style={{ width: '100%' }}>
                <motion.div 
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 14 }}
                  className="cert-report-sheet"
                >
                  <div className="cert-stamp">Verified</div>
                  <div className="cert-title">Diagnostic Test Credentials</div>
                  <div className="cert-field">
                    <span className="field-label">Subject Nickname</span>
                    <span className="field-value">{targetName}</span>
                  </div>
                  <div className="cert-field">
                    <span className="field-label">Measured Silly Index</span>
                    <span className="field-value" style={{ color: 'var(--accent-pink)' }}>100% / 100%</span>
                  </div>
                  <div className="cert-field">
                    <span className="field-label">Cognitive Response</span>
                    <span className="field-value">Extremely Goofy 🤪</span>
                  </div>
                  <div className="cert-field">
                    <span className="field-label">Affectionate Food Reward</span>
                    <span className="field-value">{rewardName} Lover 🥟</span>
                  </div>
                  <div className="cert-field" style={{ borderBottom: 'none' }}>
                    <span className="field-label">Issued Authorized By</span>
                    <span className="field-value">{senderName}</span>
                  </div>
                </motion.div>

                <button className="action-btn" onClick={nextStep}>
                  {screens[step].buttonText}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 5: Final Evading Decision Row */}
            {step === 5 && (
              <div className="actions-row" ref={baseLayoutRef}>
                <motion.button 
                  className="action-btn" 
                  onClick={celebrate}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {customConfirmText}
                </motion.button>

                <motion.div
                  className="no-button-wrapper-physics"
                  animate={{ x: noPos.x, y: noPos.y, rotate: noRotate }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  style={{ display: 'inline-block' }}
                >
                  <button
                    className="btn-secondary"
                    onMouseEnter={handleEvade}
                    onTouchStart={handleEvade}
                  >
                    {customEvadeText}
                  </button>
                </motion.div>
              </div>
            )}
          </motion.main>
        )}

        {/* Step 6: Master Conversion Success & Ticket details */}
        {step === 6 && (
          <motion.main
            key="success"
            initial={{ opacity: 0, scale: 0.7, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 140 }}
            className="content-wrapper"
            style={{ maxWidth: '540px' }}
          >
            <div className="emoji-header" style={{ fontSize: "5rem" }}>
              🤝🥳
            </div>
            
            <h1 className="display-text" style={{ fontSize: "2.8rem" }}>
              Deal Done!
            </h1>
            <p 
              className="subtitle-text" 
              style={{ color: "var(--accent-pink)", fontWeight: "800", fontSize: "1.3rem", marginBottom: '1.8rem' }}
            >
              {rewardName === 'Momos' 
                ? "Ready rehna. I'll pick you up! Ab Momos time! 🥟✨" 
                : `Ready rehna. I'll pick you up! Ab ${rewardName} time! ✨`}
            </p>

            {/* Premium Date ticket */}
            <div className="ticket-wrapper">
              <motion.div 
                className="momo-ticket"
                whileHover={{ rotateY: 10, rotateX: -5 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
              >
                <div className="ticket-cutout-left" />
                <div className="ticket-cutout-right" />
                <div className="ticket-header-pill">Weekend Entry Pass</div>
                <div className="ticket-date-title">{rewardName} Pass</div>
                <div className="ticket-sub">Special coordination for {targetName}</div>
                
                <div className="ticket-details">
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ticket Holder</div>
                    <div style={{ fontWeight: '900', fontSize: '1rem' }}>{targetName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Host</div>
                    <div style={{ fontWeight: '900', fontSize: '1rem' }}>{senderName}</div>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Schedule</div>
                    <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--accent-pink)' }}>This Weekend 💖</div>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pass Status</div>
                    <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--success-color)' }}>Confirmed ✔</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="signature-text" style={{ marginTop: '2.5rem' }}>— {senderName}</div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Dynamic Link Creator SaaS Form Drawer (Principal design constraint) */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <button 
              className="creator-expansion-trigger"
              onClick={() => { if (soundSynth.current) soundSynth.current.playTap(); setIsCreatorOpen(!isCreatorOpen); }}
            >
              <Sparkles className="w-4 h-4 fill-current" />
              {isCreatorOpen ? "Close Customizer Panel" : "Make your own dynamic proposal link!"}
            </button>

            {isCreatorOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="creator-form-panel"
              >
                <form onSubmit={handleGenerateLink}>
                  <div className="form-group">
                    <label className="form-label">Recipient Name / Nickname</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bhondu" 
                      className="form-input" 
                      value={creatorTarget}
                      onChange={(e) => setCreatorTarget(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Shivansh" 
                      className="form-input" 
                      value={creatorSender}
                      onChange={(e) => setCreatorSender(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Grand Prize Reward</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Momos, Biryani, Coffee" 
                      className="form-input" 
                      value={creatorReward}
                      onChange={(e) => setCreatorReward(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Evade Button text</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Nahi jana 🤢, No way!" 
                      className="form-input" 
                      value={creatorEvade}
                      onChange={(e) => setCreatorEvade(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="action-btn" style={{ width: '100%', justifyContent: 'center' }}>
                    Generate Link & Copy
                    <Copy className="w-5 h-5" />
                  </button>
                </form>

                {generatedLink && (
                  <div className="share-link-box">
                    <span className="share-link-text">{generatedLink}</span>
                    <span style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {isCopied ? <Check className="w-4 h-4" /> : null}
                      {isCopied ? "Copied!" : "Ready!"}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="footer-credit">
        Made with <Heart className="w-4 h-4 fill-current text-red-500 inline" /> by <span className="footer-name">{senderName}</span>
      </footer>
    </div>
  );
}
