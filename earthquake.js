import express from "express";
import axios from "axios";

const router = express.Router();

// GET: /api/earthquake?min_magnitude=4&region=Indonesia
router.get("/", async (req, res) => {
    const minMag = parseFloat(req.query.min_magnitude) || 4;
    const region = req.query.region ? req.query.region.toLowerCase() : null;

    try {
        const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`;
        const response = await axios.get(url);
        let features = response.data.features;

        // Filter by minimum magnitude
        features = features.filter(f => f.properties.mag >= minMag);

        // Filter by region if provided
        if (region) {
            features = features.filter(f => {
                const place = f.properties.place.toLowerCase();

                // Check if region is anywhere in the place string
                return place.includes(region);
            });
        }

        const earthquakes = features.map(f => ({
            place: f.properties.place,
            magnitude: f.properties.mag,
            time: new Date(f.properties.time).toISOString(),
            url: f.properties.url,
            coordinates: {
                lat: f.geometry.coordinates[1],
                lon: f.geometry.coordinates[0],
                depth: f.geometry.coordinates[2]
            }
        }));

        return res.json({ count: earthquakes.length, earthquakes });

    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch earthquake data", details: error.message });
    }
});

export default router;
