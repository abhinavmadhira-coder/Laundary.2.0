// -------------------- Student Accounts --------------------
let students = JSON.parse(localStorage.getItem("students")) || [];
let laundryData = JSON.parse(localStorage.getItem("laundryData")) || [];

// Register new student
function registerStudent() {
  const user = document.getElementById("regUser").value;
  const pass = document.getElementById("regPass").value;
  const room = document.getElementById("regRoom").value;

  if (!user || !pass || !room) {
    alert("Please fill all fields!");
    return;
  }

  if (students.find(s => s.user === user)) {
    alert("Username already taken!");
    return;
  }

  students.push({ user, pass, room });
  localStorage.setItem("students", JSON.stringify(students));
  alert("Registration successful!");
  window.location.href = "index.html";
}

// Student login
function studentLogin() {
  const user = document.getElementById("studentUser").value;
  const pass = document.getElementById("studentPass").value;

  const student = students.find(s => s.user === user && s.pass === pass);

  if (student) {
    localStorage.setItem("currentStudent", JSON.stringify(student));
    window.location.href = "student.html";
  } else {
    alert("Invalid student login!");
  }
}

// Change password
function changePassword() {
  const newPass = document.getElementById("newPass").value;
  let currentStudent = JSON.parse(localStorage.getItem("currentStudent"));

  if (!newPass) {
    alert("Enter a new password!");
    return;
  }

  students = students.map(s => {
    if (s.user === currentStudent.user) {
      s.pass = newPass;
      currentStudent.pass = newPass;
    }
    return s;
  });

  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("currentStudent", JSON.stringify(currentStudent));
  alert("Password updated successfully!");
}

// -------------------- Admin Login --------------------
function adminLogin() {
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;

  if (user === "admin" && pass === "admin123") {
    window.location.href = "admin.html";
  } else {
    alert("Invalid admin login!");
  }
}

// -------------------- Admin: Upload Laundry Record --------------------
function updateStatus() {
  const roomRange = document.getElementById("roomRange").value;
  const tagNumber = document.getElementById("tagNumber").value;
  const shelf = document.getElementById("shelfNumber").value;
  const status = document.getElementById("statusSelect").value;
  const picInput = document.getElementById("laundryPic");

  if (!roomRange || !tagNumber || !picInput.files[0]) {
    alert("Please upload a picture, enter room range and tag number!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const record = {
      roomRange,
      tagNumber,
      shelf,
      status,
      image: e.target.result
    };

    laundryData.push(record);
    localStorage.setItem("laundryData", JSON.stringify(laundryData));
    alert("Record saved successfully!");
    displayRecords();
  };
  reader.readAsDataURL(picInput.files[0]);
}

// Display records in Admin Portal
function displayRecords() {
  const list = document.getElementById("recordList");
  if (!list) return;
  list.innerHTML = "";

  laundryData.forEach((record, index) => {
    const card = document.createElement("div");
    card.className = "record-card";
    card.innerHTML = `
      <img src="${record.image}" alt="Laundry Pic" style="width:150px;height:150px;border-radius:10px;">
      <p>Room Range: ${record.roomRange}</p>
      <p>Tag #: ${record.tagNumber}</p>
      <p>Shelf #: ${record.shelf}</p>
      <p>Status: ${record.status}</p>
      <button onclick="deleteRecord(${index})">Delete</button>
    `;
    list.appendChild(card);
  });
}

function deleteRecord(index) {
  laundryData.splice(index, 1);
  localStorage.setItem("laundryData", JSON.stringify(laundryData));
  displayRecords();
}

// -------------------- Student Portal --------------------
function loadStudentPortal() {
  const student = JSON.parse(localStorage.getItem("currentStudent"));
  if (!student) return;

  // Show schedule (simple example: based on room ranges)
  const scheduleDiv = document.getElementById("studentSchedule");
  if (scheduleDiv) {
    let day = "Unknown";
    const room = parseInt(student.room);
    if (room >= 101 && room <= 140) day = "Monday";
    else if (room >= 201 && room <= 240) day = "Tuesday";
    else if (room >= 405 && room <= 625) day = "Wednesday";
    else if (room >= 910 && room <= 1130) day = "Thursday";
    else day = "Friday";
    scheduleDiv.innerHTML = `<p>Your laundry day: <strong>${day}</strong></p>`;
  }

  // Show laundry status
  const statusDiv = document.getElementById("studentStatus");
  if (statusDiv) {
    const record = laundryData.find(r => {
      const [start, end] = r.roomRange.split("-").map(Number);
      return room >= start && room <= end;
    });

    if (record) {
      statusDiv.innerHTML = `
        <img src="${record.image}" alt="Laundry Pic" style="width:150px;height:150px;border-radius:10px;">
        <p>Status: ${record.status}</p>
        <p>Tag #: ${record.tagNumber}</p>
        <p>Shelf #: ${record.shelf}</p>
      `;
      if (record.status === "Completed") {
        alert(`✅ Your laundry is ready! Collect from Shelf #${record.shelf}, Tag #${record.tagNumber}.`);
      }
    } else {
      statusDiv.innerHTML = "<p>No laundry record found for your room.</p>";
    }
  }
}

// -------------------- Auto-load on page --------------------
document.addEventListener("DOMContentLoaded", () => {
  displayRecords();
  loadStudentPortal();
});
