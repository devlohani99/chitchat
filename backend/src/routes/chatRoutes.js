import { Router } from "express";
import {
  getConversationSummary,
  getMessages,
  getSmartReplies,
  rewriteDraft,
  sendMessage
} from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:userId", authMiddleware, getMessages);
router.get("/:userId/smart-replies", authMiddleware, getSmartReplies);
router.get("/:userId/summary", authMiddleware, getConversationSummary);
router.post("/:userId/rewrite", authMiddleware, rewriteDraft);
router.post("/", authMiddleware, sendMessage);

export default router;
