import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import "./slide.css";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

const Slide = () => {
  const [latestSpaces, setLatestSpaces] = useState([]);
  const cancelRequestRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cancelRequestRef.current) {
      cancelRequestRef.current.abort();
    }
    cancelRequestRef.current = new AbortController();

    const fetchLatestSpaces = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
        const spaceEndpoint = process.env.REACT_APP_PROFILE_ENDPOINT || "api/spaces/topseatingspaces";
        const endpoint = `${serverUrl}/${spaceEndpoint}`;

        const response = await axios.get(endpoint, {
          signal: cancelRequestRef.current.signal,
        });
        setLatestSpaces(response.data);
      } catch (error) {
        console.error("Error fetching space data:", error);
      }
    };

    fetchLatestSpaces();

    return () => {
      if (cancelRequestRef.current) {
        cancelRequestRef.current.abort();
      }
    };
  }, []);

  const handleSpaceClick = (id) => {
    navigate({
      pathname: "/reserve",
      search: createSearchParams({
        id: id,
      }).toString(),
    });
  };

  const latestSpacesElements = latestSpaces?.map((space) => (
    <div className="cards home-c" onClick={() => handleSpaceClick(space._id)} key={space._id}>
      <div>
        <img className="img-bottom" alt="Card image" src={space.photos[0]} />
      </div>
      <div className="p-3">
        <div className="d-flex">
          <h5 className="card-title m-0">{space.spaceName}</h5>
        </div>
        <p>
          <b>Address: </b>
          {space.spaceAddress}
        </p>
        <div className="d-flex m-0 p-0">
          <p>
            <b>Pricing: </b> {space.pricing}
          </p>
        </div>
      </div>
    </div>
  ));

  const responsiveSettings = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
      partialVisibilityGutter: 40,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 30,
    },
  };

  return (
    <Carousel
      additionalTransfrom={0}
      arrows
      autoPlaySpeed={1000}
      centerMode
      className=""
      containerClass="container-with-dots"
      dotListClass=""
      draggable
      focusOnSelect={false}
      infinite
      itemClass=""
      keyBoardControl
      minimumTouchDrag={80}
      pauseOnHover
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={responsiveSettings}
      rewind={false}
      rewindWithAnimation={false}
      rtl={false}
      shouldResetAutoplay
      showDots={false}
      sliderClass=""
      slidesToSlide={1}
      swipeable
    >
      {latestSpacesElements}
    </Carousel>
  );
};

export default Slide;
