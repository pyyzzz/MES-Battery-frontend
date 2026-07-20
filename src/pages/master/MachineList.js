import React, { useState } from "react";
import styled from "styled-components";
import {
  FiPlus,
  FiArchive,
  FiSettings,
  FiAlertTriangle,
  FiCheckCircle,
  FiEdit3,
} from "react-icons/fi";

// 공통 UI 컴포넌트 import
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// 공통 신규 컴포넌트 import
import SummaryCard from "../../components/ui/SummaryCard";
import SearchFilterBar from "../../components/ui/SearchFilterBar";

// 신규 추가한 우측 사이드 패널 컴포넌트들 import
import MachineNew from "./MachineNew";
import MachineEdit from "./MachineEdit";
import MachineDetail from "./MachineDetail"; 

/* ================= Styled Components ================= */
const Container = styled.div`
  min-height: 100%;
  padding: 24px; /* 💡 화면 테두리에 붙지 않도록 여백 복원 */
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
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  h2 {
    margin: 0;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: -0.8px;
    color: #17191d;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #888f9c;
    font-weight: var(--font-weight-normal);
  }
`;

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
  min-width: 1000px;
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

const ErrorText = styled.span`
  color: var(--color-danger);
  font-weight: var(--font-weight-medium);
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
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


/* ================= Component Logic ================= */
export default function MachineList() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false); 
  const [selectedMachine, setSelectedMachine] = useState(null);

  const [filterValues, setFilterValues] = useState({
    processId: "",
    machineName: "",
    status: "",
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
    const matchProcess = item.process_id
      .toLowerCase()
      .includes((filterValues.processId || "").toLowerCase());
    const matchName = item.machine_name
      .toLowerCase()
      .includes((filterValues.machineName || "").toLowerCase());
    const matchStatus =
      !filterValues.status || filterValues.status === ""
        ? true
        : item.status === filterValues.status;

    return matchProcess && matchName && matchStatus;
  });

  const handleFilterChange = (nextValues) => {
    setFilterValues({
      processId: nextValues.processId || "",
      machineName: nextValues.keyword || "",
      status: nextValues.status || "",
    });
  };

  const handleSearch = (values) => {
    setFilterValues({
      processId: values.processId || "",
      machineName: values.keyword || "",
      status: values.status || "",
    });
  };

  const handleReset = () => {
    setFilterValues({
      processId: "",
      machineName: "",
      status: "",
    });
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

  const columns = [
    { key: "machine_id", label: "ID", align: "center", width: 70 },
    { key: "process_id", label: "공정코드", align: "center", width: 130 },
    { key: "machine_code", label: "설비코드", align: "center", width: 130 },
    { key: "machine_name", label: "설비명", align: "left", width: 220 },
    { key: "status", label: "설비상태", align: "center", width: 120 },
    { key: "use_yn", label: "사용 여부", align: "center", width: 120 },
    { key: "message", label: "메시지", align: "left", width: 280 },
    { key: "actions", label: "관리", align: "center", width: 90 },
  ];

  const rows = filteredRows.map((mac) => {
    const displayUseYn = mac.use_yn === "Y" ? "사용 중" : "사용 중지";

    return {
      ...mac,
      id: mac.machine_id,
      status_badge: <StatusBadge $status={mac.status}>{mac.status}</StatusBadge>,
      use_yn_badge: <UseYnBadge $useYn={displayUseYn}>{displayUseYn}</UseYnBadge>,
      message_el:
        mac.status === "ERROR" || mac.status === "에러" ? (
          <ErrorText>{mac.message}</ErrorText>
        ) : (
          mac.message
        ),
      actions: (
        <ActionGroup>
          <ActionButton onClick={(e) => handleEditClick(e, mac)} title="수정">
            <FiEdit3 size={18} color="var(--color-text-secondary)" />
          </ActionButton>
        </ActionGroup>
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
        <Button
          variant="primary"
          onClick={() => setIsNewModalOpen(true)}
          style={{
            padding: "10px 20px",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          <FiPlus style={{ marginRight: "4px" }} /> 설비 등록
        </Button>
      </Header>

      {/* 상단 4개 요약 KPI 카드 */}
      <KpiGrid>
        <SummaryCard
          title="총 설비 수"
          value={`${machines.length} 대`}
          icon={<FiArchive />}
          padding={16}
          gap={12}
          titleFontSize={14}
          valueFontSize={24}
          iconBoxSize={44}
          iconSize={20}
          iconBackground="var(--color-primary-light)"
          iconColor="var(--color-primary)"
        />
        <SummaryCard
          title="가동 중인 설비"
          value={`${machines.filter((m) => m.status === "가동").length} 대`}
          valueColor="var(--color-primary)"
          icon={<FiSettings />}
          padding={16}
          gap={12}
          titleFontSize={14}
          valueFontSize={24}
          iconBoxSize={44}
          iconSize={20}
          iconBackground="#f1f5f9"
          iconColor="#64748b"
        />
        <SummaryCard
          title="장애/ERROR 설비"
          value={`${machines.filter((m) => m.status === "에러" || m.status === "ERROR").length} 대`}
          valueColor="var(--color-danger)"
          icon={<FiAlertTriangle />}
          padding={16}
          gap={12}
          titleFontSize={14}
          valueFontSize={24}
          iconBoxSize={44}
          iconSize={20}
          iconBackground="#fee2e2"
          iconColor="var(--color-danger)"
        />
        <SummaryCard
          title="평균 가동률"
          value="84.5%"
          valueColor="var(--color-success)"
          icon={<FiCheckCircle />}
          padding={16}
          gap={12}
          titleFontSize={14}
          valueFontSize={24}
          iconBoxSize={44}
          iconSize={20}
          iconBackground="#e6f4ea"
          iconColor="#137333"
        />
      </KpiGrid>

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
            gap={16}
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
            ]}
            onChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </FilterBarWrapper>
      </StyledFilterPanel>

      {/* 테이블 영역 카드 디자인 교체 */}
      <TablePanel>
        <TableTop>
          <TableTitle>설비 목록</TableTitle>
          <TableSummary>
            조회 설비 <strong>{filteredRows.length}</strong>대
          </TableSummary>
        </TableTop>

        {rows.length > 0 ? (
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
                {rows.map((row) => (
                  <tr key={row.machine_id} onClick={() => handleRowClick(row)}>
                    <td style={{ textAlign: "center" }}>{row.machine_id}</td>
                    <td style={{ textAlign: "center" }}>{row.process_id}</td>
                    <td style={{ textAlign: "center" }}>{row.machine_code}</td>
                    <td style={{ textAlign: "left" }}>{row.machine_name}</td>
                    <td style={{ textAlign: "center" }}>{row.status_badge}</td>
                    <td style={{ textAlign: "center" }}>{row.use_yn_badge}</td>
                    <td style={{ textAlign: "left" }}>{row.message_el}</td>
                    <td style={{ textAlign: "center" }}>{row.actions}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableScroll>
        ) : (
          <EmptyMessage>
            조회된 설비 내역이 존재하지 않습니다.
          </EmptyMessage>
        )}
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