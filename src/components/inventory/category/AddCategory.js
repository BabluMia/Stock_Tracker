import React, { useEffect, useState } from "react";
import "./css/category.css";
import add from "./../../../assets/Icon/add.svg";
// import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import eye from "./../../../assets/Icon/eye.svg";
import { InputGroup } from "react-bootstrap";
import RequiredLabel from "../../CustomCommons/RequiredLabel";
import SelectDropDown from "../../CustomCommons/SelectDropDown";
import axios from "axios";
import { BASE_URL } from "../../Const/Url";
import { handleInputs } from "../../../utils/HandleInputs";
import { showToast } from "../../../utils/ToastHelper";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import * as path from '../../Routes/RoutePaths'
import { can_add_category, has_permissions } from "../../CustomCommons/utils";
import Permission from "../../CustomCommons/Permission";
const AddCategory = () => {
  const history = useHistory()
  const [categoryList, setcategoryList] = useState([]);
  const [categoryAllData, setcategoryAllData] = useState({
    category_name: "",
    category_description: "",
  });
  const [Categoryswitch, setCategoryswitch] = useState(true);
  const [Thumb, setThumb] = useState(null);
  const [selectedOptionCategory, setSelectedOptionCategory] = useState(null);
  const [fileName, setFileName] = useState("");
  const [URL, setURL] = useState("");
  const fileHandle = (e) => {
    setThumb(e.target.files[0]);
    setFileName(e.target.files[0].name);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    setURL(reader.result);
    reader.onload = () => {
      if (reader.readyState === 2) {
        setURL(reader.result);
      }
    };
  };
  const removeImg = () => {
    swal({
      title: "Are you sure?",
      text: "Once Removed, you will not be able to recover this  file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setURL("");
        setFileName("");
        swal("Poof! Your  file has been Removed!", {
          icon: "success",
        });
      } else {
        swal("Your  file is safe!");
      }
    });
  };

  const clearData = () => {
    setThumb(null);
    setcategoryAllData({
      category_name: "",
      category_description: "",
    });
    setURL("");
    setFileName("");
    setSelectedOptionCategory(null);
  };

  const toggleSwitch = () => {
    setCategoryswitch((current) => !current);
  };

  const getCategory = () => {
    const url = `${BASE_URL}api/v1/inventory/category/`;
    axios
      .get(url)
      .then((res) => {
        console.log(res.data.data.results);
        const result = res.data.data.results;
        const options = result.map((curr) => ({
          label: curr.name,
          value: curr.id,
        }));
        setcategoryList(options);
      })
      .catch((err) => {
        const message = JSON.parse(err.request.response).message;
        console.log(err.request.response);
      });
  };
  const PostCategory = () => {
    const url = `${BASE_URL}api/v1/inventory/category/`;
    const data = new FormData();
    data.append("name", categoryAllData["category_name"]);
    data.append("description", categoryAllData["category_description"]);
    Thumb != null && data.append("thumb", Thumb);
    console.log("selectedOptionCategory.value", selectedOptionCategory.value);
    if (
      selectedOptionCategory !== null &&
      selectedOptionCategory !== undefined &&
      selectedOptionCategory.value !== null &&
      selectedOptionCategory.value !== undefined &&
      typeof selectedOptionCategory.value !== "string"
    ) {
      data.append("parent_name", selectedOptionCategory.value);
    }
    data.append("is_active", Categoryswitch);
    if (data.name === "") {
      showToast("error", "Category name can't be empty..");
      return 0;
    } else if (data.description === "") {
      showToast("error", "Category description can't be empty..");
      return 0;
    }
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.status) {
          clearData();
          showToast("success", "Category Added.");
          history.push(path.category_list)
        }
      })
      .catch((err) => {
        const message = JSON.parse(err.request.response).message;
        const errorMsg = JSON.parse(err.request.response).errors;
        console.log(errorMsg);
        for (let key in errorMsg) {
          showToast("error", `${key} : ${errorMsg[key][0]}`);
        }
        showToast("error", message);
      });
  };

  useEffect(() => {
    
    getCategory();
  }, []);

  const handleCancelButton = () =>{
    history.push(path.category_list)
  }

  if(!has_permissions(can_add_category)){
    return <Permission/>
  }
  return (
    <div className="categorey-parent new-categorey-parent an">
      <div className="bg-white  add-div">
        <div className="d-flex align-items-center" style={{ padding: "20px 35px ", border: "0.5px solid #E0E0E0" }}>
          {/* <img src={add} alt="" /> */}
          <h3 style={{ fontSize: "23px", marginTop: "6px",  }}>Add New Category</h3>
        </div>
        {/* --------------category form--------- */}
        <div
          style={{
            padding: "20px 35px ",
            borderBottom: " 0.5px solid #E0E0E0",
            borderRight: " 0.5px solid #E0E0E0",
            borderLeft: "0.5px solid #E0E0E0",
          }}
        >
          {/* -----------name-------------- */}
          <RequiredLabel text={"Name"} />
          <InputGroup className="mb-3">
            <Form.Control
              aria-label="Username"
              aria-describedby="basic-addon1"
              style={{ backgroundColor: "#FAFAFA" }}
              name="category_name"
              value={categoryAllData["category_name"]}
              onChange={(e) => handleInputs(e, setcategoryAllData)}
            />
          </InputGroup>
          {/* ---------------parent---------------- */}
          {/* <p>*</p> */}
          {/* <RequiredLabel text={""} /> */}
          <p>Parent Category</p>

          <div className="mb-3" style={{ backgroundColor: "#FAFAFA" }}>
            {/* <SelectDropDown options={options} /> */}

            <SelectDropDown  options={categoryList && categoryList} setSelectedOptionCategory={setSelectedOptionCategory} />
          </div>
          {/* <RequiredLabel text={""} /> */}

          <p>Description</p>
          <Form.Control
            as="textarea"
            placeholder=""
            className="mb-3"
            style={{
              height: "100px",
              resize: "none",
              backgroundColor: "#FAFAFA",
            }}
            name="category_description"
            value={categoryAllData["category_description"]}
            onChange={(e) => handleInputs(e, setcategoryAllData)}
          />
          {/* --------img----------- */}
          {/* <p>Images</p>
          <div style={{overflowX:'hidden'}}>
            <input type="file" style={{overflowX:'hidden'}}  className="fileChoose" />
          </div> */}

          <div className="row d-flex justify-content-between">
            <div className="col-12 col-md-5 ">
              <h5 style={{ marginTop: "30px", }}>Thumbnail image </h5> <span></span>
              <p style={{ color: "#8E8E93" }}>( Select your file & uploaded )</p>
              <div
                className="w-100 browse-main d-flex align-items-center"
                style={{
                  height: "55px",
                  border: "1px solid #E0E0E0",
                  borderRadius: "7px",
                  overflowX: "hidden",
                }}
              >
                {fileName === "" ? (
                  <p className="my-2 ms-2" style={{ color: "#4F4F4F" }}>
                    No File Choosen
                  </p>
                ) : (
                  <p className="my-2 ms-2" style={{ color: "#4F4F4F" }}>
                    {" "}
                    {fileName}
                  </p>
                )}

                <div className="file-up">
                  <input type="file" onChange={(e) => fileHandle(e)} accept="image/*" />
                  <p>Browse</p>
                </div>
              </div>
              {URL && (
                <div className="my-2">
                  <img height={90} width={90} src={URL} alt="" /> <br />
                  <button onClick={removeImg} className="remove-btn btn btn-small mt-1  rounded" style={{border:'1px solid gray !important'}}>Remove</button>
                </div>
              )}
            </div>

            {/* ----------status--------- */}
            <div className="col-12 col-md-5">
              <h5 style={{ marginTop: "30px" }}>Status</h5>
              <p style={{ color: "#8E8E93" }}>( If the Category Option is available )</p>
              <div className="row mr-4">
                <div className=" d-flex justify-content-between col-12 py-3" style={{ backgroundColor: "#F2F2F7", borderRadius: "8px" }}>
                  <div className="d-flex w-100">
                    <div
                      className="d-flex py-1 justify-content-center align-items-center"
                      style={{
                        backgroundColor: "#212121",
                        width: "32px",
                        height: "32",
                        borderRadius: "3px",
                      }}
                    >
                      <img src={eye} alt="" />
                    </div>
                    <span className="mx-3">{Categoryswitch ? "ON" : "OFF"}</span>
                  </div>

                  <div class="form-check form-switch ">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      width={40}
                      height={40}
                      name="category_active"
                      checked={Categoryswitch}
                      onClick={toggleSwitch}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ------------Save And Cancel------------ */}
          <div className="mt-2 mt-md-4" style={{ marginLeft: "-10px" }}>
            <button onClick={PostCategory} className=" save-btn  me-2 mt-2" style={{ background: "#000", color: "white" }}>
              Save
            </button>
            <button onClick={handleCancelButton} className="save-btn mt-2" style={{ border: ".4px solid #E0E0E0 !important" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
