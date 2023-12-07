import React, { useRef, useState } from "react";
import { Form, Field } from "react-final-form";
import { Input, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./buyNumber.scss";
import axios from "axios";

const BuyNumber = () => {
  const [loading, setLoading] = useState(false);
  const [timerValues, setTimerValues] = useState([60, 60, 60, 60, 60]);
  const timersRef = useRef([]);

  const cancelNumber = async (index, form, values) => {
    try {
      setLoading(true);

      clearInterval(timersRef.current[index]);

      const cancelResponse = values?.activationId[index]
        ? await axios.get("http://localhost:5001/api/cancelNumber", {
            params: {
              id: values?.activationId[index],
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
          newValues[index] = 60;
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
        console.error("Error canceling number:", cancelResponse.data);
      }
    } catch (error) {
      console.error("Error calling cancelNumber API:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = async (index, form, values, activationNum) => {
    timersRef.current[index] = setInterval(async () => {
      try {
        const otpResponse = await axios.get(
          "http://localhost:5001/api/getOtp",
          {
            params: {
              id: activationNum,
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
          // Continue waiting
          const activationNum = otpResponse.data.split(":")[1];
          console.log(activationNum, "num");
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
          }

          return newValues;
        });
      } catch (error) {
        console.error("Error calling getOtp API:", error.message);
        clearInterval(timersRef.current[index]);
      }
    }, 1500);
  };

  const callApi = async (index, form, values) => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:5001/api/getNumber");
      const numberSequence = response.data.split(":").pop().substring(2);
      const activationNum = response.data.split(":")[1];

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
      startTimer(index, form, values, activationNum);
    } catch (error) {
      console.error("Error calling API:", error.message);
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

  return (
    <div className="form-list-container">
      <Form
        onSubmit={() => {}}
        render={({ handleSubmit, form, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="button-and-balance">
              <div>Points - 50</div>
              <Button>Audit</Button>
            </div>
            <h1>Generate OTP for betvet (₹ 7 )</h1>
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
                        disabled={input.value}
                        loading={input.value}
                      >
                        Cancel
                      </Button>
                      <Button disabled={true} loading={input.value}>
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
