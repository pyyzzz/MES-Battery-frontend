import { useMemo, useState } from "react";
import styled from "styled-components";
import WorkOrderNewEdit from "./WorkOrderNewEdit";
import WorkOrderDetail from "./WorkOrderDetail";

// 페이지에서 사용하는 아이콘
import {
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiPlayCircle,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import CommonPagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import SummaryCard from "../../components/ui/SummaryCard";
import SearchFilterBar from "../../components/ui/SearchFilterBar";

// 제품 마스터 임시 데이터
// 백엔드 연결 후 product 조회 API 응답으로 교체
const MOCK_PRODUCTS = [
  { productId: 1, productCode: "BAT-CELL-A", productName: "배터리 셀 A" },
  { productId: 2, productCode: "BAT-CELL-B", productName: "배터리 셀 B" },
  { productId: 3, productCode: "ESS-PACK", productName: "에너지 저장 장치 팩" },
  {
    productId: 4,
    productCode: "BAT-MODULE-A",
    productName: "배터리 셀 모듈 A",
  },
  {
    productId: 5,
    productCode: "BAT-MODULE-B",
    productName: "배터리 셀 모듈 B",
  },
  {
    productId: 6,
    productCode: "BAT-MODULE-C",
    productName: "배터리 셀 모듈 C",
  },
  {
    productId: 7,
    productCode: "BAT-MODULE-D",
    productName: "배터리 셀 모듈 D",
  },
  {
    productId: 8,
    productCode: "BAT-MODULE-E",
    productName: "배터리 셀 모듈 E",
  },
];

// 작업지시 목록에 표시할 임시 데이터
// DB work_order 기준 필드:
// workOrderId, workOrderNo, productId, plannedQty, startedAt, completedAt, dueAt, status, createdAt
// productName은 product 테이블을 조인한 조회용 값으로 가정
const INITIAL_ORDERS = [
  {
    workOrderId: 1,
    workOrderNo: "WO-20231025-001",
    productId: 1,
    productName: "배터리 셀 A",
    plannedQty: 1000,
    worker: "김준수",
    dueAt: "2023-10-26",
    status: "진행중",
    startedAt: "2023-10-25 08:30",
    completedAt: null,
    createdAt: "2023-10-24 16:20",
  },
  {
    workOrderId: 2,
    workOrderNo: "WO-20231025-002",
    productId: 2,
    productName: "배터리 셀 B",
    plannedQty: 500,
    worker: "최민지",
    dueAt: "2023-10-26",
    status: "대기중",
    startedAt: null,
    completedAt: null,
    createdAt: "2023-10-24 16:25",
  },
  {
    workOrderId: 3,
    workOrderNo: "WO-20231024-045",
    productId: 3,
    productName: "에너지 저장 장치 팩",
    plannedQty: 1200,
    worker: "김준수",
    dueAt: "2023-10-25",
    status: "완료",
    startedAt: "2023-10-24 07:00",
    completedAt: "2023-10-25 10:30",
    createdAt: "2023-10-23 15:10",
  },
  {
    workOrderId: 4,
    workOrderNo: "WO-20231024-044",
    productId: 4,
    productName: "배터리 셀 모듈 A",
    plannedQty: 800,
    worker: "최민지",
    dueAt: "2023-10-25",
    status: "완료",
    startedAt: "2023-10-24 06:15",
    completedAt: "2023-10-25 09:45",
    createdAt: "2023-10-23 15:00",
  },
  {
    workOrderId: 5,
    workOrderNo: "WO-20231024-043",
    productId: 5,
    productName: "배터리 셀 모듈 B",
    plannedQty: 800,
    worker: "김준수",
    dueAt: "2023-10-25",
    status: "완료",
    startedAt: "2023-10-24 06:15",
    completedAt: "2023-10-25 11:00",
    createdAt: "2023-10-23 14:50",
  },
  {
    workOrderId: 6,
    workOrderNo: "WO-20231024-042",
    productId: 6,
    productName: "배터리 셀 모듈 C",
    plannedQty: 800,
    worker: "최민지",
    dueAt: "2023-10-25",
    status: "완료",
    startedAt: "2023-10-24 06:15",
    completedAt: "2023-10-25 13:20",
    createdAt: "2023-10-23 14:40",
  },
  {
    workOrderId: 7,
    workOrderNo: "WO-20231024-041",
    productId: 7,
    productName: "배터리 셀 모듈 D",
    plannedQty: 800,
    worker: "김준수",
    dueAt: "2023-10-25",
    status: "완료",
    startedAt: "2023-10-24 06:15",
    completedAt: "2023-10-25 14:10",
    createdAt: "2023-10-23 14:30",
  },
  {
    workOrderId: 8,
    workOrderNo: "WO-20231024-040",
    productId: 8,
    productName: "배터리 셀 모듈 E",
    plannedQty: 800,
    worker: "최민지",
    dueAt: "2023-10-25",
    status: "완료",
    startedAt: "2023-10-24 06:15",
    completedAt: "2023-10-25 15:00",
    createdAt: "2023-10-23 14:20",
  },
];

// 한 페이지에 표시할 개수
const PAGE_SIZE = 8;

// 등록/수정 드로어 기본값
// 백엔드 등록/수정 DTO와 연결하기 쉬운 이름으로 맞춤
const EMPTY_ORDER_FORM = {
  productId: "",
  plannedQty: "",
  worker: "",
  dueAt: "",
  status: "대기중",
};

const INITIAL_FILTERS = {
  keyword: "",
  productId: "",
  dateType: "dueAt",
  dueStartAt: "",
  dueEndAt: "",
  status: "",
};

export default function WorkOrderList() {
  // 전체 작업지시 목록
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // 실제 목록에 적용된 검색 조건
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // 현재 페이지
  const [page, setPage] = useState(1);

  // 작업지시 등록/수정 사이드 드로어 열림 여부
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 상세 드로어에 표시할 작업지시
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 수정 중인 작업지시 PK
  const [editingOrderId, setEditingOrderId] = useState(null);

  // 등록/수정 입력값
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER_FORM);

  // 상태별 작업지시 개수 계산
  const counts = useMemo(
    () =>
      Object.fromEntries(
        ["대기중", "진행중", "완료"].map((status) => [
          status,
          orders.filter((item) => item.status === status).length,
        ]),
      ),
    [orders],
  );

  // 검색 조건에 맞는 작업지시만 표시
  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const keyword = filters.keyword.trim().toLowerCase();
        const dateField = filters.dateType || "dueAt";
        const targetDate = order[dateField]?.slice(0, 10) || "";
        const matchesDateRange =
          (!filters.dueStartAt && !filters.dueEndAt) ||
          (targetDate &&
            (!filters.dueStartAt || targetDate >= filters.dueStartAt) &&
            (!filters.dueEndAt || targetDate <= filters.dueEndAt));

        return (
          (!keyword || order.workOrderNo.toLowerCase().includes(keyword)) &&
          (!filters.productId ||
            String(order.productId) === String(filters.productId)) &&
          matchesDateRange &&
          (!filters.status || order.status === filters.status)
        );
      }),
    [orders, filters],
  );

  // 전체 페이지 수
  const dateFilterLabel =
    filters.dateType === "startedAt"
      ? "실제 시작일"
      : filters.dateType === "completedAt"
        ? "완료일"
        : "납기일";

  // 공용 Pagination이 rows를 페이지별로 나누므로 전체 조회 결과를 전달한다.
  const rows = filtered.map((order, index) => ({
    ...order,

    originalOrder: order,

    no: index + 1,

    orderCell: <OrderNo>{order.workOrderNo}</OrderNo>,

    quantityCell: order.plannedQty.toLocaleString("ko-KR"),

    statusCell: (
      <StatusBadge
        $status={order.status}
        tone={order.status === "완료" ? "success" : "neutral"}
      >
        {order.status}
      </StatusBadge>
    ),

    startCell: order.startedAt
      ? <DateTimeText>{order.startedAt}</DateTimeText>
      : "-",

    completedCell: order.completedAt
      ? <DateTimeText>{order.completedAt}</DateTimeText>
      : "-",

    // 수정/삭제 버튼
    actionCell: (
      <ActionButtons>
        <EditButton
          type="button"
          aria-label={`${order.workOrderNo} 수정`}
          title="수정"
          onClick={(event) => {
            event.stopPropagation();
            openEditDrawer(order);
          }}
        >
          <FiEdit2 />
        </EditButton>

        <DeleteButton
          type="button"
          aria-label={`${order.workOrderNo} 삭제`}
          title="삭제"
          onClick={(event) => {
            event.stopPropagation();
            deleteOrder(order);
          }}
        >
          <FiTrash2 />
        </DeleteButton>
      </ActionButtons>
    ),
  }));

  // 표 컬럼 설정
  const columns = [
    { key: "no", label: "NO" },
    { key: "orderCell", label: "작업지시 번호" },
    { key: "productName", label: "제품명" },
    { key: "quantityCell", label: "지시 수량", align: "right" },
    { key: "worker", label: "담당자" },
    { key: "dueAt", label: "납기일" },
    { key: "statusCell", label: "상태" },
    { key: "startCell", label: "실제 시작일시" },
    { key: "completedCell", label: "완료일시" },
    { key: "actionCell", label: "관리", align: "center" },
  ];

  // 등록 드로어 열기
  const openCreateDrawer = () => {
    setSelectedOrder(null);
    setEditingOrderId(null);
    setOrderForm(EMPTY_ORDER_FORM);
    setDrawerOpen(true);
  };

  // 수정 드로어 열기
  const openEditDrawer = (order) => {
    setSelectedOrder(null);
    setEditingOrderId(order.workOrderId);

    setOrderForm({
      productId: String(order.productId),
      plannedQty: String(order.plannedQty),
      worker: order.worker,
      dueAt: order.dueAt,
      status: order.status,
    });

    setDrawerOpen(true);
  };

  // 드로어 닫기
  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingOrderId(null);
    setOrderForm(EMPTY_ORDER_FORM);
  };

  // 선택한 작업지시의 상세 드로어 열기
  const openOrderDetail = (order) => {
    setDrawerOpen(false);
    setEditingOrderId(null);
    setSelectedOrder(order);
  };

  // 상세 드로어 닫기
  const closeOrderDetail = () => {
    setSelectedOrder(null);
  };

  // 상세 화면에서 수정 드로어 열기
  const editFromDetail = () => {
    if (!selectedOrder) return;

    const orderToEdit = selectedOrder;

    setSelectedOrder(null);
    openEditDrawer(orderToEdit);
  };

  // 작업지시 등록 또는 수정
  const handleSubmitOrder = (event) => {
    event.preventDefault();

    const selectedProduct = MOCK_PRODUCTS.find(
      (product) => String(product.productId) === String(orderForm.productId),
    );

    if (!selectedProduct) return;

    // 기존 작업지시 수정
    if (editingOrderId) {
      setOrders((current) =>
        current.map((order) =>
          order.workOrderId === editingOrderId
            ? {
                ...order,
                productId: selectedProduct.productId,
                productName: selectedProduct.productName,
                plannedQty: Number(orderForm.plannedQty),
                worker: orderForm.worker,
                dueAt: orderForm.dueAt,
                status: orderForm.status,

                // 목업 단계에서만 상태에 따라 시작 시간을 임시 처리
                // 백엔드 연결 후 started_at은 서버에서 관리하는 것을 권장
                startedAt:
                  orderForm.status === "대기중"
                    ? null
                    : order.startedAt ||
                      new Date()
                        .toLocaleString("sv-SE", { hour12: false })
                        .slice(0, 16),
                completedAt:
                  orderForm.status === "완료"
                    ? order.completedAt ||
                      new Date()
                        .toLocaleString("sv-SE", { hour12: false })
                        .slice(0, 16)
                    : null,
              }
            : order,
        ),
      );
    } else {
      // 새 작업지시 번호 생성
      // 목업 단계에서만 프론트에서 번호를 만듬
      // 백엔드 연결 후 work_order_no는 서버에서 생성하도록 변경
      const today = new Date();

      const dateText = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
      ].join("");

      const sameDateOrders = orders.filter((order) =>
        order.workOrderNo.startsWith(`WO-${dateText}-`),
      );

      const nextSequence =
        sameDateOrders.reduce((max, order) => {
          const sequence = Number(order.workOrderNo.split("-").at(-1));
          return Number.isNaN(sequence) ? max : Math.max(max, sequence);
        }, 0) + 1;

      // 새 작업지시 데이터
      const newOrder = {
        workOrderId:
          Math.max(0, ...orders.map((order) => order.workOrderId)) + 1,
        workOrderNo: `WO-${dateText}-${String(nextSequence).padStart(3, "0")}`,
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        plannedQty: Number(orderForm.plannedQty),
        worker: orderForm.worker,
        dueAt: orderForm.dueAt,
        status: orderForm.status,

        // 목업 단계에서만 임시 생성
        startedAt:
          orderForm.status === "대기중"
            ? null
            : new Date()
                .toLocaleString("sv-SE", { hour12: false })
                .slice(0, 16),

        completedAt:
          orderForm.status === "완료"
            ? new Date().toLocaleString("sv-SE", { hour12: false }).slice(0, 16)
            : null,

        createdAt: new Date()
          .toLocaleString("sv-SE", { hour12: false })
          .slice(0, 16),
      };

      setOrders((current) => [newOrder, ...current]);
      setPage(1);
    }

    closeDrawer();
  };

  // 작업지시 삭제
  const deleteOrder = (order) => {
    const confirmed = window.confirm(
      `${order.workOrderNo} 작업지시를 삭제하시겠습니까?`,
    );

    if (!confirmed) return;

    const remainingCount = filtered.length - 1;
    const nextPageCount = Math.max(1, Math.ceil(remainingCount / PAGE_SIZE));

    setOrders((current) =>
      current.filter((item) => item.workOrderId !== order.workOrderId),
    );

    if (page > nextPageCount) {
      setPage(nextPageCount);
    }
  };

  return (
    <Page>
      <Content>
        {/* 페이지 제목과 등록 버튼 */}
        <PageHeader>
          <div>
            <Title>작업 지시 관리</Title>
            <Description>
              실시간 제조 실행 및 공정 스케줄을 관리합니다.
            </Description>
          </div>

          <HeaderActionButton type="button" onClick={openCreateDrawer}>
            <FiPlus size={16} />
            작업지시 등록
          </HeaderActionButton>
        </PageHeader>

        {/* 상태별 요약 카드 */}
        <SummaryGrid>
          <StatusSummaryCard
            height={116}
            padding={18}
            gap={14}
            icon={<FiCheckCircle />}
            iconBoxSize={50}
            iconSize={24}
            iconBackground="#e5f8ec"
            iconColor="#168853"
            title="완료"
            titleFontSize={13}
            value={counts.완료}
            valueFontSize={25}
          />

          <StatusSummaryCard
            height={116}
            padding={18}
            gap={14}
            icon={<FiPlayCircle />}
            iconBoxSize={50}
            iconSize={24}
            iconBackground="#e7f0ff"
            iconColor="#0b57d0"
            title="진행중"
            titleFontSize={13}
            value={counts.진행중}
            valueFontSize={25}
          />

          <StatusSummaryCard
            height={116}
            padding={18}
            gap={14}
            icon={<FiClock />}
            iconBoxSize={50}
            iconSize={24}
            iconBackground="#fff4d8"
            iconColor="#d98a00"
            title="대기중"
            titleFontSize={13}
            value={counts.대기중}
            valueFontSize={25}
          />
        </SummaryGrid>

        {/* 검색 및 필터 영역 */}
        <FilterBlock>
          <FilterTitle>작업지시 검색</FilterTitle>

          <SearchFilterBar
            filters={[
              {
                name: "productId",
                label: "품목",
                placeholder: "전체 품목",
                width: 120,
                options: MOCK_PRODUCTS.map((product) => ({
                  value: product.productId,
                  label: product.productName,
                })),
              },
              {
                name: "dateType",
                label: "날짜 기준",
                placeholder: "날짜 기준",
                width: 105,
                options: [
                  { value: "dueAt", label: "납기일" },
                  { value: "startedAt", label: "실제 시작일" },
                  { value: "completedAt", label: "완료일" },
                ],
              },
              {
                name: "status",
                label: "상태",
                placeholder: "전체 상태",
                width: 110,
                options: [
                  { value: "대기중", label: "대기중" },
                  { value: "진행중", label: "진행중" },
                  { value: "완료", label: "완료" },
                ],
              },
            ]}
            defaultValues={INITIAL_FILTERS}
            keywordLabel="작업지시 번호"
            keywordPlaceholder="WO-..."
            keywordWidth={190}
            dateWidth={120}
            startDateName="dueStartAt"
            endDateName="dueEndAt"
            startDateLabel={`${dateFilterLabel} 시작`}
            endDateLabel={`${dateFilterLabel} 종료`}
            showSearchButton={false}
            padding={0}
            border="0"
            background="transparent"
            onChange={(values) => {
              setFilters(values);
              setPage(1);
            }}
            onReset={(values) => {
              setFilters(values);
              setPage(1);
            }}
          />
        </FilterBlock>

        {/* 작업지시 표 */}
        <TableCard>
          <TableTop>
            <TableTitle>작업지시 현황</TableTitle>
            <TopResultText>
              조회 결과 <strong>{filtered.length}</strong>건
            </TopResultText>
          </TableTop>
          <TableWrap>
            <CommonPagination
              columns={columns}
              rows={rows}
              currentPage={page}
              totalItems={filtered.length}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setPage}
              onRowClick={(row) => openOrderDetail(row.originalOrder)}
              tableProps={{ minWidth: 1260 }}
            />
          </TableWrap>
        </TableCard>
      </Content>

      {/* 작업지시 등록·수정 드로어 */}
      <WorkOrderNewEdit
        open={drawerOpen}
        editingOrderId={editingOrderId}
        orderForm={orderForm}
        setOrderForm={setOrderForm}
        products={MOCK_PRODUCTS}
        onClose={closeDrawer}
        onSubmit={handleSubmitOrder}
      />

      {/* 상세 드로어 */}
      <WorkOrderDetail
        order={selectedOrder}
        onClose={closeOrderDetail}
        onEdit={editFromDetail}
      />
    </Page>
  );
}

// 페이지 전체 영역
const Page = styled.main`
  min-height: calc(100vh - 98px);
  padding: var(--page-container-padding);
  background: #f6f8fc;
  color: #172033;

`;

// 페이지 최대 너비
const Content = styled.div`
  width: 100%;
`;

// 제목과 등록 버튼 영역
const PageHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--page-section-gap);
  margin-bottom: var(--page-header-content-gap);

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

// 페이지 제목
const Title = styled.h1`
  margin: 0;
  color: var(--page-title-color);
  font-size: var(--page-title-size);
  line-height: var(--page-title-line-height);
  font-weight: var(--page-title-weight);
  letter-spacing: var(--page-title-letter-spacing);
`;

// 제목 아래 설명
const Description = styled.p`
  margin-top: var(--page-title-subtitle-gap);
  color: var(--page-subtitle-color);
  font-size: var(--page-subtitle-size);
  font-weight: var(--page-subtitle-weight);
  line-height: var(--page-subtitle-line-height);
`;

// 목록 상단 주요 액션 버튼 공통 규격
const HeaderActionButton = styled(Button)`
  width: 128px;
  height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
`;

// 상태 요약 카드 배치
const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--page-box-gap);
  margin-bottom: var(--page-section-gap);

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const StatusSummaryCard = styled(SummaryCard)`
  flex-direction: row;
  align-items: center;
`;

const FilterBlock = styled.div`
  padding: var(--page-panel-padding);
  border: 1px solid #d7dde8;
  border-radius: 12px;
  background: #fff;
  margin-bottom: var(--page-section-gap);
`;

const FilterTitle = styled.h2`
  margin: 0 0 14px;
  color: #292d35;
  font-size: 16px;
  font-weight: 600;
`;

// 표 전체 카드
const TableCard = styled.section`
  overflow: hidden;
  border: 1px solid #dce1ea;
  border-radius: 12px;
  background: #fff;
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

// 표 헤더와 셀 스타일
const TableWrap = styled.div`
  > div {
    border: 0;
    border-radius: 0;
  }

  table {
    width: 100%;
    table-layout: fixed;
  }

  th {
    border-bottom: 1px solid #e3e7ed;
    vertical-align: middle;
    background: #f1f3f6;
    color: #535b68;
    font-weight: 600;
    text-align: center !important;
    white-space: nowrap;
  }

  /* 헤더 사이 구분선 */
  th + th {
    border-left: 0;
  }

  th:first-child {
    width: 7%;
    text-align: center !important;
  }

  th:nth-child(2) {
    width: 18%;
    text-align: center !important;
  }

  th:nth-child(3) {
    width: 15%;
  }

  th:nth-child(4) {
    width: 10%;
  }

  th:nth-child(5) {
    width: 9%;
  }

  th:nth-child(6) {
    width: 13%;
  }

  th:nth-child(7) {
    width: 10%;
  }

  th:nth-child(8) {
    width: 16%;
  }

  th:nth-child(9) {
    width: 16%;
  }

  th:nth-child(10) {
    width: 11%;
  }

  td {
    color: #252a32;
    text-align: center !important;
    vertical-align: middle;
    white-space: nowrap;
  }

  /* 작업지시 번호와 제품명 줄바꿈 */
  td:nth-child(2),
  td:nth-child(3) {
    white-space: normal;
    line-height: 1.45;
    overflow-wrap: anywhere;
    word-break: keep-all;
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover {
    background: #f6f9ff;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

`;

// 작업지시 번호
const OrderNo = styled.span`
  color: #174b9c;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
`;

// inventory 테이블과 동일한 한 줄 날짜·시간 형식
const DateTimeText = styled.span`
  color: #252a32;
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
`;

// 상태 배지
const StatusBadge = styled(Badge)`
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;

  background: ${(props) =>
    props.$status === "진행중"
      ? "#e7f0ff"
      : props.$status === "완료"
        ? "#dff7e9"
        : "#eef0f5"};

  color: ${(props) =>
    props.$status === "진행중"
      ? "#2563d8"
      : props.$status === "완료"
        ? "#099456"
        : "#687386"};
`;

// 수정/삭제 버튼 정렬
const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

// 수정 버튼
const EditButton = styled.button`
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #3467b8;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    background: #edf4ff;
  }
`;

// 삭제 버튼
const DeleteButton = styled.button`
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #d64a4a;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    background: #fff1f1;
  }
`;

// 표 하단 영역

// 페이지 이동 버튼 정렬

// 이전/다음 버튼

// 이전/다음/페이지 번호 버튼
