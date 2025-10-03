// アップロードフォームのコンポーネント フォーム作る（React/Next.js ページ）
"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    // 1. Storage にアップロード
    const { data, error: storageError } = await fetch("/api/upload", {
      method: "POST",
      body: file
    }).then(res => res.json());

    if (storageError) {
      alert(storageError);
      setLoading(false);
      return;
    }

    alert("アップロード成功！ URL: " + data.publicUrl);
    setLoading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "アップロード中..." : "アップロード"}
      </button>
    </div>
  );
}