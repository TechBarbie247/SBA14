const router = require('express').Router();
const Bookmark = require('../../models/Bookmark');
const { authMiddleware } = require('../../utils/auth');

// All routes require auth
router.use(authMiddleware);

// GET /api/bookmarks - only current user's bookmarks
router.get('/', async (req, res) => {
  try {
    const docs = await Bookmark.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
});

// POST /api/bookmarks
router.post('/', async (req, res) => {
  try {
    const doc = await Bookmark.create({ ...req.body, user: req.user._id });
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: 'Failed to create', error: e.message });
  }
});

// Helper: load + authorize
async function loadOwned(req, res) {
  const doc = await Bookmark.findById(req.params.id);
  if (!doc) return [null, res.status(404).json({ message: 'Not found' })];
  if (doc.user.toString() !== req.user._id) {
    return [null, res.status(403).json({ message: 'Forbidden: not owner' })];
  }
  return [doc, null];
}

// GET /api/bookmarks/:id
router.get('/:id', async (req, res) => {
  try {
    const [doc, responded] = await loadOwned(req, res);
    if (!doc) return responded;
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: 'Failed to get' });
  }
});

// PUT /api/bookmarks/:id
router.put('/:id', async (req, res) => {
  try {
    const [doc, responded] = await loadOwned(req, res);
    if (!doc) return responded;
    const updated = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update' });
  }
});

// DELETE /api/bookmarks/:id
router.delete('/:id', async (req, res) => {
  try {
    const [doc, responded] = await loadOwned(req, res);
    if (!doc) return responded;
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete' });
  }
});

module.exports = router;