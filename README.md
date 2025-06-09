# Taskly - Gerenciador de Tarefas

**Credenciais para teste:**
- Email: caio@caio.com
- Senha: 12345678

Aplicativo de gerenciamento de tarefas com autenticação por Firebase e armazenamento no Firestore.

## 🔐 Autenticação

Todas as rotas precisam de autenticação via Firebase. Adicione este header:

```
Authorization: Bearer <token>
```

### Rotas Principais:

**POST /auth/login**  
Faz login com email e senha:  
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**GET /profile**  
Retorna dados do usuário logado.

**GET /tasks**  
Lista todas tarefas do usuário.

**POST /tasks**  
Cria nova tarefa:  
```json
{
  "title": "Tarefa exemplo",
  "deadline": "15/04/2025",
  "priority": 2
}
```

**PUT /tasks/:id**  
Atualiza uma tarefa existente.

**DELETE /tasks/:id**  
Remove uma tarefa.

## 🛠️ Tecnologias

- React Native (App)
- Node.js + Express (API)
- Firebase Authentication
- Firestore (Banco de dados)
- TypeScript

Desafio proposto por: **Gabriel Santos**, implementado por **Caio Passos**
