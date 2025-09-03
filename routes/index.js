const router = require("express").Router();
const apiRoutes = require("./api");
router.use("/api", apiRoutes);
router.get("/", (_req, res) => res.json({ status: "ok" }));
router.use((_req, res) => res.status(404).json({ message: 'Not found' }));
module.exports = router;