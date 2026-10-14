(() => {
    const storageKey = "maruAppointment";
    let appointment;

    try {
        appointment = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    } catch (error) {
        appointment = null;
    }

    if (!appointment) {
        window.location.replace("appointment.html");
        return;
    }

    const date = new Date(`${appointment.date}T00:00:00`);
    const details = {
        "review-name": appointment.name,
        "review-email": appointment.email,
        "review-phone": appointment.phone,
        "review-location": appointment.location,
        "review-speciality": appointment.speciality,
        "review-doctor": appointment.doctor,
        "review-date": date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
        "review-time": appointment.time,
        "review-notes": appointment.notes || "None"
    };

    Object.entries(details).forEach(([id, value]) => {
        document.getElementById(id).textContent = value;
    });

    document.getElementById("edit-appointment").addEventListener("click", () => {
        window.location.href = "appointment.html";
    });

    document.getElementById("confirm-appointment").addEventListener("click", () => {
        sessionStorage.removeItem(storageKey);
        window.location.href = "appointment-success.html";
    });
})();
