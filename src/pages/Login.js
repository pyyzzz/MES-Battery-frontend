// 세션 기반 로그인 페이지
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // TODO: 백엔드 로그인 엔드포인트 확정 후 경로/응답 형태 맞춰 수정
      const response = await axiosInstance.post("/api/mes/auth/login", {
        username,
        password,
      });
      login(response.data);
      navigate("/mes/dashboard");
    } catch (err) {
      setError("아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--color-bg-canvas)",
      }}
    >
      <Card style={{ width: "320px" }}>
        <h2 style={{ marginBottom: "24px" }}>MES 로그인</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
            }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
            }}
          />
          {error && (
            <p
              style={{
                color: "var(--color-danger)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              {error}
            </p>
          )}
          <Button type="submit" style={{ width: "100%", marginTop: "8px" }}>
            로그인
          </Button>
        </form>
      </Card>
    </div>
  );
}
