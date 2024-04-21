"use client";


const DashboardCollapse = ({ title, children }) => {
  return (
    <div className="collapse collapse-open bg-base-200 hover:bg-primary-content mb-2">
      <input type="checkbox" /> 
      <div className="collapse-title font-bold">
        {title}
      </div>
      <div className="collapse-content">
        {children}
      </div>
    </div>
  );
};



export default DashboardCollapse;