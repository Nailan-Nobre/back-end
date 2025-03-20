// supabase.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function uploadImagem(buffer, nomeArquivo) {
    try {
        const nomeUnico = `usuarios/${Date.now()}-${nomeArquivo}`;

        const { data, error } = await supabase.storage
            .from("usuarios-imagens")
            .upload(nomeUnico, buffer, {
                contentType: "image/jpeg", // ou "image/png" — você pode ajustar dinamicamente se quiser
                upsert: true,
            });

        if (error) {
            console.error("Erro ao enviar imagem para o Supabase:", error);
            throw new Error("Erro ao enviar imagem para o Supabase.");
        }

        const { data: urlData } = supabase.storage
            .from("usuarios-imagens")
            .getPublicUrl(nomeUnico);

        return urlData.publicUrl;
    } catch (error) {
        console.error("Erro na função uploadImagem:", error);
        throw error;
    }
}
