import { useMemo, useState } from "react";
import styled from "styled-components";
import FilterDatePicker from "../../components/ui/FilterDatePicker";
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

import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import FilterPanel, {
  FilterActions,
  FilterField,
  FilterInput,
  FilterLabel,
  FilterSelect,
} from "../../components/ui/FilterPanel";

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
// workOrderId, workOrderNo, productId, plannedQty, startedAt, dueAt, status, createdAt
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
    createdAt: "2023-10-23 14:20",
  },
];

// 한 페이지에 표시할 개수
const PAGE_SIZE = 6;

// 등록/수정 드로어 기본값
// 백엔드 등록/수정 DTO와 연결하기 쉬운 이름으로 맞춤
const EMPTY_ORDER_FORM = {
  productId: "",
  plannedQty: "",
  worker: "",
  dueAt: "",
  status: "대기중",
};

export default function WorkOrderList() {
  // 전체 작업지시 목록
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // 검색창에 입력 중인 값
  const [draft, setDraft] = useState({
    keyword: "",
    productId: "전체 품목",
    dueAt: "",
    status: "전체",
  });

  // 실제 목록에 적용된 검색 조건
  const [filters, setFilters] = useState(draft);

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

        return (
          (!keyword || order.workOrderNo.toLowerCase().includes(keyword)) &&
          (filters.productId === "전체 품목" ||
            String(order.productId) === String(filters.productId)) &&
          (!filters.dueAt || order.dueAt === filters.dueAt) &&
          (filters.status === "전체" || order.status === filters.status)
        );
      }),
    [orders, filters],
  );

  // 전체 페이지 수
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // 현재 페이지에 표시할 표 데이터
  const rows = filtered
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    .map((order) => ({
      ...order,

      originalOrder: order,

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

      startCell: order.startedAt ? (
        <>
          <div>{order.startedAt.split(" ")[0]}</div>
          <Small>{order.startedAt.split(" ")[1]}</Small>
        </>
      ) : (
        "-"
      ),

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
    { key: "orderCell", label: "작업지시 번호" },
    { key: "productName", label: "제품명" },
    { key: "quantityCell", label: "지시 수량", align: "right" },
    { key: "worker", label: "담당자" },
    { key: "dueAt", label: "납기일" },
    { key: "statusCell", label: "상태" },
    { key: "startCell", label: "시작 시간" },
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

          <Button type="button" onClick={openCreateDrawer}>
            <ButtonInner>
              <FiPlus />
              작업지시 등록
            </ButtonInner>
          </Button>
        </PageHeader>

        {/* 상태별 요약 카드 */}
        <SummaryGrid>
          <SummaryCard>
            <SummaryIcon $tone="waiting">
              <FiClock />
            </SummaryIcon>

            <div>
              <SummaryLabel>대기중</SummaryLabel>
              <SummaryValue>
                {counts.대기중}
                <Unit>건</Unit>
              </SummaryValue>
            </div>
          </SummaryCard>

          <SummaryCard>
            <SummaryIcon $tone="progress">
              <FiPlayCircle />
            </SummaryIcon>

            <div>
              <SummaryLabel>진행중</SummaryLabel>
              <SummaryValue>
                {counts.진행중}
                <Unit>건</Unit>
              </SummaryValue>
            </div>
          </SummaryCard>

          <SummaryCard>
            <SummaryIcon $tone="done">
              <FiCheckCircle />
            </SummaryIcon>

            <div>
              <SummaryLabel>완료</SummaryLabel>
              <SummaryValue>
                {counts.완료}
                <Unit>건</Unit>
              </SummaryValue>
            </div>
          </SummaryCard>
        </SummaryGrid>

        {/* 검색 및 필터 영역 */}
        <WorkOrderFilter
          $columns="1.15fr 1fr 1fr .9fr auto"
          $gap="16px"
          $padding="20px"
          onSubmit={(event) => {
            event.preventDefault();
            setFilters(draft);
            setPage(1);
          }}
        >
          <FilterField>
            <FilterLabel htmlFor="order-search">작업지시 번호</FilterLabel>

            <FilterInput
              id="order-search"
              placeholder="WO-..."
              value={draft.keyword}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  keyword: event.target.value,
                })
              }
            />
          </FilterField>

          <FilterField>
            <FilterLabel htmlFor="product-filter">품목</FilterLabel>

            <FilterSelect
              id="product-filter"
              value={draft.productId}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  productId: event.target.value,
                })
              }
            >
              <option value="전체 품목">전체 품목</option>

              {MOCK_PRODUCTS.map((product) => (
                <option key={product.productId} value={product.productId}>
                  {product.productName}
                </option>
              ))}
            </FilterSelect>
          </FilterField>

          <FilterField>
            <FilterLabel htmlFor="due-filter">납기일</FilterLabel>

            <FilterDatePicker
              id="due-filter"
              value={draft.dueAt}
              onChange={(value) =>
                setDraft({
                  ...draft,
                  dueAt: value,
                })
              }
            />
          </FilterField>

          <FilterField>
            <FilterLabel htmlFor="status-filter">상태</FilterLabel>

            <FilterSelect
              id="status-filter"
              value={draft.status}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  status: event.target.value,
                })
              }
            >
              <option>전체</option>
              <option>대기중</option>
              <option>진행중</option>
              <option>완료</option>
            </FilterSelect>
          </FilterField>

          <FilterActions
            onReset={() => {
              const initialFilters = {
                keyword: "",
                productId: "전체 품목",
                dueAt: "",
                status: "전체",
              };

              setDraft(initialFilters);
              setFilters(initialFilters);
              setPage(1);
            }}
          />
        </WorkOrderFilter>

        {/* 작업지시 표 */}
        <TableCard>
          <TableWrap>
            <Table
              columns={columns}
              rows={rows}
              onRowClick={(row) => openOrderDetail(row.originalOrder)}
            />
          </TableWrap>

          {/* 표 하단 건수와 페이지 이동 */}
          <TableFooter>
            <span>
              전체 {filtered.length}건 중{" "}
              {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}
              에서 {Math.min(page * PAGE_SIZE, filtered.length)}
              까지 표시
            </span>

            <Pagination>
              <MoveButton
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
              >
                이전
              </MoveButton>

              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (number) => (
                  <PageButton
                    type="button"
                    key={number}
                    $active={page === number}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </PageButton>
                ),
              )}

              <MoveButton
                type="button"
                disabled={page === pageCount}
                onClick={() => setPage((current) => current + 1)}
              >
                다음
              </MoveButton>
            </Pagination>
          </TableFooter>
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
  padding: 30px;
  background: #f6f8fc;
  color: #172033;

  @media (max-width: 720px) {
    padding: 20px 14px;
  }
`;

// 페이지 최대 너비
const Content = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
`;

// 제목과 등록 버튼 영역
const PageHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

// 페이지 제목
const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

// 제목 아래 설명
const Description = styled.p`
  margin-top: 7px;
  color: #738095;
  font-size: 13px;
`;

// 등록 버튼 내부 정렬
const ButtonInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
`;

// 상태 요약 카드 배치
const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 22px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

// 상태 요약 카드
const SummaryCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 105px;
  border-radius: 0;
  box-shadow: none;

  &:first-child {
    border-radius: 10px 0 0 10px;
  }

  &:last-child {
    border-radius: 0 10px 10px 0;
  }

  & + & {
    border-left: 0;
  }

  @media (max-width: 650px) {
    border: 1px solid var(--color-border) !important;
    border-radius: 10px !important;
  }
`;

// 상태별 아이콘 색상
const SummaryIcon = styled.span`
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  font-size: 24px;

  color: ${(props) =>
    props.$tone === "progress"
      ? "#2764d8"
      : props.$tone === "done"
        ? "#11a861"
        : "#667085"};

  background: ${(props) =>
    props.$tone === "progress"
      ? "#eaf1ff"
      : props.$tone === "done"
        ? "#e7f8ef"
        : "#f0f2f6"};
`;

const SummaryLabel = styled.div`
  color: #707b8e;
  font-size: 12px;
  margin-bottom: 5px;
`;

const SummaryValue = styled.strong`
  font-size: 24px;
  font-weight: 700;
`;

const Unit = styled.span`
  margin-left: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #7b8493;
`;

// 검색 영역
const WorkOrderFilter = styled(FilterPanel)`
  margin-bottom: 22px;
`;

// 표 전체 카드
const TableCard = styled.section`
  overflow: hidden;
  border: 1px solid #d7dde8;
  border-radius: 10px;
  background: #fff;
`;

// 표 헤더와 셀 스타일
const TableWrap = styled.div`
  > div {
    border: 0;
    border-radius: 0;
  }

  table {
    width: 100%;
    min-width: 950px;
    table-layout: fixed;
  }

  th {
    height: 52px;
    padding: 0 18px;
    vertical-align: middle;
    background: linear-gradient(180deg, #f2f6fc 0%, #e8eff8 100%);
    color: #233b5d;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    white-space: nowrap;
  }

  /* 헤더 사이 구분선 */
  th + th {
    border-left: 1px solid rgba(184, 198, 218, 0.65);
  }

  th:first-child {
    width: 20%;
    padding-left: 28px;
    text-align: left;
  }

  th:nth-child(2) {
    width: 19%;
    text-align: left;
  }

  th:nth-child(3) {
    width: 10%;
  }

  th:nth-child(4) {
    width: 9%;
  }

  th:nth-child(5) {
    width: 12%;
  }

  th:nth-child(6) {
    width: 10%;
  }

  th:nth-child(7) {
    width: 13%;
  }

  th:nth-child(8) {
    width: 7%;
  }

  td {
    height: 67px;
    padding: 9px 18px;
    border-bottom: 1px solid #d7dce7;
    color: #202a3c;
    vertical-align: middle;
    white-space: nowrap;
  }

  td:first-child {
    padding-left: 28px;
  }

  /* 작업지시 번호와 제품명 줄바꿈 */
  td:nth-child(1),
  td:nth-child(2) {
    white-space: normal;
    line-height: 1.45;
    overflow-wrap: anywhere;
    word-break: keep-all;
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover {
    background: #fafcff;
  }

  @media (max-width: 1000px) {
    th,
    td {
      padding-left: 14px;
      padding-right: 14px;
    }

    th:first-child,
    td:first-child {
      padding-left: 18px;
    }
  }
`;

// 작업지시 번호
const OrderNo = styled.span`
  display: -webkit-box;
  overflow: hidden;
  color: #0b56ad;
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  tr:hover & {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

// 시작 시간의 시간 부분
const Small = styled.div`
  margin-top: 3px;
  color: #697589;
  font-size: 10px;
`;

// 상태 배지
const StatusBadge = styled(Badge)`
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
const TableFooter = styled.footer`
  min-height: 52px;
  padding: 9px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #788396;
  font-size: 11px;
  background: #f8f9fc;
`;

// 페이지 이동 버튼 정렬
const Pagination = styled.nav`
  display: flex;
  align-items: center;
  gap: 5px;
`;

// 이전/다음 버튼
const MoveButton = styled.button`
  min-width: 40px;
  height: 32px;
  padding: 0 10px;

  border: 1px solid #cbd2df;
  border-radius: 4px;

  background: #fff;
  color: #3d475a;
  font-size: 11px;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #084693;
    color: #084693;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

// 이전/다음/페이지 번호 버튼
const PageButton = styled.button`
  min-width: 34px;
  height: 32px;
  padding: 0 10px;

  border: 1px solid ${({ $active }) => ($active ? "#084693" : "#cbd2df")};
  border-radius: 4px;

  background: ${({ $active }) => ($active ? "#084693" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#3d475a")};

  font-size: 11px;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #084693;
    color: ${({ $active }) => ($active ? "#fff" : "#084693")};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
