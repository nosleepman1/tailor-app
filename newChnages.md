# Agent Prompt — Tailor App Fixes & New Features

**Stack: Laravel + React | Mobile-First Web App**

---

## Ton rôle

Tu es un ingénieur fullstack senior spécialisé en applications mobile-first. Tu travailles sur une application de gestion de tailleurs construite avec Laravel (API) et React (frontend). Tu dois corriger une série de bugs, améliorer l'UX et ajouter de nouvelles fonctionnalités. Chaque décision que tu prends doit prioriser l'expérience mobile avant le desktop. L'interface doit avoir l'identité visuelle d'un développeur frontend expert — pas un rendu générique Material UI ou Bootstrap, mais quelque chose de personnel, soigné et professionnel.

---

## Contexte de l'application

L'app permet à des tailleurs de gérer leurs clients, leurs commandes, leurs événements (Korite, Tabaski, mariages, baptêmes, etc.) et leurs paiements. Il y a deux rôles : admin et tailleur. Chaque tailleur ne voit que ses propres données (scope par tailor_id). L'app existe déjà avec les fonctionnalités de base. Tu dois corriger et étendre ce qui existe.

---

## 1. Correction — Couleur du texte dans les champs de saisie

Les champs input, textarea et select ont un texte invisible selon le thème actif. Corrige cela en appliquant explicitement la couleur du texte sur tous les champs de saisie via les variables CSS du système de thème. Ne jamais laisser le navigateur décider la couleur par défaut. Applique également une couleur distincte aux placeholders. Assure-toi que la correction fonctionne aussi bien en mode clair qu'en mode sombre.

---

## 2. Correction — Le thème clair ne s'applique pas

Même quand l'utilisateur sélectionne le mode clair, l'interface reste en mode sombre. Corrige le système de thème de bout en bout. Le problème vient probablement de l'endroit où l'attribut de thème est appliqué dans le DOM, ou d'un conflit entre la valeur stockée dans le localStorage et celle lue au démarrage. Les règles à respecter : l'attribut de thème doit être appliqué sur l'élément racine du document HTML, la valeur persistée dans le localStorage doit être lue dès l'initialisation avant le premier rendu, et toutes les couleurs de l'application doivent être définies via des variables CSS qui réagissent à cet attribut. Aucune couleur ne doit être codée en dur dans les composants.

---

## 3. Correction — Navigation mobile : supprimer la sidebar, ajouter une barre de navigation en bas

Sur mobile (écrans inférieurs à 768px), la sidebar latérale ne doit pas apparaître. À la place, affiche une barre de navigation fixe en bas de l'écran, dans le style de WhatsApp ou Instagram. Cette barre doit contenir les destinations principales : Accueil, Clients, Commandes, Notifications, Profil. Elle doit rester visible en permanence au-dessus du contenu, respecter la zone de sécurité en bas sur iOS, et afficher un badge rouge avec le nombre de notifications non lues sur l'icône Notifications. Sur desktop (768px et plus), la sidebar latérale est conservée telle quelle.

---

## 4. Correction — Navigation : problème de retour aux écrans précédents

Les utilisateurs se retrouvent bloqués sans moyen de revenir à l'écran précédent. Chaque page de détail (détail client, détail commande, détail événement, formulaire de création) doit avoir un en-tête fixe en haut avec une flèche de retour. Ce bouton de retour doit utiliser l'historique de navigation réel et non un lien vers une route codée en dur. L'en-tête doit aussi afficher le titre de la page et, si nécessaire, une action secondaire à droite (modifier, supprimer, etc.).

---

## 5. Amélioration UI — Supprimer les bordures visibles, utiliser des ombres et des espacements

L'interface actuelle utilise trop de bordures visibles et de containers avec des bords marqués, ce qui donne un aspect de formulaire administratif des années 2010. Remplace ce traitement visuel par une approche moderne : les cartes n'ont pas de bordure visible mais une ombre légère et douce, les sections sont séparées par de l'espacement et des titres de section discrets en petites capitales, les éléments de liste sont séparés uniquement par une fine ligne horizontale interne et non par des cadres, les champs de formulaire ont un bord léger qui s'illumine en couleur primaire au focus, et les cartes interactives ont un léger effet de lévitation au survol. L'ensemble doit paraître aéré, propre et moderne.

---

## 6. Correction UX — Recherche : supprimer du tableau de bord, restreindre aux bons endroits

La barre de recherche ne doit pas apparaître sur la page d'accueil / tableau de bord. Elle doit exister uniquement dans deux endroits : la section Clients et la section Commandes. Dans les deux cas, la recherche doit filtrer par nom complet du client ou par numéro de téléphone. Aucune autre logique de recherche globale n'est nécessaire.

---

## 7. Nouvelle fonctionnalité — Gestion des avances et des compléments de paiement

Chaque commande doit permettre de suivre les paiements en plusieurs fois. Pour chaque commande, il faut pouvoir enregistrer un montant total, enregistrer une avance initiale au moment de la création, enregistrer un ou plusieurs compléments de paiement ultérieurs, voir le montant restant à payer à tout moment, et marquer une commande comme entièrement payée. Côté base de données, crée une table de paiements liée aux commandes avec le montant, le type (avance ou complément), une note optionnelle et la date du versement. Côté interface, dans le détail d'une commande, affiche un résumé clair : prix total, montant versé, solde restant, et une barre de progression visuelle. Un bouton permet d'enregistrer un nouveau paiement via un formulaire simple.

---

## 8. Amélioration — Kanban des commandes adapté au mobile

Le Kanban classique avec des colonnes horizontales est inutilisable sur mobile. Repense complètement son fonctionnement pour le mobile. Sur mobile, l'écran affiche une rangée de pills horizontaux scrollables en haut représentant chaque statut (En attente, En cours, Prêt, Livré, Annulé). Chaque pill indique le nombre de commandes dans ce statut. En dessous, les commandes du statut sélectionné s'affichent en cartes verticales empilées. Chaque carte montre le nom du client, l'événement lié, la date limite, le montant, et un bouton pour passer la commande au statut suivant. Sur desktop, le Kanban classique en colonnes horizontales est conservé. Les couleurs des statuts doivent être sémantiques et cohérentes dans toute l'application.

---

## 9. Amélioration UI — Tableau de bord tailleur : compacter la section "Récents & À venir"

La section des commandes récentes et à venir prend trop de place sur le tableau de bord et repousse les statistiques importantes hors de l'écran. Remplace cette section par un scroll horizontal compact de petites cartes, chacune montrant le nom du client, l'événement et la date limite. Un lien "Tout voir" redirige vers la page des commandes. Les boutons "Nouveau client" et "Nouvelle commande" doivent être transformés en un bouton d'action flottant (FAB) positionné en bas à droite, visible en permanence sans perturber le contenu du dashboard.

---

## 10. Amélioration UX & Backend — Création de commande intelligente

Actuellement, pour créer une commande pour un nouveau client, l'utilisateur doit d'abord aller créer le client, puis revenir créer la commande. Ce flux est trop long. Le formulaire de création de commande doit intégrer une logique en deux branches. Si le client existe déjà, l'utilisateur peut le rechercher directement dans le formulaire par nom ou téléphone et le sélectionner. Si le client n'existe pas encore, l'utilisateur peut basculer en mode "nouveau client" et remplir les informations de base du client directement dans le même formulaire de commande, sans changer de page. Côté backend, l'endpoint de création de commande doit accepter soit un identifiant de client existant, soit les données d'un nouveau client à créer au même moment. La création du client et de la commande doit se faire en une seule requête atomique.

---

## 11. Correction — Notifications : "undefined" dans le message et badge non mis à jour

### Problème A — Le nom du client apparaît comme "undefined"

Les notifications affichent "la commande pour undefined est due le...". Cela vient du fait que la relation client n'est pas chargée au moment où le message de notification est construit. La correction consiste à toujours charger la relation client (et événement) depuis la base de données avant de construire le texte de la notification. Le nom du client doit également être stocké directement dans les données de la notification pour ne pas dépendre d'une relation au moment de la lecture.

### Problème B — Le badge de notification ne disparaît pas après validation dans le Kanban

Quand une commande est passée au statut "Prêt" ou "Livré" via le Kanban, les notifications liées à cette commande doivent être automatiquement marquées comme lues côté backend. Côté frontend, toute action de changement de statut dans le Kanban doit déclencher un rafraîchissement de la liste des notifications afin que le badge se mette à jour immédiatement. Les notifications doivent être récupérées à intervalle régulier (polling toutes les 30 secondes minimum). Si Laravel Echo et Pusher sont configurés, utilise les événements broadcast pour un rafraîchissement en temps réel sans polling.

---

## Contraintes générales à respecter dans toutes les tâches

- Chaque tailleur ne peut accéder qu'à ses propres clients, commandes et paiements. Le tailor_id est toujours injecté côté serveur depuis l'utilisateur authentifié, jamais depuis le corps de la requête.
- Toutes les couleurs passent par des variables CSS. Aucune couleur codée en dur dans les composants React.
- Les écrans mobiles (moins de 768px) sont la priorité absolue. Le desktop est un bonus bien traité, pas l'inverse.
- Les transitions et animations doivent être subtiles (150 à 200ms), jamais excessives.
- Les états de chargement (skeletons), les états vides (empty states illustrés) et les erreurs (toasts) doivent être gérés sur chaque écran.
- Le code Laravel doit utiliser des policies pour toutes les autorisations. Ne jamais filtrer les données uniquement côté frontend.
- La palette de couleurs principale : terracotta chaud (#C4622D) comme couleur primaire, or doux (#D4A843) comme accent, fond clair ivoire (#FAF7F2), fond sombre brun chaud (#1A1714).

---

*Prompt destiné à un agent de développement — Application Tailor Management — Laravel + React — Mobile-First*
