import React, { useState, useEffect, useContext } from "react";
import AuthContext from "./context/authcontext";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import API_URL from "./global";
function WelcometoForum() {
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({
    totalHeadings: 0,
    totalThreads: 0,
    totalViews: 0,
  });
  const navigate = useNavigate();
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
  useEffect(() => {
    async function getName() {
      try {
        const response = await axios.get(`${API_URL}/auth/user`, {
          crossDomain: true,
          withCredentials: true,
        });
        if (response.data.userName) {
          setUserName(response.data.userName);
          setUserId(response.data.userId);
          setUserProfilePic(response.data.profilePic);
          setIsAdmin(response.data.isAdmin);
          setUserIdentity(response.data.userIdentity);
          setUserNotifications(response.data.notifications);
          setUnreadUserNotifications(response.data.unreadNotifications);
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error(error);
      }
    }

    getName();
  }, []);
  const formatTimeAgo = (timestamp) => {
    return moment(timestamp).fromNow();
  };
  const toggleNav = () => {
    setIsActive(!isActive);
  };
  const NavigateToSection = (heading) => {
    navigate(`/home/${heading}`);
  };
  const { getLoggedIn } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [userIdentity, setUserIdentity] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  const [userNotifications, setUserNotifications] = useState([]);
  const [unreadUserNotifications, setUnreadUserNotifications] = useState();
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
  const NavigateToNotification = async () => {
    navigate("/Notification");
  };
  async function logout() {
    await axios.get(`${API_URL}/auth/logout`, {
      crossDomain: true,
      withCredentials: true,
    });
    await getLoggedIn();
    navigate("/LoginPage");
  }
  return (
    <div>
      {/* <!---------------------Welcome to Revnitro-------------------------------------> */}
      <div className="welcometorevnitro">
        <h1>Welcome to Revnitro Forum</h1>
      </div>
      {/* <!---------------------Welcome to Revnitro-------------------------------------> */}
      <div className="welcometoforumflexconcept">
        <div className="forumdivmainnwidth">
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
                        {userId ? (
                          <div className="notificationinmobileversionzx">
                            <div
                              className="belliiconofmobile"
                              onClick={(e) => {
                                e.preventDefault();
                                NavigateToNotification();
                              }}
                            >
                              <img
                                src="./images/notificationimagesforum.png"
                                alt=""
                              />
                            </div>
                            {unreadUserNotifications > 0 && (
                              <div className="notificationnumberofmessage">
                                {unreadUserNotifications}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="imageflexleftnavbarmobile"
                            style={{ paddingTop: "30px" }}
                          />
                        )}
                        <div className="imageflexleftnavbarmobile">
                          <div className="mobileversionnavbarimagesizess">
                            <div>
                              <img
                                src={
                                  userProfilePic ||
                                  "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                                }
                                alt="imagetext"
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
                <div className="CreateYourPost">Welcome to Forum</div>
              </div>
            </div>
          </div>
          {/* <!--------------------- input and filters------------------------------------->

        <!--------------------- flex post content-------------------------------------> */}
          <div>
            <div className="createpostfunction">
              <div className="leftnavbarbox">
                {userId ? (
                  <div
                    className="notificationareapostion"
                    onClick={(e) => {
                      e.preventDefault();
                      NavigateToNotification();
                    }}
                  >
                    <div>
                      <img src="./images/notificationimagesforum.png" alt="" />
                    </div>
                    {unreadUserNotifications > 0 && (
                      <div className="notificationnumberofmessage">
                        {unreadUserNotifications}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="imageflexleftnavbarmobile"
                    style={{ paddingTop: "30px" }}
                  />
                )}
                <div className="imageflexleftnavbar">
                  <div className="profilephotosssupate">
                    <img
                      src={
                        userProfilePic ||
                        "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                      }
                      alt="imagetext"
                    />
                  </div>
                  {userId && (
                    <div
                      className="editimageprofilepicsabsolute"
                      onClick={handleProfileUpdate}
                    >
                      <img src="./images/profileUpdate.png" alt="" />
                    </div>
                  )}
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
              <div className="rightwelcometoforum">
                <div className="maindivuserslist">
                  <div className="forumoneheading">
                    <div className="firstrowheading">Forum</div>
                    <div className="firstrowheading">Post</div>
                    <div className="firstrowheading">Recent Post</div>
                  </div>
                  {stats &&
                    stats.headingDetails &&
                    stats.headingDetails.map((heading) => (
                      <div
                        key={heading.heading}
                        className="ForumMapppingDataas"
                      >
                        <div className="forumone">
                          <div className="firstrow">{heading.heading}</div>
                          <div className="firstrow">
                            {heading.postCount} Post
                          </div>
                          <div className="firstrow">
                            <div className="postviewdivflex">
                              <div>
                                {heading.latestThread.title.length > 10 ? (
                                  <div>
                                    {heading.latestThread.title.substring(0, 9)}
                                    .....
                                  </div>
                                ) : (
                                  <div>{heading.latestThread.title}</div>
                                )}
                                <div className="dateofpost">
                                  {moment(
                                    heading.latestThread.createdAt
                                  ).fromNow()}
                                </div>
                              </div>
                              <div
                                onClick={() =>
                                  NavigateToSection(heading.heading)
                                }
                              >
                                <img
                                  className="Aroowrbuttonhovercursor"
                                  src="./images/ph_arrow-up-bold.png"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

function notificationclickfunction() {
  var notificationnumberofmessage = document.getElementsByClassName(
    "notificationnumberofmessage"
  );
  notificationnumberofmessage[0].style.display = "none";
  notificationnumberofmessage[1].style.display = "none";
}

export default WelcometoForum;
