<div align="center">
  <img width="70" src="https://user-images.githubusercontent.com/49222186/134722810-b295aca2-2544-4cd1-b388-17b5320d8fea.png" alt="logo"/>
  <h3>Polygram API</h3>
  <p><b>The robust, scalable RESTful API powering the Polygram platform.</b></p>

  <a href="https://github.com/aromalanil/polygram-backend/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/aromalanil/polygram-backend"></a>&nbsp;&nbsp;
  <a href="https://github.com/aromalanil/polygram-backend/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/aromalanil/polygram-backend"></a>
</div>

<br />

The **Polygram API** serves as the backend engine for Polygram. It handles data persistence, complex business logic, secure authentication, and real-time push notification dispatching, built entirely with Node.js and Express.

---

## 🚀 Key Features

- **Secure Authentication**: Integrates both traditional email/password login (with secure hashing) and Google OAuth using JSON Web Tokens (JWT) for stateless session management.
- **Web Push Notifications**: Manages VAPID keys and push subscriptions, seamlessly pushing native updates to the client (e.g., new votes, followers) using `web-push`.
- **OTP & Email Integration**: Handles secure password resets and account verification via email using Resend.
- **Metadata Extraction**: Utilizes `link-preview-js` to generate dynamic previews for shared links with efficient HTTP caching strategies to minimize redundant requests.
- **RESTful Architecture**: Follows clean REST principles with clearly separated routes, controllers, and Mongoose models.

## 🛠 Tech Stack & Architecture

- **Runtime & Framework**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for object data modeling and validation.
- **Authentication**: `jsonwebtoken`, `bcryptjs`, and Google Auth Library.
- **Utilities**: `web-push` (Notifications), `resend` (Emails), `link-preview-js` (Scraping).

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- [Git](https://git-scm.com/)

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aromalanil/polygram-backend.git
   cd polygram-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables: Create a `.env` file in the root directory (see the [Environment Variables](#-environment-variables) table below).

4. Start the development server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

## ⚙️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the server in development mode using `nodemon` for auto-reloading. |
| `npm start` | Starts the Node server in production mode. |
| `npm run lint` | Lints all JavaScript files using ESLint. |
| `npm run lint:fix` | Automatically fixes fixable linting errors. |

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | The port for the server to listen on (e.g., `5000`) |
| `NODE_ENV` | `development` or `production` |
| `HOSTNAME` | The deployed URL of the server |
| `DATABASE_URL` | MongoDB connection string URI |
| `JWT_SECRET` | A long random string used to sign JWTs |
| `ALLOWED_ORIGINS` | Space-separated list of origins allowed via CORS |
| `GOOGLE_OAUTH_CLIENT_ID` | OAuth Client ID from Google Console |
| `GOOGLE_OAUTH_CLIENT_SECRET`| OAuth Client Secret from Google Console |
| `GOOGLE_REFRESH_TOKEN` | Refresh token from Google |
| `VAPID_PUBLIC_KEY` | Public key for push notifications generated via `web-push` |
| `VAPID_PRIVATE_KEY` | Private key for push notifications |
| `MASTER_PASSWORD` | Master password for adding system topics |

## 📖 API Documentation

The API endpoints are organized by resource. Below is an overview of the core endpoints.

<details>
<summary><strong>Users & Authentication (/api/users)</strong></summary>

- `POST /register` - Register a new user and trigger an OTP email.
- `POST /verify` - Verify user account using the OTP.
- `POST /login` - Authenticate via username/password and receive a JWT.
- `POST /logout` - Invalidate the current session.
- `POST /auth/google` - Authenticate via Google OAuth token.
- `POST /send-otp` - Trigger a password reset/verification OTP.
- `POST /forgot-password` - Reset password using OTP.
- `POST /change-password` - Update password while logged in.
- `POST /edit` - Update user profile details.
- `GET /:username` - Retrieve profile information of a specific user.
- `POST /profile_picture` - Upload/update user profile picture (base64 encoded).

</details>

<details>
<summary><strong>Questions & Polls (/api/questions)</strong></summary>

- `GET /` - Fetch paginated questions (supports filters like `following`, `topic`, `search`).
- `POST /` - Create a new question/poll.
- `GET /:id` - Fetch details of a specific question, including voting percentages.
- `DELETE /:id` - Delete a question authored by the current user.

</details>

<details>
<summary><strong>Topics (/api/topics)</strong></summary>

- `GET /` - Fetch available topics (supports `count` and `search` parameters).
- `GET /:id` - Get details of a single topic.
- `POST /follow` - Follow an array of topics.
- `POST /unfollow` - Unfollow an array of topics.

</details>

<details>
<summary><strong>Opinions & Voting (/api/opinions)</strong></summary>

- `GET /` - Fetch opinions for a specific `question_id`.
- `POST /` - Post an opinion (vote/comment) on a question.
- `POST /:id/upvote` - Upvote a specific opinion.
- `DELETE /:id/upvote` - Remove an upvote.
- `POST /:id/downvote` - Downvote a specific opinion.
- `DELETE /:id/downvote` - Remove a downvote.

</details>

<details>
<summary><strong>Pictures (/api/pictures)</strong></summary>

- `GET /:id` - Retrieve a previously uploaded picture by ID.

</details>

## 📜 License

This project is licensed under the [GNU GPL v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) - see the [LICENSE](LICENSE) file for details.
