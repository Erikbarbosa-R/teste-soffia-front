import Toast from 'react-native-toast-message';

export interface ToastConfig {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  position?: 'top' | 'bottom';
}

export const showToast = (config: ToastConfig) => {
  const {
    type,
    title,
    message,
    duration = 4000,
    position = 'top'
  } = config;

  Toast.show({
    type,
    text1: title,
    text2: message,
    position,
    visibilityTime: duration,
    autoHide: true,
    topOffset: position === 'top' ? 60 : undefined,
    bottomOffset: position === 'bottom' ? 60 : undefined,
  });
};

// Funções específicas para diferentes tipos de erro
export const showSuccessToast = (title: string, message: string) => {
  showToast({
    type: 'success',
    title,
    message,
    duration: 3000,
  });
};

export const showErrorToast = (title: string, message: string) => {
  showToast({
    type: 'error',
    title,
    message,
    duration: 5000,
  });
};

export const showInfoToast = (title: string, message: string) => {
  showToast({
    type: 'info',
    title,
    message,
    duration: 4000,
  });
};

export const showWarningToast = (title: string, message: string) => {
  showToast({
    type: 'warning',
    title,
    message,
    duration: 4000,
  });
};

// Funções específicas para diferentes cenários
export const showApiErrorToast = (error: any) => {
  let title = 'Erro na API';
  let message = 'Ocorreu um erro inesperado';

  if (error?.response?.status === 401) {
    title = 'Não autorizado';
    message = 'Sua sessão expirou. Faça login novamente.';
  } else if (error?.response?.status === 403) {
    title = 'Acesso negado';
    message = 'Você não tem permissão para esta ação.';
  } else if (error?.response?.status === 404) {
    title = 'Não encontrado';
    message = 'O recurso solicitado não foi encontrado.';
  } else if (error?.response?.status === 409) {
    title = 'Conflito';
    message = 'Já existe um recurso com essas informações.';
  } else if (error?.response?.status >= 500) {
    title = 'Erro do servidor';
    message = 'Problema temporário no servidor. Tente novamente.';
  } else if (error?.message) {
    message = error.message;
  }

  showErrorToast(title, message);
};

export const showValidationErrorToast = (errors: string[]) => {
  const message = errors.join('. ') + '.';
  showErrorToast('Campos obrigatórios', message);
};

export const showNetworkErrorToast = () => {
  showErrorToast(
    'Erro de conexão',
    'Verifique sua internet e tente novamente.'
  );
};

export const showAuthErrorToast = (isLogin: boolean) => {
  const action = isLogin ? 'login' : 'cadastro';
  showErrorToast(
    `Erro no ${action}`,
    'Verifique suas credenciais e tente novamente.'
  );
};

export const showPostUpdateSuccessToast = () => {
  showSuccessToast(
    'Post atualizado!',
    'Suas alterações foram salvas com sucesso.'
  );
};

export const showPostCreateSuccessToast = () => {
  showSuccessToast(
    'Post criado!',
    'Sua publicação foi criada com sucesso.'
  );
};

export const showTestResultToast = (success: boolean, testName: string) => {
  if (success) {
    showSuccessToast(
      'Teste bem-sucedido!',
      `${testName} funcionou corretamente.`
    );
  } else {
    showErrorToast(
      'Teste falhou',
      `${testName} não funcionou. Verifique os logs.`
    );
  }
};
