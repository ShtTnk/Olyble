import { supabase } from "@/app/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.storage
    .from("album")
    .list("", { limit: 100, offset: 0 });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  // 公開URL取得
  const urls = data.map((file) =>
    supabase.storage.from("album").getPublicUrl(file.name).data.publicUrl
  );

  return new Response(JSON.stringify({ images: urls }), { status: 200 });
}
