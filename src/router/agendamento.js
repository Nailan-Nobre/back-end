import express from 'express';
import agendamentoController from '../controllers/agendamentoController.js';
import { verificarPermissao } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Cliente cria agendamento
router.post(
  '/',
  verificarPermissao('CLIENTE'),
  agendamentoController.criarAgendamento
);

// Cliente vê seus agendamentos
router.get(
  '/cliente',
  verificarPermissao('CLIENTE'),
  agendamentoController.listarAgendamentosCliente
);

// Manicure vê seus agendamentos
router.get(
  '/manicure',
  verificarPermissao('MANICURE'),
  agendamentoController.listarAgendamentosManicure
);

// Manicure aceita agendamento
router.patch(
  '/:id/aceitar',
  verificarPermissao('MANICURE'),
  agendamentoController.aceitarAgendamento
);

// Manicure recusa agendamento
router.patch(
  '/:id/recusar',
  verificarPermissao('MANICURE'),
  agendamentoController.recusarAgendamento
);

// Cliente cancela agendamento
router.patch(
  '/:id/cancelar',
  verificarPermissao('CLIENTE'),
  agendamentoController.cancelarAgendamento
);

export default router;
