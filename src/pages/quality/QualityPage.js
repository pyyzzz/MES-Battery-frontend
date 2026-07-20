import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiCheckCircle,
  FiClipboard,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import UiButton from "../../components/ui/Button";
import SummaryCard from "../../components/ui/SummaryCard";
import Pagination from "../../components/ui/Pagination";
import SearchFilterBar from "../../components/ui/SearchFilterBar";

/* =========================================================
   MOCK DATA
========================================================= */

const MOCK_INSPECTIONS = [
  {
    id: 1,
    inspectedAt: "2026-02-10 15:20",
    result: "OK",
    defectCode: "",
    defectType: "",
    defectQty: 0,
    lotNo: "LOT-20260210-005",
    productName: "12V 중형 배터리",
    workOrderNo: "WO-20260210-005",
    processCode: "PROC-050",
    processName: "검사공정",
    machineCode: "MAC-A-05",
    machineName: "Inspector #1",
    workerName: "김하린",
    voltage: 217.2,
    humidity: 47.2,
  },
  {
    id: 2,
    inspectedAt: "2026-02-10 15:19",
    result: "NG",
    defectCode: "SCRATCH",
    defectType: "스크래치",
    defectQty: 2,
    lotNo: "LOT-20260210-004",
    productName: "12V 중형 배터리",
    workOrderNo: "WO-20260210-004",
    processCode: "PROC-050",
    processName: "검사공정",
    machineCode: "MAC-A-05",
    machineName: "Inspector #2",
    workerName: "이현수",
    voltage: 220.1,
    humidity: 41.2,
  },
  {
    id: 3,
    inspectedAt: "2026-02-10 15:18",
    result: "OK",
    defectCode: "",
    defectType: "",
    defectQty: 0,
    lotNo: "LOT-20260210-003",
    productName: "12V 소형 배터리",
    workOrderNo: "WO-20260210-003",
    processCode: "PROC-030",
    processName: "활성화공정",
    machineCode: "MAC-A-03",
    machineName: "Formation Sys #1",
    workerName: "우민규",
    voltage: 219.5,
    humidity: 48.2,
  },
  {
    id: 4,
    inspectedAt: "2026-02-10 15:17",
    result: "NG",
    defectCode: "MISALIGNMENT",
    defectType: "정렬 불량",
    defectQty: 1,
    lotNo: "LOT-20260210-002",
    productName: "12V 대형 배터리",
    workOrderNo: "WO-20260210-002",
    processCode: "PROC-020",
    processName: "조립공정",
    machineCode: "MAC-A-02",
    machineName: "Assembly Line #1",
    workerName: "양찬종",
    voltage: 218.8,
    humidity: 44.7,
  },
  {
    id: 5,
    inspectedAt: "2026-02-10 15:16",
    result: "OK",
    defectCode: "",
    defectType: "",
    defectQty: 0,
    lotNo: "LOT-20260210-001",
    productName: "12V 소형 배터리",
    workOrderNo: "WO-20260210-001",
    processCode: "PROC-050",
    processName: "검사공정",
    machineCode: "MAC-A-05",
    machineName: "Inspector #1",
    workerName: "김하린",
    voltage: 221.3,
    humidity: 42.5,
  },
  {
    id: 6,
    inspectedAt: "2026-02-09 16:42",
    result: "NG",
    defectCode: "CONTAMINATION",
    defectType: "오염",
    defectQty: 3,
    lotNo: "LOT-20260209-003",
    productName: "12V 중형 배터리",
    workOrderNo: "WO-20260209-003",
    processCode: "PROC-030",
    processName: "활성화공정",
    machineCode: "MAC-A-03",
    machineName: "Formation Sys #1",
    workerName: "이현수",
    voltage: 216.7,
    humidity: 49.3,
  },
  {
    id: 7,
    inspectedAt: "2026-02-09 16:21",
    result: "OK",
    defectCode: "",
    defectType: "",
    defectQty: 0,
    lotNo: "LOT-20260209-002",
    productName: "12V 대형 배터리",
    workOrderNo: "WO-20260209-002",
    processCode: "PROC-040",
    processName: "팩공정",
    machineCode: "MAC-A-04",
    machineName: "Pack Line #1",
    workerName: "우민규",
    voltage: 220.4,
    humidity: 43.8,
  },
  {
    id: 8,
    inspectedAt: "2026-02-09 15:58",
    result: "NG",
    defectCode: "DIMENSION",
    defectType: "치수 불량",
    defectQty: 1,
    lotNo: "LOT-20260209-001",
    productName: "12V 소형 배터리",
    workOrderNo: "WO-20260209-001",
    processCode: "PROC-020",
    processName: "조립공정",
    machineCode: "MAC-A-02",
    machineName: "Assembly Line #1",
    workerName: "양찬종",
    voltage: 215.9,
    humidity: 50.1,
  },
];

const TREND_DATA = [
  { date: "02-05", ok: 420, ng: 31 },
  { date: "02-06", ok: 405, ng: 28 },
  { date: "02-07", ok: 380, ng: 35 },
  { date: "02-08", ok: 352, ng: 24 },
  { date: "02-09", ok: 340, ng: 27 },
  { date: "02-10", ok: 326, ng: 29 },
];

const DEFECT_CHART_DATA = [
  { name: "스크래치", value: 42 },
  { name: "오염", value: 35 },
  { name: "치수", value: 32 },
  { name: "정렬", value: 24 },
  { name: "용접", value: 21 },
  { name: "기타", value: 20 },
];

const BAR_COLORS = [
  "#dd4c51",
  "#dd4c51",
  "#dd4c51",
  "#dd4c51",
  "#dd4c51",
  "#dd4c51",
];

/* =========================================================
   STYLES
========================================================= */

const Page = styled.div`
  min-height: 100%;
  padding: 30px 32px 44px;
  box-sizing: border-box;
  background: #f7f8fa;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 26px;
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -0.8px;
  color: #17191d;
`;

const PageDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #8a909c;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 22px;

  > div {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    column-gap: 16px;

    > div:last-child {
      flex: 0 1 100px;
      text-align: left;
    }
  }
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 20px;
  margin-bottom: 22px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  padding: 22px;
  background: #ffffff;
  border: 1px solid #d9deea;
  border-radius: 10px;
  box-sizing: border-box;
`;

const PanelTitle = styled.h2`
  margin: 0 0 18px;
  font-size: 18px;
  font-weight: 600;
  color: #282c34;
`;

const ChartBox = styled.div`
  width: 100%;
  height: 260px;
`;

const FilterPanel = styled(Panel)`
  margin-bottom: 22px;
`;

const TablePanel = styled(Panel)`
  padding: 0;
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 20px 20px 14px;
`;

const TableTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #282c34;
`;

const ResultBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;

  padding: 5px 9px;
  border-radius: 999px;

  background: ${({ $result }) =>
    $result === "OK" ? "#e8f1ff" : "#fdecec"};

  color: ${({ $result }) =>
    $result === "OK" ? "#0755d9" : "#d92d34"};

  border: 1px solid
    ${({ $result }) =>
      $result === "OK" ? "#bfd4fa" : "#f4c4c7"};

  font-size: 12px;
  font-weight: 600;
`;

const DefectText = styled.span`
  color: #d92d34;
  font-weight: 500;
`;

/* Drawer */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 900;
  background: rgba(17, 24, 39, 0.42);
`;

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: ${({ $open }) => ($open ? "0" : "-480px")};
  z-index: 901;

  width: 480px;
  height: 100vh;

  display: flex;
  flex-direction: column;

  background: #f8f9fb;
  border-left: 1px solid #d8dee9;
  box-shadow: -8px 0 24px rgba(15, 23, 42, 0.14);

  transition: right 0.25s ease;
`;

const DrawerHeader = styled.div`
  height: 68px;
  padding: 0 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #ffffff;
  border-bottom: 1px solid #dfe3eb;
`;

const DrawerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  font-size: 18px;
  font-weight: 600;
  color: #222831;

  svg {
    color: #0755d9;
  }
`;

const CloseButton = styled(UiButton)`
  width: 36px;
  height: 36px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 8px;
  background: transparent;
  color: #4b5563;

  cursor: pointer;

  &:hover {
    background: #eef1f5;
  }
`;

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 32px;
`;

const DrawerSection = styled.section`
  margin-bottom: 22px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px;
  padding-left: 10px;

  border-left: 4px solid #0755d9;

  font-size: 15px;
  font-weight: 600;
  color: #313640;
`;

const DetailCard = styled.div`
  padding: 17px 18px;

  background: #ffffff;
  border: 1px solid #ccd4e2;
  border-radius: 10px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
`;

const DetailItem = styled.div`
  min-width: 0;
`;

const DetailLabel = styled.span`
  display: block;
  margin-bottom: 6px;

  font-size: 12px;
  color: #747c89;
`;

const DetailValue = styled.strong`
  display: block;

  font-size: 14px;
  font-weight: 500;
  color: #222831;

  overflow-wrap: anywhere;
`;

const DefectCard = styled(DetailCard)`
  border-color: #efc4c7;
  background: #fffafa;
`;

/* =========================================================
   COMPONENT
========================================================= */

function QualityPage() {
  const [rows] = useState(MOCK_INSPECTIONS);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    result: "",
    defectType: "",
    keyword: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const itemsPerPage = 5;

  const summary = useMemo(() => {
    const total = rows.length;
    const ok = rows.filter((row) => row.result === "OK").length;
    const ng = rows.filter((row) => row.result === "NG").length;
    const okRate = total > 0 ? Math.round((ok / total) * 100) : 0;

    const defectCountMap = rows
      .filter((row) => row.result === "NG")
      .reduce((acc, row) => {
        acc[row.defectType] = (acc[row.defectType] || 0) + row.defectQty;
        return acc;
      }, {});

    const topDefect =
      Object.entries(defectCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "-";

    return {
      total,
      ok,
      ng,
      okRate,
      topDefect,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return rows.filter((row) => {
      const inspectedDate = row.inspectedAt.slice(0, 10);

      const matchStart =
        !filters.startDate || inspectedDate >= filters.startDate;

      const matchEnd =
        !filters.endDate || inspectedDate <= filters.endDate;

      const matchResult =
        !filters.result || row.result === filters.result;

      const matchDefect =
        !filters.defectType ||
        row.defectType === filters.defectType;

      const matchKeyword =
        !keyword ||
        [
          row.lotNo,
          row.productName,
          row.workOrderNo,
          row.processName,
          row.machineName,
          row.workerName,
          row.defectCode,
          row.defectType,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(keyword)
        );

      return (
        matchStart &&
        matchEnd &&
        matchResult &&
        matchDefect &&
        matchKeyword
      );
    });
  }, [rows, filters]);

  const qualityColumns = [
    { key: "inspectedAt", label: "검사일시", width: 150 },
    {
      key: "result",
      label: "판정",
      width: 90,
      render: (result) => (
        <ResultBadge $result={result}>
          {result === "OK" ? <FiCheckCircle /> : <FiXCircle />}
          {result}
        </ResultBadge>
      ),
    },
    {
      key: "defectType",
      label: "불량 유형",
      width: 120,
      render: (defectType, row) => row.result === "NG" ? <DefectText>{defectType}</DefectText> : "-",
    },
    { key: "lotNo", label: "LOT", width: 200 },
    { key: "productName", label: "제품명", width: 140 },
    { key: "workOrderNo", label: "작업지시", width: 160 },
    { key: "processName", label: "공정", width: 90 },
    { key: "machineName", label: "설비", width: 140 },
    { key: "voltage", label: "전압", width: 80, render: (voltage) => `${voltage}V` },
    { key: "humidity", label: "습도", width: 80, render: (humidity) => `${humidity}%` },
  ];

  const handleFilterChange = (nextFilters) => {
    setFilters((prev) => ({
      ...nextFilters,
      keyword: prev.keyword,
    }));
    setCurrentPage(1);
  };

  const handleFilterSearch = (nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleFilterReset = (nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const openDetail = (row) => {
    setSelectedRow(row);
  };

  const closeDetail = () => {
    setSelectedRow(null);
  };

  return (
    <>
      <Page>
        <PageHeader>
          <TitleArea>
            <PageTitle>품질관리</PageTitle>
            <PageDescription>
              생산 제품의 검사 결과와 불량 이력을 통합 관리합니다.
            </PageDescription>
          </TitleArea>
        </PageHeader>

        <SummaryGrid>
          <SummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<FiClipboard />}
            iconBoxSize={48}
            iconSize={24}
            title="검사 건수"
            titleFontSize={13}
            value={summary.total.toLocaleString()}
            valueFontSize={24}
            description=""
          />

          <SummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<FiCheckCircle />}
            iconBoxSize={48}
            iconSize={24}
            iconBackground="#e9f2ff"
            iconColor="#0755d9"
            title="OK"
            titleFontSize={13}
            value={summary.ok.toLocaleString()}
            valueFontSize={24}
            description=""
          />

          <SummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<FiXCircle />}
            iconBoxSize={48}
            iconSize={24}
            iconBackground="#fdebec"
            iconColor="#d92d34"
            title="NG"
            titleFontSize={13}
            value={summary.ng.toLocaleString()}
            valueFontSize={24}
            description=""
          />

          <SummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<span style={{ fontSize: 22 }}>%</span>}
            iconBoxSize={48}
            iconSize={24}
            title="OK 비율"
            titleFontSize={13}
            value={`${summary.okRate}%`}
            valueFontSize={24}
            description=""
          />

          <SummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<FiXCircle />}
            iconBoxSize={48}
            iconSize={24}
            iconBackground="#fdebec"
            iconColor="#d92d34"
            title="최다 불량"
            titleFontSize={13}
            value={summary.topDefect}
            valueFontSize={20}
            description=""
          />
        </SummaryGrid>

        <ChartGrid>
          <Panel>
            <PanelTitle>일자별 OK/NG 추이</PanelTitle>

            <ChartBox>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={TREND_DATA}
                  margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e8ee"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#8a919d"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#8a919d"
                  />
                  <Tooltip cursor={false} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ok"
                    name="OK"
                    stroke="#08a879"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ng"
                    name="NG"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>
          </Panel>

          <Panel>
            <PanelTitle>불량 유형 분포</PanelTitle>

            <ChartBox>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DEFECT_CHART_DATA}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e8ee"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="#8a919d"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#8a919d"
                  />
                  <Tooltip cursor={false} />

                  <Bar
                    dataKey="value"
                    name="불량 수량"
                    radius={[5, 5, 0, 0]}
                  >
                    {DEFECT_CHART_DATA.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={BAR_COLORS[index]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          </Panel>
        </ChartGrid>

        <FilterPanel>
          <PanelTitle>검사 이력 검색</PanelTitle>

          <SearchFilterBar
            defaultValues={{
              startDate: "",
              endDate: "",
              result: "",
              defectType: "",
              keyword: "",
            }}
            startDateLabel="시작일"
            endDateLabel="종료일"
            dateWidth={130}
            filters={[
              {
                name: "result",
                label: "판정",
                placeholder: "전체 판정",
                width: 130,
                options: [
                  { value: "OK", label: "OK" },
                  { value: "NG", label: "NG" },
                ],
              },
              {
                name: "defectType",
                label: "불량 유형",
                placeholder: "불량 유형 전체",
                width: 160,
                options: [
                  { value: "스크래치", label: "스크래치" },
                  { value: "오염", label: "오염" },
                  { value: "치수 불량", label: "치수 불량" },
                  { value: "정렬 불량", label: "정렬 불량" },
                ],
              },
            ]}
            keywordLabel="통합 검색"
            keywordPlaceholder="LOT / 작업지시 / 제품 / 공정 / 설비 / 작업자"
            keywordWidth={220}
            flexWrap="nowrap"
            padding={0}
            gap={10}
            border="none"
            borderRadius={0}
            inputHeight={38}
            showSearchButton={false}
            resetButtonText="초기화"
            onChange={handleFilterChange}
            onSearch={handleFilterSearch}
            onReset={handleFilterReset}
          />
        </FilterPanel>

        <TablePanel>
          <TableHeader>
            <TableTitle>검사 이력</TableTitle>
          </TableHeader>

          <Pagination
            columns={qualityColumns}
            rows={filteredRows}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            visiblePages={5}
            height={66}
            borderTop="1px solid #e2e6ee"
            background="#f5f6f8"
            onPageChange={setCurrentPage}
            onRowClick={openDetail}
            tableProps={{
              minWidth: 1180,
              tableLayout: "fixed",
              headerHeight: 58,
              rowHeight: 58,
              cellPadding: "0 14px",
              fontSize: 13,
              headerBackground: "#f1f3f6",
              headerColor: "#555d6c",
              cellColor: "#22262d",
              hoverBackground: "#f7faff",
              emptyText: "조건에 맞는 검사 이력이 없습니다.",
            }}
          />
        </TablePanel>
      </Page>

      {selectedRow && <Overlay onClick={closeDetail} />}

      <Drawer $open={Boolean(selectedRow)}>
        {selectedRow && (
          <>
            <DrawerHeader>
              <DrawerTitle>
                {selectedRow.result === "NG" ? (
                  <FiXCircle />
                ) : (
                  <FiCheckCircle />
                )}

                {selectedRow.result === "NG"
                  ? "불량 상세"
                  : "검사 상세"}
              </DrawerTitle>

              <CloseButton
                type="button"
                aria-label="상세 닫기"
                onClick={closeDetail}
              >
                <FiX size={22} />
              </CloseButton>
            </DrawerHeader>

            <DrawerBody>
              <DrawerSection>
                <SectionTitle>검사 정보</SectionTitle>

                <DetailCard>
                  <DetailGrid>
                    <DetailItem>
                      <DetailLabel>검사 일시</DetailLabel>
                      <DetailValue>
                        {selectedRow.inspectedAt}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>판정</DetailLabel>
                      <ResultBadge $result={selectedRow.result}>
                        {selectedRow.result}
                      </ResultBadge>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>검사 작업자</DetailLabel>
                      <DetailValue>
                        {selectedRow.workerName}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>작업지시 번호</DetailLabel>
                      <DetailValue>
                        {selectedRow.workOrderNo}
                      </DetailValue>
                    </DetailItem>
                  </DetailGrid>
                </DetailCard>
              </DrawerSection>

              <DrawerSection>
                <SectionTitle>LOT 및 제품 정보</SectionTitle>

                <DetailCard>
                  <DetailGrid>
                    <DetailItem>
                      <DetailLabel>LOT 번호</DetailLabel>
                      <DetailValue>{selectedRow.lotNo}</DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>제품명</DetailLabel>
                      <DetailValue>
                        {selectedRow.productName}
                      </DetailValue>
                    </DetailItem>
                  </DetailGrid>
                </DetailCard>
              </DrawerSection>

              <DrawerSection>
                <SectionTitle>공정 및 설비 정보</SectionTitle>

                <DetailCard>
                  <DetailGrid>
                    <DetailItem>
                      <DetailLabel>공정 코드</DetailLabel>
                      <DetailValue>
                        {selectedRow.processCode}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>공정명</DetailLabel>
                      <DetailValue>
                        {selectedRow.processName}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>설비 코드</DetailLabel>
                      <DetailValue>
                        {selectedRow.machineCode}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>설비명</DetailLabel>
                      <DetailValue>
                        {selectedRow.machineName}
                      </DetailValue>
                    </DetailItem>
                  </DetailGrid>
                </DetailCard>
              </DrawerSection>

              <DrawerSection>
                <SectionTitle>측정 정보</SectionTitle>

                <DetailCard>
                  <DetailGrid>
                    <DetailItem>
                      <DetailLabel>전압</DetailLabel>
                      <DetailValue>
                        {selectedRow.voltage}V
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>습도</DetailLabel>
                      <DetailValue>
                        {selectedRow.humidity}%
                      </DetailValue>
                    </DetailItem>
                  </DetailGrid>
                </DetailCard>
              </DrawerSection>

              {selectedRow.result === "NG" && (
                <DrawerSection>
                  <SectionTitle>불량 정보</SectionTitle>

                  <DefectCard>
                    <DetailGrid>
                      <DetailItem>
                        <DetailLabel>불량 코드</DetailLabel>
                        <DetailValue>
                          {selectedRow.defectCode}
                        </DetailValue>
                      </DetailItem>

                      <DetailItem>
                        <DetailLabel>불량 유형</DetailLabel>
                        <DetailValue>
                          {selectedRow.defectType}
                        </DetailValue>
                      </DetailItem>

                      <DetailItem>
                        <DetailLabel>불량 수량</DetailLabel>
                        <DetailValue>
                          {selectedRow.defectQty}
                        </DetailValue>
                      </DetailItem>

                      <DetailItem>
                        <DetailLabel>최근 발생 시각</DetailLabel>
                        <DetailValue>
                          {selectedRow.inspectedAt}
                        </DetailValue>
                      </DetailItem>
                    </DetailGrid>
                  </DefectCard>
                </DrawerSection>
              )}
            </DrawerBody>
          </>
        )}
      </Drawer>
    </>
  );
}

export default QualityPage;
