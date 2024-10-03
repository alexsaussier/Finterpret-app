"use client";
import { sendOpenAi } from "@/libs/gpt";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/utils/svgIcons";

//For when you want to display a value on the title
const DashboardCollapseStock = ({ title, stockName, units, children }) => {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editUnits, setEditUnits] = useState(units);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [hasMadeApiCall, setHasMadeApiCall] = useState(false);
  const router = useRouter();

  const guideline =
    "You are an expert in publicly listed companies. I will be asking you questions about some publicly listed companies. " +
    "Your tone should be serious but friendly. Answer in HTML format. Use 1 <br> tags between each paragraph. ";

  const gptMessage =
    "Can you provide me with a description of the following company: " +
    stockName +
    "?" +
    "Give me a short rundown of what the company does, what it is known for, and any insights about its historical financial performance. " +
    "Also tell me about the future prospects of the company." + 
    "Do not include a title in your response. Be very concise, write in short bullet points.";

  

  const handleOpen = async (event) => {
    if (event.target.checked && !hasMadeApiCall) {
      // The component is being opened, send a request to OpenAI
      const res = await sendOpenAi(guideline, gptMessage, "1", 500);
      setResponse(res);
      setHasMadeApiCall(true);
    }
  };

  // Handle editing of stock units

  const handleEdit = async () => {
    setLoading(true);
    setEditing(false);
    let ticker = title;
    // We need to re-add the character that we stripped off when we added the stock to the portfolio
    if (ticker.endsWith(".PA")) {
      ticker += "R";
      console.log("ticker to delete:", ticker);
    }
    if (ticker.endsWith(".DE")) {
      ticker += "X";
    }

    const newUnits = editUnits;

    try {
      const response = await fetch("/api/user/edit-user-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker, newUnits }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(ticker + " Stock unit updated successfully:", result);
      router.refresh();
      // Optionally, update the UI or give user feedback
    } catch (error) {
      console.error("Error updating stock unit:", error);
    } finally { 
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setDeleting(false);

    let ticker = title;
    const newUnits = 0;


    // when units is 0, this api route removes the stock from the portfolio
    try {
      const response = await fetch("/api/user/edit-user-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker, newUnits }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      router.refresh();
      console.log(title + " Stock unit updated successfully:", result);
      // Optionally, update the UI or give user feedback
    } catch (error) {
      console.error("Error updating stock unit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collapse bg-base-200 hover:bg-primary-content mb-2">
      <input type="checkbox" onChange={handleOpen} />

      <div className="collapse-title font-bold flex justify-between items-center p-4">
        <div className="">{stockName || title}</div>
        {!editing && <div className="">{units}</div>}
      </div>

      <div className="collapse-content flex flex-col items-center justify-between space-y-4">
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

              <button className="btn btn-primary" onClick={() => handleEdit()}>
                Save
              </button>
              
            </>
          ) : deleting ? (
            <>
              <button
                className="btn btn-primary btn-outline"
                onClick={() => setDeleting(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={() => handleDelete()}
              >
                Confirm
              </button>
              
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
              
              {loading && <LoadingSpinner />} 

            </>
          )}
        </div>

        {
          //Chat gpt response
        }

        {response === null ? (
          <div className="flex items-center space-x-3">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Our Intelligent Advisor is looking for information about {stockName} ...
          </div>
        ) : (
          <section dangerouslySetInnerHTML={{ __html: response }} />
        )}
      </div>
    </div>
  );
};

export default DashboardCollapseStock;
