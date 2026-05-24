var today = new Date();
var year = today.getFullYear();
var yearText = document.getElementById("yearText");

if (yearText != null) {
    yearText.innerHTML = "Year: " + year;
}
