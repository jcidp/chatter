# Chatter

A real-time messaging web application built with Rails and React, offering a seamless communication experience similar to WhatsApp.

## Live Demo

Visit [https://chatter.jcidp.co/] to try out Chatter!

### Testing Instructions
- You can register using any email address (it doesn't need to be real)
- To test the real-time communication features:
  - Open the app in an incognito window or different browser
  - Create a second account
  - Start chatting to see messages appear instantly!

## Features

### Real-time Communication
- Instant message delivery powered by WebSocket technology

### User Management
- Secure authentication system
- Customizable user profiles
- Personal status messages
- Profile picture upload capabilities

### Group Messaging
- Create and manage group conversations
- Add or remove group members
- Group admin controls

### File Sharing
- Support for images
- Secure file upload and storage in S3

### User Interface
- Clean and intuitive design
- Responsive layout for all devices
- Light and dark theme support

## Technology Stack

### Backend
- Ruby on Rails
- Action Cable for WebSocket functionality
- Active Storage for file handling
- PostgreSQL database

### Frontend
- React.js
- WebSocket client integration
- Modern CSS with responsive design
- Theme management system

### Deployment
- Deployed to a VPS