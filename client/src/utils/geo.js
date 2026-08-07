// Known city coordinates fallback list for Indian hubs
export const CITY_COORDINATES_MAP = [
    { keywords: ['chandigarh', 'mohali', 'panchkula'], coords: [30.7333, 76.7794] },
    { keywords: ['jaipur', 'rajasthan'], coords: [26.9124, 75.7873] },
    { keywords: ['delhi', 'new delhi', 'dilli', 'haat', 'noida', 'gurugram'], coords: [28.6139, 77.2090] },
    { keywords: ['mumbai', 'bandra', 'andheri'], coords: [19.0760, 72.8777] },
    { keywords: ['kolkata', 'bengal'], coords: [22.5726, 88.3639] },
    { keywords: ['bangalore', 'bengaluru'], coords: [12.9719, 77.5961] },
    { keywords: ['pune'], coords: [18.5204, 73.8567] },
    { keywords: ['haridwar', 'uttarakhand', 'rishikesh'], coords: [29.9457, 78.1642] },
    { keywords: ['varanasi', 'banaras'], coords: [25.3176, 82.9739] },
    { keywords: ['ranchi', 'jharkhand'], coords: [23.3441, 85.3096] },
    { keywords: ['guwahati', 'assam'], coords: [26.1445, 91.7362] },
];

export const getCityCoordinates = (locationStr = '') => {
    if (!locationStr) return [30.7333, 76.7794];
    const norm = String(locationStr).toLowerCase();
    const match = CITY_COORDINATES_MAP.find(({ keywords }) =>
        keywords.some(kw => norm.includes(kw))
    );
    return match ? match.coords : [30.7333, 76.7794];
};

export const getEventCoords = (item) => {
    if (!item) return [30.7333, 76.7794];
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0 && lat >= -90 && lat <= 90) {
        return [lat, lng];
    }
    return getCityCoordinates(item.location || item.address);
};

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const l1 = Number(lat1);
    const ln1 = Number(lon1);
    const l2 = Number(lat2);
    const ln2 = Number(lon2);

    if (isNaN(l1) || isNaN(ln1) || isNaN(l2) || isNaN(ln2)) return null;

    const R = 6371; // Radius of Earth in km
    const dLat = (l2 - l1) * (Math.PI / 180);
    const dLon = (ln2 - ln1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(l1 * (Math.PI / 180)) * Math.cos(l2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
};

export const formatDistanceText = (distanceKm) => {
    if (distanceKm == null) return null;
    if (distanceKm < 1) return '< 1 km';
    return `${distanceKm} km`;
};
