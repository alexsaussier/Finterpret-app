"use client";


const AssetLayout = ({title, quantity}) => {
  return (
    <div className="flex justify-between items-center pb-2">
        <div className="">
            {title}
        </div>
        <div className="">
            {quantity}
        </div>
    </div>
  );
};

export default AssetLayout;
