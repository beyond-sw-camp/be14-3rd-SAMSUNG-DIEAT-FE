const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// CORS 설정
app.use(cors());

// body-parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public 디렉토리 생성
const publicDir = path.join(__dirname, 'public');
const imgDir = path.join(publicDir, 'img');
const mealDir = path.join(imgDir, 'meal');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir);
}
if (!fs.existsSync(mealDir)) {
  fs.mkdirSync(mealDir);
}

// 정적 파일 제공
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mealDir);
  },
  filename: function (req, file, cb) {
    const filename = req.body.filename || file.originalname;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 제한
  }
});

// 파일 업로드 엔드포인트
app.post('/upload', (req, res) => {
  upload.single('file')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer 에러:', err);
      return res.status(400).json({ 
        error: '파일 업로드 중 오류가 발생했습니다.',
        details: err.message 
      });
    } else if (err) {
      console.error('파일 업로드 오류:', err);
      return res.status(500).json({ 
        error: '파일 업로드 중 오류가 발생했습니다.',
        details: err.message 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }
    
    const filePath = `/img/meal/${req.file.filename}`;
    res.status(200).json({ 
      success: true, 
      path: filePath,
      filename: req.file.filename
    });
  });
});

// 서버 시작
const PORT = 3001; // json-server와 다른 포트 사용
app.listen(PORT, () => {
  console.log(`파일 업로드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
}); 