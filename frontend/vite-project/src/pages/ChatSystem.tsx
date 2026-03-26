import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MessageCircle, Send, ArrowLeft, User, Clock, Circle } from "lucide-react";
import { AddressSelector } from "../components/AddressSelector";

const API_BASE = "http://localhost:8080/api";

interface ChatProps {
  account: string;
  userRole: string;
  userName: string;
  initialTarget?: string;
}

interface ChatPreview {
  _id: string;
  otherAddress: string;
  otherName: string;
  otherRole: string;
  lastMessage: string;
  lastText: string;
  unreadCount: number;
  messageCount: number;
}

interface Message {
  sender: string;
  senderRole: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export const ChatSystem = ({ account, userRole, userName, initialTarget }: ChatProps) => {
  const [chatList, setChatList] = useState<ChatPreview[]>([]);
  const [activeChat, setActiveChat] = useState<{ doctorAddr: string; patientAddr: string; otherName: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newChatAddress, setNewChatAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchChatList();
  }, [account]);

  // Auto-open chat if initialTarget is provided (from "Message Doctor/Patient" button)
  useEffect(() => {
    if (initialTarget && account) {
      startNewChat(initialTarget);
    }
  }, [initialTarget, account]);

  // Poll for new messages when in a chat
  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      pollRef.current = setInterval(fetchMessages, 3000);
      return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatList = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/chat/list/${account}`);
      setChatList(data.chats);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!activeChat) return;
    try {
      const { data } = await axios.get(`${API_BASE}/chat/${activeChat.doctorAddr}/${activeChat.patientAddr}`);
      setMessages(data.chat.messages);
      // Mark as read
      await axios.put(`${API_BASE}/chat/read/${activeChat.doctorAddr}/${activeChat.patientAddr}/${account}`);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const openChat = (chat: ChatPreview) => {
    const doctorAddr = userRole === "Doctor" ? account : chat.otherAddress;
    const patientAddr = userRole === "Patient" ? account : chat.otherAddress;
    setActiveChat({ doctorAddr, patientAddr, otherName: chat.otherName });
  };

  const startNewChat = async (otherAddress: string) => {
    if (!otherAddress || !otherAddress.trim()) return;
    setChatLoading(true);
    try {
      const doctorAddr = userRole === "Doctor" ? account : otherAddress.trim();
      const patientAddr = userRole === "Patient" ? account : otherAddress.trim();
      const { data } = await axios.get(`${API_BASE}/chat/${doctorAddr}/${patientAddr}`);
      const otherName = userRole === "Doctor" ? data.patientName : data.doctorName;
      setActiveChat({ doctorAddr, patientAddr, otherName: otherName || otherAddress.slice(0, 10) + '...' });
      setNewChatAddress("");
    } catch (err) {
      console.error("Failed to start chat:", err);
      alert("Failed to start chat. Check the wallet address and try again.");
    } finally {
      setChatLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    try {
      await axios.post(`${API_BASE}/chat/send`, {
        doctorAddress: activeChat.doctorAddr,
        patientAddress: activeChat.patientAddr,
        senderAddress: account,
        text: newMessage.trim()
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Failed to send:", err);
    }
  };

  // Chat list view
  if (!activeChat) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
              Messages <span className="text-zinc-500">Hub</span>
            </h1>
            <p className="text-zinc-600 text-xs font-bold mt-1 uppercase tracking-widest">
              Encrypted Doctor-Patient Communication
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
            <MessageCircle size={24} className="text-zinc-500" />
          </div>
        </div>

        {/* New Chat — Select person */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3">
            Start New Conversation
          </p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <AddressSelector
                type={userRole === "Doctor" ? "patient" : "doctor"}
                currentUserAddress={account}
                currentUserRole={userRole}
                value={newChatAddress}
                onChange={setNewChatAddress}
                label={`Select ${userRole === "Doctor" ? "Patient" : "Doctor"}`}
              />
            </div>
            <button
              onClick={() => startNewChat(newChatAddress)}
              disabled={!newChatAddress.trim() || chatLoading}
              className="px-6 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {chatLoading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Start Chat
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Conversations</h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-3" />
            </div>
          ) : chatList.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle size={32} className="text-zinc-800 mx-auto mb-2" />
              <p className="text-zinc-600 text-xs font-bold">No conversations yet</p>
              <p className="text-zinc-700 text-[10px] mt-1">Enter a wallet address above to start chatting</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {chatList.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => openChat(chat)}
                  className="px-6 py-4 hover:bg-zinc-800/30 transition-all cursor-pointer flex items-center gap-4"
                >
                  <div className="bg-zinc-800 p-2.5 rounded-xl shrink-0">
                    <User size={18} className="text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{chat.otherName}</p>
                      <span className="text-[8px] font-black text-zinc-600 uppercase bg-zinc-800 px-2 py-0.5 rounded">
                        {chat.otherRole}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">{chat.lastText || "No messages yet"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {chat.unreadCount > 0 && (
                      <span className="bg-white text-black text-[9px] font-black px-2 py-0.5 rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}
                    <p className="text-[8px] text-zinc-700 mt-1">
                      {chat.lastMessage ? new Date(chat.lastMessage).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active chat view
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Chat Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-zinc-800 mb-4 shrink-0">
        <button
          onClick={() => { setActiveChat(null); if (pollRef.current) clearInterval(pollRef.current); fetchChatList(); }}
          className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="bg-zinc-800 p-2.5 rounded-xl">
          <User size={20} className="text-zinc-400" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">{activeChat.otherName}</h3>
          <div className="flex items-center gap-1.5">
            <Circle size={6} className="text-white fill-white" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Online — Encrypted Channel</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <MessageCircle size={32} className="text-zinc-800 mx-auto mb-2" />
            <p className="text-zinc-600 text-xs font-bold">Start the conversation</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender === account;
          return (
            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                isMe
                  ? "bg-white text-black rounded-br-md"
                  : "bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-md"
              }`}>
                <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${
                  isMe ? "text-black/50" : "text-zinc-500"
                }`}>
                  {msg.senderName} • {msg.senderRole}
                </p>
                <p className={`text-sm leading-relaxed ${isMe ? "text-black" : "text-zinc-200"}`}>
                  {msg.text}
                </p>
                <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : ""}`}>
                  <Clock size={8} className={isMe ? "text-black/30" : "text-zinc-600"} />
                  <span className={`text-[8px] ${isMe ? "text-black/30" : "text-zinc-600"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 pt-4 border-t border-zinc-800 mt-4 shrink-0">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 outline-none focus:border-zinc-600 text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="px-6 bg-white text-black rounded-2xl font-black flex items-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-30"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
