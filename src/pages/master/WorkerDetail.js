import { useEffect } from "react";
import styled from "styled-components";
import { FiUser, FiX } from "react-icons/fi";

// 작업 이력 API가 붙기 전까지 상세 화면 표를 확인하기 위한 임시 데이터
const dummyHistory = [
  ["Inspector #1", "2026/02/09 17:19", "-", "없음"],
  ["Inspector #1", "2026/02/09 17:19", "-", "없음"],
  ["Pack Line #1", "2026/02/09 17:19", "-", "없음"],
  ["Pack Line #1", "2026/02/09 17:19", "-", "없음"],
  ["Formation Sys #1", "2026/02/09 17:19", "-", "없음"],
  ["Assembly Line #1", "2026/02/09 17:19", "-", "없음"],
].map(([process, startedAt, endedAt, defect], id) => ({
  id,
  process,
  startedAt,
  endedAt,
  defect,
}));

export default function WorkerDetail({ worker, onClose, onEdit }) {
  useEffect(() => {
    if (!worker) return undefined;

    // 드로어가 열린 동안 배경 스크롤을 막고 ESC 키로 닫을 수 있게 처리
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [worker, onClose]);

  if (!worker) return null;

  // worker에 workHistory가 들어오면 실제 데이터, 없으면 임시 데이터 사용
  const history = worker.workHistory || dummyHistory;
  const active = worker.isActive;

  return (
    <>
      <Backdrop onClick={onClose} />
      <Drawer
        role="dialog"
        aria-modal="true"
        aria-labelledby="worker-detail-title"
      >
        <Header>
          <Title id="worker-detail-title">작업자 상세 조회</Title>
          <Close type="button" onClick={onClose} aria-label="닫기">
            <FiX />
          </Close>
        </Header>

        <Body>
          <SectionTitle>작업자 정보</SectionTitle>
          <Field>
            <Label>작업자 번호</Label>
            <Value $code>{worker.workerCode}</Value>
          </Field>
          <Field>
            <Label>이름</Label>
            <Value>{worker.workerName}</Value>
          </Field>
          <Grid>
            <Field>
              <Label>직급</Label>
              <Value>{worker.role}</Value>
            </Field>
            <Field>
              <Label>재직 상태</Label>
              <Status $active={active}>
                <FiUser />
                {active ? "재직" : "퇴사"}
              </Status>
            </Field>
          </Grid>
          <Field>
            <Label>입사일</Label>
            <Value>{worker.createdAt}</Value>
          </Field>

          <History>
            <SectionTitle>최근 작업 이력</SectionTitle>
            <TableWrap>
              <table>
                <thead>
                  <tr>
                    <th>공정/설비</th>
                    <th>시작 시간</th>
                    <th>종료 시간</th>
                    <th>불량 이력</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>{item.process}</td>
                      <td>{item.startedAt}</td>
                      <td>{item.endedAt}</td>
                      <td>{item.defect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </History>
        </Body>

        <Footer>
          <Secondary type="button" onClick={onClose}>
            닫기
          </Secondary>
          <Primary type="button" onClick={() => onEdit(worker)}>
            수정
          </Primary>
        </Footer>
      </Drawer>
    </>
  );
}

// 드로어 뒤쪽을 어둡게 덮는 배경, 클릭하면 닫힘
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 23, 42, 0.38);
`;

// 오른쪽에서 열리는 상세 사이드 드로어
const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  width: min(600px, 100%);
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: -12px 0 36px rgba(15, 23, 42, 0.18);
  animation: open 0.24s ease-out;

  @keyframes open {
    from {
      transform: translateX(100%);
    }
    to {
      transform: none;
    }
  }
`;

// 드로어 상단 제목과 닫기 버튼 영역
const Header = styled.header`
  min-height: 86px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d9deea;
`;

// 상세 드로어 제목
const Title = styled.h2`
  margin: 0;
  color: #202738;
  font-size: 20px;
  font-weight: 700;
`;

// 우측 상단 닫기 아이콘 버튼
const Close = styled.button`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  color: #6f788b;
  font-size: 23px;

  &:hover {
    background: #f1f3f8;
  }
`;

// 본문 영역, 내용이 길어질 때 드로어 안에서만 스크롤
const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px 30px;
`;

// 정보 묶음의 소제목
const SectionTitle = styled.h3`
  margin: 0 0 24px;
  color: #202738;
  font-size: 18px;
  font-weight: 700;
`;

// 라벨과 값 한 쌍을 감싸는 필드
const Field = styled.div`
  margin-bottom: 18px;
`;

// 필드 위쪽의 작은 설명 라벨
const Label = styled.span`
  display: block;
  margin-bottom: 7px;
  color: #616b7e;
  font-size: 12px;
`;

// 읽기 전용 값을 input처럼 보여주는 박스
const Value = styled.div`
  min-height: 42px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border: 1px solid #c7cddd;
  border-radius: 8px;
  background: #f7f8fd;
  color: ${({ $code }) => ($code ? "#084693" : "#262d3c")};
  font-family: ${({ $code }) =>
    $code ? "var(--font-family-mono)" : "inherit"};
  font-size: 13px;
  font-weight: ${({ $code }) => ($code ? 700 : 500)};
`;

// 직급과 재직 상태를 한 줄에 배치, 좁은 화면에서는 한 칸씩 내려감
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

// isActive 값에 따라 재직/퇴사 색상이 바뀌는 상태 박스
const Status = styled(Value)`
  gap: 7px;
  border-color: ${({ $active }) => ($active ? "#b9dfbd" : "#dddfe7")};
  background: ${({ $active }) => ($active ? "#eff9ef" : "#f3f4f7")};
  color: ${({ $active }) => ($active ? "#27843b" : "#687080")};
  font-weight: 700;
`;

// 최근 작업 이력 영역과 기본 정보 사이 간격
const History = styled.section`
  margin-top: 38px;
`;

// 상세 화면 안의 작업 이력 표 스타일
const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid #c7cddd;
  border-radius: 8px;

  table {
    width: 100%;
    min-width: 500px;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th,
  td {
    height: 44px;
    padding: 0 16px;
    border-bottom: 1px solid #c7cddd;
    color: #303748;
    font-size: 12px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
  }

  th {
    background: #eef0f8;
    font-weight: 700;
  }

  th:nth-child(1) {
    width: 32%;
  }

  th:nth-child(2) {
    width: 34%;
  }

  th:nth-child(3) {
    width: 18%;
  }

  tr:last-child td {
    border-bottom: 0;
  }
`;

// 하단 버튼 영역, 드로어 아래쪽에 고정된 느낌으로 배치
const Footer = styled.footer`
  min-height: 92px;
  padding: 20px 30px;
  display: flex;
  justify-content: center;
  gap: 16px;
  border-top: 1px solid #d9deea;
`;

// 하단 버튼의 공통 크기
const FooterButton = styled.button`
  width: 160px;
  height: 44px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
`;

// 닫기 버튼 스타일
const Secondary = styled(FooterButton)`
  background: #eaebf3;
  color: #61697a;

  &:hover {
    background: #dfe1eb;
  }
`;

// 수정 버튼 스타일
const Primary = styled(FooterButton)`
  background: #084693;
  color: #fff;
  box-shadow: 0 5px 12px rgba(8, 70, 147, 0.2);

  &:hover {
    background: #063b7d;
  }
`;
