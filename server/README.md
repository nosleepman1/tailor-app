# TailleurPro API — Documentation Backend

Voir la documentation complète à la racine du projet : [README.md](../readme.md)

### Résumé Rapide :
- **Framework** : Laravel 12 / PHP 8.3+
- **Architecture** : Controller ➔ Service ➔ Repository
- **Authentification** : Sanctum + Spatie Roles & Permissions + Codes PIN hashés
- **Passerelle de paiement** : PayDunya (Checkout Invoices & Webhook IPN SHA-512)
- **Synchronisation Mobile** : Offline-First `/api/v2/sync/pull` & `/api/v2/sync/push`
- **Notifications Push** : Expo Push Notifications API

### Lancement Rapide :
```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```
