# Projet GL NikolaTeslApp

## Déploiement avec Docker

1. **Vérifier Docker et Docker Compose** :
   Assurez-vous que Docker et Docker Compose sont installés sur votre machine en exécutant la commande suivante :

   ```bash
   docker-compose --version
   ```

   Si la commande échoue, installez Docker et Docker Compose en suivant les instructions sur la [documentation officielle Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/) (ou demander a GPT)

2. **Cloner le dépôt** :
   Clonez le dépôt de NikolaTeslApp sur votre machine :

   ```bash
   git clone https://github.com/yanisgomes/NikolaTeslApp.git
   cd NikolaTeslApp
   ```

3. **Construire les conteneurs Docker** :
   Exécutez la commande suivante pour construire les conteneurs Docker :

   ```bash
   docker-compose build
   ```

4. **Démarrer les conteneurs Docker** :
   Pour démarrer les conteneurs, utilisez la commande suivante. L'option `-d` permet de démarrer les conteneurs en arrière-plan (détaché) :

   ```bash
   docker-compose up -d
   ```

   L'application est désormais disponible sur <http://localhost:9011>.

5. **Arrêter les conteneurs Docker** :
   Pour arrêter les conteneurs et les supprimer, utilisez la commande suivante :

   ```bash
   docker-compose down
   ```

### Intérêt du déploiement Docker

Le déploiement sur Docker simplifie la gestion de l'environnement d'exécution. Il permet de déployer l'application sans avoir à gérer Yarn ou pip. Réduit la complexité et les erreurs liées à la gestion des dépendances.
