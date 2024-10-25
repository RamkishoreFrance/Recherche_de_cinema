// js/geolocation.js

export function getUserLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                callback({ latitude, longitude });
            },
            (error) => {
                console.error('Erreur lors de la géolocalisation :', error);
                alert('Impossible de vous géolocaliser.');
            }
        );
    } else {
        alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
}
