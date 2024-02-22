import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import AuthContext from "./context/authcontext";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import moment from "moment";
import API_URL from "./global";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
function PostPage() {
  const { getLoggedIn } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userIdentity, setUserIdentity] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  const [userNotifications, setUserNotifications] = useState([]);
  const [unreadUserNotifications, setUnreadUserNotifications] = useState();
  const [selectedThread, setSelectedThread] = useState(null);
  const [commenterNames, setCommenterNames] = useState([]);
  const [likedThreads, setLikedThreads] = useState([]);
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

  const div = useRef(null);
  const divtop = useRef(null);
  useEffect(() => {
    //console.log(window.location.hash);
    if (window.location.hash === "#bottom" && div.current) {
      div.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [div.current]);

  const fetchThread = useCallback(async () => {
    try {
      const response = await axios.post(`${API_URL}/threads/${threadId}`, {
        crossDomain: true,
        withCredentials: true,
      });
      setThread(response.data);
      setShowComments(response.data.comments);
      await axios.post(`${API_URL}/threads/${threadId}/views`, {
        crossDomain: true,
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
    }
  }, [threadId]);

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchThread();
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [fetchThread, threadId]);

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
    const handleClickOutside = (event) => {
      const commentInput = document.getElementById("commentInput");

      if (commentInput && !commentInput.contains(event.target)) {
        setCommenterNames([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleTotalCommentsVisibility = (threadId) => {
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [threadId]: !prevShowComments[threadId],
    }));
  };

  const toggleCommentsVisibility = (threadId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [threadId]: !prevState[threadId],
    }));
  };
  const hideTotalCommentsVisibility = (threadId) => {
    setShowComments("");
  };
  const isAuthor = () => {
    // Check if the current user is the author of the thread
    return userIdentity === thread.authorIdentity;
  };
  const shareOther = (thread) => {
    navigator.share({
      title: thread.title,
      text: thread.title,
      url: `${window.location.origin}/${thread._id}`,
    });
    closeShareModal();
  };
  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  const handleLike = async (threadId) => {
    try {
      const response = await axios.post(
        `${API_URL}/threads/${threadId}/like`,
        {
          userId: userId,
        },
        { crossDomain: true, withCredentials: true }
      );

      if (response && response.data) {
        setThread((prevThread) => ({
          ...prevThread,
          likes: response.data.likes,
          likedBy: response.data.likedBy,
        }));

        if (likedThreads.includes(threadId)) {
          setLikedThreads(likedThreads.filter((id) => id !== threadId));
        } else {
          setLikedThreads([...likedThreads, threadId]);
        }
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error(
        "Error handling like:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleDeleteThread = () => {
    const sendData = { isAdmin: isAdmin, userName: userName };

    // Confirm deletion with the user
    const confirmed = window.confirm(
      "Are you sure you want to delete this thread?"
    );

    if (!confirmed) {
      // User canceled the deletion
      return;
    }

    axios
      .delete(
        `${API_URL}/threads/${thread._id}`,
        {
          data: sendData,
        },
        { crossDomain: true, withCredentials: true }
      )
      .then((response) => {
        // Assuming you have a function to redirect or handle deletion success
        handleDeletionSuccess(response.data);
      })
      .catch((error) => {
        console.error("Error deleting thread:", error);
        // Handle deletion error, show a notification, or redirect to an error page
      });
  };

  const handleEditThread = () => {
    // navigate to the edit thread page with the thread ID
    navigate(`/edit/${thread._id}`);
  };
  const closeShareModal = () => {
    setSelectedThread(null);
    setShareModalVisible(false);
  };
  const handleDeletionSuccess = () => {
    navigate(`/`);
  };

  const handleShare = (thread) => {
    if (selectedThread && selectedThread._id === thread._id) {
      // Clicking the share button again to hide the share modal
      closeShareModal();
    } else {
      // Clicking the share button to show the share modal
      setSelectedThread(thread);
      setShareModalVisible(true);
    }
  };
  const fetchCommenterNames = async (threadId) => {
    try {
      const response = await axios.get(
        `${API_URL}/threads/${threadId}/commenters`,
        { crossDomain: true, withCredentials: true }
      );
      // Extract commenter names from the response and update state
      setCommenterNames(response.data);
    } catch (error) {
      console.error("Error fetching commenter names:", error);
    }
  };
  const handleNameSelection = (selectedName) => {
    // Get the current comment text and thread ID
    const currentThreadId = Object.keys(newComments)[0];
    const currentCommentText = newComments[currentThreadId]?.text || "";

    // Find the index of "@" in the comment text
    const atIndex = currentCommentText.indexOf("@");

    // Extract the text before "@" and concatenate the selected name
    const updatedCommentText =
      currentCommentText.substring(0, atIndex) +
      "#" +
      selectedName +
      currentCommentText.substring(atIndex + selectedName.length + 1);

    // Update the newComments state with the modified comment text
    setNewComments((prevComments) => ({
      ...prevComments,
      [currentThreadId]: { text: updatedCommentText },
    }));

    // Clear the commenter names suggestions
    setCommenterNames([]);
  };
  const handleComment = async (threadId) => {
    if (!userId) {
      // If not logged in, navigate to the login page
      showNotification("Login to comment");
      navigate("/LoginPage");
      return;
    }

    const commentText = newComments[threadId]?.text.trim();
    if (!commentText) {
      //showNotification("Comment text cannot be empty.");
      alert("Comment text cannot be empty.");
      return;
    }

    // Check if "@" is present in the comment text
    if (commentText.includes("#")) {
      // Extract the text after "@" to find the commenter name
      const commenterName = commentText.split("#")[1].split(" ")[0];
      // Update the state with the commenter name
      setCommenterNames([commenterName]);
    }
    const commentData = {
      text: newComments[threadId]?.text.trim(),
      userId,
      mentionedUserIdentities: getMentionedUserIdentities(
        newComments[threadId]?.text
      ),
    };

    await axios
      .post(`${API_URL}/threads/${threadId}/comments`, commentData, {
        crossDomain: true,
        withCredentials: true,
      })
      .then((response) => {
        setThread(response.data);
        setVisibleComments((prevVisibleComments) => ({
          ...prevVisibleComments,
          [threadId]: true,
        }));
      })
      .catch((error) => console.error(error));
    // Clear the comment input and commenter names after submitting
    await showDiv(threadId);

    await setNewComments((prevComments) => ({
      ...prevComments,
      [threadId]: { text: "" },
    }));
    await setCommenterNames([]);
    fetchThread();
    if (div.current) {
      div.current.scrollIntoView({ behavior: "smooth", block: "end" });
      //
    }
    //window.location.reload();
  };

  const getMentionedUserIdentities = (text) => {
    const mentions = text.match(/#([a-zA-Z0-9_]+)/g) || [];
    return mentions.map((mention) => mention.slice(1)); // remove "@" symbol
  };
  const renderThreadTitle = (thread) => {
    return (
      <>
        <Link to={`/threads/${thread._id}`}>
          <h3>{thread.highlightedTitle || thread.title}</h3>
        </Link>
        <h6>
          by
          <img
            src={thread.authorProfilePic}
            alt={`${thread.author}'s ProfilePic`}
            style={{
              backgroundColor: "cyan",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
            }}
          />{" "}
          <u>{thread.author}</u> <u>@{thread.authorIdentity}</u>
          {thread.authorIsAdmin && <>♛</>}- {moment(thread.createdAt).fromNow()}
        </h6>
        <br />
        <br />#{thread.heading}_forum
        <br />
      </>
    );
  };
  const handleDeleteComment = async (threadId, commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmDelete) {
      // If the user cancels the delete operation, do nothing
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/threads/${threadId}/comments/${commentId}`,
        { isAdmin: isAdmin },
        { crossDomain: true, withCredentials: true }
      );

      // After successful deletion, update the comments in state
      setThread((prevThread) => ({
        ...prevThread,
        comments: prevThread.comments.filter(
          (comment) => comment._id !== commentId
        ),
      }));
      showDiv(thread._id);
      showNotification("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showNotification("Failed to delete comment. Please try again.");
    }
  };

  if (!thread) {
    return <div>Loading...</div>;
  }
  const toggleNav = () => {
    setIsActive(!isActive);
  };
  function notificationclickfunction() {
    var notificationnumberofmessage = document.getElementsByClassName(
      "notificationnumberofmessage"
    );
    notificationnumberofmessage[0].style.display = "none";
    notificationnumberofmessage[1].style.display = "none";
  }

  function likebuttonclick() {
    document.getElementById("heartcoulour").style.color = "#F44336";
  }
  function showHideDiv(ele) {
    var srcElement = document.getElementById(ele);
    if (srcElement != null) {
      if (srcElement.style.display === "block") {
        srcElement.style.display = "none";
      } else {
        srcElement.style.display = "block";
      }
      return false;
    }
  }
  function showDiv(ele) {
    var srcElement = document.getElementById(ele);
    srcElement.style.display = "block";
  }
  function HideDiv(ele) {
    var srcElement = document.getElementById(ele);
    srcElement.style.display = "none";
  }
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
      <div ref={divtop} id="#Top"></div>
      {/* <!---------------------Welcome to Revnitro-------------------------------------> */}
      <div className="welcometorevnitro">
        <h1>Welcome to Revnitro Forum</h1>
      </div>
      {/* <!---------------------Welcome to Revnitro-------------------------------------> */}
      <div className="postpageflexconcept">
        <div className="postpagewidth">
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
            </div>
          </div>
          {/* <!--------------------- input and filters-------------------------------------> */}
          <div style={{ marginTop: "10px" }}>
            <div className="mobileshowndesktophide">
              <div id="nav-container" className={isActive ? "is-active" : ""}>
                <div
                  id="nav-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleNav();
                  }}
                ></div>
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
                        <h3 className="mobilevrersionnamesize">{userName}</h3>
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
                          <img src="./images/mdi_home.webp" alt="hometext" />
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
          </div>
          {/* <!--------------------- flex post content-------------------------------------> */}

          <div>
            <div className="postmapfunctionarea">
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
                      onClick={(e) => {
                        e.preventDefault();
                        handleProfileUpdate();
                      }}
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
                {/* <!-----------------------------Map Function---------------------------> */}
                <div>
                  {/* <!----------------Post Details div-----------------> */}
                  <div className="posterss">
                    <div className="personposted">
                      <div className="uploadname">
                        <div>
                          <img src={thread.authorProfilePic} alt="" />
                        </div>
                        <div>
                          <div className="uploadpersonname">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div>{thread.author}</div>
                              <div>
                                {thread.authorIsAdmin && (
                                  <img
                                    src="./images/RevnitroTick.png"
                                    style={{
                                      borderRadius: "50%",
                                      width: "35px",
                                      height: "36px",
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="uernamepost">
                            @{thread.authorIdentity}
                          </div>
                        </div>
                      </div>
                      <div className="postedtime">
                        <div className="postpagedeleteandedit">
                          {isAuthor() && (
                            <div
                              className="postpageseditsectiondivimage"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEditThread();
                              }}
                            >
                              <img
                                src="./images/material-symbols_edit.png"
                                alt=""
                              />
                            </div>
                          )}

                          {(isAuthor() || isAdmin) && (
                            <div
                              className="postpagedeletesectiondivimage"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteThread();
                              }}
                            >
                              <img
                                src="./images/mingcute_delete-2-line.png"
                                alt=""
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="postpagaediv">
                      <p>{thread.title}</p>
                    </div>
                    {thread.thumbnail && (
                      <div className="postimage">
                        <img src={thread.thumbnail} alt="" />
                      </div>
                    )}
                    <div className="postcontent" id="PostPageTextEditorImg">
                      <div
                        dangerouslySetInnerHTML={{ __html: thread.content }}
                      />
                    </div>

                    <div className="hastagtext" style={{ marginTop: "10px" }}>
                      #{thread.heading} Forum
                    </div>
                    <div className="reactionbuttons">
                      <div
                        className="likeflex"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(thread._id);
                        }}
                      >
                        <div>
                          <i
                            className="fa fa-heart"
                            style={{
                              color: thread.likedBy.includes(userId)
                                ? "#F44336"
                                : "#cdcdcd",
                            }}
                          ></i>
                        </div>
                        <div className="sharefonts">{thread.likes}</div>
                        <div className="sharefonts">Likes</div>
                      </div>
                      <div
                        className="commentsflex"
                        value="Show/Hide"
                        onClick={(e) => {
                          e.preventDefault();
                          showHideDiv(thread._id);
                          //toggleCommentsVisibility();
                          closeShareModal();
                        }}
                      >
                        <div>
                          <img
                            src="./images/icon-park-outline_comments.webp"
                            alt=""
                          />
                        </div>
                        <div className="sharefonts">
                          {thread.comments.length}
                        </div>
                        <div className="sharefonts">Comments</div>
                      </div>
                      <div className="shareflex">
                        <div>
                          <img src="./images/ri_share-line.webp" alt="" />
                        </div>
                        <div
                          className="sharefonts"
                          onClick={(e) => {
                            e.preventDefault();
                            handleShare(thread);
                            HideDiv(thread._id);
                            //hideTotalCommentsVisibility(thread._id);
                          }}
                        >
                          Share
                        </div>
                      </div>
                    </div>
                    <div className="linebottom"></div>
                    <div className="cinputflex">
                      <div className="poatspagecommentsectionimage">
                        <img
                          src={
                            userProfilePic ||
                            "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
                          }
                          alt=""
                        />
                      </div>
                      <div>
                        <form action="" className="commentbox">
                          <div>
                            <input
                              type="text"
                              placeholder="Add a comment"
                              value={newComments[thread._id]?.text || ""}
                              onChange={(e) => {
                                setNewComments((prevComments) => ({
                                  ...prevComments,
                                  [thread._id]: { text: e.target.value },
                                }));

                                // Check if "@" is typed and trigger fetching of commenter names
                                if (e.target.value.includes("@")) {
                                  fetchCommenterNames(thread._id);
                                } else {
                                  setCommenterNames([]);
                                }
                              }}
                            />
                          </div>
                          <button
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              handleComment(thread._id);
                            }}
                          >
                            <img
                              className="commentsendbutton"
                              src="./images/iconamoon_send-bold.png"
                              alt=""
                            />
                          </button>
                        </form>
                      </div>
                    </div>
                    {commenterNames.length > 0 && (
                      <div className="MentioningCommentsdiv">
                        {commenterNames.map((commenter) => (
                          <div
                            className="mentioncommentsflexdicvs"
                            key={commenter.userIdentity} // Assuming userIdentity is unique
                            onClick={(e) => {
                              e.preventDefault();
                              handleNameSelection(commenter.userIdentity);
                            }}
                          >
                            <img
                              className="imageofthyementionedpersion"
                              src={commenter.userPic}
                              alt=""
                              style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                            <span className="mentionedcommentionpersonname">
                              {commenter.userIdentity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {shareModalVisible && (
                    <div className="commentshowsection">
                      <div className="maincommentformainsharedivs">
                        <div
                          className={`share-modal ${
                            shareModalVisible ? "visible" : ""
                          }`}
                        >
                          <div className="shareoptionsflexdicvv">
                            <div>
                              <h3>Share '{selectedThread.title}'</h3>
                            </div>
                            <div onClick={closeShareModal}>
                              <img
                                src="./images/shareCloseButtonImage.png"
                                alt=""
                                style={{
                                  backgroundColor: "white",
                                  width: "29px",
                                  height: "29px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>

                          <FacebookShareButton
                            style={{ marginRight: "7px" }}
                            url={`${
                              window.location.origin
                            }/${encodeURIComponent(thread._id)}`}
                          >
                            <FacebookIcon size={32} round />
                          </FacebookShareButton>
                          <TwitterShareButton
                            style={{ marginRight: "7px" }}
                            url={`${window.location.origin}/${thread._id}`}
                            title={thread.title}
                          >
                            <XIcon size={32} round />
                          </TwitterShareButton>

                          <WhatsappShareButton
                            style={{ marginRight: "7px" }}
                            url={`${window.location.origin}/${thread._id}`}
                            title={thread.title}
                          >
                            <WhatsappIcon size={32} round />
                          </WhatsappShareButton>

                          <RedditShareButton
                            style={{ marginRight: "7px" }}
                            url={`${window.location.origin}/${thread._id}`}
                            title={thread.title}
                          >
                            <RedditIcon size={32} round />
                          </RedditShareButton>

                          <TelegramShareButton
                            style={{ marginRight: "7px" }}
                            url={`${window.location.origin}/${thread._id}`}
                            title={thread.title}
                          >
                            <TelegramIcon size={32} round />
                          </TelegramShareButton>

                          <EmailShareButton
                            style={{ marginRight: "7px" }}
                            url={`${window.location.origin}/${thread._id}`}
                            subject={thread.title}
                            body={`Check out this thread:\n${thread._id}`}
                          >
                            {/* <EmailIcon size={32} round /> */}
                            <img
                              src="./images/MailShareIcons.png"
                              style={{ width: "32px" }}
                            />
                          </EmailShareButton>

                          <span onClick={() => shareOther(thread)}>
                            <img
                              src="./images/shareForMOBILESfILES.png"
                              alt=""
                              style={{
                                backgroundColor: "white",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                objectFit: "cover",
                              }}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <!----------------Post Details div----------------->
                
                
                <!----------------comments div-----------------> */}
                  <div
                    className="commentshowsection"
                    id={thread._id}
                    style={{ display: "block" }}
                  >
                    <div className="noofcomments">
                      {thread.comments.length} Comments
                    </div>

                    {showComments.length > 0 && (
                      <div>
                        {thread.comments.map((comment) => (
                          <div className="commentingarea" key={comment._id}>
                            <div className="maincomment">
                              <div>
                                <div className="imageuserforum">
                                  <div>
                                    <img
                                      src={comment.commenterProfilePic}
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <div className="forumcommentuser">
                                      {comment.commenterName}
                                    </div>
                                    <div className="forumusernameres">
                                      {comment.commenterIdentity}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="commentingtime">
                                {moment(comment.createdAt).fromNow()}
                              </div>
                            </div>
                            <div className="usercomment">{comment.text}</div>
                            {(userIdentity === comment.commenterIdentity ||
                              isAdmin) && (
                              <div>
                                <div className="DeleteCommentImage">
                                  <img
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeleteComment(
                                        thread._id,
                                        comment._id
                                      );
                                    }}
                                    src="./images/commentDeleteImage.png"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* <!----------------comments div-----------------> */}
                </div>
                <div ref={div} id="#bottom"></div>
                {/* <!-----------------------------Map Function---------------------------> */}
              </div>
            </div>
          </div>
          {/* <!--------------------- flex post content-------------------------------------> */}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
