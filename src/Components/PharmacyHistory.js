import { ExceptionMap } from "antd/es/result"
import PharmacyNavBar from "./PharmacyNavBar"
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Collapse } from 'antd';
import ReactPaginate from "react-paginate";

const { Panel } = Collapse;

function PharmacyHistory(){

  const [requestList, setRequestList] = useState([]);
  const [state, setState]=useState("APPROVED")
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentPage, state]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const id = sessionStorage.getItem("id");
      let url = `http://localhost:8080/pharmacy/getRecipesByStatus/${id}?status=${state}&page=${currentPage}&size=${4}`;

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



    const cardStyle = {
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "10px",
        margin: "10px",
        width: "300px",
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


    return(
        <div>
            <PharmacyNavBar></PharmacyNavBar>
            <h1>Recipes</h1>
            <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {state === 'APPROVED' ? 'Showing recipes in progress' : state === 'DISPENSED' ? 'Showing dispensed recipess' : 'Showing rejected recipes'}
      </button>
      <ul className="dropdown-menu">
        <li><a className={`dropdown-item ${state === 'APPROVED' ? 'active' : ''}`} href="#" onClick={() =>setState('APPROVED')}>Show recipes in progress</a></li>
        <li><a className={`dropdown-item ${state === 'DISPENSED' ? 'active' : ''}`} href="#" onClick={() => setState('DISPENSED')}>Show dispensed recipes</a></li>
        <li><a className={`dropdown-item ${state === 'REJECTED' ? 'active' : ''}`} href="#" onClick={() => setState('REJECTED')}>Show rejected recipes</a></li>
      </ul>
    </div>
      {requestList.length === 0 ? (
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          No Recipes found.
        </h3>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {requestList.map((request) => (
            <div key={request.id} style={cardStyle}>
              <div>
                <h5 style={cardTitleStyle}>Doctor: {request.doctorName}</h5>
                <p style={cardTextStyle}>Requested Medicines:</p>
<ul>
  {request.drug.map(drug => (
    <li key={drug.brandName}>
      <p style={cardTextStyle}>Brand Name: {drug.brandName}</p>
      <p style={cardTextStyle}>Strength: {drug.strength}</p>
      <p style={cardTextStyle}>Dosage: {drug.dosageForm}</p>
    </li>
  ))}
</ul>
                <p style={cardTextStyle}>Patient ID: {request.patientID}</p>
                <p style={cardTextStyle}>Request ID: {request.recipeID}</p>
              </div>
            </div>
          ))}
        </div>
      )}
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
    </div>
  );

}

export default PharmacyHistory;