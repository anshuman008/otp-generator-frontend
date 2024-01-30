import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { isNotEmptyObject } from "./utils";
import { adminApi } from "./api";
import axios from "axios";

const backgroundColorPlugin = {
  id: "backgroundColorPlugin",
  beforeDraw: (chart) => {
    const ctx = chart.canvas.getContext("2d");
    ctx.fillStyle = "white"; // Set your desired color
    ctx.fillRect(0, 10, chart.width, chart.height);
  },
};

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  backgroundColorPlugin
);

const chartOptions = {
  plugins: {
    title: {
      display: true,
      text: "Earning Statistics",
    },
  },
  responsive: true,
  backgroundColorPlugin: true,
};

const AdminDashboard = () => {
  const [listData, setListData] = useState([]);
  const userToken = localStorage.getItem("admin");

  useEffect(() => {
    // Make your initial API call here
    // setLoading(true);
    axios.post(adminApi.dashboard, {
        "to": "2023-12-29",
        "from": "2023-12-20",
      })
      .then((data) => {
        // setLoading(false);
        console.log(data, "data");
        if (isNotEmptyObject(data)) {
          setListData(data?.data);
        }
      })
      .catch((error) => {
        // setLoading(false);
        console.error("Error fetching data:", error);
      });
  }, []);

  const dataArray = Object.entries(listData).map(([date, value]) => ({ date, value }));
  dataArray.sort((a, b) => new Date(b.date) - new Date(a.date));

  const chartData = {
  labels: dataArray.map(item => {
    return item.date
  }),
  datasets: [
    {
      label: "Earning Count",
      data: dataArray.map(item => item.value),
      backgroundColor: "#FF8A8A",
      borderColor: "#C46B6B",
      borderWidth: 0
    },
  ],
};


  return (
    <div>
      <Bar v-if="loaded" data={chartData} options={chartOptions} />
    </div>
  );
};

export default AdminDashboard;
