import React from "react";
import "./Map.css";

const buildings = [
  {
    name: "Main Office",
    description: "Administrative center housing various support offices.",
    floors: [
      { name: "Ground Floor", rooms: ["Reception", "Room 101", "Room 102"] },
      { name: "1st Floor", rooms: ["Principal's Office", "HR Office"] },
    ],
  },
  {
    name: "Library",
    description: "A hub for knowledge and quiet study sessions.",
    floors: [
      { name: "Ground Floor", rooms: ["Main Desk", "Book Shelves"] },
      { name: "1st Floor", rooms: ["Study Rooms", "Archives"] },
      { name: "2nd Floor", rooms: ["Digital Media Lab", "Quiet Zone"] },
    ],
  },
  {
    name: "CS Building",
    description: "Home to labs, classrooms, and tech-savvy spaces.",
    floors: [
      { name: "1st Floor", rooms: ["Lab 201", "Lab 202"] },
      { name: "2nd Floor", rooms: ["Class 301", "Class 302"] },
      { name: "3rd Floor", rooms: ["Auditorium"] },
    ],
  },
  {
    name: "Cafeteria",
    description: "A vibrant space for meals and relaxation.",
    floors: [{ name: "Ground Floor", rooms: ["Dining Area", "Kitchen"] }],
  },
];

const TechSavvyUniversityMap = () => {
  return (
    <div className="tech-savvy-map">
      <header className="map-header">
        <h1>
          Welcome to <span>Campus Navigator</span>
        </h1>
        <p>Find classrooms, offices, and study spaces with ease.</p>
      </header>

      <main className="map-main">
        <div className="buildings-grid">
          {buildings.map((building, index) => (
            <div key={index} className="building-card">
              <div className="building-header">
                <h2>{building.name}</h2>
                <p>{building.description}</p>
              </div>
              <div className="floors">
                {building.floors.map((floor, idx) => (
                  <div key={idx} className="floor">
                    <h3>{floor.name}</h3>
                    <ul>
                      {floor.rooms.map((room, id) => (
                        <li key={id}>{room}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="map-footer">
        <p>© 2025 Campus Navigator. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default TechSavvyUniversityMap;
