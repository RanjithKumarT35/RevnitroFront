import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import "../App.css";
import AuthContext from "./context/authcontext";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import API_URL from "./global";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
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
function Home() {
  const { heading } = useParams();
  const { getLoggedIn } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);

  //const [currentPage, setCurrentPage] = useState(1);
  const [visibleComments, setVisibleComments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentThreadId, setCurrentThreadId] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [selectedHeading, setSelectedHeading] = useState(heading || "All");
  const [sortOption, setSortOption] = useState("newest");
  const [notification, setNotification] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userIdentity, setUserIdentity] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  //const [selectedFile, setSelectedFile] = useState(null);
  const [likedThreads, setLikedThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [commenterNames, setCommenterNames] = useState([]);
  //const [userThreads] = useState("");
  const [userNotifications, setUserNotifications] = useState([]);
  const [unreadUserNotifications, setUnreadUserNotifications] = useState();
  const Navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const toggleNav = () => {
    setIsActive(!isActive);
  };
  function functioncommentshow() {
    var commentshidee = document.getElementById(commentshidee);
    commentshidee.style.display = "none";
  }
  function showHideDiv(ele) {
    var srcElement = document.getElementById(ele);
    if (srcElement != null) {
      if (srcElement.style.display === "block") {
        srcElement.style.display = "none";
      } else {
        srcElement.style.display = "block";
      }
      //return false;
    }
  }
  function HideDiv(ele) {
    var srcElement = document.getElementById(ele);
    srcElement.style.display = "none";
  }
  function notificationclickfunction() {
    var notificationnumberofmessage = document.getElementsByClassName(
      "notificationnumberofmessage"
    );
    notificationnumberofmessage[0].style.display = "none";
    notificationnumberofmessage[1].style.display = "none";
  }
  function likebuttonclick(liked, threadId) {
    if (!liked) {
      document.getElementById(threadId).style.color = "#F44336";
    } else {
      document.getElementById(threadId).style.color = "initial";
    }
  }
  async function logout() {
    await axios.get(`${API_URL}/auth/logout`, {
      crossDomain: true,
      withCredentials: true,
    });
    await getLoggedIn();
    Navigate("/LoginPage");
  }
  const fetchThreads = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&heading=${selectedHeading}`,
        { crossDomain: true, withCredentials: true }
      );
      setThreads(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [sortOption, currentSearchTerm, selectedHeading]);
  const getName = useCallback(async () => {
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
        setUserProfilePic(
          "https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png"
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  const [headings, setHeadings] = useState();

  useEffect(() => {
    fetchHeadings();
  }, []);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get(`${API_URL}/heading`, {
        crossDomain: true,
        withCredentials: true,
      });
      const data = await response.data;

      if (data) {
        setHeadings(data);
      } else {
        console.error("Failed to fetch headings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching headings:", error.message);
    }
  };
  useEffect(() => {
    if (heading) {
      setSelectedHeading(heading);
    } else {
      setSelectedHeading("All");
    }
  }, [heading]);
  useEffect(() => {
    // if (heading) {
    //   //console.log(heading);
    //   setSelectedHeading(heading);
    // } else {
    //   setSelectedHeading("All");
    // }
    async function fetchData() {
      try {
        await fetchThreads();
      } catch (error) {
        console.error("Error fetching headings:", error);
      }
    }
    fetchData();
    getName();
  }, [
    sortOption,
    heading,
    currentSearchTerm,
    selectedHeading,
    fetchThreads,
    getName,
  ]);
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
  const fetchCommenterNames = async (threadId) => {
    try {
      const response = await axios.get(
        `${API_URL}/threads/${threadId}/commenters`,
        { crossDomain: true, withCredentials: true }
      );
      // Extract commenter names from the response and update state
      const commenters = response.data;
      // Extract commenter names and profile pics from the array
      const commenterInfo = commenters.map((commenter) => ({
        userIdentity: commenter.userIdentity,
        userPic: commenter.userPic,
      }));
      //console.log(response.data);
      setCommenterNames(commenterInfo);
    } catch (error) {
      console.error("Error fetching commenter names:", error);
    }
  };
  const handleHeadingChange = (e) => {
    const selectedHeading = e.target.value;
    setSelectedHeading((prevHeading) => {
      if (prevHeading !== selectedHeading) {
        //setCurrentPage(1);
        return selectedHeading;
      }
      return prevHeading;
    });
  };
  const resetThreads = async () => {
    try {
      // If the current filter is "My Threads," reset to all threads
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&heading=${selectedHeading}`,
        { crossDomain: true, withCredentials: true }
      );
      setThreads(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchUserThreads = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&userThread=${userIdentity}`,
        { crossDomain: true, withCredentials: true }
      );
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching user threads:", error);
    }
  };
  const handleRevnitro = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/threads?&sort=${sortOption}&search=${currentSearchTerm}&userThread=admin`,
        { crossDomain: true, withCredentials: true }
      );
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching user threads:", error);
    }
  };
  const handleSearch = (e) => {
    const searchTermValue = e.target.value;
    setSearchTerm(searchTermValue);
    axios
      .get(`${API_URL}/threads?sort=${sortOption}&search=${searchTermValue}`, {
        crossDomain: true,
        withCredentials: true,
      })
      .then((response) => {
        setThreads(response.data);
        setCurrentSearchTerm(searchTermValue);
      })
      .catch((error) => console.error(error));
  };
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentSearchTerm("");
    fetchThreads(); // Fetch all threads without the search term
  };
  const closeShareModal = () => {
    setSelectedThread(null);
    setShareModalVisible(false);
  };
  const toggleTotalCommentsVisibility = (threadId) => {
    closeShareModal();
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [threadId]: !prevShowComments[threadId],
    }));
  };
  const hideTotalCommentsVisibility = (threadId) => {
    setShowComments("");
  };
  const toggleCommentsVisibility = (threadId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [threadId]: !prevState[threadId],
    }));
  };
  const handleSortChange = (option) => {
    setSortOption(option);
    //setCurrentPage(1);
    fetchThreads();
  };
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  const handleLike = async (threadId) => {
    try {
      if (!userId) {
        Navigate("/LoginPage");
        return;
      }
      const response = await axios.post(
        `${API_URL}/threads/${threadId}/like`,
        {
          userId: userId,
        },
        { crossDomain: true, withCredentials: true }
      );
      setThreads(
        threads.map((thread) =>
          thread._id === threadId
            ? {
                ...thread,
                likes: response.data.likes,
                likedBy: response.data.likedBy,
              }
            : thread
        )
      );
      if (likedThreads.includes(threadId)) {
        setLikedThreads(likedThreads.filter((id) => id !== threadId));
      } else {
        setLikedThreads([...likedThreads, threadId]);
      }
    } catch (error) {
      console.error("Error handling like:", error.response.data);
    }
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
  const shareOther = (thread) => {
    navigator.share({
      title: thread.title,
      text: "Checkout This Thread : " + thread.title,
      url: `"\nclick this link : " +${window.location.origin}/${thread._id}`,
    });
    closeShareModal();
  };
  function formatNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number.toString();
    }
  }
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
        views:{thread.views}
        <br />#{thread.heading}_forum
        <br />
      </>
    );
  };
  const renderThreadContent = (thread) => {
    const maxContentLength = 300; // Set your preferred character limit

    // Use highlightedContent directly if available
    if (thread.highlightedContent) {
      return (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: thread.highlightedContent }}
          />
        </>
      );
    } else {
      // Display the first part of the content and include "Read More" link
      return (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: thread.content.substring(0, maxContentLength),
            }}
          />
        </>
      );
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
  const handleProfilePicUpload = async (file) => {
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("sampleFile", file);

    try {
      // Upload the image
      const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        { crossDomain: true, withCredentials: true }
      );

      // Update the user's profile picture URL
      const newProfilePic = response.data.link;
      setUserProfilePic(newProfilePic);

      // Update the profile picture in the backend
      const sendData = {
        profilePic: newProfilePic,
        userId: userId,
      };

      await axios.put(`${API_URL}/auth/updateProfile`, sendData, {
        crossDomain: true,
        withCredentials: true,
      });

      // Display a success message
      alert("Profile Picture Uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Profile Picture Upload Failed. Please try again.");
    }
  };

  const handleComment = async (threadId) => {
    if (!userId) {
      // If not logged in, navigate to the login page
      showNotification("Login to comment");
      Navigate("/LoginPage");
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
        if (response) {
          Navigate(`/${threadId}#bottom`);
        }
        // setThreads(
        //   threads.map((thread) =>
        //     thread._id === threadId ? response.data : thread
        //   )
        // );

        // setVisibleComments((prevVisibleComments) => ({
        //   ...prevVisibleComments,
        //   [threadId]: true,
        // }));
      })
      .catch((error) => console.error(error));
    // Clear the comment input and commenter names after submitting

    // setNewComments((prevComments) => ({
    //   ...prevComments,
    //   [threadId]: { text: "" },
    // }));
    // console.log("its been set");
    // setCommenterNames([]);
    // Navigate(`/LoginPage`);
    // //Navigate(`/${threadId}`);
    // console.log("completed");
  };
  const getMentionedUserIdentities = (text) => {
    const mentions = text.match(/#([a-zA-Z0-9_]+)/g) || [];
    return mentions.map((mention) => mention.slice(1)); // remove "@" symbol
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
      setThreads(
        threads.map((thread) => {
          if (thread._id === threadId) {
            return {
              ...thread,
              comments: thread.comments.filter(
                (comment) => comment._id !== commentId
              ),
            };
          }
          return thread;
        })
      );

      showNotification("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showNotification("Failed to delete comment. Please try again.");
    }
  };
  const handleProfileUpdate = async () => {
    Navigate("/Myprofile");
  };
  const handleLogin = async () => {
    Navigate("/LoginPage");
  };
  const handleHome = async () => {
    Navigate("/");
  };
  const handleCreatePost = async () => {
    Navigate("/CreatePost");
  };
  const handleForumPage = async () => {
    Navigate("/forumlist");
  };
  const NavigateToNotification = async () => {
    Navigate("/Notification");
  };
  const NavigateToPost = async (threadId) => {
    Navigate(`/${threadId}`);
  };
  return (
    <div>
      <div className="welcometorevnitro">
        <h1>Welcome to Revnitro Forum</h1>
      </div>
      <div className="indexpagemediaqueryflex">
        <div className="mediaqueryindex">
          {/* <!---------------------Welcome to Revnitro------------------------------------->

        <!---------------------Welcome to Revnitro------------------------------------->

        <!--------------------- Revnitro Topics-------------------------------------> */}
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
                  <input
                    type="text"
                    placeholder="Search Threads"
                    value={searchTerm}
                    onChange={(e) => {
                      handleSearch(e);
                    }}
                  />
                  <button className="searchbuttons">
                    <img src="./images/Vector50.webp" alt="" />
                  </button>
                </form>
              </div>
              <div className="createpostdivwithnavigationflex">
                <div className="mobileelastestbuttonflexoption">
                  <div className="indexpagemobilehide">
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
                                  <img
                                    src="./images/profileUpdate.png"
                                    alt=""
                                  />
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
                              onClick={(e) => {
                                e.preventDefault();
                                resetThreads();
                                toggleNav();
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
                                <div
                                  className="navigatelinksmobile"
                                  onClick={() => {
                                    fetchUserThreads();
                                    toggleNav();
                                  }}
                                >
                                  <div>
                                    <img
                                      src="./images/iconamoon_news-fill.webp"
                                      alt="hometext"
                                    />
                                  </div>
                                  <div className="navigatenamesmobile">
                                    My Post
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
                            <div
                              className="navigatelinksmobile"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRevnitro();
                                toggleNav();
                              }}
                            >
                              <div>
                                <img
                                  src="./images/Frame9.webp"
                                  alt="hometext"
                                />
                              </div>
                              <div className="navigatenamesmobile">
                                Revnitro Team
                              </div>
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
                                <div className="navigatenamesmobile">
                                  Log in
                                </div>
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
                                <div className="navigatenamesmobile">
                                  Log Out
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </nav>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="favcity">
                      <select
                        id="favcity"
                        name="select"
                        value={selectedHeading}
                        onChange={handleHeadingChange}
                      >
                        <option value="All">All</option>
                        {headings &&
                          headings.map((heading) => (
                            <option
                              key={heading._id}
                              value={heading.headingName}
                            >
                              {heading.headingName}
                            </option>
                          ))}
                        <option value="RevNitro">RevNitro</option>
                      </select>
                    </label>
                  </div>
                  <div className="sortbuttondesktophide">
                    <div className="sec-center">
                      <input
                        className="dropdown"
                        type="checkbox"
                        id="dropdown"
                        name="dropdown"
                      />
                      <label className="for-dropdown" htmlFor="dropdown">
                        Sort
                      </label>
                      <div className="section-dropdown">
                        <a href="#">Dropdown Link</a>
                        <input
                          className="dropdown-sub"
                          type="checkbox"
                          id="dropdown-sub"
                          name="dropdown-sub"
                        />
                      </div>
                      <div className="section-dropdown">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            handleSortChange("newest");
                            if (sortOption === "newest" ? "active" : "") {
                            }
                          }}
                        >
                          Latest
                        </a>
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            handleSortChange("oldest");

                            if (sortOption === "oldest" ? "active" : "") {
                            }
                          }}
                        >
                          Older
                        </a>
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            handleSortChange("mostViews");
                            if (sortOption === "mostViewed" ? "active" : "") {
                            }
                          }}
                        >
                          Most Viewed
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  className="latestfilterbutton"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSortChange("newest");
                    if (sortOption === "newest" ? "active" : "") {
                    }
                  }}
                >
                  Latest
                </button>
              </div>
              <div>
                <button
                  className="latestfilterbutton"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSortChange("oldest");

                    if (sortOption === "oldest" ? "active" : "") {
                    }
                  }}
                >
                  Older
                </button>
              </div>
              <div>
                <button
                  className="latestfilterbutton1"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSortChange("mostViews");
                    if (sortOption === "mostViewed" ? "active" : "") {
                    }
                  }}
                >
                  Most Viewed
                </button>
              </div>
            </div>
          </div>
          {/* <!--------------------- input and filters------------------------------------->

        <!--------------------- flex post content-------------------------------------> */}
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
                      resetThreads();
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
                      <div
                        className="navigatelinks"
                        onClick={(e) => {
                          e.preventDefault();
                          fetchUserThreads();
                          toggleNav();
                        }}
                      >
                        <div>
                          <img
                            src="./images/iconamoon_news-fill.webp"
                            alt="hometext"
                          />
                        </div>
                        <div className="navigatenames">My Post</div>
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
                  <div
                    className="navigatelinks"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRevnitro();
                    }}
                  >
                    <div>
                      <img src="./images/Frame9.webp" alt="hometext" />
                    </div>
                    <div className="navigatenames">Revnitro Team</div>
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
                <div className="newScrollVisibleee">
                  {/* <!-----------------------------Map Function---------------------------> */}
                  {threads.map((thread) => (
                    <div key={thread._id} className="thread">
                      <div className="mainPosterssdivvs">
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
                              👁️‍🗨️ {formatNumber(thread.views)}{" "}
                              <strong> | </strong>
                              {moment(thread.createdAt).fromNow()}
                            </div>
                          </div>
                          <div>
                            <div
                              className="postpagaediv"
                              onClick={(e) => {
                                e.preventDefault();
                                NavigateToPost(thread._id);
                              }}
                            >
                              <p>{thread.title}</p>
                            </div>
                            <div
                              className="postimage"
                              onClick={(e) => {
                                e.preventDefault();
                                NavigateToPost(thread._id);
                              }}
                            >
                              {thread.thumbnail && (
                                <img src={thread.thumbnail} alt="" />
                              )}
                            </div>
                            <div className="postcontent">
                              {thread.highlightedContent}
                            </div>
                            <div className="hastagtext">
                              #{thread.heading} Forum
                            </div>
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
                            {/* <div className="likeflex">
                            <div>
                              <i
                                className="fa fa-heart"
                                id={thread._id}
                                onClick={() => {
                                  handleLike(thread._id);
                                  const liked = thread.likedBy.includes(userId);
                                  if (!liked) {
                                    document.getElementById(
                                      thread._id
                                    ).style.color = "#F44336";
                                  } else {
                                    document.getElementById(
                                      thread._id
                                    ).style.color = "initial";
                                  }
                                  //likebuttonclick(liked, thread._id);
                                }}
                              ></i>
                            </div>
                            <div className="sharefonts">{thread.likes}</div>
                            <div className="sharefonts">Likes</div>
                          </div> */}

                            <div
                              className="commentsflex"
                              value="Show/Hide"
                              onClick={(e) => {
                                e.preventDefault();
                                showHideDiv(thread._id);
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
                            <div
                              className="shareflex"
                              onClick={(e) => {
                                e.preventDefault();
                                handleShare(thread);
                                showHideDiv(thread._id);
                                hideTotalCommentsVisibility(thread._id);
                              }}
                            >
                              <div>
                                <img src="./images/ri_share-line.webp" alt="" />
                              </div>
                              <div className="sharefonts">Share</div>
                            </div>
                          </div>

                          <div className="linebottom"></div>

                          <div className="cinputflex">
                            <div className="lastcommentpicc">
                              <img src={userProfilePic} alt="" />
                            </div>
                            <div>
                              <form
                                action=""
                                className="commentbox"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleComment(thread._id);
                                }}
                              >
                                <div>
                                  <input
                                    type="text"
                                    // id={thread._id}
                                    placeholder="Add a comment"
                                    value={newComments[thread._id]?.text || ""}
                                    onChange={(e) => {
                                      setNewComments((prevComments) => ({
                                        ...prevComments,
                                        [thread._id]: { text: e.target.value },
                                      }));

                                      // Check if "@" is typed and trigger fetching of commenter names
                                      if (e.target.value.includes("@")) {
                                        setCurrentThreadId(thread._id);
                                        fetchCommenterNames(thread._id);
                                      } else {
                                        setCurrentThreadId("");
                                        setCommenterNames("");
                                      }
                                    }}
                                  />
                                  {/* {commenterNames.length > 0 && (
                                  <div>
                                    {commenterNames.map((name) => (
                                      <div
                                        key={name}
                                        onClick={() =>
                                          handleNameSelection(name)
                                        }
                                      >
                                        {name.userProfilePic}
                                      </div>
                                    ))}
                                  </div>
                                )} */}
                                </div>
                                <button
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
                          {thread._id === currentThreadId &&
                            commenterNames.length > 0 && (
                              <div
                                className="MentioningCommentsdiv"
                                id={thread._id}
                              >
                                {commenterNames.map((commenter) => (
                                  <div
                                    className="mentioncommentsflexdicvs"
                                    key={commenter.userIdentity} // Assuming userIdentity is unique
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleNameSelection(
                                        commenter.userIdentity
                                      );
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

                        {/* <!----------------Post Details div-----------------> */}
                        {selectedThread &&
                          selectedThread._id === thread._id && (
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
                                    url={
                                      "\nclick this link : " +
                                      `${
                                        window.location.origin
                                      }/${encodeURIComponent(thread._id)}`
                                    }
                                  >
                                    <FacebookIcon size={32} round />
                                  </FacebookShareButton>
                                  <TwitterShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    title={thread.title}
                                  >
                                    <XIcon size={32} round />
                                  </TwitterShareButton>

                                  <WhatsappShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    title={thread.title}
                                  >
                                    <WhatsappIcon size={32} round />
                                  </WhatsappShareButton>

                                  <RedditShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    title={thread.title}
                                  >
                                    <RedditIcon size={32} round />
                                  </RedditShareButton>

                                  <TelegramShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    title={thread.title}
                                  >
                                    <TelegramIcon size={32} round />
                                  </TelegramShareButton>

                                  <EmailShareButton
                                    style={{ marginRight: "7px" }}
                                    url={
                                      "\nclick this link : " +
                                      `${window.location.origin}/${thread._id}`
                                    }
                                    subject={
                                      "Checkout This Thread : " + thread.title
                                    }
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
                        {/* <!----------------comments div-----------------> */}

                        {thread.comments.length > 0 ? (
                          <div
                            className="commentshowsection"
                            id={thread._id}
                            style={{ display: "none" }}
                          >
                            <div>
                              <div className="noofcomments">
                                {thread.comments.length} Comments
                              </div>
                              {thread.comments.slice(0, 3).map((comment) => (
                                <div
                                  className="commentingarea"
                                  key={comment._id}
                                >
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
                                            @{comment.commenterIdentity}
                                            {comment.commenterIsAdmin && <>♛</>}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="commentingtime">
                                      {moment(comment.createdAt).fromNow()}
                                    </div>
                                  </div>
                                  <div className="usercomment">
                                    {comment.text}
                                  </div>
                                  {(userIdentity ===
                                    comment.commenterIdentity ||
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
                              <div
                                className="commentsshowmoree"
                                onClick={(e) => {
                                  e.preventDefault();
                                  NavigateToPost(thread._id);
                                }}
                              >
                                <button>Show more</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="commentshowsection"
                            id={thread._id}
                            style={{
                              display: "none",
                              textAlign: "center",
                              paddingTop: "20px",
                              fontSize: "15px",
                            }}
                          >
                            No Comments
                          </div>
                        )}

                        {/* <!----------------comments div-----------------> */}
                      </div>
                    </div>
                  ))}
                  {/* <!-----------------------------Map Function--------------------------->
              -------------------------Map Function---------------------------> */}
                </div>
              </div>
            </div>
          </div>

          {/* <!--------------------- flex post content-------------------------------------> */}
        </div>
      </div>
      <div className={`notification-container ${notification ? "show" : ""}`}>
        {notification}
      </div>
    </div>
  );
}
export default Home;
