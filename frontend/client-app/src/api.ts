const dev = false;

const GW_API_PATH = "https://api-gw-main-52snvftm.uc.gateway.dev";
const LOCAL_API_PATH = "http://localhost:8080"

const API_PATH = dev ? LOCAL_API_PATH : GW_API_PATH;

export default API_PATH;