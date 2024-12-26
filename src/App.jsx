import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { routes } from "./Routes";
import DefaultComponent from "./Components/DefaultComponent/DefaultComponent";
import { Flip, ToastContainer } from "react-toastify";
import Chatbot from "./Components/Chatbot/Chatbot.jsx";

function App() {
  return (
    <div className="bg-gray-100">
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader
              ? DefaultComponent
              : React.Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
      <ToastContainer
        style={{ fontFamily: "Lexend", fontSize: "13px", width: `300px` }}
        transition={Flip}
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Chatbot />
    </div>
  );
}

export default App;
