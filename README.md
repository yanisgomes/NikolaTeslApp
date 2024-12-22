# Projet GL NikolaTeslApp  

## Déploiement avec Docker  

1. **Vérifier Docker et Docker Compose** :  
   Assurez-vous que Docker et Docker Compose sont installés sur votre machine en exécutant la commande suivante :  

   ```bash  
   docker-compose --version  
   ```  

   Si la commande échoue, installez Docker et Docker Compose en suivant les instructions sur la [documentation officielle Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/).  

2. **Cloner le dépôt** :  
   Clonez le dépôt de NikolaTeslApp sur votre machine :  

   ```bash  
   git clone https://github.com/yanisgomes/NikolaTeslApp.git  
   cd NikolaTeslApp  
   ```  

3. **Lancer l'application avec Docker Compose** :  
   Pour construire et démarrer les conteneurs Docker en une seule commande, utilisez :  

   ```bash  
   docker-compose up --build  
   ```  

   L'application sera disponible sur <http://localhost:9011>.  

4. **Arrêter les conteneurs Docker** :  
   Pour arrêter les conteneurs et les supprimer, utilisez la commande suivante :  

   ```bash  
   docker-compose down  
   ```  

### Intérêt du déploiement Docker  

Le déploiement sur Docker simplifie la gestion de l'environnement d'exécution. Il permet de déployer l'application sans avoir à gérer Yarn ou pip, réduisant ainsi la complexité et les erreurs liées à la gestion des dépendances.  