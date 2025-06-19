# Backend do Website do Tribunal

## Arquitetura

O backend foi desenvolvido em Flask com as seguintes características:

### Estrutura da Base de Dados

**Modelos principais:**
- **User**: Utilizadores do sistema (cidadãos, advogados, juízes, administradores)
- **Case**: Processos judiciais com informações completas
- **Hearing**: Audiências agendadas para os processos
- **Document**: Documentos associados aos processos
- **Form**: Formulários disponíveis para download

### API Endpoints

**Autenticação (`/api/auth/`):**
- `POST /register` - Registar novo utilizador
- `POST /login` - Autenticar utilizador
- `GET /profile` - Obter perfil do utilizador autenticado
- `PUT /profile` - Atualizar perfil do utilizador

**Processos (`/api/cases/`):**
- `GET /search` - Pesquisar processos com filtros
- `GET /<id>` - Obter detalhes de um processo
- `GET /types` - Obter tipos de processo disponíveis
- `GET /statuses` - Obter estados de processo disponíveis

**Audiências (`/api/hearings`):**
- `GET /` - Obter audiências agendadas com filtros

**Formulários (`/api/forms/`):**
- `GET /` - Obter lista de formulários por categoria
- `GET /categories` - Obter categorias de formulários
- `GET /<id>` - Obter detalhes de um formulário
- `GET /<id>/download` - Fazer download de um formulário

### Funcionalidades Implementadas

1. **Sistema de Autenticação JWT**
   - Registo e login de utilizadores
   - Diferentes níveis de acesso (cidadão, advogado, juiz, admin)
   - Tokens com expiração de 24 horas

2. **Pesquisa Avançada de Processos**
   - Filtros por número do processo, nome das partes, tipo, estado, datas
   - Paginação de resultados
   - Apenas processos públicos são visíveis

3. **Gestão de Formulários**
   - Categorização por tipo de processo
   - Sistema de pesquisa
   - Download de formulários em PDF

4. **Calendário de Audiências**
   - Consulta de audiências agendadas
   - Filtros por data e sala

5. **CORS Configurado**
   - Permite acesso do frontend
   - Configurado para aceitar qualquer origem durante desenvolvimento

### Dados de Exemplo

O sistema inclui dados de demonstração:
- 4 utilizadores com diferentes perfis
- 4 processos de diferentes tipos
- 3 audiências agendadas
- 6 formulários categorizados

### Segurança

- Passwords encriptadas com Werkzeug
- Tokens JWT para autenticação
- Validação de dados de entrada
- Controlo de acesso baseado em roles
- Apenas processos públicos são acessíveis sem autenticação

### Tecnologias Utilizadas

- **Flask**: Framework web
- **SQLAlchemy**: ORM para base de dados
- **SQLite**: Base de dados (facilmente substituível)
- **Flask-CORS**: Gestão de CORS
- **PyJWT**: Gestão de tokens JWT
- **Werkzeug**: Encriptação de passwords

### Próximos Passos

1. Implementar upload de documentos
2. Sistema de notificações
3. Integração com sistemas externos
4. Logs de auditoria
5. Backup automático da base de dados

