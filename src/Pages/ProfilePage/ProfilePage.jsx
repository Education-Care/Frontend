import { Avatar, Button, Chip, FormControl, MenuItem, Select, TextField, } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getInfoUserAsync, updateInfoUserAsync } from "../../services/profiles";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getSurveysByUser } from "../../services/surveys";
import { getSuggestionByDepressionLevel } from "../../services/suggestions"; 

import Chart from "react-apexcharts";

export const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Others" },
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const ProfilePage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [SurveyData, setSurveyData] = useState([
      {
        id: 1,
        createdAt: "2024-11-28T08:22:28.346Z",
        totalScore: 15,
        depressionLevel: "mild_depression"
      }
  ]);
  const [currentRecord, setCurrentRecord] = useState([
    {
      id: 1,
      createdAt: "2024-11-28T08:22:28.346Z",
      totalScore: 15,
      depressionLevel: "mild_depression"
    }
]);
  const [myInfo, setMyInfo] = useState({
    name: "",
    email: "",
    role: "",
    updatedAt: "",
    hobby: "",
    phoneNumber: "",
    birthday: "",
  });
  //Anhhnl begin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserInfor = localStorage.getItem("user_login");
      if (storedUserInfor) {
        const user = JSON.parse(storedUserInfor);
        setMyInfo(user);
        fetchMyInfoByIdAsync(user.userId);
      }
    }
  }, []);
  //Anhhnl end

  const fetchMyInfoByIdAsync = async (userId) => {
    try {
      const response = await getInfoUserAsync(userId);
      console.log("response", response);
      setMyInfo(response.data);
      //fetchUserSurveysAsync(id); 
    } catch (error) {
      toast.error("Error fetching user information", {
        toastId: "not-found-user",
      });
    }
  };
  console.log("myInfo", myInfo);
  useEffect(() => {
    fetchUserSurveysAsync();
  }, []);

  const fetchUserSurveysAsync = async () => {
    try {
      const userId = 1;
      const SurveyData = await getSurveysByUser(userId);
      console.log("responseSurveysByUser", SurveyData);
      setSurveyData(SurveyData); // Dữ liệu khảo sát của người dùng
    } catch (error) {
      toast.error("Error fetching survey data", { toastId: "fetch-survey-error" });
    }
  };
  console.log("responseSurveysByUser", SurveyData);

  useEffect(() => {
    const latestRecord = [...SurveyData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    setCurrentRecord(latestRecord);

    // Fetch suggestions based on the depression level of the latest survey
    if (latestRecord?.depressionLevel) {
      fetchSuggestionByDepressionLevel(latestRecord.depressionLevel);
    }
  }, [SurveyData]);

  const fetchSuggestionByDepressionLevel = async (depressionLevel) => {
    try {
      const response = await getSuggestionByDepressionLevel(depressionLevel);
      setSuggestions(response.suggestion); // Set the fetched suggestions
    } catch (err) {
      toast.error("Error fetching suggestion", {
        toastId: "not-found-suggestion",
      });
    }
  };
  const handleDateStartChange = (date) => {
    setMyInfo((prev) => ({
      ...prev,
      birthday: new Date(String(date)),
    }));
  };
  const shouldDisableDate = (date) => {
    return date.isAfter(dayjs(), "day");
  };

  const incrementDateByOne = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate.toISOString().split("T")[0];
  };

  const handleSaveUpdate = async () => {
    const body = {
      ...myInfo,
      birthday: incrementDateByOne(myInfo?.birthday),
    };
    try {
      const id = 3; // Mock ID, sau sẽ lấy từ thông tin đăng nhập
      const response = await updateInfoUserAsync(id, body);
      setMyInfo(response.data);
      setIsEdit(false);
      toast.success("Update user information successfully");
    } catch (err) {
      toast.error("Failed to update information", {
        toastId: "not-found-user",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Nếu không có ngày, trả về chuỗi rỗng

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };


  const options = {
    chart: {
      id: "mood-care-chart",
      toolbar: {
        show: false,
      },
      events: {
        // Xử lý sự kiện khi bấm vào điểm trên chart
        dataPointSelection: (event, chartContext, config) => {
          const selectedDate = config.w.globals.seriesX[config.seriesIndex][config.dataPointIndex];
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

  const series = [
    {
      name: "Score of survey",
      data: SurveyData.map((survey) => ({
        x: survey.createdAt.split("T")[0],
        y: survey.totalScore,
      })),
    },
  ];
  console.log("series", series)
  console.log("currentRecord", currentRecord)
  return (
    <div className="">
      <div className="flex items-center justify-between w-full gap-12 !bg-white my-4 rounded-xl shadow-lg border-t-[40px] border-t-blue-500 mx-auto max-w-7xl p-6 overflow-hidden">
        <div className="flex items-center flex-col w-1/4 gap-4">
          <Avatar
            alt={"avatar"}
            src={
              myInfo?.avatarUrl ||
              "https://i.pinimg.com/564x/62/68/9c/62689cccc0ec5faaacb7770269d5c0ab.jpg"
            }
            sx={{ width: 200, height: 200 }}
          />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-gray-900 truncate w-52 text-center">
              {myInfo?.name}
            </span>
            <span className="text-sm text-gray-700 text-center">
              {myInfo?.email}
            </span>
          </div>

          {myInfo?.role && (
            <Chip
              // color="primary"
              label={`${myInfo?.role?.toUpperCase()}`}
              sx={{ backgroundColor: "#fae3ee", color: "#b33871" }}
            />
          )}
          {myInfo?.updatedAt && (
            <Chip
              // color="primary"
              label={`Last Updated : ${dayjs(myInfo?.updatedAt).format(
                "DD/MM/YYYY"
              )}`}
              sx={{ backgroundColor: "#fae3ee", color: "#b33871" }}
            />
          )}
        </div>
        <div className="bg-white p-4 w-3/4">
          <div className="flex items-center justify-end">
            <div>
              {isEdit ? (
                <div className="flex gap-4">
                  <Button variant="contained" onClick={handleSaveUpdate}>
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEdit(false);
                      fetchMyInfoByIdAsync();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outlined" onClick={() => setIsEdit(true)}>
                  Edit
                </Button>
              )}
            </div>
          </div>
          <div className="">
            <p className="font-medium text-sm pb-2 text-gray-700">Hobby</p>
            <textarea
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-cyan-600 focus:border-blue-500 outline-none
                  disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed"
              placeholder="Introduce yourself"
              value={myInfo?.hobby}
              onChange={(e) =>
                setMyInfo((prev) => ({ ...prev, hobby: e.target.value }))
              }
              disabled={!isEdit}
            ></textarea>
          </div>
          <div className="flex gap-6 ">
            <div className="mb-2 w-1/2">
              <label
                htmlFor="fullName"
                className="font-medium text-sm pb-2 text-gray-700"
              >
                Full Name
              </label>
              <TextField
                sx={{
                  fontFamily: "Lexend",
                  marginTop: "10px",
                  bgcolor: !isEdit ? "" : "white",
                }}
                fullWidth
                id="fullName"
                variant="outlined"
                onChange={(e) =>
                  setMyInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                value={myInfo?.name}
                disabled={!isEdit}
              />
            </div>
            <div className="mb-2 w-1/2">
              <label
                htmlFor="phoneNumber"
                className="font-medium text-sm pb-2 text-gray-700"
              >
                Phone Number
              </label>
              <TextField
                type="text"
                sx={{
                  fontFamily: "Lexend",
                  marginTop: "10px",
                  bgcolor: !isEdit ? "" : "white",
                }}
                fullWidth
                id="phoneNumber"
                variant="outlined"
                onChange={(e) =>
                  setMyInfo((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                value={myInfo?.phoneNumber}
                disabled={!isEdit}
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="mb-2 w-1/2">
              <label
                htmlFor="gender"
                className="font-medium text-sm pb-2 text-gray-700"
              >
                Gender
              </label>
              <FormControl fullWidth sx={{ marginTop: 1.5 }}>
                <Select
                  labelId="gender"
                  id="gender"
                  value={
                    genders.find((gender) => gender.value === myInfo?.gender) ||
                    ""
                  }
                  onChange={(e) =>
                    setMyInfo((prev) => {
                      return {
                        ...prev,
                        gender: e.target.value.value,
                      };
                    })
                  }
                  MenuProps={MenuProps}
                  disabled={!isEdit}
                  sx={{ bgcolor: !isEdit ? "" : "white" }}
                >
                  {genders.map((genders, index) => (
                    <MenuItem key={`genders-${index}`} value={genders}>
                      {genders.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="mb-2 w-1/2">
              <label
                htmlFor="birthday"
                className="font-medium text-sm pb-2 text-gray-700"
              >
                Birthday
              </label>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{ width: "100% !important" }}
              >
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ width: "100%" }}
                >
                  <DatePicker
                    value={dayjs(myInfo?.birthday)}
                    onChange={handleDateStartChange}
                    shouldDisableDate={shouldDisableDate}
                    disabled={!isEdit}
                    sx={{ width: "100%", borderColor: "#000 !important" }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
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
              Latest Survey Results
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Survey Date:</span>
                <span className="font-semibold text-gray-800">{formatDate(currentRecord?.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Score:</span>
                <span className="font-semibold text-gray-800">{ currentRecord?.totalScore } điểm</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Suggestion:
                </h3>
                <p className="text-gray-700">
                {suggestions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
