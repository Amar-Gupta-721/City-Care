// backend/utils/multer.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tmpDir = 'tmp/uploads';
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tmpDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

export default upload;
