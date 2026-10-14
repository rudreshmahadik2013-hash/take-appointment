const modal_container = document.getElementsByClassName("modal-container")[0];
const close_button = document.getElementById("closeBtn");

if (modal_container) {
    window.onload = function() {
        setTimeout(() => modal_container.classList.add("show"), 4000);
    };
}

if (close_button && modal_container) {
    close_button.onclick = function() {
        modal_container.classList.add("close");
    };
}

const contact_link = document.getElementById("details");
if (contact_link) {
    contact_link.onclick = function() {
        window.location.href = "contact.html";
    };
}

const treatment_link = document.getElementById("treat");
if (treatment_link) {
    treatment_link.onclick = function() {
        window.location.href = "treatment.html";
    };
}

const doctor_button = document.getElementById("doctor_btn");
if (doctor_button) {
    doctor_button.onclick = function() {
        window.location.href = "doctors.html";
    };
}
