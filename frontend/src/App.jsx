import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AuthView = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : {
            name: form.name,
            email: form.email,
            password: form.password
          };
      const { data } = await axios.post(`${API_URL}${endpoint}`, payload);
      onAuthenticated(data.token, data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#cecede] text-slate-700">
      <div className="min-h-screen bg-[#cecede] overflow-hidden">
        <header className="flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-linear-to-b from-[#f7bf4a] to-[#f06a3b]" />
            <div>
              <p className="text-lg font-black tracking-wide text-[#303048]">ChitChat</p>
              <p className="text-[11px] font-medium text-slate-500">Smart realtime conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-full border border-slate-300 px-6 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              onClick={() => {
                setIsLogin(false);
                setShowAuthForm(true);
              }}
            >
              REGISTER
            </button>
            <button
              className="rounded-full bg-linear-to-r from-[#f7bf4a] to-[#f06a3b] px-6 py-2 text-xs font-bold text-white shadow"
              onClick={() => {
                setIsLogin(true);
                setShowAuthForm(true);
              }}
            >
              LOGIN
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-6 md:px-14 pb-10 pt-2">
          <section className="relative h-[420px]">
            <div className="absolute left-16 top-20 h-52 w-72 rounded-[30px] bg-linear-to-b from-[#f8cc62] to-[#f2683c] shadow-2xl" />
            <div className="absolute left-8 top-8 h-36 w-36 rounded-full border-2 border-white/60 bg-white/25 backdrop-blur-md" />
            <div className="absolute left-5 top-26 h-14 w-14 rounded-full bg-linear-to-b from-[#f7c654] to-[#f15f3b] shadow-lg" />
            <div className="absolute left-72 top-36 h-12 w-12 rounded-full bg-linear-to-b from-[#ffd568] to-[#f79344] shadow-lg" />
            <div className="absolute left-52 top-52 h-24 w-24 rounded-full bg-linear-to-b from-[#ffd568] to-[#f79344] shadow-xl" />
            <div className="absolute left-[88px] top-[128px] flex gap-5">
              <span className="h-6 w-6 rounded-full bg-white/90" />
              <span className="h-6 w-6 rounded-full bg-white/90" />
              <span className="h-6 w-6 rounded-full bg-white/90" />
            </div>
          </section>

          <section className="relative">
            <h2 className="text-7xl font-light text-white leading-none">ONLINE</h2>
            <h3 className="text-8xl md:text-9xl font-black text-[#303048] leading-none">CHAT</h3>
            <p className="mt-4 max-w-md text-sm text-slate-600">
              Connect with friends in real time, manage requests, and use GenAI tools for
              smarter conversations.
            </p>
            <button
              className="mt-8 rounded-full border-4 border-[#f0a55b] px-14 py-3 text-4xl font-bold tracking-wide text-white/90"
              onClick={() => {
                setIsLogin(false);
                setShowAuthForm(true);
              }}
            >
              REGISTER
            </button>
          </section>
        </main>
      </div>

      {showAuthForm && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#0a0a0f]/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-xl font-bold text-slate-800">
                {isLogin ? "Login" : "Create Account"}
              </h4>
              <button
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500"
                onClick={() => setShowAuthForm(false)}
              >
                Close
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              {!isLogin && (
                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />
              )}
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
              <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
              {error && <div className="text-rose-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                {isLogin ? "Login" : "Create Account"}
              </button>
            </form>
            <button
              className="mt-3 w-full text-sm text-emerald-700 hover:text-emerald-600"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [activeUserId, setActiveUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [smartReplies, setSmartReplies] = useState([]);
  const [draftTone, setDraftTone] = useState("friendly");
  const [chatSummary, setChatSummary] = useState("");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isAIWorking, setIsAIWorking] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [peerTyping, setPeerTyping] = useState("");

  const socket = useMemo(() => io(API_URL, { autoConnect: false }), []);
  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const loadProfile = async () => {
    if (!token) return;
    const { data } = await axios.get(`${API_URL}/api/users/me`, {
      headers: authHeaders
    });
    setFriends(data.friends || []);
    setIncomingRequests(data.incomingRequests || []);
    if (!activeUserId && data.friends?.length) {
      setActiveUserId(data.friends[0].id);
    }
    if (activeUserId && !data.friends.some((item) => item.id === activeUserId)) {
      setActiveUserId(data.friends[0]?.id || "");
      setMessages([]);
    }
  };

  useEffect(() => {
    if (!token || !user) return;
    socket.connect();
    socket.emit("join_user", user.id);
    return () => socket.disconnect();
  }, [socket, token, user]);

  useEffect(() => {
    loadProfile();
  }, [token]);

  useEffect(() => {
    if (!token || !activeUserId) return;
    const load = async () => {
      const { data } = await axios.get(`${API_URL}/api/chat/${activeUserId}`, {
        headers: authHeaders
      });
      setMessages(data);
    };
    load();
  }, [token, activeUserId, authHeaders]);

  useEffect(() => {
    const handler = (incoming) => {
      const isForActiveChat =
        activeUserId &&
        ((String(incoming.senderId) === String(activeUserId) &&
          String(incoming.receiverId) === String(user?.id)) ||
          (String(incoming.senderId) === String(user?.id) &&
            String(incoming.receiverId) === String(activeUserId)));
      if (isForActiveChat) {
        setMessages((prev) => [...prev, incoming]);
      }
    };
    const profileRefresh = () => loadProfile();
    const typingHandler = (payload) => {
      if (
        String(payload?.fromUserId) === String(activeUserId) &&
        payload?.isTyping
      ) {
        setPeerTyping(`${payload.fromName || "Friend"} is typing...`);
        return;
      }
      if (String(payload?.fromUserId) === String(activeUserId) && !payload?.isTyping) {
        setPeerTyping("");
      }
    };
    socket.on("message:new", handler);
    socket.on("typing:update", typingHandler);
    socket.on("friend:incoming", profileRefresh);
    socket.on("friend:outgoing", profileRefresh);
    socket.on("friend:updated", profileRefresh);
    return () => {
      socket.off("message:new", handler);
      socket.off("typing:update", typingHandler);
      socket.off("friend:incoming", profileRefresh);
      socket.off("friend:outgoing", profileRefresh);
      socket.off("friend:updated", profileRefresh);
    };
  }, [socket, activeUserId, user, token]);

  useEffect(() => {
    if (!token || !activeUserId) return;
    socket.emit("typing", {
      toUserId: activeUserId,
      fromUserId: user.id,
      fromName: user.name,
      isTyping: !!text.trim()
    });
    const timer = setTimeout(() => {
      socket.emit("typing", {
        toUserId: activeUserId,
        fromUserId: user.id,
        fromName: user.name,
        isTyping: false
      });
    }, 900);
    return () => clearTimeout(timer);
  }, [text, socket, activeUserId, token, user]);

  useEffect(() => {
    if (!token || !activeUserId) {
      setSmartReplies([]);
      return;
    }
    const loadSmartReplies = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/chat/${activeUserId}/smart-replies`,
          { headers: authHeaders }
        );
        setSmartReplies(data.suggestions || []);
      } catch {
        setSmartReplies([]);
      }
    };
    loadSmartReplies();
  }, [messages, token, activeUserId, authHeaders]);

  const onAuthenticated = (nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const send = async () => {
    if (!text.trim() || !activeUserId) return;

    await axios.post(
      `${API_URL}/api/chat`,
      { receiverId: activeUserId, text },
      { headers: authHeaders }
    );
    setText("");
  };

  const refreshSmartReplies = async () => {
    if (!activeUserId) return;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/chat/${activeUserId}/smart-replies`,
        { headers: authHeaders }
      );
      setSmartReplies(data.suggestions || []);
    } catch {
      setSmartReplies([]);
    }
  };

  const generateSummary = async () => {
    if (!activeUserId) return;
    setIsAIWorking(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/chat/${activeUserId}/summary`, {
        headers: authHeaders
      });
      setChatSummary(data.summary || "");
      setIsSummaryOpen(true);
    } finally {
      setIsAIWorking(false);
    }
  };

  const rewriteDraftWithAI = async () => {
    if (!activeUserId || !text.trim()) return;
    setIsAIWorking(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/api/chat/${activeUserId}/rewrite`,
        { text, tone: draftTone },
        { headers: authHeaders }
      );
      if (data.rewritten) {
        setText(data.rewritten);
      }
    } finally {
      setIsAIWorking(false);
    }
  };

  const searchUser = async () => {
    setRequestMessage("");
    setSearchResult(null);
    if (!searchEmail.trim()) return;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/users/search?email=${encodeURIComponent(
          searchEmail.trim().toLowerCase()
        )}`,
        { headers: authHeaders }
      );
      setSearchResult(data);
    } catch (err) {
      setRequestMessage(err.response?.data?.message || "User not found");
    }
  };

  const sendRequest = async () => {
    if (!searchResult?.email) return;
    try {
      const { data } = await axios.post(
        `${API_URL}/api/users/request`,
        { email: searchResult.email },
        { headers: authHeaders }
      );
      setRequestMessage(data.message);
      setSearchResult(null);
      setSearchEmail("");
      loadProfile();
    } catch (err) {
      setRequestMessage(err.response?.data?.message || "Could not send request");
    }
  };

  const respondRequest = async (fromUserId, action) => {
    await axios.post(
      `${API_URL}/api/users/request/respond`,
      { fromUserId, action },
      { headers: authHeaders }
    );
    loadProfile();
  };

  const logout = () => {
    localStorage.clear();
    setToken("");
    setUser(null);
    setMessages([]);
    setFriends([]);
    setIncomingRequests([]);
    setActiveUserId("");
  };

  if (!token || !user) {
    return <AuthView onAuthenticated={onAuthenticated} />;
  }

  const activeUser = friends.find((item) => item.id === activeUserId);
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(messageSearch.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-700 p-3 md:p-5">
      <div className="mx-auto max-w-[1500px] h-[93vh] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl grid grid-cols-1 md:grid-cols-[72px_360px_1fr]">
        <aside className="hidden md:flex flex-col items-center justify-between py-4 bg-[#f7f8fa] border-r border-slate-200">
          <div className="space-y-6">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-700 font-semibold">
              C
            </div>
            <div className="flex flex-col items-center gap-3">
              <button className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-medium">
                Chats
              </button>
              <button className="w-11 h-11 rounded-xl border border-slate-200 text-slate-400 text-[10px]">
                Req
              </button>
              <button className="w-11 h-11 rounded-xl border border-slate-200 text-slate-400 text-[10px]">
                Pro
              </button>
              <button className="w-11 h-11 rounded-xl border border-slate-200 text-slate-400 text-[10px]">
                Set
              </button>
            </div>
          </div>
          <button className="w-11 h-11 rounded-xl border border-slate-200 text-slate-400 text-[10px]">
            Theme
          </button>
        </aside>

        <aside className="border-r border-slate-200 flex flex-col bg-[#fbfbfc]">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center">
                {user.name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-sm font-semibold">{user.name}</h2>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <button onClick={logout} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
              Logout
            </button>
          </div>

          <div className="p-3 border-b border-slate-200 space-y-2">
            <div className="flex gap-2">
              <input
                placeholder="Search by email ID"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <button onClick={searchUser} className="rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-500">
                Find
              </button>
            </div>
            {searchResult && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{searchResult.name}</p>
                  <p className="text-xs text-slate-500">{searchResult.email}</p>
                </div>
                <button onClick={sendRequest} className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500">
                  Add
                </button>
              </div>
            )}
            {requestMessage && <p className="text-xs text-emerald-700">{requestMessage}</p>}
          </div>

          <div className="p-3 border-b border-slate-200 max-h-44 overflow-auto space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">Requests ({incomingRequests.length})</p>
            {!incomingRequests.length && <p className="text-xs text-slate-500">No pending requests</p>}
            {incomingRequests.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-2.5 bg-white">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-slate-400 mb-2">{item.email}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => respondRequest(item.id, "accept")}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondRequest(item.id, "reject")}
                    className="rounded-md bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 p-2 overflow-auto space-y-1.5">
            {friends.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveUserId(item.id)}
                className={`w-full text-left rounded-lg px-3 py-3 border transition ${
                  activeUserId === item.id
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-white border-transparent hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 text-white text-[10px] font-semibold flex items-center justify-center">
                    {item.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.email}</p>
                  </div>
                </div>
              </button>
            ))}
            {!friends.length && (
              <p className="text-xs text-slate-500 p-2">
                Add friends by email ID to start chatting.
              </p>
            )}
          </div>

          <div className="p-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="text-sm font-semibold text-emerald-800">AI Powered Chat</p>
              <p className="text-xs text-emerald-700/80">Smart responses, summaries and draft rewrite.</p>
            </div>
          </div>
        </aside>

        <section className="flex flex-col bg-[#f9fafb]">
          <header className="border-b border-slate-200 px-5 py-3 bg-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center">
                  {activeUser?.name?.slice(0, 2).toUpperCase() || "NA"}
                </div>
                <div>
                  <h3 className="font-semibold">{activeUser ? activeUser.name : "Select a friend"}</h3>
                  <p className="text-xs text-slate-500">{activeUser ? activeUser.email : ""}</p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400">...</button>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                onClick={refreshSmartReplies}
                disabled={!activeUserId || isAIWorking}
                className="rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                AI replies
              </button>
              <button
                onClick={generateSummary}
                disabled={!activeUserId || isAIWorking}
                className="rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                AI summary
              </button>
              <select
                value={draftTone}
                onChange={(e) => setDraftTone(e.target.value)}
                className="rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="persuasive">Persuasive</option>
              </select>
              <button
                onClick={rewriteDraftWithAI}
                disabled={!activeUserId || !text.trim() || isAIWorking}
                className="rounded-lg bg-emerald-600 text-white px-2.5 py-1.5 text-xs font-medium hover:bg-emerald-500 disabled:opacity-50"
              >
                Rewrite draft
              </button>
              <input
                placeholder="Search in chat"
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-5 space-y-3 bg-[#f7f7f8]">
            {isSummaryOpen && (
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs whitespace-pre-wrap leading-relaxed">
                {chatSummary || "No summary generated yet."}
              </div>
            )}
            {!!peerTyping && (
              <div className="inline-flex w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-700">{peerTyping}</div>
            )}
            {filteredMessages.map((msg) => {
              const mine = String(msg.senderId) === String(user.id);
              const time = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "";
              return (
                <div key={msg._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                      mine
                        ? "bg-[#d9fdd3] text-slate-800 rounded-br-md"
                        : "bg-white text-slate-700 rounded-bl-md border border-slate-200"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="mt-1 text-[10px] text-slate-400 text-right">{time}</p>
                  </div>
                </div>
              );
            })}
          </main>

          <footer className="border-t border-slate-200 p-3 space-y-2 bg-white">
            {!!smartReplies.length && (
              <div className="space-y-1.5">
                {smartReplies.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    onClick={() => setText(item)}
                    className="w-full text-left rounded-lg border border-slate-200 bg-[#f8faf9] px-3 py-2 text-xs transition hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    <span className="text-emerald-700">↳ </span>
                    {item}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                placeholder={activeUserId ? "Type a message..." : "Select a friend to start chat"}
                value={text}
                disabled={!activeUserId}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
              />
              <button
                onClick={send}
                disabled={!activeUserId}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default App;
