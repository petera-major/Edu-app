import { useState, useRef, useEffect } from "react";

function Msg({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={[
        "max-w-[80%] rounded-2xl px-4 py-2 shadow",
        isUser
          ? "bg-emerald-200/90 text-emerald-950 border border-emerald-300"
          : "bg-emerald-50/90 text-emerald-900 border border-emerald-200"
      ].join(" ")}>
        {content}
      </div>
    </div>
  );
}

function StartScreen({ gradeLevel, setGradeLevel, subject, setSubject, onStart }) {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-pink-100 to-yellow-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to EduLearnAI 🎓</h2>
        <p className="mb-4 text-gray-600">Tell me about you so I can teach better:</p>

        <select value={gradeLevel} onChange={e => setGradeLevel(e.target.value)}
                className="w-full mb-3 p-2 rounded border">
          <option value="">Select Grade Level</option>
          <option>Elementary</option>
          <option>Middle School</option>
          <option>High School</option>
          <option>College</option>
        </select>

        <select value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full mb-6 p-2 rounded border">
          <option value="">Select Subject</option>
          <option>Math</option>
          <option>Science</option>
          <option>History</option>
          <option>English</option>
        </select>

        <button onClick={onStart}
                className="w-full py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-indigo-300"
                disabled={!gradeLevel || !subject}>
          Start Chat
        </button>
      </div>
    </div>
  );
}

function ChatScreen({ gradeLevel, subject }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome to EduLearnAI! How can I help today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://edu-backend-production-71da.up.railway.app/api/chat", // <-- add /api/chat
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next, gradeLevel, subject }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data?.reply?.trim?.() || "I couldn’t generate a response.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(m => [...m, { role: "assistant", content: "Oops, I had trouble replying." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-200 via-emerald-100 to-lime-100">
      <div className="w-full max-w-4xl mx-4 rounded-3xl shadow-2xl overflow-hidden border-[12px] border-amber-900/90 bg-amber-900/20">
        <div className="p-6 sm:p-8 bg-emerald-950 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.04),transparent_40%)]">
          <header className="mb-4 sm:mb-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">EduLearn<span className="text-emerald-300">AI</span> Classroom</h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-200">🎒 {gradeLevel}</span>
              <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-200">📚 {subject}</span>
            </div>
          </header>

          <div className="h-[48vh] sm:h-[55vh] overflow-y-auto rounded-xl p-4 bg-emerald-900/40 backdrop-blur-sm border border-emerald-800">
            {messages.map((m, i) => <Msg key={i} role={m.role} content={m.content} />)}
            {loading && <div className="text-emerald-200 italic">Assistant is typing…</div>}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="mt-4 flex gap-2">
            <input
              className="flex-1 rounded-full px-5 py-3 bg-white/95 text-emerald-950 placeholder-emerald-700/60 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder='Type your question… e.g., "Explain photosynthesis like I’m 10."'
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              className="px-5 py-3 rounded-full bg-emerald-400 text-emerald-950 font-semibold hover:bg-emerald-300 active:scale-95 transition disabled:opacity-60"
              type="submit"
              disabled={loading || !input.trim()}>
              {loading ? "Sending…" : "Send"}
            </button>
          </form>

          <p className="mt-4 text-center text-emerald-300/80 text-xs">© 2025 PeteraMajor</p>
        </div>
      </div>
    </div>
  );
}

export default function Class() {
  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [started, setStarted] = useState(false);

  return started ? (
    <ChatScreen gradeLevel={gradeLevel} subject={subject} />
  ) : (
    <StartScreen
      gradeLevel={gradeLevel}
      setGradeLevel={setGradeLevel}
      subject={subject}
      setSubject={setSubject}
      onStart={() => setStarted(true)}
    />
  );
}