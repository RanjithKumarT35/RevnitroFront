import React from "react";
import "./Menu.css";
import "./Style.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./Components/1Home";
import Menu from "./Mens";
import Navbar222 from "./Mens";
import Notification from "./Components/9Notification";
import Myprofile from "./Components/8Myprofile";
import ForgotPassword from "./Components/7ForgotPassword";
import Register from "./Components/6Register";
import LoginPage from "./Components/5LoginPage";
import WelcometoForum from "./Components/4WelcometoForum";
import CreatePost from "./Components/3CreatePost";
import PostPage from "./Components/2PostPage";
import EditPost from "./Components/3AEditPost";
import PopupGfg from "./Components/temp";
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route exact path="/" element={<PopupGfg />}></Route> */}
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/home/:heading" element={<Home />}></Route>
        <Route exact path="/t" element={<PopupGfg />}></Route>
        <Route path="/:threadId" element={<PostPage />}></Route>
        <Route path="/CreatePost" element={<CreatePost />}></Route>
        <Route path="/edit/:threadId" element={<EditPost />}></Route>
        <Route path="/forumlist" element={<WelcometoForum />}></Route>
        <Route path="/LoginPage" element={<LoginPage />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
        <Route path="/Myprofile" element={<Myprofile />}></Route>
        <Route path="/Notification" element={<Notification />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
