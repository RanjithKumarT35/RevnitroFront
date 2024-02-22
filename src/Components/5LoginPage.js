import React, { useEffect, useState, useRef, useContext } from "react";
import AuthContext from "./context/authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "./global";
function LoginPage() {
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({});
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/forum/`, {
          crossDomain: true,
          withCredentials: true,
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching forum stats:", error);
      }
    };

    fetchStats();
  }, []);
  const toggleNav = () => {
    setIsActive(!isActive);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const { getLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  function notificationclickfunction() {
    var notificationnumberofmessage = document.getElementsByClassName(
      "notificationnumberofmessage"
    );
    notificationnumberofmessage[0].style.display = "none";
    notificationnumberofmessage[1].style.display = "none";
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const loginData = { email, password };
      const response = await axios.post(`${API_URL}/auth/login`, loginData, {
        crossDomain: true,
        withCredentials: true,
      });
      if (response.data === "NoUser") {
        alert("Enter Proper Login Details");
      } else {
        await getLoggedIn();
        navigate("/");
      }
    } catch (err) {
      alert("Enter Proper Login Details");
    }
  }
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Type The Email");
      return;
    }
    const response = await axios.post(
      `${API_URL}/auth/forgotPassword`,
      {
        email: email,
      },
      { crossDomain: true, withCredentials: true }
    );
    if (response.data === "success") {
      alert("Check your Email for Reset Password One-Time-Password");
      navigate("/forgotPassword");
    } else if (response.data === "User Not Available") {
      alert("User Doesn't Exists");
    } else if (response.data === "processFailed") {
      alert("There is some Problem sending you mail");
    }
  };
  const { getLoggedIn } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userIdentity, setUserIdentity] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  const handleProfileUpdate = async () => {
    navigate("/Myprofile");
  };
  const handleLogin = async () => {
    navigate("/LoginPage");
  };
  const handleHome = async () => {
    navigate("/");
  };
  const handleCreatePost = async () => {
    navigate("/CreatePost");
  };
  const handleForumPage = async () => {
    navigate("/forumlist");
  };
  async function logout() {
    await axios.get(`${API_URL}/auth/logout`, {
      crossDomain: true,
      withCredentials: true,
    });
    await getLoggedIn();
    navigate("/LoginPage");
  }
  const navigateToRegister = () => {
    navigate("/Register");
  };
  const NavigateToNotification = () => {};
  return (
    <div>
      {/* <!---------------------Welcome to Revnitro-------------------------------------> */}
      <div className="welcometorevnitro">
        <h1>Welcome to Revnitro Forum</h1>
      </div>
      {/* <!---------------------Welcome to Revnitro-------------------------------------> */}
      <div className="indexpagemediaqueryflex">
        <div className="mediaqueryindex">
          {/* <!--------------------- Revnitro Topics-------------------------------------> */}
          <div className="revnitrotopicssss">
            <div className="iconsflexss">
              <img src="./images/clarity_group-solid.webp" alt="" />
              <div className="textforumdynamic">
                {stats.totalHeadings} Topics
              </div>
            </div>
            <div className="iconsflexss">
              <img src="./images/lets-icons_book-check-fill.webp" alt="" />
              <div className="textforumdynamic">{stats.totalThreads} Posts</div>
            </div>
            <div className="iconsflexss">
              <img src="./images/mdi_account-view.webp" alt="" />
              <div className="textforumdynamic">{stats.totalViews} Views</div>
            </div>
          </div>
          {/* <!--------------------- Revnitro Topics------------------------------------->

        <!--------------------- input and filters-------------------------------------> */}
          <div>
            <div className="formsandfilters">
              <div className="inputformpage">
                <form action="" className="formflexx">
                  <input type="text" name="searchvalue" placeholder="Search" />
                  <button
                    className="searchbuttons"
                    disabled
                    style={{ backgroundColor: "#d5d5d5" }}
                  >
                    <img src="./images/Vector50.webp" alt="" />
                  </button>
                </form>
              </div>
              <div className="createpostdivwithnavigationflex">
                <div className="mobileshowndesktophide">
                  <div
                    id="nav-container"
                    className={isActive ? "is-active" : ""}
                  >
                    <div id="nav-toggle" onClick={toggleNav}></div>
                    <nav className="nav-items">
                      <div className="leftnavbarboxmobile">
                        <div
                          className="imageflexleftnavbarmobile"
                          style={{ paddingTop: "30px" }}
                        >
                          <div className="mobileversionnavbarimagesizess">
                            <div>
                              <img
                                src={
                                  userProfilePic ||
                                  "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                                }
                                alt=""
                              />
                            </div>
                            {userId && (
                              <div
                                className="editiconinmobileversionbox"
                                onClick={handleProfileUpdate}
                              >
                                <img src="./images/profileUpdate.png" alt="" />
                              </div>
                            )}
                          </div>
                          <div className="usernamenavbar">
                            <h3 className="mobilevrersionnamesize">
                              {userName}
                            </h3>
                            {userId && (
                              <div className="idnamenamemobile">
                                @{userIdentity}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="navigationbuttontopmobile">
                          <div
                            className="navigatelinksmobile"
                            onClick={() => {
                              handleHome();
                            }}
                          >
                            <div>
                              <img
                                src="./images/mdi_home.webp"
                                alt="hometext"
                              />
                            </div>
                            <div className="navigatenamesmobile">Home</div>
                          </div>
                          {userId && (
                            <div>
                              <div
                                className="navigatelinksmobile"
                                onClick={handleCreatePost}
                              >
                                <div>
                                  <img
                                    src="./images/gridicons_create.webp"
                                    alt="hometext"
                                  />
                                </div>
                                <div className="navigatenamesmobile">
                                  Create Post
                                </div>
                              </div>
                            </div>
                          )}
                          <div
                            className="navigatelinksmobile"
                            onClick={handleForumPage}
                          >
                            <div>
                              <img
                                src="./images/fluent_people-team-16-filled.webp"
                                alt="hometext"
                              />
                            </div>
                            <div className="navigatenamesmobile">Forum</div>
                          </div>

                          {!userId ? (
                            <div
                              className="navigatelinksmobile"
                              onClick={handleLogin}
                            >
                              <div>
                                <img
                                  src="./images/ooui_log-in-ltr.webp"
                                  alt="hometext"
                                />
                              </div>
                              <div className="navigatenamesmobile">Log in</div>
                            </div>
                          ) : (
                            <div
                              className="navigatelinksmobile"
                              onClick={logout}
                            >
                              <div>
                                <img
                                  src="./images/ooui_log-in-ltr.webp"
                                  alt="hometext"
                                />
                              </div>
                              <div className="navigatenamesmobile">Log Out</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="CreateYourPost">Login Page</div>
              </div>
            </div>
          </div>
          {/* <!--------------------- input and filters------------------------------------->

        <!--------------------- flex post content-------------------------------------> */}
          <div>
            <div className="postmapfunctionarea">
              <div className="leftnavbarbox">
                <div className="imageflexleftnavbar">
                  <div
                    className="profilephotosssupate"
                    style={{ paddingTop: "30px" }}
                  >
                    <img
                      src={
                        userProfilePic ||
                        "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                      }
                      alt="imagetext"
                    />
                  </div>

                  <div className="usernamenavbar">
                    <h3>{userName}</h3>
                    {userId && (
                      <div className="idnamename">@{userIdentity}</div>
                    )}
                  </div>
                </div>
                <div className="navigationbuttontop">
                  <div className="navigatelinks" onClick={handleHome}>
                    <div>
                      <img src="./images/mdi_home.webp" alt="hometext" />
                    </div>
                    <div className="navigatenames">Home</div>
                  </div>
                  {userId && (
                    <div>
                      <div className="navigatelinks" onClick={handleCreatePost}>
                        <div>
                          <img
                            src="./images/gridicons_create.webp"
                            alt="hometext"
                          />
                        </div>
                        <div className="navigatenames">Create Post</div>
                      </div>
                    </div>
                  )}
                  <div className="navigatelinks" onClick={handleForumPage}>
                    <div>
                      <img
                        src="./images/fluent_people-team-16-filled.webp"
                        alt="hometext"
                      />
                    </div>
                    <div className="navigatenames">Forum</div>
                  </div>

                  {!userId ? (
                    <div className="navigatelinks" onClick={handleLogin}>
                      <div>
                        <img
                          src="./images/ooui_log-in-ltr.webp"
                          alt="hometext"
                        />
                      </div>
                      <div className="navigatenames">Log in</div>
                    </div>
                  ) : (
                    <div className="navigatelinks" onClick={logout}>
                      <div>
                        <img
                          src="./images/ooui_log-in-ltr.webp"
                          alt="hometext"
                        />
                      </div>
                      <div className="navigatenames">Log Out</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="rightpostbox">
                <div>
                  <div className="posterss">
                    <div>
                      <div>
                        <div className="gggedindeatilstext">Log in Details</div>
                        <form
                          action=""
                          className="formwidthpaddings"
                          onSubmit={handleSubmit}
                        >
                          <div className="loginpageuserididv">
                            <input
                              type="email"
                              name="email"
                              value={email}
                              placeholder="Email"
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="loginpagepassworddiv">
                            <input
                              type="password"
                              name="password"
                              value={password}
                              placeholder="Password"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <button className="loginbuttonpagediv" type="submit">
                            Log in
                          </button>
                          <div
                            className="loginpagessforgotpasswordtext"
                            onClick={handleForgotPassword}
                          >
                            Forgot Password
                          </div>
                          <div className="donthaveaxxcountpoassword">
                            Dont have an account?
                            <span
                              className="registerhere"
                              onClick={navigateToRegister}
                            >
                              Register here,
                            </span>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!--------------------- flex post content-------------------------------------> */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
