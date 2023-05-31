import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SuccessPage from "./SuccessMessage";
import FailurePage from "./FailureMessage";
import PharmacyNavBar from "./PharmacyNavBar"

function Scanner() {
  const [scanResult2, setScanResult2] = useState(null);
  const [successSt, setSuccess] = useState(false)
  const [ready, setReady]=useState(false)
  const navigate = useNavigate();

  const dispense = useCallback((recipeID) => {
    fetch(`http://localhost:8080/pharmacy/markRecipe/${recipeID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
 
          localStorage.clear();
          navigate("/login");
        }
        return response.json();
      });
  }, [navigate])

  const sendResult = useCallback((scanResult) => {
    fetch(`http://localhost:8080/pharmacy/verifyByQr/${scanResult}`, {
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
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data === true) {
          dispense(scanResult);
          setSuccess(true);
          setReady(true)
        } else {
          setSuccess(false)
          setReady(true)
        }
      });
  }, [dispense, navigate])

   useEffect(() => {
    console.log("HOJOHOHOHOHOOHOHOO")
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    })

    scanner.clear()
  
    function success(result) {
      scanner.clear()
      setScanResult2(result);
      scanner.stop().then((ignore)=>{
      });
      sendResult(result); // Call sendResult function when the scan is successful
    }

    function error(err) {
      // toast.error(err);
    }

    scanner.render(success, error);

    return function cleanup() {
      scanner.clear()
    }
   }, [sendResult]);

  
  
  return (
    <div>
      <PharmacyNavBar></PharmacyNavBar>
      <h1>Scan a QR code</h1>
    
      {scanResult2 && ready===true ? (
        successSt ? (
          <SuccessPage />
        ) : (
          <FailurePage />
        )
      ) : (
        <div id="reader"></div>
      )}
    </div>
  );
}
export default Scanner;
