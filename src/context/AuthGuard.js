// 로그인 여부를 확인해 보호된 라우트 접근을 제어하는 가드
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "./AuthContext";

export default function AuthGuard() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
