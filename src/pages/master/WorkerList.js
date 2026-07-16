import { useMemo, useState } from "react";
import styled from "styled-components";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import FilterDatePicker from "../../components/ui/FilterDatePicker";
import FilterPanel, {
  FilterActions,
  FilterField,
  FilterInput,
  FilterLabel,
  FilterSelect,
} from "../../components/ui/FilterPanel";
import Table from "../../components/ui/Table";
import WorkerDetail from "./WorkerDetail";
import WorkerNewEdit from "./WorkerNewEdit";

// 백엔드 연결 전까지 화면 확인용으로 쓰는 임시 작업자 데이터
// DB의 worker_code, worker_name, role, is_active, created_at에 맞춰 둔 형태
const initialWorkers = [
  {
    id: 1,
    workerCode: "W-260203-0001",
    workerName: "김민규",
    role: "관리자",
    isActive: true,
    createdAt: "2025-09-25",
  },
  {
    id: 2,
    workerCode: "W-260203-0002",
    workerName: "이현수",
    role: "작업자",
    isActive: true,
    createdAt: "2025-06-13",
  },
  {
    id: 3,
    workerCode: "W-260203-0003",
    workerName: "양찬종",
    role: "작업자",
    isActive: false,
    createdAt: "2025-10-26",
  },
  {
    id: 4,
    workerCode: "W-260203-0004",
    workerName: "김하린",
    role: "품질 관리자",
    isActive: true,
    createdAt: "2025-06-12",
  },
  {
    id: 5,
    workerCode: "W-260203-0005",
    workerName: "우민규",
    role: "작업자",
    isActive: true,
    createdAt: "2025-07-03",
  },
];

// 검색 조건 초기값, 초기화 버튼에서 그대로 다시 사용
const emptyFilters = {
  startDate: "",
  endDate: "",
  isActive: "",
  keyword: "",
};

export default function WorkerList() {
  // 지금은 프론트에서만 들고 있는 임시 목록, 나중에 목록 조회 API 결과로 교체하면 됨
  const [workers, setWorkers] = useState(initialWorkers);
  const [filters, setFilters] = useState(emptyFilters);
  const [search, setSearch] = useState(emptyFilters);

  // 값이 있으면 상세 사이드 드로어가 열림
  const [selectedWorker, setSelectedWorker] = useState(null);

  // formOpen은 드로어 열림 여부, editingWorker는 등록/수정 모드 구분용
  const [formOpen, setFormOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);

  // 검색 버튼을 눌러 확정된 search 값으로만 목록 필터링
  const filteredWorkers = useMemo(
    () =>
      workers.filter((worker) => {
        const keyword = search.keyword.trim().toLowerCase();

        return (
          (!search.startDate || worker.createdAt >= search.startDate) &&
          (!search.endDate || worker.createdAt <= search.endDate) &&
          (search.isActive === "" ||
            worker.isActive === (search.isActive === "true")) &&
          (!keyword ||
            worker.workerCode.toLowerCase().includes(keyword) ||
            worker.workerName.toLowerCase().includes(keyword))
        );
      }),
    [workers, search],
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
    if (editingWorker) {
      setWorkers((prev) =>
        prev.map((item) =>
          item.id === editingWorker.id ? { ...item, ...form } : item,
        ),
      );
    } else {
      setWorkers((prev) => [
        ...prev,
        {
          ...form,
          id: Math.max(0, ...prev.map(({ id }) => id)) + 1,
          isActive: true,
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
    { key: "workerCode", label: "사원 번호" },
    { key: "workerName", label: "사원명" },
    { key: "role", label: "직급/권한" },
    { key: "statusView", label: "재직 상태" },
    { key: "createdAt", label: "입사일" },
    { key: "management", label: "관리" },
  ];

  // 공용 Table에 넘기기 전에 배지와 버튼 UI까지 가공
  const rows = filteredWorkers.map((worker) => ({
    ...worker,
    workerCode: <WorkerCode>{worker.workerCode}</WorkerCode>,
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
        <Register type="button" onClick={openNew}>
          <FiPlus />
          작업자 등록
        </Register>
      </Header>

      <FilterPanel
        onSubmit={(event) => {
          event.preventDefault();
          setSearch(filters);
        }}
        $columns="1.2fr 0.8fr 1fr 1fr auto"
      >
        <FilterField>
          <FilterLabel htmlFor="keyword">사원번호/사원명</FilterLabel>
          <FilterInput
            id="keyword"
            name="keyword"
            value={filters.keyword}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, keyword: event.target.value }))
            }
            placeholder="사원번호 / 사원명 검색"
          />
        </FilterField>
        <FilterField>
          <FilterLabel htmlFor="isActive">재직 상태</FilterLabel>
          <FilterSelect
            id="isActive"
            value={filters.isActive}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, isActive: event.target.value }))
            }
          >
            <option value="">전체 상태</option>
            <option value="true">재직</option>
            <option value="false">퇴사</option>
          </FilterSelect>
        </FilterField>
        <FilterField>
          <FilterLabel>입사일 시작</FilterLabel>
          <FilterDatePicker
            value={filters.startDate}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, startDate: value }))
            }
          />
        </FilterField>
        <FilterField>
          <FilterLabel>입사일 종료</FilterLabel>
          <FilterDatePicker
            value={filters.endDate}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, endDate: value }))
            }
          />
        </FilterField>
        <FilterActions
          onReset={() => {
            setFilters(emptyFilters);
            setSearch(emptyFilters);
          }}
        />
      </FilterPanel>

      <TableSection>
        <Table
          columns={columns}
          rows={rows}
          onRowClick={(worker) =>
            setSelectedWorker(workers.find(({ id }) => id === worker.id))
          }
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

// 우측 상단 작업자 등록 버튼
const Register = styled.button`
  height: 42px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #084693;
  border-radius: 6px;
  background: #084693;
  color: #fff;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    background: #073b7c;
  }
`;

// 작업자 목록 표 전용 정렬, 공용 Table 컴포넌트는 건드리지 않음
const TableSection = styled.div`
  margin-top: 24px;

  table {
    width: 100%;
    min-width: 820px;
    table-layout: fixed;
    font-size: 13px;
  }

  th {
    height: 52px;
    padding: 0 18px;
    text-align: center;
    vertical-align: middle;
  }

  td {
    height: 67px;
    padding: 9px 18px;
    text-align: center;
    vertical-align: middle;
  }
`;

// 사원 번호를 강조하기 위한 텍스트 스타일
const WorkerCode = styled.span`
  color: #084693;
  font-weight: 700;
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
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  color: #a7afbe;

  &:hover {
    background: #eef3fa;
    color: #084693;
  }
`;

// 삭제 버튼만 위험 동작 느낌이 나도록 붉은 계열로 분리
const DeleteButton = styled(IconButton)`
  color: #e5969b;

  &:hover {
    background: #fff0f1;
    color: #d84f58;
  }
`;
