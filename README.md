# 📱 Teste Frontend Soffia

Um aplicativo React Native completo para gerenciamento de posts, com sistema de autenticação, favoritos e busca. Desenvolvido com foco em performance e experiência do usuário.

## 🚀 Tecnologias Utilizadas

### **Core Framework**
- **React Native** - Framework principal para desenvolvimento mobile multiplataforma
- **TypeScript** - Tipagem estática para maior segurança e produtividade no desenvolvimento
- **Expo** - Plataforma que facilita o desenvolvimento e deploy de apps React Native

### **Gerenciamento de Estado**
- **Redux Toolkit** - Gerenciamento global de estado da aplicação
- **Context API** - Para estados específicos como autenticação e favoritos
- **AsyncStorage** - Persistência local de dados (tokens, favoritos, etc.)

### **Navegação**
- **React Navigation** - Sistema de navegação entre telas com stack e tab navigators
- **TypeScript Navigation** - Tipagem completa para navegação

### **Estilização**
- **Styled Components** - CSS-in-JS para componentes estilizados
- **Design System** - Constantes centralizadas para cores, espaçamentos e tipografia

### **HTTP & API**
- **Axios** - Cliente HTTP para comunicação com a API
- **Interceptors** - Para tratamento automático de tokens e erros

### **Utilitários**
- **React Hooks** - Hooks customizados para lógica reutilizável
- **Form Validation** - Validação de formulários com feedback visual
- **Debounce** - Para otimizar buscas e evitar requisições desnecessárias

## 🏗️ Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── AuthLoading.tsx  # Loading específico para autenticação
│   ├── CustomButton.tsx # Botão customizado com variantes
│   ├── CustomInput.tsx  # Input com validação integrada
│   ├── PostCard.tsx     # Card de post com ações
│   └── styled.ts        # Componentes styled-components
├── config/              # Configurações da aplicação
│   └── environment.ts   # URLs e configurações de ambiente
├── context/             # Contextos React
│   └── AuthContext.tsx  # Contexto global de autenticação
├── hooks/               # Hooks customizados
│   ├── useAuth.ts       # Hook para autenticação
│   ├── useForm.ts       # Hook para gerenciamento de formulários
│   ├── usePosts.ts      # Hook para gerenciamento de posts
│   └── useFavorites.ts  # Hook para favoritos
├── navigation/          # Configuração de navegação
│   └── AppNavigator.tsx # Navegador principal
├── screens/             # Telas da aplicação
│   ├── AuthScreen.tsx   # Login/Registro
│   ├── HomeScreen.tsx   # Feed principal
│   ├── CreatePostScreen.tsx # Criação de posts
│   ├── FavoritesScreen.tsx # Posts favoritos
│   └── ProfileScreen.tsx   # Perfil do usuário
├── services/            # Serviços externos
│   └── api.ts           # Cliente HTTP e endpoints
├── store/               # Redux store
│   └── slices.ts        # Redux slices
├── types/               # Definições TypeScript
│   └── index.ts         # Tipos globais da aplicação
└── utils/               # Funções utilitárias
    └── index.ts         # Helpers e validações
```

## 🎯 Funcionalidades Principais

### **Sistema de Autenticação**
- Login e registro de usuários
- Persistência de sessão com AsyncStorage
- Validação automática de tokens
- Logout seguro com limpeza de dados

### **Gerenciamento de Posts**
- Criação de posts com título, conteúdo e tags
- Listagem ordenada por data (mais novos primeiro)
- Sistema de favoritos local
- Busca com debounce para performance

### **Interface do Usuário**
- Design responsivo e moderno
- Loading states em todas as operações
- Feedback visual para ações do usuário
- Navegação intuitiva entre telas

## 🔧 Configuração e Instalação

### **Pré-requisitos**
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Dispositivo móvel com Expo Go ou emulador

### **Instalação**
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/teste-frontt-soffia.git
cd teste-frontt-soffia

# Instale as dependências
npm install

# Inicie o projeto
npm start
```

### **Configuração de Ambiente**
O arquivo `src/config/environment.ts` contém as configurações da API:

```typescript
export const ENV = {
  // Para desenvolvimento local
  // BASE_URL: 'http://localhost:8080/api',
  
  // Para produção (Railway)
  BASE_URL: 'https://teste-back-soffia-production.up.railway.app/api',
  
  DEBUG: __DEV__,
  REQUEST_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

## 🎨 Design System

### **Cores**
```typescript
export const COLORS = {
  primary: '#007AFF',      // Azul iOS
  secondary: '#5856D6',    // Roxo
  success: '#34C759',       // Verde
  warning: '#FF9500',      // Laranja
  error: '#FF3B30',        // Vermelho
  background: '#F2F2F7',   // Fundo claro
  surface: '#FFFFFF',      // Superfícies
  text: '#000000',         // Texto principal
  textSecondary: '#8E8E93', // Texto secundário
};
```

### **Espaçamentos**
```typescript
export const SPACING = {
  xs: 4,   // Muito pequeno
  sm: 8,   // Pequeno
  md: 16,  // Médio
  lg: 24,  // Grande
  xl: 32,  // Muito grande
  xxl: 48, // Extra grande
};
```

## 🔐 Segurança

### **Autenticação**
- Tokens JWT armazenados de forma segura no AsyncStorage
- Validação automática de tokens em cada requisição
- Logout automático em caso de token inválido
- Interceptors para renovação automática de tokens

### **Validação de Dados**
- Validação de email com regex
- Validação de senha com comprimento mínimo
- Sanitização de inputs do usuário
- Tratamento de erros da API

## 📱 Performance

### **Otimizações Implementadas**
- **Debounce na busca** - Evita requisições desnecessárias
- **Lazy loading** - Carregamento sob demanda de componentes
- **Memoização** - Uso de useMemo e useCallback onde necessário
- **Paginação** - Carregamento incremental de posts
- **Cache local** - AsyncStorage para dados offline

### **Monitoramento**
- Logs detalhados para debug
- Verificação de conectividade
- Retry automático em caso de falha de rede
- Estados de loading em todas as operações

## 🧪 Hooks Customizados

### **useAuth**
```typescript
const { user, isAuthenticated, login, register, logout } = useAuth();
```
Gerencia todo o ciclo de vida da autenticação.

### **useForm**
```typescript
const { values, errors, setValue, isValid } = useForm({
  email: '',
  password: ''
});
```
Facilita o gerenciamento de formulários com validação.

### **usePosts**
```typescript
const { posts, loadPosts, createPost, isLoading } = usePosts();
```
Gerencia a lista de posts com ordenação automática.

### **useFavorites**
```typescript
const { favorites, toggleFavorite, isFavorite } = useFavorites();
```
Sistema de favoritos com persistência local.

## 🔄 Fluxo de Dados

1. **Autenticação**: Context API → AsyncStorage → API
2. **Posts**: Redux Store → API → Componentes
3. **Favoritos**: Local State → AsyncStorage → UI
4. **Navegação**: React Navigation → TypeScript Types

## 🚀 Deploy

### **Desenvolvimento**
```bash
npm start
```

### **Build para Produção**
```bash
# Android
expo build:android

# iOS
expo build:ios
```

### **Deploy no EAS**
```bash
# Configurar EAS
eas build:configure

# Build para produção
eas build --platform all
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por [Seu Nome]

---

**Nota**: Este projeto foi desenvolvido como teste técnico, demonstrando conhecimento em React Native, TypeScript, Redux e boas práticas de desenvolvimento mobile.