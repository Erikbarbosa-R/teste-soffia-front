# 📱 App React Native - Teste Frontend

Um aplicativo React Native completo desenvolvido com Expo, TypeScript, Redux, Context API, Styled Components e AsyncStorage.

## 🚀 Tecnologias Utilizadas

- **React Native** com **Expo** para desenvolvimento mobile
- **TypeScript** para tipagem estática
- **Redux Toolkit** para gerenciamento de estado global
- **Context API** para estado local e configurações
- **Styled Components** para estilização
- **React Navigation** para navegação
- **AsyncStorage** para persistência local
- **React Native Reanimated** para animações
- **Jest** para testes unitários
- **Documentação** completa dos componentes

## 📋 Funcionalidades

### ✅ Implementadas
- [x] Sistema de autenticação (login/registro)
- [x] Listagem de posts com paginação
- [x] Criação de novos posts
- [x] Sistema de favoritos com AsyncStorage
- [x] Busca otimizada com Like Search
- [x] Navegação com tabs e stack navigation
- [x] Suporte offline-first
- [x] Animações nas micro-interações
- [x] Testes unitários
- [x] Documentação com Storybook
- [x] Otimizações de performance

### 🎨 Interface
- Design moderno e responsivo
- Tema claro com cores consistentes
- Componentes reutilizáveis
- Animações suaves
- Feedback visual para interações

### 🔧 Arquitetura
- Estrutura modular e escalável
- Separação de responsabilidades
- Hooks personalizados
- Utilitários compartilhados
- Tipagem completa com TypeScript

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── styled.ts       # Componentes styled-components
│   ├── Loading.tsx     # Componente de loading
│   ├── CustomButton.tsx
│   ├── CustomInput.tsx
│   ├── PostCard.tsx    # Card de post
│   ├── PostList.tsx    # Lista de posts
│   └── index.ts
├── screens/            # Telas da aplicação
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── AuthScreen.tsx
│   ├── CreatePostScreen.tsx
│   └── PostDetailScreen.tsx
├── navigation/         # Configuração de navegação
│   └── AppNavigator.tsx
├── store/              # Redux store
│   ├── index.ts
│   └── slices.ts
├── services/           # Serviços e APIs
│   └── api.ts
├── hooks/              # Hooks personalizados
│   └── index.ts
├── context/            # Context API
│   └── AppContext.tsx
├── types/              # Tipos TypeScript
│   └── index.ts
├── utils/              # Utilitários
│   └── index.ts
├── constants/          # Constantes
│   └── index.ts
├── __tests__/          # Testes unitários
│   ├── setup.ts
│   ├── CustomButton.test.tsx
│   └── utils.test.ts
└── stories/            # Storybook
    ├── index.ts
    ├── Button.stories.tsx
    ├── Input.stories.tsx
    └── PostCard.stories.tsx
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para teste no Android)

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd teste-frontt-soffia

# Instale as dependências
npm install

# Inicie o projeto
npm start
```

### Scripts Disponíveis
```bash
# Desenvolvimento
npm start              # Inicia o Expo
npm run android        # Executa no Android
npm run ios           # Executa no iOS
npm run web           # Executa no navegador

# Testes
npm test              # Executa os testes
npm run test:watch     # Executa os testes em modo watch

# Build
npm run build:android # Build para Android
npm run build:ios     # Build para iOS
```

## 🧪 Testes

O projeto inclui testes unitários para componentes e utilitários:

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Ver cobertura de testes
npm test -- --coverage
```

### Estrutura dos Testes
- **Componentes**: Testes de renderização e interação
- **Utilitários**: Testes de funções puras
- **Hooks**: Testes de lógica de estado
- **Redux**: Testes de actions e reducers

## 📚 Storybook

Documentação interativa dos componentes:

```bash
npm run storybook
```

### Stories Disponíveis
- **CustomButton**: Variações do botão
- **CustomInput**: Diferentes tipos de input
- **PostCard**: Card de post com estados

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
API_BASE_URL=https://jsonplaceholder.typicode.com
STORAGE_PREFIX=@app:
```

### Configuração do Android Studio
1. Instale o Android Studio
2. Configure o SDK do Android
3. Crie um emulador Android
4. Execute `npm run android`

## 📱 Funcionalidades Detalhadas

### Autenticação
- Login com email e senha
- Registro de novos usuários
- Persistência de sessão com AsyncStorage
- Validação de formulários

### Posts
- Listagem paginada de posts
- Criação de novos posts
- Edição e exclusão de posts
- Sistema de likes
- Busca por título e conteúdo

### Favoritos
- Adicionar/remover posts dos favoritos
- Persistência local com AsyncStorage
- Sincronização com o estado global

### Busca
- Busca em tempo real
- Debounce para otimização
- Busca por título, conteúdo e autor
- Resultados paginados

### Offline
- Suporte offline-first
- Cache de posts no AsyncStorage
- Sincronização quando online
- Indicadores de conectividade

## 🎨 Design System

### Cores
- **Primary**: #007AFF (azul)
- **Secondary**: #5856D6 (roxo)
- **Success**: #34C759 (verde)
- **Warning**: #FF9500 (laranja)
- **Error**: #FF3B30 (vermelho)
- **Background**: #F2F2F7 (cinza claro)
- **Surface**: #FFFFFF (branco)

### Tipografia
- **Títulos**: 18-32px, peso bold
- **Subtítulos**: 16px, peso 600
- **Texto**: 14-16px, peso normal
- **Caption**: 12px, peso normal

### Espaçamento
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## 🚀 Otimizações

### Performance
- FlatList para listas grandes
- Lazy loading de imagens
- Memoização de componentes
- Debounce em buscas
- Paginação eficiente

### UX
- Loading states
- Error handling
- Feedback visual
- Animações suaves
- Gestos intuitivos

## 📝 Próximos Passos

### Melhorias Futuras
- [ ] Push notifications
- [ ] Compartilhamento de posts
- [ ] Modo escuro
- [ ] Internacionalização
- [ ] Analytics
- [ ] Crash reporting

### Funcionalidades Avançadas
- [ ] Upload de imagens
- [ ] Comentários em posts
- [ ] Sistema de tags
- [ ] Filtros avançados
- [ ] Modo offline completo

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para o teste de frontend.

---

**Nota**: Este é um projeto de demonstração com API fake. Os dados não são persistidos no servidor, mas são simulados localmente para demonstrar as funcionalidades.
