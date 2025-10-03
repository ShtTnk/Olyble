import { supabase } from "@/app/lib/supabaseClient";

export async function GET() {
  // DBからphotosを取得
  const { data: photos, error } = await supabase
    .from("photos")
    .select("file_path");

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  // Storageの公開URLを作る
  const urls = photos.map(photo => 
    supabase.storage.from("album").getPublicUrl(photo.file_path).data.publicUrl
  );

  return new Response(JSON.stringify({ images: urls }), { status: 200 });
}
