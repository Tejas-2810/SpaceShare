import React, { useEffect, useState, useRef } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import axios, { isAxiosError } from "axios";
import useAuth from "../../hooks/useAuth";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const server_url = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

const Dashboard = () => {
  const { getUserId } = useAuth();
  const userId = getUserId();
  const cancelRequestRef = useRef(null);
  const [rdata, setRdata] = useState([]);
  const [bdata, setBdata] = useState([]);
  const [pdata, setPdata] = useState([]);
  const navigate = useNavigate();
  const [ar, setAr] = useState(0);
  const [tb, setTb] = useState(0);
  const [spaceDetails, setSpaceDetails] = useState([]);

  // fields for creating a new space
  const [spaceName, setSpaceName] = useState("");
  const [address, setAddress] = useState("");
  const [pricing, setPricing] = useState("");
  const [type, setType] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [menu, setMenu] = useState(null);
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    const server_url =
      process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
    const ear = `${server_url}/api/spaces/overall-averagerating/${userId}`;
    const etb = `${server_url}/api/spaces/total-bookings/${userId}`;
    axios.get(ear).then((response) => {
      const ar = response.data.overallAverageRating;
      if (ar === 0) {
        setAr(1);
        return;
      }
      setAr(ar);
    });
    axios.get(etb).then((response) => {
      const tb = response.data.totalBookings;
      if (tb === 0) {
        setTb(1);
        return;
      }
      setTb(tb);
    }, []);

    cancelRequestRef.current?.abort();
    cancelRequestRef.current = new AbortController();
    const fetchData = async () => {
      const space_endpoint =
        process.env.REACT_APP_PROFILE_ENDPOINT ||
        "api/spaces/spaceratings";
      const endpoint = `${server_url}/${space_endpoint}/${userId}`;
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
        setRdata(response.data);
        console.log("PERFECT",rdata);
      } catch (error) {
        console.error("Error fetching Space data:", error);
      }
    };

    const fetchData2 = async () => {
      const resturant_endpoint =
        process.env.REACT_APP_PROFILE_ENDPOINT ||
        "api/spaces/numberOfspacebookings";
      const endpoint = `${server_url}/${resturant_endpoint}/${userId}`;
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
        setBdata(response.data);
        console.log(bdata);
      } catch (error) {
        console.error("Error fetching Space data:", error);
      }
    };

    const fetchData3 = async () => {
      const resturant_endpoint =
        process.env.REACT_APP_PROFILE_ENDPOINT ||
        "api/spaces/bookingpercentages";
      const endpoint = `${server_url}/${resturant_endpoint}/${userId}`;
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
        setPdata(response.data);
        console.log(pdata);
      } catch (error) {
        console.error("Error fetching Space data:", error);
      }
    };

    const fetchSpaces = async () => {
      const endpoint = `${server_url}/api/spaces/ownerspaces/${userId}`;
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(endpoint, { headers: headers });
        if (isAxiosError(response)) {
          console.error("Error fetching user's Spaces:", response.message);
          return;
        }
        setSpaceDetails(response.data);
      } catch (error) {
        console.error("Error fetching user's Spaces:", error.message);
      }
    };

    fetchData();
    fetchData2();
    fetchData3();
    fetchSpaces();
  }, []);

  var gone = [];
  var gtwo = [];
  var gthree = [];
  if (
    rdata &&
    rdata.message !== "No Spaces for the particular Space owner yet"
  ) {
    console.log("pppppppp",rdata);
    gone = rdata.map((item) => {
      return { label: item.spaceName, y: item.averageRating || 1 };
    });
  } else {
    gone = [{ label: "No Spaces", y: 1 }];
  }
  if (
    bdata &&
    bdata.message !== "No Spaces for the particular Space owner yet"
  ) {
    console.log(bdata);
    gtwo = bdata.map((item) => {
      return { label: item.spaceName, y: item.numberOfBookings || 1 };
    });
  } else {
    gtwo = [{ label: "No Spaces", y: 1 }];
  }
  if (pdata) {
    gthree = [
      {
        label: "Paid Booking",
        y: parseFloat(pdata.paidBookingPercentage) || 1,
      },
      {
        label: "Free Booking",
        y: parseFloat(pdata.freeBookingPercentage) || 1,
      },
    ];
  } else {
    gthree = [
      { label: "Paid Booking", y: 1 },
      { label: "Free Booking", y: 1 },
    ];
  }

  const barOptions = {
    backgroundColor: null,
    title: {
      text: "Average Ratings",
    },
    data: [
      {
        type: "column",
        dataPoints: gone.map((item) => ({
          label: item.label,
          y: item.y === 0 ? 1 : item.y,
        })),
      },
    ],
  };

  // to upload file
  const handleFile = (type, e) => {
    const file = e.target.files[0];
    setPhotos(file);
  };

  // adding a space
  const handAddSpace = async (e) => {
    e.preventDefault();
    if (!spaceName || !address || !pricing || !workingHours || !type || !contactNumber || !seatingCapacity) {
      alert("Please fill all the fields");
      return;
    } 
  
    const phoneNumberRegex = /^\d{3}[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phoneNumberRegex.test(contactNumber) || contactNumber.length !== 10) {
      alert("Please enter a valid phone number");
      return;
    }
  
    if (Number(seatingCapacity) <= 0) {
      alert("Please enter a valid seating capacity");
      return;
    }
  
    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      const form = new FormData();
      const data = {
        data:{spaceName:spaceName,
        spaceAddress: address,
        operatingHours: workingHours,
        contactNumber:contactNumber,
        spaceType:type,
        seatingCapacity:seatingCapacity,
        pricing:pricing},  // Assuming you want to send this too
        userId:userId
      };
  
      // form.append("data", JSON.stringify(jsonData));

      // console.log(form, jsonData);
  
      // if (photos) {
      //   form.append("photos", photos);
      // }
  
      const addSpaceUrl = `${server_url}/api/spaces/createspaces`;
      console.log(addSpaceUrl)
      const response = await axios.post(addSpaceUrl, data, { headers });

      console.log("RESPONSE",response)
  
      if (response.status === 200 || response.status === 201) {
        // Handle success
        alert("Space added successfully");
        navigate('/dashboard'); // Redirect or refresh the page, if needed
      }
    } catch (error) {
      console.error("error in adding space: ", error);
      alert("Error adding Space");
    }
  };

  const handleDeleteSpace = async (userId, spaceId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Space?"
    );
    if (isConfirmed) {
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // delete space in collection
        const deleteSpaceUrl = `${server_url}/api/spaces/delete/${spaceId}`;
        await axios.delete(deleteSpaceUrl, { headers: headers });

        // delete space in owner object
        const deleteUrl = `${server_url}/api/spaces/delete/${userId}/${spaceId}`;
        await axios.delete(deleteUrl, { headers: headers });
        alert("Space deleted successfully!!")

        setSpaceDetails(
          spaceDetails.filter(
            (space) => space._id !== spaceId
          )
        );
      } catch (error) {
        console.error("Failed to delete the Space:", error.message);
      }
    } else {
      console.log("Space deletion aborted by the user.");
    }
  };

  const pieOptions = {
    backgroundColor: null,
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Booking Type",
    },
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}%",
        dataPoints: gthree.map((item) => ({
          label: item.label,
          y: item.y,
        })),
      },
    ],
  };

  const barOptions2 = {
    backgroundColor: null,
    title: {
      text: "Average Bookings",
    },
    data: [
      {
        type: "column",
        dataPoints: gtwo.map((item) => ({
          label: item.label,
          y: item.y,
        })),
      },
    ],
  };

  return (
    <div className="cb">
      <div className="row">
        <div className="col-md-6">
          <div className="row my-auto justify-content-evenly my-auto mx-3">
            <div className="card col-md-5">
              <div className="card-body text-center">
                <h5 className="card-title">Total Bookings</h5>
                <p className="card-text">{tb}</p>
              </div>
            </div>
            <div className="card col-md-5 ">
              <div className="card-body text-center">
                <h5 className="card-title">Average Ratings</h5>
                <p className="card-text">{ar}⭐</p>
              </div>
            </div>
          </div>
          <div className="my-2 m-5 p-5">
            {" "}
            <CanvasJSChart options={barOptions} />
          </div>
          <div className="my-2 m-5 p-5">
            {" "}
            <CanvasJSChart options={pieOptions} />
          </div>
          <div className="my-2 m-5 p-5">
            {" "}
            <CanvasJSChart options={barOptions2} />
          </div>
        </div>

        <div className="form-container col-md-6 p-5">
          <div className="border p-5 glass">
            <form className="form">
              <h1 className="text-center">Add Space Details</h1>
              <div className="form-group">
                <label htmlFor="spaceName">Space Name</label>
                <input
                  type="text"
                  value={spaceName}
                  className="form-control"
                  id="spaceName"
                  onInput={(e) => setSpaceName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  value={address}
                  className="form-control"
                  id="address"
                  onInput={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pricing">Pricing</label>
                <input
                  type="text"
                  placeholder="Pricing for two"
                  value={pricing}
                  className="form-control"
                  id="pricing"
                  onInput={(e) => setPricing(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Space Type</label>
                <input
                  type="text"
                  value={type}
                  onInput={(e) => setType(e.target.value)}
                  className="form-control"
                  id="type"
                />
              </div>
              <div className="form-group">
                <label htmlFor="workingHours">Availability</label>
                <input
                  type="text"
                  placeholder="Opening to closing time"
                  onInput={(e) => setWorkingHours(e.target.value)}
                  value={workingHours}
                  className="form-control"
                  id="workingHours"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <select className="custom-select">
                      <option value="+1">+1</option>
                      <option value="+91">+91</option>
                      <option value="+111">+111</option>
                      <option value="+71">+71</option>
                      <option value="+60">+60</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={contactNumber}
                    onInput={(e) => setContactNumber(e.target.value)}
                    id="contactNumber"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="seatingCapacity">Seating Capacity</label>
                <input
                  type="text"
                  className="form-control"
                  value={seatingCapacity}
                  onInput={(e) => setSeatingCapacity(e.target.value)}
                  id="seatingCapacity"
                />
              </div>
              <div className="form-group">
                <label htmlFor="photos">Upload Photos</label>
                <input
                  type="file"
                  onChange={(e) => handleFile("photos", e)}
                  className="form-control-file"
                  id="photos"
                />
              </div>
              <div className="form-group text-center">
                <button
                  onClick={(e) => handAddSpace(e)}
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div className="my-5">
            <h1 className="text-center">Your Spaces</h1>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th className="">Space Name</th>
                  <th>Delete Space</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(spaceDetails) &&
                  spaceDetails.map((space, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{space.spaceName}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            handleDeleteSpace(userId, space._id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
