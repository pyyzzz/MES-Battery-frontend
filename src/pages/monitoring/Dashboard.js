import React, { useState } from "react";
import styled from "styled-components";
import KpiCard from "../../components/ui/KpiCard";
import DonutChart from "../../components/ui/DonutChart";
import Table from "../../components/ui/Table";

import {
  FiSettings,
  FiCheckCircle,
  FiAlertTriangle,
  FiArchive,
} from "react-icons/fi";
import { MdPrecisionManufacturing } from "react-icons/md";

// 레이아웃 스타일링
const DashboardWrapper = styled.div`
  background-color: var(--color-bg-canvas);
  padding: var(--spacing-gutter);
  font-family: var(--font-family-base);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  margin-bottom: 8px;
  h1 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }
  p {
    font-size: var(--font-size-xs);
    color: var(--color-neutral);
    margin-top: 4px;
  }
`;

const KpiGrid = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: nowrap;
  width: 100%;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BoardCard = styled.div`
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
`;

const CardTitle = styled.div`
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-normal);
    color: var(--color-neutral);
  }
`;

const StateBadge = styled.span`
  background-color: ${(props) =>
    props.$type === "run" ? "var(--color-success-bg)" : "var(--color-neutral)"};
  color: ${(props) =>
    props.$type === "run"
      ? "var(--color-success)"
      : "var(--color-text-inverse)"};
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
`;

const MachineNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  div:first-child {
    font-weight: var(--font-weight-bold);
  }
  div:last-child {
    font-size: 11px;
    color: var(--color-neutral);
  }
`;

const FakeBarGrid = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  padding-top: 20px;
`;
const BarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
`;
const Bar = styled.div`
  width: 32px;
  height: ${(props) => props.$height}px;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;

// 🚀 양품률 섹션 전용 스타일 컴포넌트 추가
const YieldBigValue = styled.div`
  font-size: 32px;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  span {
    font-size: var(--font-size-sm);
    color: var(--color-neutral);
    font-weight: normal;
  }
`;

const YieldRow = styled.div`
  margin-bottom: 16px;
`;

const YieldRowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  margin-bottom: 6px;
  color: var(--color-text);
  span:last-child {
    font-weight: var(--font-weight-bold);
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: var(--color-bg-canvas);
  border-radius: var(--radius-sm);
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.$percent}%;
  background-color: ${(props) => props.$color || "var(--color-primary)"};
`;

function DashBoard() {
  // 상단 KPI 카드 데이터
  const [kpiData] = useState([
    {
      icon: <FiArchive size={24} color="var(--color-primary)" />,
      title: "금일 생산량",
      value: "14,423",
      subText: "완료 수량",
      subType: "normal",
    },
    {
      icon: <FiSettings size={24} color="var(--color-text)" />,
      title: "설비 가동률",
      value: "92.8%",
      subText: "정상 운전 중",
      subType: "success",
    },
    {
      icon: <FiCheckCircle size={24} color="var(--color-success)" />,
      title: "양품",
      value: "14,250",
      subText: "양품률 98.8%",
      subType: "success",
    },
    {
      icon: <FiAlertTriangle size={24} color="var(--color-danger)" />,
      title: "불량",
      value: "1.2%",
      subText: "임계값 2% 미만",
      subType: "danger",
    },
    {
      icon: <MdPrecisionManufacturing size={24} color="var(--color-neutral)" />,
      title: "가동 설비",
      value: "24 / 26",
      subText: "온라인",
      subType: "success",
    },
  ]);

  // 불량 유형 분석
  const [defectTypeData] = useState([
    { name: "고온", value: 45, color: "#2563eb" },
    { name: "라벨", value: 25, color: "#d97706" },
    { name: "저전압", value: 15, color: "#059669" },
    { name: "기타", value: 15, color: "#cbd5e1" },
  ]);

  // 설비 가동 현황
  const machineColumns = [
    { key: "machineName", label: "설비명" },
    { key: "temp", label: "온도" },
    { key: "humidity", label: "습도" },
    { key: "volt", label: "전압" },
    { key: "status", label: "상태" },
  ];

  const [machineRows] = useState([
    {
      id: 1,
      machineName: (
        <MachineNameWrapper>
          <div>Electrode M/C #1</div>
          <div>MAC-A-01</div>
        </MachineNameWrapper>
      ),
      temp: "24.6°C",
      humidity: "40.1%",
      volt: "221.5V",
      status: <StateBadge $type="run">RUN</StateBadge>,
    },
    {
      id: 2,
      machineName: (
        <MachineNameWrapper>
          <div>Assembly Line #1</div>
          <div>MAC-A-02</div>
        </MachineNameWrapper>
      ),
      temp: "24.6°C",
      humidity: "40.9%",
      volt: "221.4V",
      status: <StateBadge $type="run">RUN</StateBadge>,
    },
    {
      id: 3,
      machineName: (
        <MachineNameWrapper>
          <div>Formation Sys #1</div>
          <div>MAC-A-03</div>
        </MachineNameWrapper>
      ),
      temp: "23.4°C",
      humidity: "50.0%",
      volt: "220.6V",
      status: <StateBadge $type="run">RUN</StateBadge>,
    },
    {
      id: 4,
      machineName: (
        <MachineNameWrapper>
          <div>Pack Line #1</div>
          <div>MAC-A-04</div>
        </MachineNameWrapper>
      ),
      temp: "23.9°C",
      humidity: "49.7%",
      volt: "222.2V",
      status: <StateBadge $type="run">RUN</StateBadge>,
    },
  ]);

  // 자재 현황
  const materialColumns = [
    { key: "code", label: "자재 코드" },
    { key: "name", label: "자재명" },
    { key: "stock", label: "현재 재고" },
    { key: "unit", label: "단위" },
  ];

  const [materialRows] = useState([
    {
      id: 1,
      code: (
        <span style={{ fontFamily: "var(--font-family-mono)" }}>
          MAT-V12-001
        </span>
      ),
      name: "Lithium-ion Cell",
      stock: (
        <strong style={{ fontWeight: "var(--font-weight-bold)" }}>4,250</strong>
      ),
      unit: "EA",
    },
    {
      id: 2,
      code: (
        <span style={{ fontFamily: "var(--font-family-mono)" }}>
          MAT-V12-042
        </span>
      ),
      name: "Copper Plate",
      stock: (
        <strong style={{ fontWeight: "var(--font-weight-bold)" }}>120</strong>
      ),
      unit: "KG",
    },
    {
      id: 3,
      code: (
        <span style={{ fontFamily: "var(--font-family-mono)" }}>
          MAT-V12-089
        </span>
      ),
      name: "Separator",
      stock: (
        <strong style={{ fontWeight: "var(--font-weight-bold)" }}>850</strong>
      ),
      unit: "M",
    },
  ]);

  // 작업자 현황
  const workerColumns = [
    { key: "team", label: "팀명" },
    { key: "count", label: "배정 인원" },
    { key: "status", label: "상태" },
  ];

  const [workerRows] = useState([
    {
      id: 1,
      team: "조립 1팀",
      count: "2명",
      status: <StateBadge $type="run">가동중</StateBadge>,
    },
    {
      id: 2,
      team: "조립 2팀",
      count: "2명",
      status: <StateBadge $type="run">가동중</StateBadge>,
    },
    {
      id: 3,
      team: "포장팀",
      count: "1명",
      status: <StateBadge $type="run">가동중</StateBadge>,
    },
    {
      id: 4,
      team: "검사팀",
      count: "3명",
      status: <StateBadge $type="normal">정상</StateBadge>,
    },
  ]);

  return (
    <DashboardWrapper>
      <Header>
        <h1>Dashboard</h1>
        <p>실시간 생산 모니터링 시스템</p>
      </Header>

      {/* 상단 5개 공통 카드 영역 */}
      <KpiGrid>
        {kpiData.map((kpi, idx) => (
          <KpiCard
            key={idx}
            icon={kpi.icon}
            title={kpi.title}
            value={kpi.value}
            subText={kpi.subText}
            subType={kpi.subType}
          />
        ))}
      </KpiGrid>

      {/* 시간별 생산 현황 및 불량 유형 분석 */}
      <SectionGrid>
        <BoardCard>
          <CardTitle>
            시간별 생산 현황 <span>양품 / 불량</span>
          </CardTitle>
          <FakeBarGrid>
            <BarColumn>
              <Bar $height={60} />
              <span style={{ fontSize: "12px" }}>08:00</span>
            </BarColumn>
            <BarColumn>
              <Bar $height={80} />
              <span style={{ fontSize: "12px" }}>09:00</span>
            </BarColumn>
            <BarColumn>
              <Bar $height={40} />
              <span style={{ fontSize: "12px" }}>10:00</span>
            </BarColumn>
            <BarColumn>
              <Bar $height={100} />
              <span style={{ fontSize: "12px" }}>11:00</span>
            </BarColumn>
            <BarColumn>
              <Bar $height={120} />
              <span style={{ fontSize: "12px" }}>12:00</span>
            </BarColumn>
            <BarColumn>
              <Bar $height={90} />
              <span style={{ fontSize: "12px" }}>13:00</span>
            </BarColumn>
            <BarColumn>
              <Bar $height={150} />
              <span style={{ fontSize: "12px" }}>14:00</span>
            </BarColumn>
            <BarColumn>
              <Bar $height={170} />
              <span style={{ fontSize: "12px" }}>15:00</span>
            </BarColumn>
          </FakeBarGrid>
        </BoardCard>

        <BoardCard>
          <CardTitle>불량 유형 분석</CardTitle>
          <DonutChart total="171" data={defectTypeData} />
        </BoardCard>
      </SectionGrid>

      {/* 설비 가동 현황 및 양품률 */}
      <SectionGrid>
        <BoardCard>
          <CardTitle>
            설비 가동 현황 (실시간) <span>센서 데이터 수신중</span>
          </CardTitle>
          <Table columns={machineColumns} rows={machineRows} />
        </BoardCard>
        <BoardCard>
          <CardTitle>양품률</CardTitle>
          <YieldBigValue>
            98.8% <span>97.0%</span>
          </YieldBigValue>

          <YieldRow>
            <YieldRowHeader>
              <span>🔹 가동</span>
              <span>22</span>
            </YieldRowHeader>
            <ProgressBarContainer>
              <ProgressBarFill $percent={85} $color="var(--color-primary)" />
            </ProgressBarContainer>
          </YieldRow>

          <YieldRow style={{ marginBottom: 0 }}>
            <YieldRowHeader>
              <span style={{ color: "var(--color-neutral)" }}>
                재작업 / 폐기
              </span>
              <span style={{ color: "var(--color-danger)" }}>171</span>
            </YieldRowHeader>
            <ProgressBarContainer>
              <ProgressBarFill $percent={15} $color="var(--color-danger)" />
            </ProgressBarContainer>
          </YieldRow>
        </BoardCard>
      </SectionGrid>

      {/* 최하단 단: 자재 현황 및 작업자 현황 */}
      <SectionGrid style={{ gridTemplateColumns: "1fr 1fr" }}>
        <BoardCard>
          <CardTitle>자재 현황 (Inventory Status)</CardTitle>
          <Table columns={materialColumns} rows={materialRows} />
        </BoardCard>

        <BoardCard>
          <CardTitle>
            작업자 현황{" "}
            <span style={{ color: "var(--color-primary)" }}>
              총원: 12 근무: 8
            </span>
          </CardTitle>
          <Table columns={workerColumns} rows={workerRows} />
        </BoardCard>
      </SectionGrid>
    </DashboardWrapper>
  );
}

export default DashBoard;
