import './App.css';
import {useAuthState} from "react-firebase-hooks/auth"
import {auth} from "./firebase.js"
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home"
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SearchResults from "./pages/SearchResults";
import Profile from "./pages/Profile";
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './context/auth';
import MovieDetail from './pages/MovieDetail';
import TvDetail from './pages/TvDetail';
import MyRatings from './pages/MyRatings';
import Messages from './pages/Messages';


function App() {
  const [user] = useAuthState(auth) // user returns true if logged in , false if not
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route element={<PrivateRoute user={user}/>}>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/messages" element={<Messages/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/searchresults" element={<SearchResults/>}/>
            <Route path="/movie/:id" element={<MovieDetail/>}/>
            <Route path="/tv/:id" element={<TvDetail/>}/>
            <Route path="/myRatings" element={<MyRatings/>}/>
          </Route>
          <Route path="/login" element={<Login/>}/>
          <Route path="" element={<Login/>}/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>


  );
}

export default App;
