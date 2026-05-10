# 🚀 QUICKSTART - 30 Seconds to Running

Just want to get it running? Here's the fastest way:

**Not sure which option to choose?** See **[WHICH-SETUP.md](WHICH-SETUP.md)**

## Choose Your Setup

### 🐳 Option 1: Docker Only (Easiest!)

**Prerequisites:** Just [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Start:**
```bash
docker-compose -f docker-compose.full.yml up -d
```

**No Node.js installation needed!** Everything runs in containers.

📖 [Full Docker Guide](DOCKER-FULL.md)

---

### 💻 Option 2: Node.js + Docker

**Prerequisites:** 
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 18+](https://nodejs.org/)

**Start:**

**On Linux/Mac:**
```bash
./start-local.sh
```

**On Windows:**
```bash
start-local.bat
```

**Or manually:**
```bash
npm run install:all
docker-compose up -d
cp .env.example .env
npm run local
```

## Open in Browser

Go to: **http://localhost:3000**

---

## Stop the App

### Option 1 (Docker Only):
```bash
docker-compose -f docker-compose.full.yml down
```

### Option 2 (Node.js + Docker):
Press `Ctrl+C` in the terminal

To stop the database:
```bash
docker-compose down
```

---

## Comparison

| Feature | Docker Only | Node.js + Docker |
|---------|-------------|------------------|
| Node.js install needed | ❌ No | ✅ Yes |
| Setup time | 🟢 3 min (first time) | 🟡 5 min (first time) |
| Startup time | 🟡 ~10 sec | 🟢 ~3 sec |
| Hot reload (dev) | ❌ No | ✅ Yes |
| Easiest cleanup | ✅ Yes | 🟡 Manual |
| Best for | Testing, simple use | Active development |

**Recommendation:** 
- **Just want to use it?** → Docker Only
- **Want to modify code?** → Node.js + Docker

---

## Next Steps

**Need more details?** 
- Docker setup: [DOCKER-FULL.md](DOCKER-FULL.md)
- Traditional setup: [LOCAL-SETUP.md](LOCAL-SETUP.md)

**Want to deploy to the cloud?** 
- See [README.md](README.md) for Vercel and Railway deployment options
