const jsonServer = require('json-server');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const server = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// CORS 설정
server.use(cors());

// body-parser 미들웨어 추가
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

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
server.use('/img', express.static(path.join(__dirname, 'public/img')));

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mealDir);
  },
  filename: function (req, file, cb) {
    // 파일명이 전달되지 않은 경우 원본 파일명 사용
    const filename = req.body.filename || file.originalname;
    cb(null, filename);
  }
});

// 파일 필터 추가
const fileFilter = (req, file, cb) => {
  // 이미지 파일만 허용
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
server.post('/upload', (req, res) => {
  upload.single('file')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // Multer 에러 처리
      console.error('Multer 에러:', err);
      return res.status(400).json({ 
        error: '파일 업로드 중 오류가 발생했습니다.',
        details: err.message 
      });
    } else if (err) {
      // 기타 에러 처리
      console.error('파일 업로드 오류:', err);
      return res.status(500).json({ 
        error: '파일 업로드 중 오류가 발생했습니다.',
        details: err.message 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }
    
    // 파일 경로 반환
    const filePath = `/img/meal/${req.file.filename}`;
    res.status(200).json({ 
      success: true, 
      path: filePath,
      filename: req.file.filename
    });
  });
});

// json-server 미들웨어 사용
server.use(middlewares);
server.use(router);

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
}); 