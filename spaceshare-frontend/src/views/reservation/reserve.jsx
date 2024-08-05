import React, { useEffect, useState, useRef } from "react";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./reserve.css";
import useAuth from "../../hooks/useAuth";
import axios, { isAxiosError } from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSearchParams, useNavigate } from "react-router-dom";

const Reserve = () => {
  const { getUserId } = useAuth();
  const cancelRequestRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [spaceData, setSpaceData] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    const server_url = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
    const space_endpoint = process.env.REACT_APP_PROFILE_ENDPOINT || "api/spaces";
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
        const response = await axios.get(endpoint, {
          signal: cancelRequestRef.current?.signal,
          headers: headers,
        });
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
        const response = await axios.get(`${endpoint}/${review}`, {
          signal: cancelRequestRef.current?.signal,
          headers: headers,
        });
        setReviewData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching review data:", error);
      }
    };

    fetchReview();
    fetchData();
  }, [searchParams, navigate]);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success('Copied to clipboard!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      () => {
        toast.error('Failed to copy!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    );
  };

  const toggleReviews = () => {
    setShowModal(true);
  };

  let pics = [];
  if (spaceData) {
    const { photos } = spaceData;
    pics = photos;
  }

  let reviewList = [];
  if (reviewData) {
    const { reviews } = reviewData;
    reviewList = reviews;
  }

  const reviewDisplay = reviewList.map((review, index) => (
    <div key={index} className="card card-body">
      <div className="border-bottom d-flex align-items-center">
        <h3 className="mx-3 my-1">
          <i className="bi bi-person-circle"></i>
        </h3>
        <h4 className="card-title">{review.userID?.name}</h4>
      </div>
      <p className="card-text review-text my-3">{review.review}</p>
    </div>
  ));

  const resPics = pics.map((pic, index) => (
    <Carousel.Item key={index}>
      <img className="d-block w-100" src={pic} alt="Space images" />
      <Carousel.Caption></Carousel.Caption>
    </Carousel.Item>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Push event to the data layer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'reservation_submission'
    });
    
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
        userID: userId,
        reservationDate: formData.date,
        reservationTime: formData.time,
        noOfGuests: formData.guests,
      };
      const server_url = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
      const space_endpoint = process.env.REACT_APP_PROFILE_ENDPOINT || "api/user-reservation/book";
      const token = sessionStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const endpoint = `${server_url}/${space_endpoint}`;

      await axios.post(endpoint, reservationData, {
        signal: cancelRequestRef.current?.signal,
        headers: headers,
      });
      navigate("/history");
      alert("Reservation created successfully!");
    } catch (error) {
      console.error("Error creating reservation:", error);
      if (isAxiosError(error)) {
        if (error.response.status === 400) {
          alert("Please provide all required fields.");
        } else if (error.response.status === 401 || error.response.status === 403) {
          alert("Please login to create a reservation.");
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
              <Carousel className="border-bottom">{resPics}</Carousel>
            </Card.Body>
            <Card.Footer className="cfooter d-flex-column text-white">
              <div className="d-flex border-bottom align-items-center justify-content-between">
                {spaceData && (
                  <h3 className="col-8 my-2">{spaceData.spaceName}</h3>
                )}
                <div className="col-2 text-center">
                  {reviewData && (
                    <button className="btn rating btn-success">
                      {reviewData.averageRating.toFixed(1)}
                    </button>
                  )}
                </div>
                {spaceData && (
                  <button 
                    onClick={copyToClipboard} 
                    className="btn btn-outline-secondary btn-sm col-2"
                    style={{ fontSize: "1.5rem" }}
                  >
                    <i className="bi bi-share"></i>
                  </button>
                )}
              </div>
              <div className="container my-4">
                {spaceData && (
                  <p>
                    <b>Address: </b>
                    {spaceData.spaceAddress}
                  </p>
                )}
                {spaceData && (
                  <p>
                    <b>Phone:</b> {spaceData.contactNumber}
                  </p>
                )}
                {spaceData && (
                  <p>
                    <b>Check-IN Time:</b> {spaceData.checkInTime}
                  </p>
                )}
                {spaceData && (
                  <p>
                    <b>Check-OUT Time:</b> {spaceData.checkOutTime}
                  </p>
                )}
                {spaceData && (
                  <p>
                    <b>Capacity:</b> {spaceData.Capacity}
                  </p>
                )}
                {spaceData && (
                  <p>
                    <b>Space Category: </b>
                    {spaceData.spaceType}
                  </p>
                )}
                {spaceData && (
                  <p>
                    <b>Pricing:</b> {spaceData.pricing}
                  </p>
                )}
              </div>
            </Card.Footer>
          </Card>
        </div>
        <div className="col-6">
          <form id ="reservationForm" className="m-5 fcontainer" onSubmit={handleSubmit}>
            <h4 className="text-center text-capitalize">
              <b>Reservation Form</b>
            </h4>
            <hr />
            <div className="form-group">
              <label htmlFor="nameInput">Name</label>
              <input
                type="text"
                className="form-control control-p"
                id="nameInput"
                placeholder="Enter name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="emailInput">Email</label>
              <input
                type="email"
                className="form-control control-p"
                id="emailInput"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneInput">Phone</label>
              <input
                type="number"
                className="form-control control-p"
                id="phoneInput"
                placeholder="Enter phone"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateInput">Date</label>
              <input
                type="date"
                className="form-control control-p text-center"
                id="dateInput"
                placeholder="Enter date"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="timeInput">Time</label>
              <input
                type="time"
                className="form-control control-p text-center"
                id="timeInput"
                placeholder="Enter time"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="guestsInput">Number of guests (max 5)</label>
              <select
                className="form-select text-center"
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
            <div className="m-5 text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="review">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <b>Ratings & Reviews </b>
            </div>
            {reviewData && (
              <div>
                <b>Number Of Reviews:</b> {reviewData.reviewCount}
              </div>
            )}
            <div>
              <b>Average Rating:</b>{" "}
              {reviewData && reviewData.averageRating.toFixed(1)}
            </div>
            {reviewData &&
              Array.from({ length: reviewData.averageRating }, (_, index) => (
                <i key={index} className="bi bi-star-fill"></i>
              ))}
            <button className="btn btn-primary" onClick={toggleReviews}>
              Show Reviews
            </button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {reviewDisplay}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Reserve;
