import {
  Avatar,
  Button,
  Chip,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getInfoUserAsync, updateInfoUserAsync } from "../../services/profiles";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Chart from "react-apexcharts";

export const genders = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Giới tính khác" },
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
  const [myInfo, setMyInfo] = useState({
    name: "",
    email: "",
    role: "",
    updatedAt: "",
    hobby: "",
    phoneNumber: "",
    birthday: "",
  });

  useEffect(() => {
    fetchMyInfoByIdAsync();
  }, []);

  const fetchMyInfoByIdAsync = async () => {
    try {
      const id = 3; // Mock ID, sau sẽ lấy từ thông tin đăng nhập
      const response = await getInfoUserAsync(id);
      setMyInfo(response.data);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin người dùng", {
        toastId: "not-found-user",
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
      toast.success("Chỉnh sửa thông tin thành công");
    } catch (err) {
      toast.error("Chỉnh sửa thông tin thất bại", {
        toastId: "not-found-user",
      });
    }
  };

  const options = {
    chart: {
      id: "mood-care-chart",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      min: 0,
      max: 27,
      labels: {
        formatter: (value: number) => `${value}`,
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
      data: [
        {
          x: "2024-11-25",
          y: 12,
        },
        {
          x: "2024-11-26",
          y: 8,
        },
        {
          x: "2024-11-27",
          y: 23,
        },
        {
          x: "2024-11-28",
          y: 14,
        },
        {
          x: "2024-11-29",
          y: 27,
        },
        {
          x: "2024-11-30",
          y: 2,
        },
        {
          x: "2024-12-01",
          y: 16,
        },
      ],
    },
  ];
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
              label={`Lần cuối cập nhật : ${dayjs(myInfo?.updatedAt).format(
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
                    Lưu
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEdit(false);
                      fetchMyInfoByIdAsync();
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              ) : (
                <Button variant="outlined" onClick={() => setIsEdit(true)}>
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
          <div className="">
            <p className="font-medium text-sm pb-2 text-gray-700">Sở thích</p>
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
                Họ tên
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
                Số điện thoại
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
                Giới tính
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
                Ngày sinh
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
              Kết quả khảo sát gần nhất
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ngày khảo sát:</span>
                <span className="font-semibold text-gray-800">30/11/2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Điểm số:</span>
                <span className="font-semibold text-gray-800">23 điểm</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Lời khuyên:
                </h3>
                <p className="text-gray-700">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
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
