import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export default function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("room_created", ({ roomId }) => {
      navigate(`/room/${roomId}`, {
        state: { name }
      });
    });

    return () => {
      socket.off("room_created");
    };
  }, [name, navigate]);

  function handleCreateRoom() {
    if (!name.trim()) {
      alert("Digite seu nome");
      return;
    }

    socket.emit("create_room");
  }

  function handleJoinRoom() {
    if (!name.trim() || !roomId.trim()) {
      alert("Preencha nome e código da sala");
      return;
    }

    navigate(`/room/${roomId}`, {
      state: { name }
    });
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1f16 0%, #060c08 100%)' }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(52,211,153,0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(52,211,153,0.04)',
        }}
      >

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, #065f46, #047857)',
              boxShadow: '0 0 24px rgba(52,211,153,0.2)',
            }}
          >
            🃏
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Planning Poker
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(110,231,183,0.45)' }}>
            Estime suas tarefas em equipe
          </p>
        </div>

        {/* Nome */}
        <div className="mb-5">
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'rgba(110,231,183,0.5)' }}
          >
            Seu nome
          </label>
          <input
            placeholder="Ex: João Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(52,211,153,0.12)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.08)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(52,211,153,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Criar sala */}
        <button
          onClick={handleCreateRoom}
          className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(5,150,105,0.3)',
            border: '1px solid rgba(52,211,153,0.2)',
          }}
        >
          Criar sala
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>ou entre em uma sala</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Entrar na sala */}
        <div className="mb-4">
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'rgba(110,231,183,0.5)' }}
          >
            Código da sala
          </label>
          <input
            placeholder="Ex: abc-123"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(52,211,153,0.12)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.08)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(52,211,153,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        <button
          onClick={handleJoinRoom}
          className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(167,243,208,0.9)',
            border: '1px solid rgba(52,211,153,0.15)',
          }}
        >
          Entrar na sala
        </button>

      </div>
    </div>
  );
}