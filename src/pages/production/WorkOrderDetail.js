import { useEffect } from "react";
import styled from "styled-components";
import { FiEdit2, FiX } from "react-icons/fi";

import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

// 작업지시 상세 사이드 드로어
export default function WorkOrderDetail({ order, onClose, onEdit }) {
  // Escape 닫기 + 배경 스크롤 방지 추가
  useEffect(() => {
    if (!order) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [order, onClose]);

  // 드로어가 닫혀 있거나 선택된 작업지시가 없으면 표시하지 않음
  if (!order) return null;

  return (
    <>
      {/* 드로어 뒤쪽 어두운 배경 */}
      <DrawerBackdrop onClick={onClose} aria-hidden="true" />

      <SideDrawer
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-order-detail-title"
        aria-describedby="work-order-detail-description"
      >
        {/* 상세 드로어 상단 */}
        <DrawerHeader>
          <div>
            <DrawerTitle id="work-order-detail-title">
              작업지시 상세
            </DrawerTitle>

            <DrawerDescription id="work-order-detail-description">
              선택한 작업지시 정보를 확인합니다.
            </DrawerDescription>
          </div>

          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            <FiX />
          </CloseButton>
        </DrawerHeader>

        {/* 상세 내용 */}
        <DrawerBody>
          <OrderSummary>
            <div>
              <SummaryLabel>작업지시 번호</SummaryLabel>
              <OrderNumber>{order.workOrderNo}</OrderNumber>
            </div>

            <StatusBadge $status={order.status}>
              {order.status || "-"}
            </StatusBadge>
          </OrderSummary>

          <DetailSection>
            <SectionTitle>기본 정보</SectionTitle>

            <DetailList>
              <DetailRow>
                <DetailLabel>제품명</DetailLabel>
                <DetailValue>{order.productName || "-"}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>지시 수량</DetailLabel>
                <DetailValue>
                  {order.plannedQty !== undefined && order.plannedQty !== null
                    ? `${Number(order.plannedQty).toLocaleString("ko-KR")}개`
                    : "-"}
                </DetailValue>
              </DetailRow>

              {/* 현재는 화면용 담당자 값을 표시하고, 백엔드 연결 전 worker_id 추가 여부를 합의 */}
              <DetailRow>
                <DetailLabel>담당자</DetailLabel>
                <DetailValue>{order.worker || "-"}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>납기일</DetailLabel>
                <DetailValue>{order.dueAt || "-"}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>시작 시간</DetailLabel>
                <DetailValue>
                  {!order.startedAt ? "아직 시작되지 않음" : order.startedAt}
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>등록일</DetailLabel>
                <DetailValue>{order.createdAt || "-"}</DetailValue>
              </DetailRow>
            </DetailList>
          </DetailSection>
        </DrawerBody>

        {/* 상세 드로어 하단 버튼 */}
        <DrawerFooter>
          <CancelButton type="button" onClick={onClose}>
            닫기
          </CancelButton>

          <Button type="button" onClick={onEdit}>
            <ButtonInner>
              <FiEdit2 />
              수정
            </ButtonInner>
          </Button>
        </DrawerFooter>
      </SideDrawer>
    </>
  );
}

// 드로어 뒤쪽 배경
const DrawerBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 23, 42, 0.35);
`;

// 화면 오른쪽 상세 패널
const SideDrawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;

  width: min(480px, 100%);
  height: 100dvh;

  display: flex;
  flex-direction: column;

  background: #fff;
  box-shadow: -12px 0 36px rgba(15, 23, 42, 0.18);

  animation: detailDrawerOpen 0.25s ease-out;

  @keyframes detailDrawerOpen {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }
`;

// 드로어 제목 영역
const DrawerHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  padding: 24px;
  border-bottom: 1px solid #e5e9f0;
`;

const DrawerTitle = styled.h2`
  margin: 0;
  color: #172033;
  font-size: 21px;
  font-weight: 700;
`;

const DrawerDescription = styled.p`
  margin-top: 6px;
  color: #7a8495;
  font-size: 12px;
`;

// 상세 내용 스크롤 영역
const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

// 작업지시 번호와 상태
const OrderSummary = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  padding-bottom: 24px;
  border-bottom: 1px solid #e5e9f0;
`;

const SummaryLabel = styled.span`
  color: #7a8495;
  font-size: 12px;
`;

const OrderNumber = styled.strong`
  display: block;
  margin-top: 7px;

  color: #0b56ad;
  font-size: 18px;
  font-weight: 700;
  overflow-wrap: anywhere;
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

// 기본 정보 영역
const DetailSection = styled.section`
  margin-top: 26px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 14px;
  color: #172033;
  font-size: 15px;
  font-weight: 700;
`;

// 상세 정보 목록
const DetailList = styled.div`
  overflow: hidden;
  border: 1px solid #dce2eb;
  border-radius: 10px;
`;

// 상세 정보 한 줄
const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  min-height: 56px;

  & + & {
    border-top: 1px solid #e5e9f0;
  }

  @media (max-width: 420px) {
    grid-template-columns: 100px minmax(0, 1fr);
  }
`;

const DetailLabel = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px;

  background: #f5f7fb;
  color: #697589;
  font-size: 12px;
  font-weight: 600;
`;

const DetailValue = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 14px 16px;

  color: #202a3c;
  font-size: 13px;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

// 하단 버튼 영역
const DrawerFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  padding: 18px 24px;
  border-top: 1px solid #e5e9f0;
  background: #fff;
`;

const ButtonInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
`;

const CancelButton = styled.button`
  height: 38px;
  padding: 0 16px;

  border: 1px solid #d5dbe6;
  border-radius: 7px;

  background: #fff;
  color: #536074;
  cursor: pointer;

  &:hover {
    background: #f5f7fa;
  }
`;

// 오른쪽 위 닫기 버튼
const CloseButton = styled.button`
  width: 34px;
  height: 34px;

  display: grid;
  place-items: center;
  flex-shrink: 0;

  padding: 0;
  border: 0;
  border-radius: 7px;

  background: transparent;
  color: #536074;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background: #f0f2f6;
  }
`;
