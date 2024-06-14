"use client";

//For when you want to display a value on the title
const DashboardCollapseValue = ({ title, units, children }) => {
    return (
      <div className="collapse bg-base-200 hover:bg-primary-content mb-2">
        <input type="checkbox" /> 
        <div className="collapse-title font-bold flex justify-between items-center p-4">
            <div className="">
                {title}
            </div>
            <div className="">
                {units} 
            </div>
        </div>
          
       
       <div className="collapse-content space-y-4">
          {children}
        </div>
      </div>
    );
  };

  export default DashboardCollapseValue;