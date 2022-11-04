import React, { useEffect, useState }  from "react";
import  Loading from "../../components/Loading/loading";




import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';



export default function Abstract(
  {abstractDescription,setAbstractDescription}
) { 

  //////variable for posting
  ///////quill
  const modules={
    
    toolbar: [
      // [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
  
      [{ list: 'ordered'}, { list: 'bullet' }],
      [{ indent: '-1'}, { indent: '+1' }],
       [{ 'script': 'sub' }, { 'script': 'super' }],
      
      ['link', 'image' ],
      [{ color: [] }, { background: [] }],
  
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
    blotFormatter: {}
    
  
}

const { quill, quillRef, Quill } = useQuill({
  theme:"snow",
  modules: modules,
  placeholder:"Write abstract about this paid post ..."
});

if (Quill && !quill) {
  // const BlotFormatter = require('quill-blot-formatter');
  Quill.register('modules/blotFormatter', BlotFormatter);
}


////quill effect
useEffect(() => {
  if (quill) {
    quill.on('text-change', (delta, oldContents) => {     
      setAbstractDescription(quill.root.innerHTML)
    });
  }
}, [quill, Quill]);
// function contentclear(){
//   quill.root.innerHTML="";
// }

////




  return (
    <>
   
      <div  className= "relative w-full mb-3"id="link1"  >    
        <div ref={quillRef}  className="rounded"/> 
      </div>
    </>
  );
}
