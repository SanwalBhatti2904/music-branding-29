# 🎧 SLOWED. — Instant Slowed + Reverb

> **Slow it down. Let it reverb.**  
> A cinematic, browser-based audio experience for turning your favorite tracks into dreamy, atmospheric slowed + reverb versions.

<p align="center">
  <a href="https://remixcreater.netlify.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-remixcreater.netlify.app-8b5cf6?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo">
  </a>
  <a href="https://github.com/SanwalBhatti2904/music-branding-29">
    <img src="https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
</p>

---

## ✨ Overview

**SLOWED.** is a modern, immersive web audio experience designed for music lovers who enjoy slowed, reverb-heavy and atmospheric sound.

The project combines a polished dark interface with glassmorphism, gradient accents, animated interactions, scroll-driven visuals and an in-browser audio processing tool.

Everything is designed to feel like a premium music product while keeping the experience simple:

**Upload → Adjust → Preview → Export.**

The page is built as a fully browser-based experience, with the audio processing handled through the **Web Audio API**. The interface also includes a cinematic scroll-driven frame animation using a sequence of 300 JPG frames.

---

## 🚀 Live Project

### 🌐 Live Demo
**https://remixcreater.netlify.app/**

### 💻 GitHub Repository
**https://github.com/SanwalBhatti2904/music-branding-29**

---

## 🎵 Features

- 🎧 **Slowed + Reverb Audio Tool**
- 📤 Drag-and-drop audio uploading
- 🎼 MP3, WAV and M4A input support
- 🎚️ Real-time **Speed** control
- 🌊 Adjustable **Reverb** effect
- ▶️ Built-in audio preview/player
- 📈 Interactive waveform visualization
- 🎛️ Ready-made audio presets
- 💾 Export processed audio as **WAV**
- 💾 Export processed audio as **MP3**
- 🖥️ 100% browser-based audio processing
- 🔐 No sign-up required
- 📱 Responsive layout for different screen sizes
- ✨ GSAP-powered scroll and reveal animations
- 🌀 Smooth scrolling with Lenis
- 🎞️ Scroll-synchronized 300-frame hero animation
- 🌌 Glassmorphism UI and animated gradients
- 🎨 Dark cinematic visual style
- ⚡ No backend required for the core audio experience

---

## 🎛️ Presets

The audio tool comes with several built-in starting points:

| Preset | Speed | Reverb |
|---|---:|---:|
| **Classic Slowed** | 0.80× | 50% |
| **Deep & Slow** | 0.65× | 75% |
| **Underwater** | 0.55× | 90% |
| **Chillhop** | 0.90× | 25% |
| **Dreamscape** | 0.70× | 60% |

You can select a preset and then fine-tune the controls to create your own sound.

---

## 🧠 How It Works

### 1. Upload
Drop an audio file into the browser or select one from your device.

### 2. Adjust
Use the speed and reverb controls to shape the sound.

### 3. Preview
Play the processed audio directly in the browser and inspect the waveform.

### 4. Export
Export the result as a WAV or MP3 file.

The project uses browser audio technologies rather than requiring a traditional server-side audio-processing backend.

---

## 🎨 Design & Experience

The visual identity is built around a cinematic dark theme with:

- Deep violet/black backgrounds
- Violet → magenta → cyan gradients
- Glassmorphism cards
- Soft neon glows
- Large editorial typography
- Animated waveforms
- Scroll-triggered content
- Horizontal mood carousel
- Micro-interactions
- Responsive navigation

The main visual palette is based around:

```text
Background   #08060f
Violet       #8b5cf6
Magenta      #ec4899
Cyan         #22d3ee
Text         #f5f3ff
Muted Text   #a9a3c2
```

---

## 🛠️ Tech Stack

### Frontend
- **HTML5**
- **CSS3**
- **Vanilla JavaScript**

### Browser Audio
- **Web Audio API**
- AudioBuffer processing
- Convolver-based reverb
- WAV encoding
- MP3 export processing

### Animation
- **GSAP**
- **GSAP ScrollTrigger**
- **Lenis**

### UI / Icons / Fonts
- **Font Awesome**
- **Space Grotesk**
- **Inter**

### Deployment
- **Netlify**

---

## 📁 Project Structure

A simplified structure looks like this:

```text
music-branding-29/
│
├── index.html
├── style.css
├── script.js
│
├── frame1/
│   ├── ezgif-frame-001.jpg
│   ├── ezgif-frame-002.jpg
│   ├── ...
│   └── ezgif-frame-300.jpg
│
└── README.md
```

> The hero animation expects the frame sequence to be available inside `frame1/` using the `ezgif-frame-001.jpg` → `ezgif-frame-300.jpg` naming pattern.

---

## 🎞️ Cinematic Hero Animation

One of the main visual elements is a scroll-driven frame animation.

The project loads **300 individual JPG frames** and renders them onto a `<canvas>` while the user scrolls through the hero section.

This creates a video-like experience without embedding a conventional video file.

The frame sequence is loaded using the pattern:

```text
frame1/ezgif-frame-001.jpg
frame1/ezgif-frame-002.jpg
...
frame1/ezgif-frame-300.jpg
```

GSAP ScrollTrigger controls the relationship between scroll position and the current frame.

---

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/SanwalBhatti2904/music-branding-29.git
```

### 2. Enter the project

```bash
cd music-branding-29
```

### 3. Start a local server

Because the project loads many image frames and browser APIs, using a local HTTP server is recommended.

For example, with Python:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also use the **Live Server** extension in VS Code.

---

## 🌐 Deployment

This project can be deployed easily as a static website.

### Netlify

The project is currently hosted on Netlify:

**https://remixcreater.netlify.app/**

For your own deployment:

1. Push the project to GitHub.
2. Open Netlify.
3. Import the GitHub repository.
4. Select the repository.
5. For a plain HTML/CSS/JS project, no build command is required.
6. Set the publish directory to the project root.
7. Deploy.

---

## ⚠️ Important Notes

### Browser Support

The audio experience depends on modern browser audio capabilities. A current version of Chrome, Edge, Firefox or Safari is recommended.

### Large Frame Sequence

The 300-frame hero animation can require significant memory because the browser loads and stores many images.

For better performance:

- Keep frame dimensions reasonable.
- Compress JPG frames without excessive quality loss.
- Avoid unnecessarily large image files.
- Test on both desktop and mobile devices.

### Audio Files

The project processes audio locally in the browser. Users should only upload audio they have the right to process and export.

---

## 🔮 Possible Future Improvements

Some ideas for future versions:

- 🎚️ Pitch control
- 🎛️ More advanced reverb controls
- 🎵 Bass and treble controls
- 🎚️ Equalizer
- 🔊 Volume normalization
- 📊 More detailed waveform visualization
- 💿 Album-art generation
- 📱 PWA / installable mobile experience
- ☁️ Optional cloud processing
- 🎼 Additional presets
- 🌓 Theme customization
- 🔗 Shareable processed tracks
- 📚 User-created preset library

---

## 📸 Project Highlights

The project focuses on combining **music tooling with cinematic web design** rather than presenting a traditional utility interface.

The goal is to make an audio-processing tool feel like an immersive music brand.

### Experience Flow

```text
                 ┌───────────────┐
                 │   LANDING     │
                 │  SLOWED.      │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    UPLOAD     │
                 │   MP3/WAV     │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    ADJUST     │
                 │ Speed + Reverb│
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    PREVIEW    │
                 │   Waveform    │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    EXPORT     │
                 │  WAV / MP3    │
                 └───────────────┘
```

---

## 👨‍💻 Author

**Sanwal Bhatti**

Frontend / Web Development Project

Built with curiosity, creativity and a love for music + modern web experiences. 🎧

---

## ⭐ Support

If you like the project, consider giving the repository a **⭐ star** on GitHub.

It helps support the project and motivates further improvements.

---

## 📄 License

If you plan to make this project open source, add your preferred license to the repository, such as the **MIT License**.

If no license has been added yet, the repository's default copyright status should be considered before reusing or redistributing the code.

---

<p align="center">
  <strong>🎧 SLOW IT DOWN. LET IT REVERB.</strong>
  <br><br>
  Built for people who listen differently.
</p>
