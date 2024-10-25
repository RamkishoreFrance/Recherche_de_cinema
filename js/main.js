// js/main.js

import { getUserLocation } from './geolocation.js';
import { getAddressFromCoordinates, getCoordinatesFromAddress } from './addressApi.js';

let map; // Variable pour la carte
let markersLayer; // Couche des marqueurs

// Fonction pour créer et initialiser la carte
function initMap(lat, lon) {
    if (map) {
        map.setView([lat, lon], 12);
        markersLayer.clearLayers();
    } else {
        map = L.map('map').setView([lat, lon], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        markersLayer = L.layerGroup().addTo(map);
    }
}

// Fonction pour ajouter un marqueur pour chaque cinéma
function addMarker(lat, lon, name, address) {
    const marker = L.marker([lat, lon]).addTo(markersLayer);
    marker.bindPopup(`<b>${name}</b><br>${address}`).openPopup();
}

// Fonction pour calculer la distance entre deux points (latitude et longitude)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en kilomètres
}

// Fonction pour obtenir les cinémas proches d'une position
async function getCinemasNearby({ latitude, longitude }, distance) {
    const apiUrl = `https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?where=within_distance(geolocalisation%2C%20geom%27POINT(${longitude}%20${latitude})%27%2C%20${distance}km)&limit=20`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.results) {
            initMap(latitude, longitude);

            return data.results
                .filter(result => result.nom && result.adresse && result.geolocalisation)
                .map(result => {
                    const cinemaDistance = calculateDistance(
                        latitude, longitude, 
                        result.geolocalisation.lat, result.geolocalisation.lon
                    );
                    addMarker(result.geolocalisation.lat, result.geolocalisation.lon, result.nom, result.adresse);
                    return {
                        name: result.nom,
                        address: result.adresse,
                        distance: cinemaDistance.toFixed(2),
                        // Ajouter des liens manuels pour chaque cinéma
                        link: `https://www.google.com/search?q=${encodeURIComponent(result.nom)}`
                    };
                })
                .sort((a, b) => a.distance - b.distance);
        } else {
            console.error("Aucun cinéma trouvé ou erreur dans la réponse de l'API", data);
            return [];
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des cinémas :', error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const geolocateBtn = document.getElementById('geolocate-btn');
    const addressInput = document.getElementById('address');
    const rangeInput = document.getElementById('distance');
    const rangeValueDisplay = document.getElementById('range-value');
    const cinemaList = document.getElementById('cinema-list');

    // Mettre à jour l'affichage de la distance
    rangeInput.addEventListener('input', (event) => {
        rangeValueDisplay.textContent = `${event.target.value} km`;
    });

    geolocateBtn.addEventListener('click', () => {
        getUserLocation(async (coords) => {
            const distance = rangeInput.value;

            getAddressFromCoordinates(coords, (address) => {
                addressInput.value = address;
            });

            const cinemas = await getCinemasNearby(coords, distance);

            cinemaList.innerHTML = '';
            if (cinemas.length === 0) {
                cinemaList.innerHTML = '<tr><td colspan="4">Aucun cinéma trouvé.</td></tr>';
            } else {
                cinemas.forEach(cinema => {
                    const listItem = document.createElement('tr');
                    listItem.innerHTML = `
                        <td>${cinema.name}</td>
                        <td>${cinema.address}</td>
                        <td>${cinema.distance} km</td>
                        <td><a href="${cinema.link}" target="_blank">Voir</a></td>
                    `;
                    cinemaList.appendChild(listItem);
                });
            }
        });
    });

    const form = document.getElementById('cinema-search-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const address = addressInput.value;
        const distance = rangeInput.value;

        const coords = await getCoordinatesFromAddress(address);

        const cinemas = await getCinemasNearby(coords, distance);

        cinemaList.innerHTML = '';
        if (cinemas.length === 0) {
            cinemaList.innerHTML = '<tr><td colspan="4">Aucun cinéma trouvé.</td></tr>';
        } else {
            cinemas.forEach(cinema => {
                const listItem = document.createElement('tr');
                listItem.innerHTML = `
                    <td>${cinema.name}</td>
                    <td>${cinema.address}</td>
                    <td>${cinema.distance} km</td>
                    <td><a href="${cinema.link}" target="_blank">Voir</a></td>
                `;
                cinemaList.appendChild(listItem);
            });
        }
    });
});
