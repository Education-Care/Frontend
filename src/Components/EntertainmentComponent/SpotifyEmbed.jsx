const SpotifyEmbed = (track_id) => {
    return (
        <div>
            <iframe
                src={"https://open.spotify.com/embed/track/" + track_id}
                width="200"
                height="200"
                frameBorder="0"
                allow="encrypted-media"
            ></iframe>
        </div>
    );
};

export default SpotifyEmbed;