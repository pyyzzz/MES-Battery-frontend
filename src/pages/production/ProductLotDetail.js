// 완제품 LOT 상세 drawer 화면
// ProductLotList에서 LOT 행을 클릭했을 때 오른쪽에서 열리는 상세 패널
import { useEffect, useId, useState } from "react";
import styled from "styled-components";
import {
  FiCheck,
  FiClock,
  FiFileText,
  FiInfo,
  FiSettings,
  FiX,
} from "react-icons/fi";

const TABS = [
  // 상세 drawer 안에서 보여줄 탭 목록
  { id: "work", label: "작업 정보" },
  { id: "lot", label: "LOT" },
  { id: "material", label: "자재" },
  { id: "equipment", label: "설비" },
];

const PROCESS_STEPS = [
  // LOT가 어떤 공정을 거쳤는지 보여주는 임시 공정 이력 데이터
  { name: "1공정", machine: "MAC-A-01", time: "08:00 ~ 09:20" },
  { name: "2공정", machine: "MAC-A-02", time: "09:25 ~ 11:10" },
  { name: "3공정", machine: "MAC-A-03", time: "11:20 ~ 13:30" },
  { name: "4공정", machine: "MAC-A-04", time: "13:40 ~ 15:10" },
  { name: "검사공정", machine: "MAC-A-05", time: "15:20 ~ 16:45" },
];

const MATERIALS = [
  // 이 LOT 생산에 투입된 원자재 LOT 예시 데이터
  {
    name: "양극재",
    lot: "MAT-20231025-001",
    amount: "150",
    unit: "kg",
    time: "08:00",
  },
  {
    name: "전해액",
    lot: "MAT-20231025-002",
    amount: "20",
    unit: "L",
    time: "08:22",
  },
];

const EQUIPMENT = [
  // 공정별로 사용한 설비 예시 데이터
  { code: "MAC-A-01", name: "전극공정", time: "08:00 ~ 09:20" },
  { code: "MAC-A-02", name: "조립공정", time: "09:25 ~ 11:10" },
  { code: "MAC-A-03", name: "활성화공정", time: "11:20 ~ 13:30" },
  { code: "MAC-A-04", name: "패킹공정", time: "13:40 ~ 15:10" },
  { code: "MAC-A-05", name: "검사공정", time: "15:20 ~ 16:45" },
];

// 숫자를 한국식 천 단위 콤마로 보여주기 위한 formatter
// 예: 5000 -> "5,000"
const number = new Intl.NumberFormat("ko-KR");

export default function FinishedLotDetailDrawer({ lot, onClose }) {
  // activeTab은 drawer 안에서 현재 선택된 탭을 기억
  const [activeTab, setActiveTab] = useState("work");

  // drawer 제목과 dialog를 연결하기 위한 접근성 id
  const titleId = useId();

  // 부모 목록에서 받은 LOT 검사 수량
  // lot 값이 없을 때 화면이 깨지지 않도록 기본값 사용
  const inspectionQty = lot?.inspectionQty ?? 1000;

  // 부모 목록에서 받은 합격 수량
  const goodQty = lot?.goodQty ?? 998;

  // 부모 목록에서 받은 불합격 수량
  // 값이 없으면 검사 수량 - 합격 수량으로 계산
  const defectQty = lot?.defectQty ?? Math.max(inspectionQty - goodQty, 0);

  // 최종 검사 합격률 계산
  // 검사 수량이 0이면 나누기 오류를 피하기 위해 "0.0" 표시
  const passRate = inspectionQty
    ? ((goodQty / inspectionQty) * 100).toFixed(1)
    : "0.0";

  useEffect(() => {
    // drawer가 열릴 때는 배경 스크롤을 막고, ESC 키를 누르면 닫힘
    if (!lot) return undefined;

    // 새 LOT 상세를 열 때마다 첫 탭을 작업 정보로 초기화
    setActiveTab("work");

    // drawer 뒤쪽 페이지가 같이 스크롤되지 않게 기존 body overflow 값을 저장
    const previousOverflow = document.body.style.overflow;

    // drawer가 열려 있는 동안 body 스크롤 방지
    document.body.style.overflow = "hidden";

    // ESC 키를 누르면 상세 drawer를 닫는 이벤트 함수
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    // window에 ESC 키 이벤트 등록
    window.addEventListener("keydown", closeOnEscape);

    // drawer가 닫힐 때 실행되는 정리 함수
    // body 스크롤과 keydown 이벤트를 원래대로 복구
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [lot, onClose]);

  // 선택된 LOT이 없으면 drawer를 화면에 표시하지 않음
  if (!lot) return null;

  return (
    <Layer>
      <Backdrop type="button" aria-label="상세 닫기" onClick={onClose} />
      <Drawer role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <DrawerHeader>
          <HeaderTop>
            <div>
              <TitleRow>
                <DrawerTitle id={titleId}>완제품 LOT 상세</DrawerTitle>
                <CompleteBadge $status={lot.status}>{lot.status}</CompleteBadge>
              </TitleRow>
              <LotNumber>{lot.lotNo}</LotNumber>
              <ProductText>
                {lot.productName || "회로 기판 Rev B"} · 라인 4 · 조립
              </ProductText>
            </div>
            <CloseButton
              type="button"
              onClick={onClose}
              aria-label="완제품 LOT 상세 닫기"
            >
              <FiX />
            </CloseButton>
          </HeaderTop>
        </DrawerHeader>

        <SummaryWrap>
          <SummaryCard>
            <SummaryLabel>최종 검사 합격률</SummaryLabel>
            <SummaryLine>
              <Rate>{passRate}%</Rate>
              <Counts>
                합격 {number.format(goodQty)} / 불합격{" "}
                {number.format(defectQty)}
              </Counts>
            </SummaryLine>
            <Progress aria-label={`검사 합격률 ${passRate}%`}>
              <ProgressValue
                style={{ width: `${Math.min(Number(passRate), 100)}%` }}
              />
            </Progress>
            <FinishedAt>검사 완료&nbsp; 16:45</FinishedAt>
          </SummaryCard>
        </SummaryWrap>

        <Tabs role="tablist" aria-label="완제품 LOT 상세 메뉴">
          {TABS.map((tab) => (
            <Tab
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </Tabs>

        <Body>
          {activeTab === "work" && (
            <WorkTab
              lot={lot}
              inspectionQty={inspectionQty}
              goodQty={goodQty}
              defectQty={defectQty}
            />
          )}
          {activeTab === "lot" && <LotTab />}
          {activeTab === "material" && <MaterialTab />}
          {activeTab === "equipment" && <EquipmentTab />}
        </Body>

        <Footer>
          <ReportButton type="button" onClick={() => window.print()}>
            <FiFileText /> 성적서 발행
          </ReportButton>
        </Footer>
      </Drawer>
    </Layer>
  );
}

function SectionTitle({ children, info = false }) {
  // 각 탭 안에서 반복해서 쓰는 작은 섹션 제목 컴포넌트
  return (
    <SectionHeading>
      <span>{children}</span>
      {info && <FiInfo aria-label="정보" />}
    </SectionHeading>
  );
}

function WorkTab({ lot, inspectionQty, goodQty, defectQty }) {
  // 작업 시작/종료, 작업지시, 검사 수량 요약을 보여주는 탭
  return (
    <>
      <SectionTitle info>생산 이력 정보</SectionTitle>
      <InfoGrid>
        <InfoCard>
          <SmallLabel>작업 시작</SmallLabel>
          <Value>2023-10-25 08:00</Value>
        </InfoCard>
        <InfoCard>
          <SmallLabel>작업 종료</SmallLabel>
          <Value>2023-10-25 16:45</Value>
        </InfoCard>
        <InfoCard>
          <SmallLabel>작업 지시 담당자</SmallLabel>
          <PersonValue>김준수</PersonValue>
        </InfoCard>
        <InfoCard>
          <SmallLabel>작업 지시</SmallLabel>
          <Value>{lot.workOrderNo || "WO-20231025-001"}</Value>
        </InfoCard>
      </InfoGrid>
      <SectionTitle>검사 실적 요약</SectionTitle>
      <InspectionGrid>
        <InspectionItem>
          <SmallLabel>검사 수량</SmallLabel>
          <Value>{number.format(inspectionQty)}</Value>
        </InspectionItem>
        <InspectionItem>
          <SmallLabel>합격</SmallLabel>
          <BlueValue>{number.format(goodQty)}</BlueValue>
        </InspectionItem>
        <InspectionItem>
          <SmallLabel>불합격</SmallLabel>
          <RedValue>{number.format(defectQty)}</RedValue>
        </InspectionItem>
      </InspectionGrid>
    </>
  );
}

function LotTab() {
  // LOT 추적 탭, 공정 이력을 시간 순서로 보여줌
  return (
    <>
      <SectionTitle>LOT 추적</SectionTitle>
      <Timeline>
        {PROCESS_STEPS.map((step) => (
          <TimelineRow key={step.name}>
            <TimelineMarker>
              <FiCheck />
            </TimelineMarker>
            <ProcessCard>
              <CardTop>
                <strong>{step.name}</strong>
                <PassText>PASS</PassText>
              </CardTop>
              <ProcessMeta>
                <span>
                  <SmallLabel>설비</SmallLabel>
                  {step.machine}
                </span>
                <span>
                  <SmallLabel>시간</SmallLabel>
                  {step.time}
                </span>
              </ProcessMeta>
            </ProcessCard>
          </TimelineRow>
        ))}
      </Timeline>
    </>
  );
}

function MaterialTab() {
  // 자재 탭, 생산에 사용된 원자재 LOT와 투입량을 보여줌
  return (
    <>
      <SectionTitle info>투입 자재</SectionTitle>
      <MaterialSummary>
        <span>
          <SmallLabel>자재 종류</SmallLabel>
          <BigValue>
            2<em>종</em>
          </BigValue>
        </span>
        <span>
          <SmallLabel>원자재 LOT</SmallLabel>
          <BigValue>
            2<em>개</em>
          </BigValue>
        </span>
      </MaterialSummary>
      <Stack>
        {MATERIALS.map((item) => (
          <MaterialCard key={item.lot}>
            <CardTop>
              <strong>{item.name}</strong>
              <Amount>
                {item.amount} <small>{item.unit}</small>
              </Amount>
            </CardTop>
            <MaterialLot>
              <span>원자재 LOT</span> {item.lot}
            </MaterialLot>
            <TimeLine>
              <FiClock /> {item.time}
            </TimeLine>
          </MaterialCard>
        ))}
      </Stack>
    </>
  );
}

function EquipmentTab() {
  // 설비 탭, LOT 생산에 사용된 설비 목록을 보여줌
  return (
    <>
      <SectionTitle info>
        사용 설비 <HeadingCount>5대</HeadingCount>
      </SectionTitle>
      <Stack>
        {EQUIPMENT.map((item) => (
          <EquipmentCard key={item.code}>
            <EquipmentTop>
              <MachineIcon>
                <FiSettings />
              </MachineIcon>
              <MachineName>
                <strong>{item.code}</strong>
                <span>{item.name}</span>
              </MachineName>
              <DoneBadge>공정 완료</DoneBadge>
            </EquipmentTop>
            <TimeLine>
              <FiClock /> {item.time}
            </TimeLine>
          </EquipmentCard>
        ))}
      </Stack>
    </>
  );
}

// 상세 drawer와 어두운 배경을 화면 전체에 띄우는 최상위 레이어
const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
`;
// drawer 바깥 영역 클릭하면 상세 화면을 닫는 배경 버튼
const Backdrop = styled.button`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.38);
  cursor: default;
`;
// 오른쪽에서 열리는 실제 상세 패널
const Drawer = styled.aside`
  position: absolute;
  top: 0;
  right: 0;
  width: min(440px, 100vw);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #1d2738;
  box-shadow: -12px 0 30px rgba(15, 23, 42, 0.14);
  animation: slideIn 0.22s ease-out;
  @keyframes slideIn {
    from {
      transform: translateX(28px);
      opacity: 0.5;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
// drawer 상단 제목 영역
const DrawerHeader = styled.header`
  padding: 26px 26px 18px;
  border-bottom: 1px solid #dce2ec;
`;
// 제목/LOT 정보와 닫기 버튼을 양쪽으로 배치
const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;
// "완제품 LOT 상세" 제목과 상태 배지를 한 줄
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
// drawer의 큰 제목 텍스트
const DrawerTitle = styled.h2`
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.025em;
`;
// LOT 상태를 보여주는 배지 상태값에 따라 색상이 바뀜
const CompleteBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  background: ${({ $status }) =>
    $status === "생산완료" || $status === "입고완료"
      ? "#ddf8e8"
      : $status === "출하대기"
        ? "#e7f1ff"
        : "#eef1f5"};
  color: ${({ $status }) =>
    $status === "생산완료" || $status === "입고완료"
      ? "#168957"
      : $status === "출하대기"
        ? "#1767bf"
        : "#697286"};
  font-size: 10px;
  font-weight: 650;
`;
// LOT 번호를 파란색 고정폭 글꼴
const LotNumber = styled.div`
  margin-top: 8px;
  color: #0755aa;
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 700;
`;
// 제품명, 라인, 공정 같은 보조 설명 텍스트
const ProductText = styled.div`
  margin-top: 7px;
  color: #556075;
  font-size: 11px;
`;
// drawer 우측 상단 닫기 버튼
const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  color: #5f6b7d;
  font-size: 20px;
  border-radius: 6px;
  &:hover {
    background: #f1f4f8;
  }
`;
// 검사 합격률 요약 카드를 감싸는 여백 영역
const SummaryWrap = styled.div`
  padding: 18px 20px 10px;
`;
// 최종 검사 합격률, 수량, 진행바를 담는 요약 카드
const SummaryCard = styled.section`
  padding: 18px;
  border: 1px solid #cad4e5;
  border-radius: 10px;
  background: #f4f6ff;
`;
// 요약 카드의 작은 라벨 텍스트
const SummaryLabel = styled.div`
  color: #667187;
  font-size: 11px;
`;
// 합격률 숫자와 합격/불합격 수량을 한 줄에 배치
const SummaryLine = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;
// 합격률 퍼센트 값을 크게 보여줌
const Rate = styled.strong`
  color: #06499d;
  font-size: 26px;
  line-height: 1;
  font-weight: 750;
`;
// 합격/불합격 수량 요약 텍스트
const Counts = styled.strong`
  color: #06499d;
  font-size: 12px;
  white-space: nowrap;
`;
// 합격률 진행바의 바탕
const Progress = styled.div`
  height: 9px;
  margin-top: 20px;
  overflow: hidden;
  border-radius: 999px;
  background: #dce4f3;
`;
// 합격률 진행바에서 실제 채워지는 파란색 막대
const ProgressValue = styled.div`
  height: 100%;
  border-radius: inherit;
  background: #063d93;
`;
// 검사 완료 시간을 표시하는 작은 텍스트
const FinishedAt = styled.div`
  margin-top: 9px;
  font-family: var(--font-family-mono);
  color: #39455a;
  font-size: 9px;
  font-weight: 600;
`;
// 작업 정보/LOT/자재/설비 탭 버튼들을 담는 탭 영역
const Tabs = styled.div`
  height: 48px;
  padding: 0 20px;
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid #dce2ec;
`;
// 각 탭 버튼, 선택된 탭은 파란색 글자와 아래 선으로 표시
const Tab = styled.button`
  position: relative;
  padding: 0 14px;
  color: ${({ $active }) => ($active ? "#074c9d" : "#586478")};
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  &::after {
    content: "";
    position: absolute;
    right: 12px;
    bottom: -1px;
    left: 12px;
    height: 2px;
    background: ${({ $active }) => ($active ? "#0754ad" : "transparent")};
  }
`;
// 탭을 눌렀을 때 바뀌는 상세 내용 영역 내용이 길면 세로 스크롤이 생김
const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 20px 28px;
`;
// 각 탭 내부의 섹션 제목
const SectionHeading = styled.h3`
  margin-bottom: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #273143;
  font-size: 14px;
  font-weight: 650;
  svg {
    color: #657187;
  }
  &:not(:first-child) {
    margin-top: 26px;
  }
`;
// 섹션 제목 옆에 붙는 개수 표시
const HeadingCount = styled.span`
  margin-left: 8px;
  color: #748094;
  font-size: 11px;
  font-weight: 500;
`;
// 작업 정보 탭에서 시작/종료/담당자/작업지시 카드를 2열로 배치
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;
// 작업 정보 한 칸짜리 카드
const InfoCard = styled.div`
  min-height: 68px;
  padding: 13px;
  border: 1px solid #cbd5e3;
  border-radius: 7px;
  background: #f8faff;
`;
// 카드 안의 작은 항목명 라벨
const SmallLabel = styled.span`
  display: block;
  margin-bottom: 7px;
  color: #7a8496;
  font-size: 9px;
  font-weight: 500;
`;
// 카드 안의 실제 값 텍스트
const Value = styled.strong`
  display: block;
  color: #202a3c;
  font-family: var(--font-family-mono);
  font-size: 11px;
  font-weight: 650;
`;

const PersonValue = styled(Value)`
  font-family: var(--font-family-base);
  font-weight: 700;
`;
// 검사 수량/합격/불합격 3개 값을 가로로 보여주는 영역
const InspectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  border: 1px solid #cbd5e3;
  border-radius: 7px;
`;
// 검사 실적 요약의 각 칸
const InspectionItem = styled.div`
  padding: 14px 8px;
  text-align: center;
  &:not(:last-child) {
    border-right: 1px solid #cbd5e3;
  }
  ${SmallLabel} {
    margin-bottom: 8px;
  }
`;
// 합격 수량처럼 파란색으로 강조할 값
const BlueValue = styled(Value)`
  color: #074d9f;
`;
// 불합격 수량처럼 빨간색으로 강조할 값
const RedValue = styled(Value)`
  color: #c53d3d;
`;
// LOT 탭에서 공정 흐름을 시간순으로 보여주는 타임라인 영역
const Timeline = styled.div`
  margin-top: 2px;
`;
// 타임라인의 한 줄, 다음 줄과 이어지는 세로선을 만듬
const TimelineRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 28px 1fr;
  &:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 9px;
    top: 20px;
    bottom: -10px;
    width: 1px;
    background: #b8c4d5;
  }
  &:not(:last-child) {
    padding-bottom: 12px;
  }
`;
// 타임라인 왼쪽의 체크 아이콘 원
const TimelineMarker = styled.div`
  position: relative;
  z-index: 1;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #0752a8;
  color: #fff;
  font-size: 11px;
`;
// 타임라인 오른쪽에 붙는 공정 정보 카드
const ProcessCard = styled.div`
  padding: 13px 14px;
  border: 1px solid #ccd6e4;
  border-radius: 7px;
  background: #fafbfe;
`;
// 카드 상단에서 이름과 상태/수량을 양쪽으로 배치
const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  strong {
    font-size: 11px;
    font-weight: 650;
  }
`;
// 공정 완료 PASS 텍스트
const PassText = styled.span`
  color: #168953;
  font-size: 8px;
  font-weight: 750;
`;
// 공정 카드 안의 설비/시간 메타 정보를 2열로 보여줌
const ProcessMeta = styled.div`
  margin-top: 9px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  color: #273143;
  font-family: var(--font-family-mono);
  font-size: 9px;
  ${SmallLabel} {
    margin-bottom: 4px;
    font-family: var(--font-family-base);
  }
`;
// 자재 탭 상단의 자재 종류/원자재 LOT 개수 요약 박스
const MaterialSummary = styled.div`
  margin-bottom: 14px;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid #cbd5e3;
  border-radius: 7px;
  background: #f4f6ff;
`;
// 자재 요약 박스 안의 큰 숫자 값
const BigValue = styled.strong`
  font-size: 17px;
  font-weight: 600;
  em {
    margin-left: 5px;
    font-style: normal;
    color: #687387;
    font-size: 11px;
    font-weight: 500;
  }
`;
// 자재 카드나 설비 카드를 세로로 쌓는 영역
const Stack = styled.div`
  display: grid;
  gap: 10px;
`;
// 자재 탭에서 원자재 하나를 표시하는 카드
const MaterialCard = styled.div`
  padding: 15px;
  border: 1px solid #cbd5e3;
  border-radius: 7px;
  background: #fff;
`;
// 투입 자재 수량과 단위 표시
const Amount = styled.span`
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 650;
  small {
    color: #647084;
    font-size: 9px;
  }
`;
// 원자재 LOT 번호를 표시하는 텍스트
const MaterialLot = styled.div`
  margin-top: 8px;
  color: #0753a8;
  font-family: var(--font-family-mono);
  font-size: 9px;
  font-weight: 650;
  span {
    margin-right: 8px;
    color: #69758a;
    font-family: var(--font-family-base);
  }
`;
// 자재 투입 시간이나 설비 사용 시간처럼 시간 정보를 보여주는 줄
const TimeLine = styled.div`
  margin-top: 10px;
  padding-top: 9px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-top: 1px solid #dce2ea;
  color: #4e5a6d;
  font-family: var(--font-family-mono);
  font-size: 9px;
`;
// 설비 탭에서 설비 하나를 표시하는 카드
const EquipmentCard = styled.div`
  padding: 12px 14px;
  border: 1px solid #cbd5e3;
  border-radius: 7px;
`;
// 설비 카드 상단의 아이콘/설비명/상태 배지를 가로 배치
const EquipmentTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
// 설비 카드 왼쪽의 설비 아이콘 박스
const MachineIcon = styled.div`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: #eef1f5;
  color: #536075;
  font-size: 17px;
`;
// 설비 코드와 설비명을 세로로 표시
const MachineName = styled.div`
  flex: 1;
  min-width: 0;
  strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
  }
  span {
    display: block;
    margin-top: 3px;
    color: #647084;
    font-size: 9px;
  }
`;
// 설비 공정 완료 상태를 보여주는 작은 배지
const DoneBadge = styled.span`
  padding: 4px 7px;
  border-radius: 3px;
  background: #dcf8e8;
  color: #168957;
  font-size: 8px;
  font-weight: 650;
`;
// drawer 하단의 버튼 영역
const Footer = styled.footer`
  padding: 14px 20px 18px;
  border-top: 1px solid #dce2ec;
  background: #f8f9fc;
`;
// 성적서 발행 버튼
const ReportButton = styled.button`
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid #8994a8;
  border-radius: 7px;
  background: #f8f8ff;
  color: #273143;
  font-size: 12px;
  font-weight: 600;
  &:hover {
    background: #f0f3fa;
  }
`;
