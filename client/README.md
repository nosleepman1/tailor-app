# TailleurPro — Frontend React

Frontend complet de l'application de gestion de tailleurs.

## Stack

- **React 18** + Vite
- **Tailwind CSS** (mobile-first, dark theme)
- **Axios** + intercepteurs Bearer Token
- **React Router v6** (lazy loading + routes protégées)
- **Chart.js / react-chartjs-2** (dashboards)
- **Workbox / vite-plugin-pwa** (PWA + offline)
- Mode **offline** avec file d'attente + auto-sync

---

## Installation

```bash
cd client
cp .env.example .env        # Configurer VITE_API_URL
npm install
npm run dev
```

## Build production

```bash
npm run build
```

---

## Architecture

```
src/
├── api/
│   └── axios.js              # Instance Axios + intercepteurs Bearer Token
├── services/
│   ├── authService.js        # login / logout / getProfile
│   ├── clientService.js      # CRUD clients (multipart/form-data)
│   └── userService.js        # CRUD utilisateurs + toggleActive
├── hooks/
│   ├── useClients.js         # État clients + offline queue
│   └── useUsers.js           # État utilisateurs
├── contexts/
│   └── AuthContext.jsx       # isAuthenticated, user, token, login(), logout()
├── routes/
│   └── AppRouter.jsx         # Routes lazy + ProtectedRoute + RoleRedirect
├── components/
│   ├── Layout.jsx            # Wrapper page avec Navbar
│   ├── Navbar.jsx            # Sidebar desktop + bottom nav mobile
│   ├── ClientCard.jsx        # Carte client réutilisable
│   ├── StatCard.jsx          # Carte statistique dashboard
│   ├── ConfirmModal.jsx      # Modal de confirmation
│   ├── OfflineBanner.jsx     # Bannière hors ligne + sync feedback
│   └── Loader.jsx            # Spinner + full screen loader
├── pages/
│   ├── Login.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx     # Stats globales + charts
│   │   ├── Users.jsx         # CRUD utilisateurs + toggle actif
│   │   └── Clients.jsx       # Vue lecture tous clients
│   └── client/
│       ├── Dashboard.jsx     # Stats perso + chart evolution
│       ├── Clients.jsx       # Liste clients + recherche + delete
│       └── ClientForm.jsx    # Formulaire 3 étapes
└── utils/
    ├── offlineQueue.js       # localStorage queue
    └── syncManager.js        # Auto-sync au retour en ligne
```

---

## Fonctionnement du mode offline

1. Lorsque `navigator.onLine === false`, les opérations (create/update/delete) sont stockées dans `localStorage` via `offlineQueue`
2. Un `OfflineBanner` s'affiche en haut de l'écran
3. Au retour en ligne, `syncManager` rejoue automatiquement toutes les requêtes en attente
4. Un feedback de synchronisation confirme la réussite

---

## Rôles

| Rôle    | Accès |
|---------|-------|
| `admin` | `/admin/dashboard`, `/admin/users`, `/admin/clients` |
| `client` (tailleur) | `/dashboard`, `/clients`, `/clients/new`, `/clients/:id/edit` |

---

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL de base de l'API (ex: `http://localhost:8000/api/v1`) |
