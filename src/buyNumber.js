import React, { useEffect, useRef, useState } from "react";
import { Form, Field } from "react-final-form";
import { Input, Button } from "antd";
import { ArrowLeftOutlined, LogoutOutlined } from "@ant-design/icons";
import { CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./buyNumber.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BuyNumber = () => {
  const [loading, setLoading] = useState(false);
  const [timerValues, setTimerValues] = useState([60, 60, 60, 60, 60]);
  const timersRef = useRef([]);
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const userToken = localStorage.getItem("user");
  const [resendButtonEnabled, setResendButtonEnabled] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [cancelButtonEnabled, setCancelButtonEnabled] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    // Make your initial API call here
    fetch("https://nodejsclusters-157156-0.cloudclusters.net/user/me", {
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
          fetch("https://nodejsclusters-157156-0.cloudclusters.net/user/me", {
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

  const enableCancelButton = (index) => {
    setCancelButtonEnabled((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = true;
      return newValues;
    });
  };

  const disableCancelButton = (index) => {
    setCancelButtonEnabled((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = false;
      return newValues;
    });
  };

  const cancelNumber = async (index, form, values) => {
    try {
      setLoading(true);

      clearInterval(timersRef.current[index]);

      const cancelResponse = values?.activationId[index]
        ? await axios.get("https://nodejsclusters-157156-0.cloudclusters.net/api/cancelNumber", {
            params: {
              id: values?.activationId[index],
              phoneNumber: values?.number[index],
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          })
        : null;

      if (cancelResponse.data === "ACCESS_CANCEL") {
        toast.success(cancelResponse.data, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset the timer value
        setTimerValues((prevValues) => {
          const newValues = [...prevValues];
          newValues[index] = 0; // Set the timer value to 0
          return newValues;
        });

        form.change(`loading[${index}]`, false);
        form.change(`number[${index}]`, "");
        form.change(`otp[${index}]`, "");
      } else {
        toast.error(cancelResponse.data, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // console.error("Error canceling number:", cancelResponse.data);
      }
    } catch (error) {
      // console.error("Error calling cancelNumber API:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const enableResendButton = (index) => {
    setResendButtonEnabled((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = true;
      return newValues;
    });
  };

  const disableResendButton = (index) => {
    setResendButtonEnabled((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = false;
      return newValues;
    });
  };

  const startTimer = async (
    index,
    form,
    values,
    activationNum,
    numberSequence
  ) => {
    timersRef.current[index] = setInterval(async () => {
      try {
        const otpResponse = await axios.get(
          "https://nodejsclusters-157156-0.cloudclusters.net/api/getOtp",
          {
            params: {
              id: activationNum,
              phoneNumber: numberSequence,
            },
          }
        );

        if (otpResponse.data === "SMS_RECEIVED") {
          toast.success("OTP Received", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          form.change(`otp[${index}]`, otpResponse.data);
        } else if (otpResponse.data.includes("STATUS_OK")) {
          enableResendButton(index);
          // Continue waiting
          const activationNum = otpResponse.data.split(":")[1];
          form.change(`otp[${index}]`, activationNum); // Set the OTP field with activationNum
          clearInterval(timersRef.current[index]);
        } else {
          // Handle other response cases if needed
        }

        setTimerValues((prevValues) => {
          const newValues = [...prevValues];
          newValues[index] = newValues[index] - 1;

          if (newValues[index] <= 0) {
            clearInterval(timersRef.current[index]);
            newValues[index] = 0;
            cancelNumber(index, form, values);
            disableResendButton(index);
          } else if (newValues[index] === 60) {
            enableResendButton(index);
          }

          return newValues;
        });
      } catch (error) {
        // console.error("Error calling getOtp API:", error.message);
        clearInterval(timersRef.current[index]);
      }
    }, 1000);
  };

  const cancelNumberAfterDelay = (index, form, values) => {
    setTimeout(() => {  
      cancelNumber(index, form, values);
      disableResendButton(index);
    }, 1000);
  };

  const callApi = async (index, form, values) => {
    try {
      setLoading(true);
      disableCancelButton(index);

      const response = await axios.get("https://nodejsclusters-157156-0.cloudclusters.net/api/getNumber", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const numberSequence = response.data?.data.split(":").pop().substring(2);
      const activationNum = response.data?.data.split(":")[1];

      // Update the form values
      form.change(`number[${index}]`, numberSequence);
      form.change(`activationId[${index}]`, activationNum);

      // Reset the timer value when calling getNumber
      setTimerValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[index] = 60;
        return newValues;
      });

      // Start the timer when calling getNumber
      startTimer(index, form, values, activationNum, numberSequence);
      
      // Enable the Cancel button after 60 seconds
      setTimeout(() => {
        enableCancelButton(index);
        cancelNumberAfterDelay(index, form, values);
      }, 60000);
    } catch (error) {
      // console.error("Error calling API:", error.message);
    } finally {
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

  function calculateTotalAmount(data) {
    if (data && Array.isArray(data)) {
      const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
      return totalAmount;
    } else {
      console.error("Invalid data format");
      return null;
    }
  }

  return (
    <div className="form-list-container">
      <div className="welcome-text">Welcome {apiData?.user?.name}</div>
      <div className="logout-btn">
        <Button
          onClick={() => {
            localStorage.removeItem('user')
            navigate('/')
          }}
          style={{ background: "#306DCE", color: "#fff" }}
        >
          <LogoutOutlined /> Logout
        </Button>
      </div>
      <div className="back-btn">
        <Button
          onClick={() => navigate(-1)}
          style={{ background: "#306DCE", color: "#fff" }}
        >
          <ArrowLeftOutlined /> Back
        </Button>
      </div>
      <Form
        onSubmit={() => {}}
        render={({ handleSubmit, form, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="button-and-balance">
              <div>
                {apiData?.user?.money && (
                  <div>
                    <span className="bold-text">Points :</span>{" "}
                    {apiData?.user?.money?.inAccount}
                  </div>
                )}
                <div>
                  <span className="bold-text">In Hold:</span>{" "}
                  {apiData?.user?.money?.inAccount -
                    calculateTotalAmount(apiData?.user?.money?.inHold)}
                </div>
              </div>
              <Button
                onClick={() => navigate("/audit")}
                style={{ background: "#306DCE" }}
                type="primary"
              >
                OTP History
              </Button>
            </div>
            <h1>Generate OTP for IRCTC (₹ 0 )</h1>
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
                        disabled={!cancelButtonEnabled[index]}
                        loading={input.value}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={!resendButtonEnabled[index]} // Use state to enable/disable Resend OTP button
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
                            onCopy={() =>
                              handleCopyToClipboard(numberInput.value)
                            }
                          >
                            <Button icon={<CopyOutlined />} />
                          </CopyToClipboard>
                        }
                      />
                      <Field
                        name={`otp[${index}]`}
                        subscription={{ value: true }}
                      >
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
          </form>
        )}
      />
      <ToastContainer />
    </div>
  );
};

export default BuyNumber;
