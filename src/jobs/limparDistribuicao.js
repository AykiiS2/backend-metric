const cron = require('node-cron');
const distribuicaoNotasService = require('../services/DistribuicaoNotasService');

function iniciarJobLimpezaDistribuicao() {
  cron.schedule('59 23 * * 0', async () => {
    console.log('Iniciando limpeza da tabela distribuicao_notas...');
    try {
      await distribuicaoNotasService.limparTodas();
      console.log('Limpeza concluída com sucesso!');
    } catch (error) {
      console.error('Erro na limpeza:', error);
    }
  });
  
  console.log('Job de limpeza da distribuição de notas agendado para domingo 23:59');
}

module.exports = { iniciarJobLimpezaDistribuicao };