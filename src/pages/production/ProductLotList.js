import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import FinishedLotDetailDrawer from "./ProductLotDetail";
import CommonPagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import SearchFilterBar from "../../components/ui/SearchFilterBar";
import SummaryCard from "../../components/ui/SummaryCard";
import { FiCheckCircle, FiClock, FiRefreshCw } from "react-icons/fi";
import masterApi from "../../api/master";
import reportApi from "../../api/report";

const PAGE_SIZE = 8;

const TABLE_COLUMNS = [
  { key: "no", label: "NO" },
  { key: "lotNoCell", label: "LOT ID" },
  { key: "productNameCell", label: "제품명" },
  { key: "workOrderCell", label: "작업지시 번호" },
  { key: "inspectionQtyCell", label: "검사 수량" },
  { key: "resultCell", label: "합격 / 불합격" },
  { key: "createdCell", label: "생산일" },
  { key: "statusCell", label: "LOT 상태" },
];

const STATUS_LABELS = {
  COMPLETED: "생산완료",
  IN_PROGRESS: "생산중",
  WAITING: "생산 대기",
};

const getStatusTone = (status) => {
  if (status === "생산완료") return "success";
  if (status === "생산중") return "neutral";
  return "neutral";
};

const formatNumber = new Intl.NumberFormat("ko-KR");

const formatCreatedAt = (date, time = "") => {
  if (!date && !time) return "-";
  if (!time) return date || "-";

  const match = time.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (!match) return `${date} ${time}`;

  const [, period, hourText, minute] = match;
  const hour = Number(hourText);
  const normalizedHour = period === "오후"
    ? (hour % 12) + 12
    : hour % 12;

  return `${date} ${String(normalizedHour).padStart(2, "0")}:${minute}`;
};

const initialFilters = {
  keyword: "",
  productCode: "ALL",
  workOrderNo: "ALL",
  startDate: "",
  endDate: "",
};

const toDisplayStatus = (status) => STATUS_LABELS[status] || status || "-";

const splitDateTime = (value) => {
  if (!value) return { date: "", time: "" };
  const normalized = String(value).replace("T", " ");
  const [date, time = ""] = normalized.split(" ");
  return { date, time: time.slice(0, 5) };
};

const normalizeKey = (value) => String(value ?? "").trim().toLowerCase();

const buildEquipmentMaps = (equipmentRows) => {
  const byProcessCode = new Map();
  const byEquipmentName = new Map();

  equipmentRows.forEach((equipment) => {
    const processCode = normalizeKey(equipment.process?.processCode);
    const equipmentName = normalizeKey(equipment.equipmentName);

    if (processCode) byProcessCode.set(processCode, equipment);
    if (equipmentName) byEquipmentName.set(equipmentName, equipment);
  });

  return { byProcessCode, byEquipmentName };
};

const findEquipment = (process, equipmentMaps) =>
  equipmentMaps.byProcessCode.get(normalizeKey(process.processCode)) ||
  equipmentMaps.byEquipmentName.get(normalizeKey(process.equipmentName));

const enrichProcesses = (processes, equipmentMaps) =>
  processes.map((process) => {
    const equipment = findEquipment(process, equipmentMaps);

    return {
      ...process,
      equipmentCode: equipment?.equipmentCode ?? "",
      equipmentName: process.equipmentName || equipment?.equipmentName || "",
    };
  });

const mapReportLot = (lot, equipmentMaps) => {
  const { date, time } = splitDateTime(lot.productionDate);
  const processes = enrichProcesses(lot.processes ?? [], equipmentMaps);

  return {
    id: lot.id,
    lotId: lot.id,
    lotNo: lot.lotNo ?? "",
    productCode: lot.productCode ?? "",
    productName: lot.productName ?? "",
    workOrderNo: lot.workOrderNo ?? "",
    lotQty: Number(lot.planQty ?? 0),
    inspectionQty: Number(lot.actualQty ?? 0),
    goodQty: Number(lot.goodQty ?? 0),
    defectQty: Number(lot.defectQty ?? 0),
    createdDate: date,
    createdTime: time,
    status: toDisplayStatus(lot.status),
    rawStatus: lot.status,
    equipment: lot.equipment ?? "",
    yieldRate: Number(lot.yieldRate ?? 0),
    processes,
    materials: lot.materials ?? [],
    quality: lot.quality ?? null,
  };
};

export default function ProductLotList() {
  const [lots, setLots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedLot, setSelectedLot] = useState(null);

  const loadLots = async () => {
    setIsLoading(true);
    try {
      const [lotResponse, equipmentResponse] = await Promise.all([
        reportApi.getLots(),
        masterApi.getEquipment().catch((error) => {
          console.warn("설비 기준정보 조회 실패:", error);
          return { data: [] };
        }),
      ]);
      const equipmentMaps = buildEquipmentMaps(equipmentResponse.data ?? []);
      setLots((lotResponse.data ?? []).map((lot) => mapReportLot(lot, equipmentMaps)));
    } catch (error) {
      console.error("완제품 LOT 목록 조회 실패:", error);
      window.alert("완제품 LOT 목록을 불러오지 못했습니다.");
      setLots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLots();
  }, []);

  const productOptions = useMemo(
    () => [
      ...new Map(
        lots.map((lot) => [lot.productCode, lot.productName]),
      ).entries(),
    ],
    [lots],
  );
  const workOrderOptions = useMemo(
    () => [...new Set(lots.map((lot) => lot.workOrderNo).filter(Boolean))],
    [lots],
  );

  const counts = useMemo(
    () =>
      Object.fromEntries(
        ["생산완료", "생산중", "생산 대기"].map((status) => [
          status,
          lots.filter((lot) => lot.status === status).length,
        ]),
      ),
    [lots],
  );

  const filteredRows = useMemo(
    () =>
      lots.filter((lot) => {
        const keyword = filters.keyword.trim().toLowerCase();
        return (
          (!keyword || lot.lotNo.toLowerCase().includes(keyword)) &&
          (filters.productCode === "ALL" ||
            lot.productCode === filters.productCode) &&
          (filters.workOrderNo === "ALL" ||
            lot.workOrderNo === filters.workOrderNo) &&
          (!filters.startDate || lot.createdDate >= filters.startDate) &&
          (!filters.endDate || lot.createdDate <= filters.endDate)
        );
      }),
    [filters, lots],
  );

  const tableRows = filteredRows.map((lot, index) => ({
    ...lot,
    originalLot: lot,
    no: index + 1,
    lotNoCell: (
      <LotLink
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          openLotDetail(lot);
        }}
      >
        {lot.lotNo}
      </LotLink>
    ),
    productNameCell: <ProductName>{lot.productName}</ProductName>,
    workOrderCell: <WorkOrderText>{lot.workOrderNo}</WorkOrderText>,
    inspectionQtyCell: formatNumber.format(lot.inspectionQty),
    resultCell: (
      <>
        <Good>{formatNumber.format(lot.goodQty)}</Good>
        <Divider>/</Divider>
        <Defect>{formatNumber.format(lot.defectQty)}</Defect>
      </>
    ),
    createdCell: (
      <DateTimeText>{formatCreatedAt(lot.createdDate, lot.createdTime)}</DateTimeText>
    ),
    statusCell: (
      <Status tone={getStatusTone(lot.status)} $status={lot.status}>
        <StatusDot />
        {lot.status}
      </Status>
    ),
  }));

  const reset = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const openLotDetail = (lot) => setSelectedLot(lot);

  return (
    <Page>
      <Content>
        <Header>
          <div>
            <Title>완제품 LOT 목록</Title>
            <Description>
              생산 완료된 제품의 LOT 정보를 조회하고 품질 판정 결과를
              모니터링합니다.
            </Description>
          </div>
        </Header>

        <SummaryGrid>
          <StatusSummaryCard
            height={116}
            gap={14}
            icon={<FiCheckCircle />}
            iconBoxSize={50}
            iconSize={24}
            iconBackground="#e5f8ec"
            iconColor="#16a765"
            title="생산완료"
            titleFontSize={13}
            value={counts.생산완료}
            valueFontSize={25}
          />

          <StatusSummaryCard
            height={116}
            gap={14}
            icon={<FiRefreshCw />}
            iconBoxSize={50}
            iconSize={24}
            iconBackground="#e7f0ff"
            iconColor="#2563eb"
            title="생산중"
            titleFontSize={13}
            value={counts.생산중}
            valueFontSize={25}
          />

          <StatusSummaryCard
            height={116}
            gap={14}
            icon={<FiClock />}
            iconBoxSize={50}
            iconSize={24}
            iconBackground="#fff4d8"
            iconColor="#d98a00"
            title="생산대기"
            titleFontSize={13}
            value={counts["생산 대기"]}
            valueFontSize={25}
          />
        </SummaryGrid>

        <FilterPanel>
          <FilterTitle>완제품 LOT 검색</FilterTitle>

          <SearchFilterBar
            filters={[
              {
                name: "productCode",
                label: "제품명",
                width: 220,
                options: [
                  { value: "ALL", label: "전체 제품군" },
                  ...productOptions.map(([value, label]) => ({
                    value,
                    label,
                  })),
                ],
              },
              {
                name: "workOrderNo",
                label: "작업지시 번호",
                width: 190,
                options: [
                  { value: "ALL", label: "전체 작업지시" },
                  ...workOrderOptions.map((value) => ({
                    value,
                    label: value,
                  })),
                ],
              },
            ]}
            defaultValues={initialFilters}
            keywordLabel="LOT 번호"
            keywordPlaceholder="예: LOT-2023-..."
            startDateLabel="생산 시작일"
            endDateLabel="생산 종료일"
            showSearchButton={false}
            padding={0}
            border="0"
            background="transparent"
            onChange={(values) => {
              setFilters(values);
              setPage(1);
            }}
            onReset={reset}
          />
        </FilterPanel>

        <TablePanel>
          <TableTop>
            <TableTitle>완제품 LOT 현황</TableTitle>
            <TopResultText>
              조회 결과 <strong>{filteredRows.length}</strong>건
              {isLoading ? " 불러오는 중" : ""}
            </TopResultText>
          </TableTop>
          <TableArea>
            <CommonPagination
              columns={TABLE_COLUMNS}
              rows={tableRows}
              currentPage={page}
              totalItems={filteredRows.length}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setPage}
              onRowClick={(row) => openLotDetail(row.originalLot)}
              tableProps={{ minWidth: 1170 }}
            />
          </TableArea>
        </TablePanel>
      </Content>
      <FinishedLotDetailDrawer
        lot={selectedLot}
        onClose={() => setSelectedLot(null)}
      />
    </Page>
  );
}

const Page = styled.main`
  min-height: 100vh;
  padding: var(--page-container-padding);
  background: #f8f8fe;
  color: #172033;
`;

const Content = styled.div`
  width: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--page-section-gap);
  margin-bottom: var(--page-header-content-gap);
  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: var(--page-title-color);
  font-size: var(--page-title-size);
  line-height: var(--page-title-line-height);
  font-weight: var(--page-title-weight);
  letter-spacing: var(--page-title-letter-spacing);
`;

const Description = styled.p`
  margin-top: var(--page-title-subtitle-gap);
  color: var(--page-subtitle-color);
  font-size: var(--page-subtitle-size);
  font-weight: var(--page-subtitle-weight);
  line-height: var(--page-subtitle-line-height);
`;

const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--page-box-gap);
  margin-bottom: var(--page-section-gap);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const StatusSummaryCard = styled(SummaryCard)`
  flex-direction: row;
  align-items: center;
`;

const FilterPanel = styled.section`
  padding: var(--page-panel-padding);
  border: 1px solid #d7dde8;
  border-radius: 12px;
  background: #fff;
`;

const FilterTitle = styled.h2`
  margin: 0 0 14px;
  color: #292d35;
  font-size: 16px;
  font-weight: 600;
`;

const TablePanel = styled.section`
  margin-top: 26px;
  overflow: hidden;
  border: 1px solid #dce1ea;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(35, 50, 80, 0.04);
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
  color: #292d35;
  font-size: 16px;
  font-weight: 600;
`;

const TopResultText = styled.span`
  color: #737b88;
  font-size: 13px;

  strong {
    color: #0755d9;
  }
`;

const TableArea = styled.div`
  > div {
    border: 0;
    border-radius: 0;
  }

  th {
    border-bottom: 1px solid #e3e7ed;
    vertical-align: middle;
    background: #f1f3f6;
    color: #535b68;
    font-weight: 600;
    text-align: center !important;
  }

  th + th {
    border-left: 0;
  }

  th:first-child {
    width: 6%;
  }
  th:nth-child(2) {
    width: 16%;
  }
  th:nth-child(3) {
    width: 17%;
  }
  th:nth-child(4) {
    width: 16%;
  }
  th:nth-child(5) {
    width: 9%;
  }
  th:nth-child(6) {
    width: 12%;
  }
  th:nth-child(7) {
    width: 14%;
  }
  th:last-child {
    width: 11%;
  }

  td {
    color: #252a32;
    text-align: center !important;
    vertical-align: middle;
    white-space: nowrap;
  }

  tbody tr:hover {
    background: #f6f9ff;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

const LotLink = styled.button`
  color: #174b9c;
  font-family: var(--font-family-base);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;

const ProductName = styled.div`
  color: #252a32;
  font-size: 13px;
  font-weight: 400;
`;

const WorkOrderText = styled.div`
  color: #174b9c;
  font-size: 13px;
  font-weight: 600;
`;

const DateTimeText = styled.span`
  color: #252a32;
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
`;

const Good = styled.span`
  color: #00499c;
  font-size: 13px;
  font-weight: 600;
`;

const Divider = styled.span`
  margin: 0 9px;
  color: #9aa3b2;
`;

const Defect = styled.span`
  color: #697286;
  font-size: 13px;
  font-weight: 600;
`;

const Status = styled(Badge)`
  gap: 5px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $status }) =>
    $status === "생산완료"
      ? "#168853"
      : $status === "생산중"
        ? "#1767bf"
        : "#7a8495"};
  background: ${({ $status }) =>
    $status === "생산완료"
      ? "#e5f8ec"
      : $status === "생산중"
        ? "#e7f1ff"
        : "#eef1f5"};
`;

const StatusDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
`;
