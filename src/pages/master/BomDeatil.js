import styled from "styled-components";
import { FiX } from "react-icons/fi";

// 목록에서 선택한 제품과 BOM 자재의 값을 읽기 전용으로 보여주는 상세 드로어
function BomDetail({ isOpen, product, bomItem, onClose }) {
  // 열림 상태와 상세 데이터가 모두 준비된 경우에만 드로어를 렌더링
  if (!isOpen || !product || !bomItem) {
    return null;
  }

  // 드로어 내부가 아닌 반투명 배경 자체를 클릭했을 때만 닫음
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <DrawerBackdrop onMouseDown={handleBackdropClick}>
      <DrawerContainer>
        {/* 드로어 제목과 닫기 버튼 */}
        <DrawerHeader>
          <DrawerTitle>BOM 상세</DrawerTitle>

          <CloseButton
            type="button"
            onClick={onClose}
            aria-label="BOM 상세 닫기"
          >
            <FiX size={24} />
          </CloseButton>
        </DrawerHeader>

        <DrawerBody>
          {/* 선택 자재가 속한 완제품의 기본 정보 */}
          <DrawerSection>
            <DrawerSectionTitle>제품 정보</DrawerSectionTitle>

            <InfoGrid>
              <InputGroup>
                <Label>제품코드</Label>
                <ReadOnlyInput value={product.productCode} readOnly />
              </InputGroup>

              <InputGroup>
                <Label>제품명</Label>
                <ReadOnlyInput value={product.productName} readOnly />
              </InputGroup>

              <InputGroup>
                <Label>전압(V)</Label>
                <ReadOnlyInput value={product.voltage} readOnly />
              </InputGroup>

              <InputGroup>
                <Label>용량(Ah)</Label>
                <ReadOnlyInput value={product.capacity} readOnly />
              </InputGroup>
            </InfoGrid>
          </DrawerSection>

          {/* 목록에서 클릭한 BOM 자재의 상세 속성 */}
          <DrawerSection>
            <DrawerSectionTitle>자재 정보</DrawerSectionTitle>

            <InfoGrid>
              <InputGroup $full>
                <Label>자재코드</Label>
                <ReadOnlyInput value={bomItem.materialCode} readOnly />
              </InputGroup>

              <InputGroup>
                <Label>자재명</Label>
                <ReadOnlyInput value={bomItem.materialName} readOnly />
              </InputGroup>

              <InputGroup>
                <Label>단위</Label>
                <ReadOnlyInput value={bomItem.unit} readOnly />
              </InputGroup>

              <InputGroup>
                <Label>표준 소요량</Label>
                <ReadOnlyInput
                  value={Number(bomItem.requiredQty).toFixed(2)}
                  readOnly
                />
              </InputGroup>

              <InputGroup>
                <Label>불량률(%)</Label>
                <ReadOnlyInput
                  value={`${Number(bomItem.scrapRate).toFixed(1)}%`}
                  readOnly
                />
              </InputGroup>

              <InputGroup $full>
                <Label>투입공정</Label>
                <ReadOnlyInput value={bomItem.process} readOnly />
              </InputGroup>
            </InfoGrid>
          </DrawerSection>

          {/* 자주 확인하는 소요량, 불량률, 투입 공정을 한 번 더 요약 */}
          <DrawerSection>
            <DrawerSectionTitle>소요량 정보</DrawerSectionTitle>

            <SummaryCard>
              <SummaryRow>
                <SummaryLabel>표준 소요량</SummaryLabel>
                <SummaryValue>
                  {Number(bomItem.requiredQty).toFixed(2)} {bomItem.unit}
                </SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>불량률</SummaryLabel>
                <SummaryValue $warning={Number(bomItem.scrapRate) > 0}>
                  {Number(bomItem.scrapRate).toFixed(1)}%
                </SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>투입공정</SummaryLabel>
                <ProcessBadge>{bomItem.process}</ProcessBadge>
              </SummaryRow>
            </SummaryCard>
          </DrawerSection>
        </DrawerBody>

        {/* 상세 화면은 읽기 전용이므로 닫기 동작만 제공 */}
        <DrawerFooter>
          <CloseFooterButton type="button" onClick={onClose}>
            닫기
          </CloseFooterButton>
        </DrawerFooter>
      </DrawerContainer>
    </DrawerBackdrop>
  );
}

export default BomDetail;

// ===== BOM 상세 드로어 스타일 =====
// 화면 전체를 덮는 반투명 배경이며, 상세 드로어를 오른쪽에 정렬
const DrawerBackdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  background: rgba(19, 27, 39, 0.35);
`;

// 오른쪽에서 열리는 BOM 상세 패널의 본체
const DrawerContainer = styled.aside`
  display: flex;
  width: min(480px, 100%);
  height: 100%;
  flex-direction: column;
  background: #f7f9fc;
  box-shadow: -12px 0 32px rgba(21, 29, 44, 0.2);
  animation: drawerOpen 0.25s ease-out;

  @keyframes drawerOpen {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }
`;

// 상세 제목과 닫기 버튼을 배치하는 드로어 상단 고정 영역
const DrawerHeader = styled.div`
  display: flex;
  height: 84px;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #cbd3e0;
  background: #fff;
`;

// 드로어 상단의 화면 제목
const DrawerTitle = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
`;

// 드로어 우측 상단의 닫기 아이콘 버튼
const CloseButton = styled.button`
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #262c35;
  cursor: pointer;

  &:hover {
    background: #eef1f6;
  }
`;

// 상세 내용이 길어질 때 세로 스크롤되는 드로어 본문
const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

// 제품 정보, 자재 정보, 소요량 요약을 나누는 본문 구역
const DrawerSection = styled.section`
  margin-bottom: 30px;
`;

// 파란색 세로선으로 강조한 각 본문 구역의 제목
const DrawerSectionTitle = styled.h3`
  margin: 0 0 17px;
  padding-left: 11px;
  border-left: 4px solid #0744a0;
  color: #202630;
  font-size: 18px;
  font-weight: 700;
`;

// 상세 항목을 기본 두 열로 배치하는 정보 그리드
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 16px;
`;

// 라벨과 값을 묶음, $full이 true이면 그리드의 전체 열을 차지
const InputGroup = styled.div`
  min-width: 0;
  grid-column: ${({ $full }) => ($full ? "1 / -1" : "auto")};
`;

// 읽기 전용 값 위에 표시되는 항목명
const Label = styled.label`
  display: block;
  margin-bottom: 7px;
  color: #5d6676;
  font-size: 12px;
`;

// 제품과 자재 값을 변경 불가능한 형태로 보여주는 입력 필드
const ReadOnlyInput = styled.input`
  width: 100%;
  height: 47px;
  padding: 0 13px;
  border: 1px solid #c7cee0;
  border-radius: 9px;
  outline: none;
  background: #f1f2fb;
  color: #303642;
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  box-sizing: border-box;
`;

// 소요량, 불량률, 투입 공정의 핵심 정보를 묶는 요약 카드
const SummaryCard = styled.div`
  overflow: hidden;
  border: 1px solid #d9dfeb;
  border-radius: 10px;
  background: #fff;
`;

// 요약 카드 안에서 항목명과 값을 양 끝에 배치하는 한 행
const SummaryRow = styled.div`
  display: flex;
  min-height: 54px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 16px;
  border-bottom: 1px solid #e2e7f0;

  &:last-child {
    border-bottom: none;
  }
`;

// 요약 행의 왼쪽에 표시되는 항목명
const SummaryLabel = styled.span`
  color: #5d6676;
  font-size: 13px;
`;

// 요약 행의 값, $warning이 true이면 불량률을 빨간색으로 강조
const SummaryValue = styled.strong`
  color: ${({ $warning }) => ($warning ? "#df1616" : "#202630")};
  font-size: 14px;
  font-weight: 600;
`;

// 투입 공정을 둥근 태그 형태로 표시
const ProcessBadge = styled.span`
  display: inline-flex;
  min-height: 26px;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border-radius: 20px;
  background: #eaf2ff;
  color: #3166ac;
  font-size: 12px;
`;

// 닫기 버튼을 담는 드로어 하단 고정 영역
const DrawerFooter = styled.div`
  flex-shrink: 0;
  padding: 22px 24px;
  border-top: 1px solid #cbd3e0;
  background: #fff;
`;

// 상세 드로어를 닫는 하단 전체 너비 버튼
const CloseFooterButton = styled.button`
  width: 100%;
  height: 47px;
  border: none;
  border-radius: 8px;
  background: #0744a0;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #063b8b;
  }
`;
