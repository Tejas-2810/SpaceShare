import React, { useEffect, useState, useRef } from "react";
import "./home.css";
import Slide from "../../components/slider/slide";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  FaHome,
  FaHotel,
  FaWater,
  FaPlane,
  FaSwimmingPool,
  FaTractor,
} from "react-icons/fa";
import { GiFarmTractor, GiTreehouse, GiBarn } from "react-icons/gi";

const Home = () => {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [topSpaces, setTopSpaces] = useState([]);
  const [latestSpaces, setLatestSpaces] = useState([]);

  const navigate = useNavigate();
  const cancelRequestRef = useRef(null);

  useEffect(() => {
    cancelRequestRef.current?.abort();
    cancelRequestRef.current = new AbortController();

    const fetchTopSpaces = async () => {
      try {
        const server_url =
          process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
        const space_endpoint =
          process.env.REACT_APP_PROFILE_ENDPOINT || "api/Spaces/topSpaces";

        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const endpoint = `${server_url}/${space_endpoint}`;
        const response = await axios.get(endpoint, {
          signal: cancelRequestRef.current?.signal,
          headers: headers,
        });
        setTopSpaces(response.data);
      } catch (error) {
        console.error("Error fetching space data:", error);
      }
    };

    const fetchLatestSpaces = async () => {
      try {
        const server_url =
          process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
        const space_endpoint =
          process.env.REACT_APP_PROFILE_ENDPOINT ||
          "api/Spaces/topseatingspaces";

        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const endpoint = `${server_url}/${space_endpoint}`;
        const response = await axios.get(endpoint, {
          signal: cancelRequestRef.current?.signal,
          headers: headers,
        });
        setLatestSpaces(response.data);
      } catch (error) {
        console.error("Error fetching space data:", error);
      }
    };

    fetchTopSpaces();
    fetchLatestSpaces();
  }, []);

  const spaceid = (id) => {
    navigate({
      pathname: "/reserve",
      search: createSearchParams({
        id: id,
      }).toString(),
    });
  };

  const topSpacesList = topSpaces?.map((space) => {
    return (
      <div className="col-md-4 mb-3 home-c" key={space._id}>
        <div
          className="card fixed-size-card"
          onClick={() => spaceid(space._id)}
        >
          <img
            className="img-top fixed-size-img"
            alt="space"
            src={space.photos[0]}
          />
          <div className="card-body">
            <h4 className="card-title">{space.spaceName}</h4>
            <p className="card-text">
              <b>Address:</b> {space.spaceAddress}
            </p>
            <p className="card-text">
              <b>Cost:</b> {space.pricing}
            </p>
          </div>
        </div>
      </div>
    );
  });

  const latestSpacesList = latestSpaces?.map((space) => {
    return (
      <div className="col-md-4 mb-3 home-c" key={space._id}>
        <div
          className="card fixed-size-card"
          onClick={() => spaceid(space._id)}
        >
          <img
            className="img-top fixed-size-img"
            alt="space"
            src={space.photos[0]}
          />
          <div className="card-body">
            <h4 className="card-title">{space.spaceName}</h4>
            <p className="card-text">
              <b>Address:</b> {space.spaceAddress}
            </p>
            <p className="card-text">
              <b>Cost:</b> {space.pricing}
            </p>
            <p className="card-text">
              <b>Capacity:</b>
              {space.Capacity}
            </p>
          </div>
        </div>
      </div>
    );
  });

  const redirect = () => {
    navigate({
      pathname: "/search",
      search: createSearchParams({
        type,
        location,
        keyword,
      }).toString(),
    });
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    redirect();
  };

  const iconClickHandler = (home) => {
    navigate({
      pathname: "/search",
      search: createSearchParams({
        home: home,
      }).toString(),
    });
  };

  return (
    <div className="hcontainer">
      <div className="bg1">
        <div className="container-sm hs">
          <div className="m-5 p-5 hs1">
            <form className="input-group bar my-5" onSubmit={handleSubmit}>
              <Button className="outline" variant="warning" type="submit">
                Search
              </Button>
              <input
                type="text"
                className="form-control form-control-h"
                placeholder="Search Spaces"
                aria-label="Input group example"
                aria-describedby="basic-addon1"
                onChange={handleKeywordChange}
              />
              <select
                className="form-select form-select-h"
                aria-label="Select Space Type"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.336)",
                  backdropFilter: "blur(20px)",
                  color: "white",
                  borderRadius: "1rem",
                }}
                onChange={handleTypeChange}
              >
                <option value="">Space Type</option>
                <option value="Tree House">Tree House</option>
                <option value="Meeting Spaces">Meeting Spaces</option>
                <option value="Cabins">Cabins</option>
                <option value="Domes">Domes</option>
              </select>
              <select
                className="form-select form-select-h"
                aria-label="Select Location"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.336)",
                  backdropFilter: "blur(20px)",
                  color: "white",
                  borderRadius: "1rem",
                }}
                onChange={handleLocationChange}
              >
                <option value="">Space Location</option>
                <option value="Halifax">Halifax</option>
                <option value="Toronto">Toronto</option>
                <option value="Chicago">Chicago</option>
                <option value="San Francisco">San Francisco</option>
              </select>
            </form>
            <div className="icon-container">
              <div className="icon" onClick={() => iconClickHandler("hotel")}>
                <FaHotel size={40} color="white" />
                <span>Hotel</span>
              </div>
              <div
                className="icon"
                onClick={() => iconClickHandler("lakefront")}
              >
                <FaWater size={40} color="white" />
                <span>Lakefront</span>
              </div>
              <div
                className="icon"
                onClick={() => iconClickHandler("amazing_destinations")}
              >
                <FaPlane size={40} color="white" />
                <span>Amazing Destinations</span>
              </div>
              <div
                className="icon"
                onClick={() => iconClickHandler("beautiful_pools")}
              >
                <FaSwimmingPool size={40} color="white" />
                <span>Beautiful Pools</span>
              </div>
              <div
                className="icon"
                onClick={() => iconClickHandler("countryside")}
              >
                <FaTractor size={40} color="white" />
                <span>Countryside</span>
              </div>
              <div
                className="icon"
                onClick={() => iconClickHandler("tree_houses")}
              >
                <GiTreehouse size={40} color="white" />
                <span>Tree Houses</span>
              </div>
              <div
                className="icon"
                onClick={() => iconClickHandler("halifax_specials")}
              >
                <FaHome size={40} color="white" />
                <span>Halifax Specials</span>
              </div>
              <div className="icon" onClick={() => iconClickHandler("farms")}>
                <GiFarmTractor size={40} color="white" />
                <span>Farms</span>
              </div>
              <div
                className="icon"
                onClick={() => iconClickHandler("space_share_special")}
              >
                <GiBarn size={40} color="white" />
                <span>SpaceShare Special</span>
              </div>
            </div>
            <p className="quote text-center" style={{ fontSize: "2.5vw" }}>
              Uncover unique spots and authentic places in your favorite cities
              like Halifax and many more....”{" "}
            </p>
          </div>
        </div>
      </div>
      <section className="pt-5 pb-5">
        <div className="container">
          <div className="container slide">
            <h2 className="mb-3">Featured Spaces</h2>
            <Slide />
          </div>
          <div className="row">
            <div className="col-6">
              <h2 className="mb-3">Top Spaces in this Month</h2>
            </div>
            <div className="col-12">
              <div className="row">{topSpacesList}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <h2 className="mb-3">Top Spaces with Seating Capacity</h2>
        <div className="row">{latestSpacesList}</div>
      </div>
    </div>
  );
};

export default Home;
