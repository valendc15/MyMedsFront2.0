import PharmacyNavBar from "./PharmacyNavBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from 'react-toastify';
import MedicNavBar from "./MedicNavBar";
import { Audio } from "react-loader-spinner";


function ViewRequests() {
  const [requestList, setRequestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [dniFilter, setDniFilter] = useState("");
  const [showDispenseConfirmation, setShowDispenseConfirmation] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [currentRecipeID, setCurrentRecipeID] = useState("");
  const [actionCompleted, setActionCompleted] = useState(false);
  const [actionCompleted2, setActionCompleted2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, [currentPage, dniFilter,actionCompleted,actionCompleted2]);

  const changeDNI = (event) => {
    setDniFilter(event.target.value);
  };

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const id = sessionStorage.getItem("id");
      let url = `http://localhost:8080/doctor/viewRecipes/${id}?status=IN_PROGRESS&page=${currentPage}&size=${3}&patientID=${dniFilter}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();

      if (!Array.isArray(data.recipes)) {
        throw new Error("Invalid data format");
      }

      setRequestList(data.recipes);
      setPageCount(data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const navigate = useNavigate();

  function dispense(recipeID) {
    setShowDispenseConfirmation(true);
    setCurrentRecipeID(recipeID);
  }

  function discard(recipeID) {
    setShowDiscardConfirmation(true);
    setCurrentRecipeID(recipeID);
  }

  function confirmDispense() {
    setShowDispenseConfirmation(false);
    setIsLoading(true)
    acceptRequest(currentRecipeID)
    setActionCompleted(true);
  }
  
  function confirmDiscard() {
    setShowDiscardConfirmation(false);
    setIsLoading(true)
    rejectRequest(currentRecipeID);
    setActionCompleted2(true)
  }

  function acceptRequest(recipeID) {
    fetch(`http://localhost:8080/doctor/AproveRecipe/${sessionStorage.getItem("id")}?recipeID=${recipeID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization:`Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(recipeID);
        if (response.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        }
        else if (response.status===409){
          response.json().then((data) => {
            data.drugDTOS.forEach((drug) => {
              toast.error(`${drug.brandName} is out of stock!`);
            });
          });
        }
        else if (response.status==200){
          window.location.reload(false)//FALSE
          toast.success("Recipe Dispensed!")
        }
      });
  }

  function rejectRequest(recipeID) {
    fetch(`http://localhost:8080/doctor/DeclineRecipe/${recipeID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        }
        else if (response.status===200){
          window.location.reload(false)
          setIsLoading(false);
        }
      });
  }
  return (
    <div>
      {isLoading ? (
        <div className="loading-wrapper">
      <Audio
        height="80"
        width="80"
        radius="9"
        color="green"
        aria-label="loading"
        wrapper-style
        wrapper-class
      ></Audio>
      <h3>Loading...</h3>
    </div>
      ) : (
        <div>
          <MedicNavBar />
          <div className="containerinput mt-3">
          <input
            type="number"
            className="input"
            onChange={changeDNI}
            placeholder="Search by patient DNI"
          />

          </div>
          <div className="row m-2">
            {requestList.length === 0 ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 225 }}>
                <h3>No requests found.</h3>
              </div>
            ) : (
              requestList.map((request) => {
                return (
                  <div key={request.recipeID} className="col-sm-6 col-md-4 v my-2">
                    <div className="card shadow-sm w-100" style={{ minHeight: 225 }}>
                      <div className="card-body">
                        <h5 className="card-title text-center h2">Patient: {request.patientName}</h5>
                        <h6 className="card-subtitle mb-2 text-muted text-center">
                          RecipeID: {request.recipeID}
                        </h6>
                        <h6 className="card-subtitle mb-2 text-muted text-center">
                          Patient DNI: {request.patientID}
                        </h6>
                        <p className="card-text">Drugs:</p>
                        <ul>
                          {request.drug.map((drug) => (
                            <li key={drug.brandName}>
                              <p>Brand Name: {drug.brandName}</p>
                              <p>Strength: {drug.strength}</p>
                              <p>Dosage: {drug.dosageForm}</p>
                            </li>
                          ))}
                        </ul>
                        <div className="d-flex justify-content-between mt-3">
                          <div>
                            <button className="btn btn-success" style={{ marginRight: "10px" }} onClick={() => dispense(request.recipeID)}>
                              Accept
                            </button>
                          </div>
                          <div>
                            <button className="btn btn-danger" style={{ marginLeft: "10px" }} onClick={() => discard(request.recipeID)}>
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
  
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
  
          {showDispenseConfirmation && (
            <div className="popup" style={{ zIndex: 999 }}>
              <div className="popup-inner">
                <h3>Confirm Dispense</h3>
                <p>Are you sure you want to accept this request?</p>
                <p>recipeID: {currentRecipeID}</p>
                <div className="popup-buttons">
                  <button className="btn btn-success" style={{ marginRight: '20px' }} onClick={confirmDispense}>
                    Yes
                  </button>
                  <button className="btn btn-danger" onClick={() => setShowDispenseConfirmation(false)}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
  
          {showDiscardConfirmation && (
            <div className="popup" style={{ zIndex: 999 }}>
              <div className="popup-inner">
                <h3>Confirm Discard</h3>
                <p>Are you sure you want to reject this request?</p>
                <p>recipeID: {currentRecipeID}</p>
                <div className="popup-buttons">
                  <button className="btn btn-success " style={{ marginRight: '20px' }} onClick={confirmDiscard}>
                    Yes
                  </button>
                  <button className="btn btn-danger" onClick={() => setShowDiscardConfirmation(false)}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
  export default ViewRequests;
  