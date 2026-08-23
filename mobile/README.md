# 📱 TailleurPro Mobile — Application Native Expo SDK 54 (TypeScript)

Application mobile officielle pour les artisans tailleurs et maisons de couture, construite avec **React Native**, **Expo SDK 54**, et **TypeScript**.

---

## 🎨 Philosophie de Design (Couture & Luxe)

L'application reprend fidèlement l'identité visuelle haut de gamme de l'atelier :
- **Palette** :
  - Mode Clair : Ivoire doux (`#FDFBF7`), Blanc pur (`#FFFFFF`), Bleu nuit ardoise (`#2C3E50`), Or chaud (`#D4AF37`).
  - Mode Sombre (Soirée) : Noir profond (`#121212`), Gris anthracite (`#1E1E1E`), Or éclatant (`#FFD700`).
- **Composants** : Cartes avec ombres douces, badges de statut arrondis, retour haptique sur chaque touche du pavé numérique PIN et transitions d'état.

---

## ✨ Fonctionnalités Natives & Clés

1. ⚡ **Authentification Ultra-Rapide** : Saisie par code PIN à 4 chiffres sur pavé numérique interactif avec retour haptique, ou par email & mot de passe.
2. 📐 **Fiches Mensurations Précises** : Saisie et historique des 10 mensurations clés (Cou, Poitrine, Épaule, Bras, Ventre, Boubou, Pantalon, Hanches, Cuisse, Biceps).
3. 📸 **Prise de Photos Tissus & Modèles** : Déclenchement natif de l'appareil photo (`expo-camera`) ou sélection dans la galerie photo (`expo-image-picker`).
4. 🔔 **Notifications Push avec Son Personnalisé** : Enregistrement du token push auprès du backend pour recevoir les alertes d'échéances et de commandes prêtes.
5. 📴 **Mode Hors-Ligne & Synchronisation Delta** : Fonctionnement fluide sans connexion internet en atelier avec synchronisation delta descendante (`/api/v2/sync/pull`) et montante (`/api/v2/sync/push`).
6. 💳 **Paiement d'Abonnement PayDunya** : Souscription aux forfaits Basique (2500 FCFA) et Pro (5000 FCFA) avec ouverture du portail de paiement et confirmation automatique.

---

## 🚀 Démarrage Rapide

```bash
# 1. Installation des dépendances
npm install

# 2. Lancement du serveur de développement Expo
npx expo start

# 3. Lancement direct sur simulateur ou appareil physique
npx expo start --android # Pour Android
npx expo start --ios     # Pour iOS
```
