import React, { useState, useEffect } from "react";
import axios from "axios";
import "./history.css";
import useAuth from "../../hooks/useAuth";

const History = () => {
  const { getUserId } = useAuth();

  const userId = getUserId();

  const [data, setData] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  const [currentReviewDetails, setCurrentReviewDetails] = useState(null);
  const [review, setReview] = useState({
    rating: "",
    recommendation: "",
    comment: "",
  });
  const server_url =
    process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      const historyUrl = `${server_url}/api/user-reservation/history/${userId}`;
      const restaurantsUrl = `${server_url}/api/spaces/`;
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const [reservationsResponse, restaurantsResponse] = await Promise.all([
          axios.get(historyUrl, { headers: headers }),
          axios.get(restaurantsUrl, { headers: headers }),
        ]);
        setData(reservationsResponse.data.reservations);
        setRestaurantDetails(restaurantsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleCancel = async (userId, reservationId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (isConfirmed) {
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const deleteUrl = `${server_url}/api/user-reservation/delete/${userId}/${reservationId}`;
        await axios.delete(deleteUrl, { headers: headers });
        setData(data.filter((item) => item._id !== reservationId));
      } catch (error) {
        console.error("Failed to delete the reservation:", error);
      }
    } else {
      console.log("Reservation cancellation aborted by the user.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { reservationId, spaceId } = currentReviewDetails;
    const reviewUrl = `${server_url}/api/user-reservation/review/${userId}/${reservationId}`;

    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      await axios.post(
        reviewUrl,
        {
          userID: userId,
          reservationID: reservationId,
          spaceID: spaceId,
          rating: review.rating,
          review: review.comment,
        },
        {
          headers: headers,
        }
      );

      alert("Review submitted successfully!");
      setCurrentReviewDetails(null);
      setReview({ rating: "", recommendation: "", comment: "" });
    } catch (error) {
      console.error("Failed to add the review", error);
    }
  };

  return (
    <div className="container cb bp">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Space name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Review</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((item, index) => {
              const date = new Date(item.reservationDateTime);
              const formattedDate = date.toLocaleDateString("en-US");
              const formattedTime = date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <React.Fragment key={index}>
                  <tr
                    className={
                      item.status === "Completed"
                        ? "table-success"
                        : item.status === "Pending"
                        ? "table-primary"
                        : "table-light-blue"
                    }
                  >
                    <td>{index + 1}</td>
                    <td>
                      {
                        restaurantDetails.find(
                          (rest) => rest._id === item.spaceID
                        )?.spaceName
                      }
                    </td>
                    <td>{formattedDate}</td>
                    <td>{formattedTime}</td>
                    <td>{item.status}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          setCurrentReviewDetails({
                            userId: getUserId(),
                            reservationId: item._id,
                            spaceId: item.spaceID,
                          });
                        }}
                      >
                        Review
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleCancel(getUserId(), item._id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                  {currentReviewDetails &&
                    currentReviewDetails.reservationId === item._id && (
                      <tr>
                        <td colSpan="7">
                          <h5 className="ll">Leave a Review</h5>
                          <div className="review-form">
                            <form onSubmit={handleSubmit}>
                              <div className="form-group">
                                <label htmlFor="ratingInput">
                                  Rate your experience
                                </label>
                                <div className="rating">
                                  {["5", "4", "3", "2", "1"].map((rating) => (
                                    <React.Fragment key={rating}>
                                      <input
                                        type="radio"
                                        name="rating"
                                        value={rating}
                                        id={`rating-${rating}`}
                                        checked={review.rating === rating}
                                        onChange={handleChange}
                                      />
                                      <label htmlFor={`rating-${rating}`}>
                                        ☆
                                      </label>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                              <div className="form-group">
                                <label htmlFor="questionInput">
                                  Would you recommend us to your friends and
                                  family?
                                </label>
                                <div className="d-flex flex-column">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="recommendation"
                                      id="yes"
                                      value="yes"
                                      checked={review.recommendation === "yes"}
                                      onChange={handleChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="recommendation"
                                      id="no"
                                      value="no"
                                      checked={review.recommendation === "no"}
                                      onChange={handleChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="no"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <label htmlFor="commentInput">Comment:</label>
                                <textarea
                                  className="form-control rc"
                                  id="commentInput"
                                  name="comment"
                                  placeholder="Enter your comment"
                                  value={review.comment}
                                  onChange={handleChange}
                                ></textarea>
                              </div>
                              <div className="form-group">
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Save changes
                                </button>
                              </div>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default History;
