# 🃏 Planning Poker — Frontend

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-8-purple?logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-black?logo=socket.io" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" />
</p>

<p align="center">
  Interface web em tempo real para sessões de <strong>Planning Poker</strong>
</p>

---

## 🎥 Demo

<p align="center">
  <img src="./.github/demo.gif" alt="Demo da aplicação" width="100%" />
</p>

---

## 🧠 Sobre

Aplicação frontend para sessões de Planning Poker em tempo real.

Usuários podem criar ou entrar em salas compartilhadas, votar de forma privada e revelar resultados simultaneamente, com sincronização instantânea entre todos os participantes.

---

## ⚙️ Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Socket.IO Client

---

## 🔌 Realtime

Comunicação via WebSocket utilizando Socket.IO.

Principais eventos:

- `create_room`
- `room_created`
- `join_room`
- `vote`
- `reveal_votes`
- `reset_round`
- `room_update`

---

## 🧩 Funcionalidades

### 🏠 Home

- Criar nova sala
- Entrar em sala existente
- Navegação via link compartilhável

### 🃏 Sala

- Participantes em tempo real
- Votação com cartas (1, 2, 3, 5, 8, 13, 21, ?)
- Indicação de quem já votou
- Revelação simultânea
- Controle de rodadas

### 🎯 Experiência

- Interface fluida e responsiva
- Atualizações em tempo real
- Feedback visual imediato
- Compartilhamento rápido de sala

---

## 📁 Estrutura

```
src/
├── pages/
│   ├── Home.tsx
│   └── Room.tsx
├── components/
├── socket.ts
├── App.tsx
└── main.tsx
```

---

## 🔧 Setup

### Clone

```bash
git clone https://github.com/seu-usuario/planning-poker-frontend.git
cd planning-poker-frontend
```

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie `.env`:

```
VITE_BACKEND_URL=http://localhost:3000
```

### Rodar

```bash
npm run dev
```

---

## 🔗 Backend

👉 https://github.com/seu-usuario/planning-poker-backend

---

## 👨‍💻 Autor

Gabriel Carreira

---

## 📄 Licença

MIT