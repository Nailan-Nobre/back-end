export async function uploadImagem(imagemBase64, nomeArquivo) {
    try {
        // Detectar tipo da imagem pelo prefixo
        let tipoImagem = "image/png"; // Default
        const prefixoRegex = /^data:(image\/[a-zA-Z+]+);base64,/;
        const match = imagemBase64.match(prefixoRegex);

        if (match) {
            tipoImagem = match[1];
            imagemBase64 = imagemBase64.replace(prefixoRegex, ""); // Remove prefixo
        }

        // Gerar nome único
        const nomeUnico = `usuarios/${Date.now()}-${nomeArquivo}`;

        // Upload da imagem para o Supabase
        const { data, error } = await supabase.storage
            .from("usuarios-imagens") // Nome do bucket
            .upload(nomeUnico, Buffer.from(imagemBase64, "base64"), {
                contentType: tipoImagem,
                upsert: true, // Substitui se já existir
            });

        console.log("Dados retornados do Supabase:", data);  // Adicione este log para inspecionar a resposta

        if (error) {
            console.error("Erro ao enviar imagem para o Supabase:", error);
            throw new Error("Erro ao enviar imagem para o Supabase.");
        }

        // Recupera URL pública
        const { data: urlData } = supabase.storage
            .from("usuarios-imagens")
            .getPublicUrl(nomeUnico);

        return urlData.publicUrl;
    } catch (error) {
        console.error("Erro na função uploadImagem:", error);
        throw error;
    }
}