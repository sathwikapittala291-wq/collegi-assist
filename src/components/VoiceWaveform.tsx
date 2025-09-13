import { useEffect, useState } from "react";

interface VoiceWaveformProps {
  isActive: boolean;
  className?: string;
}

export const VoiceWaveform = ({ isActive, className = "" }: VoiceWaveformProps) => {
  const [bars, setBars] = useState<number[]>([4, 8, 12, 16, 12, 8, 4]);

  useEffect(() => {
    if (!isActive) {
      setBars([4, 8, 12, 16, 12, 8, 4]);
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 16) + 4));
    }, 150);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={`voice-waveform ${className}`}>
      {bars.map((height, index) => (
        <div
          key={index}
          className={`voice-bar ${isActive ? 'animate-pulse' : ''}`}
          style={{ 
            height: `${height}px`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};