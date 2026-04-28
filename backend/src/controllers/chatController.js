import Message from "../models/Message.js";
import User from "../models/User.js";
import { generateAIReply } from "../services/aiService.js";

const areFriends = async (userAId, userBId) => {
  const userA = await User.findById(userAId).select("friends");
  if (!userA) return false;
  return userA.friends.some((id) => String(id) === String(userBId));
};

const loadConversation = async (userAId, userBId, limit = 300) =>
  Message.find({
    $or: [
      { senderId: userAId, receiverId: userBId },
      { senderId: userBId, receiverId: userAId }
    ]
  })
    .sort({ createdAt: 1 })
    .limit(limit);

export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    const canChat = await areFriends(currentUserId, otherUserId);
    if (!canChat) {
      return res.status(403).json({ message: "You can chat only with friends" });
    }
    const messages = await loadConversation(currentUserId, otherUserId, 300);
    return res.json(messages);
  } catch {
    return res.status(500).json({ message: "Could not load messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    if (!receiverId || !text) {
      return res.status(400).json({ message: "receiverId and text required" });
    }
    const canChat = await areFriends(req.user.id, receiverId);
    if (!canChat) {
      return res.status(403).json({ message: "You can chat only with friends" });
    }
    const userMessage = await Message.create({
      receiverId,
      text,
      senderId: req.user.id,
      isAI: false
    });
    const io = req.app.get("io");
    io.to(`user:${req.user.id}`).emit("message:new", userMessage);
    io.to(`user:${receiverId}`).emit("message:new", userMessage);

    return res.status(201).json({ userMessage });
  } catch {
    return res.status(500).json({ message: "Could not send message" });
  }
};

export const getSmartReplies = async (req, res) => {
  try {
    const { userId } = req.params;
    const canChat = await areFriends(req.user.id, userId);
    if (!canChat) {
      return res.status(403).json({ message: "You can chat only with friends" });
    }

    const recentMessages = await loadConversation(req.user.id, userId, 8).then((items) =>
      items.reverse()
    );

    const conversation = recentMessages
      .map((item) => `${String(item.senderId) === String(req.user.id) ? "Me" : "Friend"}: ${item.text}`)
      .join("\n");

    const prompt = `Give exactly 3 short reply options for this chat. Return each option in a new line without numbering.\n${conversation}`;
    const replyText = await generateAIReply(prompt);
    const suggestions = replyText
      .split("\n")
      .map((line) => line.trim().replace(/^[0-9]+[\).\-\s]*/, ""))
      .filter(Boolean)
      .slice(0, 3);

    return res.json({ suggestions });
  } catch {
    return res.status(500).json({ message: "Could not generate smart replies" });
  }
};

export const getConversationSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const canChat = await areFriends(req.user.id, userId);
    if (!canChat) {
      return res.status(403).json({ message: "You can chat only with friends" });
    }
    const messages = await loadConversation(req.user.id, userId, 30);
    if (!messages.length) {
      return res.json({ summary: "No messages yet in this chat." });
    }
    const conversation = messages
      .map((item) => `${String(item.senderId) === String(req.user.id) ? "Me" : "Friend"}: ${item.text}`)
      .join("\n");
    const prompt = `Summarize this conversation in 4 concise bullet points.\n${conversation}`;
    const summary = await generateAIReply(prompt);
    return res.json({ summary });
  } catch {
    return res.status(500).json({ message: "Could not summarize conversation" });
  }
};

export const rewriteDraft = async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, tone } = req.body;
    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }
    const canChat = await areFriends(req.user.id, userId);
    if (!canChat) {
      return res.status(403).json({ message: "You can chat only with friends" });
    }
    const selectedTone = tone || "friendly";
    const prompt = `Rewrite this chat message in a ${selectedTone} tone. Keep it under 30 words and return only the rewritten sentence.\nMessage: ${text}`;
    const rewritten = await generateAIReply(prompt);
    return res.json({ rewritten: rewritten.trim() });
  } catch {
    return res.status(500).json({ message: "Could not rewrite message" });
  }
};
