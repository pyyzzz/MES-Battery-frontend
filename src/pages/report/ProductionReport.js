import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiActivity,
  FiCheckCircle,
  FiLayers,
  FiPackage,
  FiTrendingUp,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import UiButton from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import SearchFilterBar from "../../components/ui/SearchFilterBar";
import SummaryCard from "../../components/ui/SummaryCard";

/* =========================================================
   Mock 데이터
========================================================= */

const MOCK_REPORT_ROWS = [
  {
    id: 1,
    productionDate: "2026-02-10",
    lotNo: "LOT-20260210-005",
    productCode: "BAT-12V-M",
    productName: "12V 중형 배터리",
    workOrderNo: "WO-20260210-005",
    planQty: 55,
    actualQty: 71,
    goodQty: 70,
    defectQty: 1,
    status: "COMPLETED",
    equipment: "Inspector #1",
    yieldRate: 98.6,
    processes: [
      {
        processCode: "PROC-010",
        processName: "전극공정",
        equipmentName: "Electrode Line #1",
        workerName: "김민수",
        startedAt: "2026-02-10 08:00",
        endedAt: "2026-02-10 09:10",
        result: "완료",
      },
      {
        processCode: "PROC-020",
        processName: "조립공정",
        equipmentName: "Assembly Line #1",
        workerName: "이현수",
        startedAt: "2026-02-10 09:20",
        endedAt: "2026-02-10 10:35",
        result: "완료",
      },
      {
        processCode: "PROC-030",
        processName: "활성화공정",
        equipmentName: "Formation Sys #1",
        workerName: "박지훈",
        startedAt: "2026-02-10 10:45",
        endedAt: "2026-02-10 12:15",
        result: "완료",
      },
      {
        processCode: "PROC-050",
        processName: "검사공정",
        equipmentName: "Inspector #1",
        workerName: "김하린",
        startedAt: "2026-02-10 13:10",
        endedAt: "2026-02-10 14:00",
        result: "NG 1건",
      },
    ],
    materials: [
      {
        materialCode: "MAT-001",
        materialName: "양극판",
        materialLotNo: "ML-20260208-001",
        quantity: 142,
        unit: "EA",
      },
      {
        materialCode: "MAT-002",
        materialName: "음극판",
        materialLotNo: "ML-20260208-002",
        quantity: 142,
        unit: "EA",
      },
      {
        materialCode: "MAT-003",
        materialName: "전해액",
        materialLotNo: "ML-20260209-003",
        quantity: 85.2,
        unit: "L",
      },
    ],
    quality: {
      result: "NG",
      inspectedAt: "2026-02-10 14:00",
      inspectorName: "김하린",
      defectCode: "SCRATCH",
      defectType: "스크래치",
      defectQty: 1,
      voltage: 12.7,
      resistance: 3.1,
    },
  },
  {
    id: 2,
    productionDate: "2026-02-10",
    lotNo: "LOT-20260210-004",
    productCode: "BAT-12V-L",
    productName: "12V 대형 배터리",
    workOrderNo: "WO-20260210-004",
    planQty: 11,
    actualQty: 14,
    goodQty: 14,
    defectQty: 0,
    status: "COMPLETED",
    equipment: "Assembly Line #2",
    yieldRate: 100,
    processes: [
      {
        processCode: "PROC-010",
        processName: "전극공정",
        equipmentName: "Electrode Line #2",
        workerName: "최지훈",
        startedAt: "2026-02-10 08:10",
        endedAt: "2026-02-10 09:00",
        result: "완료",
      },
      {
        processCode: "PROC-020",
        processName: "조립공정",
        equipmentName: "Assembly Line #2",
        workerName: "이수진",
        startedAt: "2026-02-10 09:10",
        endedAt: "2026-02-10 10:00",
        result: "완료",
      },
      {
        processCode: "PROC-050",
        processName: "검사공정",
        equipmentName: "Inspector #2",
        workerName: "김하린",
        startedAt: "2026-02-10 11:00",
        endedAt: "2026-02-10 11:30",
        result: "완료",
      },
    ],
    materials: [
      {
        materialCode: "MAT-001",
        materialName: "양극판",
        materialLotNo: "ML-20260208-001",
        quantity: 28,
        unit: "EA",
      },
      {
        materialCode: "MAT-004",
        materialName: "배터리 케이스",
        materialLotNo: "ML-20260209-004",
        quantity: 14,
        unit: "EA",
      },
    ],
    quality: {
      result: "OK",
      inspectedAt: "2026-02-10 11:30",
      inspectorName: "김하린",
      defectCode: "",
      defectType: "",
      defectQty: 0,
      voltage: 12.8,
      resistance: 2.9,
    },
  },
  {
    id: 3,
    productionDate: "2026-02-10",
    lotNo: "LOT-20260210-003",
    productCode: "BAT-12V-S",
    productName: "12V 소형 배터리",
    workOrderNo: "WO-20260210-003",
    planQty: 123,
    actualQty: 156,
    goodQty: 150,
    defectQty: 6,
    status: "COMPLETED",
    equipment: "Formation Sys #1",
    yieldRate: 96.2,
    processes: [
      {
        processCode: "PROC-010",
        processName: "전극공정",
        equipmentName: "Electrode Line #1",
        workerName: "김민수",
        startedAt: "2026-02-10 07:50",
        endedAt: "2026-02-10 09:30",
        result: "완료",
      },
      {
        processCode: "PROC-030",
        processName: "활성화공정",
        equipmentName: "Formation Sys #1",
        workerName: "박지훈",
        startedAt: "2026-02-10 10:00",
        endedAt: "2026-02-10 12:50",
        result: "완료",
      },
      {
        processCode: "PROC-050",
        processName: "검사공정",
        equipmentName: "Inspector #1",
        workerName: "김하린",
        startedAt: "2026-02-10 13:00",
        endedAt: "2026-02-10 14:10",
        result: "NG 6건",
      },
    ],
    materials: [
      {
        materialCode: "MAT-001",
        materialName: "양극판",
        materialLotNo: "ML-20260208-001",
        quantity: 312,
        unit: "EA",
      },
      {
        materialCode: "MAT-002",
        materialName: "음극판",
        materialLotNo: "ML-20260208-002",
        quantity: 312,
        unit: "EA",
      },
    ],
    quality: {
      result: "NG",
      inspectedAt: "2026-02-10 14:10",
      inspectorName: "김하린",
      defectCode: "MISALIGNMENT",
      defectType: "정렬 불량",
      defectQty: 6,
      voltage: 12.4,
      resistance: 3.8,
    },
  },
  {
    id: 4,
    productionDate: "2026-02-09",
    lotNo: "LOT-20260209-005",
    productCode: "BAT-12V-S",
    productName: "12V 소형 배터리",
    workOrderNo: "WO-20260209-005",
    planQty: 201,
    actualQty: 230,
    goodQty: 219,
    defectQty: 11,
    status: "COMPLETED",
    equipment: "Formation Sys #2",
    yieldRate: 95.2,
    processes: [
      {
        processCode: "PROC-010",
        processName: "전극공정",
        equipmentName: "Electrode Line #1",
        workerName: "김민수",
        startedAt: "2026-02-09 08:00",
        endedAt: "2026-02-09 09:40",
        result: "완료",
      },
      {
        processCode: "PROC-030",
        processName: "활성화공정",
        equipmentName: "Formation Sys #2",
        workerName: "박지훈",
        startedAt: "2026-02-09 10:00",
        endedAt: "2026-02-09 13:20",
        result: "완료",
      },
      {
        processCode: "PROC-050",
        processName: "검사공정",
        equipmentName: "Inspector #2",
        workerName: "김하린",
        startedAt: "2026-02-09 13:30",
        endedAt: "2026-02-09 15:00",
        result: "NG 11건",
      },
    ],
    materials: [
      {
        materialCode: "MAT-001",
        materialName: "양극판",
        materialLotNo: "ML-20260207-001",
        quantity: 460,
        unit: "EA",
      },
    ],
    quality: {
      result: "NG",
      inspectedAt: "2026-02-09 15:00",
      inspectorName: "김하린",
      defectCode: "CONTAMINATION",
      defectType: "오염",
      defectQty: 11,
      voltage: 12.3,
      resistance: 4.1,
    },
  },
  {
    id: 5,
    productionDate: "2026-02-09",
    lotNo: "LOT-20260209-004",
    productCode: "BAT-12V-M",
    productName: "12V 중형 배터리",
    workOrderNo: "WO-20260209-004",
    planQty: 11,
    actualQty: 14,
    goodQty: 14,
    defectQty: 0,
    status: "COMPLETED",
    equipment: "Assembly Line #1",
    yieldRate: 100,
    processes: [
      {
        processCode: "PROC-020",
        processName: "조립공정",
        equipmentName: "Assembly Line #1",
        workerName: "이현수",
        startedAt: "2026-02-09 09:00",
        endedAt: "2026-02-09 10:10",
        result: "완료",
      },
      {
        processCode: "PROC-050",
        processName: "검사공정",
        equipmentName: "Inspector #1",
        workerName: "김하린",
        startedAt: "2026-02-09 10:30",
        endedAt: "2026-02-09 11:00",
        result: "완료",
      },
    ],
    materials: [
      {
        materialCode: "MAT-004",
        materialName: "배터리 케이스",
        materialLotNo: "ML-20260208-004",
        quantity: 14,
        unit: "EA",
      },
    ],
    quality: {
      result: "OK",
      inspectedAt: "2026-02-09 11:00",
      inspectorName: "김하린",
      defectCode: "",
      defectType: "",
      defectQty: 0,
      voltage: 12.8,
      resistance: 2.7,
    },
  },
  {
    id: 6,
    productionDate: "2026-02-08",
    lotNo: "LOT-20260208-003",
    productCode: "BAT-12V-L",
    productName: "12V 대형 배터리",
    workOrderNo: "WO-20260208-003",
    planQty: 80,
    actualQty: 78,
    goodQty: 76,
    defectQty: 2,
    status: "COMPLETED",
    equipment: "Pack Line #1",
    yieldRate: 97.4,
    processes: [
      {
        processCode: "PROC-020",
        processName: "조립공정",
        equipmentName: "Assembly Line #2",
        workerName: "이수진",
        startedAt: "2026-02-08 08:30",
        endedAt: "2026-02-08 10:00",
        result: "완료",
      },
      {
        processCode: "PROC-040",
        processName: "팩공정",
        equipmentName: "Pack Line #1",
        workerName: "박지훈",
        startedAt: "2026-02-08 10:20",
        endedAt: "2026-02-08 11:40",
        result: "완료",
      },
    ],
    materials: [],
    quality: {
      result: "NG",
      inspectedAt: "2026-02-08 12:00",
      inspectorName: "김하린",
      defectCode: "DIMENSION",
      defectType: "치수 불량",
      defectQty: 2,
      voltage: 12.5,
      resistance: 3.5,
    },
  },
];

const DAILY_CHART_DATA = [
  { date: "02-05", plan: 350, actual: 342 },
  { date: "02-06", plan: 380, actual: 371 },
  { date: "02-07", plan: 400, actual: 396 },
  { date: "02-08", plan: 410, actual: 402 },
  { date: "02-09", plan: 430, actual: 458 },
  { date: "02-10", plan: 450, actual: 485 },
];

const PROCESS_CHART_DATA = [
  { process: "전극", output: 280, defect: 21 },
  { process: "조립", output: 265, defect: 17 },
  { process: "활성화", output: 250, defect: 13 },
  { process: "팩", output: 242, defect: 8 },
  { process: "검사", output: 231, defect: 5 },
];

/* =========================================================
   Styled Components
========================================================= */

const Page = styled.div`
  min-height: 100%;
  padding: 28px 32px 44px;
  box-sizing: border-box;
  background: #f7f8fa;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
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
  color: #888f9c;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 850px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ReportSummaryCard = styled(SummaryCard)`
  flex-direction: row;
  align-items: center;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  padding: 22px;

  background: #ffffff;
  border: 1px solid #dce1ea;
  border-radius: 12px;
`;

const PanelTitle = styled.h2`
  margin: 0 0 18px;

  font-size: 17px;
  font-weight: 600;
  color: #292d35;
`;

const ChartBox = styled.div`
  width: 100%;
  height: 270px;
`;

const FilterPanel = styled(Panel)`
  margin-bottom: 20px;
`;

const TablePanel = styled.section`
  overflow: hidden;

  background: #ffffff;
  border: 1px solid #dce1ea;
  border-radius: 12px;
`;

const TableTop = styled.div`
  min-height: 62px;
  padding: 0 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #e2e6ed;
`;

const TableTitle = styled.h2`
  margin: 0;

  font-size: 17px;
  font-weight: 600;
  color: #292d35;
`;

const TableSummary = styled.span`
  font-size: 13px;
  color: #767e8b;

  strong {
    color: #0755d9;
  }
`;

const LotNumber = styled.strong`
  display: inline-block;
  color: #174b9c;
  font-weight: 600;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 5px 9px;

  border: 1px solid #bfd4fa;
  border-radius: 999px;

  background: #eaf2ff;
  color: #0755d9;

  font-size: 11px;
  font-weight: 600;
`;

const QuantityNg = styled.strong`
  color: ${({ $hasDefect }) => ($hasDefect ? "#d92d34" : "#3b424d")};
`;

const EmptyMessage = styled.div`
  padding: 60px 20px;
  text-align: center;
  font-size: 14px;
  color: #9198a4;
`;

/* =========================================================
   Drawer
========================================================= */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 900;

  background: rgba(17, 24, 39, 0.45);
`;

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: ${({ $open }) => ($open ? "0" : "-560px")};
  z-index: 901;

  width: 560px;
  max-width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;

  background: #f8f9fb;
  border-left: 1px solid #d8dee9;
  box-shadow: -8px 0 28px rgba(15, 23, 42, 0.15);

  transition: right 0.25s ease;
`;

const DrawerHeader = styled.header`
  min-height: 70px;
  padding: 0 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #ffffff;
  border-bottom: 1px solid #dfe3eb;
`;

const DrawerTitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #0755d9;
  }
`;

const DrawerTitle = styled.h2`
  margin: 0;

  font-size: 18px;
  font-weight: 600;
  color: #20252d;
`;

const CloseButton = styled(UiButton)`
  width: 36px;
  height: 36px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 8px;

  background: transparent;
  color: #505968;

  cursor: pointer;

  &:hover {
    background: #eef1f5;
  }
`;

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;

  padding: 22px 24px 36px;
`;

const LotHero = styled.section`
  margin-bottom: 22px;
  padding: 20px;

  background: linear-gradient(135deg, #0755d9, #2874ec);
  border-radius: 12px;
  color: #ffffff;
`;

const LotHeroLabel = styled.span`
  display: block;
  margin-bottom: 6px;

  font-size: 12px;
  opacity: 0.8;
`;

const LotHeroNumber = styled.strong`
  display: block;
  margin-bottom: 18px;

  font-size: 20px;
  font-weight: 700;
`;

const LotHeroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
`;

const LotHeroItem = styled.div`
  padding: 10px;

  background: rgba(255, 255, 255, 0.12);
  border-radius: 8px;

  span {
    display: block;
    margin-bottom: 4px;

    font-size: 11px;
    opacity: 0.78;
  }

  strong {
    display: block;

    font-size: 14px;
    font-weight: 600;
  }
`;

const DrawerSection = styled.section`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 11px;
  padding-left: 10px;

  border-left: 4px solid #0755d9;

  font-size: 15px;
  font-weight: 600;
  color: #303640;
`;

const DetailCard = styled.div`
  padding: 18px;

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

const Timeline = styled.div`
  padding: 18px;

  background: #ffffff;
  border: 1px solid #ccd4e2;
  border-radius: 10px;
`;

const TimelineItem = styled.div`
  position: relative;

  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 12px;

  padding-bottom: 24px;

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child)::before {
    content: "";

    position: absolute;
    top: 20px;
    left: 9px;
    bottom: 0;

    width: 2px;
    background: #d7e2f5;
  }
`;

const TimelineDot = styled.div`
  position: relative;
  z-index: 1;

  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background: ${({ $warning }) => ($warning ? "#fdebec" : "#e7f0ff")};
  color: ${({ $warning }) => ($warning ? "#d92d34" : "#0755d9")};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const TimelineContent = styled.div`
  min-width: 0;
`;

const TimelineTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  margin-bottom: 8px;

  strong {
    font-size: 14px;
    color: #252a32;
  }

  span {
    font-size: 11px;
    color: #7a8391;
  }
`;

const TimelineInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px 14px;

  font-size: 12px;
  color: #636c79;
`;

const MiniTable = styled.table`
  width: 100%;

  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    padding: 10px 8px;
    border-bottom: 1px solid #e3e7ee;

    text-align: left;
    font-size: 12px;
  }

  th {
    background: #f3f5f8;
    color: #646d7b;
    font-weight: 500;
  }

  td {
    color: #292e36;
  }

  tr:last-child td {
    border-bottom: 0;
  }
`;

const QualityResult = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;

  padding: 5px 9px;

  border-radius: 999px;
  border: 1px solid
    ${({ $result }) => ($result === "OK" ? "#bdd6fa" : "#f2c3c6")};

  background: ${({ $result }) =>
    $result === "OK" ? "#eaf2ff" : "#fdecec"};

  color: ${({ $result }) =>
    $result === "OK" ? "#0755d9" : "#d92d34"};

  font-size: 12px;
  font-weight: 600;
`;

/* =========================================================
   Component
========================================================= */

function ProductionReport() {
  const [rows] = useState(MOCK_REPORT_ROWS);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    product: "",
    equipment: "",
    process: "",
    keyword: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLot, setSelectedLot] = useState(null);

  const itemsPerPage = 5;

  const filteredRows = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesStartDate =
        !filters.startDate ||
        row.productionDate >= filters.startDate;

      const matchesEndDate =
        !filters.endDate ||
        row.productionDate <= filters.endDate;

      const matchesProduct =
        !filters.product ||
        row.productCode === filters.product;

      const matchesEquipment =
        !filters.equipment ||
        row.processes.some(
          (process) =>
            process.equipmentName === filters.equipment
        );

      const matchesProcess =
        !filters.process ||
        row.processes.some(
          (process) =>
            process.processCode === filters.process
        );

      const searchableValues = [
        row.lotNo,
        row.productCode,
        row.productName,
        row.workOrderNo,
        row.equipment,
        ...row.materials.flatMap((material) => [
          material.materialCode,
          material.materialName,
          material.materialLotNo,
        ]),
      ];

      const matchesKeyword =
        !keyword ||
        searchableValues.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(keyword)
        );

      return (
        matchesStartDate &&
        matchesEndDate &&
        matchesProduct &&
        matchesEquipment &&
        matchesProcess &&
        matchesKeyword
      );
    });
  }, [rows, filters]);

  const summary = useMemo(() => {
    const planQty = filteredRows.reduce(
      (sum, row) => sum + row.planQty,
      0
    );

    const actualQty = filteredRows.reduce(
      (sum, row) => sum + row.actualQty,
      0
    );

    const goodQty = filteredRows.reduce(
      (sum, row) => sum + row.goodQty,
      0
    );

    const defectQty = filteredRows.reduce(
      (sum, row) => sum + row.defectQty,
      0
    );

    const achievementRate =
      planQty > 0
        ? Number(((actualQty / planQty) * 100).toFixed(1))
        : 0;

    const yieldRate =
      actualQty > 0
        ? Number(((goodQty / actualQty) * 100).toFixed(1))
        : 0;

    return {
      lotCount: filteredRows.length,
      planQty,
      actualQty,
      goodQty,
      defectQty,
      achievementRate,
      yieldRate,
    };
  }, [filteredRows]);

  const productionColumns = [
    { key: "productionDate", label: "생산일", width: 120 },
    { key: "lotNo", label: "LOT 번호", width: 190, render: (lotNo) => <LotNumber>{lotNo}</LotNumber> },
    { key: "productName", label: "제품명", width: 140 },
    { key: "planQty", label: "계획", width: 80, render: (quantity) => quantity.toLocaleString() },
    { key: "actualQty", label: "실적", width: 80, render: (quantity) => quantity.toLocaleString() },
    { key: "goodQty", label: "양품", width: 80, render: (quantity) => quantity.toLocaleString() },
    {
      key: "defectQty",
      label: "불량",
      width: 80,
      render: (quantity) => <QuantityNg $hasDefect={quantity > 0}>{quantity.toLocaleString()}</QuantityNg>,
    },
    { key: "yieldRate", label: "수율", width: 80, render: (rate) => `${rate}%` },
    { key: "status", label: "상태", width: 130, render: () => <StatusBadge>생산 완료</StatusBadge> },
  ];

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleOpenDetail = (row) => {
    setSelectedLot(row);
  };

  const handleCloseDetail = () => {
    setSelectedLot(null);
  };

  return (
    <>
      <Page>
        <PageHeader>
          <TitleArea>
            <PageTitle>생산 리포트</PageTitle>

            <PageDescription>
              생산 실적을 조회하고 LOT별 생산·자재·공정 이력을
              추적합니다.
            </PageDescription>
          </TitleArea>
        </PageHeader>

        <SummaryGrid>
          <ReportSummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<FiTrendingUp />}
            iconBoxSize={48}
            iconSize={24}
            iconBackground="#e8efff"
            iconColor="#0755d9"
            title="계획 대비 달성률"
            titleFontSize={13}
            value={`${summary.achievementRate}%`}
            valueFontSize={24}
          />

          <ReportSummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<FiPackage />}
            iconBoxSize={48}
            iconSize={24}
            iconBackground="#e8f8ef"
            iconColor="#17a964"
            title="생산 실적"
            titleFontSize={13}
            value={summary.actualQty.toLocaleString()}
            valueFontSize={24}
          />

          <ReportSummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<FiCheckCircle />}
            iconBoxSize={48}
            iconSize={24}
            iconBackground="#e8f8ef"
            iconColor="#17a964"
            title="양품"
            titleFontSize={13}
            value={summary.goodQty.toLocaleString()}
            valueFontSize={24}
          />

          <ReportSummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<FiXCircle />}
            iconBoxSize={48}
            iconSize={24}
            iconBackground="#fdecec"
            iconColor="#d92d34"
            title="불량"
            titleFontSize={13}
            value={summary.defectQty.toLocaleString()}
            valueFontSize={24}
          />

          <ReportSummaryCard
            height={110}
            padding={16}
            gap={12}
            icon={<FiActivity />}
            iconBoxSize={48}
            iconSize={24}
            iconBackground="#eef1ff"
            iconColor="#415fd5"
            title="수율"
            titleFontSize={13}
            value={`${summary.yieldRate}%`}
            valueFontSize={24}
          />
        </SummaryGrid>

        <ChartGrid>
          <Panel>
            <PanelTitle>일자별 계획 vs 실적</PanelTitle>

            <ChartBox>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={DAILY_CHART_DATA}
                  margin={{
                    top: 10,
                    right: 18,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="#e5e8ee"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#8a919d"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    stroke="#8a919d"
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="plan"
                    name="계획"
                    stroke="#28b979"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="실적"
                    stroke="#0755d9"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>
          </Panel>

          <Panel>
            <PanelTitle>공정별 생산량 / 불량량</PanelTitle>

            <ChartBox>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PROCESS_CHART_DATA}
                  margin={{
                    top: 10,
                    right: 16,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="#e5e8ee"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="process"
                    stroke="#8a919d"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    stroke="#8a919d"
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip cursor={false} />
                  <Legend />

                  <Bar
                    dataKey="output"
                    name="생산량"
                    fill="#0755d9"
                    radius={[5, 5, 0, 0]}
                  />

                  <Bar
                    dataKey="defect"
                    name="불량량"
                    fill="#ef4444"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          </Panel>
        </ChartGrid>

        <FilterPanel>
          <PanelTitle>생산 실적 검색</PanelTitle>

          <SearchFilterBar
            defaultValues={filters}
            startDateLabel="시작일"
            endDateLabel="종료일"
            dateWidth={150}
            filters={[
              {
                name: "product",
                label: "제품",
                placeholder: "전체 제품",
                width: 170,
                options: [
                  { value: "BAT-12V-S", label: "12V 소형 배터리" },
                  { value: "BAT-12V-M", label: "12V 중형 배터리" },
                  { value: "BAT-12V-L", label: "12V 대형 배터리" },
                ],
              },
              {
                name: "equipment",
                label: "설비",
                placeholder: "전체 설비",
                width: 160,
                options: [
                  "Electrode Line #1",
                  "Assembly Line #1",
                  "Assembly Line #2",
                  "Formation Sys #1",
                  "Formation Sys #2",
                  "Inspector #1",
                  "Inspector #2",
                ].map((value) => ({ value, label: value })),
              },
              {
                name: "process",
                label: "공정",
                placeholder: "전체 공정",
                width: 160,
                options: [
                  { value: "PROC-010", label: "전극공정" },
                  { value: "PROC-020", label: "조립공정" },
                  { value: "PROC-030", label: "활성화공정" },
                  { value: "PROC-040", label: "팩공정" },
                  { value: "PROC-050", label: "검사공정" },
                ],
              },
            ]}
            keywordLabel="통합 검색"
            keywordPlaceholder="LOT / 작업지시 / 자재 LOT / 제품명"
            keywordWidth={260}
            inputHeight={38}
            padding={0}
            border="none"
            showSearchButton={false}
            showResetButton
            resetButtonText="초기화"
            onChange={handleFilterChange}
          />
        </FilterPanel>

        <TablePanel>
          <TableTop>
            <TableTitle>LOT별 생산 실적</TableTitle>

            <TableSummary>
              조회 LOT <strong>{summary.lotCount}</strong>건 · 총 생산{" "}
              <strong>
                {summary.actualQty.toLocaleString()}
              </strong>
              개
            </TableSummary>
          </TableTop>

          <Pagination
            columns={productionColumns}
            rows={filteredRows}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            visiblePages={5}
            height={66}
            background="#f5f6f8"
            borderTop="1px solid #e2e6ed"
            onPageChange={setCurrentPage}
            onRowClick={handleOpenDetail}
            tableProps={{
              minWidth: 1080,
              tableLayout: "fixed",
              headerHeight: 48,
              rowHeight: 48,
              cellPadding: "0 14px",
              fontSize: 13,
              headerBackground: "#f1f3f6",
              headerColor: "#555d6b",
              cellColor: "#23272e",
              emptyText: "조건에 맞는 생산 실적이 없습니다.",
            }}
          />
        </TablePanel>
      </Page>

      {selectedLot && <Overlay onClick={handleCloseDetail} />}

      <Drawer $open={Boolean(selectedLot)}>
        {selectedLot && (
          <>
            <DrawerHeader>
              <DrawerTitleArea>
                <FiLayers size={20} />
                <DrawerTitle>LOT 추적 상세</DrawerTitle>
              </DrawerTitleArea>

              <CloseButton
                type="button"
                aria-label="상세 닫기"
                onClick={handleCloseDetail}
              >
                <FiX size={22} />
              </CloseButton>
            </DrawerHeader>

            <DrawerBody>
              <LotHero>
                <LotHeroLabel>LOT 번호</LotHeroLabel>
                <LotHeroNumber>{selectedLot.lotNo}</LotHeroNumber>

                <LotHeroGrid>
                  <LotHeroItem>
                    <span>총 생산</span>
                    <strong>{selectedLot.actualQty}</strong>
                  </LotHeroItem>

                  <LotHeroItem>
                    <span>양품</span>
                    <strong>{selectedLot.goodQty}</strong>
                  </LotHeroItem>

                  <LotHeroItem>
                    <span>불량</span>
                    <strong>{selectedLot.defectQty}</strong>
                  </LotHeroItem>
                </LotHeroGrid>
              </LotHero>

              <DrawerSection>
                <SectionTitle>LOT 기본 정보</SectionTitle>

                <DetailCard>
                  <DetailGrid>
                    <DetailItem>
                      <DetailLabel>제품 코드</DetailLabel>
                      <DetailValue>
                        {selectedLot.productCode}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>제품명</DetailLabel>
                      <DetailValue>
                        {selectedLot.productName}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>작업지시 번호</DetailLabel>
                      <DetailValue>
                        {selectedLot.workOrderNo}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>생산일</DetailLabel>
                      <DetailValue>
                        {selectedLot.productionDate}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>계획 수량</DetailLabel>
                      <DetailValue>
                        {selectedLot.planQty}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>수율</DetailLabel>
                      <DetailValue>
                        {selectedLot.yieldRate}%
                      </DetailValue>
                    </DetailItem>
                  </DetailGrid>
                </DetailCard>
              </DrawerSection>

              <DrawerSection>
                <SectionTitle>공정 타임라인</SectionTitle>

                <Timeline>
                  {selectedLot.processes.map((process) => {
                    const warning = process.result.includes("NG");

                    return (
                      <TimelineItem
                        key={`${process.processCode}-${process.startedAt}`}
                      >
                        <TimelineDot $warning={warning}>
                          {warning ? (
                            <FiXCircle />
                          ) : (
                            <FiCheckCircle />
                          )}
                        </TimelineDot>

                        <TimelineContent>
                          <TimelineTitle>
                            <strong>
                              {process.processName}
                            </strong>

                            <span>{process.result}</span>
                          </TimelineTitle>

                          <TimelineInfo>
                            <span>
                              공정 코드: {process.processCode}
                            </span>

                            <span>
                              설비: {process.equipmentName}
                            </span>

                            <span>
                              작업자: {process.workerName}
                            </span>

                            <span>
                              {process.startedAt} ~{" "}
                              {process.endedAt}
                            </span>
                          </TimelineInfo>
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })}
                </Timeline>
              </DrawerSection>

              <DrawerSection>
                <SectionTitle>투입 자재</SectionTitle>

                <DetailCard>
                  {selectedLot.materials.length > 0 ? (
                    <MiniTable>
                      <thead>
                        <tr>
                          <th>자재명</th>
                          <th>자재 LOT</th>
                          <th>투입 수량</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedLot.materials.map((material) => (
                          <tr
                            key={`${material.materialCode}-${material.materialLotNo}`}
                          >
                            <td>{material.materialName}</td>
                            <td>{material.materialLotNo}</td>
                            <td>
                              {material.quantity} {material.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </MiniTable>
                  ) : (
                    <EmptyMessage>
                      등록된 투입 자재가 없습니다.
                    </EmptyMessage>
                  )}
                </DetailCard>
              </DrawerSection>

              <DrawerSection>
                <SectionTitle>품질 및 불량 정보</SectionTitle>

                <DetailCard>
                  <DetailGrid>
                    <DetailItem>
                      <DetailLabel>검사 결과</DetailLabel>

                      <QualityResult
                        $result={selectedLot.quality.result}
                      >
                        {selectedLot.quality.result === "OK" ? (
                          <FiCheckCircle />
                        ) : (
                          <FiXCircle />
                        )}

                        {selectedLot.quality.result}
                      </QualityResult>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>검사 일시</DetailLabel>
                      <DetailValue>
                        {selectedLot.quality.inspectedAt}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>검사자</DetailLabel>
                      <DetailValue>
                        {selectedLot.quality.inspectorName}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>불량 수량</DetailLabel>
                      <DetailValue>
                        {selectedLot.quality.defectQty}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>불량 코드</DetailLabel>
                      <DetailValue>
                        {selectedLot.quality.defectCode || "-"}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>불량 유형</DetailLabel>
                      <DetailValue>
                        {selectedLot.quality.defectType || "-"}
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>측정 전압</DetailLabel>
                      <DetailValue>
                        {selectedLot.quality.voltage}V
                      </DetailValue>
                    </DetailItem>

                    <DetailItem>
                      <DetailLabel>내부 저항</DetailLabel>
                      <DetailValue>
                        {selectedLot.quality.resistance}mΩ
                      </DetailValue>
                    </DetailItem>
                  </DetailGrid>
                </DetailCard>
              </DrawerSection>
            </DrawerBody>
          </>
        )}
      </Drawer>
    </>
  );
}

export default ProductionReport;
