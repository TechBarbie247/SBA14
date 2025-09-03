const router = require("express").Router();
router.use("/users", require("./userRoutes"));
router.use("/bookmarks", require("./bookmarkRoutes"));
module.exports = router;