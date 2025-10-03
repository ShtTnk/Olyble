import { supabase } from "@/app/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const userId = uuidv4(); // 仮ユーザーID

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) return new Response(JSON.stringify({ error: "ファイルが選択されてません" }), { status: 400 });

        // ユニークファイル名
        const fileName = `${Date.now()}-${file.name}`;

        const bucketName = "photos"; // Storage バケット名
        // ArrayBuffer を使う
        const arrayBuffer = await file.arrayBuffer();

        // Storage アップロード
        const { error: storageError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, arrayBuffer, {
                contentType: file.type || "image/jpeg",
                upsert: false,
                duplex: "half",
            });

        // 公開URL取得
        const publicUrl = supabase.storage.from(bucketName).getPublicUrl(fileName).data.publicUrl;

        if (storageError) return new Response(JSON.stringify({ error: storageError.message }), { status: 500 });

        // DB に登録
        const { error: dbError } = await supabase
            .from("photos")
            .insert([{
                title: file.name,
                file_path: fileName,       // Storage にアップしたパス
                event_id: null,            // 必要なら event_id
                uploaded_by: userId,      // 例：ユーザーIDとか
                uploaded_at: new Date().toISOString() // ← ここが timestamp の代わり
            }]);

        if (dbError) return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });

        return new Response(JSON.stringify({ publicUrl }), { status: 200 });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "サーバーエラー" }), { status: 500 });
    }
}