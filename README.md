# Files Pro - Media Converter & Compressor

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Python-Flask-green?logo=flask" alt="Flask">
  <img src="https://img.shields.io/badge/FFmpeg-powered-red?logo=ffmpeg" alt="FFmpeg">
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css" alt="Tailwind CSS">
</p>

Files Pro is a powerful yet simple web application that allows you to convert and compress various media files with ease.

## How to setup locally
### 1. Using Docker (the best way).
```
git clone https://github.com/viraj-ap/files-pro

docker-compose up --build
```
then go to http://localhost:5173/

### 2. Setting up locally.
1. Make sure you have downloaded FFmpeg locally
```
git clone https://github.com/viraj-ap/files-pro

cd backend 
pip install -r requirements.txt
python app.py

cd .. 

cd frontend
npm install
npm run dev

```

make sure backend is running at http://localhost:5000/ then go to http://localhost:5173/

## ✨ Features

- **File Conversion** - Convert between various formats including:
  - Video: MP4, AVI, MKV, WebM
  - Audio: MP3
  - Image: JPG, PNG, GIF
  
- **Compression Options**:
  - Video compression with optimized settings
  - Image compression with quality control
  
- **Modern UI** - Clean, responsive interface built with React and Tailwind CSS

- **Efficient Processing** - Powered by FFmpeg for fast and reliable conversions

## 🚀 Tech Stack

- **Frontend**: 
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - Shadcn UI Components
  
- **Backend**:
  - Python Flask
  - FFmpeg for media processing


