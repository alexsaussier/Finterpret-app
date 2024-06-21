"use client";
import { sendOpenAi } from "@/libs/gpt";
import React, { useState } from 'react';


//For when you want to display a value on the title
const DashboardCollapseValue = ({ title, units, children }) => {
  
  const guideline = "You are a financial advisor. You are helping a client understand all sorts of financial metrics. Your tone should be serious but friendly" +
  " Answer in HTML format. Use 1 <br> tags between each paragraph." +
  " Use <b> tags to put the important statements in bold. " + 
  " You should sound very confident in your answer, as if you are a financial advisor." +
  " Make the response very concise and easy to understand for the common folk. The person reading that does not know anything about finance.";
  
  const gptMessage = "My " + title + " has a value of " + units + ", what does it mean?" +
  " Define what " + title + "means but focus more on what the value means for me." ;

  const [response, setResponse] = useState(null);
  const [hasMadeApiCall, setHasMadeApiCall] = useState(false);

  
  const handleOpen = async (event) => {
    if (event.target.checked && !hasMadeApiCall) {
      // The component is being opened, send a request to OpenAI
      const res = await sendOpenAi(guideline, gptMessage, "1", 300); 
      setResponse(res);
      setHasMadeApiCall(true);

    }
  };
    
  
  return (
      <div className="collapse bg-base-200 hover:bg-primary-content mb-2">
      
      <input type="checkbox" onChange={handleOpen} /> 

        <div className="collapse-title font-bold flex justify-between items-center p-4">
            <div className="">
                {title}
            </div>
            <div className="">
                {units} 
            </div>
        </div>
          
       
       <div className="collapse-content space-y-4">
        {response === null ? (
          <div className="flex items-center space-x-3">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating a custom explanation for you...
        </div>
        ) : (
          <section dangerouslySetInnerHTML={{ __html: response }} />
        )}
       </div>
      </div>
    );
  };

  export default DashboardCollapseValue;