import React, { useState } from "react";
import styled from "styled-components";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";

import { FiCpu, FiActivity, FiSlash, FiEdit3, FiTrash2 } from "react-icons/fi";

// MachineList와 동일한 공용 필터 컴포넌트 import
import FilterPanel, {
  FilterField,
  FilterActions,
} from "../../components/ui/FilterPanel";

// 신규 등록 사이드 패널 컴포넌트 import
import ProcessNew from "./ProcessNew";
import ProcessEdit from "./ProcessEdit";

/* Styled Components */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: var(--spacing-gutter);
  max-width: var(--container-max);
  margin: 0 auto;
  width: 100%;
`;

// 페이지 헤더
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-group {
    h2 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    p {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
  }
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 상단 KPI 카드 레이아웃
const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const KpiCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: var(--color-bg-canvas);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .value {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);

      span {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-normal);
        color: var(--color-neutral);
        margin-left: 4px;
      }
    }
  }
`;

/* 필터 입력 필드 스타일 - MachineList 스타일 기준 통일 */
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

// 테이블 배치 영역 카드
const TableCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 상태 배지 (사용 / 미사용)
const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-align: center;
  min-width: 60px;

  ${(props) =>
    props.$isActive
      ? `
        background-color: var(--color-success-bg);
        color: var(--color-success);
      `
      : `
        background-color: #f1f5f9;
        color: var(--color-neutral);
      `}
`;

// 액션 버튼 그룹 (수정/삭제)
const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s;

  &:hover {
    background-color: var(--color-bg-canvas);
  }

  img {
    width: 18px;
    height: 18px;
  }
`;

// 기획서 하단 페이지네이션 컨테이너
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);

  .page-buttons {
    display: flex;
    gap: 4px;
  }
`;

const PageBtn = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: var(--radius-sm);
  border: 1px solid
    ${(props) =>
      props.$active ? "var(--color-primary)" : "var(--color-border)"};
  background: ${(props) =>
    props.$active ? "var(--color-primary)" : "var(--color-bg)"};
  color: ${(props) =>
    props.$active ? "var(--color-text-inverse)" : "var(--color-text)"};
  font-weight: ${(props) =>
    props.$active ? "var(--font-weight-bold)" : "var(--font-weight-normal)"};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.$active ? "var(--color-primary)" : "var(--color-bg-canvas)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function ProcessList() {
  // Mock 데이터 선언
  const [processes, setProcesses] = useState([
    {
      id: 1,
      seq: 1,
      step_code: "PROC-001",
      step_name: "정밀 사출 공정",
      is_active: true,
      machine: "MCH-001",
      description: "정밀 사출 세부 프로세스",
      worker: "홍길동",
    },
    {
      id: 2,
      seq: 2,
      step_code: "PROC-002",
      step_name: "레이저 각인 공정",
      is_active: true,
      machine: "MCH-002",
      description: "레이저 마킹 작업",
      worker: "김철수",
    },
    {
      id: 3,
      seq: 3,
      step_code: "PROC-003",
      step_name: "표면 연마 공정",
      is_active: false,
      machine: "설비 선택 (없음)",
      description: "표면 가공 및 수동 연마",
      worker: "이영희",
    },
    {
      id: 4,
      seq: 4,
      step_code: "PROC-004",
      step_name: "전자파 차폐 도장",
      is_active: true,
      machine: "MCH-001",
      description: "스프레이 도장 공정",
      worker: "박민수",
    },
    {
      id: 5,
      seq: 5,
      step_code: "PROC-005",
      step_name: "초음파 세척 공정",
      is_active: true,
      machine: "MCH-002",
      description: "최종 세척 및 건조",
      worker: "최동현",
    },
  ]);

  // 검색 및 필터 State
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("전체");
  const [searchStatus, setSearchStatus] = useState("전체");

  // 우측 사이드 패널(드로어) 열고 닫기 제어 State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);

  // 통계 계산
  const totalCount = processes.length;
  const activeCount = processes.filter((p) => p.is_active).length;
  const inactiveCount = totalCount - activeCount;

  // 이벤트 핸들러
  const handleEdit = (process) => {
    setSelectedProcess(process);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("선택한 공정을 삭제하시겠습니까?")) {
      setProcesses((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleRegister = () => {
    setIsNewModalOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setSearchCode("");
    setSearchName("전체");
    setSearchStatus("전체");
  };

  const handleRegisterProcess = (newProcess) => {
    const nextId =
      processes.length > 0 ? Math.max(...processes.map((p) => p.id)) + 1 : 1;
    setProcesses((prev) => [
      ...prev,
      {
        id: nextId,
        ...newProcess,
      },
    ]);
  };

  const handleUpdateProcess = (updatedProcess) => {
    setProcesses((prev) =>
      prev.map((p) => (p.id === updatedProcess.id ? updatedProcess : p)),
    );
  };

  // 필터링된 데이터 계산
  const filteredRows = processes.filter((item) => {
    const matchCode = item.step_code
      .toLowerCase()
      .includes(searchCode.toLowerCase());
    const matchName = searchName === "전체" || item.step_name === searchName;
    const matchStatus =
      searchStatus === "전체" ||
      (searchStatus === "사용" && item.is_active) ||
      (searchStatus === "미사용" && !item.is_active);

    return matchCode && matchName && matchStatus;
  });

  // Table에 주입할 Column 정보 정의
  const columns = [
    { key: "seq", label: "순서", align: "center" },
    { key: "step_code_badge", label: "공정코드", align: "left" },
    { key: "step_name", label: "공정명", align: "left" },
    { key: "status_badge", label: "상태", align: "center" },
    { key: "actions", label: "작업", align: "center" },
  ];

  // Table 전용 row 형식에 맞게 데이터 가공 및 컴포넌트 주입
  const tableRows = filteredRows.map((row) => ({
    ...row,
    step_code_badge: (
      <span
        style={{
          fontFamily: "var(--font-family-mono)",
          fontWeight: "var(--font-weight-bold)",
          color: "var(--color-primary)",
          background: "var(--color-primary-light)",
          padding: "4px 8px",
          borderRadius: "var(--radius-sm)",
          display: "inline-block",
        }}
      >
        {row.step_code}
      </span>
    ),
    status_badge: (
      <StatusBadge $isActive={row.is_active}>
        {row.is_active ? "사용" : "미사용"}
      </StatusBadge>
    ),
    actions: (
      <ActionGroup onClick={(e) => e.stopPropagation()}>
        <ActionButton
          onClick={() => handleEdit(row)}
          title="수정"
          type="button"
        >
          <FiEdit3 size={18} color="var(--color-text-secondary)" />
        </ActionButton>
        <ActionButton
          onClick={() => handleDelete(row.id)}
          title="삭제"
          type="button"
        >
          <FiTrash2 size={18} color="var(--color-danger)" />
        </ActionButton>
      </ActionGroup>
    ),
  }));

  return (
    <Container>
      {/* 타이틀 및 등록 버튼 */}
      <Header>
        <div className="title-group">
          <h2>공정 관리</h2>
          <p>실시간 공정 정의 및 시퀀스 관리 시스템</p>
        </div>
        <Button
          variant="primary"
          onClick={handleRegister}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span>+ 공정 등록</span>
        </Button>
      </Header>

      {/* KPI 통계 카드 영역 */}
      <KpiGrid>
        <Card>
          <KpiCardContent>
            <div className="icon-wrapper">
              <IconWrapper>
                <FiCpu size={24} color="var(--color-primary)" />
              </IconWrapper>
            </div>
            <div className="text-wrapper">
              <span className="label">전체 공정</span>
              <span className="value">
                {totalCount}
                <span>건</span>
              </span>
            </div>
          </KpiCardContent>
        </Card>

        <Card>
          <KpiCardContent>
            <div className="icon-wrapper">
              <IconWrapper>
                <FiActivity size={24} color="var(--color-success)" />
              </IconWrapper>
            </div>
            <div className="text-wrapper">
              <span className="label">활성 공정</span>
              <span className="value" style={{ color: "var(--color-success)" }}>
                {activeCount}
                <span>건</span>
              </span>
            </div>
          </KpiCardContent>
        </Card>

        <Card>
          <KpiCardContent>
            <div className="icon-wrapper">
              <IconWrapper>
                <FiSlash size={24} color="var(--color-neutral)" />
              </IconWrapper>
            </div>
            <div className="text-wrapper">
              <span className="label">비활성 공정</span>
              <span className="value" style={{ color: "var(--color-neutral)" }}>
                {inactiveCount}
                <span>건</span>
              </span>
            </div>
          </KpiCardContent>
        </Card>
      </KpiGrid>

      {/* 하단 메인 데이터 영역 카드 내부에 공용 필터 패널 배치 */}
      <TableCard>
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
              placeholder="PROC-..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
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
              공정명
            </label>
            <Select
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            >
              <option value="전체">전체 공정명</option>
              {Array.from(new Set(processes.map((p) => p.step_name))).map(
                (name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ),
              )}
            </Select>
          </FilterField>

          <FilterField>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              상태
            </label>
            <Select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="전체">전체</option>
              <option value="사용">사용</option>
              <option value="미사용">미사용</option>
            </Select>
          </FilterField>

          <FilterActions onReset={handleReset} submitLabel="조회" />
        </FilterPanel>

        {/* 테이블 본문 */}
        <Table
          columns={columns}
          rows={tableRows}
          emptyMessage="조건에 맞는 공정이 존재하지 않습니다."
        />

        {/* 페이지네이션 UI */}
        <PaginationContainer>
          <div>
            전체 {filteredRows.length}개 항목 중 1에서 {filteredRows.length}까지
            표시
          </div>
          <div className="page-buttons">
            <PageBtn disabled>&lt;</PageBtn>
            <PageBtn $active>1</PageBtn>
            <PageBtn>2</PageBtn>
            <PageBtn>3</PageBtn>
            <PageBtn>&gt;</PageBtn>
          </div>
        </PaginationContainer>
      </TableCard>

      {/* 공정 신규 등록 사이드 드로어 연동 */}
      <ProcessNew
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onRegister={handleRegisterProcess}
      />

      {/* 공정 수정용 사이드 드로어 연동 추가 */}
      <ProcessEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        processData={selectedProcess}
        onUpdate={handleUpdateProcess}
      />
    </Container>
  );
}
