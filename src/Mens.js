import React, { useState } from "react";

function Navbar222() {
  const [isActive, setIsActive] = useState(false);

  const toggleNav = () => {
    setIsActive(!isActive);
  };

  return (
    <div id="nav-container" className={isActive ? "is-active" : ""}>
      <div id="nav-toggle" onClick={toggleNav}></div>
      <nav className="nav-items">
        <div className="leftnavbarboxmobile">
          <div className="imageflexleftnavbarmobile">
            <div className="mobileversionnavbarimagesizess">
              <img src="./images/Rectangle36.webp" alt="imagetext" />
            </div>
            <div className="usernamenavbar">
              <h3 className="mobilevrersionnamesize">Guest</h3>
              <div className="idnamenamemobile">user-id</div>
            </div>
          </div>
          <div className="navigationbuttontopmobile">
            <div className="navigatelinksmobile">
              <div>
                <img src="./images/mdi_home.webp" alt="hometext" />
              </div>
              <div className="navigatenamesmobile">Home</div>
            </div>
            <div className="navigatelinksmobile">
              <div>
                <img src="./images/gridicons_create.webp" alt="hometext" />
              </div>
              <div className="navigatenamesmobile">Create Post</div>
            </div>
            <div className="navigatelinksmobile">
              <div>
                <img
                  src="./images/fluent_people-team-16-filled.webp"
                  alt="hometext"
                />
              </div>
              <div className="navigatenamesmobile">Forum</div>
            </div>
            <div className="navigatelinksmobile">
              <div>
                <img src="./images/Frame9.webp" alt="hometext" />
              </div>
              <div className="navigatenamesmobile">Revnitro Team</div>
            </div>
            <div className="navigatelinksmobile">
              <div>
                <img src="./images/iconamoon_news-fill.webp" alt="hometext" />
              </div>
              <div className="navigatenamesmobile">My Post</div>
            </div>
            <div className="navigatelinksmobile">
              <div>
                <img src="./images/ooui_log-in-ltr.webp" alt="hometext" />
              </div>
              <div className="navigatenamesmobile">Log in</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar222;
