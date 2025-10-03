import { supabase } from "@/app/lib/supabaseClient";

export async function POST(req: Request) {
  const file = await req.blob(); // fetchで送られたファイル
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

  // 1. Storageにアップロード
  const { data: storageData, error: storageError } = await supabase.storage
    .from("album")
    .upload(fileName, file);

  if (storageError) return new Response(JSON.stringify({ error: storageError.message }), { status: 500 });

  // 2. DBにレコード追加
  const { data: dbData, error: dbError } = await supabase
    .from("photos")
    .insert([{ file_path: fileName, title: fileName, timestamp: new Date().toISOString() }]);

  if (dbError) return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });

  // 3. 公開URL生成
  const publicUrl = supabase.storage.from("album").getPublicUrl(fileName).data.publicUrl;

  return new Response(JSON.stringify({ publicUrl }), { status: 200 });
}
