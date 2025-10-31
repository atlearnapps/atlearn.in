import axios from 'axios';
import qs from 'qs';


// Middleware to fetch Zoom OAuth Token
 export const getZoomToken = async (req, res, next) => {
    try {
        const response = await axios.post(
            'https://zoom.us/oauth/token',
            qs.stringify({ grant_type: 'account_credentials', account_id: process.env.ZOOM_ACCOUNT_ID }),
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_API_KEY}:${process.env.ZOOM_API_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        req.zoomToken = response.data.access_token; // Attach token to request object
        next(); // Continue to next middleware or route handler
    } catch (error) {
        console.error('Error fetching Zoom token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to retrieve Zoom access token' });
    }
};
