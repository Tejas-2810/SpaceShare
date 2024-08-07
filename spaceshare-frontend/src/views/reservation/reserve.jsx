import React, { useEffect, useState, useRef } from "react";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./reserve.css";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import Rating from 'react-rating-stars-component';
import { isAxiosError } from "axios";

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
    const spaceId = searchParams.get("id");
    const reviewEndpoint = `${server_url}/${space_endpoint}/${spaceId}/reviews`;

    cancelRequestRef.current?.abort();
    cancelRequestRef.current = new AbortController();

    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

      try {
        const [spaceResponse, reviewResponse] = await Promise.all([
          axios.get(`${server_url}/${space_endpoint}/${spaceId}`, { headers }),
          axios.get(reviewEndpoint, { headers })
        ]);
        setSpaceData(spaceResponse.data);
        setReviewData(reviewResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchParams, navigate]);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => toast.success('Copied to clipboard!'),
      () => toast.error('Failed to copy!')
    );
  };

  const toggleReviews = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    window.gtag('event', 'reservation_submission', {
      'event_category': 'Reservation',
      'event_label': 'Form Submission',
      'value': 1
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

  const reviewDisplay = reviewData?.reviews?.map((review, index) => (
    <div key={index} className="card card-body">
      <h4 className="card-title">UserName: {review.userID?.name}</h4>
      <p className="card-text review-text"><b>Review: </b>{review.review}</p>
    </div>
  ));
  
  
  

  return (
    <div className="pcontainer container main-content">
      <div className="row">
        <div className="col-md-6">
          <Card className="card-reserve">
            <Card.Body className="cbody">
              <Carousel className="border-bottom">
                {spaceData?.photos?.map((pic, index) => (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={pic} alt="Space images" />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
            <Card.Footer className="cfooter text-white">
  <div className="d-flex justify-content-between align-items-center mb-3 separator">
    <h2>{spaceData?.spaceName}</h2>
    <div>
      {reviewData && (
        <span  className="btn rating btn-success">
          {reviewData.averageRating.toFixed(1)}
        </span>
      )}

  <button onClick={copyToClipboard} className="btn icon-button" title="Share Space">
    <i className="bi bi-share"></i>
  </button>
  <button onClick={toggleReviews} className="btn icon-button ml-2" title="Show Reviews">
    <i className="bi bi-card-text"></i>
  </button>


    </div>
  </div>
  <div>
    <p><strong>Address:</strong> {spaceData?.spaceAddress}</p>
    <p><strong>Phone:</strong> {spaceData?.contactNumber}</p>
    <p><strong>Check-IN Time:</strong> {spaceData?.checkInTime}</p>
    <p><strong>Check-OUT Time:</strong> {spaceData?.checkOutTime}</p>
    <p><strong>Capacity:</strong> {spaceData?.Capacity}</p>
    <p><strong>Category:</strong> {spaceData?.spaceType}</p>
    <p><strong>Pricing:</strong> ${spaceData?.pricing}</p>
  </div>
</Card.Footer>
          </Card>
        </div>
        <div className="col-md-6">
        <form className="m-5 fcontainer" onSubmit={handleSubmit}>
            <h4 className="text-center text-capitalize"><b>Reservation Form</b></h4>
            <hr />
            <div className="form-group">
              <label htmlFor="nameInput">Name</label>
              <input type="text" className="form-control" id="nameInput" placeholder="Enter name" required />
            </div>
            <div className="form-group">
              <label htmlFor="emailInput">Email</label>
              <input type="email" className="form-control" id="emailInput" placeholder="Enter email" required />
            </div>
            <div className="form-group">
              <label htmlFor="phoneInput">Phone</label>
              <input type="number" className="form-control" id="phoneInput" placeholder="Enter phone" required />
            </div>
            <div className="form-group">
              <label htmlFor="dateInput">Date</label>
              <input type="date" className="form-control" id="dateInput" required />
            </div>
            <div className="form-group">
              <label htmlFor="timeInput">Time</label>
              <input type="time" className="form-control" id="timeInput" required />
            </div>
            <div className="form-group">
              <label htmlFor="guestsInput">Number of guests (max 5)</label>
              <select className="form-control" id="guests" required>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                <option value="4">Four</option>
                <option value="5">Five</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary mt-4">Submit</button>
          </form>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Reviews</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <div className="reviews-header mb-3 d-flex align-items-center">
    <div className="me-2">
      <h4>Average Rating:</h4>
    </div>
    <div>
      <Rating
        value={reviewData?.averageRating}
        size={24}
        edit={false}
        activeColor="#ffd700"
      />
    </div>
    <div className="ms-2">
      <h4>({reviewData?.reviews.length} Reviews)</h4>
    </div>
  </div>
  {reviewDisplay}
</Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
  </Modal.Footer>
</Modal>


      <ToastContainer />
    </div>
  );
};

export default Reserve;
