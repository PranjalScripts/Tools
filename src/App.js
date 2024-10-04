
//  import Calendar from './ToolCollection/Calendar/Calendar'
//  import TimerApp from './ToolCollection/CountdownTimer/timerApp';
// import VoiceRecorder from './ToolCollection/voiceRecorder/voiceRecorder'
import Randompassword from './ToolCollection/RandomPasswordGenerator/Randompassword.jsx';
import Login from "./ToolCollection/Pages/Component/login.js";
import Logout from "./ToolCollection/Pages/Component/logout.js";
import ProtectedRoute from "./ToolCollection/Pages/Component/protectedRoute.js";
import Signup from "./ToolCollection/Pages/Component/signup.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route set to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protecting the random password route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/randompassword" element={<Randompassword />} />
        </Route>

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
