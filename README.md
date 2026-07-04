# NIV Subject Search — Bible App

Search the **New International Version (NIV)** by subject. Enter topics like *love*, *peace*, *forgiveness*, or *anxiety* to discover relevant verses curated from 30+ life themes, plus full-text NIV search.

## Features

- **Subject search** — 30 curated topics with keyword matching (love, faith, hope, grief, parenting, and more)
- **NIV verse text** — Full passages loaded through [API.Bible](https://scripture.api.bible)
- **Quick topics** — One-click chips for popular subjects
- **Copy verses** — Copy any result with reference included

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Get a free API key** from [scripture.api.bible/signup](https://scripture.api.bible/signup)

3. **Configure environment**

   ```bash
   copy .env.example .env
   ```

   Edit `.env` and set your key:

   ```
   VITE_BIBLE_API_KEY=your_api_key_here
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

5. Open the URL shown in the terminal (usually `http://localhost:5173`)

## How search works

1. Your query is matched against **30 topical indexes** (keywords + subject names)
2. Matching topics return their curated verse references
3. A parallel **NIV full-text search** runs through API.Bible
4. Results are merged and deduplicated

Without an API key, you'll still see matched topics and passage references, but verse text requires the key.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |

## License note

NIV text is copyrighted by **Biblica, Inc.** and is accessed through API.Bible under their terms. This app does not bundle NIV text locally.
