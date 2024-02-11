// https://eastus.api.cognitive.microsoft.com/
// c9075ef723e74e3ca19be5b7324ebcfa

let a = "endpoint=https://aiavatr.unitedstates.communication.azure.com/;accesskey=Kg8Ih/H5/34nQqxU10shjMXoxuOk1AbtVvOoit2+HbN59yApB+5NjXi+FSPpp7QiAwijUYJy5zed8H0hF+e3/A=="

const { CommunicationIdentityClient } = require("@azure/communication-identity");
const { CommunicationRelayClient } = require("@azure/communication-network-traversal");;

const main = async () => {
  console.log("Azure Communication Services - Relay Token Quickstart")

  const connectionString = a
 // Instantiate the identity client
  const identityClient = new CommunicationIdentityClient(connectionString);

  let identityResponse = await identityClient.createUser();
  console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);

  const relayClient = new CommunicationRelayClient(connectionString);
  console.log("Getting relay configuration");

  const config = await relayClient.getRelayConfiguration(identityResponse);
  console.log("RelayConfig", config);

  console.log("Printing entire thing ",config.iceServers);  
};

main().catch((error) => {
  console.log("Encountered and error");
  console.log(error);
})


let username = "BQAANibCGwAB2l3lEtcNjHQUsnP3O9j2RGcOXYDzPSQAAAAMARDDt3QaY6FGXagglFdrw4tM1HHnoBlfVKTh0Dilwn0gMdDjaQw="
let cred = "s5cKuQ4olJ9ls9ZX12hefGdUqa8="