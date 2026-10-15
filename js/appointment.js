const appointment_form = document.getElementById("appointment-form");

if (appointment_form) {
    const department = document.getElementById("speciality");
    const appointment_date = document.getElementById("appointment-date");

    const today = new Date();
    const local_today = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
    appointment_date.min = local_today;

    const requested_department = new URLSearchParams(window.location.search).get("department");
    if (requested_department && Array.from(department.options).some((option) => option.value === requested_department)) {
        department.value = requested_department;
    }

    appointment_form.addEventListener("submit", (event) => {
        event.preventDefault();
        window.location.href = "appointment-success.html";
    });
}
