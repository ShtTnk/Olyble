// src/app/api/getAlbum/route.ts
import { supabaseServer } from "@/app/lib/supabaseServerClient";

export async function GET() {
  const { data: files, error } = await supabaseServer.storage.from("photos").list();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const urls = files
    .filter(file => !file.name.startsWith(".")) // .emptyFolderPlaceholder 除外
    .map(file => {
      const { data } = supabaseServer.storage.from("photos").getPublicUrl(file.name);
      return data.publicUrl;
    });

  return new Response(JSON.stringify({ images: urls }), { status: 200 });
}
