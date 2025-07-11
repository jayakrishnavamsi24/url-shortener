# Mini URL Shortener API

A simple backend API that allows users to shorten long URLs, redirect using a short code, and track usage with optional features like expiry and rate limiting.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- shortid (for generating short codes)
- express-rate-limit (for API rate limiting)
- dotenv

## Features

- Shorten long URLs
- Redirect using short codes
- Track click counts
- Auto-expire URLs (optional)
- Rate limiting to prevent abuse

## API Endpoints

### POST /shorten
Shortens a given long URL

#### Request Body
{
  "url": "https://example.com/long/path",
  "expiryMinutes": 10
}

#### Response
{
  "shortUrl": "https://short.ly/abc123"
}

### GET /:code
Redirects to the original long URL

If expired:
{
  "error": "Link has expired"
}

If invalid:
{
  "error": "Short URL not found"
}

## Setup Instructions

1. Clone the repo:
   git clone https://github.com/jayakrishnavamsi24/url-shortener
   cd url-shortener

2. Install dependencies:
   npm install

3. Create a .env file:
   MONGO_URI=your_mongodb_connection_string

4. Start server:
   npm run dev

The server runs on: http://localhost:5000

## Submission

- GitHub repo link
- (Optional) Postman collection file (if created)
