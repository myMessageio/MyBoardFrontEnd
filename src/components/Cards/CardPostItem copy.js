import React from "react";
import PropTypes from "prop-types";

export default function CardPostItem({
  statSubtitle,
  statTitle,
  statArrow,
  statPercent,
  statPercentColor,
  statDescripiron,
  statIconName,
  statIconColor,
}) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-blueGray-100 border-0">

        <div className="flex-auto p-4 bg-white rounded-lg">
          <div className="flex flex-wrap">
            <div className="relative w-auto  flex-initial ">
                <img
                  src="../../assets/img/team-4-470x470.png" 
                  className="h-12 w-12 bg-white rounded-full border"
                  alt="..."
                ></img>
            </div>
            <div className="relative w-full pl-4 max-w-full flex-grow flex-1">
              <h5 className="text-blueGray-400  font-bold text-xs">
                 Terresa
                 <span className={statPercentColor + " mr-2"}> posted 3 min ago</span> 
              </h5>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">
              Working with us is a pleasure
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                Don't let your uses guess by attaching tooltips and popoves to any element. 
                Just make sure you enable them first via JavaScript.</p>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                Don't let your uses guess by attaching tooltips and popoves to any element. 
                Just make sure you enable them first via JavaScript.</p>

              {/* <span className="font-semibold text-xl text-blueGray-700">
                {statTitle}
              </span> */}
              {/* <p className="text-sm text-blueGray-400 mt-4">
                <span className={statPercentColor + " mr-2"}>
                  <i
                    className={
                      statArrow == "up"
                        ? "fas fa-arrow-up"
                        : statArrow == "down"
                        ? "fas fa-arrow-down"
                        : ""
                    }
                  ></i>{" "}
                  {statPercent}%
                </span>
                <span className="whitespace-nowrap">{statDescripiron}</span>
              </p> */}

              <div className="flex flex-wrap justify-center">
                <div className="w-6/12 sm:w-4/12 px-4">
                  <img  src="../../assets/img/landing.jpg"  />
                </div>
              </div>
              <div className="flex flex-wrap mt-5 mb-8">                
                <span className={statPercentColor + " mr-2"}>
                    <i className="fas fa-hand-point-up"></i>{" "} 11
                </span>
                {"   "}
                <span className={statPercentColor + " mr-2"}>
                    <i className="fas fa-hand-point-down"></i>{" "} 11
                </span>
                {"   "}
                <span className={statPercentColor + " mr-2"}>
                    <i className="fas fa-thin  fa-comment"></i>{" "}comments 11
                </span>
                {"   "}
                <span className={statPercentColor + " mr-2"}>
                    <i className="fas fa-share"></i>{" "}share 
                </span>
                {"   "}
                <span className={statPercentColor + " mr-2"}>
                    <i className="fas fa-bookmark"></i>{" "}save 
                </span>

                
              </div>
            </div>

            
          </div>
          
        </div>
      </div>
     
    </>
  );
}

CardPostItem.defaultProps = {
  statSubtitle: "Traffic",
  statTitle: "350,897",
  statArrow: "up",
  statPercent: "3.48",
  statPercentColor: "text-emerald-500",
  statDescripiron: "Since last month",
  statIconName: "far fa-chart-bar",
  statIconColor: "bg-red-500",
};

CardPostItem.propTypes = {
  statSubtitle: PropTypes.string,
  statTitle: PropTypes.string,
  statArrow: PropTypes.oneOf(["up", "down"]),
  statPercent: PropTypes.string,
  // can be any of the text color utilities
  // from tailwindcss
  statPercentColor: PropTypes.string,
  statDescripiron: PropTypes.string,
  statIconName: PropTypes.string,
  // can be any of the background color utilities
  // from tailwindcss
  statIconColor: PropTypes.string,
};
