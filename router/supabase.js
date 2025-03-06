import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Criação do cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function uploadImagem(imagemBase64, nomeArquivo) {
    try {
        // Remover o prefixo "data:image/png;base64," se ele existir
        if (imagemBase64.startsWith("data:image")) {
            imagemBase64 = imagemBase64.split(",")[1];
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

        // Gerar nome único para a imagem
        const nomeUnico = `usuarios/${Date.now()}-${nomeArquivo}.${tipoImagem.split("/")[1]}`;
        console.log("Nome do arquivo para upload:", nomeUnico);

        if (error) {
            console.error("Erro ao enviar imagem para o Supabase:", error);
            throw new Error("Erro ao enviar imagem para o Supabase.");
        }

        console.log("Upload realizado com sucesso:", data);

        // Obter a URL pública da imagem
        const { publicURL } = supabase.storage.from("usuarios-imagens").getPublicUrl(nomeUnico);
        console.log("URL pública da imagem:", publicURL);

        return publicURL;
    } catch (error) {
        console.error("Erro na função uploadImagem:", error);
        throw error;
    }
}
