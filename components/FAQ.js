"use client";
import "./FAQ.css";
import { useRef, useState } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
  {
    question: "What is Finterpret exactly?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Fintrepret is a dashboard that helps you make smart investment on the stock market.
        It lets you add stocks to your portfolio, and outputs metrics for each stock you own, as well as aggregated metrics for your portfolio.
        It uses generative AI to give you insights on the decisions you made and what investmet risks you are exposed to. Try it now!
      </div>
    ),
  },
  {
    question: "How much does it cost?",
    answer: <p>Finterpret is totally free. The product is in beta stage and we are making it free to get as much feedback as possible from early users.</p>,
  },
  {
    question: "How can I give feedback?",
    answer: <p>Please email me at alex@finterpret.co, would love to hear what you think and how I can improve the product.</p>,
  },
  {
    question: "I have another question",
    answer: (
      <div className="space-y-2 leading-relaxed">Cool, contact us by email</div>
    ),
  },
];

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content`}
          style={{ color: isOpen ? "#05d8be" : "#222" }}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section
      className="min-h-screen bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-20 py-8 lg:py-20 md:pt-20 background"
      id="faq"
    >
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p
            className="inline-block font-semibold text-primary mb-4"
            style={{ color: "#05d8be" }}
          >
            FAQ
          </p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
