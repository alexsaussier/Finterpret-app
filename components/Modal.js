"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { sendOpenAi } from "@/libs/gpt";

// A simple modal component which can be shown/hidden with a boolean and a function
// Because of the setIsModalOpen function, you can't use it in a server component.
const Modal = ({ isModalOpen, setIsModalOpen, metric }) => {
  console.log("Metric selected: " + JSON.stringify(metric, null, 2));
  console.log("Metric name: " + metric[0]);
  
  const guideline = "You are a financial advisor. You are helping a client understand all sorts of financial metrics. Your tone should be serious but friendly" +
  " Answer in HTML format. Use 1 <br> tags between each paragraph." +
  " Use <b> tags to put the important statements in bold. " + 
  " You should sound very confident in your answer, as if you are a financial advisor." +
  " Make the response very concise and easy to understand for the common folk. The person reading that does not know anything about finance.";

  const gptMessage = "Tell me more about " + metric[0] + "?" + " Its value for an asset I own is " + metric[1] + ", what does it mean?" +
  " Focus more on what the metric value means for me." ;
  
  const [response, setResponse] = useState(null);


  useEffect(() => {
    if (isModalOpen) {
    //Run this on component render only
    //response = sendOpenAi(gptMessage, "1");
    sendOpenAi(guideline, gptMessage, "1", 300).then((data) => {
      setResponse(data);
      console.log(response);
    });
  }

  }, [isModalOpen]);

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsModalOpen(false)}
      >
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

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
