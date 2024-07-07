import React, { useEffect, useState, useRef } from "react";
import "./home.css";
import { Button } from "react-bootstrap";
import Slide from "../../components/slider/slide";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { isAxiosError } from 'axios';
import { useNavigate, createSearchParams } from "react-router-dom";

const Home = () => {
  const [cuisine, setCuisine] = useState("Space Type");
  const [location, setLocation] = useState("Space Location");
  const [keyword, setKeyword] = useState("");
  const [topSpaces, setTopSpaces] = useState([]); 

  const navigate = useNavigate();
  const cancelRequestRef = useRef(null);
  
  useEffect(() => {
    
    cancelRequestRef.current?.abort();
    cancelRequestRef.current = new AbortController();
    const fetchTopSpaces = async () => {
      try {
        const server_url = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
        const space_endpoint = process.env.REACT_APP_PROFILE_ENDPOINT || "api/Spaces/topSpaces";
      
        const token = sessionStorage.getItem("token");
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        const endpoint = `${server_url}/${space_endpoint}`;
        const response = await axios.get(endpoint, { signal: cancelRequestRef.current?.signal, headers: headers})
        .then((response) => response)
        .catch((err) => err);

        setTopSpaces(response.data);
      } catch (error) { 
        console.error("Error fetching restaurant data:",error);
      }
    };

    fetchTopSpaces(); 

  }, []);
  
    const restaurantid = (id) => {
      navigate({
        pathname: "/reserve",
        search: createSearchParams({
          id : id,
        }).toString(),
      });
    };

  const topSpacesList = topSpaces?.map((restaurant) => {
    return (
      <div className="col-md-4 mb-3 home-c " >
        <div className="card " onClick={() => restaurantid(restaurant._id)}>
          <img  className="img-top " alt="safdf" src={restaurant.photos[0]} />
          <div className="card-body">
            <div className="d-flex border-bottom">
            <h4 className="card-title m-0 col-9">{restaurant.restaurantName}</h4>
            <p> {restaurant.operatingHours}</p>
            </div>
            <p className="card-text m-0 p-0"><b>Address : </b>{restaurant.spaceAddress}</p>
            <div className="d-flex"><p className="card-text "> <b>Cost:    </b> {restaurant.pricing} </p></div>
          </div>
        </div>
      </div>
    );
  });

  const redirect = () => {
    navigate({
      pathname: "/search",
      search: createSearchParams({
        c: cuisine,
        l: location,
        K: keyword,
      }).toString(),
    });
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleCuisineChange = (e) => {
    setCuisine(e.target.options[e.target.selectedIndex].text);
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (location === "0") {
      alert("Please select a valid location");
    } else {
      redirect();
    }
  };

  const handleBuffetClick = () => {
    // Directly navigate without updating the component state
    navigate({
      pathname: "/search",
      search: createSearchParams({
        c: "Indian", // Directly set the cuisine to Indian
        l: location,
        K: keyword,
      }).toString(),
    });
  };

  const handleVegClick = () => {
    // Directly navigate without updating the component state
    navigate({
      pathname: "/search",
      search: createSearchParams({
        c: cuisine, // Directly set the cuisine to Indian
        l: location,
        K: "Mirchi Tandoor",
      }).toString(),
    });
  };

  const handleMustVisitClick = () => {
    // Directly navigate without updating the component state
    navigate({
      pathname: "/search",
      search: createSearchParams({
        c: "Italian", // Directly set the cuisine to Indian
        l: location,
        K: keyword,
      }).toString(),
    });
  };

  const handleHappyHoursClick = () => {
    // Directly navigate without updating the component state
    navigate({
      pathname: "/search",
      search: createSearchParams({
        c: cuisine, // Directly set the cuisine to Indian
        l: location,
        K: "Tawa Grill",
      }).toString(),
    });
  };

  const handleNewSpacesClick = () => {
    // Directly navigate without updating the component state
    navigate({
      pathname: "/search",
      search: createSearchParams({
        c: cuisine, // Directly set the cuisine to Indian
        l: location,
        K: "Marthas",
      }).toString(),
    });
  };

  const handleMeatestClick = () => {
    // Directly navigate without updating the component state
    navigate({
      pathname: "/search",
      search: createSearchParams({
        c: cuisine, // Directly set the cuisine to Indian
        l: location,
        K: "Paradise Restaurant",
      }).toString(),
    });
  };

  const handleSeaFoodClick = () => {
    // Directly navigate without updating the component state
    navigate({
      pathname: "/search",
      search: createSearchParams({
        c: cuisine, // Directly set the cuisine to Indian
        l: location,
        K: "Mehfil Restaurant",
      }).toString(),
    });
  };

  const handleVeganFoodClick = () => {
    // Directly navigate without updating the component state
    navigate({
      pathname: "/search",
      search: createSearchParams({
        c: cuisine, // Directly set the cuisine to Indian
        l: location,
        K: "Santosh Dhaba",
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
                onChange={handleCuisineChange}
              >
                <option>Space Type</option>
                <option>Tree House</option>
                <option>Meeting Spaces</option>
                <option>Cabins</option>
                <option>Domes</option>
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
                <option value="0">Space Location</option>
                <option value="New York">Halifax</option>
                <option value="Los Angeles">Toronto</option>
                <option value="Chicago">Chicago</option>
                <option value="San Francisco">San Francisco</option>
              </select>
            </form>
            <p className="quote text-center" style={{ fontSize: "3vw" }}>
            Uncover unique spots and authentic places in your favorite cities like Halifax and many more....”{" "}
            </p>
          </div>
        </div>
      </div>
      <section className="pt-5 pb-5">
        <div className="container">
        <div className="container slide">
        <h2>Featured Spaces</h2>
        <Slide />
      </div>

      <div className="container slide">
        <h2>Featured Spaces</h2>
        <Slide />
      </div>
          <div className="row">
            <div className="col-6">
              <h3 className="mb-3">Top Spaces This Month</h3>
            </div>
            <div className="col-12">
              <div className="row">
                {topSpacesList}  
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <section className="pt-5 pb-5">
          <div className="container">
            <div className="row">
              <div className="col-md-3 my-3 ">
                <div
                  className="card border  border-3 border-warning rounded-lg shadow-lg type"
                  onClick={handleBuffetClick} // Using the new function here
                >
                  <div className="card-body  d-flex flex-row">
                    <div>
                      <h5 className="card-title">Halifax Specials</h5>
                      <p className="card-text">
                      Explore Halifax Spaces: Enjoy a wide variety of unique and authentic spaces in your favorite city, Halifax.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 my-3 ">
                <div className="card border border-3 border-warning rounded-lg shadow-lg type">
                  <div
                    className="card-body d-flex flex-row"
                    onClick={handleVegClick}
                  >
                    <div>
                      <h5 className="card-title">Barbie's Dream Palace</h5>
                      <p className="card-text">
                      Dream Spaces: Experience the ultimate in luxury and comfort with our premium space listings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 my-3 ">
                <div className="card border border-3 border-warning rounded-lg shadow-lg type">
                  <div
                    className="card-body d-flex flex-row"
                    onClick={handleMustVisitClick}
                  >
                    <div>
                      <h5 className="card-title">Barbeque Special</h5>
                      <p className="card-text">
                      Exclusive Space Offers: Discover must-visit spaces in our city at a discounted rate (Special Offer).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 my-3 ">
                <div className="card border border-3 border-warning rounded-lg shadow-lg type">
                  <div
                    className="card-body d-flex flex-row"
                    onClick={handleHappyHoursClick}
                  >
                    <div>
                      <h5 className="card-title">Cabins</h5>
                      <p className="card-text">
                      Cozy Corners: Enjoy your happy hours with a beautiful downtown view in comfortable and private spaces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 my-3 ">
                <div className="card border border-3 border-warning rounded-lg shadow-lg type">
                  <div
                    className="card-body d-flex flex-row"
                    onClick={handleNewSpacesClick}
                  >
                    <div>
                      <h5 className="card-title">Amazing views</h5>
                      <p className="card-text">
                      Stunning Spaces: Explore the latest additions to our collection of amazing view spaces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 my-3 ">
                <div className="card border border-3 border-warning rounded-lg shadow-lg type">
                  <div
                    className="card-body d-flex flex-row"
                    onClick={handleMeatestClick}
                  >
                    <div>
                      <h5 className="card-title">Countryside</h5>
                      <p className="card-text">
                      Rustic Retreats: Experience the charm of the countryside with a variety of unique spaces at discounted prices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 my-3 ">
                <div className="card border border-3 border-warning rounded-lg shadow-lg type">
                  <div
                    className="card-body d-flex flex-row"
                    onClick={handleSeaFoodClick}
                  >
                    <div>
                      <h5 className="card-title">Tree house</h5>
                      <p className="card-text">
                      Elevated Experiences: Treat yourself to unique treehouse spaces, offering a fresh perspective.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 my-3 ">
                <div className="card border border-3 border-warning rounded-lg shadow-lg type">
                  <div
                    className="card-body d-flex flex-row"
                    onClick={handleVeganFoodClick}
                  >
                    <div>
                      <h5 className="card-title">Domes</h5>
                      <p className="card-text">
                      Eco-Friendly Escapes: Discover the benefits of staying in our eco-friendly dome spaces with a touch of rustic charm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </section>
        <div className="container slide">
        <h2>Featured Spaces</h2>
        <Slide />
      </div>
        
      </section>
      
      

      
    </div>

    
    
  );
};

export default Home;