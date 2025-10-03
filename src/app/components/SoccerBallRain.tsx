// src/app/components/SoccerBallRain.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NUM_PARTICLES = 20;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface ParticleProps {
  key: number;
}

function Particle({ key }: ParticleProps) {
  const [size] = useState(() => random(20, 40));
  const [top] = useState(() => random(0, 100));
  const [left] = useState(() => random(0, 100));
  const [animX] = useState(() => random(-50, 50));
  const [animY] = useState(() => random(-50, 50));
  const [duration] = useState(() => random(3, 8));

  return (
    <motion.div
      key={key}
      className="absolute bg-white rounded-full"
      style={{
        width: size,
        height: size,
        top: `${top}%`,
        left: `${left}%`,
        backgroundImage: "url('/soccer-ball.png')",
        backgroundSize: "cover",
      }}
      animate={{ x: [0, animX, 0], y: [0, animY, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
  );
}

export function SoccerBallRain() {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: NUM_PARTICLES }, (_, i) => i));
  }, []);

  return (
    <div className="absolute w-full h-full pointer-events-none overflow-hidden">
      {particles.map((i) => (
        <Particle key={i} />
      ))}
    </div>
  );
}
