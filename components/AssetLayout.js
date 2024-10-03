"use client";

const AssetLayout = ({ title, units }) => {
  return (
    <div className="flex justify-between items-center pb-2">
      <div className="">{title}</div>
      <div className="">{units}</div>
    </div>
  );
};

export default AssetLayout;
