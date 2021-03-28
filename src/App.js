import './App.css';
import Signup from './pages/Signup';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Signin from './pages/Signin';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signin"> 
          <Signin />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/" exact>
          <Signup />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
