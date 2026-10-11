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

## Validation CSS complémentaire
Le CSS compilé, Bootstrap inclus, a été contrôlé par le validateur W3C.
Profil par défaut CSS niveau 3 + SVG : 0 erreur et 498 avertissements.
Les avertissements concernent notamment des redéfinitions, variables CSS,
couleurs et extensions propres aux navigateurs. Le profil CSS3 sans SVG
signale 22 erreurs sur pointer-events, mask et fill employés par Bootstrap.
Les deux rapports sont conservés : validation/css.json et css3-strict.json.
Ce contrôle n’est pas une certification d’accessibilité.

## Contrôles d’accessibilité
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

## Déploiement vérifié le 11 octobre 2026
- alwaysdata Free : Node.js 24, MariaDB 11.8, 17 artisans importés.
- HTTPS : accueil, recherche Chocolaterie (1 résultat) et fiche vérifiés.
- Compte MySQL : lecture seule sur la base dédiée.
- SMTP TLS port 465 : authentification vérifiée ; réponse 250 à un message
  vers trouveartisan@alwaysdata.net, la propre boîte du projet. La réception
  dans le webmail n’a pas été contrôlée. Aucun artisan n’a reçu de test.
- Redémarrage dans le panneau : site et données toujours accessibles.
- Build local déployé via la branche deployment : build distant arrêté faute
  de ressources sur l’offre gratuite.
- .env privé du serveur ; aucun secret dans GitHub ou le ZIP.

## Point restant : police Graphik
Graphik Trial : usage personnel seulement selon la notice jointe ; licence web
nécessaire pour utiliser Graphik sur le site public, qui utilise actuellement Arial.
Figma contient 27 vues natives éditables ; le connecteur ne dispose pas de Graphik.
Les cinq exports desktop viennent de Figma, les six captures responsive du site local.
