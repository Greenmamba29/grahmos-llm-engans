# Environment Variables Setup Guide

This guide helps you obtain and configure all necessary API keys and environment variables for Grahmos.

## Required Variables

### 1. GROQ_API_KEY
**Purpose**: LLM inference (fast AI responses)

**How to get it**:
1. Go to https://console.groq.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create API Key"
5. Copy the key (starts with `gsk_...`)

**Cost**: Free tier available

---

### 2. OPENAI_API_KEY
**Purpose**: Text embeddings for semantic search

**How to get it**:
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

**Cost**: Pay-as-you-go (embeddings are cheap, ~$0.0001 per 1K tokens)

---

### 3. BRAVE_SEARCH_API_KEY
**Purpose**: Web search results (privacy-focused)

**How to get it**:
1. Go to https://brave.com/search/api/
2. Sign up for an account
3. Choose a plan (free tier available)
4. Navigate to dashboard
5. Copy your API key

**Cost**: Free tier: 2,000 queries/month

**Alternative**: Use Serper or Google Custom Search instead

---

### 4. SERPER_API
**Purpose**: Search, images, videos, maps, shopping

**How to get it**:
1. Go to https://serper.dev/
2. Sign up with Google
3. Navigate to "API Key"
4. Copy your key

**Cost**: Free tier: 2,500 queries

---

### 5. ALLOWED_ORIGINS
**Purpose**: CORS security for Webflow frontend

**Format**: Comma-separated list of domains
```
https://grahmos.webflow.io,https://www.grahmos.com,https://grahmos.com
```

**Important**: 
- Include `http://localhost:3000` for local development
- Use exact domains (https/http, www/non-www matter)
- No trailing slashes

---

## Optional Variables

### UPSTASH_REDIS (Rate Limiting)
**Purpose**: Prevent API abuse

**How to get it**:
1. Go to https://console.upstash.com/
2. Sign up
3. Create a new Redis database
4. Copy REST URL and Token

**Cost**: Free tier: 10,000 commands/day

---

### UPSTASH_VECTOR (Semantic Caching)
**Purpose**: Faster responses for repeated queries

**How to get it**:
1. Same as Upstash Redis
2. Create Vector database instead
3. Copy REST URL and Token

**Cost**: Free tier available

---

### PORTKEY_API_KEY (AI Gateway)
**Purpose**: Access multiple LLM providers

**How to get it**:
1. Go to https://portkey.ai/
2. Sign up
3. Navigate to API Keys
4. Create and copy key

---

### FAL_KEY (Image Generation)
**Purpose**: AI image generation with @mention

**How to get it**:
1. Go to https://fal.ai/
2. Sign up
3. Navigate to API Keys
4. Create and copy key

---

### SPOTIFY_CLIENT_ID & SECRET
**Purpose**: Music integration

**How to get it**:
1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Copy Client ID and Secret

---

## Setting Up in Vercel

### Method 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add each variable:
   - Name: `GROQ_API_KEY`
   - Value: `your_actual_key`
   - Environments: Production, Preview, Development
5. Click "Save"
6. Redeploy your project

### Method 2: Vercel CLI
```bash
vercel env add GROQ_API_KEY
# Enter value when prompted

# Or add from file
vercel env pull .env.local
```

---

## Setting Up Locally

### 1. Copy template
```bash
cp .env.example .env
```

### 2. Edit .env file
```bash
nano .env
# or
code .env
```

### 3. Fill in values
```bash
GROQ_API_KEY=gsk_your_actual_key_here
OPENAI_API_KEY=sk_your_actual_key_here
# ... etc
```

### 4. Test
```bash
npm run dev
# Visit http://localhost:3000/api/health
```

---

## Verification Checklist

- [ ] All required keys obtained
- [ ] Keys added to Vercel/local .env
- [ ] ALLOWED_ORIGINS includes your domain
- [ ] API health check passes
- [ ] Search endpoint works
- [ ] No CORS errors in browser

---

## Security Best Practices

### ✅ Do
- Keep API keys secret
- Use environment variables
- Rotate keys periodically
- Set up rate limiting
- Monitor usage
- Use least-privilege access

### ❌ Don't
- Commit .env to Git
- Share keys publicly
- Use production keys in development
- Hardcode keys in code
- Expose keys in frontend

---

## Cost Estimation

### Minimal Setup (Required only)
- **Groq**: Free tier (usually sufficient)
- **OpenAI**: ~$1-5/month (embeddings only)
- **Brave/Serper**: Free tier (2000-2500 queries)
- **Total**: ~$1-5/month

### Full Setup (All features)
- Add ~$5-10/month for optional services
- **Total**: ~$10-15/month

### High Traffic
- Groq: Pay-as-you-go
- OpenAI: ~$10-50/month
- Search: Paid tiers ($50-100/month)
- **Total**: $100-200/month (thousands of queries)

---

## Troubleshooting

### "Invalid API Key" Error
- Verify key is copied correctly (no spaces)
- Check key is active in provider dashboard
- Ensure key has correct permissions

### CORS Errors
- Check ALLOWED_ORIGINS includes exact domain
- Verify https vs http
- Include www if needed
- Redeploy after changing env vars

### Rate Limit Errors
- Check usage in provider dashboards
- Upgrade tier if needed
- Implement caching

---

## Getting Help

- Check provider documentation
- Review error messages
- Test endpoints individually
- Check browser console
- Verify environment variables are set

---

*Keep this document secure - it contains information about your API access*
