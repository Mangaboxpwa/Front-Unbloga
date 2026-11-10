# Unbloga

**A social platform for manga enthusiasts.**

*Angular · Ionic · TypeScript · Progressive Web App · REST API · WebSockets*

Unbloga is a Progressive Web App (PWA) designed for manga enthusiasts, inspired by the social experience of [Letterboxd](https://letterboxd.com/). It allows users to track their manga reading activity, share their opinions, discover what others are reading, and connect with people who share the same interests.

Built with Angular and Ionic, Unbloga combines a social reading experience with a responsive, installable, and optimized web application.

<p align="center">
  <img src="screenshots/unbloga-1.jpeg" width="48%" />
  <img src="screenshots/unbloga-2.jpeg" width="48%" />
</p>

<p align="center">
  <img src="screenshots/profile.png" width="48%" />
  <img src="screenshots/reviews.png" width="48%" />
</p>

## ✨ Features

### 📚 Manga Tracking
- **Reading Activity:** Keep track of your manga reading activity.
- **Reviews & Ratings:** Write reviews and rate manga to share your opinions.
- **Favorites:** Save and manage your favorite manga.
- **Manga Discovery:** Browse and explore manga within the platform.

### 👥 Social Features
- **Social Feed:** Personalized home feed displaying the latest activity from followed users.
- **Follow System:** Follow other readers and gain followers.
- **User Profiles:** Personalized profiles featuring reading activity, reviews, ratings, favorites, and activity summaries.
- **QR Code Profiles:** Scan QR codes using the device camera to quickly access other users' profiles.
- **Push Notifications:** Receive notifications about social interactions, such as new followers.

### 📱 Device Integration
- **QR Code Scanner:** Camera integration for scanning user profile QR codes.
- **Speech-to-Text:** Audio recognition to dictate reviews instead of typing them manually.
- **Progressive Web App:** Installable on mobile devices and optimized for a responsive experience.
- **Offline Support:** Service worker integration for improved availability and performance.

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Angular | Frontend framework |
| Ionic | UI components and mobile-oriented experience |
| TypeScript | Application logic |
| SCSS | Styling and theming |
| Bootstrap | Responsive layout and UI utilities |
| Laravel | Backend REST API |
| WebSockets / Pusher | Real-time communication and notifications |
| Progressive Web App | Installability and offline capabilities |
| Browser APIs | Camera access and audio recognition |

## 🏗 Architecture

Unbloga follows a client-server architecture:

- **Frontend:** Angular standalone components combined with Ionic for the user interface, navigation, and application logic.
- **Backend:** Laravel REST API for authentication, business logic, and data management.
- **Real-time Communication:** WebSockets and Pusher for real-time events and social notifications.
- **Device Integration:** Browser APIs for camera access, QR code scanning, and speech recognition.
- **PWA:** Service workers and caching strategies for improved performance and offline capabilities.

## 📱 Platform

Unbloga is designed as a responsive Progressive Web App, providing a consistent experience across desktop and mobile devices without requiring installation through a traditional app store.

## 👨‍💻 Development

This repository contains the Angular frontend of Unbloga.

The backend is maintained separately and communicates with the frontend through REST API endpoints and WebSocket connections.

---

*Developed as a collaborative project with a focus on social interaction, manga discovery, and modern web technologies.*
