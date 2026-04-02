# Guide de Déploiement : Tailleur App Backend sur Oracle Cloud (Gratuit à vie)

Ce guide détaille les étapes exactes pour héberger gratuitement et professionnellement le backend de **Tailleur App** (Laravel + Redis + Docker) sur un VPS Oracle Cloud "Always Free".

---

## Étape 1 : Créer votre serveur (VPS) sur Oracle Cloud

1. Allez sur **[Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)** et créez un compte (une carte bancaire est demandée pour vérifier l'identité, mais vous ne serez jamais facturé si vous choisissez les options "Always Free").
2. Dans le tableau de bord principal, cliquez sur **"Create a VM instance"**.
3. **Image & Shape** :
   - Image : Choisissez **Ubuntu 22.04** ou **24.04**.
   - Shape : Cliquez sur `Ampere` (ARM) et mettez **4 OCPUs** et **24 Go de RAM** (C'est le maximum "Always Free", une vraie bête de course !).
4. **Networking** : Laissez la création automatique du réseau (VCN).
5. **SSH Keys** : C'est **TRÈS IMPORTANT**. Téléchargez la clé privée (`.key` ou `.pem`) générée par Oracle. Ne la perdez jamais, elle remplace le mot de passe !
6. Cliquez sur **"Create"**. En 2 minutes, votre serveur aura une adresse IP Publique (ex: `192.168.x.x`).

---

## Étape 2 : Ouvrir les "Portes" d'Oracle (Ports réseau)

Par défaut, Oracle bloque internet (le fameux Port 80 et 443).
1. Cliquez sur le nom de votre serveur fraîchement créé > **Attached VNICs** > puis cliquez sur le lien sous **Subnet**.
2. Allez dans **Security Lists** > Cliquez sur la liste par défaut (Default Security List).
3. Ajoutez une "Ingress Rule" :
   - **Source CIDR**: `0.0.0.0/0`
   - **Destination Port Range**: `80` (Pour le trafic HTTP)
   - *Optionnel : Ajoutez une autre règle pour le port `443` (HTTPS) et `8000` si vous voulez tester directement.*

---

## Étape 3 : Se connecter à votre tout nouveau serveur

1. Ouvrez un terminal sur votre machine Windows (Git Bash ou PowerShell).
2. Connectez-vous via SSH en utilisant la clé téléchargée à l'étape 1 :
   ```bash
   ssh -i "chemin_vers_votre_cle_privee.key" ubuntu@IP_PUBLIQUE_ORACLE
   ```

---

## Étape 4 : Préparer le terrain (Installer Docker & Git)

Une fois connecté (vous verrez `ubuntu@instance...`), tapez ceci ligne par ligne pour préparer le serveur :

```bash
# 1. Mettez votre serveur à jour
sudo apt update && sudo apt upgrade -y

# 2. Installez Docker et Docker Compose
sudo apt install docker.io docker-compose -y

# 3. Donnez-vous le droit d'utiliser docker sans le mot de passe "sudo"
sudo usermod -aG docker ubuntu
```
*(Après ça, tapez `exit` pour vous déconnecter en douceur, et reconnectez-vous avec `ssh ...` pour que l'installation de Docker prenne effet).*

---

## Étape 5 : Récupérer votre code Backend

Le plus simple est d'utiliser Git (créez un dépôt privé sur Github ou Gitlab avec juste le dossier `server/`, `Dockerfile.backend` et `docker-compose.yml`) :

```bash
# Clonez votre code depuis votre dépôt privé
git clone https://github.com/votre_nom/tailleur-backend.git
cd tailleur-backend

# Copiez le fichier d'environnement d'exemple
cp server/.env.example server/.env
```

---

## Étape 6 : Configurer `.env` pour la Production

Éditez votre `.env` directement sur le serveur avec l'éditeur `nano` :
```bash
nano server/.env
```

Assurez-vous d'avoir ces paramètres cruciaux pour la production :
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=http://VOTRE_IP_PUBLIQUE:8000` *(et plus tard `https://votredomaine.com`)*
- `REDIS_HOST=redis` *(Très important pour que Laravel trouve le conteneur Docker Redis)*
- `CACHE_STORE=redis`
- `QUEUE_CONNECTION=redis` *(Indispensable pour vos alertes Push PWA fluides en arrière-plan)*
- N'oubliez pas de mettre vos **vraies clés VAPID** et **clés live DexPay** !

*(Faites `Ctrl+O` puis `Entrée` pour sauvegarder, puis `Ctrl+X` pour quitter l'éditeur).*

---

## Étape 7 : Lancement spatial (Le moment de vérité)

Lancez simplement la commande magique de production depuis le dossier racine :
```bash
docker-compose up -d --build
```
Docker va faire tout le travail compliqué :
1. Télécharger Redis et le lancer de matière sécurisée.
2. Construire l'image PHP/SQLite/Laravel automatiquement.
3. Exécuter les migrations de la base de données.
4. Lancer le backend !

---

## Étape 8 : Activer les Workers Laravel (Job en tâche de fond)

Pour que la File d'attente (vos notifications Push différées pour ne pas ralentir le serveur) fonctionne de jour comme de nuit, indiquez à Laravel d'écouter les jobs Redis pour toujours :

```bash
docker-compose exec backend php artisan queue:work --daemon &
```

> **Félicitations ! 🎉**
> Votre API backend est maintenant pleinement déployée, connectée à sa base de données et à son cache Redis ultra-rapide.\n> Elle est accessible publiquement sur `http://VOTRE_IP_PUBLIQUE:8000` (ou le port que vous avez assigné à Nginx). 
> 
> *La prochaine et ultime étape (le jour où vous êtes prêt à lier le frontend Vercel au Backend) : Louer un nom de domaine (Ex: `api.tailleurapp.com`) à 1€ par an, et le lier à cette IP via Cloudflare ou Nginx Proxy Manager pour obtenir gratuitement la clé précieuse d'un réseau `HTTPS` !*
