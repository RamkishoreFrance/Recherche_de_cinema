
## Rendu

Ce projet sera à réaliser en solo. Le rendu peut se faire soit par un dépôt github, soit en le déposant sur l'ide de la 3wa, soit par une archive.

## Objectifs

Réaliser une petite application qui permet de lister tous les cinémas dans un rayon de x km à proximité de notre position ou d'une adresse fournie.

## Liens utiles

* [Documentation API](https://data.culture.gouv.fr/explore/dataset/etablissements-cinematographiques/api/)

## Exemples

### Récupérer une adresse proches d'une position gps

Dans la documentation (voir le lien fourni ci-dessus), taper le texte suivant dans le champ "where" : within_distance(geolocalisation, geom'POINT({longitude} {latitude})', {distance}km).

Remplacer {longitude}, {latitude} et {distance} par vos propres informations.

Exemple de requête : https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?where=within_distance(geolocalisation%2C%20geom%27POINT(7.75%2048.58)%27%2C%2010km)&limit=20

## Instructions

### Mise en place du projet

* Créer un fichier *index.html* avec un bouton "Me géocaliser", un champ de recherche, un input range et un bouton de validation
* Créer un fichier *main.js* dans un sous-dossier "js"
* Créer un fichier *geolocation.js* dans le sous-dossier "js"
* Créer un fichier *addressApi.js* dans le sous-dossier "js"

### Géolocalisation

Lorsque l'on clique sur le bouton "Me géocaliser", récupérer la position de l'utilisateur et à partir des coordonnées récupérées, récupérer l'adresse postale de l'utilisateur. Cette adresse va pré-remplir le champ de recherche.

### Recherche des cinémas

Lorsque le formulaire est soumis, on récupère l'adresse du champ de recherche, on calcule les coordonnées gps de cette adresse puis depuis l'api on récupère la liste des cinémas proche de l'adresse en question. Le champ de type range permet de définir une distance maximum de recherche.

### Affichage des cinémas

Afficher la liste des cinémas (nom du cinéma, adresse complète) dans une liste html.

### [BONUS] Trier les cinémas par distance

Trier la liste des cinémas en fonction de la distance par rapport à l'adresse recherchée. On veut afficher les cinémas du plus proche au moins proche (afficher la distance en km).

### [BONUS++] Afficher les cinémas sur une carte

Afficher la liste des cinémas sur une carte dont l'adresse tapée est le centre.

## Divers

### Le formulaire de recherche

```
<form>
    <button type="button">Me géolocaliser</button>
    
    <label>Chercher des cinémas proches d'une adresse</label>
    <input type="search" placeholder="L'adresse recherchée">
    <label>Distance en km</distance>
    <input type="range" value="10">
    <button>Rechercher</button>
</form>
```
# Recherche_de_cinema
