const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// criar agendamento
async function criarAgendamento(req, res) {
  const { manicureId, dataHora } = req.body;
  const clienteId = req.user.id;

  try {
    const novoAgendamento = await prisma.agendamento.create({
      data: {
        clienteId,
        manicureId,
        dataHora: new Date(dataHora),
      },
    });
    res.status(201).json(novoAgendamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar agendamento.' });
  }
}

// aceitar agendamento
async function aceitarAgendamento(req, res) {
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
async function recusarAgendamento(req, res) {
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
async function cancelarAgendamento(req, res) {
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
async function listarAgendamentosCliente(req, res) {
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
async function listarAgendamentosManicure(req, res) {
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

module.exports = {
  criarAgendamento,
  aceitarAgendamento,
  recusarAgendamento,
  cancelarAgendamento,
  listarAgendamentosCliente,
  listarAgendamentosManicure,
};
