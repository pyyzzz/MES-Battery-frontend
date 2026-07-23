import React, { useState } from "react";
import styled from "styled-components";
import SummaryCard from "../../components/ui/SummaryCard";
import DonutChart from "../../components/ui/DonutChart";
import Pagination from "../../components/ui/Pagination";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  FiSettings,
  FiAlertTriangle,
  FiArchive,
} from "react-icons/fi";
import { MdPrecisionManufacturing } from "react-icons/md";

const HOURLY_PRODUCTION_DATA = [
  { time: "08:00", good: 58, defect: 2 },
  { time: "09:00", good: 77, defect: 3 },
  { time: "10:00", good: 38, defect: 2 },
  { time: "11:00", good: 96, defect: 4 },
  { time: "12:00", good: 116, defect: 4 },
  { time: "13:00", good: 87, defect: 3 },
  { time: "14:00", good: 144, defect: 6 },
  { time: "15:00", good: 163, defect: 7 },
];

const DASHBOARD_TABLE_PROPS = {
  tableLayout: "fixed",
  headerBackground: "#f5f7fa",
};

const DASHBOARD_PAGINATION_PROPS = {
  visiblePages: 3,
  showFirstLast: false,
  background: "#ffffff",
  borderTop: "1px solid var(--color-border)",
};

// 레이아웃 스타일링
const DashboardWrapper = styled.div`
  background-color: var(--color-bg-canvas);
  padding: var(--page-container-padding);
  font-family: var(--font-family-base);
  display: flex;
  flex-direction: column;
  gap: var(--page-section-gap);
`;

const Header = styled.div`
  margin-bottom: 2px;
  h1 {
    margin: 0;
    font-size: var(--page-title-size);
    line-height: var(--page-title-line-height);
    font-weight: var(--page-title-weight);
    letter-spacing: var(--page-title-letter-spacing);
    color: var(--page-title-color);
  }
  p {
    font-size: var(--page-subtitle-size);
    font-weight: var(--page-subtitle-weight);
    line-height: var(--page-subtitle-line-height);
    color: var(--page-subtitle-color);
    margin-top: var(--page-title-subtitle-gap);
  }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--page-box-gap);

  @media (max-width: 850px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const DashboardSummaryCard = styled(SummaryCard)`
  flex-direction: row;
  align-items: center;
`;

const getDescriptionColor = (type) => {
  if (type === "danger") return "var(--color-danger)";
  if (type === "success") return "var(--color-success)";
  return "var(--color-neutral)";
};

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--page-box-gap);
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BoardCard = styled.div`
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--page-panel-padding);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
`;

const YieldCard = styled(BoardCard)`
  display: flex;
  flex-direction: column;
`;

const TableBoardCard = styled(BoardCard)`
  padding-bottom: 18px;
  overflow: hidden;
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
  font-size: 12px;
  font-weight: 600;
`;

const MachineNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  div:first-child {
    color: #252a32;
    font-size: 13px;
    font-weight: 600;
  }
  div:last-child {
    color: #737b88;
    font-size: 13px;
    font-weight: 400;
  }
`;

const MaterialCode = styled.strong`
  color: #174b9c;
  font-size: 13px;
  font-weight: 600;
`;

const StockText = styled.span`
  color: #252a32;
  font-size: 13px;
  font-weight: 400;
`;

const ChartBox = styled.div`
  width: 100%;
  height: 260px;
`;

const ProductionLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #535b68;
  font-size: 12px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  i {
    width: 12px;
    height: 12px;
    display: inline-block;
  }
`;

const renderProductionLegend = () => (
  <ProductionLegend>
    <span><i style={{ background: "#0755d9" }} />양품</span>
    <span><i style={{ background: "#e34b55" }} />불량</span>
  </ProductionLegend>
);

const ProductionTooltipBox = styled.div`
  padding: 9px 11px;
  background: #ffffff;
  border: 1px solid #d9dee8;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
  color: #252a32;
  font-size: 12px;
  line-height: 1.6;

  strong,
  span {
    display: block;
  }
`;

function ProductionTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const good = payload.find((item) => item.dataKey === "good")?.value ?? 0;
  const defect = payload.find((item) => item.dataKey === "defect")?.value ?? 0;

  return (
    <ProductionTooltipBox>
      <strong>{label}</strong>
      <span style={{ color: "#0755d9" }}>양품 : {good}</span>
      <span style={{ color: "#e34b55" }}>불량 : {defect}</span>
    </ProductionTooltipBox>
  );
}

const YieldOverview = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const YieldContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
`;

const YieldRate = styled.strong`
  display: block;
  color: var(--color-primary);
  font-size: 35px;
  font-weight: var(--font-weight-bold);
  line-height: 1;
`;

const YieldLabel = styled.span`
  display: block;
  margin-bottom: 10px;
  color: var(--color-neutral);
  font-size: var(--font-size-xs);
`;

const TargetBadge = styled.span`
  padding: 6px 10px;
  color: var(--color-success);
  background: var(--color-success-bg);
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
`;

const YieldTrack = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
  background: #e8ecf2;
  border-radius: 999px;
  overflow: hidden;
`;

const YieldFill = styled.div`
  height: 100%;
  width: ${(props) => props.$percent}%;
  background: linear-gradient(90deg, #0755d9, #2f80ed);
  border-radius: inherit;
`;

const YieldScale = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: var(--color-neutral);
  font-size: 11px;
`;

const YieldStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
`;

const YieldStat = styled.div`
  padding: 14px;
  background: ${({ $danger }) => ($danger ? "#fff5f5" : "#f3faf6")};
  border: 1px solid ${({ $danger }) => ($danger ? "#f4d3d5" : "#d5eddf")};
  border-radius: 10px;

  span {
    display: block;
    margin-bottom: 6px;
    color: var(--color-neutral);
    font-size: var(--font-size-xs);
  }

  strong {
    color: ${({ $danger }) =>
      $danger ? "var(--color-danger)" : "var(--color-success)"};
    font-size: 20px;
    font-weight: var(--font-weight-bold);
  }
`;

function DashBoard() {
  const [machinePage, setMachinePage] = useState(1);
  const [materialPage, setMaterialPage] = useState(1);
  const [workerPage, setWorkerPage] = useState(1);

  // 상단 KPI 카드 데이터
  const [kpiData] = useState([
    {
      icon: <FiArchive />,
      iconBackground: "#e8efff",
      iconColor: "#0755d9",
      title: "금일 생산량",
      value: "14,423",
      subText: "완료 수량",
      subType: "normal",
    },
    {
      icon: <FiSettings />,
      iconBackground: "#e8f8ef",
      iconColor: "#17a964",
      title: "설비 가동률",
      value: "92.8%",
      subText: "정상 운전 중",
      subType: "success",
    },
    {
      icon: <FiAlertTriangle />,
      iconBackground: "#fdecec",
      iconColor: "#d92d34",
      title: "불량",
      value: "1.2%",
      subText: "임계값 2% 미만",
      subType: "danger",
    },
    {
      icon: <MdPrecisionManufacturing />,
      iconBackground: "#eef1ff",
      iconColor: "#415fd5",
      title: "가동 설비",
      value: "24 / 26",
      subText: "온라인",
      subType: "success",
    },
  ]);

  // 불량 유형 분석
  const [defectTypeData] = useState([
    { name: "고온", value: 77, color: "#2563eb" },
    { name: "라벨", value: 43, color: "#d97706" },
    { name: "저전압", value: 26, color: "#059669" },
    { name: "기타", value: 25, color: "#cbd5e1" },
  ]);

  // 설비 가동 현황
  const machineColumns = [
    { key: "machineName", label: "설비명", width: "25%" },
    { key: "temp", label: "온도", width: "17%" },
    { key: "humidity", label: "습도", width: "17%" },
    { key: "volt", label: "전압", width: "17%" },
    { key: "status", label: "상태", width: "17%" },
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
    { key: "code", label: "자재 코드", width: 135 },
    { key: "name", label: "자재명", width: 110 },
    { key: "stock", label: "현재 재고" },
    { key: "unit", label: "단위", width: 80 },
  ];

  const [materialRows] = useState([
    {
      id: 1,
      code: <MaterialCode>MAT-V12-001</MaterialCode>,
      name: "Lithium-ion Cell",
      stock: <StockText>4,250</StockText>,
      unit: "EA",
    },
    {
      id: 2,
      code: <MaterialCode>MAT-V12-042</MaterialCode>,
      name: "Copper Plate",
      stock: <StockText>120</StockText>,
      unit: "KG",
    },
    {
      id: 3,
      code: <MaterialCode>MAT-V12-089</MaterialCode>,
      name: "Separator",
      stock: <StockText>850</StockText>,
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
        <h1>대시보드</h1>
        <p>실시간 생산 모니터링 시스템</p>
      </Header>

      {/* 상단 5개 공통 카드 영역 */}
      <KpiGrid>
        {kpiData.map((kpi, idx) => (
          <DashboardSummaryCard
            key={idx}
            icon={kpi.icon}
            title={kpi.title}
            value={kpi.value}
            description={kpi.subText}
            descriptionColor={getDescriptionColor(kpi.subType)}
            height={120}
            padding={18}
            gap={14}
            iconBoxSize={50}
            iconSize={24}
            iconBackground={kpi.iconBackground}
            iconColor={kpi.iconColor}
            titleFontSize={13}
            valueFontSize={24}
            descriptionFontSize="var(--font-size-xs)"
            descriptionFontWeight="var(--font-weight-normal)"
          />
        ))}
      </KpiGrid>

      {/* 시간별 생산 현황 및 불량 유형 분석 */}
      <SectionGrid>
        <BoardCard>
          <CardTitle>
            시간별 생산 현황 <span>양품 / 불량</span>
          </CardTitle>
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={HOURLY_PRODUCTION_DATA}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e8ee"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11 }}
                  stroke="#8a919d"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#8a919d" />
                <Tooltip
                  cursor={{ fill: "rgba(7, 85, 217, 0.05)" }}
                  content={<ProductionTooltip />}
                />
                <Legend content={renderProductionLegend} />
                <Bar
                  dataKey="good"
                  name="양품"
                  fill="#0755d9"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="defect"
                  name="불량"
                  fill="#e34b55"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </BoardCard>

        <BoardCard>
          <CardTitle>불량 유형 분석</CardTitle>
          <DonutChart
            data={defectTypeData}
            height={260}
            chartSize={180}
            innerRadius={60}
            outerRadius={80}
            totalLabel="전체 불량"
            justifyContent="center"
            gap={28}
            legendFontSize={14}
            showTooltip
            valueFormatter={(value) => Number(value).toLocaleString()}
          />
        </BoardCard>
      </SectionGrid>

      {/* 설비 가동 현황 및 양품률 */}
      <SectionGrid>
        <TableBoardCard>
          <CardTitle>
            설비 가동 현황 (실시간) <span>센서 데이터 수신중</span>
          </CardTitle>
          <Pagination
            {...DASHBOARD_PAGINATION_PROPS}
            columns={machineColumns}
            rows={machineRows}
            currentPage={machinePage}
            itemsPerPage={3}
            onPageChange={setMachinePage}
            tableProps={DASHBOARD_TABLE_PROPS}
          />
        </TableBoardCard>
        <YieldCard>
          <CardTitle>양품률</CardTitle>
          <YieldContent>
            <YieldOverview>
              <div>
                <YieldLabel>현재 양품률</YieldLabel>
                <YieldRate>98.8%</YieldRate>
              </div>
              <TargetBadge>목표 97.0%</TargetBadge>
            </YieldOverview>

            <YieldTrack aria-label="현재 양품률 98.8%">
              <YieldFill $percent={98.8} />
            </YieldTrack>
            <YieldScale>
              <span>0%</span>
              <span>100%</span>
            </YieldScale>

            <YieldStats>
              <YieldStat>
                <span>양품 수량</span>
                <strong>14,250</strong>
              </YieldStat>
              <YieldStat $danger>
                <span>불량 수량</span>
                <strong>171</strong>
              </YieldStat>
            </YieldStats>
          </YieldContent>
        </YieldCard>
      </SectionGrid>

      {/* 최하단 단: 자재 현황 및 작업자 현황 */}
      <SectionGrid style={{ gridTemplateColumns: "1fr 1fr" }}>
        <TableBoardCard>
          <CardTitle>자재 현황 (Inventory Status)</CardTitle>
          <Pagination
            {...DASHBOARD_PAGINATION_PROPS}
            columns={materialColumns}
            rows={materialRows}
            currentPage={materialPage}
            itemsPerPage={3}
            onPageChange={setMaterialPage}
            tableProps={DASHBOARD_TABLE_PROPS}
          />
        </TableBoardCard>

        <TableBoardCard>
          <CardTitle>
            작업자 현황{" "}
            <span style={{ color: "var(--color-primary)" }}>
              총원: 12 근무: 8
            </span>
          </CardTitle>
          <Pagination
            {...DASHBOARD_PAGINATION_PROPS}
            columns={workerColumns}
            rows={workerRows}
            currentPage={workerPage}
            itemsPerPage={3}
            onPageChange={setWorkerPage}
            tableProps={DASHBOARD_TABLE_PROPS}
          />
        </TableBoardCard>
      </SectionGrid>
    </DashboardWrapper>
  );
}

export default DashBoard;
