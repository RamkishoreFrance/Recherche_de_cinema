// js/addressApi.js

const reverseApiUrl = "https://api-adresse.data.gouv.fr/reverse/";
const searchApiUrl = "https://api-adresse.data.gouv.fr/search/";

// Récupère l'adresse à partir de coordonnées GPS
export async function getAddressFromCoordinates({ latitude, longitude }, callback) {
    const url = `${reverseApiUrl}?lat=${latitude}&lon=${longitude}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const address = data.features[0].properties.label;
            callback(address); // On passe l'adresse au callback
        } else {
            alert("Aucune adresse trouvée pour ces coordonnées.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'adresse :", error);
    }
}

// Récupère les coordonnées à partir d'une adresse saisie par l'utilisateur
export async function getCoordinatesFromAddress(address) {
    const url = `${searchApiUrl}?q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].geometry.coordinates; // On récupère les coordonnées dans le bon ordre
            return { latitude, longitude }; // Retourne les coordonnées sous forme d'objet
        } else {
            alert("Aucune coordonnée trouvée pour cette adresse.");
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des coordonnées :", error);
        return null;
    }
}
