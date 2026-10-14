(() => {
    const form = document.getElementById("appointment-form");
    if (!form) return;

    const specialty = document.getElementById("speciality");
    const doctor = document.getElementById("doctor");
    const date = document.getElementById("appointment-date");
    const alertBox = document.getElementById("form-alert");
    const consent = document.getElementById("consent");
    const doctorsBySpecialty = {
        "Dental Care": ["Dr R.K. Mehta"],
        "Eye Care": ["Dr Naresh Trehan"],
        "Ear, Nose & Throat (ENT)": ["Dr Rupesh Bhat"]
    };
    const fields = Array.from(form.querySelectorAll("input:not([type=checkbox]), select, textarea"));
    const storageKey = "maruAppointment";

    const now = new Date();
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    date.min = localToday;

    function updateDoctorOptions() {
        doctor.replaceChildren();
        const names = doctorsBySpecialty[specialty.value];
        doctor.add(new Option(names ? "Select a doctor" : "Select a department first", ""));
        doctor.disabled = !names;
        (names || []).forEach((name) => doctor.add(new Option(name, name)));
    }

    specialty.addEventListener("change", updateDoctorOptions);

    let savedData;
    try {
        savedData = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    } catch (error) {
        sessionStorage.removeItem(storageKey);
    }

    const requestedDepartment = new URLSearchParams(window.location.search).get("department");
    if (savedData) {
        specialty.value = savedData.speciality || "";
    } else if (requestedDepartment && Array.from(specialty.options).some((option) => option.value === requestedDepartment)) {
        specialty.value = requestedDepartment;
    }
    updateDoctorOptions();

    if (savedData) {
        fields.forEach((field) => {
            if (field.name !== "speciality" && field.name !== "doctor" && savedData[field.name] !== undefined) {
                field.value = savedData[field.name];
            }
        });
        doctor.value = savedData.doctor || "";
        consent.checked = Boolean(savedData.consent);
    }

    function errorFor(field) {
        return document.getElementById(`${field.id.replace("patient-", "").replace("appointment-", "")}-error`);
    }

    function validateField(field) {
        const message = errorFor(field);
        let error = "";
        if (field.validity.valueMissing) error = "Please complete this field.";
        else if (field.validity.typeMismatch && field.type === "email") error = "Enter a valid email address, such as name@example.com.";
        else if (field.validity.tooShort && field.type === "tel") error = "Enter a phone number with at least 7 characters.";
        else if (field.validity.tooShort) error = "Please enter at least 2 characters.";
        else if (field.type === "date" && field.value && field.value < localToday) error = "Choose today or a future date.";

        if (message) message.textContent = error;
        field.setAttribute("aria-invalid", String(Boolean(error)));
        return !error;
    }

    fields.forEach((field) => {
        field.addEventListener("blur", () => validateField(field));
        field.addEventListener("input", () => {
            if (field.getAttribute("aria-invalid") === "true") validateField(field);
            alertBox.hidden = true;
        });
        field.addEventListener("change", () => {
            if (field.getAttribute("aria-invalid") === "true") validateField(field);
            alertBox.hidden = true;
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const invalidFields = fields.filter((field) => !validateField(field));
        const consentError = document.getElementById("consent-error");
        consentError.textContent = consent.checked ? "" : "Please agree so our team can contact you about this request.";
        consent.setAttribute("aria-invalid", String(!consent.checked));

        if (invalidFields.length || !consent.checked) {
            alertBox.textContent = "Please check the highlighted fields and try again.";
            alertBox.hidden = false;
            (invalidFields[0] || consent).focus();
            return;
        }

        const appointment = Object.fromEntries(new FormData(form).entries());
        appointment.consent = consent.checked;
        sessionStorage.setItem(storageKey, JSON.stringify(appointment));
        window.location.href = "appointment-review.html";
    });
})();
