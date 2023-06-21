import PharmacyNavBar from "./PharmacyNavBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function PharmacyRequest() {
  const [requestList, setRequestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [dniFilter, setDniFilter] =useState("")

  useEffect(() => {
    fetchData();
  }, [currentPage, dniFilter]);

  const changeName = (event) => {
   setDniFilter(event.target.value);
  };

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const id = sessionStorage.getItem("id");
      let url = `http://localhost:8080/pharmacy/getRecipesByStatus/${id}?status=APPROVED&page=${currentPage}&size=${3}&patientID=${dniFilter}`;


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

      console.log(data);

      setRequestList(data.recipes);
      setPageCount(data.totalPages-1);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const navigate = useNavigate();

  function dispense(recipeID) {
    fetch(`http://localhost:8080/pharmacy/markRecipe/${recipeID}`, {
      method: "PUT",
      headers: { "content-type": "application/json", Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    })
      .then((response) => {
        if (response.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        }
        return response.json();
      });
  }

  function discard(recipeID) {
    fetch(`http://localhost:8080/pharmacy/rejectRecipe/${recipeID}`, {
      method: "PUT",
      headers: { "content-type": "application/json", Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    })
      .then((response) => {
        if (response.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        }
        return response.json();
      });
  }

  return (
    <div>
      <PharmacyNavBar />
      <input type="number" className="form-control" onChange={changeName} placeholder="Search by patient DNI" />
      <div className="row m-2">
        {requestList.map((request) => {
          return (
            <div key={request.recipeID} className="col-sm-6 col-md-4 v my-2">
              <div className="card shadow-sm w-100" style={{ minHeight: 225 }}>
                <div className="card-body">
                  <h5 className="card-title text-center h2">Patient: {request.patientName}</h5>
                  <h6 className="card-subtitle mb-2 text-muted text-center">
                    recipeID: {request.recipeID}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted text-center">
                    patientID: {request.patientID}
                  </h6>
                  <p className="card-text">Drugs:</p>
                  <ul>
  {request.drug.map(drug => (
    <li key={drug.brandName}>
      <p>Brand Name: {drug.brandName}</p>
      <p >Strength: {drug.strength}</p>
      <p >Dosage: {drug.dosageForm}</p>
    </li>
  ))}
</ul>
                </div>
              </div>
            </div>
          );
        })}
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
    </div>
  );
}

export default PharmacyRequest;
