// 라우터 뼈대 - 각 팀원 페이지는 Empty placeholder로 임시 연결, 완성되면 import만 교체
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import GlobalStyle from "./style/GlobalStyle";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./context/AuthGuard";
import Login from "./pages/Login";
import SideBar from "./components/ui/SideBar";
import DashBoard from "./pages/monitoring/Dashboard";
import MachineList from "./pages/master/MachineList";

/* 아직 안 만든 페이지는 임시 표시 (담당자가 실제 파일 만들면 import만 교체) */
const Empty = ({ title }) => <div style={{ padding: "32px" }}>{title}</div>;

/* 라우트 경로 -> SideBar activeItem 매핑 */
const PATH_TO_ACTIVE_ITEM = {
  "/mes/dashboard": "대시보드",
  "/mes/master/process": "공정",
  "/mes/master/worker": "작업자",
  "/mes/master/machine": "설비",
  "/mes/master/bom": "BOM",
  "/mes/master/material": "자재",
  "/mes/master/product": "제품",
  "/mes/production/workorders": "작업지시",
  "/mes/production/product-lot": "완제품LOT",
  "/mes/quality/test-log": "품질관리",
  "/mes/inventory/material-list": "자재재고",
  "/mes/inventory/material-tx": "자재입출고이력",
  "/mes/inventory/material-lot": "원료LOT",
  "/mes/report/trace": "리포트",
};

function MesLayout() {
  const location = useLocation();
  const activeItem = PATH_TO_ACTIVE_ITEM[location.pathname];

  return (
    <div style={{ display: "flex" }}>
      <SideBar activeItem={activeItem} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AuthProvider>
        <Routes>
          {/* ================= 로그인 (공개 페이지) ================= */}
          <Route path="/login" element={<Login />} />

          {/* ================= 인증 보호 영역 ================= */}
          <Route element={<AuthGuard />}>
            <Route
              path="/"
              element={<Navigate to="/mes/dashboard" replace />}
            />

            <Route path="/mes" element={<MesLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* 대시보드 (담당: 미) */}
              <Route path="dashboard" element={<DashBoard />} />

              {/* 기준정보 (담당: 현) */}
              <Route path="master">
                <Route path="process" element={<Empty title="공정 마스터" />} />
                <Route
                  path="worker"
                  element={<Empty title="작업자 마스터" />}
                />
                <Route path="machine" element={<MachineList />} />
                <Route path="bom" element={<Empty title="BOM 마스터" />} />
                <Route
                  path="material"
                  element={<Empty title="자재 마스터" />}
                />
                <Route path="product" element={<Empty title="제품 마스터" />} />
              </Route>

              {/* 생산관리 (담당: 유) */}
              <Route path="production">
                <Route path="workorders" element={<Empty title="작업지시" />} />
                <Route
                  path="product-lot"
                  element={<Empty title="완제품 LOT" />}
                />
              </Route>

              {/* 품질관리 (담당: 나) - DefectLog는 TestLog에 통합됨 */}
              <Route path="quality">
                <Route
                  path="test-log"
                  element={<Empty title="검사이력 (불량 통합)" />}
                />
              </Route>

              {/* 자재/재고관리 (담당: 상) */}
              <Route path="inventory">
                <Route
                  path="material-list"
                  element={<Empty title="자재 재고" />}
                />
                <Route
                  path="material-tx"
                  element={<Empty title="자재 입출고 이력" />}
                />
                <Route
                  path="material-lot"
                  element={<Empty title="원료 LOT" />}
                />
              </Route>

              {/* 리포트 (담당: 나) - ProcessLog는 Traceability 상세에 통합됨 */}
              <Route path="report">
                <Route path="trace" element={<Empty title="Traceability" />} />
              </Route>
            </Route>
          </Route>

          {/* ================= 나머지 모든 경로 ================= */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
