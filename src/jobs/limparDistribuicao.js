const cron = require('node-cron');
const DistribuicaoNotasService = require('../services/DistribuicaoNotasService');

function iniciarJobLimpezaDistribuicao() {
  cron.schedule('59 23 * * 0', async () => {
    console.log('[JOB] Iniciando limpeza semanal da distribuição de notas');
    try {
      await DistribuicaoNotasService.limparTodas();
      console.log('[JOB] Limpeza concluída com sucesso');
    } catch (error) {
      console.error('[JOB] Erro ao limpar distribuição:', error);
    }
  }, {
    timezone: 'America/Sao_Paulo'
  });
  
  console.log('[JOB] Agendamento de limpeza configurado para domingo às 23:59');
}

module.exports = { iniciarJobLimpezaDistribuicao };
