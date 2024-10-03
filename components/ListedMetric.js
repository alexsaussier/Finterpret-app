"use client";

import { useState } from "react";
import "./ListedMetric.css";
import Modal from "./Modal";

const ListedMetric = ({ metric, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="listedMetric" onClick={() => setIsOpen(true)}>
      <p className="metricName">{metric[0]}</p>
      <p className="metricValue">{metric[1]}</p>
      <Modal
              isModalOpen={isOpen}
              setIsModalOpen={setIsOpen}
              metric={metric}
            />
    </div>
  );
};

export default ListedMetric;
