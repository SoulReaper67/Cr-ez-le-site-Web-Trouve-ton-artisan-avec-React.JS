# Vérifications du 11 octobre 2026

## Résultats obtenus
- Import réel create.sql + seed.sql dans MariaDB 11.4.11 : 4 catégories, 15 spécialités, 17 artisans.
- GET catégories, liste complète, Top (3), catégorie Bâtiment (4), recherche Chocolaterie (1) et fiche : réussis.
- Les réponses publiques ne contiennent pas l'adresse email du destinataire.
- Artisan inexistant : 404 ; filtre invalide : 400 ; origine interdite : 403.
- Formulaire invalide : 400 ; configuration SMTP absente : 503 explicite.
- Envoi SMTP : 200 avec message réellement remis à un serveur local de capture.
  Destinataire lu en base, Reply-To du visiteur, champ « to » supplémentaire ignoré.
  Aucun courriel envoyé à une adresse externe.
- npm test : 4 tests réussis.
- npm run build : compilation réussie. Avertissements de dépréciation Sass issus de Bootstrap
  et directives React Router ignorées par Vite ; aucun échec de compilation.
- npm audit : 0 vulnérabilité connue, détails dans validation/npm-audit.json.
- Validateur HTML W3C Nu, HTML rendu de l'accueil, liste, fiche et 404 :
  0 erreur et 0 avertissement. Copies sans les scripts du serveur de développement.
- Contrôle des largeurs 390 et 768 pixels : accueil, liste et fiche sans débordement horizontal.
  Les gouttières de la fiche ont été corrigées de g-5 à g-4 après ce contrôle.
- Navigation, recherche et message d'indisponibilité SMTP observés dans le navigateur.

## Accessibilité
Langue française, régions header/main/footer/nav, titres hiérarchisés, lien d'évitement,
labels des champs, champs obligatoires, texte numérique de la note, états de chargement,
focus visible, annonce du résultat, navigation React qui replace le focus dans main,
respect de prefers-reduced-motion. Ces contrôles ne constituent pas une certification WCAG.
Le vert sert à l'illustration et le rouge au focus ; ils ne portent pas un petit texte blanc.
Une revue complète avec lecteurs d'écran reste utile avant exploitation publique.

## Veille et corrections
L'audit initial signalait une vulnérabilité haute dans Nodemailer et deux entrées modérées
(uuid et la dépendance Sequelize qui l'utilise).
Nodemailer a été mis à jour de 7.0.13 vers 10.1.0. La dépendance uuid de Sequelize
est fixée à une version >=11.1.1 via overrides. Les lectures Sequelize et le test SMTP
ont été exécutés après mise à jour. Aucun incident ou exploitation n'a été constaté.
L'absence d'alerte npm ne prouve pas l'absence de toute faille.

Sources consultées le 11/10/2026 :
- https://github.com/advisories/GHSA-v53p-9fqp-m79j : déni de service du parseur d'adresses.
- https://github.com/advisories/GHSA-w5hq-g745-h8pq : contrôle des bornes de tampon uuid.
- https://expressjs.com/en/advanced/best-practice-security/
- https://nodemailer.com/smtp
- https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
- https://www.w3.org/TR/WCAG21/
- https://validator.w3.org/nu/

## Limites encore ouvertes
Déploiement sur RunHosting à vérifier : les sessions accessibles demandent encore une connexion.
Le domaine prévu est trouve-ton-artisan.twinmistudio.com et la boîte prévue
contact@trouve-ton-artisan.twinmistudio.com. Une adresse email seule ne fournit pas le serveur,
le port ou les identifiants SMTP. Le service doit accepter Node.js et MySQL/MariaDB.
Pas de validation du HTTPS ni de livraison externe SMTP tant que le déploiement n'est pas fait.
Graphik Trial : usage personnel seulement selon la notice jointe ; licence web nécessaire
avant diffusion publique. Figma contient 27 vues natives éditables, mais le connecteur
n'a pas la police Graphik installée et sa limite gratuite empêche des retouches supplémentaires.
Les cinq exports desktop sont issus de Figma, les six captures responsive du site local.
