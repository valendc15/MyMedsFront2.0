import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SuccessPage from "./SuccessMessage";
import FailurePage from "./FailureMessage";

function Scanner() {
  const [scanResult2, setScanResult2] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result) {
      setScanResult2(result)
      sendResult(result)
    }

    function error(err) {
      toast.error(err);
    }
  }, []);

  function sendResult(scanResult) {
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
        } else {
          setSuccess(false)
        }
      });
  }

  function dispense(scanResult) {
    fetch(`http://localhost:8080/pharmacy/markRecipe/${scanResult}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status == 401) {
          localStorage.clear();
          navigate("/login");
        }
        return response.json();
      });
  }
  
  return (
    <div>
      <h1>Scan a QR code</h1>
      {scanResult2 ? (
        success ? (
          <SuccessPage></SuccessPage>
        ) : (
          <FailurePage></FailurePage>
        )
      ) : (
        <div id="reader"></div>
      )}
      <div id="reader"></div>
    </div>
  );
}
export default Scanner;
