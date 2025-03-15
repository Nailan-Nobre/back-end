export async function gerarUrlPresigned(nomeArquivo) {
    try {
        const nomeUnico = `usuarios/${Date.now()}-${nomeArquivo}`;
        
        // Gera URL presigned para upload
        const { data, error } = await supabase.storage
            .from("usuarios-imagens")
            .createSignedUrl(nomeUnico, 60); // URL válida por 60 segundos

        if (error) {
            console.error("Erro ao criar URL presigned:", error);
            throw new Error("Erro ao criar URL presigned.");
        }

        return data.signedUrl; // Retorna a URL presigned
    } catch (error) {
        console.error("Erro ao gerar URL presigned:", error);
        throw error;
    }
}