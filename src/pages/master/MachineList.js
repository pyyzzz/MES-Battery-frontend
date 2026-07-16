import React, { useState } from "react";
import styled from "styled-components";
import {
  FiPlus,
  FiArchive, // 총 설비 (블루)
  FiSettings, // 가동 중 (그레이)
  FiAlertTriangle, // 에러 (레드)
  FiCheckCircle, // 가동률 (그린)
} from "react-icons/fi";

// 공통 UI 컴포넌트 import
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import FilterPanel, {
  FilterField,
  FilterActions,
} from "../../components/ui/FilterPanel";

// 신규 추가한 우측 사이드 패널 컴포넌트들 import
import MachineNew from "./MachineNew";
import MachineEdit from "./MachineEdit"; // 💡 설비 수정 사이드 패널 추가

/* ================= Styled Components ================= */
const Container = styled.div`
  padding: var(--spacing-gutter);
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: var(--color-bg-canvas);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }

  p {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-normal);
  }
`;

/* KPI 대시보드 영역 */
const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const KpiCardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const KpiInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-medium);
  }
  .value {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }
`;

const KpiIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* 필터 입력 필드 스타일 */
const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #cfd5e2;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  outline: none;
  &:focus {
    border-color: var(--color-primary);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #cfd5e2;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  outline: none;
  background: #fff;
  cursor: pointer;
  &:focus {
    border-color: var(--color-primary);
  }
`;

/* 설비 상태 배지 스타일 */
const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  display: inline-block;
  text-align: center;

  ${({ $status }) =>
    $status === "가동" &&
    `
      background-color: var(--color-primary-light);
      color: var(--color-primary);
    `}
  ${({ $status }) =>
    $status === "비가동" &&
    `
      background-color: #f1f5f9;
      color: #64748b;
    `}
  ${({ $status }) =>
    ($status === "에러" || $status === "ERROR") &&
    `
      background-color: #fee2e2;
      color: var(--color-danger);
    `}
`;

/* 사용 여부 전용 디자인 배지 컴포넌트 */
const UseYnBadge = styled.span`
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  display: inline-block;
  text-align: center;

  ${({ $useYn }) =>
    $useYn === "사용 중"
      ? `
      background-color: #e6f4ea;
      color: #137333;
    `
      : `
      background-color: #f1f3f4;
      color: #5f6368;
    `}
`;

/* 에러 메시지 텍스트 강조 스타일 */
const ErrorText = styled.span`
  color: var(--color-danger);
  font-weight: var(--font-weight-medium);
`;

/* 메인 테이블이 들어있는 카드 영역 */
const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 16px;

  /* 테이블 행 클릭 시 마우스 포인터를 커서 형태로 설정하여 클릭 가능함을 유저에게 인지시킴 */
  tbody tr {
    cursor: pointer;
    transition: background-color 0.15s;
    &:hover {
      background-color: var(--color-bg-canvas) !important;
    }
  }
`;

/* ================= Component Logic ================= */
export default function MachineList() {
  // 1. 검색 조건 state
  const [searchProcessId, setSearchProcessId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // 💡 우측 사이드 패널 제어 관련 state들
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  // 2. 가상 데이터 리스트
  const [machines, setMachines] = useState([
    {
      machine_id: 1,
      process_id: "PC-001",
      machine_code: "MC-001",
      machine_name: "믹싱기 A호기",
      status: "가동",
      use_yn: "Y",
      message: "-",
    },
    {
      machine_id: 2,
      process_id: "PC-002",
      machine_code: "MC-002",
      machine_name: "코팅기 B호기",
      status: "비가동",
      use_yn: "Y",
      message: "-",
    },
    {
      machine_id: 3,
      process_id: "PC-003",
      machine_code: "MC-003",
      machine_name: "압출 성형기",
      status: "에러",
      use_yn: "N",
      message: "급유 장치 압력 저하 (E-042)",
    },
    {
      machine_id: 4,
      process_id: "PC-004",
      machine_code: "MC-004",
      machine_name: "패키징 마스터",
      status: "가동",
      use_yn: "Y",
      message: "-",
    },
    {
      machine_id: 5,
      process_id: "PC-005",
      machine_code: "MC-005",
      machine_name: "고속 분쇄기",
      status: "가동",
      use_yn: "Y",
      message: "-",
    },
  ]);

  // 필터링 기능 로직
  const filteredRows = machines.filter((item) => {
    const matchProcess = item.process_id
      .toLowerCase()
      .includes(searchProcessId.toLowerCase());
    const matchName = item.machine_name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchStatus =
      searchStatus === "" ? true : item.status === searchStatus;
    return matchProcess && matchName && matchStatus;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setSearchProcessId("");
    setSearchName("");
    setSearchStatus("");
  };

  // 💡 [등록 기능] 신규 데이터를 배열에 추가
  const handleSaveMachine = (newMachine) => {
    const nextId =
      machines.length > 0
        ? Math.max(...machines.map((m) => m.machine_id)) + 1
        : 1;
    setMachines((prev) => [
      ...prev,
      {
        machine_id: nextId,
        ...newMachine,
        message: "-",
      },
    ]);
  };

  // 💡 [수정 기능] 선택한 행의 데이터를 받아 배열 내 정보 수정 업데이트
  const handleUpdateMachine = (updatedMachine) => {
    setMachines((prev) =>
      prev.map((m) =>
        m.machine_id === updatedMachine.machine_id
          ? { ...m, ...updatedMachine }
          : m,
      ),
    );
  };

  // 💡 [테이블 행 클릭 핸들러] 클릭 시 수정 대상 데이터 지정 후 모달 오픈
  const handleRowClick = (row) => {
    // 공용 Table 컴포넌트의 row 클릭 이벤트를 바인딩하기 위해 원본 기기 객체 찾기
    const originMachine = machines.find((m) => m.machine_id === row.machine_id);
    if (originMachine) {
      setSelectedMachine(originMachine);
      setIsEditModalOpen(true);
    }
  };

  // 3. Table 공용 컴포넌트용 컬럼 정의
  const columns = [
    { key: "machine_id", label: "ID", align: "center" },
    { key: "process_id", label: "공정코드", align: "left" },
    { key: "machine_code", label: "설비코드", align: "left" },
    { key: "machine_name", label: "설비명", align: "left" },
    { key: "status", label: "설비상태", align: "center" },
    { key: "use_yn", label: "사용 여부", align: "center" },
    { key: "message", label: "메시지", align: "left" },
  ];

  // Table 행 데이터 바인딩 가공
  const rows = filteredRows.map((mac) => {
    const displayUseYn = mac.use_yn === "Y" ? "사용 중" : "사용 중지";

    return {
      ...mac,
      id: mac.machine_id,
      status: <StatusBadge $status={mac.status}>{mac.status}</StatusBadge>,
      use_yn: <UseYnBadge $useYn={displayUseYn}>{displayUseYn}</UseYnBadge>,
      message:
        mac.status === "ERROR" || mac.status === "에러" ? (
          <ErrorText>{mac.message}</ErrorText>
        ) : (
          mac.message
        ),
    };
  });

  return (
    <Container>
      {/* 타이틀 및 등록 버튼 헤더 */}
      <Header>
        <TitleSection>
          <h2>설비 관리</h2>
          <p>
            공장 내 주요 설비의 가동 상태와 상세 제원을 실시간으로 모니터링하고
            관리합니다.
          </p>
        </TitleSection>
        <Button variant="primary" onClick={() => setIsNewModalOpen(true)}>
          <FiPlus style={{ marginRight: "4px" }} /> 설비 등록
        </Button>
      </Header>

      {/* 상단 4개 요약 KPI 카드 */}
      <KpiGrid>
        <Card>
          <KpiCardContent>
            <KpiInfo>
              <span className="label">총 설비 수</span>
              <span className="value">{machines.length} 대</span>
            </KpiInfo>
            <FiArchive size={32} color="var(--color-primary)" />
          </KpiCardContent>
        </Card>
        <Card>
          <KpiCardContent>
            <KpiInfo>
              <span className="label">가동 중인 설비</span>
              <span className="value" style={{ color: "var(--color-primary)" }}>
                {machines.filter((m) => m.status === "가동").length} 대
              </span>
            </KpiInfo>
            <FiSettings size={32} color="var(--color-text)" />
          </KpiCardContent>
        </Card>
        <Card>
          <KpiCardContent>
            <KpiInfo>
              <span className="label">장애/ERROR 설비</span>
              <span className="value" style={{ color: "var(--color-danger)" }}>
                {
                  machines.filter(
                    (m) => m.status === "에러" || m.status === "ERROR",
                  ).length
                }{" "}
                대
              </span>
            </KpiInfo>
            <FiAlertTriangle size={32} color="var(--color-danger)" />
          </KpiCardContent>
        </Card>
        <Card>
          <KpiCardContent>
            <KpiInfo>
              <span className="label">평균 가동률</span>
              <span className="value" style={{ color: "var(--color-success)" }}>
                84.5%
              </span>
            </KpiInfo>
            <FiCheckCircle size={32} color="var(--color-success)" />
          </KpiCardContent>
        </Card>
      </KpiGrid>

      {/* 하단 메인 데이터 영역 */}
      <ContentCard>
        {/* 공용 필터 패널 */}
        <FilterPanel
          onSubmit={handleSearchSubmit}
          $columns="repeat(3, minmax(0, 1fr)) auto"
        >
          <FilterField>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              공정코드
            </label>
            <Input
              type="text"
              placeholder="공정코드를 입력하세요"
              value={searchProcessId}
              onChange={(e) => setSearchProcessId(e.target.value)}
            />
          </FilterField>
          <FilterField>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              설비명
            </label>
            <Input
              type="text"
              placeholder="설비명을 입력하세요"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </FilterField>
          <FilterField>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              설비상태
            </label>
            <Select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="">전체</option>
              <option value="가동">가동</option>
              <option value="비가동">비가동</option>
              <option value="에러">에러</option>
            </Select>
          </FilterField>

          <FilterActions onReset={handleReset} submitLabel="조회" />
        </FilterPanel>

        {/* 공용 테이블 컴포넌트: 행 클릭 시 `handleRowClick` 연동 */}
        <Table
          columns={columns}
          rows={rows}
          emptyMessage="조회된 설비 내역이 존재하지 않습니다."
          onRowClick={handleRowClick}
        />
      </ContentCard>

      {/* 설비 신규 등록 사이드 패널 */}
      <MachineNew
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSaveMachine}
      />

      {/* 💡 설비 내용 수정용 사이드 패널 추가 */}
      <MachineEdit
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMachine(null);
        }}
        selectedMachine={selectedMachine}
        onUpdate={handleUpdateMachine}
      />
    </Container>
  );
}
