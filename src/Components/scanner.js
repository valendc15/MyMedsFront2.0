import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Alert } from "react-bootstrap";
import PharmacyNavBar from "./PharmacyNavBar";
import SuccessPage from "./SuccessMessage";
import FailurePage from "./FailureMessage";

function RecipePopup({ recipe, onClose, onAccept, onReject }) {
  const navigate = useNavigate();
  const handleAccept = () => {
    fetch(
      `http://localhost:8080/pharmacy/markRecipe/${recipe.recipeID}?pharmacyID=${sessionStorage.getItem(
        `id`
      )}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        } else if (response.status === 200) {
          onAccept();
        }
      })
      .catch((error) => {
        console.error("Error accepting recipe:", error);
      
      });
  };

  const handleReject = () => {
    fetch(`http://localhost:8080/pharmacy/rejectRecipe/${recipe.recipeID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        } else if (response.status === 200) {
          onReject();
        }
      })
      .catch((error) => {
        console.error("Error rejecting recipe:", error);
      });
  };

  return (
    <Modal show={true} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="text-black display-16">Recipe Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-muted">Recipe ID: {recipe.recipeID}</h5>
        <p className="mb-4">
          <span className="fw-bold">Patient Name:</span> {recipe.patientName}
        </p>
        <p className="mb-4">
          <span className="fw-bold">Doctor Name:</span> {recipe.doctorName}
        </p>
        <h6 className="text-secondary">Medications:</h6>
        <ul className="list-group list-group-flush">
          {recipe.drug.map((drug) => (
            <li key={drug.drugID} className="list-group-item bg-light mb-3">
              <div>
                <span className="fw-bold">Brand Name:</span> {drug.brandName}
              </div>
              <div>
                <span className="fw-bold">Dosage Form:</span> {drug.dosageForm}
              </div>
              <div>
                <span className="fw-bold">Strength:</span> {drug.strength}
              </div>
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between bg-light">
        <Button variant="success" onClick={handleAccept} className="btn-lg">
          Accept
        </Button>
        <Button variant="danger" onClick={handleReject} className="btn-lg">
          Reject
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function Scanner() {
  const [scanResult2, setScanResult2] = useState(null);
  const [successSt, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recipeData, setRecipeData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sendResult = useCallback(
    (scanResult) => {
      fetch(`http://localhost:8080/pharmacy/verifyByQr/${scanResult}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          console.log(response.status);
          if (response.status === 401) {
            sessionStorage.clear();
            navigate("/login");
          } else if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error verifying QR code");
          }
        })
        .then((data) => {
          if (data !== null) {
            setRecipeData(data);
            setShowPopup(true);
          } else {
            setSuccess(false);
            setReady(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setError("Error verifying QR code");
        });
    },
    [navigate]
  );

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.clear();

    function success(result) {
      scanner.clear();
      setScanResult2(result);
      sendResult(result); // Call sendResult function when the scan is successful
    }

    function error(err) {
      // toast.error(err);
    }

    scanner.render(success, error);

    return function cleanup() {
      scanner.clear();
    };
  }, [sendResult]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecipeData(null);
  };

  const handleAcceptRecipe = () => {
    setSuccess(true);
    setReady(true);
    setShowPopup(false);
  };

  const handleRejectRecipe = () => {
    setShowPopup(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      navigate("/pharmacyRequest");
    }, 1500);
  };

  return (
    <div>
      <PharmacyNavBar />
      <h1>Scan a QR code</h1>

      {scanResult2 && ready === true ? (
        successSt ? (
          <SuccessPage />
        ) : (
          <FailurePage />
        )
      ) : (
        <div id="reader"></div>
      )}

      {showPopup && recipeData && (
        <RecipePopup
          recipe={recipeData}
          onClose={handleClosePopup}
          onAccept={handleAcceptRecipe}
          onReject={handleRejectRecipe}
        />
      )}

      <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
        Recipe Rejected
      </Alert>
    </div>
  );
}

export default Scanner;
