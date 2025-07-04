import React from "react";
import "./PlaylistsSection.css";

const playlists = [
  {
    name: "Programming Fundamentals (PF)",
    shortForm: "PF",
    playlistLink:
      "https://youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ&feature=shared",
    VideoId: "z9bZufPHFLU",
    videoCount: 226,
  },
  {
    name: "Applied Physics (AP)",
    shortForm: "AP",
    playlistLink:
      "https://youtube.com/playlist?list=PLY8pCdWSlXrT0w1Yu3jU_lTUCkfFKVOm_&feature=shared",
    VideoId: "AquETg8G0es",
    videoCount: 86,
  },
  {
    name: "Calculus and Analytical Geometry (CAL)",
    shortForm: "CAL",
    playlistLink:
      "https://youtube.com/playlist?list=PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv&feature=shared",
    VideoId: "GiCojsAWRj0",
    videoCount: 332,
  },
];

const PlaylistsSection = () => (
  <section className="section course" id="courses" aria-label="course">
    <div className="container">
      <h2 className="section-title">
        Pick A Playlist To{" "}
        <span className="pp-highlighted" style={{ color: "#3b82f6" }}>
          Get Started
        </span>
      </h2>
      <div className="grid-list">
        {playlists.map((playlist, index) => (
          <div 
            key={index} 
            className="modern-playlist-card"
            onClick={() => window.open(playlist.playlistLink, '_blank')}
          >
            <div className="modern-playlist-thumbnail-container">
              <img
                src={`https://i.ytimg.com/vi/${playlist.VideoId}/hqdefault.jpg`}
                alt={`Thumbnail for ${playlist.name}`}
                className="modern-playlist-thumbnail"
              />
              <span className="modern-playlist-badge">{playlist.shortForm}</span>
            </div>
            <div className="modern-playlist-content">
              <h3 className="modern-playlist-title">{playlist.name}</h3>
              <p className="modern-playlist-video-count">{playlist.videoCount} Videos</p>
            </div>
          </div>
        ))}
      </div>
      <a href="/playlists" className="btn btn-primary">
        <span className="span">Browse More Playlists</span>
      </a>
    </div>
  </section>
);

export default PlaylistsSection;
