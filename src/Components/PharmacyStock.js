import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PharmacyNavBar from "./PharmacyNavBar";
import { toast } from "react-toastify";
import Popup from "./PopUp";
import { FaFileAlt } from "react-icons/fa";

function PharmacyStock() {
  const [drugStock, setDrugStock] = useState([]);
  const navigate = useNavigate();
  const [trigger, setTrigger] = useState(true);
  const [popUpState, setpopUpState] = useState(false);

  useEffect(() => {
    if (trigger) {
      getDrugs();
      setTrigger(false);
    }
  }, [trigger]);

  function getDrugs() {
    fetch(`http://localhost:8080/pharmacy/getAllDrugsFromPharmacy/${sessionStorage.getItem("id")}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          sessionStorage.clear();
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

  function handleFileDragEnter(event) {
    event.preventDefault();
  }

  function handleFileDragOver(event) {
    event.preventDefault();
  }

  function handleFileDrop(event) {
    event.preventDefault();

    // Check if the popup is active
    if (popUpState) {
      return;
    }

    const file = event.dataTransfer.items[0].getAsFile();
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      try {
        const parsedContent = JSON.parse(fileContent);
        setDrugStock(parsedContent);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  }

  function saveChanges() {
    fetch(`http://localhost:8080/pharmacy/loadMassiveStock/${sessionStorage.getItem("id")}`, {
      method: "PUT",
      headers: { "content-type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      body: JSON.stringify(drugStock),
    })
      .then((result) => {
        if(result.status==400){
          toast.error("Invalid JSON")
          setTrigger(true)
          setpopUpState(false)
        }
        setTrigger(true);
        setpopUpState(false);
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
        <button className="btn btn-info" onClick={() => setpopUpState(true)}>Save Changes</button>
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
    {drugStock
      .sort((a, b) => a.drugID - b.drugID)
      .map((drug) => (
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


      {popUpState ? (
        <Popup
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          trigger={popUpState}
          setTrigger={setpopUpState}
        >
          <div>
            <h4>Are you sure you want to save changes?</h4>
            <button className="btn btn-success accept-button" onClick={() => saveChanges()}>
              Yes
            </button>
            <button className="btn btn-danger reject-button" onClick={() => setpopUpState(false)}>
              No
            </button>
          </div>
        </Popup>
      ) : (
        <div
          className="file-drop-zone"
          onDrop={handleFileDrop}
          onDragOver={handleFileDragOver}
          onDragEnter={handleFileDragEnter}
        >
          <div className="file-drop-icon">
            <FaFileAlt />
          </div>
          <p>Drag and drop a JSON file here</p>
        </div>
      )}
    </div>
  );
}

export default PharmacyStock;
