import React, { useEffect, useRef, useState } from "react";
import { Field } from "react-final-form";
import { Input, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./buyNumber.scss";
import io from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import { numberApi } from "./api";
import NoMoneyModal from "./no-money-modal";

const BuyNumber = ({ values, form }) => {
  const [loading, setLoading] = useState(false);
  const [timerValues, setTimerValues] = useState([300, 60, 60, 60, 60]);
  const navigate = useNavigate();
  const location = useLocation();
  const [moneyModal, setMoneyModal] = useState(false);
  const [apiData, setApiData] = useState([]);
  const userToken = localStorage.getItem("user");
  const [cancelButtonEnabled, setCancelButtonEnabled] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const socket = io("http://localhost:5001", {
    auth: {
      token: userToken,
    },
    cors: {
      origin: "http://localhost:5001",
      methods: ["GET", "POST"],
    },
  });

  useEffect(() => {
    console.log("Form Object:", form);
  }, [form]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    fetch(numberApi.me, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
        if (data?.error) {
          let newPass = prompt("Enter your new password");
          while (!newPass) {
            newPass = prompt("Enter your new password");
          }
          fetch(numberApi.me, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            method: "PATCH",
            body: JSON.stringify({ password: newPass }),
          });
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const disableCancelButton = (index) => {
    setCancelButtonEnabled((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = false;
      return newValues;
    });
  };

  const moneyInHold =
    apiData?.user?.money?.inHold
      ?.map((item) => item.amount)
      .reduce((total, currentAmount) => total + (currentAmount || 0), 0)
      .toFixed(2) || 0;
  const totalPoints = apiData?.user?.money?.inAccount - moneyInHold;

  socket.on("cancelOperation", (response) => {
    try {
      console.log("Cancel Number Response:", response);
      if (response.data) {
        const fieldIndex = form
          .getState()
          .values.number.indexOf(response.number);

        if (fieldIndex !== -1) {
          form.change(`number[${fieldIndex}]`, "");
          form.change(`otp[${fieldIndex}]`, "");
        } else {
          console.warn(
            `Cancelled number ${response.number} not found in form.`
          );
        }

        toast.success("Number Cancelled Successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (!response.data) {
        toast.error("Unexpected Error", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error handling server response:", error.message);
    } finally {
      setLoading(false);
    }
  });

  const cancelNumber = async (index, form, values) => {
    socket.emit("cancelNumber", {
      id: values?.activationId[index],
      phoneNumber: values?.number[index],
    });

    socket.once("responseC", (response) => {
      try {
        console.log("Cancel Number Response:", response);
        if (response.data) {
          toast.success(response.data, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          setTimerValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = 0;
            return newValues;
          });

          form.change(`loading[${index}]`, false);
          form.change(`number[${index}]`, "");
          form.change(`otp[${index}]`, "");
        } else if (response.error) {
          toast.error(response.error, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error handling server response:", error.message);
      } finally {
        setLoading(false);
      }
    });
  };

  socket.on("otpResponse", (response) => {
    try {
      if (response.data) {
        const fieldIndex = form
          .getState()
          .values.number.indexOf(response.number);
        form.change(`otp[${fieldIndex}]`, response.data);
      } else {
        toast.error(response.msg, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error calling cancelNumber API:", error.message);
    } finally {
      setLoading(false);
    }
  });

  const resendOtp = async (index, form, values) => {
    socket.emit("resendOtp", {
      id: values?.activationId[index],
      phoneNumber: values?.number[index],
    });
    socket.once("resendResponse", (response) => {
      try {
        if (response.data) {
          const fieldIndex = form
            .getState()
            .values.number.indexOf(response.number);
          form.change(`otp[${fieldIndex}]`, response.data);
        } else {
          toast.error(response.msg, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error calling cancelNumber API:", error.message);
      } finally {
        setLoading(false);
      }
    });
  };

  const callApi = (index, form) => {
    if (totalPoints <= 1) {
      setMoneyModal(true);
    }
    try {
      setLoading(true);
      disableCancelButton(index);
      const { amount, service, country, countryName } = location?.state;

      socket.emit("getNumber", {
        amount: amount,
        service: service,
        country: country,
        countryName: countryName,
      });

      socket.once("responseA", (data) => {
        try {
          console.log("Response A:", data);

          const numberSequence = data?.data?.split(":").pop().substring(2);
          const activationNum = data?.data?.split(":")[1];

          form.change(`number[${index}]`, numberSequence);
          form.change(`activationId[${index}]`, activationNum);
        } catch (error) {
          console.error("Error handling server response:", error.message);
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error calling API:", error.message);
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    if (text) {
      toast.success("Copied to clipboard", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error("Content Not Found", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="form-list-container" style={{ background: "#fff" }}>
      <div className="welcome-text">Welcome {apiData?.user?.name} !</div>
      <div className="button-and-balance">
        <div>
          {apiData?.user?.money && (
            <div className="points-and-text">
              <span className="bold-text">Points :</span>{" "}
              {totalPoints.toFixed(2)}
            </div>
          )}
          <div className="points-and-text">
            <span className="bold-text">In Hold:</span>{" "}
            {Number(moneyInHold).toFixed(2)}
          </div>
        </div>
        <Button onClick={() => navigate("/audit")} type="primary">
          OTP History
        </Button>
      </div>
      <h1>
        Generate OTP for{" "}
        <span style={{ textTransform: "capitalize" }}>
          {location?.state?.serviceName}
        </span>{" "}
        (₹ {location?.state?.amount.toFixed(2)} )
      </h1>
      {[0, 1, 2, 3, 4].map((index) => (
        <div key={index} className="row">
          <Field name={`loading[${index}]`} initialValue={false}>
            {({ input }) => (
              <>
                <Button
                  onClick={() => callApi(index, form, values)}
                  disabled={input.value}
                  loading={input.value}
                >
                  Buy Next
                </Button>
                <Button
                  onClick={() => cancelNumber(index, form, values)}
                  // disabled={!cancelButtonEnabled[index]}
                  loading={input.value}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => resendOtp(index, form, values)}
                  // disabled={!resendButtonEnabled[index]} // Use state to enable/disable Resend OTP button
                  loading={input.value}
                >
                  Resend OTP
                </Button>
              </>
            )}
          </Field>
          <Field
            name={`number[${index}]`}
            initialValue=""
            subscription={{ value: true }}
          >
            {({ input: numberInput }) => (
              <>
                <Input
                  type="text"
                  disabled
                  value={numberInput.value}
                  onChange={(e) => numberInput.onChange(e.target.value)}
                  addonAfter={
                    <CopyToClipboard
                      text={numberInput.value}
                      onCopy={() => handleCopyToClipboard(numberInput.value)}
                    >
                      <Button icon={<CopyOutlined />} />
                    </CopyToClipboard>
                  }
                />
                <Field name={`otp[${index}]`} subscription={{ value: true }}>
                  {({ input: otpInput }) => (
                    <Input
                      disabled
                      type="text"
                      placeholder="Enter OTP"
                      value={otpInput.value}
                      onChange={(e) => otpInput.onChange(e.target.value)}
                    />
                  )}
                </Field>
                <span className="timer">
                  {timerValues[index] === 60
                    ? `1:00`
                    : `00:${timerValues[index]}`}
                </span>
              </>
            )}
          </Field>
        </div>
      ))}
      <ToastContainer />
      {moneyModal && (
        <NoMoneyModal
          openModal={moneyModal}
          cancelModal={() => setMoneyModal(false)}
        />
      )}
    </div>
  );
};

export default BuyNumber;
