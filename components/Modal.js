"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useRef } from "react";
import { sendOpenAi } from "@/libs/gpt";

// A simple modal component which can be shown/hidden with a boolean and a function
// Because of the setIsModalOpen function, you can't use it in a server component.
const Modal = ({ isModalOpen, setIsModalOpen, metric, guideline, gptMessage }) => {
  // State for storing the initial ChatGPT response
  const [response, setResponse] = useState(null);
  // State for storing the more detailed "Learn More" response
  const [deeperResponse, setDeeperResponse] = useState(null);
  // State to control content expansion
  const [isExpanded, setIsExpanded] = useState(false);
  // State to show loading spinner
  const [isLoading, setIsLoading] = useState(false);
  // Ref for measuring content height
  const contentRef = useRef(null);
  // State to show deeper loading
  const [isDeeperLoading, setIsDeeperLoading] = useState(false);

  // Effect to fetch initial ChatGPT response when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setIsLoading(true);
      sendOpenAi(guideline, gptMessage, "1", 1000).then((data) => {
        setResponse(data);
        setIsExpanded(false);
        setIsLoading(false);
      });
    }
  }, [isModalOpen, guideline, gptMessage]);

  // Function to toggle content expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to handle "Learn More" button click
  const handleLearnMore = () => {
    setIsDeeperLoading(true);
    const deeperGuideline = guideline;
    const deeperMessage = "Add on to the answer you just gave me by providing more in-depth information and examples." + 
    `Tell me more advanced details about ${metric[0]}.`
    
    sendOpenAi(deeperGuideline, deeperMessage, "1", 1500).then((data) => {
      setDeeperResponse(data);
      setIsDeeperLoading(false);
    });
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsModalOpen(false)}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-focus bg-opacity-50" />
        </Transition.Child>

        {/* Modal content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full overflow-hidden items-start md:items-center justify-center p-2">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-3xl h-full overflow-visible transform text-left align-middle shadow-xl transition-all rounded-xl bg-base-100 p-6 md:p-8">
                {/* Modal title and close button */}
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h2" className="font-semibold">
                    What does this mean?
                  </Dialog.Title>
                  <button
                    className="btn btn-square btn-ghost btn-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>

                {/* Loading spinner or content */}
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating a custom interpretation for you...
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {/* Initial response content */}
                    <section
                      ref={contentRef}
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-full' : 'max-h-24'
                      }`}
                      dangerouslySetInnerHTML={{ __html: response }}
                    />
                    
                    {/* Show More/Less button */}
                    {contentRef.current && contentRef.current.scrollHeight > 20 && !deeperResponse && !isExpanded && (
                      <button
                        onClick={toggleExpand}
                        className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-700 focus:outline-none self-start"
                      >
                        {isExpanded ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                    
                    {/* Learn More button - only shown when expanded */}
                    {isExpanded && !deeperResponse && (
                      <button
                        onClick={handleLearnMore}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 self-start"
                        disabled={isDeeperLoading}
                      >
                        {isDeeperLoading ? 'Loading...' : `Learn More about ${metric[0]}`}
                      </button>
                    )}

                    {/* Deeper response content */}
                    {deeperResponse && (
                      <div className="mt-6">
                        <div className="h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 my-6"></div>
                        <h3 className="text-lg font-semibold mb-2">Advanced Information</h3>
                        <section
                          dangerouslySetInnerHTML={{ __html: deeperResponse }}
                        />
                      </div>
                    )}

                    {/* Deeper response loading indicator */}
                    {isDeeperLoading && (
                      <div className="mt-4 flex items-center space-x-3">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating some advanced information...</span>
                      </div>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
