(() => {
    const form = document.getElementById("appointment-form");
    if (!form) return;

    const specialty = document.getElementById("speciality");
    const doctor = document.getElementById("doctor");
    const date = document.getElementById("appointment-date");
    const reviewPanel = document.getElementById("review-panel");
    const successPanel = document.getElementById("success-panel");
    const alertBox = document.getElementById("form-alert");
    const summary = document.getElementById("summary-list");
    const doctorsBySpecialty = {
        "Dental Care": ["Dr R.K. Mehta"],
        "Eye Care": ["Dr Naresh Trehan"],
        "Ear, Nose & Throat (ENT)": ["Dr Rupesh Bhat"]
    };
    const fields = Array.from(form.querySelectorAll("input:not([type=checkbox]), select, textarea"));

    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    date.min = localToday;

    const query = new URLSearchParams(window.location.search);
    const requestedDepartment = query.get("department");
    if (requestedDepartment && Array.from(specialty.options).some((option) => option.value === requestedDepartment)) {
        specialty.value = requestedDepartment;
    }

    function updateDoctorOptions() {
        doctor.replaceChildren();
        const options = doctorsBySpecialty[specialty.value];
        doctor.add(new Option(options ? "Choose a doctor" : "Choose a department first", ""));
        doctor.disabled = !options;
        (options || []).forEach((name) => doctor.add(new Option(name, name)));
        doctor.value = "";
    }

    specialty.addEventListener("change", updateDoctorOptions);
    updateDoctorOptions();

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

    function values() {
        return new FormData(form);
    }

    function showReview(data) {
        const rows = [
            ["Full name", data.get("name")], ["Email", data.get("email")],
            ["Contact number", data.get("phone")], ["City or locality", data.get("location")],
            ["Department", data.get("speciality")], ["Preferred doctor", data.get("doctor")],
            ["Preferred date", new Date(`${data.get("date")}T00:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })],
            ["Preferred time", data.get("time")], ["Visit notes", data.get("notes") || "None"]
        ];
        summary.replaceChildren(...rows.map(([label, value]) => {
            const item = document.createElement("div");
            const term = document.createElement("dt");
            const description = document.createElement("dd");
            term.textContent = label;
            description.textContent = value;
            item.append(term, description);
            return item;
        }));
        reviewPanel.hidden = false;
        reviewPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const invalid = fields.filter((field) => !validateField(field));
        const consent = document.getElementById("consent");
        const consentError = document.getElementById("consent-error");
        consentError.textContent = consent.checked ? "" : "Please agree so our team can contact you about this request.";
        consent.setAttribute("aria-invalid", String(!consent.checked));
        if (invalid.length || !consent.checked) {
            reviewPanel.hidden = true;
            alertBox.textContent = "Please check the highlighted fields and try again.";
            alertBox.hidden = false;
            (invalid[0] || consent).focus();
            alertBox.focus();
            return;
        }
        alertBox.hidden = true;
        showReview(values());
    });

    document.getElementById("edit-request").addEventListener("click", () => {
        reviewPanel.hidden = true;
        document.getElementById("patient-name").focus();
    });

    document.getElementById("confirm-request").addEventListener("click", () => {
        reviewPanel.hidden = true;
        form.hidden = true;
        document.getElementById("form-title").hidden = true;
        document.querySelector(".required-note").hidden = true;
        successPanel.hidden = false;
        successPanel.focus();
    });
})();
