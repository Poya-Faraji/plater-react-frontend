import Dashboard from "./assets/components/dashboard/userDashboard";
import Login from "./assets/components/Login/login";

function App() {
  const isAuth = false;
  // const token = localStorage.getItem("token");

  if (isAuth) {
    return <Dashboard />;
  }

  return <Login />;
}

export default App;
