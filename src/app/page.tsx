"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import NextEvent from "@/app/components/NextEvent"; // 👈 import
import { EventList } from "@/app/components/EventList";
import type { Event } from "@/app/lib/scrapeLabola";
import { use, useEffect, useState, useRef } from "react";
import { SoccerBallRain } from "./components/SoccerBallRain";
import { supabase } from "@/app/lib/supabaseClient";

// -------------------------------パーティクル用----------------------------
const NUM_PARTICLES = 20;
type Particle = {
  id: number;
  size: number;
  x: number;
  y: number;
  rotate: number;
  duration: number;
};

type Ball = {
  id: number;
  size: number;
  x: number;
  y: number;
};

// -------------------------------パーティクル用----------------------------
function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Particle() {
  const size = random(10, 30);
  const top = random(0, 100);
  const left = random(0, 100);
  const animX = random(-50, 50);
  const animY = random(-50, 50);
  const duration = random(3, 8);

  return (
    <motion.div
      className="absolute bg-white rounded-full"
      style={{ width: size, height: size, top: `${top}%`, left: `${left}%` }}
      animate={{ x: [0, animX, 0], y: [0, animY, 0], opacity: [0.5, 1, 0.5] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  );
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [balls, setBalls] = useState<Particle[]>([]);
  const goalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(true); // ← ローディング用の state

  const shootBall = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const newBall: Particle = {
      id: Date.now(),
      size: 40,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      rotate: 0, // 初期回転
      duration: 1, // アニメーションの時間（秒）
    };
    setBalls((prev) => [...prev, newBall]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch("/api/nextEvent");
        const data = await res.json();
        setEvents(data.events);
      } catch (err) {
        console.error(err);
      } finally {
        // 1秒は必ずローディングを表示
        const elapsed = Date.now() - startTime;
        const minDuration = 1000; // ms
        const remaining = Math.max(minDuration - elapsed, 0);
        setTimeout(() => setLoading(false), remaining);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="absolute inset-0 flex flex-col items-center justify-center text-white"
    >
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left max-w-[700px] leading-[1.1]">
            Welcome to Olyble FC Home!
          </h1>
          {/* ここに呼び出す */}
          <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5">
              オリブルFCの次のイベント
            </h2>
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <motion.img
                  src="/soccerball.jpg"
                  alt="ロード中ボール"
                  className="w-16 h-16 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <p className="text-gray-600">予定を取得中…</p>
              </div>
            ) : (
              <EventList events={events} />
            )}
          </div>
          <a href="https://labola.jp/r/shop/3274/calendar_week/">
            <p className="text-center sm:text-left text-lg sm:text-xl max-w-[700px] leading-6 sm:leading-7 underline hover:no-underline">
              フットサルコート予約カレンダーはこちら。
            </p>
          </a>
          <iframe
            src="https://labola.jp/r/shop/3274/calendar_week/"
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="auto"
            title="フットサル予約カレンダー"
          />
          {/* <iframe
          src="https://park-kameoka.jp/yoyaku/day?id=11"
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="auto"
          title="テニス予約カレンダー"
        /> */}
          <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
            <li className="mb-2 tracking-[-.01em]">
              ⚽ Olyble Football Club ⚽
              <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded"></code>
            </li>
            <li className="tracking-[-.01em]">
              We definitely love football and welcome everyone who loves
              football.
            </li>
          </ol>

          <div className="flex items-center gap-30 justify-end mt-10 w-full max-w-md mx-auto">
            <button
              ref={buttonRef} // ← ここ大事
              className="
                px-6 py-3 
                bg-white dark:bg-gray-800 
                text-black dark:text-white 
                border-2 border-black dark:border-white 
                rounded-full 
                hover:bg-gray-200 dark:hover:bg-gray-700 
                transition
                shadow-md"
              onClick={shootBall}
            >
              ⚽ サッカーボール発射！
            </button>

            {/* ゴール */}
            <div ref={goalRef} className="w-24 h-24">
              <img
                src="/soccer_goal.png"
                className="w-full h-full object-contain"
                alt="ゴール"
              />
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-gray-300">
          <a href="#" className="flex items-center gap-2 hover:underline">
            ⚽ Join Our Matches
          </a>
          <a href="#" className="flex items-center gap-2 hover:underline">
            📅 Event Calendar
          </a>
          <a href="#" className="flex items-center gap-2 hover:underline">
            🏆 Club Achievements
          </a>
          <p>Olyble Football Club © {new Date().getFullYear()}</p>
        </footer>
      </div>
      {/* ボールのアニメーション */}
      {balls.map((b) => {
        if (!buttonRef.current || !goalRef.current) return null;

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const goalRect = goalRef.current.getBoundingClientRect();

        const startX = buttonRect.left + buttonRect.width / 2 + window.scrollX;
        const startY = buttonRect.top + buttonRect.height / 2 + window.scrollY;
        const deltaX =
          goalRect.left + goalRect.width / 2 + window.scrollX - startX;
        const deltaY =
          goalRect.top + goalRect.height / 2 + window.scrollY - startY;

        return (
          <motion.div
            key={b.id}
            className="absolute w-10 h-10 rounded-full overflow-hidden"
            style={{ top: startY, left: startX }}
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{ x: deltaX, y: deltaY, rotate: 720, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img src="/soccerball.jpg" className="w-full h-full object-cover" />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
