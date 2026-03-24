import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './index.css';

export default function App() {
  const [step, setStep] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isBhonduChecked, setIsBhonduChecked] = useState(false);

  // Safe bounded evasive movement state
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  // Playful floating background shapes
  const shapes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    left: (Math.random() * 100) + "%",
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  const handleEvade = (e: any) => {
    // If it's a touch event, prevent it from triggering a click
    if (e.cancelable) e.preventDefault();

    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let targetAbsX = Math.random() * (viewportW - rect.width - 40) + 20;
    let targetAbsY = Math.random() * (viewportH - rect.height - 40) + 20;

    let attempts = 0;
    while (
      Math.hypot(targetAbsX - rect.left, targetAbsY - rect.top) < 150 &&
      attempts < 10
    ) {
      targetAbsX = Math.random() * (viewportW - rect.width - 40) + 20;
      targetAbsY = Math.random() * (viewportH - rect.height - 40) + 20;
      attempts++;
    }

    const staticOriginX = rect.left - noPos.x;
    const staticOriginY = rect.top - noPos.y;

    const newTranslateX = targetAbsX - staticOriginX;
    const newTranslateY = targetAbsY - staticOriginY;

    setNoPos({ x: newTranslateX, y: newTranslateY });
  };

  const celebrate = () => {
    setStep(6);
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 40, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'],
      });
    }, 250);
  };

  const screens = [
    {
      emoji: "👋",
      title: "Oye Bhondu...",
      subtitle: "",
      buttonText: "Kisko bola? 🤨",
      action: () => setStep(1),
    },
    {
      emoji: "🤔",
      title: "Mera dimaag khaate khaate tujhe itna time ho gaya hai...",
      subtitle: "Toh maine socha teri iss mehnat ko finally reward kar hi doon.",
      buttonText: "Kaisa reward? 🤔",
      action: () => setStep(2),
    },
    {
      emoji: "🔐",
      title: "Par pehle, ek security check.",
      subtitle: "Prove kar ki tu kitni badi Bhondu hai.",
      buttonText: "", // Slider Mini-game
      action: () => { },
    },
    {
      emoji: "😂",
      title: "Haan, mujhe pata hi tha.",
      subtitle: "100% certified Bhondu hai tu. Report aa chuki hai.",
      buttonText: "Chup kar 😡",
      action: () => setStep(4),
    },
    {
      emoji: "🏆",
      title: "Isiliye...",
      subtitle: "Tujhe officially milti hai 'Biggest Bhondu of the Year' ki trophy ✨",
      buttonText: "Acha... toh? 🙄",
      action: () => setStep(5),
    },
    {
      emoji: "🥟",
      title: "Tera Grand Prize:",
      subtitle: "Iss weekend mere saath Momos khane chalegi. (Chalna hi padega, option nahi hai)",
      buttonText: "", // Final Yes/No Phase
      action: () => { },
    },
  ];

  return (
    <div className="layout">
      {/* Background Shapes */}
      <div className="floating-shapes">
        {shapes.map((s) => (
          <motion.div
            key={s.id}
            className="shape"
            style={{ width: s.size, height: s.size, left: s.left, bottom: -200 }}
            animate={{ y: [0, -window.innerHeight - 300], rotate: [0, 180] }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {step < 6 && (
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="content-wrapper"
          >
            <div className="emoji-header">{screens[step].emoji}</div>
            <h1 className="display-text">{screens[step].title}</h1>
            <p className="subtitle-text">{screens[step].subtitle}</p>

            {/* Standard Next Buttons */}
            {step !== 2 && step !== 5 && (
              <button className="action-btn" onClick={screens[step].action}>
                {screens[step].buttonText}
              </button>
            )}

            {/* Step 2: Slider + Checkbox Mini-Game */}
            {step === 2 && (
              <div className="slider-container">
                <p className="slider-label">Slider ko 100% bhondu level tak drag kar:</p>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    className="bhondu-slider"
                  />
                  <div
                    className="slider-progress"
                    style={{ width: sliderValue + "%" }}
                  ></div>
                </div>
                <p className="slider-value" style={{ marginBottom: "1rem" }}>
                  Dimag: {100 - sliderValue}% | Bhondu: {sliderValue}%
                </p>

                <AnimatePresence>
                  {sliderValue === 100 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="checkbox-wrapper"
                      style={{
                        background: 'rgba(255, 10, 84, 0.1)',
                        padding: '1rem',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '0.5rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => setIsBhonduChecked(!isBhonduChecked)}
                    >
                      <input
                        type="checkbox"
                        checked={isBhonduChecked}
                        readOnly
                        style={{ width: '24px', height: '24px', accentColor: '#ff0a54' }}
                      />
                      <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ff0a54' }}>
                        Main kabool karti hu ki main Bhondu hu. 🤚
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {sliderValue === 100 && isBhonduChecked && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="action-btn"
                      style={{ marginTop: "1.5rem", background: "#ff0a54", color: "white" }}
                      onClick={() => setStep(3)}
                    >
                      Confirm Kar Diya 🔒
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Step 5: The Prize & Proposal */}
            {step === 5 && (
              <div className="actions-row">
                <button className="btn-primary" onClick={celebrate}>
                  Chal done 💖
                </button>

                {/* Evasion Button with Bounded Math */}
                <motion.div
                  className="no-button-wrapper-physics"
                  animate={{ x: noPos.x, y: noPos.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <button
                    className="btn-secondary"
                    onMouseEnter={handleEvade}
                    onTouchStart={handleEvade}
                  >
                    Nahi jana 🤢
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 6: Success */}
        {step === 6 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 150 }}
            className="content-wrapper"
          >
            <div className="emoji-header" style={{ fontSize: "5rem" }}>
              🤝🥳
            </div>
            <h1 className="display-text" style={{ fontSize: "2.5rem" }}>
              Deal Done!
            </h1>
            <p
              className="subtitle-text"
              style={{ color: "#ff0a54", fontWeight: "bold" }}
            >
              Ready rehna. I'll pick you up! Ab Momos time! 🥟✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
