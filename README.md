# Trouve ton artisan

Devoir CEF : annuaire des artisans de la région Auvergne-Rhône-Alpes.

## Technologies

React, React Router, Bootstrap, Sass, Node.js, Express, Sequelize et MySQL/MariaDB.
Le code utilise des composants fonctionnels, des états React et des routes Express simples.

## Prérequis

- Node.js 22.12 ou plus récent et npm.
- MySQL 8 ou MariaDB 10.6 ou plus récent.
- Un accès administrateur à la base pour importer les scripts.
- Un compte SMTP pour envoyer les courriels.
- VS Code peut servir à ouvrir et modifier le projet.

## Installation

1. Ouvrir le dossier du projet dans un terminal.
2. Exécuter : `npm ci`.
3. Avec le client MySQL/MariaDB connecté en administrateur, exécuter dans l'ordre :

```sql
SOURCE database/create.sql;
SOURCE database/seed.sql;
CREATE USER 'artisan_app'@'localhost' IDENTIFIED BY 'REMPLACER_PAR_UN_MOT_DE_PASSE_FORT';
GRANT SELECT ON trouve_ton_artisan.* TO 'artisan_app'@'localhost';
```

Les scripts s'importent une seule fois dans une base vide. Ils créent 4 catégories,
15 spécialités et les 17 artisans du fichier fourni. Adapter l'hôte du compte SQL
si le serveur MySQL est distant. Ne pas utiliser le compte administrateur pour le site.

4. Copier `.env.example` vers `.env`.
5. Renseigner les variables DB et SMTP dans `.env`.

## Lancement en développement

Dans un premier terminal : `npm start` (serveur et API, port 3001).

Dans un deuxième terminal : `npm run dev`.

Ouvrir **http://localhost:5173**. Garder APP_ORIGIN=http://localhost:5173.
Vite transfère les requêtes /api au serveur Express.

## Envoi de courriels

Renseigner SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD et SMTP_FROM.
Utiliser une adresse expéditrice autorisée par le fournisseur SMTP.
SMTP_SECURE=true convient au port 465 ; le port 587 utilise normalement STARTTLS.
En production, le serveur exige TLS pour l'envoi. Ne jamais désactiver la vérification
des certificats. Le visiteur devient le Reply-To ; le destinataire vient de la base.
Sans configuration SMTP, le formulaire affiche une erreur, jamais un faux succès.
Les données du devoir contiennent des adresses d'exemple : ne pas leur envoyer de tests.

## Mise en ligne

Choisir un hébergement qui exécute Node.js et une base MySQL/MariaDB.

1. Importer les deux scripts SQL sur la base distante.
2. Installer les dépendances avec `npm ci`, puis construire avec `npm run build`.
3. Configurer les variables d'environnement sur l'hébergeur :
   NODE_ENV=production, APP_ORIGIN=https://adresse-du-site, DB_* et SMTP_*.
4. Lancer `npm start`. Express sert le dossier dist et l'API sur le même domaine.
5. Activer HTTPS sur l'hébergement et limiter l'accès réseau à MySQL.
6. Définir TRUST_PROXY au nombre exact de proxys de confiance (souvent 1,
   à confirmer auprès de l'hébergeur) pour les limitations de requêtes.
7. Vérifier une fiche ouverte directement, la recherche et un envoi vers une boîte de test.

**Site déployé : https://trouveartisan.alwaysdata.net/ sur alwaysdata Free.**
MariaDB 11.8 contient les 4 catégories, 15 spécialités et 17 artisans. Le compte
SQL est limité à la lecture. Le SMTP TLS (port 465) est configuré : authentification
vérifiée et message de test vers la propre boîte du projet accepté (réponse 250).
Aucun test n’a été envoyé aux artisans de la formation.

L’offre gratuite impose le sous-domaine alwaysdata.net. Le domaine Twinmistudio
initialement prévu n’est pas utilisé. Le build distant a été arrêté par une limite
de ressources ; la branche GitHub `deployment` contient le build local vérifié.
Pour mettre à jour le site, construire localement, transférer dist et les sources
modifiées, puis redémarrer le site dans Web → Sites.

Configuration du site alwaysdata : type Node.js, version 24, commande
`node server/index.js`, répertoire de travail `trouve-ton-artisan`.
Conserver le PORT fourni par alwaysdata. APP_ORIGIN vaut
https://trouveartisan.alwaysdata.net et TRUST_PROXY vaut 1 sur ce déploiement.
Les accès SQL et SMTP sont uniquement dans le .env privé du serveur, absent du ZIP.
Ne pas réimporter les scripts dans les bases distantes déjà alimentées.

## Police Graphik

Les fichiers Trial fournis sont inclus dans le ZIP pour l'usage personnel local.
Leur notice indique « Personal Use Only ». Ils sont exclus du dépôt public.
Pour un site public, fournir une licence web et placer les fichiers autorisés dans
public/fonts, puis adapter les deux @font-face si les noms changent.
Sans fichiers, Arial sert de police de secours.
Dans Figma, installer Graphik et le service de polices Figma pour modifier les textes ;
l'environnement du connecteur ne disposait pas de cette police.

## Vérifications

- `npm test` : validation des champs, limites et injection d'en-têtes.
- `npm run build` : compilation React et Sass.
- `npm audit` : surveillance des dépendances.
- Voir docs/verification.md pour les contrôles d'intégration et de HTML.
- W3C CSS (profil par défaut CSS3 + SVG) : 0 erreur, 498 avertissements ; rapports dans docs/validation.

## Organisation

- src/main.jsx : composants, pages, navigation, formulaire et appels API.
- src/style.scss : couleurs, typographie et dispositions responsive.
- server/models.js : tables Sequelize et associations.
- server/index.js : routes, protections et envoi SMTP.
- server/validation.js : validation du formulaire.
- database/create.sql et database/seed.sql : création et alimentation de la base.
- docs : dossier, preuves de validation et captures.

## Liens

- [Maquettes Figma complètes](https://www.figma.com/design/aLEK2PR87VNLpFY1KOIhYz)
- [Dépôt GitHub](https://github.com/SoulReaper67/Cr-ez-le-site-Web-Trouve-ton-artisan-avec-React.JS)
- [Site en ligne](https://trouveartisan.alwaysdata.net/)

## Points à comprendre pour présenter le devoir

React affiche les données récupérées avec fetch. React Router choisit la page selon
l'URL. Bootstrap fournit la grille ; Sass personnalise les styles.
Express reçoit la demande, Sequelize lit MySQL et renvoie les données publiques.
Le formulaire envoie les champs au serveur ; Nodemailer remet le message au SMTP.
La clé de l'API interne reste exclusivement dans Node et ne figure jamais dans React.
