import { useState } from "react";
import Chart from "react-apexcharts";

const SurveyHistory = () => {
  const [SurveyData, setSurveyData] = useState([
    {
      id: 1,
      createdAt: "2024-11-28T08:22:28.346Z",
      totalScore: 15,
      depressionLevel: "mild_depression",
    },
  ]);
  const [currentRecord, setCurrentRecord] = useState([
    {
      id: 1,
      createdAt: "2024-11-28T08:22:28.346Z",
      totalScore: 15,
      depressionLevel: "mild_depression",
    },
  ]);

  const options = {
    chart: {
      id: "mood-care-chart",
      toolbar: {
        show: false,
      },
      events: {
        // Xử lý sự kiện khi bấm vào điểm trên chart
        dataPointSelection: (event, chartContext, config) => {
          const selectedDate =
            config.w.globals.seriesX[config.seriesIndex][config.dataPointIndex];
          const selectedRecord = SurveyData.find(
            (survey) => survey.createdAt.split("T")[0] === selectedDate
          );
          if (selectedRecord) {
            setCurrentRecord(selectedRecord);
          }
        },
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      min: 0,
      max: 27,
      labels: {
        formatter: (value) => `${value}`,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 4,
      colors: ["#5a96f6"],
      strokeWidth: 2,
    },
    colors: ["#5a96f6"],
    legend: {
      position: "bottom",
      markers: {
        fillColors: ["#5a96f6"],
      },
    },
    grid: {
      borderColor: "#E4E4E7",
    },
  };
  return (
    <div className="grid grid-cols-3 gap-12 !bg-white my-4 rounded-xl shadow-lg border-t-[40px] border-t-blue-500 mx-auto max-w-7xl p-6 overflow-hidden">
      {/* Phần biểu đồ chiếm */}
      <div className="rounded-xl shadow-lg border p-6 bg-white col-span-2">
        <div className="flex items-center justify-between mb-4 w-full">
          <h2 className="text-xl font-bold">Mood care</h2>
        </div>
        <Chart options={options} series={series} type="line" height={300} />
      </div>

      {/* Phần kết quả khảo sát chiếm */}
      <div className="rounded-xl shadow-lg border p-6 bg-white col-span-1">
        <div>
          <h2 className="text-2xl font-bold text-blue-500 mb-4">
            Kết quả khảo sát gần nhất
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Ngày khảo sát:</span>
              <span className="font-semibold text-gray-800">
                {formatDate(currentRecord?.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Điểm số:</span>
              <span className="font-semibold text-gray-800">
                {currentRecord?.totalScore} điểm
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Lời khuyên:
              </h3>
              <p className="text-gray-700">{suggestions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyHistory;
