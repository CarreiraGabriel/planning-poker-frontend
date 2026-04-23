import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { socket } from "../socket";

type User = {
  id: string;
  name: string;
  hasVoted: boolean;
};

type RoomType = {
  users: User[];
  currentRound: {
    title: string;
    link?: string;
    votes: Record<string, number | string>;
    revealed: boolean;
  };
  history: any[];
};

const cards = [1, 2, 3, 5, 8, 13, 21, "?"];

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();

  const [name, setName] = useState<string>(location.state?.name ?? "");
  const [confirmedName, setConfirmedName] = useState<string>(location.state?.name ?? "");
  const [nameInput, setNameInput] = useState("");

  const [room, setRoom] = useState<RoomType | null>(null);
  const [roundTitle, setRoundTitle] = useState("");
  const [roundLink, setRoundLink] = useState("");
  const [copied, setCopied] = useState(false);

  function copyRoomLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleNewRound() {
    socket.emit("reset_round", {
      roomId,
      title: roundTitle.trim(),
      link: roundLink.trim(),
    });
    setRoundTitle("");
    setRoundLink("");
  }

  useEffect(() => {
    if (!roomId || !confirmedName) return;
    socket.emit("join_room", { roomId, userName: confirmedName });
    socket.on("room_update", (data) => { setRoom(data); });
    return () => { socket.off("room_update"); };
  }, [roomId, confirmedName]);

  if (!confirmedName) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "radial-gradient(ellipse at 50% 0%, #0d1f16 0%, #060c08 100%)" }}
      >
        <div
          className="w-full max-w-xs p-7 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(52,211,153,0.1)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div className="text-center mb-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mx-auto mb-3"
              style={{ background: "linear-gradient(135deg, #065f46, #047857)", boxShadow: "0 0 20px rgba(52,211,153,0.2)" }}
            >
              🃏
            </div>
            <h2 className="text-white font-bold text-lg tracking-tight">Entrar na sala</h2>
            <p className="text-xs mt-1" style={{ color: "rgba(110,231,183,0.45)" }}>
              Como você quer ser chamado?
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "rgba(110,231,183,0.5)" }}>
              Seu nome
            </label>
            <input
              autoFocus
              placeholder="Ex: João Silva"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nameInput.trim()) {
                  setName(nameInput.trim());
                  setConfirmedName(nameInput.trim());
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(52,211,153,0.12)" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          <button
            onClick={() => {
              if (!nameInput.trim()) return;
              setName(nameInput.trim());
              setConfirmedName(nameInput.trim());
            }}
            className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 active:scale-95"
            style={{ background: "linear-gradient(135deg, #059669, #047857)", color: "white", boxShadow: "0 4px 20px rgba(5,150,105,0.3)", border: "1px solid rgba(52,211,153,0.2)" }}
          >
            Entrar na sala
          </button>

          <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.15)" }}>
            Sala <span style={{ color: "rgba(110,231,183,0.4)", fontFamily: "monospace" }}>#{roomId}</span>
          </p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#060c08" }}>
        <div className="flex flex-col items-center gap-3" style={{ color: "rgba(110,231,183,0.6)" }}>
          <svg className="animate-spin h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-xs font-medium tracking-widest uppercase">Entrando na sala...</span>
        </div>
      </div>
    );
  }

  const myVote = room.currentRound.votes[socket.id!];

  return (
    <div
      className="h-screen overflow-hidden flex flex-col select-none"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #0d1f16 0%, #060c08 100%)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3 shrink-0"
        style={{ background: "rgba(255,255,255,0.025)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(52,211,153,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: "linear-gradient(135deg, #065f46, #047857)", boxShadow: "0 0 12px rgba(52,211,153,0.25)" }}
          >
            🃏
          </div>
          <span className="text-white font-bold text-base tracking-tight">Planning Poker</span>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-md"
            style={{ background: "rgba(52,211,153,0.08)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.15)" }}
          >
            #{roomId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyRoomLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 active:scale-95"
            style={copied
              ? { background: "rgba(52,211,153,0.15)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.3)" }
              : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.07)" }
            }
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copiado!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Convidar
              </>
            )}
          </button>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #059669, #047857)", color: "white" }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <span style={{ color: "#d1fae5" }}>{name}</span>
          </div>
        </div>
      </div>

      {/* Corpo: Mesa + Sidebar */}
      <div className="flex-1 min-h-0 flex overflow-hidden">

        {/* Coluna da Mesa */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

          {/* Mesa oval */}
          <div className="flex-1 min-h-0 flex items-center justify-center p-3 overflow-hidden">
            <div className="relative w-full h-full" style={{ maxWidth: 680 }}>

              {/* Feltro */}
              <div
                className="absolute"
                style={{
                  inset: "10% 6%",
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse at 40% 35%, #12261b 0%, #0a1a11 55%, #060e09 100%)",
                  boxShadow: "inset 0 1px 0 rgba(52,211,153,0.06), inset 0 8px 40px rgba(0,0,0,0.7), 0 0 60px rgba(52,211,153,0.07), 0 20px 80px rgba(0,0,0,0.8)",
                  border: "1px solid rgba(52,211,153,0.14)",
                }}
              />

              {/* Centro da mesa */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ pointerEvents: !room.currentRound.title ? "auto" : "none" }}
              >
                {!room.currentRound.title ? (
                  <div className="flex flex-col items-center gap-3 w-full" style={{ maxWidth: 260, pointerEvents: "auto" }}>
                    <span className="text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: "rgba(110,231,183,0.45)" }}>
                      Nova rodada
                    </span>
                    <input
                      autoFocus
                      placeholder="Título da task"
                      value={roundTitle}
                      onChange={(e) => setRoundTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleNewRound(); }}
                      className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition text-center"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                    <input
                      placeholder="Link (Jira, Linear…)"
                      value={roundLink}
                      onChange={(e) => setRoundLink(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleNewRound(); }}
                      className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition text-center"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                    <button
                      onClick={handleNewRound}
                      className="px-6 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all active:scale-95"
                      style={{ background: "linear-gradient(135deg, #059669, #047857)", color: "white", boxShadow: "0 4px 16px rgba(5,150,105,0.3)", border: "1px solid rgba(52,211,153,0.2)" }}
                    >
                      Iniciar rodada
                    </button>
                  </div>
                ) : room.currentRound.revealed ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: "rgba(110,231,183,0.55)" }}>
                      Votos revelados
                    </span>
                    <div className="flex gap-2 flex-wrap justify-center" style={{ maxWidth: 280 }}>
                      {room.users.map((user) => {
                        const vote = room.currentRound.votes[user.id];
                        return vote !== undefined ? (
                          <div key={user.id} className="flex flex-col items-center gap-1">
                            <div
                              className="w-9 h-12 rounded-lg flex items-center justify-center font-bold text-sm"
                              style={{ background: "linear-gradient(160deg, #ffffff, #f0fdf4)", color: "#064e3b", border: "1px solid rgba(52,211,153,0.3)", boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}
                            >
                              {vote}
                            </div>
                            <span className="text-xs" style={{ color: "rgba(110,231,183,0.5)" }}>
                              {user.name.split(" ")[0]}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-10 h-14 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.12)", boxShadow: "0 0 20px rgba(52,211,153,0.06)" }}
                    >
                      <span style={{ fontSize: 22, opacity: 0.25 }}>🂠</span>
                    </div>
                    <span className="text-xs uppercase tracking-[0.25em]" style={{ color: "rgba(110,231,183,0.3)" }}>
                      Aguardando votos
                    </span>
                  </div>
                )}
              </div>

              {/* Jogadores ao redor da mesa */}
              {room.users.map((user, i) => {
                const total = room.users.length;
                const angle = (2 * Math.PI * i) / total - Math.PI / 2;
                const x = 50 + 47 * Math.cos(angle);
                const y = 50 + 44 * Math.sin(angle);
                const isMe = user.id === socket.id;
                const vote = room.currentRound.votes[user.id];

                return (
                  <div
                    key={user.id}
                    className="absolute flex flex-col items-center gap-1 pointer-events-none"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                  >
                    <div
                      className="w-7 h-9 rounded-lg flex items-center justify-center text-xs font-bold mb-0.5"
                      style={
                        room.currentRound.revealed && vote !== undefined
                          ? { background: "linear-gradient(160deg, #ffffff, #f0fdf4)", color: "#064e3b", border: "1px solid rgba(52,211,153,0.3)", boxShadow: "0 4px 14px rgba(0,0,0,0.5)" }
                          : user.hasVoted
                          ? { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.45)", boxShadow: "0 0 10px rgba(52,211,153,0.2)", color: "transparent" }
                          : { background: "transparent", border: "1px dashed rgba(255,255,255,0.1)", color: "transparent" }
                      }
                    >
                      {room.currentRound.revealed ? (vote ?? "-") : ""}
                    </div>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={
                        isMe
                          ? { background: "linear-gradient(135deg, #059669, #047857)", border: "2px solid rgba(52,211,153,0.6)", color: "white", boxShadow: "0 0 14px rgba(52,211,153,0.3)" }
                          : user.hasVoted
                          ? { background: "rgba(52,211,153,0.12)", border: "2px solid rgba(52,211,153,0.35)", color: "#6ee7b7" }
                          : { background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.08)", color: "#6b7280" }
                      }
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="text-xs font-medium whitespace-nowrap"
                      style={{ color: isMe ? "#6ee7b7" : "rgba(167,243,208,0.6)" }}
                    >
                      {user.name.split(" ")[0]}{isMe ? " ◆" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mão do jogador */}
          <div
            className="flex flex-col items-center gap-3 px-4 pb-4 pt-3 shrink-0"
            style={{ borderTop: "1px solid rgba(52,211,153,0.07)" }}
          >
            <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: "rgba(110,231,183,0.35)" }}>
              Sua mão
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {cards.map((card) => (
                <button
                  key={card}
                  onClick={() => socket.emit("vote", { roomId, value: card })}
                  className="cursor-pointer transition-all duration-200 active:scale-95"
                  style={{
                    width: 40, height: 56, borderRadius: 10, fontWeight: "700", fontSize: 15,
                    border: myVote === card ? "1.5px solid rgba(52,211,153,0.7)" : "1.5px solid rgba(255,255,255,0.12)",
                    background: myVote === card ? "linear-gradient(160deg, #ecfdf5, #d1fae5)" : "rgba(255,255,255,0.96)",
                    color: myVote === card ? "#065f46" : "#1a2e22",
                    transform: myVote === card ? "translateY(-12px) scale(1.07)" : "translateY(0)",
                    boxShadow: myVote === card ? "0 12px 28px rgba(52,211,153,0.3), 0 0 0 3px rgba(52,211,153,0.15)" : "0 4px 14px rgba(0,0,0,0.55)",
                  }}
                  onMouseEnter={(e) => {
                    if (myVote !== card) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-7px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 22px rgba(0,0,0,0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (myVote !== card) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(0,0,0,0.55)";
                    }
                  }}
                >
                  {card}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => socket.emit("reveal_votes", { roomId })}
                className="px-5 py-1.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-150 active:scale-95"
                style={{ background: "linear-gradient(135deg, #059669, #047857)", color: "white", boxShadow: "0 3px 16px rgba(5,150,105,0.35)", border: "1px solid rgba(52,211,153,0.2)" }}
              >
                Revelar votos
              </button>
              {room.currentRound.title && (
                <button
                  onClick={handleNewRound}
                  className="px-5 py-1.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-150 active:scale-95"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(167,243,208,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Nova rodada
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Histórico */}
        <div
          className="flex flex-col shrink-0 overflow-hidden"
          style={{ width: 240, borderLeft: "1px solid rgba(52,211,153,0.07)", background: "rgba(255,255,255,0.015)" }}
        >
          <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(52,211,153,0.07)" }}>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(110,231,183,0.45)" }}>
              Histórico
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
            {room.currentRound.title && (
              <div className="rounded-xl p-3" style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-white leading-snug line-clamp-2" style={{ wordBreak: "break-word" }}>
                    {room.currentRound.title}
                  </span>
                  {room.currentRound.link && (
                    <a href={room.currentRound.link} target="_blank" rel="noopener noreferrer" className="shrink-0" title={room.currentRound.link} style={{ color: "rgba(110,231,183,0.5)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#34d399" }} />
                  <span className="text-xs" style={{ color: "rgba(110,231,183,0.55)" }}>Votação em andamento</span>
                </div>
              </div>
            )}

            {room.history.length === 0 && !room.currentRound.title ? (
              <p className="text-xs text-center mt-6" style={{ color: "rgba(255,255,255,0.15)" }}>
                Nenhuma rodada iniciada ainda
              </p>
            ) : (
              [...room.history].reverse().map((entry: any, i: number) => {
                const votesMap: Record<string, number | string> = entry?.votes ?? {};
                const voteEntries = Object.entries(votesMap);
                const numeric = voteEntries.map(([, v]) => v).filter((v) => typeof v === "number") as number[];
                const avg = numeric.length > 0 ? (numeric.reduce((a, b) => a + b, 0) / numeric.length).toFixed(1) : "—";
                const userNames: Record<string, string> = {};
                if (entry?.userNames) Object.assign(userNames, entry.userNames);
                else room.users.forEach((u) => { userNames[u.id] = u.name; });

                return (
                  <div key={i} className="rounded-xl p-3" style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.08)" }}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-white leading-snug line-clamp-2" style={{ wordBreak: "break-word" }}>
                        {entry?.title || `Rodada ${room.history.length - i}`}
                      </span>
                      {entry?.link && (
                        <a href={entry.link} target="_blank" rel="noopener noreferrer" className="shrink-0 mt-0.5" title={entry.link} style={{ color: "rgba(110,231,183,0.5)" }} onClick={(e) => e.stopPropagation()}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {voteEntries.map(([userId, v]) => (
                        <span key={userId} className="text-xs px-1.5 py-0.5 rounded-md font-bold" style={{ background: "rgba(255,255,255,0.07)", color: "#6ee7b7" }} title={userNames[userId] ?? userId}>
                          {v}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {voteEntries.length} voto{voteEntries.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: "rgba(52,211,153,0.1)", color: "#6ee7b7" }}>
                        ∅ {avg}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
