import NodeGeocoder from 'node-geocoder';

export const geoCodeAddress = async (address) => {
    try {
        const geocoder = NodeGeocoder({
            provider: "google",
            apiKey: process.env.GOOGLE_MAPS_API_KEY,
            formatter: null
        });

        const geo = await geocoder.geocode(address);

        if (!geo || !geo[0]?.longitude || !geo[0]?.latitude) {
            throw new Error('Please enter a valid city or district name');
        }

        return {
            location: {
                type: "Point",
                coordinates: [geo[0].longitude, geo[0].latitude]
            },
            googleMap: geo
        };
    } catch (error) {
        console.log(error);
        throw new Error('Error in geocoding address');
    }
};