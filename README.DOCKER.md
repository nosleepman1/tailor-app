# TailleurPro — Lancer avec Docker

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé

## Démarrer l'application

```bash
docker compose up --build
```

- **Backend (API)** : http://localhost:8000
- **Frontend** : http://localhost:5173

## Arrêter

```bash
docker compose down
```

## Commandes utiles

| Action | Commande |
|--------|----------|
| Voir les logs | `docker compose logs -f` |
| Logs backend uniquement | `docker compose logs -f backend` |
| Logs frontend uniquement | `docker compose logs -f frontend` |
| Migrations | `docker compose exec backend php artisan migrate` |
| Seeder la base | `docker compose exec backend php artisan db:seed` |
| Ouvrir un shell backend | `docker compose exec backend sh` |
| Ouvrir un shell frontend | `docker compose exec frontend sh` |
