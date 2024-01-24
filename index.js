// Function called when sign-in is successful
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
