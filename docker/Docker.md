# Docker

[![Docker Automated build][docker-build-image]][docker-build-url] [![Docker Stars][docker-star-image]][docker-star-url] [![Docker pulls][docker-pull-image]][docker-pull-url]

## Requirements

- docker
- docker-compose

## Config

**Compose**

- docker-compose.dev.yml
- docker-compose.yml

**Modify Alinode AppId/Secret**

```yml
version: '3'
services: 
  news:
    environment:
      - EGG_ALINODE_APPID=appid
      - EGG_ALINODE_SECRET=secret
```

> to disable alinode, modify config/plugin.prod.js

**Change Port**

```yml
version: '3'
services: 
  news:
    ports:
      - ${PORT}:7001
```

## Develop

Setup mysql / redis / mongodb / egg-news

```bash
# start
docker-compose -f docker-compose.dev.yml up

# stop
docker-compose -f docker-compose.dev.yml down

# remove volume/cache
docker-compose -f docker-compose.dev.yml down -v
```

**Develop**:

```bash
export EGG_REDIS_PASSWORD=egg_news
export EGG_MONGODB_URL=mongodb://egg_news:egg_news@127.0.0.1:27017/egg_news
export EGG_PASSPORT_GITHUB_CLIENT_ID=${id}
export EGG_PASSPORT_GITHUB_CLIENT_SECRET=${secret}

npm i
npm run dev
```

## Deploy

Modify docker-compose.yml

**Run / Stop**

```bash
# start
docker-compose up -d

# stop
docker-compose down

# remove volume/cache
docker-compose down -v
```
