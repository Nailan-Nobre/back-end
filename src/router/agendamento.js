import express from 'express';
import {
  criarAgendamento,
  aceitarAgendamento,
  recusarAgendamento,
  cancelarAgendamento,
  listarAgendamentosCliente,
  listarAgendamentosManicure,
} from '../middlewares/controllers/agendamentoController.js';
import { verificarPermissao } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Cliente cria agendamento
router.post('/agendamento', verificarPermissao('CLIENTE'), criarAgendamento);

// Cliente vê seus agendamentos
router.get('/cliente', verificarPermissao('CLIENTE'), listarAgendamentosCliente);

// Manicure vê seus agendamentos
router.get('/manicure', verificarPermissao('MANICURE'), listarAgendamentosManicure);

// Manicure aceita agendamento
router.patch('/:id/aceitar', verificarPermissao('MANICURE'), aceitarAgendamento);

// Manicure recusa agendamento
router.patch('/:id/recusar', verificarPermissao('MANICURE'), recusarAgendamento);

// Cliente cancela agendamento
router.patch('/:id/cancelar', verificarPermissao('CLIENTE'), cancelarAgendamento);

export default router;