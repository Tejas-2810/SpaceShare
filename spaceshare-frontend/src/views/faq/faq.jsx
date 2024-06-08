import React from "react";
import "./faq.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Faq = () => {
  return (
    <div
      class="accordion accordion-flush pcontainer faq container"
      id="accordionFlushExample"
    >
      <h1 className="text-center"> Frequently Asked Questions </h1>
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingOne">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseOne"
            aria-expanded="false"
            aria-controls="flush-collapseOne"
          >
            What types of spaces can I find on SpaceShare?
          </button>
        </h2>
        <div
          id="flush-collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="flush-headingOne"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body">
            SpaceShare offers a variety of spaces including conference rooms,
            art studios, warehouses, garages and more. Check our categories for
            specific types of spaces available.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseTwo"
            aria-expanded="false"
            aria-controls="flush-collapseTwo"
          >
            What is your policy for canceling a reservation?
          </button>
        </h2>
        <div
          id="flush-collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="flush-headingTwo"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body">
            We understand that plans can change. Our cancellation policy allows
            you to cancel up to 24 hours before your reservation without a
            penalty. Cancellations made less than 24 hours in advance may incur
            a fee.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingThree">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseThree"
            aria-expanded="false"
            aria-controls="flush-collapseThree"
          >
            What happens if a space owner cancels my booking?
          </button>
        </h2>
        <div
          id="flush-collapseThree"
          class="accordion-collapse collapse"
          aria-labelledby="flush-headingThree"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body">
            If a space owner cancels your booking, you will be notified
            immediately, and you will receive a full refund. We will also assist
            you in finding an alternative space if needed.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingFour">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseFour"
            aria-expanded="false"
            aria-controls="flush-collapseFour"
          >
            What should I do if there's a problem during my rental period?
          </button>
        </h2>
        <div
          id="flush-collapseFour"
          class="accordion-collapse collapse"
          aria-labelledby="flush-headingFour"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body">
            If you encounter any issues during your rental, please contact
            SpaceShare support immediately via our "Contact Us" page. We are
            here to help resolve any problems swiftly.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingFive">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseFive"
            aria-expanded="false"
            aria-controls="flush-collapseFive"
          >
            Can I change the booking dates after confirmation?
          </button>
        </h2>
        <div
          id="flush-collapseFive"
          class="accordion-collapse collapse"
          aria-labelledby="flush-headingFive"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body">
            Booking dates can be modified depending on the space owner’s
            cancellation policy and availability. To request a change, contact
            the space owner through the platform as soon as possible.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
