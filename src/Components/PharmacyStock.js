
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PharmacyNavBar from "./PharmacyNavBar";
import { toast } from "react-toastify";
import Popup from "./PopUp";

function PharmacyStock() {
  const [drugStock, setDrugStock] = useState([]);
  const navigate=useNavigate()
  const [trigger, setTrigger]=useState(true)
  const [popUpState, setpopUpState]=useState(false)

  useEffect(() => {
    if (trigger){
    getDrugs();
    setTrigger(false)
    }
  }, [trigger]);

  function getDrugs() {
    fetch(`http://localhost:8080/pharmacy/getAllDrugsFromPharmacy/${localStorage.getItem("id")}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          return response.json().then((data) => {
            if (Array.isArray(data)) {
              setDrugStock(data);
            } else {
              setDrugStock([]);
            }
          });
        }
      });
  }

  const handleStockChange = (drugId, newStock) => {
    const updatedDrugStock = drugStock.map((drug) => {
      if (drug.drugID === drugId) {
        return { ...drug, stock: newStock };
      }
      return drug;
    });
    setDrugStock(updatedDrugStock);
  };


  function saveChanges(){
    fetch(`http://localhost:8080/pharmacy/loadMassiveStock/${localStorage.getItem('id')}`, {
        method: "PUT",
        headers: { "content-type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(drugStock)
      })
        .then((result) => {
          if (!result.ok) {
            throw Error("Error");
          } 
          setTrigger(true)
          setpopUpState(false)                                      
          return result.json();
        })
        .catch((error) => {
          toast.warning(error);
        });
  }

  return (
    <div>
        <PharmacyNavBar></PharmacyNavBar>
        <div style={{ display: 'flex', alignItems: 'center' }}>
  <h1 style={{ flex: '1 1 auto', margin: '0' }}>Stock Handler:</h1>
  <button className="btn btn-info" onClick={()=>setpopUpState(true)}>Save Changes</button>
</div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Drug ID</th>
            <th scope="col">Brand Name</th>
            <th scope="col">Dosage Form</th>
            <th scope="col">Strength</th>
            <th scope="col">Stock</th>
          </tr>
        </thead>
        <tbody>
          {drugStock.map((drug) => (
            <tr key={drug.drugID}>
              <td>{drug.drugID}</td>
              <td>{drug.brandName}</td>
              <td>{drug.dosageForm}</td>
              <td>{drug.strength}</td>
              <td>
                <input
                  type="number"
                  value={drug.stock}
                  onChange={(e) => handleStockChange(drug.drugID, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Popup style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }} trigger={popUpState} setTrigger={setpopUpState}>
            <div>
  <h4>Are you sure you want save changes?</h4>
  <button className="btn btn-success accept-button" onClick={() => saveChanges()}>Yes</button>
  <button className="btn btn-danger reject-button" onClick={() => setpopUpState(false)}>No</button>
</div>
           
          </Popup>
    </div>
  );
}

export default PharmacyStock;
