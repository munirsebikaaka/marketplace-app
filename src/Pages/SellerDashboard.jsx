import "../styles/sellerDashboard.css";
import SellerForm from "../components/SellerDetails/SellerForm";

function SellerDashboard() {
  return (
    <div className="seller-dashboard">
      <header className="dashboard-header">
        <h2>Seller Dashboard</h2>
        <p>Welcome... user name</p>
      </header>
      <SellerForm />
    </div>
  );
}

export default SellerDashboard;
