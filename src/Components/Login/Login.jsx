
import React, { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LogoEduCare from "../../Assets/image-login/logoeducare.png";
import GoogleLogo from "../../Assets/image-login/google.png";
import SpotifyLogo from "../../Assets/image-login/spotify.png";
import SlackLogo from "../../Assets/image-login/vector.png";
import http from "../../lib/http.js";

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9f9f9;
`;

const LeftPanel = styled.div`
  flex: 3;
  background-color: rgba(96, 171, 243, 0.66);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #004aad;
  font-family: Arial, sans-serif;
  padding: 20px;

  img {
    width: 90%;
    max-width: 250px;
    height: auto;
    object-fit: contain;
    margin-bottom: 20px; 
  }

  h1 {
    font-size: 28px;
    margin: 0;
    font-weight: bold;
    background: linear-gradient(90deg, #004aad, #1a8efd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
  }

  p {
    margin: 10px 0 180px;
    font-size: 16px;
    color: #555;
  }

  .partners {
    display: flex;
    gap: 15px;
    margin-top: auto;
    margin-bottom: 0px;
    img {
      width: auto%;
      height: 20px;
    }
  }
`;

const RightPanel = styled.div`
  flex: 7;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .background-pattern {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 150px;
    height: 150px;
  }
`;

const LoginContainer = styled.div`
  width: 500px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #1a8efd;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #005bb5;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await http.post("/auth/login", { email, password });
      const userData = response.data;
    
      if (userData) {
        localStorage.setItem("user_login", JSON.stringify(userData));
        setError("");
    
        // Kiểm tra nếu người dùng là admin
        if (userData.isAdmin) {
          navigate("/Admin-Dashboard"); // Điều hướng đến trang Dashboard nếu là admin
        } else {
          navigate("/"); // Điều hướng đến trang chủ nếu không phải admin
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
      console.error("Login failed: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LeftPanel>
        <h1>Welcome to EduCare</h1>
        <p>  </p>
        <img src={LogoEduCare} alt="Edu Care Logo" />
        <div className="partners">
          <img src={SlackLogo} alt="Slack" />
          <img src={SpotifyLogo} alt="Google" />
          <img src={GoogleLogo} alt="Spotify" />
        </div>
      </LeftPanel>
      <RightPanel>
        <img
          className="background-pattern"
          src={GoogleLogo}
          alt="Background Pattern"
        />
        <LoginContainer>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </form>
        </LoginContainer>
      </RightPanel>
    </PageContainer>
  );
}

export default Login;
