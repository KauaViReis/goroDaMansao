import { initDB } from './database.js';

console.log('🚀 Iniciando migração do banco de dados...');

initDB()
  .then(() => {
    console.log('✅ Migração concluída com sucesso!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erro durante a migração:', err);
    process.exit(1);
  });
