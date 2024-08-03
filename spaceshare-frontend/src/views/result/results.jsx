import React, { useEffect, useState } from "react";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import { Spinner } from "react-bootstrap";

const Results = () => {
  const server_url =
    process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    location: searchParams.get("location") || "",
    spaceType: searchParams.get("type") || "",
    keyword: searchParams.get("keyword") || "",
    capacity: 0,
  });

  const spaceId = (id) => {
    navigate({
      pathname: "/reserve",
      search: createSearchParams({
        id: id,
      }).toString(),
    });
  };

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch(`${server_url}/api/spaces`);
        const data = await response.json();
        setSpaces(data);
        setFilteredSpaces(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [server_url]);

  useEffect(() => {
    let filtered = spaces;
    if (selectedFilters.keyword) {
      filtered = filtered.filter((space) =>
        space.spaceName
          .toLowerCase()
          .includes(selectedFilters.keyword.toLowerCase())
      );
    }
    if (selectedFilters.spaceType) {
      filtered = filtered.filter(
        (space) => space.spaceType === selectedFilters.spaceType
      );
    }
    if (selectedFilters.location) {
      filtered = filtered.filter(
        (space) =>
          space.spaceAddress &&
          space.spaceAddress
            .toLowerCase()
            .includes(selectedFilters.location.toLowerCase())
      );
    }
    if (selectedFilters.capacity) {
      filtered = filtered.filter(
        (space) => space.Capacity >= selectedFilters.capacity
      );
    }
    setFilteredSpaces(filtered);
  }, [spaces, selectedFilters]);

  const handleFilterChange = (filter, value) => {
    let newValue = value;
    if (filter === "capacity") {
      newValue = parseInt(value, 10);
      newValue = isNaN(newValue) ? 0 : newValue;
    }

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: newValue,
    }));
  };

  const showAllSpaces = () => {
    setSelectedFilters({
      location: "",
      spaceType: "",
      keyword: "",
      capacity: 0,
    });

    setFilteredSpaces(spaces);
  };

  const uniqueSpaceTypes = [...new Set(spaces.map((space) => space.spaceType))];
  const uniqueLocations = ["Halifax", "Toronto", "Chicago", "San Francisco"];

  return (
    <div className="container cb">
      <div className="button-group">
        <button
          className="btn btn-secondary"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          {filtersOpen ? "Hide Filters" : "Show Filters"}
        </button>
        <button className="btn btn-primary" onClick={showAllSpaces}>
          Show All Spaces
        </button>
      </div>

      {filtersOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label htmlFor="location-filter">Location</label>
            <select
              id="location-filter"
              className="form-control"
              value={selectedFilters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location, idx) => (
                <option key={idx} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="spaceType-filter">Space Type</label>
            <select
              id="spaceType-filter"
              className="form-control"
              value={selectedFilters.spaceType}
              onChange={(e) => handleFilterChange("spaceType", e.target.value)}
            >
              <option value="">All Space Types</option>
              {uniqueSpaceTypes.map((spaceType, idx) => (
                <option key={idx} value={spaceType}>
                  {spaceType}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="capacity-filter">Seating Capacity</label>
            <select
              id="capacity-filter"
              className="form-control"
              value={selectedFilters.capacity}
              onChange={(e) => handleFilterChange("capacity", e.target.value)}
            >
              <option value="0">All Capacities</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <section className="space-list">
          {filteredSpaces.length === 0 ? (
            <p>No spaces found</p>
          ) : (
            filteredSpaces.map((space, index) => (
              <div
                key={index}
                className="space-item"
                onClick={() => spaceId(space._id)}
              >
                <div className="card space-card">
                  <img
                    src={space.photos[0] || "https://via.placeholder.com/150"}
                    className="card-img-top"
                    alt={space.spaceName}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{space.spaceName}</h5>
                    <p className="card-text">
                      <strong>Address:</strong>{" "}
                      {space.spaceAddress || "Unknown"}
                    </p>
                    <p className="card-text">
                      <strong>Pricing:</strong> ${space.pricing}
                    </p>
                    <p className="card-text">
                      <strong>Space Type:</strong> {space.spaceType}
                    </p>
                    <p className="card-text">
                      <strong>Capacity:</strong> {space.Capacity}
                    </p>
                    <button className="btn btn-primary">Book</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
};

export default Results;
