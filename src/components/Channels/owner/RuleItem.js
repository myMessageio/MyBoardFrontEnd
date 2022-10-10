import React,{useState} from "react";

export default function RuleItme({rule,no}) {
  const applyObjtypes=['only posts','only comments','posts and comments ']
  const [isCollapsed,setIsCollapsed]=useState(false)
  return(<>
    <h2 >
      <button type="button"
      onClick={()=>setIsCollapsed(!isCollapsed)}
      className="flex justify-between items-center p-5 w-full font-medium text-left text-gray-500  focus:no-outline dark:focus:ring-blue-800 border border-b-0 border-gray-200 hover:bg-gray-100  " >
        <span>RULE{no}:{rule.rule}</span>
        {isCollapsed&&(
        <svg  className="w-6 h-6 rotate-180 shrink-0"viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>
        )}
        {!isCollapsed&&(
          <svg  className="w-6 h-6 shrink-0"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" ></path></svg>
        )}
        </button>
    </h2>
    {isCollapsed&&(
      <div id="accordion-collapse-body-1">
        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2 mt-2">
            Applies to
          </label>
          <p className="text-gray-500 dark:text-gray-400 pl-3">{applyObjtypes[rule.applyObjtype]}</p>
          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2  mt-2">
            Report Reason
          </label>
          <p className="pl-3 mb-2 text-gray-500 dark:text-gray-400">{rule.reportReason}</p>
          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2  mt-2">
            Description
          </label>
          <p className="text-gray-500 dark:text-gray-400 pl-3">{rule.description}</p>
        </div>
      </div>
    )}
  </>)

}
