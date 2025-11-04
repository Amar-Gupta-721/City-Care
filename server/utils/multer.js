// // backend/utils/multer.js
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const tmpDir = 'tmp/uploads';
// if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, tmpDir),
//   filename: (req, file, cb) =>
//     cb(null, `${Date.now()}${path.extname(file.originalname)}`)
// });

// const upload = multer({ storage });

// export default upload;


// server/utils/multer.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const tmpDir = path.join(process.cwd(), 'tmp', 'uploads');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

export default upload;
