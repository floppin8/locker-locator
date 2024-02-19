// Wait for the Google API library to load before initializing sign-in
function initGoogleSignIn() {
  gapi.load("auth2", function () {
    gapi.auth2.init({
      client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com",
    }).then(() => {
      // Google Sign-in initialized, proceed with your sign-in logic
    });
  });
}

// Check if gapi is loaded before trying to initialize Google Sign-In
if (typeof gapi !== 'undefined') {
  initGoogleSignIn();
} else {
  window.onload = function() {
    initGoogleSignIn();
  }
}

function signIn() {
  alert("Sign In clicked");
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  document.getElementById("user-name").textContent = profile.getName();
  document.getElementById("user-email").textContent = profile.getEmail();
  document.getElementById("user-info").style.display = "block";
  document.getElementById("sign-in-button").style.display = "none";
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    document.getElementById("user-info").style.display = "none";
    document.getElementById("sign-in-button").style.display = "block";
  });
}

// show more buttons when other stuff has happened (show information after sign in)
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('signInBtn').addEventListener('click', function() {
        document.getElementById('googleSignIn').style.display = 'block'; // Show Google Sign-In
    });

    document.getElementById('categorySelect').addEventListener('change', handleCategoryChange);

    document.getElementById('personalInfoBtn').addEventListener('click', function() {
        document.getElementById('saveChangesBtn').style.display = 'block'; // Show Save Changes after Locker Info is clicked
    });
});
//WHEN LOCKER CATEGORY IS CLICKED, ALLOW USER TO INPUT NUMBER
function handleCategoryChange() {
    const category = document.getElementById('categorySelect').value;
    if (category === 'Locker') {
        document.getElementById('lockerNumberInput').style.display = 'block'; // Show locker number input
    } else {
        document.getElementById('lockerNumberInput').style.display = 'none'; // Hide locker number input
    }
    // Implement highlightCategory logic here for other categories
}
const categoryPositions = {
  Restrooms: [
    { top: "50px", left: "150px", width: "100px", height: "100px" },
    { top: "300px", left: "250px", width: "100px", height: "100px" }
  ],
  'Attendance Office': [
    { top: "200px", left: "350px", width: "120px", height: "120px" }
  ],
  'Parking Lots': [
    // Add positions for parking lots
  ],
  'Bike Racks': [
    // Add positions for bike racks
  ],
  Locker: [
    // Add positions for lockers
  ]
};

function handleCategoryChange() {
    const category = document.getElementById('categorySelect').value;
    if (category === 'Locker') {
        document.getElementById('lockerNumberInput').style.display = 'block'; // Show locker number input
    } else {
        document.getElementById('lockerNumberInput').style.display = 'none'; // Hide locker number input
    }
    highlightCategory(category);
}

function highlightCategory(category) {
  const highlightedAreas = document.getElementById("highlightedAreas");
  highlightedAreas.innerHTML = ""; // Clear existing highlighted areas

  if (categoryPositions[category]) {
    categoryPositions[category].forEach(pos => {
      const highlightArea = document.createElement("div");
      highlightArea.classList.add("highlight-area");
      Object.assign(highlightArea.style, {
        position: "absolute",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        top: pos.top,
        left: pos.left,
        width: pos.width,
        height: pos.height
      });
      highlightedAreas.appendChild(highlightArea);
    });
  }
}




document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('zoomContainer');
  const img = document.getElementById('mapImage');
  let scale = 1;
  const zoomSpeed = 0.25; // Increased zoom speed 

  // Function to calculate the distance between two touch points
  function getDistance(touches) {
      const dx = touches[0].pageX - touches[1].pageX;
      const dy = touches[0].pageY - touches[1].pageY;
      return Math.sqrt(dx * dx + dy * dy);
  }

  // Function to update zoom scale and origin
  function updateZoom(newScale, originX, originY) {
      scale = Math.max(newScale, 1); // Don't zoom out beyond original size
      img.style.transformOrigin = `${(originX / container.offsetWidth) * 100}% ${(originY / container.offsetHeight) * 100}%`;
      img.style.transform = `scale(${scale})`;
  }

  // Mouse wheel zoom
  container.addEventListener('wheel', function(e) {
      e.preventDefault();
      const mouseX = e.clientX - container.getBoundingClientRect().left;
      const mouseY = e.clientY - container.getBoundingClientRect().top;
      const delta = e.deltaY > 0 ? -0.1 : 0.1; // Adjust zoom speed as needed
      const newScale = scale + delta;
      updateZoom(newScale, mouseX, mouseY);
  });

  // Touch pinch zoom
  let startDist = 0, startX = 0, startY = 0;
  container.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
          startDist = getDistance(e.touches);
          const rect = container.getBoundingClientRect();
          startX = (e.touches[0].pageX + e.touches[1].pageX) / 2 - rect.left;
          startY = (e.touches[0].pageY + e.touches[1].pageY) / 2 - rect.top;
      }
  });

  container.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2) {
          const currentDist = getDistance(e.touches);
          if (startDist !== 0) {
              const ratio = currentDist / startDist;
              const newScale = scale * ratio;
              updateZoom(newScale, startX, startY);
          }
      }
  });

  container.addEventListener('touchend', function() {
      if (e.touches.length < 2) {
          startDist = 0; // Reset pinch zoom
      }
  });
});
