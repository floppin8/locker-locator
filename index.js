let password;
let lockerNumber;

const clientLoad = new Promise(resolve => {
    gapi.load('auth2', () => {
      resolve(gapi.auth2.init({ client_id: '<your_client_id>' }));
    });
  });
  

  async function loginGoogle() {
    const client = await clientLoad;
    const response = client.signIn().catch((e) => {
      // in case user closes the popup
      if (e.error === 'popup_closed_by_user') {
        return null;
      }
      throw e;
    });
  
    // handle your authentication flow with the token received
    console.log(response.getAuthResponse());
  }

function lockerInfo(){
    
}
function login(){
    
}