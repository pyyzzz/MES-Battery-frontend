import React, { useState } from "react";
import styled from "styled-components";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SummaryCard from "../../components/ui/SummaryCard";

import { FiCpu, FiActivity, FiSlash, FiEdit3, FiTrash2 } from "react-icons/fi";

// 공용 SearchFilterBar 컴포넌트 import
import SearchFilterBar from "../../components/ui/SearchFilterBar";

// 신규 등록, 수정 및 상세 정보 조회 사이드 패널 컴포넌트 import
import ProcessNew from "./ProcessNew";
import ProcessEdit from "./ProcessEdit";
import ProcessDetail from "./ProcessDetail"; 

/* Styled Components */
const Container = styled.div`
  min-height: 100%;
  padding: 24px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-group {
    h2 {
      margin: 0 0 6px;
      font-size: 30px;
      font-weight: 600;
      letter-spacing: -0.8px;
      color: #17191d;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    p {
      margin: 0;
      font-size: 14px;
      color: #888f9c;
    }
  }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFilterPanel = styled.section`
  padding: 22px;
  background: #ffffff;
  border: 1px solid #dce1ea;
  border-radius: 12px;
`;

const PanelTitle = styled.h2`
  margin: 0 0 18px;
  font-size: 17px;
  font-weight: 600;
  color: #292d35;
`;

const FilterBarWrapper = styled.div`
  width: 100%;

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
  }

  & div[class*="ButtonGroup"], 
  & div[class*="button-group"],
  & div:has(> button) {
    display: flex;
    flex-direction: row-reverse;
    gap: 8px;
  }
`;

const TablePanel = styled.section`
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #dce1ea;
  border-radius: 12px;
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
  font-size: 17px;
  font-weight: 600;
  color: #292d35;
`;

const TableSummary = styled.span`
  font-size: 13px;
  color: #767e8b;

  strong {
    color: #0755d9;
  }
`;

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    padding: 15px 14px;
    border-bottom: 1px solid #e2e6ed;
    text-align: center;
    vertical-align: middle;
    font-size: 13px;
  }

  th {
    height: 48px;
    box-sizing: border-box;
    background: #f1f3f6;
    color: #555d6b;
    font-weight: 500;
  }

  td {
    color: #23272e;
  }

  tbody tr {
    cursor: pointer;
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: #f6f9ff;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

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
    background-color: #e2e6ed;
  }
`;

const EmptyMessage = styled.div`
  padding: 60px 20px;
  text-align: center;
  font-size: 14px;
  color: #9198a4;
`;

const PaginationContainer = styled.div`
  border-top: 1px solid #e2e6ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  background: #f5f6f8;

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
  cursor: pointer;

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

  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);

  const totalCount = processes.length;
  const activeCount = processes.filter((p) => p.is_active).length;
  const inactiveCount = totalCount - activeCount;

  const handleEdit = (e, process) => {
    e.stopPropagation();
    setSelectedProcess(process);
    setIsEditModalOpen(true);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("선택한 공정을 삭제하시겠습니까?")) {
      setProcesses((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleRowClick = (row) => {
    const originProcess = processes.find((p) => p.id === row.id);
    if (originProcess) {
      setSelectedProcess(originProcess);
      setIsDetailOpen(true);
    }
  };

  // 💡 상세 패널 내에서 수정 버튼을 눌렀을 때 작동할 핸들러 추가
  const handleDetailEdit = () => {
    setIsDetailOpen(false);      // 상세 보기 닫기
    setIsEditModalOpen(true);    // 수정 모달 열기 (기존에 선택된 selectedProcess가 주입됨)
  };

  const handleRegister = () => {
    setIsNewModalOpen(true);
  };

  const handleSearch = (filterValues) => {
    setSearchCode(filterValues.step_code || "");
    setSearchName(filterValues.step_name || "");
    setSearchStatus(filterValues.is_active || "");
  };

  const handleReset = () => {
    setSearchCode("");
    setSearchName("");
    setSearchStatus("");
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

  const filteredRows = processes.filter((item) => {
    const matchCode = item.step_code
      .toLowerCase()
      .includes(searchCode.toLowerCase());
    const matchName = !searchName || item.step_name === searchName;
    const matchStatus =
      !searchStatus ||
      (searchStatus === "사용" && item.is_active) ||
      (searchStatus === "미사용" && !item.is_active);

    return matchCode && matchName && matchStatus;
  });

  const columns = [
    { key: "seq", label: "순서", align: "center", width: 80 },
    { key: "step_code_badge", label: "공정코드", align: "center", width: 180 },
    { key: "step_name", label: "공정명", align: "left", width: 320 },
    { key: "status_badge", label: "상태", align: "center", width: 140 },
    { key: "actions", label: "작업", align: "center", width: 120 },
  ];

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
          onClick={(e) => handleEdit(e, row)}
          title="수정"
          type="button"
        >
          <FiEdit3 size={18} color="var(--color-text-secondary)" />
        </ActionButton>
        <ActionButton
          onClick={(e) => handleDelete(e, row.id)}
          title="삭제"
          type="button"
        >
          <FiTrash2 size={18} color="var(--color-danger)" />
        </ActionButton>
      </ActionGroup>
    ),
  }));

  const stepNameOptions = Array.from(
    new Set(processes.map((p) => p.step_name)),
  ).map((name) => ({
    value: name,
    label: name,
  }));

  const filterSchema = [
    {
      name: "step_name",
      label: "공정명",
      placeholder: "전체 공정명",
      width: 220,
      options: stepNameOptions,
    },
    {
      name: "is_active",
      label: "상태",
      placeholder: "전체",
      width: 150,
      options: [
        { value: "사용", label: "사용" },
        { value: "미사용", label: "미사용" },
      ],
    },
  ];

  return (
    <Container>
      <Header>
        <div className="title-group">
          <h2>공정 관리</h2>
          <p>실시간 공정 정의 및 시퀀스 관리 시스템</p>
        </div>
        <Button
          variant="primary"
          onClick={handleRegister}
          style={{
            padding: "10px 20px",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          + 공정 등록
        </Button>
      </Header>

      <KpiGrid>
        <SummaryCard
          icon={<FiCpu />}
          title="전체 공정"
          value={`${totalCount}건`}
          iconBackground="var(--color-primary-light)"
          iconColor="var(--color-primary)"
          iconSize={20}
          iconBoxSize={40}
          padding={16}
          gap={12}
          titleFontSize="var(--font-size-xs)"
          titleColor="var(--color-text-secondary)"
          valueFontSize="var(--font-size-md)"
          valueColor="var(--color-text)"
        />

        <SummaryCard
          icon={<FiActivity />}
          title="활성 공정"
          value={`${activeCount}건`}
          iconBackground="var(--color-success-bg)"
          iconColor="var(--color-success)"
          iconSize={20}
          iconBoxSize={40}
          padding={16}
          gap={12}
          titleFontSize="var(--font-size-xs)"
          titleColor="var(--color-text-secondary)"
          valueFontSize="var(--font-size-md)"
          valueColor="var(--color-success)"
        />

        <SummaryCard
          icon={<FiSlash />}
          title="비활성 공정"
          value={`${inactiveCount}건`}
          iconBackground="var(--color-bg-canvas)"
          iconColor="var(--color-neutral)"
          iconSize={20}
          iconBoxSize={40}
          padding={16}
          gap={12}
          titleFontSize="var(--font-size-xs)"
          titleColor="var(--color-text-secondary)"
          valueFontSize="var(--font-size-md)"
          valueColor="var(--color-neutral)"
        />
      </KpiGrid>

      <StyledFilterPanel>
        <PanelTitle>공정 검색</PanelTitle>
        <FilterBarWrapper>
          <SearchFilterBar
            filters={filterSchema}
            showKeyword={true}
            keywordName="step_code"
            keywordLabel="공정코드"
            keywordPlaceholder="PROC-..."
            keywordWidth={220}
            showDateRange={false}
            onSearch={handleSearch}
            onReset={handleReset}
            inputHeight={38}
            border="none"
            padding={0}
            gap={16}
            width="100%"
          />
        </FilterBarWrapper>
      </StyledFilterPanel>

      <TablePanel>
        <TableTop>
          <TableTitle>공정 목록</TableTitle>
          <TableSummary>
            조회 공정 <strong>{filteredRows.length}</strong>건
          </TableSummary>
        </TableTop>

        {tableRows.length > 0 ? (
          <TableScroll>
            <StyledTable>
              <colgroup>
                {columns.map((col) => (
                  <col key={col.key} style={{ width: col.width }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} style={{ textAlign: col.align }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.id} onClick={() => handleRowClick(row)}>
                    <td style={{ textAlign: "center" }}>{row.seq}</td>
                    <td style={{ textAlign: "center" }}>
                      {row.step_code_badge}
                    </td>
                    <td style={{ textAlign: "left" }}>{row.step_name}</td>
                    <td style={{ textAlign: "center" }}>{row.status_badge}</td>
                    <td style={{ textAlign: "center" }}>{row.actions}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableScroll>
        ) : (
          <EmptyMessage>
            조건에 맞는 공정이 존재하지 않습니다.
          </EmptyMessage>
        )}

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
      </TablePanel>

      <ProcessNew
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onRegister={handleRegisterProcess}
      />

      {/* 💡 변동 항목: 프로프 이름 수정 및 onEdit 핸들러 할당 */}
      <ProcessDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProcess(null);
        }}
        product={selectedProcess}
        onEdit={handleDetailEdit}
      />

      <ProcessEdit
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProcess(null);
        }}
        processData={selectedProcess}
        onUpdate={handleUpdateProcess}
      />
    </Container>
  );
}