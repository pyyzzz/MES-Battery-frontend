import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../components/ui/Button";
import SummaryCard from "../../components/ui/SummaryCard";
import Pagination from "../../components/ui/Pagination";

import {
  FiCpu,
  FiActivity,
  FiSlash,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

// 공용 SearchFilterBar 컴포넌트 import
import SearchFilterBar from "../../components/ui/SearchFilterBar";

// 신규 등록, 수정 및 상세 정보 조회 사이드 패널 컴포넌트 import
import ProcessNew from "./ProcessNew";
import ProcessEdit from "./ProcessEdit";
import ProcessDetail from "./ProcessDetail";

/* Styled Components */
const Container = styled.div`
  min-height: 100%;
  padding: var(--page-container-padding);
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--page-section-gap);
  background: #f7f8fa;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2px;

  .title-group {
    h2 {
      margin: 0;
      font-size: var(--page-title-size);
      line-height: var(--page-title-line-height);
      font-weight: var(--page-title-weight);
      letter-spacing: var(--page-title-letter-spacing);
      color: var(--page-title-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    p {
      margin: var(--page-title-subtitle-gap) 0 0;
      font-size: var(--page-subtitle-size);
      font-weight: var(--page-subtitle-weight);
      line-height: var(--page-subtitle-line-height);
      color: var(--page-subtitle-color);
    }
  }
`;

const HeaderActionButton = styled(Button)`
  width: 148px;
  height: 40px;
  padding: 0 16px;
  box-sizing: border-box;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  flex-shrink: 0;
  white-space: nowrap;

  font-size: 13px;
  font-weight: 600;
  line-height: 1;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--page-box-gap);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProcessSummaryCard = styled(SummaryCard)`
  flex-direction: row;
  align-items: center;
`;

const StyledFilterPanel = styled.section`
  padding: var(--page-panel-padding);
  background: #ffffff;
  border: 1px solid #dce1ea;
  border-radius: 12px;
  box-shadow: 0 2px 7px rgba(15, 23, 42, 0.04);
`;

const PanelTitle = styled.h2`
  margin: 0 0 14px;
  color: #292d35;
  font-size: 16px;
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
  box-shadow: 0 2px 7px rgba(15, 23, 42, 0.04);
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
  font-size: 16px;
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

const CodeText = styled.strong`
  color: #174b9c;
  font-size: 13px;
  font-weight: 600;
`;

const ProcessNameText = styled.span`
  color: #252a32;
  font-size: 13px;
  font-weight: 400;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
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

const Management = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const IconButton = styled.button`
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #1769d2;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    background: #edf4ff;
  }
`;

const DeleteButton = styled(IconButton)`
  color: #e55252;

  &:hover {
    background: #fff1f1;
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
  const [page, setPage] = useState(1);

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
    setIsDetailOpen(false); // 상세 보기 닫기
    setIsEditModalOpen(true); // 수정 모달 열기 (기존에 선택된 selectedProcess가 주입됨)
  };

  const handleRegister = () => {
    setIsNewModalOpen(true);
  };

  const handleSearch = (filterValues) => {
    setSearchCode(filterValues.step_code || "");
    setSearchName(filterValues.step_name || "");
    setSearchStatus(filterValues.is_active || "");
    setPage(1);
  };

  const handleReset = () => {
    setSearchCode("");
    setSearchName("");
    setSearchStatus("");
    setPage(1);
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
    { key: "step_code_badge", label: "공정코드", align: "center", width: 170 },
    { key: "step_name", label: "공정명", align: "center", width: 170 },
    { key: "status_badge", label: "상태", align: "center", width: 140 },
    { key: "management", label: "관리", align: "center", width: 120 },
  ];

  const tableRows = filteredRows.map((row) => ({
    ...row,
    step_code_badge: <CodeText>{row.step_code}</CodeText>,
    step_name: <ProcessNameText>{row.step_name}</ProcessNameText>,
    status_badge: (
      <StatusBadge $isActive={row.is_active}>
        {row.is_active ? "사용" : "미사용"}
      </StatusBadge>
    ),
    management: (
      <Management>
        <IconButton
          type="button"
          title="수정"
          aria-label={`${row.step_name} 수정`}
          onClick={(event) => {
            event.stopPropagation();
            handleEdit(event, row);
          }}
        >
          <FiEdit2 />
        </IconButton>

        <DeleteButton
          type="button"
          title="삭제"
          aria-label={`${row.step_name} 삭제`}
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(event, row.id);
          }}
        >
          <FiTrash2 />
        </DeleteButton>
      </Management>
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
        <HeaderActionButton
          type="button"
          variant="primary"
          onClick={handleRegister}
        >
          <FiPlus size={16} />
          공정 등록
        </HeaderActionButton>
      </Header>

      <SummaryGrid>
        <ProcessSummaryCard
          height={116}
          gap={14}
          icon={<FiCpu />}
          iconBoxSize={50}
          iconSize={24}
          iconBackground="var(--color-primary-light)"
          iconColor="var(--color-primary)"
          title="전체 공정"
          titleFontSize={13}
          value={totalCount}
          valueFontSize={25}
          valueColor="#17191d"
        />

        <ProcessSummaryCard
          height={116}
          gap={14}
          icon={<FiActivity />}
          iconBoxSize={50}
          iconSize={24}
          iconBackground="var(--color-success-bg)"
          iconColor="var(--color-success)"
          title="활성 공정"
          titleFontSize={13}
          value={activeCount}
          valueFontSize={25}
          valueColor="#17191d"
        />

        <ProcessSummaryCard
          height={116}
          gap={14}
          icon={<FiSlash />}
          iconBoxSize={50}
          iconSize={24}
          iconBackground="var(--color-bg-canvas)"
          iconColor="var(--color-neutral)"
          title="비활성 공정"
          titleFontSize={13}
          value={inactiveCount}
          valueFontSize={25}
          valueColor="#17191d"
        />
      </SummaryGrid>

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
            showSearchButton={false}
            onSearch={handleSearch}
            onReset={handleReset}
            inputHeight={38}
            border="none"
            padding={0}
            width="100%"
          />
        </FilterBarWrapper>
      </StyledFilterPanel>

      <TablePanel>
        <TableTop>
          <TableTitle>공정 목록</TableTitle>

          <TableSummary>
            조회 결과 <strong>{tableRows.length}</strong>건
          </TableSummary>
        </TableTop>

        <Pagination
          columns={columns}
          rows={tableRows}
          currentPage={page}
          totalItems={tableRows.length}
          itemsPerPage={8}
          visiblePages={5}
          background="#ffffff"
          borderTop="1px solid #e2e6ed"
          onPageChange={setPage}
          onRowClick={handleRowClick}
          tableProps={{
            tableLayout: "fixed",
            headerBackground: "#f1f3f6",
            emptyText: "조건에 맞는 공정이 존재하지 않습니다.",
          }}
        />
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
