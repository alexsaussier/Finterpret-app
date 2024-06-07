"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { sendOpenAi } from "@/libs/gpt";

// A simple modal component which can be shown/hidden with a boolean and a function
// Because of the setIsModalOpen function, you can't use it in a server component.
const Modal = ({ isModalOpen, setIsModalOpen, metric }) => {
  console.log("Metric selected: " + JSON.stringify(metric, null, 2));
  console.log("Metric name: " + metric[0]);

  const gptMessage = "Can you tell me more about " + metric[0] + "?" + " Its value for an asset I own is " + metric[1] + ", what does it mean?" +
  " Please make the text spaced. each paragraph should have 1 line of spacing. Focus more on what the metric value means for me." +
  " Make it very concise and easy to understand for the common folk. The person reading that does not know anything about finance." +
  " Be somewhat serious but friendly, and you can occasionnally give funny metaphors. Answer in HTML format." + 
  " You should sound very confident in your answer, as if you are a financial advisor.";
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (isModalOpen) {
    //Run this on component render only
    //response = sendOpenAi(gptMessage, "1");
    sendOpenAi(gptMessage, "1", 300).then((data) => {
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
                  <p>Creating a custom explanation for you ...</p>
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
