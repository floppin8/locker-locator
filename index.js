//for sign in
function signIn() {
  // Placeholder for sign-in functionality
  alert("Sign In clicked");
  // Implement actual sign-in logic here
}


// Function called when sign-in is successful for GOOGLE SIGN-IN
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();

  // Display user information
  document.getElementById('user-name').textContent = profile.getName();
  document.getElementById('user-email').textContent = profile.getEmail();

  // Show user info and hide sign-in button
  document.getElementById('user-info').style.display = 'block';
  document.getElementById('sign-in-button').style.display = 'none';
}

// Function called when the user clicks the Sign Out button
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
      // Hide user info and show sign-in button
      document.getElementById('user-info').style.display = 'none';
      document.getElementById('sign-in-button').style.display = 'block';
  });
}

// Initialize Google Sign-In
gapi.load('auth2', function() {
  gapi.auth2.init({
      client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
  });
});


// Example locker locations - adjust as needed
const lockerLocations = {
  "101": { top: "50px", left: "100px", width: "100px", height: "100px" },
  "102": { top: "150px", left: "200px", width: "100px", height: "100px" },
  // Add more lockers 
};

function findLocker() {
  const lockerNumber = document.getElementById("lockerNumber").value;
  const highlightArea = document.getElementById("highlightArea");

  // Check if the entered locker number has a predefined location
  if (lockerLocations[lockerNumber]) {
      const location = lockerLocations[lockerNumber];
      highlightArea.style.top = location.top;
      highlightArea.style.left = location.left;
      highlightArea.style.width = location.width;
      highlightArea.style.height = location.height;
      highlightArea.style.display = "block"; // Show the highlight area
  } else {
      alert("Locker location not found."); // Inform the user if the locker number doesn't match
      highlightArea.style.display = "none"; // Hide the highlight area
  }
}
