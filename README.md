# GL-elec-app - Démo d'application avec Backend en Node.js et Frontend en HTML/JS

## Description

Ce projet est une démonstration simple qui comporte deux parties :

- **Frontend** : une interface utilisateur en HTML/CSS/JavaScript.
- **Backend** : un serveur Node.js qui fournit une API REST pour la simulation.

Le projet utilise Docker pour encapsuler et isoler les services frontend et backend. Vous pouvez accéder à l'interface utilisateur (frontend) via un navigateur web et faire des requêtes à l'API backend pour des démonstrations en direct.

## Prérequis

- Docker et Docker Compose installés sur votre machine serveur.
- Accès SSH à votre serveur à distance.

## Structure du projet

- **frontend/** : Dossier contenant les fichiers HTML, CSS et JavaScript.
- **backend/** : Dossier contenant le code du serveur Node.js.
- **docker-compose.yml** : Fichier Docker Compose pour orchestrer les conteneurs frontend et backend.

## Lancer l'application

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/GL-elec-app.git
cd GL-elec-app
```

### 2. Lancer Docker Compose

Exécutez la commande suivante pour démarrer l'application avec Docker :

```bash
docker-compose up
```

- Cette commande va démarrer deux conteneurs :
  - **web** : Un serveur Apache qui servira le frontend (HTML/JS).
  - **backend** : Un serveur Node.js qui servira l'API.

### 3. Accéder au Frontend

Ouvrez votre navigateur web et accédez à l'URL suivante :

```
http://10.8.0.1:9007
```

C'est ici que l'interface utilisateur est accessible. Les fichiers HTML et JS seront chargés depuis ce conteneur.

### 4. Interaction entre le Frontend et le Backend

Le **frontend** utilise du JavaScript (via `fetch`) pour faire des requêtes API au **backend**.

Dans le fichier `api.js`, la requête ressemble à ceci :

```js
fetch('http://10.8.0.1:9008/api/simulation')
  .then(response => response.json())
  .then(data => {
      document.getElementById('resultat').textContent = 'Résultat: ' + data.resultat;
  });
```

- **Backend** : Le serveur Node.js écoute sur le **port 3000** à l'intérieur de son conteneur. Cependant, il est accessible de l'extérieur via le **port 9008** sur votre machine hôte grâce à la redirection de port définie dans `docker-compose.yml`.

### 5. Accéder au Backend API

Le backend expose une API à l'URL suivante :

```
http://10.8.0.1:9008/api/simulation
```

Lorsque vous accédez à cette URL, vous recevrez une réponse JSON comme suit :

```json
{
  "resultat": 42
}
```

### 6. Redirection des Ports

Les redirections de ports dans Docker fonctionnent comme suit :

- **Frontend (Apache)** :
  - Le conteneur expose le port **80** (port par défaut d'Apache).
  - Ce port est redirigé vers le port **9007** sur votre machine hôte.
  - Accès via : `http://10.8.0.1:9007`

- **Backend (Node.js)** :
  - Le serveur Node.js écoute sur le port **3000** dans le conteneur.
  - Ce port est redirigé vers le port **9008** sur votre machine hôte.
  - Accès via : `http://10.8.0.1:9008`

### 7. Utilisation de l'API Backend dans Docker

À l'intérieur de Docker, le backend écoute sur **localhost:3000** (dans le conteneur). Grâce à Docker Compose, il est accessible depuis l'extérieur via **http://10.8.0.1:9008**.

Dans le fichier `app.js` du backend, l'application est configurée pour écouter sur `localhost:3000` :

```js
app.listen(port, () => {
  console.log(`Backend Node.js à l'écoute sur http://localhost:${port}`);
});
```

Docker s'occupe de rediriger les requêtes externes depuis **9008** (sur la machine hôte) vers **3000** (dans le conteneur backend).

---

## Résumé

- **Frontend** accessible via : `http://10.8.0.1:9007`
- **Backend API** accessible via : `http://10.8.0.1:9008`
- Le code Node.js continue d'écouter sur `localhost:3000` dans le conteneur, avec Docker qui redirige les requêtes du port 9008 vers celui-ci.

## Commandes utiles

- Démarrer les conteneurs :
  ```bash
  docker-compose up
  ```
- Arrêter les conteneurs :
  ```bash
  docker-compose down
  ```


# Documentation du Projet - Frontend et Backend avec Docker Compose

## Contraintes et Recommandations

### Frontend
- **Serveur Web** : Utilise Apache via l'image Docker `httpd:latest`.
- **Point d'entrée** : Le serveur Apache recherche un fichier `index.html` dans le dossier `/usr/local/apache2/htdocs` (monté depuis `./frontend`).
- **Organisation des fichiers** :
  - `index.html` doit être le fichier principal.
  - Les fichiers CSS et JavaScript doivent être organisés dans des sous-dossiers (`css`, `js`, etc.).
- **Test** : Accéder à `http://localhost:9007` pour vérifier que le frontend est servi correctement.

### Backend
- **Serveur Backend** : Utilise Python (avec Flask) ou Node.js selon la configuration choisie.
- **Point d'entrée** : 
  - En Python, le fichier principal doit être `app.py` ou `main.py`.
  - En Node.js, le fichier principal est défini par `package.json` (par exemple, `index.js`).
- **Port exposé** : Le backend écoute sur le port `3000` dans le conteneur (redirection de `9008:3000` en local).
- **Organisation des fichiers** : Structurer le code pour faciliter la maintenance et l'extensibilité.

### Docker Compose
- **Services :**
  - **Frontend** : Monte `./frontend` et expose le port `9007`.
  - **Backend** : Monte `./backend`, installe les dépendances, et expose le port `9008`.
- **Volumes locaux** : Les volumes permettent un développement itératif sans reconstruire l'image Docker.
- **Commandes d'installation** : Installer automatiquement les dépendances au démarrage.

### Reverse Proxy (Optionnel)
- Si un reverse proxy est utilisé, il doit rediriger :
  - `/` vers le frontend.
  - `/api` vers le backend.

---

## Architecture des Fichiers

### Frontend
Dossier : `frontend/`
```plaintext
frontend/
├── index.html        # Point d'entrée principal du frontend
├── css/              # Dossier contenant les fichiers CSS
│   └── styles.css    # Fichier de style principal
└── js/               # Dossier contenant les fichiers JavaScript
    └── script.js     # Fichier principal gérant la logique du frontend
```

**Rôles des fichiers :**
- `index.html` : Contient le code HTML principal. Doit inclure les fichiers CSS et JS.
- `css/styles.css` : Gère le style de l'interface utilisateur.
- `js/script.js` : Gère la logique côté client, notamment les appels API.

### Backend (Python)
Dossier : `backend/`
```plaintext
backend/
├── app.py              # Point d'entrée principal du serveur Flask
├── requirements.txt    # Liste des dépendances Python
├── routes/             # Dossier pour organiser les routes API
│   ├── __init__.py     # Initialisation du module `routes`
│   └── api.py          # Contient les routes de l'API
└── models/             # Dossier pour organiser les modèles
    ├── __init__.py     # Initialisation du module `models`
    └── database.py     # Gestion de la base de données (si applicable)
```

**Rôles des fichiers :**
- `app.py` : Point d'entrée principal. Configure Flask, enregistre les routes et démarre le serveur.
- `requirements.txt` : Liste les dépendances nécessaires, par exemple `flask`.
- `routes/api.py` : Contient les routes de l'API, séparées pour une meilleure lisibilité.
- `models/database.py` : (Optionnel) Gestion des interactions avec la base de données.

### Backend (Node.js)
Dossier : `backend/`
```plaintext
backend/
├── index.js            # Point d'entrée principal du serveur Node.js
├── package.json        # Décrit les dépendances et les scripts du projet
├── routes/             # Dossier pour organiser les routes API
│   └── api.js          # Contient les routes de l'API
└── utils/              # Dossier pour regrouper les fonctions utilitaires
    └── helpers.js      # Fonctions utilitaires partagées
```

**Rôles des fichiers :**
- `index.js` : Point d'entrée principal. Configure Express et démarre le serveur.
- `package.json` : Gère les dépendances (ex. : `express`) et les scripts (ex. : `npm start`).
- `routes/api.js` : Contient les routes de l'API, séparées pour une meilleure organisation.
- `utils/helpers.js` : (Optionnel) Regroupe les fonctions utilitaires.

---

## Résumé des Rôles

1. **Frontend :**
   - Fournit l'interface utilisateur.
   - Utilise des appels API pour interagir avec le backend.

2. **Backend :**
   - Fournit les points d'entrée API pour la logique métier.
   - Peut gérer une base de données si nécessaire.

3. **Docker Compose :**
   - Automatiser le déploiement et le démarrage des services frontend et backend.

---

## Bonnes Pratiques
1. **Séparer le code frontend et backend** pour une meilleure modularité.
2. **Utiliser des volumes Docker** pour permettre des modifications en direct sans reconstruction des images.
3. **Documenter les dépendances** avec `requirements.txt` (Python) ou `package.json` (Node.js).
4. **Structurer le backend** en dossiers pour séparer les routes, modèles, et utilitaires.