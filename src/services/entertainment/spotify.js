import axios from "axios";

export const getToken = async () => {
    try {
        const response = await axios.post("https://accounts.spotify.com/api/token",{
            "grant_type": "client_credentials",
            "client_id": process.env.REACT_APP_SPOTIFY_CLIENT_ID,
            "client_secret": process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
        },{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAlbum = async (albumId) => {
    try {
        const auth = await getToken();
        const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`,{
            headers: {
                "Authorization": `Bearer ${auth.access_token}`
            }
        })

        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const getTrack = async (trackId) => {
    try {
      const auth = await getToken();  
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Error fetching track details:", error);
      throw error;
    }
  };

// Fetch details of a podcast show
export const getPodcast = async (podcastId) => {
    try {
        const auth = await getToken();
        const response = await axios.get(
            `https://api.spotify.com/v1/shows/${podcastId}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.access_token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

// Fetch details of a podcast show
export const getPlayist = async (playistID) => {
    try {
        const auth = await getToken();
        const response = await axios.get(
            `https://api.spotify.com/v1/playlist/${playistID}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.access_token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.log(error);
    }
};
