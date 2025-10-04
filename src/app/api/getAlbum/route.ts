// src/app/api/getAlbum/route.ts
import { supabase } from "@/app/lib/supabaseClient";

export async function GET() {
  const { data: files, error } = await supabase.storage.from("photos").list();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // .emptyFolderPlaceholder は除外
  const urls = files
    .filter(file => file.name !== ".emptyFolderPlaceholder")
    .map(file => {
      const { publicUrl } = supabase.storage.from("photos").getPublicUrl(file.name).data;
      return publicUrl;
    });

  return new Response(JSON.stringify({ images: urls }), { status: 200 });
}