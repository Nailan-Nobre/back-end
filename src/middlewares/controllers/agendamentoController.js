import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// criar agendamento
export async function criarAgendamento(req, res) {
  const { manicureId, dataHora, servico, observacoes } = req.body;
  const clienteId = req.user.id;

  if (!manicureId || !dataHora) {
    return res.status(400).json({ error: 'manicureId e dataHora são obrigatórios.' });
  }

  // Checa se dataHora é válida
  const dataHoraObj = new Date(dataHora);
  if (isNaN(dataHoraObj.getTime())) {
    return res.status(400).json({ error: 'dataHora inválida.' });
  }

  // Checa se o horário já está ocupado para a manicure
  const conflito = await prisma.agendamento.findFirst({
    where: {
      manicureId: Number(manicureId),
      dataHora: dataHoraObj,
      status: { notIn: ['CANCELADO', 'RECUSADO'] }
    }
  });
  if (conflito) {
    return res.status(409).json({ error: 'Horário já agendado para esta manicure.' });
  }

  try {
    const novoAgendamento = await prisma.agendamento.create({
      data: {
        clienteId,
        manicureId: Number(manicureId),
        dataHora: dataHoraObj,
        servico: servico || null,
        observacoes: observacoes || null,
        status: 'PENDENTE'
      },
    });
    res.status(201).json({ message: 'Solicitação enviada com sucesso!', agendamento: novoAgendamento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar agendamento.' });
  }
}

// aceitar agendamento
export async function aceitarAgendamento(req, res) {
  const { id } = req.params;

  try {
    const atualizado = await prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: { status: 'ACEITO' },
    });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aceitar agendamento.' });
  }
}

// recusar agendamento
export async function recusarAgendamento(req, res) {
  const { id } = req.params;

  try {
    const atualizado = await prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: { status: 'RECUSADO' },
    });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao recusar agendamento.' });
  }
}

// cancelar agendamento
export async function cancelarAgendamento(req, res) {
  const { id } = req.params;

  try {
    const atualizado = await prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: { status: 'CANCELADO' },
    });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cancelar agendamento.' });
  }
}

// listar agendamentos cliente
export async function listarAgendamentosCliente(req, res) {
  const clienteId = req.user.id;

  try {
    const agendamentos = await prisma.agendamento.findMany({
      where: { clienteId },
      include: { manicure: true },
    });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
}

// listar agendamentos manicure
export async function listarAgendamentosManicure(req, res) {
  const manicureId = req.user.id;

  try {
    const agendamentos = await prisma.agendamento.findMany({
      where: { manicureId },
      include: { cliente: true },
    });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
}