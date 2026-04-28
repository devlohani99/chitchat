import { Router } from "express";
import {
  getMe,
  respondFriendRequest,
  searchUserByEmail,
  sendFriendRequest
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.get("/search", authMiddleware, searchUserByEmail);
router.post("/request", authMiddleware, sendFriendRequest);
router.post("/request/respond", authMiddleware, respondFriendRequest);

export default router;
