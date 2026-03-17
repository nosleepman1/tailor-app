# Prompt Professionnel -- Frontend React + Tailwind + PWA (Application Gestion de Tailleurs)

Tu es un **expert Senior Frontend Engineer spécialisé en React, Tailwind
CSS et Axios**, avec une forte expérience en **architecture scalable et
Progressive Web Apps (PWA)**.

Je veux que tu développes **le frontend complet d'une application web de
gestion de tailleurs** qui consomme une API backend développée avec
**Laravel** utilisant l'authentification via **Laravel Sanctum (Bearer
Token)**.

L'application doit être **mobile-first**, modulaire et optimisée pour
fonctionner **offline avec synchronisation automatique à la
reconnexion**.

------------------------------------------------------------------------

# 1. Stack Technique

Utilise les technologies suivantes :

-   React
-   Tailwind CSS
-   Axios
-   React Router
-   Vite
-   Workbox pour la PWA
-   IndexedDB ou localStorage pour le mode offline

Architecture **mobile-first**.

------------------------------------------------------------------------

# 2. Contexte Backend

Le backend expose une API REST.

## Authentification

POST /api/v1/login

Retourne un **Bearer Token Sanctum**.

------------------------------------------------------------------------

## Users

GET /api/v1/users\
POST /api/v1/users\
PUT /api/v1/users/{id}\
DELETE /api/v1/users/{id}

------------------------------------------------------------------------

## Clients

GET /api/v1/clients\
POST /api/v1/clients\
PUT /api/v1/clients/{id}\
DELETE /api/v1/clients/{id}

------------------------------------------------------------------------

# 3. Structure des données

## Users

-   id
-   firstname
-   lastname
-   username
-   email
-   password
-   role (admin ou client) - default client
-   is_active


------------------------------------------------------------------------

## Clients (clients des tailleurs)

-   id
-   firstname
-   lastname
-   firstname
-   phone
-   price

### mesures

-   epaule
-   taille
-   poitrine
-   hanches
-   manches
-   cou
-   cuisse
-   bras
-   pantalon
-   biceps
-   fesses



### autres champs

-   model_image
-   tissus_image

------------------------------------------------------------------------

# 4. Rôles

## Admin

-   gère les utilisateurs (+ desactivation compte utilisateur)
-   peut voir tous les clients

## Client (tailleur)

-   peut ajouter ses propres clients
-   gérer leurs mesures
-   voir leurs commandes

------------------------------------------------------------------------

# 5. Architecture React (IMPORTANT)

Le code doit être **très modulaire et scalable**.

Structure recommandée :

    src/

    api/
      axios.js

    services/
      authService.js
      clientService.js
      userService.js

    hooks/
      useAuth.js
      useClients.js
      useUsers.js

    contexts/
      AuthContext.jsx

    pages/
      Login.jsx
      Dashboard.jsx
      Clients.jsx
      ClientForm.jsx
      Users.jsx

    patie pages/ separees en admin et client (+ dashboard pour chacun avec chart js)

    components/
      ClientCard.jsx
      ClientForm.jsx
      Navbar.jsx
      ProtectedRoute.jsx
      Loader.jsx

    utils/
      offlineQueue.js
      syncManager.js

    pwa/
      serviceWorker.js

    routes/
      AppRouter.jsx

------------------------------------------------------------------------

# 6. Gestion des appels API

Créer un **dossier services** pour les appels API avec Axios.

Exemple :

services/clientService.js

Fonctions :

-   getClients()
-   createClient()
-   updateClient()
-   deleteClient()

------------------------------------------------------------------------

# 7. Hooks personnalisés

Créer des hooks personnalisés pour consommer les services.

Exemple :

useClients()

Retour :

    {
     data,
     loading,
     error,
     createClient,
     updateClient,
     deleteClient
    }

Même logique pour :

-   useAuth()
-   useUsers()

------------------------------------------------------------------------

# 8. Authentification

Utiliser un **AuthContext**.

Fonctionnalités :

-   isAuthenticated
-   user (object with all user datas)
-   token
-   login()
-   logout()

Le token doit être :

-   stocké dans **localStorage**
-   injecté automatiquement dans Axios

Header Axios :

Authorization: Bearer TOKEN

TOKEN necessaire sur les requetes liees liees au clients comme ajouter modifier supprimer client

------------------------------------------------------------------------

# 9. Routes protégées

Créer un composant :

ProtectedRoute

Qui :

-   vérifie `isAuthenticated`
-   redirige vers `/login` si non connecté

Utiliser **React Router**.

------------------------------------------------------------------------

# 10. Fonctionnalité PWA

L'application doit être installable sur mobile.

Fonctionnalités :

-   manifest.json
-   service worker
-   cache des assets
-   offline support

Utiliser **Workbox**.

------------------------------------------------------------------------

# 11. Mode Offline

Lorsque l'utilisateur est offline :

-   les créations / modifications de clients sont stockées localement
-   les requêtes sont mises dans une **file d'attente**

Utiliser :

-   IndexedDB ou localStorage

Structure :

    offlineQueue = [
     { type: "createClient", payload: {...} },
     { type: "updateClient", payload: {...} }
    ]

------------------------------------------------------------------------

# 12. Synchronisation

Quand internet revient :

1.  détecter navigator.onLine
2.  envoyer toutes les requêtes en attente
3.  vider la queue

Créer :

utils/syncManager.js

------------------------------------------------------------------------

# 13. UI / UX

Interface **mobile-first** avec Tailwind.

## Pages

### Login

-   email
-   password

### Dashboard

-   statistiques
-   nombre de clients

### Clients

-   liste des clients
-   recherche
-   bouton ajouter

### Formulaire Client

Champs :

-   firstname
-   lastname
-   firstname
-   phone
-   price


-   epaule
-   taille
-   poitrine
-   hanches
-   manches
-   cou
-   cuisse
-   bras
-   pantalon
-   biceps
-   fesses


-   model_image
-   tissus_image


ajout en 3 etapes alors
------------------------------------------------------------------------

# 14. Optimisations

-   Lazy loading des pages
-   composants réutilisables
-   hooks personnalisés
-   architecture claire
-   gestion d'erreurs

------------------------------------------------------------------------

# 15. Ce que je veux que tu génères

Génère :

1.  l'architecture complète du projet
2.  tous les fichiers principaux
3.  AuthContext
4.  configuration Axios
5.  hooks personnalisés
6.  services API
7.  ProtectedRoute
8.  Offline Queue
9.  Service Worker PWA
10. UI React + Tailwind
11. le fichier react avec tailwind est deja initialisé dans ./client/

Le code doit être **propre, maintenable et prêt pour production**.
