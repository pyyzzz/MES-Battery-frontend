import { useMemo, useState } from "react";
import styled from "styled-components";
import FinishedLotDetailDrawer from "./ProductLotDetail";
import CommonPagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import SearchFilterBar from "../../components/ui/SearchFilterBar";
import SummaryCard from "../../components/ui/SummaryCard";
import { FiCheckCircle, FiClock, FiRefreshCw } from "react-icons/fi";

// 완제품 LOT 목록 목업 데이터
// 아직 백엔드 API가 없어서 화면 테스트용으로 임시 데이터
// DB가 연결되면 이 배열 대신 API 응답 데이터를 받아서 사용

// 필드 의미
// - id: React에서 목록을 반복 렌더링할 때 쓰는 화면용 고유값
// - lotId, productId, workOrderId, fgInventoryId: DB 테이블의 PK/FK를 흉내 낸 값
// - lotNo: 사용자가 화면에서 확인하는 LOT 번호
// - productCode/productName: 제품 마스터(product)에서 오는 제품 정보
// - workOrderNo: 작업지시(work_order) 번호
// - lotQty: LOT에 배정된 생산 수량
// - inspectionQty/goodQty/defectQty: 생산실적/검사 결과 요약 수량
// - locationCode: 완제품 재고(fg_inventory)에 입고된 위치
// - createdDate/createdTime: LOT 생성일시, 날짜 필터와 테이블 표시에 사용
// - status: LOT 진행 상태, 배지 색상과 상세 화면 상태 표시에 사용
const LOTS = [
  {
    id: 1,
    lotId: 1001,
    lotNo: "LOT-20260714-001",
    productId: 201,
    productCode: "BAT-12V-060",
    productName: "차량용 배터리 12V 60Ah",
    workOrderId: 301,
    workOrderNo: "WO-20260714-001",
    lotQty: 5000,
    inspectionQty: 5000,
    goodQty: 4958,
    defectQty: 42,
    fgInventoryId: 401,
    locationCode: "FG-A-01",
    createdDate: "2026-07-14",
    createdTime: "오전 09:30",
    status: "생산완료",
  },
  {
    // 생산 진행 중인 LOT 예시
    id: 2,
    lotId: 1002,
    lotNo: "LOT-20260714-002",
    productId: 202,
    productCode: "BAT-12V-080",
    productName: "차량용 배터리 12V 80Ah",
    workOrderId: 302,
    workOrderNo: "WO-20260714-002",
    lotQty: 3200,
    inspectionQty: 3200,
    goodQty: 3168,
    defectQty: 32,
    fgInventoryId: 402,
    locationCode: "FG-A-02",
    createdDate: "2026-07-14",
    createdTime: "오전 11:10",
    status: "생산중",
  },
  {
    // 생산을 기다리는 LOT 예시
    id: 3,
    lotId: 1003,
    lotNo: "LOT-20260713-001",
    productId: 203,
    productCode: "BAT-12V-100",
    productName: "차량용 배터리 12V 100Ah",
    workOrderId: 303,
    workOrderNo: "WO-20260713-004",
    lotQty: 2800,
    inspectionQty: 2800,
    goodQty: 0,
    defectQty: 0,
    fgInventoryId: null,
    locationCode: "-",
    createdDate: "2026-07-13",
    createdTime: "오후 03:45",
    status: "생산 대기",
  },
  {
    // 생산 완료된 LOT 예시
    id: 4,
    lotId: 1004,
    lotNo: "LOT-20260713-002",
    productId: 201,
    productCode: "BAT-12V-060",
    productName: "차량용 배터리 12V 60Ah",
    workOrderId: 304,
    workOrderNo: "WO-20260713-005",
    lotQty: 4500,
    inspectionQty: 4500,
    goodQty: 4420,
    defectQty: 80,
    fgInventoryId: 403,
    locationCode: "FG-B-01",
    createdDate: "2026-07-13",
    createdTime: "오후 05:20",
    status: "생산완료",
  },
  {
    // 다른 제품 규격의 생산 진행 중 LOT 예시
    id: 5,
    lotId: 1005,
    lotNo: "LOT-20260712-001",
    productId: 204,
    productCode: "BAT-12V-120",
    productName: "차량용 배터리 12V 120Ah",
    workOrderId: 305,
    workOrderNo: "WO-20260712-002",
    lotQty: 1800,
    inspectionQty: 1800,
    goodQty: 1773,
    defectQty: 27,
    fgInventoryId: 404,
    locationCode: "FG-C-01",
    createdDate: "2026-07-12",
    createdTime: "오후 02:15",
    status: "생산중",
  },
  {
    // 검사 결과 불량 수량이 조금 있는 생산 완료 LOT 예시
    id: 6,
    lotId: 1006,
    lotNo: "LOT-20260712-002",
    productId: 202,
    productCode: "BAT-12V-080",
    productName: "차량용 배터리 12V 80Ah",
    workOrderId: 306,
    workOrderNo: "WO-20260712-003",
    lotQty: 3600,
    inspectionQty: 3600,
    goodQty: 3515,
    defectQty: 85,
    fgInventoryId: 405,
    locationCode: "FG-B-03",
    createdDate: "2026-07-12",
    createdTime: "오후 06:40",
    status: "생산완료",
  },
];

const PAGE_SIZE = 4;

const TABLE_COLUMNS = [
  { key: "no", label: "NO" },
  { key: "lotNoCell", label: "LOT ID" },
  { key: "productNameCell", label: "제품명" },
  { key: "workOrderCell", label: "작업지시 번호" },
  { key: "inspectionQtyCell", label: "검사 수량", align: "right" },
  { key: "resultCell", label: "합격 / 불합격", align: "right" },
  { key: "createdCell", label: "LOT 생성일" },
  { key: "statusCell", label: "LOT 상태" },
];

// LOT 상태값을 공용 Badge 컴포넌트의 tone 값으로 변환
// 생산완료는 성공, 생산중은 진행/강조, 그 외 상태는 중립 배지로 표시
const getStatusTone = (status) => {
  if (status === "생산완료") return "success";
  if (status === "생산중") return "neutral";
  return "neutral";
};

// 숫자를 한국식 천 단위 콤마로 표시하기 위한 formatter
// 예: 5000 -> "5,000"
const formatNumber = new Intl.NumberFormat("ko-KR");

// 검색 조건의 초기값
// 초기화 버튼을 누르거나 화면이 처음 열릴 때 이 값으로 시작
const initialFilters = {
  keyword: "",
  productCode: "ALL",
  workOrderNo: "ALL",
  startDate: "",
  endDate: "",
};

export default function ProductLotList() {
  // 검색 조건이 바뀌면 바로 목록에 반영
  const [filters, setFilters] = useState(initialFilters);

  // 현재 보고 있는 페이지 번호
  const [page, setPage] = useState(1);

  // 클릭해서 상세 drawer에 보여줄 LOT 데이터
  // null이면 상세 drawer가 닫힌 상태
  const [selectedLot, setSelectedLot] = useState(null);

  // 제품명 select 옵션을 LOT 목업 데이터에서 자동으로 뽑아 중복 없이 만듬
  const productOptions = useMemo(
    () => [
      ...new Map(
        LOTS.map((lot) => [lot.productCode, lot.productName]),
      ).entries(),
    ],
    [],
  );
  const workOrderOptions = useMemo(
    // 작업지시 번호 select 옵션도 현재 LOT 데이터 기준으로 만듬
    () => [...new Set(LOTS.map((lot) => lot.workOrderNo))],
    [],
  );

  const counts = useMemo(
    () =>
      Object.fromEntries(
        ["생산완료", "생산중", "생산 대기"].map((status) => [
          status,
          LOTS.filter((lot) => lot.status === status).length,
        ]),
      ),
    [],
  );

  // 현재 검색 조건(filters)을 기준으로 테이블에 표시할 LOT만 골라냄
  const filteredRows = useMemo(
    () =>
      LOTS.filter((lot) => {
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
    [filters],
  );

  // 공용 Pagination이 rows를 페이지별로 나누므로 전체 조회 결과를 전달한다.
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
      <>
        <CreatedDate>{lot.createdDate.replaceAll("-", ". ")}</CreatedDate>
        <SubText>{lot.createdTime}</SubText>
      </>
    ),
    statusCell: (
      <Status tone={getStatusTone(lot.status)} $status={lot.status}>
        <StatusDot />
        {lot.status}
      </Status>
    ),
  }));

  const reset = () => {
    // 검색 조건과 페이지를 모두 처음 상태로 되돌림
    setFilters(initialFilters);
    setPage(1);
  };

  // 테이블 행을 클릭했을 때 상세 drawer에 보여줄 LOT을 저장
  const openLotDetail = (lot) => setSelectedLot(lot);

  return (
    // 전체 완제품 LOT 목록 화면
    <Page>
      <Content>
        {/* 완제품 LOT 목록 상단 제목/설명/버튼 메뉴 */}
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
            icon={<FiCheckCircle />}
            title="생산완료"
            value={counts.생산완료}
            iconBackground="#e5f8ec"
            iconColor="#16a765"
          />

          <StatusSummaryCard
            icon={<FiRefreshCw />}
            title="생산중"
            value={counts.생산중}
            iconBackground="#e7f0ff"
            iconColor="#2563eb"
          />

          <StatusSummaryCard
            icon={<FiClock />}
            title="생산대기"
            value={counts["생산 대기"]}
            iconBackground="#fff4d8"
            iconColor="#d98a00"
          />
        </SummaryGrid>

        {/* LOT 번호, 제품명, 작업지시, 생산 일자를 조회하는 검색 조건 메뉴 */}
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
            startDateLabel="생성 시작일"
            endDateLabel="생성 종료일"
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

        {/* 완제품 LOT 조회 결과 테이블 메뉴 */}
        <TablePanel>
          <TableTop>
            <TableTitle>완제품 LOT 현황</TableTitle>
            <TopResultText>
              조회 결과 <strong>{filteredRows.length}</strong>건
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
              tableProps={{ minWidth: 1050 }}
            />
          </TableArea>
        </TablePanel>
      </Content>
      {/* 테이블 행 클릭 시 열리는 완제품 LOT 상세 drawer 메뉴 */}
      <FinishedLotDetailDrawer
        lot={selectedLot}
        onClose={() => setSelectedLot(null)}
      />
    </Page>
  );
}

// 아래 styled-components는 이 페이지 전용 스타일
// 완제품 LOT 목록 화면 전체 영역
const Page = styled.main`
  min-height: 100vh;
  padding: 34px 30px 48px;
  background: #f8f8fe;
  color: #172033;
  @media (max-width: 720px) {
    padding: 24px 16px 40px;
  }
`;
// 화면 내용을 가운데 정렬하고 최대 너비를 제한하는 컨테이너
const Content = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
`;
// 페이지 제목/설명을 배치하는 상단 영역
const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
// "완제품 LOT 목록" 같은 페이지 메인 제목에 사용
const Title = styled.h1`
  font-size: 27px;
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: -0.035em;
`;
// 제목 아래 안내 문구에 사용
const Description = styled.p`
  margin-top: 8px;
  color: #687184;
  font-size: 13px;
  line-height: 1.5;
`;

const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const StatusSummaryCard = styled(SummaryCard).attrs({
  padding: 18,
  gap: 18,
  iconBoxSize: 50,
  iconSize: 24,
  iconBorderRadius: 16,
  titleFontSize: 12,
  titleFontWeight: 500,
  titleColor: "#172033",
  valueFontSize: 26,
  valueFontWeight: 700,
  valueColor: "#020817",
  borderRadius: 16,
  boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)",
})`
  && {
    min-height: 116px;
    flex-direction: row;
    align-items: center;
  }

  > div:last-child {
    justify-content: center;
  }

  > div:last-child > span {
    margin-bottom: 6px;
  }
`;

const FilterPanel = styled.section`
  padding: 18px 20px;
  border: 1px solid #d7dde8;
  border-radius: 12px;
  background: #fff;
`;

const FilterTitle = styled.h2`
  margin: 0 0 12px;
  color: #172033;
  font-size: 15px;
  font-weight: 700;
`;

// 테이블 전체를 감싸는 카드형 영역
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
// 공용 Table 컴포넌트를 이 화면의 카드 톤에 맞게 감싸는 영역
const TableArea = styled.div`
  > div {
    border: 0;
    border-radius: 0;
  }

  table {
    min-width: 1050px;
  }

  th {
    padding: 12px 14px;
    border-bottom: 1px solid #e3e7ed;
    vertical-align: middle;
    background: #f1f3f6;
    color: #535b68;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.2;
    text-align: center !important;
  }

  th + th {
    border-left: 0;
  }

  th:first-child {
    width: 5%;
  }
  th:nth-child(2) {
    width: 16%;
  }
  th:nth-child(3) {
    width: 20%;
  }
  th:nth-child(4) {
    width: 16%;
  }
  th:nth-child(5) {
    width: 10%;
  }
  th:nth-child(6) {
    width: 14%;
  }
  th:nth-child(7) {
    width: 11%;
  }
  th:last-child {
    width: 8%;
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid #e3e7ed;
    color: #252a32;
    font-size: 13px;
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
// LOT ID 텍스트입니다. 클릭 가능한 행처럼 보이도록 파란색/밑줄 hover
const LotLink = styled.button`
  color: #174b9c;
  font-family: var(--font-family-base);
  font-size: 12px;
  font-weight: 600;
  text-align: left;
`;
// 테이블의 제품명 텍스트
const ProductName = styled.div`
  color: #2c3548;
  font-weight: 600;
`;
// 독립된 작업지시 번호 열의 텍스트
const WorkOrderText = styled.div`
  color: #536174;
  font-size: 11px;
  font-weight: 500;
`;
// 생성 시간처럼 날짜 아래 보조 정보를 작게 표시할 때 사용
const SubText = styled.div`
  margin-top: 4px;
  color: #586376;
  font-family: var(--font-family-base);
  font-size: 10px;
`;
// LOT 생성일 날짜 텍스트
const CreatedDate = styled.div`
  font-size: 11px;
  font-weight: 600;
`;
// 합격 수량을 강조해서 보여주는 숫자
const Good = styled.span`
  color: #00499c;
  font-weight: 700;
`;
// 합격 수량과 불합격 수량 사이의 '/'
const Divider = styled.span`
  margin: 0 9px;
  color: #9aa3b2;
`;
// 불합격 수량을 표시하는 숫자 스타일
const Defect = styled.span`
  color: #697286;
`;
// 공용 Badge를 기반으로 만든 LOT 상태 배지
// 공용 컴포넌트를 쓰되, 기존 LOT 화면의 색상/크기/점 표시는 유지
const Status = styled(Badge)`
  gap: 5px;
  padding: 4px 10px;
  font-size: 10px;
  font-weight: 650;
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
// 상태 배지 안의 작은 원형 점 부모 색상을 따라감
const StatusDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
`;
// 테이블 하단의 결과 개수 문구와 페이지 버튼을 담는 영역
// 페이지 번호 버튼들을 묶는 영역
// 이전/다음/페이지 번호 버튼
