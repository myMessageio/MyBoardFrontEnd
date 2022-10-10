import React from "react";
import { Link } from "react-router-dom";
import {channelTopicOptions } from "../owner/data"
export default function TopicMenu({topic}) { 
  console.log(topic)
  return (
    <>   
        
      <aside className="mt-10" aria-label="Sidebar">
        <div className="rounded-t bg-indigo-500 mb-0 px-6 py-3">
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold">Topics</h6>    
          </div>
        </div>
        <div className="overflow-y-auto py-4  bg-gray-50 rounded dark:bg-gray-800 ">
          <ul className="space-y-2">
            <li className={(topic=="all")?("border-l-4  border-indigo-500/100 bg-blue-400 text-white"):(" ")}>
              <Link to={`/channel/list/all`} 
                className={"flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white"
                +((topic!="all")?(" hover:bg-gray-100 dark:hover:bg-gray-700"):(" "))}>
                <span className="ml-3">All Communities</span>
              </Link>
            </li>
            {channelTopicOptions.map((channel,i)=>{
              return(
                <li key={`topic${i}`} className={((topic==channel.value)?("border-l-4 border-indigo-500/100 bg-blue-400 text-white"):(" ")) }>
                  <Link to={`/channel/list/${channel.value}`}
                   className={"flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white"
                   +((topic!=channel.value)?(" hover:bg-gray-100 dark:hover:bg-gray-700"):(""))}>
                    <span className="ml-2 mr-1 whitespace-prenormal ">{channel.value}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          
        </div>
      </aside>


     
    </>
  );
}
