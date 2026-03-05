# Video Sharing Platform

A full-stack media sharing platform where users can upload videos or
images, interact with content, and manage their own profiles. The
application provides a modern single-page interface with secure
authentication and a scalable backend API.

⚠️ **This project is currently a work in progress and is actively being
developed.**

------------------------------------------------------------------------

# Overview

This project is a full-stack web application built with **React (Vite)**
on the frontend and **FastAPI (Python)** on the backend. It allows users
to create accounts, upload media, and interact with other users' content
through likes and comments.

Authentication is handled using **JWT tokens stored in HTTP-only
cookies**, allowing secure session management and protected API routes.

The goal of the project is to explore building a scalable full-stack
media platform while implementing modern authentication, media handling,
and interactive user features.

------------------------------------------------------------------------

# Current Features

## User Authentication

-   Secure authentication using **JWT tokens**
-   Tokens stored in **HTTP-only cookies**
-   Protected backend routes

## Media Upload

-   Users can upload **videos or images**
-   Uploaded media is linked to the user's profile
-   Dynamic loading of media content

## Content Interaction

Users can interact with content through: - **Comments** - **Likes**

## User Profiles

Each user has a profile page where visitors can: - View media uploaded
by that user - Navigate to individual posts

## Comment Management

Users can: - Add comments to posts - Delete their own comments - View
comment timestamps

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   **React**
-   **Vite**
-   **React Router**
-   **JavaScript**
-   **CSS**

The frontend is built as a **single-page application (SPA)** that
communicates with the backend through REST API calls.

------------------------------------------------------------------------

## Backend

-   **FastAPI**
-   **Python**
-   **JWT Authentication**
-   **Cookie-based session handling**

The backend provides endpoints for authentication, async media uploads,
comments, likes, and user data.

## Media Storage

Uploaded media (videos and images) are processed and stored using **ImageKit**.  
The backend uploads media to ImageKit and stores the returned media URL, which is then used by the frontend to display the content.

This approach allows efficient media delivery through a CDN and avoids storing large files directly on the application server.

------------------------------------------------------------------------

# Future Improvements

This project is still being actively developed. Planned improvements
include:

-   Improved media handling and optimization
-   Additional user interaction features
-   Expanded profile functionality
-   Better UI/UX improvements
-   Performance optimizations
-   More robust API validation and error handling

------------------------------------------------------------------------

# Status

**Work in Progress**

This project is an ongoing development project intended to explore
full-stack architecture, authentication systems, and media-based
applications.

Features and implementation details may change as development continues.
