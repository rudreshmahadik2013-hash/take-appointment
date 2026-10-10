const modal_container = document.getElementsByClassName("modal-container")[0]; 
const modal = document.getElementsByClassName("modal")[0]; 
window.onload = function() {
    setTimeout(()=>{
        modal_container.classList.add('show');
    },4000)
};

document.getElementById("closeBtn").onclick = function() {
    modal_container.classList.add('close');
};
