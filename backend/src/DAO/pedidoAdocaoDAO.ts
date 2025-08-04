import { PedidoAdocaoCompleto } from "../controllers/pedidoAdocaoController";
import database from "../database/databaseClient";
import { SolicitacaoAdocao } from "../models/solicitacaoAdocaoModel";

export class PedidoAdocaoDAO {
    async getAll(): Promise<PedidoAdocaoCompleto[]> {
    try {
        // 1. Buscar todas as solicitações com status "Pendente"
        const { data: solicitacoes, error } = await database
            .from('SOLICITACAO_ADOCAO')
            .select('*')
            .eq('status', 'Pendente'); // Removi .single() para pegar múltiplos registros
        
        if (error) {
            console.error("=== DAO - ERRO NO BANCO ===");
            console.error("Erro do banco:", error);
            throw new Error(error.message);
        }

        if (!solicitacoes || solicitacoes.length === 0) {
            console.log("=== DAO - NENHUMA SOLICITAÇÃO PENDENTE ENCONTRADA ===");
            return [];
        }

        // 2. Array para armazenar o resultado final
        const resultadoCompleto: PedidoAdocaoCompleto[] = [];

        // 3. Para cada solicitação, buscar dados do pet e do usuário
        for (const pedido of solicitacoes) {
            try {
                // Buscar dados do PET
                const { data: petData, error: petError } = await database
                    .from("PET")
                    .select("*")
                    .eq("id_pet", pedido.id_pet) // Assumindo que a coluna é id_pet
                    .single();

                if (petError) {
                    console.error(`Erro ao buscar pet ID ${pedido.id_pet}:`, petError);
                    continue; // Pula esta solicitação se não encontrar o pet
                }

                // Buscar dados do USUÁRIO
                const { data: usuarioData, error: usuarioError } = await database
                    .from("USUARIO")
                    .select("*")
                    .eq("id_usuario", pedido.id_usuario) // Assumindo que a coluna é id_usuario
                    .single();

                if (usuarioError) {
                    console.error(`Erro ao buscar usuário ID ${pedido.id_usuario}:`, usuarioError);
                    continue; // Pula esta solicitação se não encontrar o usuário
                }

                // 4. Montar o objeto seguindo a interface PedidoAdocaoCompleto
                const pedidoCompleto: PedidoAdocaoCompleto = {
                    idPedido: String(pedido.id || pedido.id_solicitacao),
                    dataSolicitacao: pedido.data_solicitacao || pedido.created_at || new Date().toISOString(),
                    status: pedido.status as "Pendente" | "Concluido",
                    resultado: pedido.resultado as "Aprovado" | "Reprovado" | null || null,
                    
                    adotante: {
                        idUsuario: String(usuarioData.id_usuario || usuarioData.id),
                        nomeCompleto: `${usuarioData.nome || ''} ${usuarioData.sobrenome || ''}`.trim(),
                        email: usuarioData.email || '',
                        telefone: usuarioData.telefone || '',
                        cpf: usuarioData.cpf || '',
                        enderecoCompleto: this.montarEnderecoCompleto(usuarioData) || null,
                        redeSocial: usuarioData.rede_social || usuarioData.redeSocial || null,
                        escolaridade: usuarioData.escolaridade || '',
                        possuiPet: usuarioData.possui_pet ?? usuarioData.possuiPet ?? null,
                    },
                    
                    animal: {
                        id_pet: String(petData.id_pet || petData.id),
                        nome: petData.nome || '',
                        raca: petData.raca || null,
                        especie: petData.especie || null,
                        sexo: petData.sexo || '',
                        idade: petData.idade ? Number(petData.idade) : null,
                        foto_url: petData.foto_url || petData.imagem || null,
                        localizacaoCompleta: this.montarLocalizacaoCompleta(petData),
                    },
                };

                resultadoCompleto.push(pedidoCompleto);

            } catch (itemError) {
                console.error(`Erro ao processar pedido ${pedido.id}:`, itemError);
                // Continue com o próximo pedido mesmo se este der erro
                continue;
            }
        }
        
        console.log("=== DAO - SOLICITAÇÕES CARREGADAS COM SUCESSO ===");
        console.log(`Total de solicitações processadas: ${resultadoCompleto.length}`);
        return resultadoCompleto;

    } catch (error) {
        console.error("=== DAO - ERRO CAPTURADO ===");
        console.error("Erro no DAO:", error);
        throw error;
    }
}

// Método auxiliar para montar endereço completo
private montarEnderecoCompleto(usuario: any): string | null {
    const endereco = [];
    
    if (usuario.logradouro) endereco.push(usuario.logradouro);
    if (usuario.numero) endereco.push(usuario.numero);
    if (usuario.complemento) endereco.push(`- ${usuario.complemento}`);
    if (usuario.bairro) endereco.push(`- ${usuario.bairro}`);
    if (usuario.cidade) endereco.push(usuario.cidade);
    if (usuario.estado) endereco.push(`- ${usuario.estado}`);
    
    return endereco.length > 0 ? endereco.join(', ') : null;
}

// Método auxiliar para montar localização completa do pet
private montarLocalizacaoCompleta(pet: any): string {
    const localizacao = [];
    
    if (pet.logradouro) localizacao.push(pet.logradouro);
    if (pet.numero) localizacao.push(pet.numero);
    if (pet.complemento) localizacao.push(`- ${pet.complemento}`);
    if (pet.bairro) localizacao.push(`- ${pet.bairro}`);
    if (pet.cidade) localizacao.push(pet.cidade);
    if (pet.estado) localizacao.push(`- ${pet.estado}`);
    if (pet.cep) localizacao.push(`CEP: ${pet.cep}`);
    
    return localizacao.length > 0 ? localizacao.join(', ') : 'Localização não informada';
    }

    async aprovarPedidoAdocao(pedido: SolicitacaoAdocao): Promise<void> {
    try {
        // 1. Inserir registro na tabela PET_ADOTADO
        const { data: petAdotadoData, error: petAdotadoError } = await database
            .from('PET_ADOTADO')
            .insert({
                id_pet: pedido.id_pet,
                id_usuario: pedido.id_usuario            
            })
            .select() // Remove .single() se não for necessário retornar dados
            .single(); // Para obter o registro inserido

        if (petAdotadoError) {
            console.error("=== DAO - ERRO NO BANCO (PET_ADOTADO) ===");
            console.error("Erro ao inserir pet adotado:", petAdotadoError);
            throw new Error(`Erro ao registrar adoção: ${petAdotadoError.message}`);
        }

        // 2. Atualizar status da solicitação de adoção
        const { data: solicitacaoData, error: solicitacaoError } = await database
            .from('SOLICITACAO_ADOCAO')
            .update({ 
                status: 'Finalizado', 
                resultado: 'Aprovado',
                id_administrador: pedido.id_administrador,
            })
            .eq('id', pedido.id)
            .select() // Para verificar se a atualização foi bem-sucedida
            .single();

        if (solicitacaoError) {
            console.error("=== DAO - ERRO NO BANCO (SOLICITACAO_ADOCAO) ===");
            console.error("Erro ao aprovar pedido:", solicitacaoError);
            
            // ROLLBACK: Tentar remover o registro de PET_ADOTADO se falhou
            try {
                await database
                    .from('PET_ADOTADO')
                    .delete()
                    .eq('id_pet', pedido.id_pet)
                    .eq('id_usuario', pedido.id_usuario);
                console.log("Rollback realizado: removido registro de PET_ADOTADO");
            } catch (rollbackError) {
                console.error("Erro no rollback:", rollbackError);
            }
            
            throw new Error(`Erro ao aprovar pedido: ${solicitacaoError.message}`);
        }

        console.log("=== DAO - PEDIDO APROVADO COM SUCESSO ===");
        console.log(`Pedido de adoção ID ${pedido.id} aprovado com sucesso!`);
        console.log("Dados do pet adotado:", petAdotadoData);
        console.log("Dados da solicitação atualizada:", solicitacaoData);

    } catch (error: any) {
        console.error("=== DAO - ERRO CAPTURADO ===");
        console.error("Erro ao aprovar pedido de adoção:", error);
        throw error;
    }
}

    async rejeitarPedidoAdocao(pedido: SolicitacaoAdocao): Promise<void> {
        try {
            const { data, error } = await database
                .from('SOLICITACAO_ADOCAO')
                .update({ status: 'Finalizado', resultado: 'Reprovado', id_administrador: pedido.id_administrador })
                .eq('id', pedido.id);

            if (error) {
                console.error("Erro ao rejeitar pedido:", error);
                throw new Error(error.message);
            }

            console.log(`Pedido de adoção ID ${pedido.id} reprovado com sucesso!`);
        } catch (error) {
            console.error("Erro ao rejeitar pedido de adoção:", error);
            throw error;

        } 
        console.log("=== DAO - PEDIDO Reprovado COM SUCESSO ===");
        console.log(`Pedido de adoção ID ${pedido.id} reprovado com sucesso!`); 
        
    }
} 