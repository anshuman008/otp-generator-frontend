import React, { useEffect, useState } from "react";
import "./service-list.scss";
import { Button, Spin, Divider, Input, Select } from "antd";
import { numberApi, userApi } from "./api";
import { isEmptyString, isNotEmptyArray } from "./utils";
import { useNavigate } from "react-router-dom";
import { FilterIcon2 } from "./images";
import { Field, Form } from "react-final-form";
import axios from "axios";
import { LogoutOutlined } from "@ant-design/icons";

const { Option } = Select;

const ServiceList = () => {
  const [listData, setListData] = useState([]);
  const [permanentData,setPermanentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [filteredServiceList, setFilteredServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceName, setSelectedServiceName] = useState({
    id: "",
    name: "",
  });
  const [sortOrder, setSortOrder] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Make your initial API call here
    axios.get(numberApi.getService).then(
      (res) => {
        setServiceList(res?.data);
        setSelectedService(res?.data[0].id);
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    if (selectedService) {
      axios
        .get(`https://gxout2ygj1.execute-api.ap-south-1.amazonaws.com/country/get-prices/${selectedService}`, {
          wholesale: 0,
          user: "guest",
          page: 1,
        })
        .then(
          (res) => {
            setLoading(false);
            if (isNotEmptyArray(res?.data)) {
              setListData(res.data);
              setPermanentList(res.data);
            }
          },
          (err) => {
            setLoading(false);
            console.error("Error fetching data:", err);
          }
        );
    }
  }, [selectedService]);

  function convertToTitleCase(str) {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const onSearch = (e) => {
    setSearchStr(e);
    const originalData = [...permanentData];
    


    let newArray = [];
   
    for(let i = 0; i<originalData.length; i++){
      if(originalData[i].country_slug.includes(e)) newArray.push(originalData[i]);
    }

    let len = newArray.length;

     
    if (isNotEmptyArray(newArray)) {
      setListData([...newArray]);
    } else {
      setListData([...originalData]);
    }
  };

  function toggleSortOrder(val) {
    let sortedData = [...listData];

    if (sortOrder === 0) {
      if (val === "price") {
        sortedData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        setSortOrder(1);
      }
      if (val === "qty") {
        sortedData.sort((a, b) => parseFloat(a.count) - parseFloat(b.count));
        setSortOrder(1);
      }
      if (val === "country") {
        sortedData.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        setSortOrder(1);
      }
    } else if (sortOrder === 1) {
      if (val === "price") {
        sortedData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        setSortOrder(2);
      }
      if (val === "qty") {
        sortedData.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
        setSortOrder(2);
      }
      if (val === "country") {
        sortedData.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
        });
        setSortOrder(2);
      }
    } else {
      setSortOrder(0);
      sortedData = [...listData];
    }
    setListData([...sortedData]);
  }

  const filterOption = (input, option, list) => {
    return (
      option.key.toLowerCase().includes(input.toLowerCase()) ||
      option.key.toString().includes(input)
    );
  };

  return (
    <div className="form-list-container">
      <div className="logout-btn" style={{ top: "30px" }}>
        <Button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          <LogoutOutlined /> Logout
        </Button>
      </div>
      <div
        style={{
          height: "41px",
          marginBottom: "25px",
          width: "50%",
          padding: "16px 38px 40px",
          overflow: "unset",
        }}
        className="service-card"
      >
        <Form
          onSubmit={() => {}}
          render={({ handleSubmit, form, values }) => (
            <form onSubmit={handleSubmit} style={{ padding: 0 }}>
              <label>Select a Service</label>
              <Field name="service">
                {({ input }) => (
                  <Select
                    {...input}
                    showSearch
                    className="service-field"
                    style={{ width: "100%" }}
                    filterOption={filterOption}
                    value={selectedService}
                    onChange={(e) => {
                      // console.log(e,'select huaa')
                      setSelectedService(e);
                    }}
                    placeholder="Select a country..."
                  >
                    {isNotEmptyArray(serviceList) &&
                      serviceList.map((service) => (
                        <Option key={service.name} value={service.id}>
                          <img
                            src={service.icon}
                            onClick={() =>
                              setSelectedServiceName({
                                id: service?.external_id,
                                name: service?.name,
                              })
                            }
                          />
                          <span
                            onClick={() =>
                              setSelectedServiceName({
                                id: service?.external_id,
                                name: service?.name,
                              })
                            }
                            style={{
                              width: "calc(100% - 33px)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {service.name}
                          </span>
                        </Option>
                      ))}
                  </Select>
                )}
              </Field>
            </form>
          )}
        />
      </div>
      <div
        style={{
          display: loading && "flex",
          justifyContent: loading && "center",
          alignItems: loading && "center",
        }}
        className="service-card"
      >
        {loading && <Spin />}
        {!loading && (
          <>
            <Form
              onSubmit={() => {}}
              render={({ handleSubmit, form, values }) => (
                <form
                  style={{ padding: 0, paddingBottom: "30px" }}
                  onSubmit={handleSubmit}
                >
                  <div className="search-filters">
                    <Field name="search-field">
                      {({ input: otpInput }) => (
                        <Input
                          type="text"
                          placeholder="Search for services by country"
                          value={searchStr}
                          onChange={(e) => onSearch(e.target.value)}
                        />
                      )}
                    </Field>
                  </div>
                </form>
              )}
            />
            <div className="filter-header">
              <div
                className="country-filter"
                onClick={() => toggleSortOrder("country")}
              >
                Country <img style={{ width: "10px" }} src={FilterIcon2} />
              </div>
              <div className="last-three">
                <div
                  onClick={() => toggleSortOrder("qty")}
                  className="qty-filter"
                >
                  Qty <img style={{ width: "10px" }} src={FilterIcon2} />
                </div>
                <div
                  onClick={() => toggleSortOrder("price")}
                  className="price-filter"
                >
                  Price <img style={{ width: "10px" }} src={FilterIcon2} />
                </div>
                <div className="btn-gap"></div>
              </div>
            </div>
            <div className="countries-list">
              {listData &&
                listData.map((country, countryIndex) => (
                  <>
                    <div key={countryIndex} className="service-countries">
                      <div className="country-flag">
                        <img src={country?.icon} />
                        <div className="country-name">
                          {convertToTitleCase(country?.country_slug)}
                        </div>
                      </div>
                      <div className="right-contents">
                        <div className="quantity">{country?.count}</div>
                        <Divider type="vertical" />
                        <div className="price">
                          ₹{" "}
                          {(
                            (Number(country?.price) * 20) / 100 +
                            Number(country?.price)
                          ).toFixed(2)}
                        </div>
                        <div className="buy-btn">
                          <Button
                            onClick={() =>
                              navigate("/listing", {
                                state: {
                                  service: selectedServiceName?.id,
                                  serviceName: selectedServiceName?.name,
                                  amount:
                                    (Number(country?.price) * 20) / 100 +
                                    Number(country?.price),
                                  countryName: country.country_slug,
                                  country: country.country_external_id,
                                },
                              })
                            }
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
