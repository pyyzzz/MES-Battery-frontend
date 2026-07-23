import React, { useState } from "react";
import styled from "styled-components";
import {
  FiPlus,
  FiArchive,
  FiSettings,
  FiAlertTriangle,
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

// 공통 UI 컴포넌트 import
import Button from "../../components/ui/Button";

// 공통 신규 컴포넌트 import
import SummaryCard from "../../components/ui/SummaryCard";
import SearchFilterBar from "../../components/ui/SearchFilterBar";
import Pagination from "../../components/ui/Pagination";

// 신규 추가한 우측 사이드 패널 컴포넌트들 import
import MachineNew from "./MachineNew";
import MachineEdit from "./MachineEdit";
import MachineDetail from "./MachineDetail";

/* ================= Styled Components ================= */
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

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--page-title-subtitle-gap);

  h2 {
    margin: 0;
    font-size: var(--page-title-size);
    line-height: var(--page-title-line-height);
    font-weight: var(--page-title-weight);
    letter-spacing: var(--page-title-letter-spacing);
    color: var(--page-title-color);
  }

  p {
    margin: 0;
    font-size: var(--page-subtitle-size);
    font-weight: var(--page-subtitle-weight);
    line-height: var(--page-subtitle-line-height);
    color: var(--page-subtitle-color);
    font-weight: var(--font-weight-normal);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--page-box-gap);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MachineSummaryCard = styled(SummaryCard)`
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

// 💡 버튼 위치 스왑 및 필터바 정렬 유지 래퍼 수정
const FilterBarWrapper = styled.div`
  width: 100%;
  & > div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
  }

  /* SearchFilterBar 내부의 우측 버튼 그룹 내에서 검색/초기화 버튼 순서를 뒤집음 */
  & div[class*="ButtonGroup"],
  & div[class*="button-group"],
  & div:has(> button) {
    display: flex;
    flex-direction: row-reverse; /* 💡 검색, 초기화 버튼 위치 서로 스왑 */
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

const CodeText = styled.strong`
  color: #174b9c;
  font-weight: 600;
`;

const ErrorText = styled.span`
  color: var(--color-danger);
  font-weight: var(--font-weight-medium);
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

/* ================= Component Logic ================= */
export default function MachineList() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [page, setPage] = useState(1);

  const [filterValues, setFilterValues] = useState({
    processId: "",
    keyword: "",
    status: "",
    useYn: "",
  });

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

  const filteredRows = machines.filter((item) => {
    const keyword = filterValues.keyword.toLowerCase();

    const matchProcess =
      !filterValues.processId || item.process_id === filterValues.processId;

    const matchKeyword =
      !keyword ||
      item.machine_name.toLowerCase().includes(keyword) ||
      item.machine_code.toLowerCase().includes(keyword);

    const matchStatus =
      !filterValues.status || item.status === filterValues.status;

    const matchUseYn =
      !filterValues.useYn || item.use_yn === filterValues.useYn;

    return matchProcess && matchKeyword && matchStatus && matchUseYn;
  });

  const handleFilterChange = (nextValues) => {
    setFilterValues({
      processId: nextValues.processId || "",
      keyword: nextValues.keyword || "",
      status: nextValues.status || "",
      useYn: nextValues.useYn || "",
    });

    setPage(1);
  };

  const handleReset = () => {
    setFilterValues({
      processId: "",
      keyword: "",
      status: "",
      useYn: "",
    });

    setPage(1);
  };

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

  const handleUpdateMachine = (updatedMachine) => {
    setMachines((prev) =>
      prev.map((m) =>
        m.machine_id === updatedMachine.machine_id
          ? { ...m, ...updatedMachine }
          : m,
      ),
    );
  };

  const handleRowClick = (row) => {
    const originMachine = machines.find((m) => m.machine_id === row.machine_id);
    if (originMachine) {
      setSelectedMachine(originMachine);
      setIsDetailOpen(true);
    }
  };

  const handleEditClick = (e, row) => {
    e.stopPropagation();
    const originMachine = machines.find((m) => m.machine_id === row.machine_id);
    if (originMachine) {
      setSelectedMachine(originMachine);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteMachine = (machine) => {
    if (!window.confirm(`${machine.machine_name} 설비를 삭제하시겠습니까?`)) {
      return;
    }

    setMachines((prev) =>
      prev.filter((item) => item.machine_id !== machine.machine_id),
    );
  };

  const columns = [
    { key: "machine_id", label: "ID", align: "center", width: 70 },
    { key: "process_id_cell", label: "공정코드", align: "center", width: 110 },
    {
      key: "machine_code_cell",
      label: "설비코드",
      align: "center",
      width: 110,
    },
    { key: "machine_name", label: "설비명", align: "center", width: 130 },
    { key: "status_badge", label: "설비상태", align: "center", width: 100 },
    { key: "use_yn_badge", label: "사용 여부", align: "center", width: 100 },
    { key: "message_el", label: "메시지", align: "center", width: 200 },
    { key: "management", label: "관리", align: "center", width: 120 },
  ];

  const rows = filteredRows.map((mac) => {
    const displayUseYn = mac.use_yn === "Y" ? "사용 중" : "사용 중지";

    return {
      ...mac,
      id: mac.machine_id,

      process_id_cell: <CodeText>{mac.process_id}</CodeText>,
      machine_code_cell: <CodeText>{mac.machine_code}</CodeText>,

      status_badge: (
        <StatusBadge $status={mac.status}>{mac.status}</StatusBadge>
      ),
      use_yn_badge: (
        <UseYnBadge $useYn={displayUseYn}>{displayUseYn}</UseYnBadge>
      ),
      message_el:
        mac.status === "ERROR" || mac.status === "에러" ? (
          <ErrorText>{mac.message}</ErrorText>
        ) : (
          mac.message
        ),
      management: (
        <Management>
          <IconButton
            type="button"
            title="수정"
            aria-label={`${mac.machine_name} 수정`}
            onClick={(event) => {
              event.stopPropagation();
              handleEditClick(event, mac);
            }}
          >
            <FiEdit2 />
          </IconButton>

          <DeleteButton
            type="button"
            title="삭제"
            aria-label={`${mac.machine_name} 삭제`}
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteMachine(mac);
            }}
          >
            <FiTrash2 />
          </DeleteButton>
        </Management>
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
        <HeaderActionButton
          type="button"
          variant="primary"
          onClick={() => setIsNewModalOpen(true)}
        >
          <FiPlus size={16} />
          설비 등록
        </HeaderActionButton>
      </Header>

      {/* 상단 4개 요약 KPI 카드 */}
      <SummaryGrid>
        <MachineSummaryCard
          height={116}
          padding={18}
          gap={14}
          icon={<FiArchive />}
          iconBoxSize={50}
          iconSize={24}
          iconBackground="var(--color-primary-light)"
          iconColor="var(--color-primary)"
          title="총 설비 수"
          titleFontSize={13}
          value={machines.length}
          valueFontSize={25}
          valueColor="#17191d"
        />

        <MachineSummaryCard
          height={116}
          padding={18}
          gap={14}
          icon={<FiSettings />}
          iconBoxSize={50}
          iconSize={24}
          iconBackground="#f1f5f9"
          iconColor="#64748b"
          title="가동 중인 설비"
          titleFontSize={13}
          value={machines.filter((m) => m.status === "가동").length}
          valueFontSize={25}
          valueColor="#17191d"
        />

        <MachineSummaryCard
          height={116}
          padding={18}
          gap={14}
          icon={<FiAlertTriangle />}
          iconBoxSize={50}
          iconSize={24}
          iconBackground="#fee2e2"
          iconColor="var(--color-danger)"
          title="장애/ERROR 설비"
          titleFontSize={13}
          value={
            machines.filter((m) => m.status === "에러" || m.status === "ERROR")
              .length
          }
          valueFontSize={25}
          valueColor="#17191d"
        />

        <MachineSummaryCard
          height={116}
          padding={18}
          gap={14}
          icon={<FiCheckCircle />}
          iconBoxSize={50}
          iconSize={24}
          iconBackground="#e6f4ea"
          iconColor="#137333"
          title="평균 가동률"
          titleFontSize={13}
          value="84.5%"
          valueFontSize={25}
          valueColor="#17191d"
        />
      </SummaryGrid>

      {/* 검색 박스 영역 스타일 적용 */}
      <StyledFilterPanel>
        <PanelTitle>설비 검색</PanelTitle>
        <FilterBarWrapper>
          <SearchFilterBar
            showDateRange={false}
            showKeyword={true}
            keywordName="keyword"
            keywordLabel="설비명"
            keywordPlaceholder="설비명을 입력하세요"
            keywordWidth={240}
            inputHeight={38}
            border="none"
            padding={0}
            width="100%"
            filters={[
              {
                name: "processId",
                label: "공정코드",
                defaultValue: "",
                width: 180,
                placeholder: "전체 공정코드",
                options: Array.from(
                  new Set(machines.map((m) => m.process_id)),
                ).map((code) => ({ value: code, label: code })),
              },
              {
                name: "status",
                label: "설비상태",
                defaultValue: "",
                width: 150,
                placeholder: "전체 설비상태",
                options: [
                  { value: "가동", label: "가동" },
                  { value: "비가동", label: "비가동" },
                  { value: "에러", label: "에러" },
                ],
              },
              {
                name: "useYn",
                label: "사용 여부",
                width: 140,
                placeholder: "전체",
                options: [
                  { value: "Y", label: "사용 중" },
                  { value: "N", label: "사용 중지" },
                ],
              },
            ]}
            showSearchButton={false}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </FilterBarWrapper>
      </StyledFilterPanel>

      {/* 테이블 영역 카드 디자인 교체 */}
      <TablePanel>
        <TableTop>
          <TableTitle>설비 목록</TableTitle>

          <TableSummary>
            조회 결과 <strong>{rows.length}</strong>건
          </TableSummary>
        </TableTop>

        <Pagination
          columns={columns}
          rows={rows}
          currentPage={page}
          totalItems={rows.length}
          itemsPerPage={8}
          visiblePages={5}
          background="#ffffff"
          borderTop="1px solid #e2e6ed"
          onPageChange={setPage}
          onRowClick={handleRowClick}
          tableProps={{
            tableLayout: "fixed",
            headerBackground: "#f1f3f6",
            emptyText: "조회된 설비 내역이 존재하지 않습니다.",
          }}
        />
      </TablePanel>

      <MachineNew
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSaveMachine}
      />

      <MachineDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedMachine(null);
        }}
        selectedMachine={selectedMachine}
        onEdit={() => {
          setIsDetailOpen(false);
          setIsEditModalOpen(true);
        }}
      />

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
