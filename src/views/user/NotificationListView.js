import React from "react";

// components

import CardProfile from "../../components/Cards/CardProfile.js";
import CardNotificationList from "../../components/Cards/CardNotificationList.js";

export default function NotifictaionListView() {
  return (
    <>
       <div className="px-4 md:px-10 mx-auto w-full py-10 ">
       <div className="container mx-auto">
          <div className="flex flex-wrap relative">
            <div className="w-full lg:w-4/12 px-4">
              <CardProfile />
            </div>
            <div className="w-full lg:w-8/12 px-4 mt-12">
              <CardNotificationList />
            </div>
            
          </div>
        </div>
      </div>
      
    </>
  );
}
