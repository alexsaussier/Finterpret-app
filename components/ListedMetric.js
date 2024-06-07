"use client";

import { useState } from "react";
import "./ListedMetric.css";
import Modal from "./Modal";

const ListedMetric = ({ metric, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="listedMetric" onClick={() => setIsOpen(true)}>
      <p className="metricName">{metric}</p>
      <p className="metricValue">{value}</p>
      <Modal isModalOpen={isOpen} setIsModalOpen={setIsOpen} />
    </div>
  );
};

export default ListedMetric;
