"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { EventList } from "@/app/components/EventList";
import type { Event } from "@/app/lib/scrapeLabola";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Particle = {
  id: number;
  size: number;
  x: number;
  y: number;
  rotate: number;
  duration: number;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [balls, setBalls] = useState<Particle[]>([]);
  const goalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(true);
  const [goalCount, setGoalCount] = useState(0);
  const rainbowColors = [
    "text-red-500",
    "text-orange-400",
    "text-yellow-300",
    "text-green-400",
    "text-blue-500",
    "text-indigo-500",
    "text-purple-500",
  ];
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  const shootBall = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const newBall: Particle = {
      id: Date.now(),
      size: 40,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      rotate: 0,
      duration: 1,
    };
    setBalls((prev) => [...prev, newBall]);
    setGoalCount((prev) => prev + 1);
  };

  // 予定取得
  useEffect(() => {
    const fetchData = async () => {
      const start = Date.now();
      try {
        const res = await fetch("/api/nextEvent");
        const data = await res.json();
        setEvents(data.events);
      } catch (err) {
        console.error(err);
      } finally {
        const elapsed = Date.now() - start;
        setTimeout(() => setLoading(false), Math.max(1500 - elapsed, 0));
      }
    };
    fetchData();
  }, []);

  // 画像取得
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/getAlbum");
        const data = await res.json();
        if (data.images) setImages(data.images);
      } catch (err) {
        console.error(err);
      }
    };
    fetchImages();
  }, []);

  // 画像スライドショー
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  const titleParts = ["We", "are", "Olyble FC!"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="w-full min-h-screen flex flex-col items-center justify-center text-white bg-black overflow-x-hidden"
    >
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen w-full p-4 sm:p-8 gap-8">
        <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-screen-md">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-3xl sm:text-5xl font-extrabold flex flex-wrap gap-2 sm:gap-3 mb-8 text-center">
            {titleParts.map((word, wordIndex) => (
              <motion.span
                key={wordIndex}
                className="flex"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: wordIndex * 0.4, duration: 0.6 }}
              >
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    className={
                      rainbowColors[
                        (wordIndex * 3 + charIndex) % rainbowColors.length
                      ]
                    }
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: wordIndex * 0.4 + charIndex * 0.05,
                      duration: 0.4,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </h1>

          <div className="w-full max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              オリブルFCの次のイベント
            </h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-white text-lg">⌛ 予定を取得中… ⌛</p>
                <div className="flex items-center gap-6 justify-center">
                  <motion.img
                    src="/soccerball.jpg"
                    alt="サッカーボール"
                    className="w-16 sm:w-24 h-16 sm:h-24 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                  <motion.img
                    src="/soccer_goal.png"
                    alt="サッカーゴール"
                    className="w-20 sm:w-32 h-20 sm:h-32 object-contain"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />
                </div>
              </div>
            ) : (
              <EventList events={events} />
            )}
          </div>

          <p className="text-white text-xl sm:text-2xl font-bold mb-4 text-center">
            ゴラッソカウンター: {goalCount}
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center items-center w-full max-w-md mx-auto">
            <button
              ref={buttonRef}
              onClick={shootBall}
              className="px-6 py-3 bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-md"
            >
              ⚽ Shoooooooooot！
            </button>
            <div ref={goalRef} className="w-20 sm:w-24 h-20 sm:h-24">
              <img
                src="/soccer_goal.png"
                className="w-full h-full object-contain"
                alt="ゴール"
              />
            </div>
          </div>

          <a
            href="https://labola.jp/r/shop/3274/calendar_week/"
            className="text-center sm:text-left text-lg sm:text-xl max-w-full leading-6 sm:leading-7 underline hover:no-underline mt-6 block"
          >
            フットサルコート予約カレンダーはこちら。
          </a>

          <iframe
            src="https://labola.jp/r/shop/3274/calendar_week/"
            width="100%"
            height="400"
            className="sm:h-[600px]"
            frameBorder="0"
            scrolling="auto"
            title="フットサル予約カレンダー"
          />

          <p className="text-center text-lg sm:text-xl text-yellow-300 mt-4">
            📸 オリブルFC所属選手 📸
          </p>

          <div className="relative w-full max-w-3xl h-[300px] sm:h-[400px] mx-auto overflow-hidden rounded-2xl shadow-lg">
            {images.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[current]}
                  src={images[current]}
                  alt="photo"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 2 }}
                  className="absolute w-full h-full object-cover"
                />
              </AnimatePresence>
            )}
          </div>

          <button
            onClick={() => router.push("/upload-page")}
            className="mt-4 px-6 py-3 bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-md"
          >
            写真アップロードページへ
          </button>
        </main>

        <footer className="row-start-3 flex flex-wrap gap-4 sm:gap-6 justify-center items-center text-gray-300 mt-8">
          <a href="#" className="hover:underline">⚽ Join Our Matches</a>
          <a href="#" className="hover:underline">📅 Event Calendar</a>
          <a href="#" className="hover:underline">🏆 Club Achievements</a>
          <p>Olyble Football Club © {new Date().getFullYear()}</p>
        </footer>
      </div>

      {/* ボールアニメーション */}
      {balls.map((b) => {
        if (!buttonRef.current || !goalRef.current) return null;
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const goalRect = goalRef.current.getBoundingClientRect();
        const startX = Math.min(
          buttonRect.left + buttonRect.width / 2 + window.scrollX,
          window.innerWidth - b.size
        );
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
            <img
              src="/soccerball.jpg"
              className="w-full h-full object-cover"
              alt="サッカーボール"
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
