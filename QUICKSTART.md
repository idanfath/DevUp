# DevUp - Quick Start Guide 🚀

## Prerequisites Check

Before starting, ensure you have:
- ✅ PHP 8.2 or higher
- ✅ Composer installed
- ✅ Node.js 20.x or higher
- ✅ npm or pnpm installed
- ✅ Git installed

## 5-Minute Setup

### Step 1: Get Gemini API Key (2 minutes)

1. Go to https://makersuite.google.com/app/apikey
2. Click "Get API Key" or "Create API Key"
3. Copy the key (starts with `AIza...`)

### Step 2: Configure Environment (1 minute)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Gemini API key to `.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...your_key_here
   ```

3. Generate application key if not done:
   ```bash
   php artisan key:generate
   ```

### Step 3: Database Setup (1 minute)

The app uses SQLite by default (already configured in `.env.example`).

Run migrations:
```bash
php artisan migrate
```

Seed AI prompts:
```bash
php artisan db:seed --class=PromptSeeder
```

### Step 4: Build Frontend (1 minute)

```bash
# Install dependencies (if not done)
npm install

# Build for production
npm run build

# OR run in development mode
npm run dev
```

### Step 5: Start the App

```bash
# Start Laravel server
php artisan serve
```

Open http://localhost:8000 in your browser!

## First Battle Test

### Create Two Users

1. **Terminal 1:** Register as Player 1
   - Go to http://localhost:8000/register
   - Username: `player1`, Email: `player1@test.com`, Password: `password`

2. **Browser 2 (Incognito):** Register as Player 2
   - Go to http://localhost:8000/register
   - Username: `player2`, Email: `player2@test.com`, Password: `password`

### Battle!

**Player 1 (Host):**
1. Go to `/lobby`
2. Click "Create Lobby"
3. Copy the 6-character invite code (e.g., `ABC123`)
4. Wait for Player 2 to join
5. Click "Configure & Start Battle!"
6. Select:
   - Language: Python
   - Difficulty: Easy
   - Rounds: 1 Round
   - Type: Problem Solving
7. Click "Start Battle!"
8. Write simple code: `print("Hello")`
9. Click "Submit Solution"

**Player 2 (Guest):**
1. Go to `/lobby`
2. Click "Join Lobby"
3. Enter the invite code from Player 1
4. Wait for Player 1 to start
5. Write code: `print("World")`
6. Click "Submit Solution"

Both players will see results automatically!

## Troubleshooting

### "Gemini API request failed"

**Solution:** Check if your API key is correct in `.env`:
```bash
# Verify the key is set
php artisan config:clear
php artisan tinker
>>> config('services.gemini.api_key')
```

Should return your API key. If null, check `.env` file.

### "Column not found" error

**Solution:** Run migrations:
```bash
php artisan migrate:fresh
php artisan db:seed --class=PromptSeeder
```

⚠️ WARNING: `migrate:fresh` deletes all data!

### Frontend not updating

**Solution:** Rebuild assets:
```bash
npm run build
# Clear browser cache (Ctrl+Shift+Delete)
```

### Pages show 404

**Solution:** Routes might not be cached:
```bash
php artisan route:clear
php artisan route:cache
```

### "Database is locked"

**Solution:** SQLite issue, close all connections:
```bash
# Stop the server
# Delete database/database.sqlite
rm database/database.sqlite
# Recreate
touch database/database.sqlite
php artisan migrate:fresh
php artisan db:seed --class=PromptSeeder
```

## Development Commands

```bash
# Start everything (server + vite + queue)
composer dev

# Watch frontend changes
npm run dev

# Format PHP code
./vendor/bin/pint

# Run tests
php artisan test

# Clear all cache
php artisan optimize:clear

# View logs
tail -f storage/logs/laravel.log
```

## File Locations

```
Important Files:
├── .env                          ← Add GEMINI_API_KEY here
├── app/Services/GeminiService.php ← AI logic
├── app/Http/Controllers/
│   ├── LobbyController.php        ← Lobby management
│   └── BattleController.php       ← Battle logic
├── resources/js/pages/
│   ├── lobby.tsx                  ← Lobby UI
│   └── battle/
│       ├── configure.tsx          ← Game setup
│       ├── arena.tsx              ← Battle screen
│       └── results.tsx            ← Results page
└── database/
    ├── database.sqlite            ← Your database
    └── seeders/PromptSeeder.php   ← AI prompts
```

## Testing AI Evaluation

### Test 1: Perfect Code
```python
def sum_numbers(a, b):
    return a + b
```
Expected Score: 90-100

### Test 2: Working but Messy
```python
def sum_numbers(a,b):return a+b
```
Expected Score: 70-85

### Test 3: Buggy Code
```python
def sum_numbers(a, b):
    return a - b  # Wrong operator!
```
Expected Score: 30-50

### Test 4: Empty/Wrong
```python
# I don't know
```
Expected Score: 0-20

## Understanding the Game Flow

```
Step 1: LOBBY
├─ Host creates lobby → Gets code (e.g., "XYZ789")
└─ Guest enters code → Joins lobby

Step 2: CONFIGURATION (Host only)
├─ Select language (Python, JS, Java, etc.)
├─ Choose difficulty (Easy, Medium, Hard)
├─ Pick rounds (1, 3, 5, or 7)
└─ Choose type (Debug or Problem Solving)

Step 3: BATTLE ARENA (Both players)
├─ AI generates challenge
├─ Players write code
├─ Submit for evaluation
├─ AI scores (0-100 points)
└─ Repeat for remaining rounds

Step 4: RESULTS
├─ Show winner
├─ Display all scores
├─ Compare code side-by-side
└─ Show AI feedback
```

## API Endpoints Reference

```
Public Routes:
├─ GET  /                          ← Landing page
├─ GET  /login                     ← Login
└─ POST /register                  ← Register

Authenticated Routes:
├─ GET  /lobby                     ← Lobby list
├─ POST /lobby/create              ← Create lobby
├─ POST /lobby/join                ← Join lobby
├─ POST /lobby/leave               ← Leave lobby
│
├─ GET  /battle/{id}/configure     ← Setup game
├─ POST /battle/{id}/start         ← Start battle
├─ GET  /battle/{id}/play          ← Arena
├─ GET  /battle/{id}/state         ← Live updates (JSON)
├─ POST /battle/{id}/submit        ← Submit code
└─ GET  /battle/{id}/results       ← Results page
```

## Feature Checklist

### ✅ Working Features
- [x] User registration and login
- [x] Create and join lobbies
- [x] Real-time lobby updates (polling)
- [x] Game configuration
- [x] AI challenge generation
- [x] Code submission
- [x] AI code evaluation (0-100 points)
- [x] Multi-round battles
- [x] Score tracking
- [x] Winner determination
- [x] Results with code comparison
- [x] XP and stats updates
- [x] Win streak tracking

### 🎮 Game Modes
- [x] Debug Challenge (fix buggy code)
- [x] Problem Solving (code from scratch)

### 🌐 Supported Languages
- [x] Python
- [x] JavaScript
- [x] TypeScript
- [x] Java
- [x] C++
- [x] C#
- [x] Go
- [x] Rust
- [x] PHP
- [x] Ruby

## Success Indicators

### ✅ App is Working if:
1. You can register and login
2. Lobby page loads without errors
3. Create lobby generates a 6-character code
4. Another user can join with that code
5. Host can configure and start battle
6. Arena page shows challenge
7. Submit button works
8. Score appears after submission
9. Results page shows winner
10. User XP increases

### ❌ Something's Wrong if:
1. "Column not found" → Run migrations
2. Blank pages → Build frontend (`npm run build`)
3. 404 errors → Clear route cache
4. "API key not found" → Set `GEMINI_API_KEY` in `.env`
5. Database locked → Restart server

## Support

Need help? Check:
1. `storage/logs/laravel.log` for PHP errors
2. Browser Console (F12) for JavaScript errors
3. `IMPLEMENTATION.md` for detailed docs
4. Run `php artisan route:list` to verify routes

## Next Steps

Once everything works:
1. ⭐ Try all 10 programming languages
2. 🏆 Test different difficulty levels
3. 🎮 Play both game types (Debug & Problem Solving)
4. 📊 Check if stats update correctly
5. 🚀 Deploy to production (see deployment guide)

---

**That's it! You're ready to battle!** 🎮

Start coding, compete, and level up! 💪
