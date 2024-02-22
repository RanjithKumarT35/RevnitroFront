import React, { useEffect, useState, useRef, useContext } from "react";
import AuthContext from "./context/authcontext";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import API_URL from "./global";
function CreatePost() {
  const [prevImage, setPrevImage] = useState("./images/Thumbnailpreview.png");
  const [isActive, setIsActive] = useState(false);
  const [newThread, setNewThread] = useState({
    title: "",
    content: "",
    highlightedContent: "",
    heading: "Car Queries",
    thumbnail: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [isAdmin, setIsAdmin] = useState();
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
  const [headings, setHeadings] = useState();

  useEffect(() => {
    fetchHeadings();
  }, []);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get(`${API_URL}/Heading`, {
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
    async function getName() {
      try {
        const response = await axios.get(`${API_URL}/auth/user`, {
          crossDomain: true,
          withCredentials: true,
        });
        if (response.data.userName) {
          setUserName(response.data.userName);
          setUserId(response.data.userId);
          setIsAdmin(response.data.isAdmin);
          setUserProfilePic(response.data.profilePic);
          setUserIdentity(response.data.userIdentity);
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error(error);
      }
    }
    setPrevImage("./images/Thumbnailpreview.png");
    getName();
  }, []);

  const createThread = async (e) => {
    e.preventDefault();
    const sendData = {
      title: newThread.title,
      content: newThread.content,
      highlightedContent: newThread.highlightedContent,
      userId: userId,
      heading: newThread.heading,
      thumbnail: newThread.thumbnail,
    };

    try {
      const response = await axios.post(`${API_URL}/threads`, sendData, {
        crossDomain: true,
        withCredentials: true,
      });
      showNotification("Thread added successfully!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        showNotification("Thread with the same title already exists.");
      } else {
        navigate("/LoginPage");
      }
    }
  };
  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  ///
  //
  ///
  const { getLoggedIn } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
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
  ///
  ///
  ///
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await handleUpload(file);
  };
  const handleThumbnail = async (event) => {
    const file = event.target.files[0];
    await handleUpload(file, true);
  };
  const handleUpload = async (file, isThumbnail = false) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("sampleFile", file);

      const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // You can use 'percentCompleted' to update a loading indicator
          },
        },
        { crossDomain: true, withCredentials: true }
      );

      setLoading(false);

      if (isThumbnail) {
        setNewThread({ ...newThread, thumbnail: response.data.link });

        isThumbnail = false;
      } else {
        if (editorRef.current) {
          const editor = editorRef.current;
          editor.execCommand(
            "mceInsertContent",
            false,

            `<img className="ImportIamgeWItdh"  src="${response.data.link}" alt="Uploaded Image" />`
          );
          setImagePath(response.data.link);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading image:", error);
    }
  };
  const toggleNav = () => {
    setIsActive(!isActive);
  };
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
              <div className="textforumdynamic">{stats.totalthreads} Posts</div>
            </div>
            <div className="iconsflexss">
              <img src="./images/mdi_account-view.webp" alt="" />
              <div className="textforumdynamic">{stats.totalViews} Views</div>
            </div>
          </div>
          {/* <!--------------------- Revnitro Topics-------------------------------------> */}

          {/* <!--------------------- input and filters-------------------------------------> */}
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
                <div className="CreateYourPost">Create Your Post</div>
              </div>
            </div>
          </div>
          {/* <!--------------------- input and filters-------------------------------------> */}

          {/* <!--------------------- flex post content-------------------------------------> */}
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
                <div className="createpostdiv">
                  <div className="personposted">
                    <div className="uploadname">
                      <div>
                        <img src={userProfilePic} alt="" />
                      </div>
                      <div>
                        <div className="uploadpersonname">{userName}</div>
                        <div className="uernamepost">@{userIdentity}</div>
                      </div>
                    </div>
                  </div>

                  {/* <!---continueee--> */}
                  {/* <select
                              type="text"
                              placeholder="Select the Heading"
                              value={newThread.heading}
                              onChange={(e) =>
                                setNewThread({
                                  ...newThread,
                                  heading: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="select a heading" disabled>
                                select a heading
                              </option>
                              <option
                                style={{ borderRadius: "20px" }}
                                value="Car Maintenance"
                              >
                                Car Maintenance
                              </option>
                              <option value="Car Queries">Car Queries</option>
                              <option value="Bike Maintenance">
                                Bike Maintenance
                              </option>
                              <option value="Bike Queries">Bike Queries</option>
                              <option value="Automotive History">
                                Automotive History
                              </option>
                              <option value="Riding Gears">Riding Gears</option>
                              <option value="Rider Tips">Rider Tips</option>
                              <option value="Myth Busters">Myth Busters</option>
                              <option value="Bike Ownership Reviews">
                                Bike Ownership Reviews
                              </option>
                              <option value="Car Ownership Reviews">
                                Car Ownership Reviews
                              </option>

                              <option value="Techinical Discussions">
                                Techinical Discussions
                              </option>
                              <option value="Others">Others</option>
                              {isAdmin && (
                                <option value="RevNitro">RevNitro</option>
                              )}
                            </select> */}
                  <div className="postionofimage">
                    <form action="" onSubmit={createThread}>
                      <div className="cforumtopics">
                        <div className="headingcreatepost">Forum Topics</div>
                        <div className="cmarginleft">
                          <label htmlFor="createpost">
                            <select
                              type="text"
                              placeholder="Select the Heading"
                              onChange={(e) =>
                                setNewThread({
                                  ...newThread,
                                  heading: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="select A Heading" disabled>
                                select A Heading
                              </option>
                              {headings &&
                                headings.map((heading) => (
                                  <option
                                    key={heading._id}
                                    value={heading.headingName}
                                  >
                                    {heading.headingName}
                                  </option>
                                ))}
                              {isAdmin && (
                                <option value="RevNitro">Revnitro</option>
                              )}
                            </select>
                          </label>
                        </div>
                      </div>
                      <div className="cheadingtopics">
                        <div className="headingcreatepost">Title</div>
                        <div className="cinputforumcreatepost">
                          <input
                            type="text"
                            placeholder="Title"
                            value={newThread.title}
                            onChange={(e) =>
                              setNewThread({
                                ...newThread,
                                title: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="thumbnailsecrionforcreatepost">
                        <div className="thumbnailtextscreatepost">
                          Thumbnail
                        </div>
                        <div className="imagethumbnailpreviewdivtag">
                          <div>
                            <div className="file-input">
                              <input
                                type="file"
                                name="sampleFile"
                                onChange={handleThumbnail}
                                id="file-input"
                                className="file-input__input"
                              />
                              <label
                                className="file-input__label"
                                htmlFor="file-input"
                              >
                                <img src="./images/tabler_photo.png" alt="" />
                                <span className="uploadimagecreatepost">
                                  Select Thumbnail
                                </span>
                              </label>
                            </div>
                            <div className="recommenededsizees">
                              Recomended 900x350 px
                            </div>
                          </div>

                          {newThread.thumbnail ? (
                            <div className="previewwimagesizee">
                              <img
                                src={newThread.thumbnail}
                                alt=""
                                style={{
                                  width: "200px",
                                  height: "77.78px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ) : (
                            <div className="previewwimagesizee">
                              <img
                                src={prevImage}
                                alt=""
                                style={{
                                  width: "200px",
                                  height: "77.78px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="breifdescriptionzsflex">
                        <div className="breiefdescriptionnamee">
                          Brief Description
                        </div>
                        <div className="breifedescriptiontrextareabox">
                          <textarea
                            type="text"
                            // name=""
                            // id=""
                            cols="30"
                            rows="10"
                            maxLength="300"
                            placeholder="Maximum 300 Words"
                            value={newThread.highlightedContent}
                            onChange={(e) =>
                              setNewThread({
                                ...newThread,
                                highlightedContent: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="thumbnailsecrionforcreatepost11">
                        <div className="thumbnailtextscreatepost">Post</div>
                        <div className="imagethumbnailpreviewdivtag">
                          <div>
                            <div className="file-input">
                              <input
                                type="file"
                                name="sampleFile"
                                onChange={handleFileChange}
                                className="file-input__input"
                                id="file-insert"
                              />
                              <label
                                className="file-input__label"
                                htmlFor="file-insert"
                              >
                                <img src="./images/tabler_photo.png" alt="" />
                                <span className="uploadimagecreatepost">
                                  Insert Image
                                </span>
                              </label>
                            </div>
                            {loading && <p>Image Loading...</p>}
                            <div className="recommenededsizees"></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Editor
                          apiKey="2edzfx0mgryctyfre9pj8d0fikd96259j7w4wvz15jcfma3g"
                          //initialValue={newThread.content}
                          //onInit={(evt, editor) => (editorRef.current = editor)}
                          init={{
                            plugins:
                              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                            toolbar1:
                              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough  | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                            toolbar2:
                              "link image media table mergetags | align lineheight",
                            tinycomments_mode: "embedded",
                            tinycomments_author: "Author name",
                            mergetags_list: [
                              {
                                value: "First.Name",
                                title: "First Name",
                              },
                              { value: "Email", title: "Email" },
                            ],
                            setup: (editor) => {
                              editorRef.current = editor; // Save the editor instance to the ref
                            },
                          }}
                          initialValue="start typing"
                          onEditorChange={(content) => {
                            setNewThread({ ...newThread, content });
                          }}
                          style={{ width: "0%", height: "1000px" }}
                          //onEditorChange={handleModelChange}
                          //ref={editorRef}
                        />
                      </div>
                      <div className="buttonsubmit">
                        <button type="submit">Upload your Post</button>
                      </div>
                    </form>
                  </div>
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

function notificationclickfunction() {
  var notificationnumberofmessage = document.getElementsByClassName(
    "notificationnumberofmessage"
  );
  notificationnumberofmessage[0].style.display = "none";
  notificationnumberofmessage[1].style.display = "none";
}

export default CreatePost;
