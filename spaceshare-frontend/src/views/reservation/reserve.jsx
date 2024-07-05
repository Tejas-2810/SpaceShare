import React, { useEffect, useState, useRef } from "react";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import "./reserve.css";
import useAuth from "../../hooks/useAuth";
import axios, { isAxiosError } from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

const Reserve = () => {
  const { getUserId } = useAuth();
  const cancelRequestRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [spaceData, setSpaceData] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const userId = getUserId();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const server_url =
      process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
    const space_endpoint =
      process.env.REACT_APP_PROFILE_ENDPOINT || "api/spaces";
    const spaceId = searchParams.get("id") || "660345d96a5e6f56688098a6";
    const review = "reviews"; 

    const endpoint = `${server_url}/${space_endpoint}/${spaceId}`;

    cancelRequestRef.current?.abort();
    cancelRequestRef.current = new AbortController();
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios
          .get(endpoint, {
            signal: cancelRequestRef.current?.signal,
            headers: headers,
          })
          .then((response) => response)
          .catch((err) => err);

        setSpaceData(response.data);
      } catch (error) {
        console.error("Error fetching space data:", error);
      }
    };
    const fetchReview = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios
          .get(`${endpoint}/${review}`, {
            signal: cancelRequestRef.current?.signal,
            headers: headers,
          })
          .then((response) => response)
          .catch((err) => err);
        setReviewData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };
    fetchReview();
    fetchData();
  }, []);
  var pics = [];
  var pay = "no";
  if (spaceData) {
    const {
      spaceName,
      spaceAddress,
      pricing,
      spaceType,
      contactNumber,
      checkInTime,
      checkOutTime,
      Capacity,
      photos,
    } = spaceData;
    pics = photos;
  }
  var reviewList = [];
  if (reviewData) {
    const { averageRating, reviewCount, reviews } = reviewData;
    reviewList = reviews;
  }
  if (reviewList) {
    reviewList.forEach((review) => {
      if (review.userID && review.userID.name) {
        console.log("Name:", review.userID.name);
      }
    });
  }
  const reviewdisplay = reviewList.map((reviewList) => {
    return (
      <div class="collapse multi-collapse" id="multiCollapseExample2">
        <div class=" card card-body">
          <div className="border-bottom d-flex align-items-center">
            <h3 class=" mx-3 my-1">
              <i class="bi bi-person-circle"></i>
            </h3>
            <h4 class="card-title ">{reviewList.userID?.name}</h4>
          </div>
          <p class="card-text review-text my-3">{reviewList.review}</p>
        </div>
      </div>
    );
  });

  const respics = pics.map((pics) => {
    return (
      <Carousel.Item>
        <img className="d-block w-100" src={pics} alt="Space images" />
        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
    );
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name: e.target.nameInput.value,
        email: e.target.emailInput.value,
        phone: e.target.phoneInput.value,
        date: e.target.dateInput.value,
        time: e.target.timeInput.value,
        guests: parseInt(e.target.guests.value),
      };
      const reservationData = {
        spaceID: searchParams.get("id"),
        userID: userId ,
        reservationDate: formData.date,
        reservationTime: formData.time,
        noOfGuests: formData.guests,
      };
      const server_url =
        process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
      const space_endpoint =
        process.env.REACT_APP_PROFILE_ENDPOINT || "api/user-reservation/book";

      const token = sessionStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const endpoint = `${server_url}/${space_endpoint}`;
      if(pay === "no"){
        const response = await axios
          .post(endpoint, reservationData, {
            signal: cancelRequestRef.current?.signal,
            headers: headers,
          })
          .then((response) => response)
          .catch((err) => err);
        navigate("/history");
      }
      alert("Reservation created successfully!");
    } catch (error) {
      console.error("Error creating reservation:", error);
      if (isAxiosError(error)) {
        if (error.response.status === 400) {
          alert("Please provide all required fields.");
        } else if (
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          alert("Please login to create a reservation.");
          // navigate("/signin", {state: {from: location}, replace: true});
        }
        return;
      }
      alert("Error creating reservation. Please try again.");
    }
  };
  return (
    <div className="pcontainer container main-content">
      <div className="row">
        <div className="col-md-6">
          <Card className="card-reserve">
            <Card.Body className="cbody">
              <Carousel className=" border-bottom">{respics}</Carousel>
            </Card.Body>
            <Card.Footer className="cfooter d-flex-column text-white">
              <div className="d-flex border-bottom ">
                {spaceData && (
                  <h3 className="col-10 my-2">
                    {spaceData.spaceName}
                  </h3>
                )}
                <div className="col-2 text-center">
                  {reviewData && (
                    <button className="btn rating btn-success">
                      {" "}
                      {reviewData.averageRating.toFixed(1)}{" "}
                    </button>
                  )}
          
                </div>
              </div>

              <div className=" container my-4">
                {spaceData && (
                  <p>
                    {" "}
                    <b>Address: </b>
                    {spaceData.spaceAddress}
                  </p>
                )}
                {spaceData && (
                  <p>
                    {" "}
                    <b>Phone:</b> {spaceData.contactNumber}
                  </p>
                )}
                {spaceData && (
                  <p>
                    {" "}
                    <b>Check-IN Time:</b> {spaceData.checkInTime}
                  </p>
                )}
                {spaceData && (
                  <p>
                    {" "}
                    <b>Check-OUT Time:</b> {spaceData.checkOutTime}
                  </p>
                )}
                {spaceData && (
                  <p>
                    {" "}
                    <b>Capacity:</b> {spaceData.Capacity}
                  </p>
                )}
                {spaceData && (
                  <p>
                    {" "}
                    <b>Space Category: </b>
                    {spaceData.spaceType}
                  </p>
                )}
                {spaceData && (
                  <p>
                    {" "}
                    <b>Pricing:</b> {spaceData.pricing}
                  </p>
                )}
              </div>
            </Card.Footer>
          </Card>
        </div>
        <div className="col-6">
          <form className="m-5 fcontainer " onSubmit={handleSubmit}>
            <h4 className="text-center text-capitalize">
              <b>Reservation Form</b>
            </h4>
            <hr />
            <div className="form-group">
              <label htmlFor="nameInput">Name</label>
              <input
                type="text"
                className="form-control control-p "
                id="nameInput"
                placeholder="Enter name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="emailInput">Email</label>
              <input
                type="email"
                className="form-control control-p "
                id="emailInput"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneInput">Phone</label>
              <input
                type="number"
                className="form-control control-p "
                id="phoneInput"
                placeholder="Enter phone"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateInput">Date</label>
              <input
                type="date"
                className="form-control control-p  text-center"
                id="dateInput"
                placeholder="Enter date"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="timeInput">Time</label>
              <input
                type="time"
                className="form-control control-p  text-center"
                id="timeInput"
                placeholder="Enter time"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="guestsInput">Number of guests (max 5)</label>
              <div className="dropdown">
                <select
                  class="form-select text-center"
                  id="guests"
                  aria-label="Example select with button addon"
                  required
                >
                  <option selected>None</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                  <option value="4">Four</option>
                  <option value="5">Five</option>
                </select>
              </div>
            </div>
            <div className="m-5 text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="review">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              {" "}
              <b>Ratings & Reviews </b>
            </div>
            {reviewData && (
              <div>
                {" "}
                <b>Number Of Reviews:</b> {reviewData.reviewCount}{" "}
              </div>
            )}
            <div>
              {" "}
              <b>Average Rating:</b>{" "}
              {reviewData && reviewData.averageRating.toFixed(1)}{" "}
            </div>
            {reviewData &&
              Array.from({ length: reviewData.averageRating }, (_, index) => (
                <i key={index} className="bi bi-star-fill"></i>
              ))}
            <button
              class="btn btn-primary"
              type="button"
              data-toggle="collapse"
              data-target=".multi-collapse"
              aria-expanded="false"
            >
              Show Reviews
            </button>
          </div>
          <div className=""></div>
          {reviewdisplay}
        </div>
      </div>
    </div>
  );
};

export default Reserve;
