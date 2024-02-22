import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./context/authcontext";
import { useNavigate } from "react-router-dom";
import API_URL from "./global";
function ForgotPassword() {
  const [isActive, setIsActive] = useState(false);
  const { getLoggedIn } = useContext(AuthContext);
  const [otpMain, setOTP] = useState("");
  const [userName, setUserName] = useState("");
  const [userNotifications, setUserNotifications] = useState([]);
  const [unreadUserNotifications, setUnreadUserNotifications] = useState();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
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
          setUserNotifications(userResponse.data.notifications);
          setUnreadUserNotifications(userResponse.data.unreadNotifications);
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error(error);
      }
    }
    getData();
  }, []);
  const handleOtpSubmit = (otp) => {
    //console.log("OTP Value:", otp);
    setOTP(Number(otp));
    // You can add the logic for handling the OTP value here
  };
  useEffect(() => {
    // Ensure that the component is mounted before calling init
    var otpModule = otp("otp-inputs");
    otpModule.init(function (passcode) {
      handleOtpSubmit(passcode);
    });

    // Cleanup function
    return () => {
      otpModule.destroy();
    };
  }, []); // Empty dependency array ensures useEffect runs once after mount

  var BACKSPACE_KEY = 8;
  var ENTER_KEY = 13;
  var TAB_KEY = 9;
  var LEFT_KEY = 37;
  var RIGHT_KEY = 39;

  function otp(elementId) {
    var inputs = document.querySelectorAll(".js-otp-input");
    var completeCallback = null;

    function init(callback) {
      var i;
      completeCallback = callback || function () {};
      for (i = 0; i < inputs.length; i++) {
        registerEvents(i, inputs[i]);
      }
    }

    function destroy() {
      var i;
      for (i = 0; i < inputs.length; i++) {
        unregisterEvents(i, inputs[i]);
      }
    }

    function registerEvents(index, element) {
      element.addEventListener("input", function (ev) {
        onInput(index, ev);
      });
      element.addEventListener("paste", function (ev) {
        onPaste(index, ev);
      });
      element.addEventListener("keydown", function (ev) {
        onKeyDown(index, ev);
      });
    }

    function unregisterEvents(index, element) {
      element.removeEventListener("input", function (ev) {
        onInput(index, ev);
      });
      element.removeEventListener("paste", function (ev) {
        onPaste(index, ev);
      });
      element.removeEventListener("keydown", function (ev) {
        onKeyDown(index, ev);
      });
    }
    function onPaste(index, ev) {
      ev.preventDefault();
      var i;
      var curIndex = index;
      var clipboardData = ev.clipboardData || window.clipboardData;
      var pastedData = clipboardData.getData("Text");
      for (i = 0; i < pastedData.length; i++) {
        if (i < inputs.length) {
          if (!isDigit(pastedData[i])) break;
          inputs[curIndex].value = pastedData[i];
          curIndex++;
        }
      }
      if (curIndex === inputs.length) {
        inputs[curIndex - 1].focus();
        completeCallback(retrieveOTP());
      } else {
        inputs[curIndex].focus();
      }
    }

    function onKeyDown(index, ev) {
      var i;
      var key = ev.keyCode || ev.which;
      if (key === LEFT_KEY && index > 0) {
        ev.preventDefault();
        inputs[index - 1].focus();
      }
      if (key === RIGHT_KEY && index + 1 < inputs.length) {
        ev.preventDefault();
        inputs[index + 1].focus();
      }
      if (key === BACKSPACE_KEY && index > 0) {
        if (inputs[index].value === "") {
          inputs[index - 1].value = "";
          inputs[index - 1].focus();
        } else {
          inputs[index].value = "";
        }
      }
      if (key === ENTER_KEY) {
        ev.preventDefault();
        if (isOTPComplete()) {
          completeCallback(retrieveOTP());
        }
      }
      if (key === TAB_KEY && index === inputs.length - 1) {
        ev.preventDefault();
        if (isOTPComplete()) {
          completeCallback(retrieveOTP());
        }
      }
    }

    function onInput(index, ev) {
      var value = ev.data || ev.target.value;
      var curIndex = index;
      var i;

      for (i = 0; i < value.length; i++) {
        if (i < inputs.length) {
          if (!isDigit(value[i])) {
            inputs[curIndex].value = "";
            break;
          }

          inputs[curIndex++].value = value[i];

          if (curIndex === inputs.length) {
            // When the last input is filled, check if the OTP is complete
            if (isOTPComplete()) {
              completeCallback(retrieveOTP());
            }
          } else {
            inputs[curIndex].focus();
          }
        }
      }
    }

    function retrieveOTP() {
      var i;
      var otp = "";
      for (i = 0; i < inputs.length; i++) {
        otp += inputs[i].value;
      }
      return otp;
    }

    function isDigit(d) {
      return d >= "0" && d <= "9";
    }

    function isOTPComplete() {
      var isComplete = true;
      var i = 0;
      while (i < inputs.length && isComplete) {
        if (inputs[i].value === "") {
          isComplete = false;
        }
        i++;
      }
      return isComplete;
    }

    return {
      init: init,
      destroy: destroy,
    };
  }

  var otpModule = otp("otp-inputs");
  otpModule.init(function (passcode) {
    handleOtpSubmit(passcode);
  });
  function notificationclickfunction() {
    var notificationnumberofmessage = document.getElementsByClassName(
      "notificationnumberofmessage"
    );
    notificationnumberofmessage[0].style.display = "none";
    notificationnumberofmessage[1].style.display = "none";
  }

  const logoutAndNavigate = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, {
        crossDomain: true,
        withCredentials: true,
      });
      await getLoggedIn();
      navigate("/LoginPage");
    } catch (error) {
      console.error("Error during logout and navigation:", error);
      // Handle errors if needed
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const sendData = {
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        OTP: otpMain,
      };

      const response = await axios.post(
        `${API_URL}/auth/passwordChange`,
        sendData,
        { crossDomain: true, withCredentials: true }
      );

      if (response.data === "success") {
        alert("Password Changed Successfully. Please Login to Continue");
        logoutAndNavigate();
      } else {
        // Handle other response scenarios
        alert("Your Credentials is Wrong");
      }
    } catch (error) {
      console.error("Error during password change:", error);
      // Handle errors if needed
    }
  };
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
  const NavigateToLogin = () => {
    navigate("/LoginPage");
  };
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
                    <div
                      id="nav-toggle"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleNav();
                      }}
                    ></div>
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
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleProfileUpdate();
                                }}
                              >
                                <img src="./images/profileUpdate.png" alt="" />
                              </div>
                            )}
                          </div>
                          <div className="usernamenavbar">
                            <h3 className="mobilevrersionnamesize"></h3>
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
                            onClick={(e) => {
                              e.preventDefault();
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
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCreatePost();
                                }}
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
                            onClick={(e) => {
                              e.preventDefault();
                              handleForumPage();
                            }}
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
                              onClick={(e) => {
                                e.preventDefault();
                                handleLogin();
                              }}
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
                              onClick={(e) => {
                                e.preventDefault();
                                logout();
                              }}
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
                <div className="CreateYourPost">Forgot Password</div>
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

                  <div className="usernamenavbar"></div>
                </div>
                <div className="navigationbuttontop">
                  <div
                    className="navigatelinks"
                    onClick={(e) => {
                      e.preventDefault();
                      handleHome();
                    }}
                  >
                    <div>
                      <img src="./images/mdi_home.webp" alt="hometext" />
                    </div>
                    <div className="navigatenames">Home</div>
                  </div>
                  {userId && (
                    <div>
                      <div
                        className="navigatelinks"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCreatePost();
                        }}
                      >
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
                  <div
                    className="navigatelinks"
                    onClick={(e) => {
                      e.preventDefault();
                      handleForumPage();
                    }}
                  >
                    <div>
                      <img
                        src="./images/fluent_people-team-16-filled.webp"
                        alt="hometext"
                      />
                    </div>
                    <div className="navigatenames">Forum</div>
                  </div>

                  {!userId ? (
                    <div
                      className="navigatelinks"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogin();
                      }}
                    >
                      <div>
                        <img
                          src="./images/ooui_log-in-ltr.webp"
                          alt="hometext"
                        />
                      </div>
                      <div className="navigatenames">Log in</div>
                    </div>
                  ) : (
                    <div
                      className="navigatelinks"
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                    >
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
                        <div className="gggedindeatilstext">Password Reset</div>
                        <form action="" className="formwidthpaddings">
                          <div className="d-flex">
                            <div className="otpdivmarginleft">
                              <input
                                type="text"
                                className="form-control form-control--otp js-otp-input"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="one-time-code"
                                required
                              />
                              <input
                                type="text"
                                className="form-control form-control--otp js-otp-input"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                              />
                              <input
                                type="text"
                                className="form-control form-control--otp js-otp-input"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                              />

                              <input
                                type="text"
                                className="form-control form-control--otp js-otp-input"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                              />
                              <input
                                type="text"
                                className="form-control form-control--otp js-otp-input"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                              />
                              <input
                                type="text"
                                className="form-control form-control--otp js-otp-input"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                              />
                            </div>
                          </div>

                          <div className="enterotp">Enter OTP</div>
                          {/* {console.log(otp)} */}
                          <div className="loginpageuserididv">
                            <input
                              type="password"
                              name="newPassword"
                              value={newPassword}
                              placeholder="Set New Password"
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="loginpagepassworddiv">
                            <input
                              type="password"
                              name="confirmPassword"
                              value={confirmPassword}
                              placeholder="Confirm New Password"
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              required
                            />
                          </div>
                          <button
                            className="loginbuttonpagediv"
                            onClick={(e) => {
                              handlePasswordChange(e);
                            }}
                          >
                            Reset Password
                          </button>
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

export default ForgotPassword;
