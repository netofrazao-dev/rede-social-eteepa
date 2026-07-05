# Deploy — colocar a Rede Social EETEPA no ar

O projeto tem 3 partes. A ordem do deploy é:

**1) Banco → já está no ar (Supabase)** · **2) Backend → Render** · **3) Frontend → Vercel**

Tudo em planos **gratuitos**.

---

## 1. Backend no Render

1. Crie conta em **https://render.com** (entre com o GitHub).
2. **New +** → **Web Service** → conecte o repositório `rede-social-eteepa` e escolha a branch `fullstack-supabase`.
3. Preencha:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Em **Environment**, adicione as variáveis (as mesmas do seu `backend/.env` local):
   | Variável | Valor |
   |----------|-------|
   | `SUPABASE_URL` | a URL do seu projeto Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | a chave **service_role** (secreta) do Supabase |
   | `JWT_SECRET` | uma frase grande e aleatória |
   | `CORS_ORIGIN` | `*` (pode trocar depois pela URL do frontend) |
   | `BASE_URL` | a URL que o Render gerar (preencha após o 1º deploy) |

   > Não precisa definir `PORT` — o Render injeta sozinho.
5. **Create Web Service** e aguarde o build. Anote a URL gerada (ex: `https://eetepa-backend.onrender.com`).
6. Depois do deploy, volte em **Environment** e preencha `BASE_URL` com essa URL (isso corrige os links das imagens). Salve (redeploy automático).
7. Teste: abra `https://SUA-URL.onrender.com/` → deve responder `{"name":"Rede Social EETEPA - API","status":"online"}`.

> ⏱️ O plano grátis "dorme" após ~15 min sem uso. A primeira requisição depois acorda o serviço em ~30–60s. É normal.

---

## 2. Frontend no Vercel

1. Crie conta em **https://vercel.com** (entre com o GitHub).
2. **Add New → Project** → importe `rede-social-eteepa`, branch `fullstack-supabase`.
3. O Vercel detecta **Vite** sozinho. Confirme:
   - **Root Directory:** `./` (a raiz do repo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Em **Environment Variables**, adicione:
   | Variável | Valor |
   |----------|-------|
   | `VITE_API_URL` | `https://SUA-URL-DO-RENDER.onrender.com/api` |
5. **Deploy**. Vai gerar uma URL tipo `https://rede-social-eteepa.vercel.app`.

Pronto — abra essa URL e faça login (`teacher@eetepa.edu.br` / `123456`).

---

## 3. Ajuste opcional de segurança (CORS)

Depois que o frontend estiver no ar, você pode "fechar" o backend só para ele:
no Render, troque `CORS_ORIGIN` de `*` para a URL do Vercel (ex: `https://rede-social-eteepa.vercel.app`).

---

## Limitação conhecida: upload de imagens

No plano grátis do Render o disco é **temporário** — imagens/vídeos enviados somem quando o serviço reinicia ou "dorme". **Login, feed, curtidas e comentários funcionam normalmente.** Para tornar as imagens permanentes, o upload precisa ir para o **Supabase Storage** (fica como melhoria futura).

---

## Alternativas
- **Frontend:** Netlify ou Cloudflare Pages funcionam igual ao Vercel (mesmas configs: build `npm run build`, saída `dist`, env `VITE_API_URL`).
- **Backend:** Railway ou Fly.io no lugar do Render (mesma ideia: root `backend`, start `npm start`, mesmas variáveis).
