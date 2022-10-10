import React from "react";
import PostItem from "../Posts/PostItem.js";
// components

export default function UserDetailInf() {
  const [openTab, setOpenTab] = React.useState(1);
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab == 1
                    ? "text-white bg-orange-500"
                    : "text-orange-500 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                <i className="fas fa-space-shuttle text-base mr-1"></i> Post
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab == 2
                    ? "text-white bg-orange-500"
                    : "text-orange-500 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                <i className="fas fa-cog text-base mr-1"></i>  Follow
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab == 3
                    ? "text-white bg-orange-500"
                    : "text-orange-500 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                <i className="fas fa-briefcase text-base mr-1"></i>  Followled
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab == 1 ? "block" : "hidden"} id="link1">
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                      <PostItem
                        statSubtitle="TRAFFIC"
                        statTitle="350,897"
                        statArrow="up"
                        statPercent="3.48"
                        statPercentColor="text-emerald-500"
                        statDescripiron="Since last month"
                        statIconName="far fa-chart-bar"
                        statIconColor="bg-red-500"
                      />
                      
                    </div>
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                      <PostItem
                        statSubtitle="TRAFFIC"
                        statTitle="350,897"
                        statArrow="up"
                        statPercent="3.48"
                        statPercentColor="text-emerald-500"
                        statDescripiron="Since last month"
                        statIconName="far fa-chart-bar"
                        statIconColor="bg-red-500"
                      />
                      
                    </div>
                </div>
                <div className={openTab == 2 ? "block" : "hidden"} id="link2">
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                    <PostItem
                      statSubtitle="TRAFFIC"
                      statTitle="350,897"
                      statArrow="up"
                      statPercent="3.48"
                      statPercentColor="text-emerald-500"
                      statDescripiron="Since last month"
                      statIconName="far fa-chart-bar"
                      statIconColor="bg-red-500"
                    />
                    
                  </div>
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                    <PostItem
                      statSubtitle="TRAFFIC"
                      statTitle="350,897"
                      statArrow="up"
                      statPercent="3.48"
                      statPercentColor="text-emerald-500"
                      statDescripiron="Since last month"
                      statIconName="far fa-chart-bar"
                      statIconColor="bg-red-500"
                    />
                    
                  </div>
                </div>
                <div className={openTab == 3 ? "block" : "hidden"} id="link3">
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                    <PostItem
                      statSubtitle="TRAFFIC"
                      statTitle="350,897"
                      statArrow="up"
                      statPercent="3.48"
                      statPercentColor="text-emerald-500"
                      statDescripiron="Since last month"
                      statIconName="far fa-chart-bar"
                      statIconColor="bg-red-500"
                    />
                    
                  </div>
                  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                    <PostItem
                      statSubtitle="TRAFFIC"
                      statTitle="350,897"
                      statArrow="up"
                      statPercent="3.48"
                      statPercentColor="text-emerald-500"
                      statDescripiron="Since last month"
                      statIconName="far fa-chart-bar"
                      statIconColor="bg-red-500"
                    />
                    
                  </div>
          
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
     
    </>
  );
}
