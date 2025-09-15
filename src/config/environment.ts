// Configuração do ambiente
export const ENV = {
// Para desenvolvimento local, descomente a linha abaixo e comente a produção
// BASE_URL: 'http://localhost:8080/api',
// Para produção (Railway)
BASE_URL: 'https://teste-back-soffia-production.up.railway.app/api',
// Configurações de debug
DEBUG: __DEV__,
// Timeout para requisições (em ms)
REQUEST_TIMEOUT: 10000,
// Configurações de retry
MAX_RETRIES: 3,
RETRY_DELAY: 1000,
};
// Função para verificar se está em desenvolvimento
export const isDevelopment = () => ENV.DEBUG;
// Função para obter a URL base
export const getBaseURL = () => ENV.BASE_URL;
