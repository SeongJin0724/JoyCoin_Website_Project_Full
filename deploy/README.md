# Deployment Guide

## 1) Prepare env file
```bash
cp deploy/env/.env.sample deploy/env/.env
```

Update at least:
- `JWT_SECRET`
- `CORS_ORIGINS` (include your real frontend origin(s))
- optional admin/token/telegram values

## 2) Start production stack
```bash
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/env/.env up -d --build
```

## 3) Verify
- Frontend: `http://<HOST_IP>:3000`
- Backend health: `http://<HOST_IP>:8000/healthz`
- API docs: `http://<HOST_IP>:8000/docs`

## 4) Stop
```bash
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/env/.env down
```

## Notes
- This stack is production-mode for both frontend and backend.
- Frontend is built with `NEXT_PUBLIC_API_BASE_URL` at image build time.
- For mobile testing on LAN, include your LAN origin in `CORS_ORIGINS`, e.g. `http://192.168.0.25:3000`.
