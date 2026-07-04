# Backend — Rede Social EETEPA-Breves

API em **Node.js + Express** para a rede social da escola. Cuida de login,
publicações, curtidas e upload de fotos/vídeos.

Feito para encaixar direto no frontend em React que a equipe já montou.

## Tecnologias

- **Express** — servidor web / rotas
- **JWT** (`jsonwebtoken`) — autenticação por token
- **bcryptjs** — senhas guardadas com hash (nunca em texto puro)
- **multer** — upload de imagens e vídeos
- **Supabase (Postgres)** — banco de dados na nuvem. O backend fala com ele
  usando a `service_role key`; o frontend nunca acessa o banco direto.

## Configurar o Supabase (faça isso ANTES de rodar)

É rápido (uns 5 minutos) e só precisa ser feito uma vez:

1. Crie uma conta em **https://supabase.com** e clique em **New Project**.
   Dê um nome (ex: `rede-social-eetepa`), defina uma senha de banco e escolha a
   região mais próxima. Aguarde ~2 min o projeto ficar pronto.

2. **Crie as tabelas:** no menu lateral abra **SQL Editor** → **New query**,
   cole TODO o conteúdo do arquivo [`supabase/schema.sql`](supabase/schema.sql)
   e clique em **Run**.

3. **Pegue as 2 chaves** em **Project Settings**:
   - **Data API → Project URL** → vai em `SUPABASE_URL`
   - **API Keys → `service_role` (secret)** → vai em `SUPABASE_SERVICE_ROLE_KEY`

4. Cole as duas no seu arquivo `.env` (veja abaixo).

> ⚠️ A `service_role key` é uma senha mestra do banco. Nunca coloque no
> frontend, nem suba pro GitHub. O `.env` já está no `.gitignore`.

## Como rodar

```bash
# 1. entrar na pasta
cd "rede-social-eetepa-backend"

# 2. instalar as dependências
npm install

# 3. criar o arquivo de configuração e preencher as chaves do Supabase
copy .env.example .env      # Windows  (Linux/Mac: cp .env.example .env)
#   -> abra o .env e preencha SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY

# 4. popular o banco com os dados de exemplo (usuários + posts)
npm run seed

# 5. subir o servidor
npm run dev
```

O servidor sobe em `http://localhost:4000`. Se conectar certo, aparece
`🟢 Conectado ao Supabase com sucesso.`

> `npm run dev` reinicia sozinho quando você salva um arquivo.
> `npm start` roda em modo normal.
> `npm run seed` **zera e recria** os dados de exemplo no Supabase.

## Contas de teste

Todas usam a senha **`123456`**:

| E-mail                     | Papel     | Pode postar? |
|----------------------------|-----------|--------------|
| `admin@eetepa.edu.br`      | admin     | ✅           |
| `teacher@eetepa.edu.br`    | teacher   | ✅           |
| `leader@eetepa.edu.br`     | leader    | ✅           |
| `student@eetepa.edu.br`    | student   | ❌ (só vê e curte) |

## Endpoints (contrato da API)

Base: `http://localhost:4000/api`

| Método | Rota                | Precisa login? | O que faz                                  |
|--------|---------------------|----------------|--------------------------------------------|
| POST   | `/auth/login`       | não            | Faz login, devolve `{ token, user }`       |
| GET    | `/auth/me`          | sim            | Dados do usuário logado                    |
| GET    | `/posts`            | sim            | Lista o feed                               |
| GET    | `/posts/mine`       | sim            | Lista os posts do usuário logado (perfil)  |
| POST   | `/posts`            | sim + papel¹   | Cria publicação (aceita foto/vídeo)        |
| POST   | `/posts/:id/like`   | sim            | Curte / descurte um post                   |
| DELETE | `/posts/:id`        | sim²           | Exclui um post                             |

¹ Só `admin`, `teacher` e `leader`. Alunos recebem **403**.
² Só o autor do post ou um `admin`.

Para rotas que exigem login, envie o cabeçalho:
`Authorization: Bearer SEU_TOKEN`

### Exemplo de resposta de um post

```json
{
  "id": "abc-123",
  "name": "Prof. Marcos Silva",
  "roleLabel": "Prof. de Informática",
  "role": "teacher",
  "date": "Hoje, 10:30",
  "content": "Prova prática na sexta!",
  "category": "Aviso",
  "mediaUrl": "http://localhost:4000/uploads/171-xyz.jpg",
  "mediaType": "image",
  "likes": 3,
  "liked": false
}
```

## Como conectar no frontend (React)

O frontend hoje usa dados falsos (mock). Para ligar nesta API, são 3 ajustes:

1. **Criar `.env` no frontend** com a URL da API:
   ```
   VITE_API_URL=http://localhost:4000/api
   ```

2. **No `AuthContext.jsx`**, trocar o `login` para chamar a API de verdade e
   guardar o token:
   ```js
   import api from '../services/api';

   const login = async (email, password) => {
     const { data } = await api.post('/auth/login', { email, password });
     localStorage.setItem('token', data.token);        // usado pelo api.js
     localStorage.setItem('eetepa_user', JSON.stringify(data.user));
     setUser(data.user);
     return data.user;
   };
   ```
   (o `services/api.js` já envia esse token automaticamente em toda requisição)

3. **Nas telas Home / CreatePost / Profile**, trocar o `localStorage` de posts
   por chamadas: `api.get('/posts')`, `api.post('/posts', formData)`,
   `api.post('/posts/${id}/like')` e `api.get('/posts/mine')`.

   Para enviar foto/vídeo use `FormData` (campos: `content`, `category`, `media`).

## Estrutura de pastas

```
supabase/
└── schema.sql             SQL para criar as tabelas (rode no Supabase)
src/
├── server.js              confere a conexão com o Supabase e sobe o servidor
├── app.js                 configura o Express e as rotas
├── config.js              lê o .env
├── db/
│   ├── supabase.js        cria o cliente do Supabase
│   ├── repo.js            consultas ao banco (users, posts, likes)
│   └── seed.js            zera e recria os dados de exemplo
├── middleware/
│   ├── auth.js            valida token e checa papéis
│   ├── upload.js          recebe fotos/vídeos (multer)
│   └── errorHandler.js    trata erros
├── controllers/           regras de cada rota (auth, posts)
├── routes/                define as URLs
└── utils/present.js       formata a resposta no jeito que o React espera
```

> **Frontend:** já está conectado a esta API (a seção acima documenta o que foi
> feito). Como o banco mudou para o Supabase mas o **contrato da API continuou
> igual**, o frontend não precisou de nenhuma alteração nesta migração.
