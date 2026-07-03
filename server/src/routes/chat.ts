import { Router } from "express";
import { z } from "zod";
import { ChatMessage } from "../models/ChatMessage";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

const createSchema = z.object({
  text: z.string().min(1, "Noi dung tin nhan khong duoc de trong"),
});

// TODO(LLM-integration): Thay the ham nay bang cuoc goi toi mot LLM that
// (vi du: Anthropic Claude API) de tra loi tu nhien hon. Hien tai chi la
// rule-based mock dua tren tu khoa de FE co the demo luong chat ngay.
function getMockBotReply(userText: string): string {
  const text = userText.toLowerCase();

  if (text.includes("tuoi nuoc") || text.includes("tưới nước") || text.includes("nuoc")) {
    return "Ban nen tuoi nuoc cho cay 2-3 lan/tuan, kiem tra do am dat truoc khi tuoi de tranh ung nuoc.";
  }
  if (text.includes("anh sang") || text.includes("ánh sáng") || text.includes("nang")) {
    return "Hau het cay canh ua anh sang giao tan (indirect light). Tranh de cay duoi nang gat truc tiep qua lau.";
  }
  if (text.includes("sau benh") || text.includes("sâu bệnh") || text.includes("sau benh") || text.includes("benh")) {
    return "Neu la cay co dau hieu sau benh, ban co the dung dung dich xa phong loang hoac dau neem de xu ly tu nhien.";
  }
  if (text.includes("phan bon") || text.includes("bón phân") || text.includes("bon")) {
    return "Nen bon phan huu co dinh ky 2-4 tuan/lan trong mua sinh truong, tranh bon qua lieu gay chay re.";
  }

  return "Cam on ban da nhan tin! Minh la tro ly cham soc cay Cham Xanh. Ban co the hoi minh ve tuoi nuoc, anh sang, sau benh hoac phan bon nhe.";
}

router.get(
  "/messages",
  asyncHandler(async (req, res) => {
    const messages = await ChatMessage.find({ userId: req.user!.id }).sort({ createdAt: 1 });
    res.json({ messages });
  })
);

router.post(
  "/messages",
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);

    const userMessage = await ChatMessage.create({
      userId: req.user!.id,
      sender: "user",
      text: body.text,
    });

    const botReplyText = getMockBotReply(body.text);
    const botMessage = await ChatMessage.create({
      userId: req.user!.id,
      sender: "bot",
      text: botReplyText,
    });

    res.status(201).json({ userMessage, botMessage });
  })
);

export default router;
