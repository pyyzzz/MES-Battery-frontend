import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiUserCheck,
  FiUsers,
  FiUserX,
} from "react-icons/fi";
import SearchFilterBar from "../../components/ui/SearchFilterBar";
import SummaryCard from "../../components/ui/SummaryCard";
import CommonPagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import WorkerDetail from "./WorkerDetail";
import WorkerNewEdit from "./WorkerNewEdit";

// 백엔드 연결 전까지 화면 확인용으로 쓰는 임시 작업자 데이터
// DB의 worker_code, worker_name, role, is_active, hired_at, created_at, updated_at에 맞춘 형태
const initialWorkers = [
  {
    id: 1,
    workerCode: "W-260203-0001",
    workerName: "김민규",
    role: "관리자",
    isActive: true,
    hiredAt: "2025-09-25",
    createdAt: "2025-09-25 09:10",
    updatedAt: "2026-02-03 10:20",
  },
  {
    id: 2,
    workerCode: "W-260203-0002",
    workerName: "이현수",
    role: "작업자",
    isActive: true,
    hiredAt: "2025-06-13",
    createdAt: "2025-06-13 08:45",
    updatedAt: "2026-02-03 10:25",
  },
  {
    id: 3,
    workerCode: "W-260203-0003",
    workerName: "양찬종",
    role: "작업자",
    isActive: false,
    hiredAt: "2025-10-26",
    createdAt: "2025-10-26 09:30",
    updatedAt: "2026-01-31 17:40",
  },
  {
    id: 4,
    workerCode: "W-260203-0004",
    workerName: "김하린",
    role: "품질 관리자",
    isActive: true,
    hiredAt: "2025-06-12",
    createdAt: "2025-06-12 08:50",
    updatedAt: "2026-02-02 14:15",
  },
  {
    id: 5,
    workerCode: "W-260203-0005",
    workerName: "우민규",
    role: "작업자",
    isActive: true,
    hiredAt: "2025-07-03",
    createdAt: "2025-07-03 09:05",
    updatedAt: "2026-02-01 11:30",
  },
];

// 검색 조건 초기값, 초기화 버튼에서 그대로 다시 사용
const emptyFilters = {
  startDate: "",
  endDate: "",
  isActive: "",
  keyword: "",
};

const PAGE_SIZE = 6;

export default function WorkerList() {
  // 지금은 프론트에서만 들고 있는 임시 목록, 나중에 목록 조회 API 결과로 교체하면 됨
  const [workers, setWorkers] = useState(initialWorkers);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);

  // 값이 있으면 상세 사이드 드로어가 열림
  const [selectedWorker, setSelectedWorker] = useState(null);

  // formOpen은 드로어 열림 여부, editingWorker는 등록/수정 모드 구분용
  const [formOpen, setFormOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);

  const counts = useMemo(
    () => ({
      total: workers.length,
      active: workers.filter((worker) => worker.isActive).length,
      inactive: workers.filter((worker) => !worker.isActive).length,
    }),
    [workers],
  );

  // 검색 조건이 바뀌면 바로 목록에 반영
  const filteredWorkers = useMemo(
    () =>
      workers.filter((worker) => {
        const keyword = filters.keyword.trim().toLowerCase();

        return (
          (!filters.startDate || worker.hiredAt >= filters.startDate) &&
          (!filters.endDate || worker.hiredAt <= filters.endDate) &&
          (filters.isActive === "" ||
            worker.isActive === (filters.isActive === "true")) &&
          (!keyword ||
            worker.workerCode.toLowerCase().includes(keyword) ||
            worker.workerName.toLowerCase().includes(keyword))
        );
      }),
    [workers, filters],
  );

  const openNew = () => {
    setEditingWorker(null);
    setFormOpen(true);
  };

  const openEdit = (worker) => {
    setSelectedWorker(null);
    setEditingWorker(worker);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingWorker(null);
  };

  // 지금은 화면 상태만 변경, 나중에 create/update API 호출 위치
  const saveWorker = (form) => {
    const now = new Date()
      .toLocaleString("sv-SE", { hour12: false })
      .slice(0, 16);

    if (editingWorker) {
      setWorkers((prev) =>
        prev.map((item) =>
          item.id === editingWorker.id
            ? { ...item, ...form, updatedAt: now }
            : item,
        ),
      );
    } else {
      setWorkers((prev) => [
        ...prev,
        {
          ...form,
          id: Math.max(0, ...prev.map(({ id }) => id)) + 1,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ]);
    }

    closeForm();
  };

  const removeWorker = (worker) => {
    if (window.confirm(`${worker.workerName} 작업자를 삭제하시겠습니까?`)) {
      setWorkers((prev) => prev.filter(({ id }) => id !== worker.id));
    }
  };

  const columns = [
    { key: "no", label: "NO" },
    { key: "workerCode", label: "사원 번호" },
    { key: "workerName", label: "사원명" },
    { key: "role", label: "직급/권한" },
    { key: "statusView", label: "재직 상태" },
    { key: "hiredAt", label: "입사일" },
    { key: "management", label: "관리" },
  ];

  // 공용 Table에 넘기기 전에 배지와 버튼 UI까지 가공
  const rows = filteredWorkers.map((worker, index) => ({
    ...worker,
    no: index + 1,
    workerCode: <WorkerCode>{worker.workerCode}</WorkerCode>,
    hiredAt: worker.hiredAt || worker.createdAt?.split(" ")[0] || "-",
    statusView: (
      <StatusBadge $active={worker.isActive}>
        <StatusDot />
        {worker.isActive ? "재직" : "퇴사"}
      </StatusBadge>
    ),
    management: (
      <Management>
        <IconButton
          type="button"
          aria-label={`${worker.workerName} 수정`}
          onClick={(event) => {
            event.stopPropagation();
            openEdit(worker);
          }}
        >
          <FiEdit2 />
        </IconButton>
        <DeleteButton
          type="button"
          aria-label={`${worker.workerName} 삭제`}
          onClick={(event) => {
            event.stopPropagation();
            removeWorker(worker);
          }}
        >
          <FiTrash2 />
        </DeleteButton>
      </Management>
    ),
  }));

  return (
    <Page>
      <Header>
        <div>
          <Title>작업자 관리</Title>
          <Description>
            시스템에 등록된 작업자 정보와 재직 상태를 관리합니다.
          </Description>
        </div>
        <HeaderActionButton type="button" variant="primary" onClick={openNew}>
          <FiPlus size={16} />
          작업자 등록
        </HeaderActionButton>
      </Header>

      <SummaryGrid>
        <StatusSummaryCard
          icon={<FiUsers />}
          title="전체 작업자"
          value={counts.total}
          iconBackground="#e7f0ff"
          iconColor="#0b57d0"
        />

        <StatusSummaryCard
          icon={<FiUserCheck />}
          title="재직"
          value={counts.active}
          iconBackground="#e5f8ec"
          iconColor="#168853"
        />

        <StatusSummaryCard
          icon={<FiUserX />}
          title="퇴사"
          value={counts.inactive}
          iconBackground="#f0f2f6"
          iconColor="#697386"
        />
      </SummaryGrid>

      <FilterPanel>
        <FilterTitle>작업자 검색</FilterTitle>

        <SearchFilterBar
          filters={[
            {
              name: "isActive",
              label: "재직 상태",
              options: [
                { value: "true", label: "재직" },
                { value: "false", label: "퇴사" },
              ],
            },
          ]}
          defaultValues={emptyFilters}
          keywordLabel="사원번호/사원명"
          keywordPlaceholder="사원번호 / 사원명 검색"
          startDateLabel="입사일 시작"
          endDateLabel="입사일 종료"
          showSearchButton={false}
          padding={0}
          border="0"
          background="transparent"
          onChange={(nextFilters) => {
            setFilters(nextFilters);
            setPage(1);
          }}
          onReset={() => {
            setFilters(emptyFilters);
            setPage(1);
          }}
        />
      </FilterPanel>

      <TableSection>
        <TableTop>
          <TableTitle>작업자 현황</TableTitle>
          <TopResultText>
            조회 결과 <strong>{filteredWorkers.length}</strong>건
          </TopResultText>
        </TableTop>
        <CommonPagination
          columns={columns}
          rows={rows}
          currentPage={page}
          totalItems={filteredWorkers.length}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
          onRowClick={(worker) =>
            setSelectedWorker(workers.find(({ id }) => id === worker.id))
          }
          tableProps={{ minWidth: 820 }}
        />
      </TableSection>

      <WorkerDetail
        worker={selectedWorker}
        onClose={() => setSelectedWorker(null)}
        onEdit={openEdit}
      />
      <WorkerNewEdit
        open={formOpen}
        worker={editingWorker}
        onClose={closeForm}
        onSubmit={saveWorker}
      />
    </Page>
  );
}

// 페이지 전체 여백과 최소 높이를 잡는 바깥 영역
const Page = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 32px 24px;
`;

// 제목 영역과 등록 버튼을 양쪽 끝으로 배치
const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
`;

// 목록 화면의 메인 제목
const Title = styled.h1`
  margin: 0 0 8px;
  color: var(--color-text);
  font-size: 22px;
  font-weight: 700;
`;

// 제목 아래 설명 문구
const Description = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
`;

const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const StatusSummaryCard = styled(SummaryCard).attrs({
  padding: 18,
  gap: 18,
  iconBoxSize: 50,
  iconSize: 24,
  iconBorderRadius: 16,
  titleFontSize: 12,
  titleFontWeight: 500,
  titleColor: "#172033",
  valueFontSize: 26,
  valueFontWeight: 700,
  valueColor: "#020817",
  borderRadius: 16,
  boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)",
})`
  && {
    min-height: 116px;
    flex-direction: row;
    align-items: center;
  }

  > div:last-child {
    justify-content: center;
  }

  > div:last-child > span {
    margin-bottom: 6px;
  }
`;

const FilterPanel = styled.section`
  padding: 18px 20px;
  border: 1px solid #d7dde8;
  border-radius: 12px;
  background: #fff;
`;

const FilterTitle = styled.h2`
  margin: 0 0 12px;
  color: #172033;
  font-size: 15px;
  font-weight: 700;
`;

// 작업자 목록 표 전용 정렬, 공용 Table 컴포넌트는 건드리지 않음
const TableSection = styled.div`
  margin-top: 24px;
  overflow: hidden;
  border: 1px solid #dce1ea;
  border-radius: 12px;
  background: #fff;

  table {
    width: 100%;
    min-width: 820px;
    table-layout: fixed;
    font-size: 13px;
  }

  th {
    padding: 12px 14px;
    border-bottom: 1px solid #e3e7ed;
    background: #f1f3f6;
    color: #535b68;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    vertical-align: middle;
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid #e3e7ed;
    color: #252a32;
    font-size: 13px;
    text-align: center;
    vertical-align: middle;
  }

  tbody tr:hover {
    background: #f6f9ff;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

const HeaderActionButton = styled(Button)`
  width: 128px;
  height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
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
  color: #292d35;
  font-size: 16px;
  font-weight: 600;
`;

const TopResultText = styled.span`
  color: #737b88;
  font-size: 13px;

  strong {
    color: #0755d9;
  }

  th:first-child {
    width: 56px;
  }
`;

// 사원 번호를 강조하기 위한 텍스트 스타일
const WorkerCode = styled.span`
  color: #174b9c;
  font-weight: 600;
`;

// 재직/퇴사 상태를 배지 형태로 보여주는 스타일
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 9px;
  border: 1px solid ${({ $active }) => ($active ? "#c8e8d2" : "#d6d9e4")};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#e8f7ed" : "#eceef5")};
  color: ${({ $active }) => ($active ? "#278a49" : "#616879")};
  font-size: 10px;
  font-weight: 600;
`;

// 상태 배지 앞의 작은 점
const StatusDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
`;

// 수정/삭제 아이콘 버튼을 관리 칸 가운데에 배치
const Management = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

// 수정 아이콘 버튼의 공통 크기와 hover 스타일
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

// 삭제 버튼만 위험 동작 느낌이 나도록 붉은 계열로 분리
const DeleteButton = styled(IconButton)`
  color: #e55252;

  &:hover {
    background: #fff1f1;
  }
`;
