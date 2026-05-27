export default function handler(req, res) {
  res.status(200).json({ test: "ok", message: "Vercel API is alive" });
}
