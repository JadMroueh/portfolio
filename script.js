function showMessage() {
    alert("My goal is to make designs that are simple, organized, and easy to use.");
}

var today = new Date();
var year = today.getFullYear();
var yearText = document.getElementById("yearText");

if (yearText != null) {
    yearText.innerHTML = "Year: " + year;
}
