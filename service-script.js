// ============================================================
// Serenity Wellness Spa — service-script.js
// SEG3125 Assignment 2 — Jad Mroueh (300425804)
// ============================================================

// Services offered by the spa
var services = [
    {
        id: 1,
        name: "Swedish Massage",
        desc: "A gentle, relaxing full-body massage that reduces stress and improves circulation.",
        duration: "60 min",
        price: "$75"
    },
    {
        id: 2,
        name: "Deep Tissue Massage",
        desc: "Targets deeper muscle layers to relieve chronic pain and release built-up tension.",
        duration: "60 min",
        price: "$90"
    },
    {
        id: 3,
        name: "Hot Stone Therapy",
        desc: "Smooth heated basalt stones melt away muscle tightness and promote deep relaxation.",
        duration: "75 min",
        price: "$105"
    },
    {
        id: 4,
        name: "Couples Massage",
        desc: "Share a relaxing side-by-side session in our private couples suite.",
        duration: "60 min",
        price: "$140"
    },
    {
        id: 5,
        name: "Aromatherapy Massage",
        desc: "Essential oils combined with gentle massage techniques for a full sensory experience.",
        duration: "45 min",
        price: "$65"
    },
    {
        id: 6,
        name: "Sports Massage",
        desc: "Designed for athletes to prevent injury, reduce soreness, and speed up recovery.",
        duration: "45 min",
        price: "$80"
    }
];

// Available time slots
var timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM",
    "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM"
];

// Booking state
var selectedService = null;
var selectedDate = "";
var selectedTime = "";
var bookingStep = 1;

// Run setup when the page has loaded
document.addEventListener("DOMContentLoaded", function() {
    renderServiceCards();
    populateServiceDropdown();
    setMinDate();
    renderTimeSlots();
    updateStepDisplay();
});

// Build the service cards grid using the services array
function renderServiceCards() {
    var container = document.getElementById("servicesContainer");
    var html = "";

    for (var i = 0; i < services.length; i++) {
        var s = services[i];
        html += '<div class="col-md-6 col-lg-4">';
        html += '<div class="service-card">';
        html += '<div class="service-icon">&#9670;</div>';
        html += '<h3>' + s.name + '</h3>';
        html += '<p class="service-desc">' + s.desc + '</p>';
        html += '<div class="service-meta">';
        html += '<span class="service-duration">' + s.duration + '</span>';
        html += '<span class="service-price">' + s.price + '</span>';
        html += '</div>';
        html += '<button class="btn btn-book" onclick="bookService(' + s.id + ')">Book This</button>';
        html += '</div>';
        html += '</div>';
    }

    container.innerHTML = html;
}

// Fill the service dropdown in step 1 of the booking form
function populateServiceDropdown() {
    var select = document.getElementById("serviceSelect");

    for (var i = 0; i < services.length; i++) {
        var s = services[i];
        var option = document.createElement("option");
        option.value = s.id;
        option.textContent = s.name + " (" + s.duration + ")  —  " + s.price;
        select.appendChild(option);
    }
}

// Called when user clicks "Book This" on a service card
// Pre-selects that service and scrolls down to the booking form
function bookService(serviceId) {
    var select = document.getElementById("serviceSelect");
    select.value = serviceId;
    selectedService = getServiceById(serviceId);

    // Go back to step 1 so the user sees their pre-selection
    bookingStep = 1;
    updateStepDisplay();

    document.getElementById("bookingSection").scrollIntoView({ behavior: "smooth" });
}

// Return the service object with the given id
function getServiceById(id) {
    for (var i = 0; i < services.length; i++) {
        if (services[i].id === id) {
            return services[i];
        }
    }
    return null;
}

// Set the date input minimum to today so the user cannot pick a past date
function setMinDate() {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var dd = String(today.getDate()).padStart(2, "0");
    document.getElementById("dateInput").min = yyyy + "-" + mm + "-" + dd;
}

// Build the time slot buttons from the timeSlots array
function renderTimeSlots() {
    var container = document.getElementById("timeSlotsContainer");
    var html = "";

    for (var i = 0; i < timeSlots.length; i++) {
        var t = timeSlots[i];
        // Using single quotes inside the onclick string to avoid conflict
        html += '<button class="time-btn" onclick="selectTime(\'' + t + '\')">' + t + '</button>';
    }

    container.innerHTML = html;
}

// Handle a time slot click — visually select it and store the value
function selectTime(time) {
    selectedTime = time;

    var buttons = document.querySelectorAll(".time-btn");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("time-btn-selected");
        if (buttons[i].textContent === time) {
            buttons[i].classList.add("time-btn-selected");
        }
    }
}

// Validate the current step and move to the next one
function nextStep() {
    if (bookingStep === 1) {
        var select = document.getElementById("serviceSelect");
        if (select.value === "") {
            showError("step1Error", "Please select a service to continue.");
            return;
        }
        selectedService = getServiceById(parseInt(select.value));
        hideError("step1Error");
    }

    if (bookingStep === 2) {
        selectedDate = document.getElementById("dateInput").value;
        if (selectedDate === "") {
            showError("step2Error", "Please choose a date for your appointment.");
            return;
        }
        if (selectedTime === "") {
            showError("step2Error", "Please select a time slot.");
            return;
        }
        hideError("step2Error");
    }

    bookingStep = bookingStep + 1;
    updateStepDisplay();

    // Scroll up to the booking form so the user sees the next step
    document.getElementById("bookingSection").scrollIntoView({ behavior: "smooth" });
}

// Go back one step
function prevStep() {
    if (bookingStep > 1) {
        bookingStep = bookingStep - 1;
        updateStepDisplay();
    }
}

// Validate step 3, fill the confirmation, and move to step 4
function submitBooking() {
    var name = document.getElementById("nameInput").value.trim();
    var email = document.getElementById("emailInput").value.trim();

    if (name === "") {
        showError("step3Error", "Please enter your full name.");
        return;
    }

    if (email === "" || email.indexOf("@") === -1) {
        showError("step3Error", "Please enter a valid email address.");
        return;
    }

    hideError("step3Error");

    // Populate the confirmation summary
    document.getElementById("confirmService").textContent = selectedService.name + " — " + selectedService.duration + " — " + selectedService.price;
    document.getElementById("confirmDate").textContent = formatDate(selectedDate);
    document.getElementById("confirmTime").textContent = selectedTime;
    document.getElementById("confirmName").textContent = name;
    document.getElementById("confirmEmail").textContent = email;

    bookingStep = 4;
    updateStepDisplay();

    document.getElementById("bookingSection").scrollIntoView({ behavior: "smooth" });
}

// Convert "YYYY-MM-DD" to "Month D, YYYY" for display
function formatDate(dateStr) {
    if (dateStr === "") {
        return "";
    }
    var parts = dateStr.split("-");
    var months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var month = months[parseInt(parts[1]) - 1];
    var day = parseInt(parts[2]);
    var year = parts[0];
    return month + " " + day + ", " + year;
}

// Show and hide the correct step div, and update the indicator styles
function updateStepDisplay() {
    for (var i = 1; i <= 4; i++) {
        var el = document.getElementById("step" + i);
        if (el !== null) {
            if (i === bookingStep) {
                el.style.display = "block";
            } else {
                el.style.display = "none";
            }
        }
    }

    // Update step indicators (only steps 1–3 have indicators)
    for (var j = 1; j <= 3; j++) {
        var indicator = document.getElementById("indicator" + j);
        if (indicator !== null) {
            indicator.classList.remove("step-active", "step-done");
            if (j < bookingStep) {
                indicator.classList.add("step-done");
            } else if (j === bookingStep) {
                indicator.classList.add("step-active");
            }
        }
    }
}

// Display an error message inside the given element
function showError(id, message) {
    var el = document.getElementById(id);
    if (el !== null) {
        el.textContent = message;
        el.style.display = "block";
    }
}

// Hide an error message
function hideError(id) {
    var el = document.getElementById(id);
    if (el !== null) {
        el.style.display = "none";
    }
}

// Reset the entire booking form back to step 1
function resetBooking() {
    bookingStep = 1;
    selectedService = null;
    selectedDate = "";
    selectedTime = "";

    document.getElementById("serviceSelect").value = "";
    document.getElementById("dateInput").value = "";
    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
    document.getElementById("phoneInput").value = "";
    document.getElementById("notesInput").value = "";

    var timeButtons = document.querySelectorAll(".time-btn");
    for (var i = 0; i < timeButtons.length; i++) {
        timeButtons[i].classList.remove("time-btn-selected");
    }

    updateStepDisplay();
    document.getElementById("bookingSection").scrollIntoView({ behavior: "smooth" });
}
