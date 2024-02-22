import React, { useState, useEffect, useCallback, useContext } from "react";
import AuthContext from "./context/authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import API_URL from "./global";
function Notification() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
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
  useEffect(() => {
    async function getData() {
      try {
        const userResponse = await axios.get(`${API_URL}/auth/user`, {
          crossDomain: true,
          withCredentials: true,
        });
        if (userResponse.data.userName) {
          setUserName(userResponse.data.userName);
          setUserProfilePic(userResponse.data.profilePic);
          setUserIdentity(userResponse.data.userIdentity);
          setUserId(userResponse.data.userId);
          const notificationsResponse = await axios.post(
            `${API_URL}/notifications`,
            { id: userResponse.data.userId },
            { crossDomain: true, withCredentials: true }
          );
          setNotifications(notificationsResponse.data);
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching notifications");
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  const formatNotificationTime = (timestamp) => {
    const now = moment();
    const notificationTime = moment(timestamp);
    const diff = now.diff(notificationTime, "minutes");

    if (diff < 1) {
      return "just now";
    } else if (diff < 60) {
      return `${diff} ${diff === 1 ? "minute" : "minutes"} ago`;
    } else {
      return notificationTime.fromNow();
    }
  };

  const handleNotificationClick = async (notificationId, threadId) => {
    try {
      const sendData = {
        id: userId,
      };
      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        sendData,
        { crossDomain: true, withCredentials: true }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      if (response.data) navigate(`/${threadId}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (confirmDelete) {
      try {
        const sendData = {
          id: userId,
        };
        await axios.delete(
          `${API_URL}/notifications/${notificationId}`,
          {
            data: sendData,
          },
          { crossDomain: true, withCredentials: true }
        );
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== notificationId
          )
        );
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };
  const handleClearNotification = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all notifications?"
    );
    if (confirmClear) {
      try {
        const sendData = { id: userId };
        await axios.delete(
          `${API_URL}/notifications/delete/all`,
          { data: sendData },
          { crossDomain: true, withCredentials: true }
        );
        // Clear notifications from state
        setNotifications([]);
      } catch (error) {
        console.error("Error clearing notifications:", error);
        // Handle error
      }
    }
  };
  const handleMarkAllAsRead = async () => {
    try {
      const sendData = { id: userId };
      await axios.put(`${API_URL}/notifications/read/all`, sendData, {
        crossDomain: true,
        withCredentials: true,
      });
      // Update notifications state to mark all as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Handle error
    }
  };
  const toggleNav = () => {
    setIsActive(!isActive);
  };
  const { getLoggedIn } = useContext(AuthContext);
  //const [userName, setUserName] = useState("");
  //const [userId, setUserId] = useState("");
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
      <div className="flexofcreatepost">
        <div className="widthofcreatepost">
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
                              onClick={NavigateToNotification}
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
                            className="profilephotosssupate"
                            style={{ paddingTop: "30px" }}
                          />
                        )}
                        <div className="imageflexleftnavbarmobile">
                          <div className="mobileversionnavbarimagesizess">
                            <div>
                              <img src={userProfilePic} alt="imagetext" />
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
                <div className="CreateYourPost">My Notification</div>
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
                    onClick={NavigateToNotification}
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
                    className="profilephotosssupate"
                    style={{ paddingTop: "30px" }}
                  />
                )}
                <div className="imageflexleftnavbar">
                  <div className="profilephotosssupate">
                    <img
                      src={userProfilePic || "./images/profilePhoto.png"}
                      alt="imagetext"
                    />
                  </div>
                  <div
                    className="editimageprofilepicsabsolute"
                    onClick={handleProfileUpdate}
                  >
                    <img src="./images/profileUpdate.png" alt="" />
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
              <div className="rightcreatepost">
                <div className="NotificationButtonflexx">
                  <div>
                    <button
                      className="ClearAllNotification"
                      onClick={handleClearNotification}
                    >
                      Clear All Notification
                    </button>
                  </div>
                  <div>
                    <button
                      className="ClearAllNotification1"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>

                {/* <!--------------------Map Function---------------------> */}
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map((notification) => (
                      <div key={notification._id}>
                        <div className="notificationpagedivv">
                          <div className="notoficationflexx">
                            <div className="imageofthenotifier">
                              <img src={notification.senderProfilePic} alt="" />
                            </div>
                            <div
                              className="commentedtextss"
                              onClick={() =>
                                handleNotificationClick(
                                  notification._id,
                                  notification.threadId
                                )
                              }
                            >
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: notification.message,
                                }}
                              />
                              <span className="timeofthecommented">
                                {formatNotificationTime(notification.timestamp)}
                              </span>
                            </div>
                            <div
                              className="deleteoptionimage"
                              onClick={() =>
                                handleDeleteNotification(notification._id)
                              }
                            >
                              <img
                                src="./images/commentdeleteiconinpage.png"
                                alt=""
                              />
                            </div>
                          </div>
                          {!notification.isRead && (
                            <div className="seenornotdiv"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", fontSize: "30px" }}>
                    No Notifications
                  </div>
                )}
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
export default Notification;
