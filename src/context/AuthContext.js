// 사용자 인증 상태를 관리하는 Context Provider
import { createContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 세션/쿠키 기반이므로 토큰을 직접 들고 있지 않는다.
  // 로그인 성공 여부와 최소한의 사용자 정보만 상태로 관리한다.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userInfo) => {
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // TODO: 백엔드 로그아웃 API(세션 만료 처리) 연결
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
