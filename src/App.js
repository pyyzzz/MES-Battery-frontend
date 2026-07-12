// 라우터 뼈대 - 각 팀원 페이지는 Empty placeholder로 임시 연결, 완성되면 import만 교체
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import GlobalStyle from "./style/GlobalStyle";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./context/AuthGuard";
import Login from "./pages/Login";

/* 아직 안 만든 페이지는 임시 표시 (담당자가 실제 파일 만들면 import만 교체) */
const Empty = ({ title }) => <div style={{ padding: "32px" }}>{title}</div>;

/* SideBar 완성 전까지 쓰는 최소 레이아웃 (Outlet 자리만 확보) */
function MesLayout() {
  return (
    <div>
      {/* TODO: SideBar 컴포넌트 완성되면 여기에 배치 */}
      <Outlet />
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
            <Route path="/" element={<Navigate to="/mes/dashboard" replace />} />

            <Route path="/mes" element={<MesLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* 대시보드 (담당: 미) */}
              <Route path="dashboard" element={<Empty title="대시보드" />} />

              {/* 기준정보 (담당: 현) */}
              <Route path="master">
                <Route path="process" element={<Empty title="공정 마스터" />} />
                <Route path="worker" element={<Empty title="작업자 마스터" />} />
                <Route path="machine" element={<Empty title="설비 마스터" />} />
                <Route path="bom" element={<Empty title="BOM 마스터" />} />
                <Route path="material" element={<Empty title="자재 마스터" />} />
                <Route path="product" element={<Empty title="제품 마스터" />} />
              </Route>

              {/* 생산관리 (담당: 유) */}
              <Route path="production">
                <Route path="workorders" element={<Empty title="작업지시" />} />
                <Route path="product-lot" element={<Empty title="완제품 LOT" />} />
              </Route>

              {/* 품질관리 (담당: 나) - DefectLog는 TestLog에 통합됨 */}
              <Route path="quality">
                <Route path="test-log" element={<Empty title="검사이력 (불량 통합)" />} />
              </Route>

              {/* 자재/재고관리 (담당: 상) */}
              <Route path="inventory">
                <Route path="material-list" element={<Empty title="자재 재고" />} />
                <Route path="material-tx" element={<Empty title="자재 입출고 이력" />} />
                <Route path="material-lot" element={<Empty title="원료 LOT" />} />
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
