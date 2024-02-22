import React, { useContext, useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import AuthContext from "./context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "./global";

const otpInputRefs = Array.from({ length: 6 }).map(() => React.createRef());
function Register() {
  const [isActive, setIsActive] = useState(false);
  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [userIdentity, setUserIdentity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [identityAvailable, setIdentityAvailable] = useState(false);
  const { getLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [isChecked1213, setisChecked1213] = useState(false);
  const Toggle1221 = () => {
    setisChecked1213(!isChecked1213);
  };
  const [showDiv, setShowDiv] = useState(false);
  const handleButtonClick = () => {
    setShowDiv(true);
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text");
    const pastedOtp = pastedData.split("").slice(0, 6); // Limit to 6 characters
    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);
  };

  // Function to handle onKeyDown event
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) {
        const prevIndex = index - 1;
        const prevInput = otpInputRefs[prevIndex].current;
        if (prevInput) {
          prevInput.focus();
        }
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (index > 0) {
        const prevIndex = index - 1;
        const prevInput = otpInputRefs[prevIndex].current;
        if (prevInput) {
          prevInput.focus();
        }
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (index < otpInputRefs.length - 1) {
        const nextIndex = index + 1;
        const nextInput = otpInputRefs[nextIndex].current;
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (/^\d$/.test(e.key)) {
      // Allow digits to be entered directly
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = e.key;
      setOtp(newOtp);
      if (index < otpInputRefs.length - 1) {
        const nextIndex = index + 1;
        const nextInput = otpInputRefs[nextIndex].current;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to handle opening the popup
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // Function to handle closing the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Function that triggers the opening of the popup, can be called when needed
  const triggerPopup = () => {
    // You can put your logic here, for example, after another function is complete
    openPopup();
  };
  async function findIdentity(userIdentity) {
    const sendData = { userIdentity: userIdentity };
    const response = await axios.post(
      `${API_URL}/auth/findIdentity`,
      sendData,
      { crossDomain: true, withCredentials: true }
    );
    //console.log(response.data);

    if (response.data === true) {
      setIdentityAvailable(true);
    } else if (response.data === false) {
      setIdentityAvailable(false);
    } else {
      setIdentityAvailable(false);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const registerData = {
        userName,
        lastName,
        email,
        password,
        passwordVerify,
        userIdentity,
      };
      const response = await axios.post(
        `${API_URL}/auth/verify`,
        registerData,
        { crossDomain: true, withCredentials: true }
      );
      if (response.data === "please enter a password of atleast 6 charecters") {
        alert("please enter a password of atleast 6 charecters");
      } else if (response.data === "password doesnt match") {
        alert("password doesnt match");
      } else if (
        response.data ===
        "Password must contain at least one uppercase letter, one special character"
      ) {
        alert(
          "Password must contain at least one uppercase letter, one special character"
        );
      } else if (response.data === "User ID is Taken") {
        alert("User ID is Taken");
      } else if (response.data === "User Already Exists") {
        alert("User Already Exists. Try With Other Mail-Id");
      } else if (response.data === "Successful VerifyUser") {
        triggerPopup();
        handleButtonClick();
      }
    } catch (err) {
      console.error(err);
    }
  }
  const handleAccept = async (e) => {
    e.preventDefault();
    try {
      const enteredOtp = otp.join("");
      const response = await axios.post(
        `${API_URL}/auth/register`,
        { OTP: Number(enteredOtp) },
        { crossDomain: true, withCredentials: true }
      );
      if (response.data === "TokenVerificationFailed") {
        alert("Token Verification Failed");
      } else if (response.data === "password doesnt match") {
        alert("password doesnt match");
      } else if (response.data === "No User") {
        alert("User Already Exists. Try With Other Mail-Id");
      } else if (response.data === "Successful Register") {
        alert("Account Creation Successfull");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const toggleNav = () => {
    setIsActive(!isActive);
  };
  const [userId, setUserId] = useState("");

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
                <div className="CreateYourPost">Register Page</div>
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
                        <div className="gggedindeatilstext">
                          Register a new Account
                        </div>
                        <form
                          action=""
                          className="formwidthpaddings"
                          onSubmit={handleSubmit}
                        >
                          <div className="loginpageuserididv">
                            <input
                              type="text"
                              name="userName"
                              value={userName}
                              placeholder="User Name"
                              onChange={(e) => setUserName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="loginpageuserididv">
                            <input
                              type="text"
                              name="lastName"
                              value={lastName}
                              placeholder="Last Name"
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="loginpageuserididv">
                            <input
                              type="text"
                              name="text"
                              value={userIdentity}
                              placeholder="User ID"
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setUserIdentity(newValue);
                                findIdentity(newValue);
                              }}
                              required
                            />
                          </div>

                          <div className="registerpageidalreadytaken">
                            {identityAvailable && `*ID Already Taken`}
                          </div>
                          <div className="loginpagepassworddiv">
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
                              placeholder="Create Password"
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="loginpagepassworddiv">
                            <input
                              type="password"
                              name="passwordVerify"
                              value={passwordVerify}
                              placeholder="Confirm Password"
                              onChange={(e) =>
                                setPasswordVerify(e.target.value)
                              }
                              required
                            />
                          </div>
                          <button className="loginbuttonpagediv" type="submit">
                            Register
                          </button>
                          <div></div>
                        </form>

                        {showDiv && (
                          <div>
                            <div style={{ marginTop: "20px" }}>
                              <div className="VerifyOurEmail">
                                Verify Your Email
                              </div>

                              <div
                                className="An6DigitOtPhasbeen"
                                style={{ marginTop: "10px" }}
                              >
                                An 6 Digit OTP has been Sent to your Mail
                              </div>
                            </div>
                            <div className="regiswtrerpagenewpopotip">
                              <div className="d-flex">
                                <div
                                  className="otpdivmarginleft"
                                  style={{
                                    margin: "0px",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {otp.map((digit, index) => (
                                    <input
                                      key={index}
                                      type="text"
                                      className="form-control form-control--otp js-otp-input"
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                      maxLength="1"
                                      value={digit}
                                      //autoComplete="one-time-code"
                                      onPaste={handlePaste}
                                      onKeyDown={(e) => handleKeyDown(e, index)}
                                      ref={otpInputRefs[index]}
                                      autoFocus={index === 0}
                                      readOnly
                                      required
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <button
                              className="acceptfortheregisterbutton"
                              onClick={handleAccept}
                            >
                              Verify
                            </button>

                            <Popup
                              open={isPopupOpen}
                              onClose={closePopup}
                              modal
                              nested
                            >
                              {(close) => (
                                <div className="popupflexwidth">
                                  <div className="popupdasatas">
                                    <div className="mainbackgorundsgsforall">
                                      <div className="polivyareaflxxexs">
                                        <div></div>
                                        <div className="Withofthepopup">
                                          Privacy Policy and Terms of Use
                                        </div>
                                        <div>
                                          <button
                                            className="butonpgthepopupo"
                                            onClick={() => close()}
                                          >
                                            ✖
                                          </button>
                                        </div>
                                      </div>
                                      trk
                                      <div className="tooglexswithchforpopouo">
                                        <div>
                                          <input
                                            type="checkbox"
                                            id="Toggle1221"
                                            // Implement your checkbox logic here
                                          />
                                          <label
                                            htmlFor="Toggle1221"
                                            className="toggledatatreds"
                                          >
                                            "I hereby acknowledge that I have
                                            read and agree to abide by the terms
                                            and conditions of use for this
                                            service."
                                          </label>
                                        </div>

                                        <button
                                          className="Accepetednamebedotreregsiter"
                                          onClick={(e) => {
                                            // Implement your accept button logic here
                                            close();
                                          }}
                                        >
                                          Accept
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Popup>
                          </div>
                        )}
                        <div className="donthaveaxxcountpoassword">
                          Already have an Account ?
                          <span
                            className="registerhere"
                            onClick={NavigateToLogin}
                          >
                            &nbsp;Login here
                          </span>
                        </div>
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
export default Register;
