import React,{useState} from "react";

export default function RuleItme({rule,no}) {
  const applyObjtypes=['only posts','only comments','posts and comments ']
  const [isCollapsed,setIsCollapsed]=useState(false)
  return(<>
    <h2 >
      <button type="button"
      onClick={()=>setIsCollapsed(!isCollapsed)}
      className="flex justify-between items-center p-5 w-full font-medium text-left text-gray-500  focus:outline-none outline-none dark:focus:ring-blue-800 border border-b-0 border-gray-200 hover:bg-gray-100  " >
        <span className="flex items-center">
          <svg className="mr-2 w-5 h-5 shrink-0"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
          </svg>
          {rule.rule}</span>                 
       
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
         <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2 mt-2">
            Applies to:{applyObjtypes[rule.applyObjtype]}
          </label>     
          <p className="text-gray-500 dark:text-gray-400 pl-3">{rule.description}</p>
        </div>
      </div>
    )}
  </>)

}
