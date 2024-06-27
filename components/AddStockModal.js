"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { sendOpenAi } from "@/libs/gpt";
import { StockTickerSearch } from "./StockTickerSearch";

// A simple modal component which can be shown/hidden with a boolean and a function
// Because of the setIsModalOpen function, you can't use it in a server component.
const AddStockModal = ({ isModalOpen, setIsModalOpen }) => {
  //Write logic for saving stock object to stock array in mongo
  //[{ticker: TSLA, units: 20}, {ticker: NVDA, units:10}]
  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsModalOpen(false)}
      >
        <StockTickerSearch />
      </Dialog>
    </Transition>
  );
};

export default AddStockModal;
