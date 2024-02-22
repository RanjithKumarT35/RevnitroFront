import axios from "axios";
import Router from "./Router";

import { AuthContextProvider } from "./Components/context/authcontext";
axios.defaults.withCredentials = true;
function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Router />
      </AuthContextProvider>
    </div>
  );
}

export default App;
