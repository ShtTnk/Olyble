"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { EventList } from "@/app/components/EventList";
import type { Event } from "@/app/lib/scrapeLabola";

const NUM_PARTICLES = 20;

// -------------------------------パーティクル用----------------------------
function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Particle() {
  const size = random(20, 40); // ボールの大きさ
  const top = random(0, 100);
  const left = random(0, 100);
  const animX = random(-50, 50);
  const animY = random(-50, 50);
  const duration = random(3, 8);

  return (
    <motion.div
      className="absolute"
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