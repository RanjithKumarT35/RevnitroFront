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
                                      <div className="mainofthecontentoverflows">
                                        <div className="margtintipforumpoptip">
                                          By registering or reading any content
                                          on the www.forum.revnitro.com website,
                                          you agree to the Terms & Conditions,
                                          and other guidelines posted on this
                                          website. You agree that you have read
                                          the items prior to registering or
                                          reading any content. Your use of this
                                          website signifies your acceptance of
                                          these Terms & Conditions.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          Although our Administrators,
                                          Moderators and Staff will attempt to
                                          keep all objectionable content and
                                          messages off www.forum.revnitro.com,
                                          it is impossible for us to review all
                                          content and messages. All content and
                                          messages express the views of the
                                          author only. Neither the owners of
                                          www.forum.revnitro.com, nor its
                                          Moderators / Staff members, will be
                                          held responsible for any content or
                                          message on the www.forum.revnitro.com
                                          website.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          By agreeing to these rules, you
                                          warrant that you will not post any
                                          content or messages on
                                          www.forum.revnitro.com that are
                                          obscene, vulgar, sexually-orientated,
                                          hateful, threatening, or otherwise
                                          violative of any laws. The owners of
                                          www.forum.revnitro.com reserve the
                                          right to remove or edit any content or
                                          message for any reason.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          You understand the standards and laws
                                          of the community, site and computer to
                                          which you are transporting this
                                          material, and are solely responsible
                                          for your actions.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          If you use this site in violation of
                                          this agreement, you understand you may
                                          be in violation of law and are solely
                                          responsible for your actions.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          By reading any content on this site,
                                          you release and discharge
                                          www.forum.revnitro.com and its
                                          Management, Staff & Moderators from
                                          any and all liability which might
                                          arise.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          You understand the dangers associated
                                          with sharing your personally
                                          identifiable information, including
                                          your full name, telephone number or
                                          address over the Internet. You agree
                                          not to share such information with
                                          other users. In the event that you do
                                          share such information, you do so at
                                          your own risk and hold
                                          www.forum.revnitro.com harmless.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          You warrant that you are registering
                                          for, and will use
                                          www.forum.revnitro.com for the purpose
                                          of reading the content under the terms
                                          and conditions of this Agreement. You
                                          warrant that you are not registering
                                          for, and will not access, read, copy
                                          or otherwise reproduce, transmit or
                                          communicate any portion of
                                          www.forum.revnitro.com for other
                                          purposes, including, but not limited
                                          to, establishing another website /
                                          publication, or for any other personal
                                          or commercial purposes. You warrant
                                          that you will not copy or otherwise
                                          reproduce any portion, material,
                                          posts, articles, pictures or text of
                                          www.forum.revnitro.com on any other
                                          website / publication.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          You agree that www.forum.revnitro.com,
                                          it’s Owners and Agents do not hold
                                          themselves out to have any kind of
                                          expert or professional training or
                                          knowledge, and make no warranties of
                                          fitness or quality for the content.
                                          You understand that nothing contained
                                          within, posted on or communicated
                                          through www.Team-BHP.com will be
                                          considered professional advice of any
                                          kind. Acceptance of this term
                                          certifies your waiver of any legal
                                          right that you may have to take action
                                          with respect to any loss arising from
                                          or in connection with your reliance on
                                          any information published on
                                          www.forum.revnitro.com. You agree not
                                          to rely or act on any advice posted on
                                          www.forum.revnitro.com without first
                                          consulting a professional. By
                                          accepting these terms, you agree to
                                          indemnify www.forum.revnitro.com, its
                                          Agents, owners and any other firms,
                                          from any claim in negligence (or any
                                          other tort), contract or action under
                                          law for loss to yourself, any company
                                          that you are employed by or act as an
                                          agent for, and/or any other injury or
                                          loss that you may claim to have been
                                          caused by using www.forum.revnitro.com
                                          or from relying on advice from this
                                          website.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          All contents of the Web Site page,
                                          including, but not limited to text,
                                          photographs, graphics, and icons, are
                                          copyrighted materials owned or
                                          controlled by www.forum.revnitro.com
                                          and contain www.forum.revnitro.com’s
                                          name, trademarks, service marks, and
                                          trade names. You understand that you
                                          may download one copy of these
                                          materials on any single computer and
                                          print no more than one (1) copy for
                                          PERSONAL use. No other permission is
                                          granted to you to print, copy,
                                          reproduce, distribute, transmit,
                                          upload, download, store, display in
                                          public, alter, modify, or otherwise
                                          use these materials.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          You agree that your access and use of
                                          www.forum.revnitro.com is subject to
                                          the terms of this Agreement AND the
                                          sole discretion of the Owners or
                                          authorized agents. You agree that your
                                          membership and use of
                                          www.forum.revnitro.com is AT-WILL, and
                                          that your membership may be
                                          terminated, banned or deleted at any
                                          time and for any reason by the Owners
                                          or Agents of www.forum.revnitro.com.
                                          You agree to abide by all decisions of
                                          www.forum.revnitro.com regarding your
                                          use, access and membership on the Web
                                          Site, including restriction, changes
                                          or revocation of your membership.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          You agree that if your membership is
                                          permanently revoked for any or no
                                          reason, you will not make any attempt
                                          to re-register or otherwise obtain
                                          access to www.forum.revnitro.com. You
                                          agree that violation of this provision
                                          will be considered and construed as
                                          illegal computer cracking, conversion
                                          and misappropriation of electronic
                                          resources, and that you will be fully
                                          liable for any time lost by
                                          www.forum.revnitro.com or its Agents
                                          in connection with your violation of
                                          this provision.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          If you have any conflict with
                                          www.forum.revnitro.com you agree to:
                                          (a) First contact
                                          www.forum.revnitro.com at the E-mail
                                          ID email address to see if the
                                          conflict can be resolved. (b) Use
                                          binding arbitration according to the
                                          provisions of the Indian Arbitration
                                          and Conciliation Act, 1996 (c) Pay for
                                          the arbitration yourself and the place
                                          for arbitration must be at Chennai,
                                          Tamil Nadu, India.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          If you owe www.forum.revnitro.com any
                                          money for any service we perform or
                                          any legal action arising from your
                                          actions, you agree not to raise
                                          statute of limitation as a defence
                                          against the collection of any money we
                                          collect from you.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          If any dispute arises over the intent
                                          or meaning of these terms, the final
                                          ruling rests with the intent of the
                                          author of these terms.
                                          www.forum.revnitro.com's site is made
                                          available for your personal and
                                          non-commercial use only. We may modify
                                          or terminate our site from time to
                                          time, for any reason, and without
                                          notice, including the right to
                                          terminate with or without notice and
                                          without liability to you, any other
                                          user or any third party. We reserve
                                          the right to modify these Terms and
                                          Conditions from time to time without
                                          notice. You understand and agree that
                                          you are solely responsible for
                                          reviewing these Terms and Conditions
                                          from time to time. If you should
                                          object to any term or condition of
                                          these Terms, any guideline, or any
                                          subsequent changes thereto or become
                                          unhappy with www.forum.revnitro.com in
                                          any way, your only choice is to
                                          immediately discontinue use of the
                                          www.forum.revnitro.com.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          It is our policy to respond to clear
                                          notices of alleged copyright
                                          infringement. The form of notice
                                          specified below is consistent with the
                                          form suggested by the Indian
                                          Copyrights Act, but we will respond to
                                          notices of this form from other
                                          jurisdictions as well. Regardless of
                                          whether we may be liable for such
                                          infringement under local country law
                                          or Indian law, our response to these
                                          notices may include removing or
                                          disabling access to material claimed
                                          to be the subject of infringing
                                          activity. If we remove or disable
                                          access in response to such a notice,
                                          we will make a good-faith attempt to
                                          contact the owner or administrator of
                                          the affected site or content so that
                                          they may make a counter notification.
                                          We may also document notices of
                                          alleged infringement on which we act.
                                          As with all legal notices, a copy of
                                          the notice may be sent to one or more
                                          third parties who may make it
                                          available to the public. To file a
                                          notice of infringement with us, you
                                          must provide an email to E-mail that
                                          sets forth the items specified below.
                                          Please note that you will be liable
                                          for damages (including costs and
                                          attorneys' fees) if you materially
                                          misrepresent that a product or
                                          activity is infringing your
                                          copyrights. You will also be liable to
                                          pay an amount of 90,000 Indian
                                          Rupees/hour or in any country’s
                                          currency in equal value to it as a fee
                                          to www.forum.revnitro.com for the time
                                          it takes to deal with the fraudulent
                                          complaint.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          For quicker replies, please include
                                          the following information in your
                                          email to E-mail: Identify in
                                          sufficient detail the original
                                          copyrighted work that you believe has
                                          been infringed upon. Identify the
                                          material that you claim is infringing
                                          the copyrighted work. Provide
                                          information reasonably sufficient to
                                          permit www.forum.revnitro.com to
                                          contact you (email address is
                                          preferred). Provide information, if
                                          possible, sufficient to permit
                                          www.forum.revnitro.com to notify the
                                          owner/administrator of the allegedly
                                          infringing web page or content (email
                                          address is preferred). Include the
                                          following statement: "I have a good
                                          faith belief that use of the
                                          copyrighted materials described above
                                          as allegedly infringing is not
                                          authorized by the copyright owner, its
                                          agent, or the law. I swear, under
                                          penalty of perjury, that the
                                          information in the notification is
                                          accurate and that I am the copyright
                                          owner or authorized to act on behalf
                                          of the owner of an exclusive right
                                          that is allegedly infringed."
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          Disclaimer of Warranties:
                                          www.forum.revnitro.com disclaims any
                                          and all responsibility or liability
                                          for the accuracy, content,
                                          completeness, legality, reliability,
                                          operability or availability of
                                          information or material displayed on
                                          the www.forum.revnitro.com site.
                                          www.forum.revnitro.com disclaims any
                                          responsibility for the deletion,
                                          failure to store, mis delivery, or
                                          untimely delivery of any information
                                          or material. www.forum.revnitro.com
                                          disclaims any responsibility for any
                                          harm resulting from downloading or
                                          accessing any information or material
                                          on the Internet through the
                                          www.forum.revnitro.com.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          THE www.forum.revnitro.com site, AND
                                          ALL MATERIALS, INFORMATION, PRODUCTS
                                          AND sites INCLUDED IN THE
                                          www.forum.revnitro.com SITE ARE
                                          PROVIDED "AS IS," WITH NO WARRANTIES
                                          WHATSOEVER. www.forum.revnitro.com AND
                                          ITS ADMINISTRATION EXPRESSLY DISCLAIM
                                          TO THE FULLEST EXTENT PERMITTED BY LAW
                                          ALL EXPRESS, IMPLIED, AND STATUTORY
                                          WARRANTIES, INCLUDING, WITHOUT
                                          LIMITATION, THE WARRANTIES OF MERCHANT
                                          ABILITY, FITNESS FOR A PARTICULAR
                                          PURPOSE, AND NON-INFRINGEMENT OF
                                          PROPRIETARY RIGHTS.
                                          www.forum.revnitro.com AND ITS
                                          ADMINISTRATION DISCLAIM ANY WARRANTIES
                                          REGARDING THE SECURITY, RELIABILITY,
                                          TIMELINESS, AND PERFORMANCE OF THE
                                          www.forum.revnitro.com site.
                                          www.forum.revnitro.com AND ITS
                                          ADMINISTRATION DISCLAIM ANY WARRANTIES
                                          FOR ANY INFORMATION OR ADVICE OBTAINED
                                          THROUGH THE www.forum.revnitro.com
                                          site. www.forum.revnitro.com AND ITS
                                          ADMINISTRATION DISCLAIM ANY WARRANTIES
                                          FOR SERVICES OR GOODS RECEIVED THROUGH
                                          OR ADVERTISED ON THE
                                          www.forum.revnitro.com site OR
                                          RECEIVED THROUGH ANY LINKS PROVIDED BY
                                          THE SITE, AS WELL AS FOR ANY
                                          INFORMATION OR ADVICE RECEIVED THROUGH
                                          ANY LINKS PROVIDED IN THE
                                          www.forum.revnitro.com. YOU UNDERSTAND
                                          AND AGREE THAT YOU DOWNLOAD OR
                                          OTHERWISE OBTAIN MATERIAL OR DATA
                                          THROUGH THE USE OF THE
                                          www.forum.revnitro.com site AT YOUR
                                          OWN DISCRETION AND RISK AND THAT YOU
                                          WILL BE SOLELY RESPONSIBLE FOR ANY
                                          DAMAGES. This includes but is not
                                          limited to damages TO YOUR COMPUTER
                                          SYSTEM OR LOSS OF DATA THAT RESULTS
                                          FROM THE DOWNLOAD OF SUCH MATERIAL OR
                                          DATA. SOME STATES OR OTHER
                                          JURISDICTIONS DO NOT ALLOW THE
                                          EXCLUSION OF IMPLIED WARRANTIES, SO
                                          THE ABOVE EXCLUSIONS MAY NOT APPLY TO
                                          YOU. YOU MAY ALSO HAVE OTHER RIGHTS
                                          THAT VARY FROM STATE TO STATE AND
                                          JURISDICTION TO JURISDICTION.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          Limitation of Liability: UNDER NO
                                          CIRCUMSTANCES SHALL
                                          www.forum.revnitro.com BE LIABLE TO
                                          ANY USER ON ACCOUNT OF THAT USER'S USE
                                          OR MISUSE OF OR RELIANCE ON THE
                                          www.forum.revnitro.com site. ARISING
                                          FROM ANY CLAIM RELATING TO THIS
                                          AGREEMENT OR THE SUBJECT MATTER HEREOF
                                          SUCH LIMITATION OF LIABILITY SHALL
                                          APPLY TO PREVENT RECOVERY OF DIRECT,
                                          INDIRECT, INCIDENTAL, CONSEQUENTIAL,
                                          SPECIAL, EXEMPLARY, AND PUNITIVE
                                          DAMAGES WHETHER SUCH CLAIM IS BASED ON
                                          WARRANTY, CONTRACT, TORT (INCLUDING
                                          NEGLIGENCE), OR OTHERWISE, (EVEN IF
                                          www.forum.revnitro.com HAVE BEEN
                                          ADVISED OF THE POSSIBILITY OF SUCH
                                          DAMAGES). SUCH LIMITATION OF LIABILITY
                                          SHALL APPLY WHETHER THE DAMAGES ARISE
                                          FROM USE OR MISUSE OF AND RELIANCE ON
                                          THE www.forum.revnitro.com site, FROM
                                          INABILITY TO USE THE
                                          www.forum.revnitro.com site, OR FROM
                                          THE INTERRUPTION, SUSPENSION, OR
                                          TERMINATION OF THE
                                          www.forum.revnitro.com site (INCLUDING
                                          SUCH DAMAGES INCURRED BY THIRD
                                          PARTIES). THIS LIMITATION SHALL ALSO
                                          APPLY WITH RESPECT TO DAMAGES INCURRED
                                          BY REASON OF OTHER SERVICES OR GOODS
                                          RECEIVED THROUGH OR ADVERTISED ON THE
                                          www.forum.revnitro.com site OR
                                          RECEIVED THROUGH ANY LINKS PROVIDED IN
                                          THE www.forum.revnitro.com site, AS
                                          WELL AS BY REASON OF ANY INFORMATION
                                          OR ADVICE RECEIVED THROUGH OR
                                          ADVERTISED ON THE
                                          www.forum.revnitro.com site OR
                                          RECEIVED THROUGH ANY LINKS PROVIDED IN
                                          THE www.forum.revnitro.com site. THIS
                                          LIMITATION SHALL ALSO APPLY, WITHOUT
                                          LIMITATION, TO THE COSTS OF
                                          PROCUREMENT OF SUBSTITUTE GOODS OR
                                          SERVICES, LOST PROFITS, OR LOST DATA.
                                          SUCH LIMITATION SHALL FURTHER APPLY
                                          WITH RESPECT TO THE PERFORMANCE OR
                                          NON-PERFORMANCE OF THE
                                          www.forum.revnitro.com site OR ANY
                                          INFORMATION OR MERCHANDISE THAT
                                          APPEARS ON, OR IS LINKED OR RELATED IN
                                          ANY WAY TO THE www.forum.revnitro.com
                                          site. SUCH LIMITATION SHALL APPLY
                                          NOTWITHSTANDING ANY FAILURE OF
                                          ESSENTIAL PURPOSE OF ANY LIMITED
                                          REMEDY AND TO THE FULLEST EXTENT
                                          PERMITTED BY LAW. SOME STATES OR OTHER
                                          JURISDICTIONS DO NOT ALLOW THE
                                          EXCLUSION OR LIMITATION OF LIABILITY
                                          FOR INCIDENTAL OR CONSEQUENTIAL
                                          DAMAGES, SO THE ABOVE LIMITATIONS AND
                                          EXCLUSIONS MAY NOT APPLY TO YOU.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          Without limiting the foregoing, under
                                          no circumstances shall
                                          www.forum.revnitro.com be held liable
                                          for any delay or failure in
                                          performance resulting directly or
                                          indirectly from acts of nature,
                                          forces, or causes beyond its
                                          reasonable control, including, without
                                          limitation, Internet failures,
                                          computer equipment failures,
                                          telecommunication equipment failures,
                                          other equipment failures, electrical
                                          power failures, strikes, labour
                                          disputes, riots, insurrections, civil
                                          disturbances, shortages of labour or
                                          materials, fires, floods, storms,
                                          explosions, acts of God, war,
                                          governmental actions, orders of
                                          domestic or foreign courts or
                                          tribunals, non-performance of third
                                          parties, or loss of or fluctuations in
                                          heat, light, or air conditioning.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          These Terms of Service will be
                                          governed by and construed in
                                          accordance with the laws of the India,
                                          without giving effect to its conflict
                                          of laws’ provisions or your actual
                                          state or country of residence. If for
                                          any reason a court of competent
                                          jurisdiction finds any provision or
                                          portion of the Terms of Service to be
                                          unenforceable, the remainder of the
                                          Terms of Service will continue in full
                                          force and effect, furthermore the
                                          intent of the author of these terms is
                                          still binding. These Terms of Service
                                          constitute the entire agreement
                                          between the parties with respect to
                                          the subject matter hereof and
                                          supersedes and replaces all prior or
                                          contemporaneous understandings or
                                          agreements, written or oral, regarding
                                          such subject matter. Any waiver of any
                                          provision of the Terms of Service will
                                          be effective only if in writing and
                                          signed by the www.forum.revnitro.com
                                          Management.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          By agreeing to these rules, you
                                          warrant that you will not post any
                                          messages that are obscene, vulgar,
                                          sexually-orientated, hateful,
                                          threatening, or otherwise violative of
                                          any laws. You remain solely
                                          responsible for the content of your
                                          messages, and you agree to indemnify
                                          and hold harmless this website
                                          www.forum.revnitro.com and its agents
                                          with respect to any claim based upon
                                          any post or content you may make. We
                                          also reserve the right to reveal
                                          whatever information we know about you
                                          in the event of a complaint or legal
                                          action arising from any message or
                                          content posted by yourself.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          By agreeing to these rules, you commit
                                          that you will not post any content
                                          that amounts to plagiarism. If you do
                                          post copyrighted content, it will only
                                          be with the explicit written
                                          permission of the original author or
                                          legal owner of the content. You will
                                          also provide the appropriate
                                          references / referral links in your
                                          message. You agree not to provide any
                                          content to www.forum.revnitro.com that
                                          (a) infringes any third-party
                                          intellectual property or publicity /
                                          privacy rights, (b) violates any
                                          applicable law or regulation, (c) is
                                          defamatory, obscene, child
                                          pornographic or harmful to minors, (d)
                                          contains any viruses, Trojan horses,
                                          automated computer scripts, worms,
                                          time bombs, e-mail bombs, cancel bots
                                          or other computer programs that are
                                          intended to damage, detrimentally
                                          interfere with, surreptitiously
                                          intercept or expropriate any system,
                                          data or personal information, or (e)
                                          is otherwise tortuous or criminal
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          By agreeing to these rules, you commit
                                          that you have read the
                                          www.forum.revnitro.com posting
                                          guidelines located at this url
                                          Guidelines URL and will adhere to them
                                          at all times on
                                          www.forum.revnitro.com.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          Please note that no email you receive
                                          from www.forum.revnitro.com goes
                                          unsolicited. When you register, you
                                          can opt to receive RevNitro mailings
                                          or not. If you ever complain about
                                          getting these emails, it will be
                                          ignored. The registration page clearly
                                          states you can deny getting mail from
                                          us. Any threat of legal action will
                                          not be taken seriously, as
                                          www.forum.revnitro.com E-mailings do
                                          not get sent to you unless you permit
                                          it.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          www.forum.revnitro.com will never
                                          divulge your email address to anyone
                                          without your consent. If you get
                                          "spam" emails from a member (this can
                                          occur if you check "Yes" for show
                                          email on the registration page, or you
                                          check “yes” to allow other members to
                                          email you via the online form) please
                                          report the incident to E-mail so that
                                          we can investigate.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          At www.forum.revnitro.com, we
                                          recognize that privacy is most
                                          important and implement
                                          industry-standard best practices to
                                          ensure that your personal information
                                          is not shared with any other
                                          organisation. When you visit
                                          www.forum.revnitro.com, we send one or
                                          more cookies (a small file containing
                                          a string of characters) to your
                                          computer that uniquely identifies your
                                          browser. These cookies are not
                                          personally-identifiable and are
                                          crucial to the functioning of features
                                          like “Remember my login” and some
                                          other website features.
                                          www.forum.revnitro.com may also use
                                          cookies to measure the performance of
                                          advertising banners, the frequency of
                                          display and clicks, as also how many
                                          clicks led to conversions. Cookies are
                                          used to improve the experience web
                                          users have when they see web
                                          advertisements and ensure that when a
                                          web user clicks on an advertisement,
                                          they are sent to the correct
                                          click-through destination. We may use
                                          Cookies to estimate the total reach of
                                          an advertising campaign or frequency
                                          of display. Cookies are also used to
                                          better target ad campaigns, control
                                          the delivery of a series of
                                          advertisements to a web browser, and
                                          to limit the number of times a web
                                          browser receives any one
                                          advertisement. Some cookies are set
                                          only when a user clicks on an ad
                                          delivered on www.forum.revnitro.com.
                                          If you wish to disable these cookies,
                                          you can set your browser to indicate
                                          when a cookie is being sent and
                                          decline the cookie. Some
                                          www.forum.revnitro.com features and
                                          services may not function properly if
                                          your cookies are disabled.
                                        </div>
                                        <div className="margtintipforumpoptip">
                                          You retain all and unlimited ownership
                                          rights to your Content. However, by
                                          submitting Content to
                                          www.forum.revnitro.com, you
                                          automatically grant to
                                          www.forum.revnitro.com an exclusive,
                                          royalty-free, perpetual, irrevocable,
                                          worldwide license (a) to use,
                                          reproduce, modify, adapt, publish,
                                          translate, create derivative works
                                          from, distribute, perform, transmit
                                          and display such Content (in whole or
                                          part) and/or to incorporate it in
                                          other works in any form, media, or
                                          technology now known or later
                                          developed for the full term of any
                                          Rights that may exist in such Content
                                          for an unlimited period of time. (b)
                                          Display your Content online and
                                          offline and permit others (including
                                          without limitation
                                          www.forum.revnitro.com's co-brand
                                          partners) to do the same, and (c)
                                          display portions of your Content
                                          online or offline and permit others to
                                          do the same. Once you submit your
                                          content to www.forum.revnitro.com, it
                                          will not be deleted even if you submit
                                          a request for the same or if your
                                          account is deleted / banned for any
                                          reason deemed fit by the
                                          www.forum.revnitro.com Administrators.
                                          The right to retain, edit, move or
                                          delete the said content remains at the
                                          sole discretion of the
                                          www.forum.revnitro.com Administration.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          www.forum.revnitro.com may take any
                                          actions that it deems necessary or
                                          appropriate to minimize its liability
                                          from your Content or to preserve
                                          www.forum.revnitro.com's relationships
                                          with its service providers (such as
                                          its Internet access providers).
                                          Indemnity: You release and indemnify
                                          www.forum.revnitro.com and/or any of
                                          its officers, staff, moderators and
                                          representatives from any cost, damage,
                                          liability or other consequence of any
                                          of the actions of the users / members
                                          of www.forum.revnitro.com and
                                          specifically waive any claims that you
                                          may have in this behalf under any
                                          applicable law. Because user
                                          authentication on the Internet is
                                          difficult, www.forum.revnitro.com
                                          cannot and does not confirm that each
                                          user is who they claim to be. Because
                                          we do not and cannot be involved in
                                          user-to-user dealings or control the
                                          behaviour of participants on
                                          www.forum.revnitro.com, in the event
                                          that you have a dispute with one or
                                          more users, you release
                                          www.forum.revnitro.com (and our
                                          management, agents, staff members and
                                          moderators) from claims, demands and
                                          damages (actual and consequential,
                                          direct and indirect) of every kind and
                                          nature, known and unknown, suspected
                                          and unsuspected, disclosed and
                                          undisclosed, arising out of or in any
                                          way connected with such disputes.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          Access Limits: Without
                                          www.forum.revnitro.com’s explicit
                                          written consent, you may not (a) use
                                          any automated means to access the site
                                          or collect any information from the
                                          site (including without limitation
                                          robots, spiders or scripts), or (b)
                                          frame the site, place pop-up windows
                                          over its pages, or otherwise affect
                                          the display of its pages. General: You
                                          shall comply with all laws and
                                          regulations applicable to your access
                                          and use of the site and your
                                          publication of your Content. If any
                                          portion of this Agreement is deemed
                                          unenforceable, that portion shall be
                                          enforced to the maximum extent
                                          possible and the remaining portions of
                                          the Agreement shall be given full
                                          effect. www.forum.revnitro.com's
                                          failure to act in a particular
                                          circumstance does not waive the
                                          ability to act with respect to that
                                          circumstance or similar circumstances.
                                          www.forum.revnitro.com shall be
                                          excused for any failure to perform to
                                          the extent that its performance is
                                          prevented by any reason outside of its
                                          control. No agency, partnership, joint
                                          venture, employment or franchise
                                          relationship is intended or created by
                                          this Agreement. www.forum.revnitro.com
                                          may change, remove, or require
                                          registration or payment to continue
                                          use of, any aspect of the site and
                                          service at any time without further
                                          notice to you
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          Entire Terms & Conditions Agreement:
                                          These Terms & Conditions (and any
                                          addenda or statements expressly
                                          incorporated into this Agreement that
                                          you enter into) constitute the entire
                                          agreement, and supersede the
                                          provisions of any other agreements or
                                          understandings (oral or written),
                                          between the parties with respect to
                                          the subject matter of such documents.
                                          In the event of any conflict between
                                          the terms of this Agreement and an
                                          addendum, the provisions of the
                                          addendum shall control. Fees and
                                          Taxes: Any expenses (such as hardware,
                                          software and Internet access costs) or
                                          taxes you incur to access the site
                                          shall be your sole responsibility.
                                        </div>

                                        <div className="margtintipforumpoptip">
                                          Governing Law and Arbitration: This
                                          Agreement is governed in all respects
                                          by the laws of Indian Law as such laws
                                          are applied to agreements entered into
                                          and to be performed entirely within
                                          India between Indian residents. Any
                                          controversy or claim arising out of or
                                          relating to this Agreement or the
                                          www.forum.revnitro.com site shall be
                                          settled by binding arbitration in
                                          accordance with the Indian Council of
                                          Arbitration’s RULES OF DOMESTIC
                                          COMMERCIAL ARBITRATION AND
                                          CONCILIATION. Any such controversy or
                                          claim shall be arbitrated on an
                                          individual basis, and shall not be
                                          consolidated in any arbitration with
                                          any claim or controversy of any other
                                          party. The arbitration shall be
                                          conducted in Chennai, Tamil Nadu,
                                          India and judgment on the arbitration
                                          award may be entered into any court
                                          having jurisdiction thereof. The award
                                          of the arbitrator shall be final and
                                          binding upon the parties without
                                          appeal or review. Notwithstanding the
                                          foregoing, www.forum.revnitro.com may
                                          seek any interim or preliminary relief
                                          from a court of competent jurisdiction
                                          in Chennai, Tamil Nadu, India.
                                          www.forum.revnitro.com at its option,
                                          may bypass arbitration in cases of
                                          fraud or other crimes against itself,
                                          interference with its technical
                                          operations or violations of its rights
                                          or property.
                                        </div>

                                        <div className="disclaimertextpopup">
                                          DISCLAIMER: ANY OPINIONS EXPRESSED BY
                                          A USER OF www.forum.revnitro.com ARE
                                          THOSE OF THE USER ALONE, AND ARE NOT
                                          TO BE ATTRIBUTED TO
                                          www.forum.revnitro.com.
                                          www.forum.revnitro.com CANNOT AND DOES
                                          NOT ASSUME RESPONSIBILITY FOR THE
                                          ACCURACY, COMPLETENESS, SAFETY,
                                          TIMELINESS, LEGALITY OR APPLICABILITY
                                          OF ANYTHING SAID OR WRITTEN.
                                          INFORMATION ABOUT PRICES AND PRODUCTS
                                          IS PROVIDED BY THIRD PARTIES. IT IS TO
                                          BE USED FOR INFORMATIONAL PURPOSE
                                          ONLY. www.forum.revnitro.com DOES NOT
                                          WARRANT THE ACCURACY OF THE
                                          INFORMATION PROVIDED BY THIRD PARTIES
                                          AND WILL NOT BE RESPONSIBLE FOR ANY
                                          ERRORS AND OMMISSIONS OR ANY LOSSES
                                          THAT ARISE BY DISPLAYING OR USING SUCH
                                          INFORMATION. BECAUSE USER
                                          AUTHENTICATION ON THE INTERNET IS
                                          DIFFICULT, www.forum.revnitro.com
                                          CANNOT AND DOES NOT CONFIRM THAT EACH
                                          USER IS WHO THEY CLAIM TO BE. BECAUSE
                                          WE DO NOT AND CANNOT BE INVOLVED IN
                                          USER-TO-USER DEALINGS OR CONTROL THE
                                          BEHAVIOR OF PARTICIPANTS ON THE
                                          www.forum.revnitro.com SITE, IN THE
                                          EVENT THAT YOU HAVE A DISPUTE WITH ONE
                                          OR MORE USERS, YOU RELEASE
                                          www.forum.revnitro.com (AND OUR AGENTS
                                          AND EMPLOYEES) FROM CLAIMS, DEMANDS
                                          AND DAMAGES (ACTUAL AND CONSEQUENTIAL,
                                          DIRECT AND INDIRECT) OF EVERY KIND AND
                                          NATURE, KNOWN AND UNKNOWN, SUSPECTED
                                          AND UNSUSPECTED, DISCLOSED AND
                                          UNDISCLOSED, ARISING OUT OF OR IN ANY
                                          WAY CONNECTED WITH SUCH DISPUTES.
                                        </div>
                                      </div>
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
