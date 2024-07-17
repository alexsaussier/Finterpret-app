"use client";
import { sendOpenAi } from "@/libs/gpt";
import React, { useState } from "react";

//For when you want to display a value on the title
const DashboardCollapseStock = ({ title, units, children }) => {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editUnits, setEditUnits] = useState(units);
  /* 
  const guideline =
    "You are a financial advisor. You are helping a client understand all sorts of financial metrics. Your tone should be serious but friendly" +
    " Answer in HTML format. Use 1 <br> tags between each paragraph." +
    " Use <b> tags to put the important statements in bold. " +
    " You should sound very confident in your answer, as if you are a financial advisor." +
    " Make the response very concise and easy to understand for the common folk. The person reading that does not know anything about finance.";

  const gptMessage =
    "My " +
    title +
    " of my portfolio has a value of " +
    units +
    ", what does it mean?" +
    " Define what " +
    title +
    "means but focus more on what the value means for me.";

  const [response, setResponse] = useState(null);
  const [hasMadeApiCall, setHasMadeApiCall] = useState(false);

  const handleOpen = async (event) => {
    if (event.target.checked && !hasMadeApiCall) {
      // The component is being opened, send a request to OpenAI
      const res = await sendOpenAi(guideline, gptMessage, "1", 300);
      setResponse(res);
      setHasMadeApiCall(true);
    }
  };*/

  const handleOpen = () => {
    return null;
  };

  return (
    <div className="collapse bg-base-200 hover:bg-primary-content mb-2">
      <input type="checkbox" onChange={handleOpen} />
      <div className="collapse-title font-bold flex justify-between items-center p-4">
        <div className="">{title}</div>
        {!editing && <div className="">{units}</div>}
      </div>

      <div className="collapse-content flex items-center justify-between space-y-4">
        <div>GPT CONTENT</div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <input
                placeholder="Units number"
                value={editUnits}
                onChange={(e) => setEditUnits(Number(e.target.value))}
                className="input input-bordered input-primary max-w-xs mr-2 mb-2"
              />
              <button
                className="btn btn-primary btn-outline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary">Save</button>
            </>
          ) : deleting ? (
            <>
              <button
                className="btn btn-primary btn-outline"
                onClick={() => setDeleting(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary">Confirm</button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setDeleting(true)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCollapseStock;
