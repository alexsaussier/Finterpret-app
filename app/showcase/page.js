import ListedMetric from "@/components/ListedMetric";
import ListedStock from "@/components/ListedStock";

const Showcase = () => {
  return (
    <main style={{ padding: "20px", backgroundColor: "#f7f7f7" }}>
      Hey, this is showcase page. Displayed below are our custom components for
      use in app.
      <h1 style={{ fontWeight: "bold", marginTop: "30px" }}>
        Listed Stock component has modal integrated + negative/positive change
        functionality
      </h1>
      <ListedStock
        percentage={12}
        name={"TSLA"}
        price={"284"}
        stockNumber={120}
      />
      <h1 style={{ fontWeight: "bold", marginTop: "30px" }}>
        Listed Metric component has modal integrated
      </h1>
      <ListedMetric metric={["PE Ratio", 0]}/>
    </main>
  );
};

export default Showcase;
