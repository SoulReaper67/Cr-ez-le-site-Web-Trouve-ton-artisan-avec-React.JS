
## 


Application, maquettes, modélisation des données, sécurité et vérifications.

<b>État du livrable :</b> projet fonctionnel et vérifié en local. La mise en ligne sur le domaine fourni et la configuration SMTP de production restent à confirmer. Ces points sont explicités page 14.

Sommaire


## Sommaire


Contexte et brief de mission <b> / 3</b>

Architecture et parcours utilisateur <b> / 4</b>

Base de données : MCD et MLD <b> / 5</b>

Sécurité : mesures mises en place <b> / 6</b>

Sécurité : veille et corrections <b> / 7</b>

Vérifications du projet <b> / 8</b>

Maquettes : accueil sur ordinateur <b> / 9</b>

Maquettes : liste et recherche <b> / 10</b>

Maquettes : fiche et pages légales <b> / 11</b>

Rendu responsive : mobile <b> / 12</b>

Rendu responsive : tablette <b> / 13</b>

Liens et finalisation de la remise <b> / 14</b>

Les captures servent à présenter la conception. Les images en pleine définition et les liens de chacune des 27 vues sont joints au projet dans docs/maquettes.

Contexte et brief de mission


## Contexte et brief de mission


Présentation du commanditaire

La région Auvergne-Rhône-Alpes souhaite faciliter la mise en relation entre les habitants et les artisans de son territoire. Le site « Trouve ton artisan » présente un annuaire et permet au visiteur de contacter un professionnel depuis sa fiche.

Expression des besoins

• Trouver un artisan par catégorie ou par son nom ; consulter son métier, sa note, sa localisation et sa présentation.

• Présenter les trois artisans du mois sur l’accueil et guider le visiteur avec les quatre étapes du brief.

• Envoyer un message à l’artisan par un formulaire comprenant nom, email, objet et message. Le brief prévoit une réponse sous 48 h ; ce délai dépend de l’artisan.

Contraintes

React.js, Bootstrap et Sass pour l’interface ; Node.js, Express et Sequelize pour le serveur ; MySQL ou MariaDB pour les données. Conception mobile first, attention à WCAG 2.1, titres et descriptions de pages, vérification HTML W3C et versionnement Git/GitHub.

Le logo, les 17 artisans du fichier data.xlsx et la palette imposée sont utilisés. Graphik est déclarée avec deux graisses. Les quatre pages légales portent la mention « Page en construction », conformément à la consigne.

Livrables attendus

Maquettes Figma sur ordinateur, tablette et mobile ; code du projet ; scripts SQL de création et d’alimentation ; README d’installation ; dossier PDF avec couverture, sommaire, en-tête et pied de page ; dépôt GitHub et lien vers le site en ligne.

Architecture et parcours utilisateur


## Architecture et parcours utilisateur


Du navigateur à la base

<b>React</b> affiche les composants et utilise fetch pour lire les données. <b>React Router</b> sélectionne la page à partir de l’URL. <b>Bootstrap</b> organise les colonnes ; <b>Sass</b> adapte les couleurs, la typographie et les espacements.

<b>Express</b> reçoit les requêtes sur /api. Une passerelle ne transmet que les routes autorisées à une API interne sur l’interface locale. <b>Sequelize</b> interroge MySQL/MariaDB et assemble artisan, spécialité et catégorie. Les adresses email des artisans restent côté serveur.

Pour le contact, le serveur valide les champs, retrouve le destinataire en base et transmet un courriel en texte avec <b>Nodemailer</b>. Le visiteur figure dans Reply-To et l’expéditeur appartient au service SMTP configuré.

Pages et routes

• Accueil / : quatre étapes et trois artisans du mois.

• Liste /categorie/:id : artisans de la catégorie sélectionnée.

• Recherche /artisans?q=nom : filtrage par nom ; /artisans affiche tous les artisans.

• Fiche /artisan/:id : illustration, note, métier, localité, à propos, lien facultatif et formulaire.

• Mentions légales, données personnelles, accessibilité et cookies : pages en construction.

• Route inconnue ou artisan absent : page non trouvée, illustration 404 et retour à l’accueil.

Un en-tête et un pied de page communs entourent chaque page. Les noms des catégories proviennent de la base. En production, Express sert aussi le build React : interface et API partagent le même domaine.

Base de données : MCD et MLD


## Base de données : MCD et MLD


MCD - entités et associations

Une spécialité appartient à exactement une catégorie. Une catégorie peut regrouper zéro à plusieurs spécialités. Un artisan exerce exactement une spécialité ; une spécialité peut être exercée par zéro à plusieurs artisans. # désigne l’identifiant.

MLD - tables relationnelles

<b>categories</b> (<b>id PK</b> INT, name VARCHAR(60) UNIQUE NOT NULL).

<b>specialties</b> (<b>id PK</b> INT, name VARCHAR(80) UNIQUE NOT NULL, <b>category_id FK</b> INT NOT NULL vers categories.id).

<b>artisans</b> (<b>id PK</b> INT, name VARCHAR(120), rating DECIMAL(2,1), city VARCHAR(100), about TEXT, email VARCHAR(254), website VARCHAR(255) NULL, top BOOLEAN, image VARCHAR(255), <b>specialty_id FK</b> INT vers specialties.id).

Les champs de l’artisan sont obligatoires sauf website. Les identifiants sont auto-incrémentés. La note est limitée entre 0 et 5 ; top vaut false par défaut. Les clés étrangères assurent l’intégrité des liens. Encodage utf8mb4 pour les accents et caractères Unicode.

create.sql définit le schéma ; seed.sql importe 4 catégories, 15 spécialités et 17 artisans dans une transaction. Les textes et noms du fichier fourni sont conservés. L’image de fiche est une illustration générique, les ressources fournies ne contenant pas de photographies d’artisans.

Sécurité : mesures mises en place


## Sécurité : mesures mises en place


Secrets et isolation de l’API

Les identifiants SQL et SMTP se lisent depuis les variables d’environnement. .env est exclu de Git et du ZIP ; .env.example ne contient aucun secret. L’API métier écoute sur 127.0.0.1 et exige une clé aléatoire générée au démarrage. La comparaison utilise timingSafeEqual. React ne possède jamais cette clé.

La passerelle publique autorise uniquement les routes de consultation et de contact. Elle ne propose aucune route d’administration. Cette organisation limite l’accès direct à l’API interne ; elle ne rend pas les routes publiques impossibles à appeler avec un script.

Validation et intégrité des données

Le serveur contrôle les types, les champs obligatoires, les longueurs et le format email. Les identifiants sont des entiers positifs et le corps JSON est limité à 16 Ko. Les retours de ligne sont interdits dans les valeurs servant aux en-têtes du courriel.

Sequelize construit les recherches à partir de filtres contrôlés ; aucune requête SQL n’est assemblée avec du texte reçu du visiteur. Les relations et contraintes SQL protègent l’intégrité. Le compte de production reçoit seulement SELECT, car le site ne modifie pas les artisans.

Protection du navigateur

React échappe les textes affichés. Aucun HTML fourni par le visiteur n’est injecté. Le lien d’un artisan est affiché uniquement pour HTTP/HTTPS ; l’ouverture dans un autre onglet utilise noopener noreferrer. Helmet fournit les en-têtes de sécurité, dont la politique CSP.

Les erreurs renvoyées au navigateur sont génériques et ne dévoilent pas les identifiants ou la pile d’exécution. Les résultats de chargement et d’erreur sont visibles et annoncés aux technologies d’assistance.

Sécurité : veille et corrections


## Sécurité : veille et corrections


Protection du formulaire et du SMTP

Limites par adresse IP : 100 requêtes API par minute et 5 tentatives de contact sur 15 minutes. Le POST doit porter l’origine du domaine configuré. Ce contrôle réduit les soumissions depuis un autre site ; il ne constitue pas une authentification et une origine peut être imitée hors navigateur.

Le destinataire est lu en base et les emails ne sont pas exposés dans les réponses publiques. Les messages sont envoyés en texte, sans pièce jointe ni lecture de fichiers ou d’URL. En production, le transport exige TLS. HTTPS et la bonne configuration du proxy doivent être appliqués sur l’hébergement.

Veille effectuée le 11 octobre 2026

npm audit a été exécuté pendant le projet et les avis de sécurité GitHub ont été consultés. L’audit initial remontait une entrée haute pour Nodemailer et deux entrées modérées liées à uuid/Sequelize. Cela signale des dépendances vulnérables, sans démontrer qu’une attaque a touché le site.

Nodemailer a été mis à jour de 7.0.13 vers 10.1.0. uuid utilisé par Sequelize a été remplacé par une version au moins 11.1.1 via overrides. Les lectures de base et le test SMTP local ont réussi après ces changements. L’audit final signale <b>0 vulnérabilité connue</b>.

<link href="https://github.com/advisories/GHSA-v53p-9fqp-m79j" color="#0074c7"><u>Avis Nodemailer : déni de service du parseur d’adresses</u></link>

<link href="https://github.com/advisories/GHSA-w5hq-g745-h8pq" color="#0074c7"><u>Avis uuid : défaut de contrôle des bornes du tampon</u></link>

La veille doit se poursuivre : relancer npm audit, consulter les avis, lire les changements avant mise à jour et refaire les contrôles utiles. Une absence d’alerte ne garantit pas l’absence de toute faille.

Vérifications du projet


## Vérifications du projet


Contrôles exécutés

• Import SQL réel dans MariaDB 11.4.11 : schéma, relations et 17 artisans vérifiés.

• API : listes, catégorie Bâtiment, recherche Chocolaterie, détail et sélection des trois artisans du mois réussis.

• Cas invalides : artisan absent (404), recherche invalide (400), origine interdite (403), formulaire invalide (400), SMTP absent (503).

• SMTP local : réponse 200 et courriel reçu dans une capture locale ; destinataire imposé par la base et Reply-To correct. Aucun envoi externe.

• npm test : 4 tests réussis ; npm run build : compilation réussie ; npm audit : 0 vulnérabilité connue.

• W3C Nu : 0 erreur et 0 avertissement pour le HTML rendu de l’accueil, liste, fiche et 404, après retrait des scripts de développement.

• Rendu vérifié à 390 et 768 pixels : accueil, liste et fiche sans défilement horizontal. Gouttières Bootstrap corrigées sur la fiche.

Accessibilité et limites

Langue fr, titres hiérarchisés, régions sémantiques, labels, texte numérique des notes, focus visible, lien d’évitement, annonces des états et adaptation au mouvement réduit. Une revue complète au lecteur d’écran n’a pas été réalisée : aucune certification WCAG n’est revendiquée.

La compilation affiche des avertissements de dépréciation Sass provenant de Bootstrap ; ils n’empêchent pas le build. La livraison externe SMTP, le HTTPS public et l’hébergement restent à contrôler. Les preuves JSON figurent dans docs/validation.

Maquettes : accueil sur ordinateur


## Maquettes : accueil sur ordinateur


<link href="https://www.figma.com/design/aLEK2PR87VNLpFY1KOIhYz" color="#0074c7"><u>Ouvrir les maquettes complètes dans Figma</u></link>

27 vues natives éditables : 9 pages en 1280, 768 et 390 pixels. En-têtes et pieds de page sont des instances de composants partagés ; la palette du brief est enregistrée en styles. Les noms des cadres précisent la page et le format.

Maquettes : liste et recherche


## Maquettes : liste et recherche


La catégorie liste ses artisans. La recherche par nom conserve les mêmes cartes : spécialité, nom, note, localité et accès à la fiche.

Liste Bâtiment / Recherche Chocolaterie

Exports du fichier Figma. Les vues de toutes les pages et de tous les formats restent accessibles depuis docs/maquettes/LIENS.md.

Maquettes : fiche et pages légales


## Maquettes : fiche et pages légales


La fiche regroupe les informations et le formulaire. Les quatre pages légales partagent le gabarit présenté ci-dessous et la mention « Page en construction ». La vue 404 est aussi présente dans Figma.

Fiche artisan / Exemple de page légale

La police déclarée est Graphik. Le connecteur Figma ne dispose pas de cette police et peut l’afficher avec une substitution. Installer Graphik et le service de polices Figma pour modifier les textes avec le rendu attendu.

Rendu responsive : mobile


## Rendu responsive : mobile


Captures du site local final à 390 pixels. Une colonne pour les étapes et cartes ; la fiche empile présentation et formulaire. Le menu peut revenir à la ligne. Images complètes jointes au ZIP.

Rendu responsive : tablette


## Rendu responsive : tablette


Captures du site local à 768 pixels. Les cartes et étapes peuvent occuper deux colonnes ; la fiche reste empilée avant le seuil ordinateur de 992 pixels.

Les cinq captures desktop sont des exports Figma. Les six captures responsive complémentaires sont des captures du site, distinguées pour ne pas attribuer à Figma un export qui n’a pas été réalisé. La limite gratuite du connecteur a été atteinte après création des 27 vues.

Liens et finalisation de la remise


## Liens et finalisation de la remise


<link href="https://github.com/SoulReaper67/Cr-ez-le-site-Web-Trouve-ton-artisan-avec-React.JS" color="#0074c7"><u>Dépôt GitHub : code, README et scripts SQL</u></link>

<link href="https://www.figma.com/design/aLEK2PR87VNLpFY1KOIhYz" color="#0074c7"><u>Maquettes Figma complètes et éditables</u></link>

Mise en ligne à terminer

Domaine fourni : <b>trouve-ton-artisan.twinmistudio.com</b>. Panneau : RunHosting. Boîte prévue : <b>contact@trouve-ton-artisan.twinmistudio.com</b>. Ces informations identifient la destination prévue ; elles ne prouvent pas que le projet a été déployé.

À la préparation du dossier, les sessions accessibles demandaient encore une connexion. Il reste à confirmer que l’offre exécute Node.js et autorise la connexion MySQL, importer les scripts dans une base vide, configurer les variables privées, activer HTTPS et vérifier un envoi SMTP vers une boîte de test.

<b>Lien du site accessible en ligne : non encore validé.</b> Le domaine prévu doit être testé après déploiement et cette mention remplacée par le lien fonctionnel avant remise finale au CEF.

Police et présentation personnelle

Graphik Trial est fournie dans le ZIP pour un usage personnel local. La notice « Personal Use Only » ne permet pas d’affirmer une autorisation de diffusion web : fournir une licence adaptée avant publication. Les fichiers de police sont exclus du dépôt public.

Compléter la couverture avec votre nom si nécessaire, lire le README, lancer le site et vous assurer de pouvoir expliquer les composants React, les relations SQL, les routes Express et le formulaire.

Références techniques