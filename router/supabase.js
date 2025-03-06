import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function uploadImagem(imagemBase64, nomeArquivo) {
    const nomeUnico = `usuarios/${Date.now()}-${nomeArquivo}.png`;

    const { data, error } = await supabase.storage
        .from("usuarios-imagens") 
        .upload(nomeUnico, Buffer.from(imagemBase64, "base64"), { contentType: "image/png" });

    if (error) {
        throw new Error("Erro ao enviar imagem para o Supabase.");
    }

    const { publicURL } = supabase.storage.from("usuarios-imagens").getPublicUrl(nomeUnico);
    return publicURL;
}
