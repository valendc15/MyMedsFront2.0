import { useState } from "react";
import PharmacyNavBar from "./PharmacyNavBar";
import { func } from "prop-types";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Popup from "./PopUp";
import { jsxOpeningElement } from "@babel/types";

function MedicineSearch() {
  const [med, setMed] = useState("");
  const [drugList, setDrugList] = useState([]);
  const [records, setRecords] = useState([]);
  const [view, setView] = useState(false);
  const navigate = useNavigate();
  const [popUpState, setpopUpState] = useState(false);
  const [drugInfo, setDrugInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (med !== "") {
        getDrugList();
      }
  }, [med]);

  const cardStyle = {
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "10px",
    margin: "10px",
    flex: "0 0 auto",
    width: "300px",
  };

  const cardContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
  };

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  const cardTextStyle = {
    fontSize: "14px",
    marginBottom: "10px",
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  function getDrugList() {
    fetch(`http://localhost:8080/pharmacy/getDrugNameFromFDA/${med}`, {
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
              setDrugList(data);
            } else {
              setDrugList([]);
            }
          });
        }
      });
  }

  const Filter = (event) => {
    event.preventDefault();
    if (med !== "") {
      const filteredDrugs = drugList.filter(
        (drug) => drug.toLowerCase() === med.toLowerCase()
      );
      if (filteredDrugs.length > 0) {
        setRecords(filteredDrugs);
        getDrugInfo();
        setpopUpState(true);
      } else {
        setRecords([]);
        setView(false);
        toast.warning("There are no medications with that name");
      }
    } else {
      setRecords([]);
      setView(false);
      toast.warning("Please input at least one character");
    }
  };

  function getDrugInfo() {
    setIsLoading(true); // Set loading state to true
    fetch(`http://localhost:8080/pharmacy/getDetailsForDrug/${med}`, {
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
            console.log(data);
            if (Array.isArray(data)) {
              setDrugInfo(data);
            } else {
              setDrugInfo([]);
            }
            setIsLoading(false); 
          });
        }
      });
  }

  function addDrugs(drug) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/pharmacy/addDrugToPharmacy/${localStorage.getItem('id')}`, {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(drug)
    })
      .then((result) => {
        if (result.status === 409){
          toast.warning("Medicine already added.");
          return;
        }
        if (!result.ok) {
          throw Error("Error");
        }
        setpopUpState(false);
        navigate('/pharmacyStock')
        return result.json();
      })
      .catch((error) => {
        toast.warning(error);
      });
  }

  return (
    <div>
      <PharmacyNavBar></PharmacyNavBar>
      <div
        className="container"
        style={{ padding: "0 15px", width: "100%" }}
      >
        <p className="font-weight-light text-center searchparagraph">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-capsule"
            viewBox="0 0 16 16"
          >
            <path d="M1.828 8.9 8.9 1.827a4 4 0 1 1 5.657 5.657l-7.07 7.071A4 4 0 1 1 1.827 8.9Zm9.128.771 2.893-2.893a3 3 0 1 0-4.243-4.242L6.713 5.429l4.243 4.242Z" />
          </svg>{" "}
          Add a medication by searching with their Brand Name
        </p>
        <div className="search d-flex justify-content-center">
          <form className="row row-cols-lg-auto g-3" onSubmit={Filter}>
            <div className="col-md-2">
              <label className="visually-hidden">Message</label>{" "}
              <input
                type="text"
                className="form-control"
                id="inputMessage"
                placeholder="Medicine Brandname"
                value={med}
                onChange={(e) => setMed(e.target.value)}
                list="drugOptions" // Add list attribute
              />
              <datalist id="drugOptions" className="drug-options">
                {drugList.map((drug, index) => (
                    <div key={drug}>
                  <option key={index} value={drug} />
                  </div>
                ))}
              </datalist>
            </div>
            <div className="col-sm-2">
              <button type="submit" className="btn btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <Popup trigger={popUpState} setTrigger={setpopUpState}>
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <h1>{capitalizeFirstLetter(med)}</h1>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div style={cardContainerStyle}>
                {Array.isArray(drugInfo) &&
  drugInfo.map((drug, index) => (
    <div key={index} style={cardStyle}>
      <div>
        <h5 style={cardTitleStyle}>
          Name: {capitalizeFirstLetter(drug.brandName)}
        </h5>
        <p style={cardTextStyle}>
          Dosage: {drug.dosageForm}
        </p>
        <p style={cardTextStyle}>
          Method: {capitalizeFirstLetter(drug.strength)}
        </p>
        <button
          className="btn btn-info"
          onClick={() => addDrugs(drug)}
        >
          Add
        </button>
      </div>
    </div>
  ))}

              </div>
            )}
          </div>
        </Popup>
      </div>
    </div>
  );
}

export default MedicineSearch;
