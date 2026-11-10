# Malayalam AI — Text to Speech

A responsive Malayalam text-to-speech website built with Next.js and Sarvam AI.

## Requirements

- Node.js 20 or newer
- Sarvam AI API key

## Local setup

1. Install dependencies:

   npm install

2. Create a file named .env.local in the project root.

3. Add your API key:

   SARVAM_API_KEY=your_api_key

4. Start the development server:

   npm run dev

5. Open http://localhost:3000.

## Vercel deployment

1. Import this GitHub repository into Vercel.
2. Open Project Settings.
3. Select Environment Variables.
4. Add SARVAM_API_KEY with your private API key.
5. Deploy the project.

## Security

Never upload .env.local or expose your API key in frontend code.
The speech-generation request runs on the server.
