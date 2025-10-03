"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]); // アップロード前プレビュー
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]); // アップロード後プレビュー

  // ファイル選択時にプレビュー生成
  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return;
    }
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
    setSuccess(false);
    setUploadedUrls([]);
  };

  const handleUpload = async () => {
    if (!files.length) return alert("ファイルを選択してください！");
    setLoading(true);

    try {
      const uploaded: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "アップロード失敗");

        uploaded.push(data.publicUrl);
      }

      setSuccess(true);
      setUploadedUrls(uploaded);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        alert(err.message || "アップロード失敗しました");
      } else {
        console.error("Unknown error", err);
        alert("アップロード失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 gap-8"
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6">
        📤 写真アップロード
      </h1>

      <label className="flex flex-col items-center bg-gray-800 px-6 py-6 border-2 border-black dark:border-white rounded-2xl cursor-pointer hover:bg-gray-700 transition">
        <span className="text-lg">
          {files.length
            ? `${files.length} ファイル選択済み`
            : "ファイルを選択してください"}
        </span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* アップロード前プレビュー */}
      {previews.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex flex-wrap gap-4"
        >
          {previews.map((url, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="text-gray-400 text-sm">プレビュー {i + 1}</p>
              <img
                src={url}
                alt={`preview-${i}`}
                className="max-w-xs rounded-xl shadow-md"
              />
            </div>
          ))}
        </motion.div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-8 py-4 bg-white text-black dark:bg-gray-800 dark:text-white border-2 border-black dark:border-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-md"
      >
        {loading ? "アップロード中..." : "アップロード"}
      </button>

      {/* アップロード後プレビュー */}
      {success && uploadedUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex flex-wrap gap-4"
        >
          {uploadedUrls.map((url, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="text-green-400 font-bold text-sm">
                アップロード成功 {i + 1}
              </p>
              <img
                src={url}
                alt={`uploaded-${i}`}
                className="max-w-xs rounded-xl shadow-lg"
              />
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
