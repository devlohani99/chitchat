import User from "../models/User.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email
});

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("friends", "_id name username email")
      .populate("incomingRequests", "_id name username email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      me: publicUser(user),
      friends: user.friends.map(publicUser),
      incomingRequests: user.incomingRequests.map(publicUser)
    });
  } catch {
    return res.status(500).json({ message: "Could not load profile" });
  }
};

export const searchUserByEmail = async (req, res) => {
  try {
    const email = (req.query.email || "").toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    const user = await User.findOne({ email }).select("_id name username email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (String(user._id) === String(req.user.id)) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }
    return res.json(publicUser(user));
  } catch {
    return res.status(500).json({ message: "Could not search user" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const email = (req.body.email || "").toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ email });
    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    if (String(sender._id) === String(receiver._id)) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }
    if (sender.friends.some((id) => String(id) === String(receiver._id))) {
      return res.status(400).json({ message: "Already friends" });
    }
    if (sender.outgoingRequests.some((id) => String(id) === String(receiver._id))) {
      return res.status(400).json({ message: "Request already sent" });
    }
    if (sender.incomingRequests.some((id) => String(id) === String(receiver._id))) {
      return res.status(400).json({ message: "This user already sent you a request" });
    }

    sender.outgoingRequests.push(receiver._id);
    receiver.incomingRequests.push(sender._id);
    await sender.save();
    await receiver.save();

    const io = req.app.get("io");
    io.to(`user:${receiver._id}`).emit("friend:incoming");
    io.to(`user:${sender._id}`).emit("friend:outgoing");

    return res.status(201).json({ message: "Friend request sent" });
  } catch {
    return res.status(500).json({ message: "Could not send friend request" });
  }
};

export const respondFriendRequest = async (req, res) => {
  try {
    const { fromUserId, action } = req.body;
    if (!fromUserId || !["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "fromUserId and valid action required" });
    }

    const currentUser = await User.findById(req.user.id);
    const fromUser = await User.findById(fromUserId);
    if (!currentUser || !fromUser) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.incomingRequests = currentUser.incomingRequests.filter(
      (id) => String(id) !== String(fromUser._id)
    );
    fromUser.outgoingRequests = fromUser.outgoingRequests.filter(
      (id) => String(id) !== String(currentUser._id)
    );

    if (action === "accept") {
      if (!currentUser.friends.some((id) => String(id) === String(fromUser._id))) {
        currentUser.friends.push(fromUser._id);
      }
      if (!fromUser.friends.some((id) => String(id) === String(currentUser._id))) {
        fromUser.friends.push(currentUser._id);
      }
    }

    await currentUser.save();
    await fromUser.save();

    const io = req.app.get("io");
    io.to(`user:${currentUser._id}`).emit("friend:updated");
    io.to(`user:${fromUser._id}`).emit("friend:updated");

    return res.json({ message: `Request ${action}ed` });
  } catch {
    return res.status(500).json({ message: "Could not update request" });
  }
};
