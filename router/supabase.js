import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Criação do cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function uploadImagem(imagemBase64, nomeArquivo) {
    try {
        // Remover o prefixo "data:image/png;base64," se ele existir
        if (imagemBase64.startsWith("data:image")) {
            imagemBase64 = imagemBase64.split(",")[1]; // Remove o prefixo base64
        }

        // Detecta o tipo da imagem baseado no prefixo
        let tipoImagem = "image/png"; // Valor default (caso não consiga identificar)

        if (imagemBase64.startsWith("data:image/jpeg")) {
            tipoImagem = "image/jpeg";
        } else if (imagemBase64.startsWith("data:image/jpg")) {
            tipoImagem = "image/jpg";
        } else if (imagemBase64.startsWith("data:image/webp")) {
            tipoImagem = "image/webp";
        } else if (imagemBase64.startsWith("data:image/bmp")) {
            tipoImagem = "image/bmp";
        } else if (imagemBase64.startsWith("data:image/svg+xml")) {
            tipoImagem = "image/svg+xml";
        }

        // Gerar um nome único para o arquivo, usando a data atual
        const nomeUnico = `usuarios/${Date.now()}-${nomeArquivo}`;

        // Realiza o upload da imagem para o Supabase
        const { data, error } = await supabase.storage
            .from("usuarios-imagens") // Nome do bucket
            .upload(nomeUnico, Buffer.from(imagemBase64, "base64"), { contentType: tipoImagem });

        if (error) {
            console.error("Erro ao enviar imagem para o Supabase:", error);
            throw new Error("Erro ao enviar imagem para o Supabase.");
        }

        // Recupera a URL pública da imagem
        const { publicURL } = supabase.storage.from("usuarios-imagens").getPublicUrl(nomeUnico);
        return publicURL; // Retorna a URL pública da imagem
    } catch (error) {
        console.error("Erro na função uploadImagem:", error);
        throw error;
    }
}