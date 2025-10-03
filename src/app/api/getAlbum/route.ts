// src/app/api/getAlbum/route.ts
import { supabase } from "@/app/lib/supabaseClient";

export async function GET() {
  // photosバケットからファイル一覧を取得
  const { data: files, error } = await supabase.storage.from("photos").list();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // 公開 URL を生成
const urls = files.map(file => {
  const { data } = supabase.storage.from("photos").getPublicUrl(file.name);
  return data.publicUrl;
});

  return new Response(JSON.stringify({ images: urls }), { status: 200 });
}