import { useMemo, useState } from "react";
import styled from "styled-components";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import Pagination from "../../components/ui/Pagination";
import SearchFilterBar from "../../components/ui/SearchFilterBar";
import Button from "../../components/ui/Button";
import MaterialNewEdit from "./MaterialNewEdit";

const INITIAL_MATERIALS = [
  {
    id: 1,
    code: "MAT-20260209-0001",
    lot: "LOT-001",
    name: "납(Pb)",
    unit: "KG",
    registeredAt: "2026-02-09",
  },
  {
    id: 2,
    code: "MAT-20260209-0002",
    lot: "LOT-002",
    name: "양극판",
    unit: "EA",
    registeredAt: "2026-02-09",
  },
  {
    id: 3,
    code: "MAT-20260209-0003",
    lot: "LOT-003",
    name: "음극판",
    unit: "EA",
    registeredAt: "2026-02-09",
  },
  {
    id: 4,
    code: "MAT-20260209-0004",
    lot: "LOT-004",
    name: "분리판",
    unit: "EA",
    registeredAt: "2026-02-09",
  },
  {
    id: 5,
    code: "MAT-20260209-0005",
    lot: "LOT-005",
    name: "전해액",
    unit: "L",
    registeredAt: "2026-02-09",
  },
  {
    id: 6,
    code: "MAT-20260209-0006",
    lot: "LOT-006",
    name: "케이스",
    unit: "EA",
    registeredAt: "2026-02-09",
  },
  {
    id: 7,
    code: "MAT-20260209-0007",
    lot: "LOT-007",
    name: "커버",
    unit: "EA",
    registeredAt: "2026-02-09",
  },
  {
    id: 8,
    code: "MAT-20260209-0008",
    lot: "LOT-008",
    name: "단자",
    unit: "EA",
    registeredAt: "2026-02-09",
  },
  {
    id: 9,
    code: "MAT-20260209-0009",
    lot: "LOT-009",
    name: "라벨",
    unit: "EA",
    registeredAt: "2026-02-09",
  },
  {
    id: 10,
    code: "MAT-20260209-0010",
    lot: "LOT-010",
    name: "포장지",
    unit: "EA",
    registeredAt: "2026-02-09",
  },
  {
    id: 11,
    code: "MAT-20260209-0011",
    lot: "LOT-011",
    name: "하드케이스",
    unit: "EA",
    registeredAt: "2026-02-09",
  },
];

const PAGE_SIZE = 8;

const columns = [
  { key: "no", label: "No", width: 70 },
  { key: "codeCell", label: "자재코드", width: 200 },
  { key: "lot", label: "LOT 번호", width: 160 },
  { key: "name", label: "자재명", width: 160 },
  { key: "registeredAt", label: "등록일", width: 140 },
  { key: "management", label: "관리", width: 90 },
];

const getToday = () => new Date().toISOString().slice(0, 10);

const createMaterialCode = (materials) => {
  const maxNumber = materials.reduce((max, material) => {
    const number = Number(material.code?.split("-").pop()) || 0;
    return Math.max(max, number);
  }, 0);

  return `MAT-${getToday().replaceAll("-", "")}-${String(
    maxNumber + 1,
  ).padStart(4, "0")}`;
};

const createLotNumber = (materials) => {
  const maxNumber = materials.reduce((max, material) => {
    const number = Number(material.lot?.replace("LOT-", "")) || 0;
    return Math.max(max, number);
  }, 0);

  return `LOT-${String(maxNumber + 1).padStart(3, "0")}`;
};

export default function MaterialList() {
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    keyword: "",
  });
  const [page, setPage] = useState(1);
  const [isNewEditOpen, setIsNewEditOpen] = useState(false);
  const [editMode, setEditMode] = useState("new");
  const [editingMaterial, setEditingMaterial] = useState(null);

  const filteredMaterials = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return materials.filter(
      (material) =>
        (!filters.startDate || material.registeredAt >= filters.startDate) &&
        (!filters.endDate || material.registeredAt <= filters.endDate) &&
        (!keyword ||
          material.code.toLowerCase().includes(keyword) ||
          material.lot.toLowerCase().includes(keyword) ||
          material.name.toLowerCase().includes(keyword)),
    );
  }, [filters, materials]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleOpenNew = () => {
    setEditMode("new");
    setEditingMaterial(null);
    setIsNewEditOpen(true);
  };

  const handleOpenEdit = (material) => {
    setEditMode("edit");
    setEditingMaterial(material);
    setIsNewEditOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsNewEditOpen(false);
    setEditingMaterial(null);
  };

  const handleSaveMaterial = (form) => {
    if (editMode === "edit" && editingMaterial) {
      setMaterials((prev) =>
        prev.map((item) =>
          item.id === editingMaterial.id
            ? {
                ...item,
                name: form.name,
                unit: form.unit,
              }
            : item,
        ),
      );
    } else {
      const newMaterial = {
        id: Date.now(),
        code: createMaterialCode(materials),
        lot: createLotNumber(materials),
        name: form.name,
        unit: form.unit,
        registeredAt: getToday(),
      };

      setMaterials((prev) => [...prev, newMaterial]);
    }

    handleCloseDrawer();
  };

  const handleDeleteMaterial = (material) => {
    const confirmed = window.confirm(
      `${material.name} 자재를 삭제하시겠습니까?`,
    );

    if (!confirmed) return;

    setMaterials((prev) => prev.filter((item) => item.id !== material.id));

    if (filteredMaterials.length % PAGE_SIZE === 1 && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const rows = filteredMaterials.map((material, index) => ({
    ...material,
    no: index + 1,
    codeCell: <Code>{material.code}</Code>,
    management: (
      <Management>
        <IconButton
          type="button"
          title="수정"
          aria-label={`${material.name} 수정`}
          onClick={(event) => {
            event.stopPropagation();
            handleOpenEdit(material);
          }}
        >
          <FiEdit2 />
        </IconButton>

        <DeleteButton
          type="button"
          title="삭제"
          aria-label={`${material.name} 삭제`}
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteMaterial(material);
          }}
        >
          <FiTrash2 />
        </DeleteButton>
      </Management>
    ),
  }));

  return (
    <Page>
      <PageHeader>
        <div>
          <Title>자재 관리</Title>
          <Description>
            생산에 사용하는 자재의 기본정보를 등록하고 수정합니다.
          </Description>
        </div>

        <HeaderActionButton
          type="button"
          variant="primary"
          onClick={handleOpenNew}
        >
          <FiPlus size={17} />
          신규 자재 등록
        </HeaderActionButton>
      </PageHeader>

      <FilterPanel>
        <PanelTitle>자재 검색</PanelTitle>

        <SearchFilterBar
          defaultValues={{}}
          startDateLabel="등록기간"
          endDateLabel="종료일"
          dateWidth={160}
          keywordLabel="자재명 / 코드"
          keywordPlaceholder="자재명, 자재코드 또는 LOT 번호 검색"
          keywordWidth={320}
          padding={0}
          gap={16}
          border="none"
          inputHeight={38}
          showSearchButton={false}
          showResetButton
          onChange={handleFilterChange}
        />
      </FilterPanel>

      <TablePanel>
        <TableHeader>
          <TableTitle>자재 목록</TableTitle>

          <Result>
            조회 결과 <strong>{filteredMaterials.length}</strong>건
          </Result>
        </TableHeader>

        <Pagination
          columns={columns}
          rows={rows}
          currentPage={page}
          totalItems={filteredMaterials.length}
          itemsPerPage={8}
          visiblePages={5}
          height={66}
          background="#f5f6f8"
          borderTop="1px solid #e2e6ed"
          onPageChange={setPage}
          tableProps={{
            minWidth: 900,
            tableLayout: "fixed",
            headerHeight: 46,
            rowHeight: 48,
            cellPadding: "0 14px",
            fontSize: 13,
            headerBackground: "#f1f3f6",
            emptyText: "조건에 맞는 자재가 없습니다.",
          }}
        />
      </TablePanel>

      <MaterialNewEdit
        isOpen={isNewEditOpen}
        mode={editMode}
        material={editingMaterial}
        previewCode={createMaterialCode(materials)}
        previewLot={createLotNumber(materials)}
        onClose={handleCloseDrawer}
        onSave={handleSaveMaterial}
      />
    </Page>
  );
}

const Page = styled.main`
  min-height: 100%;
  padding: 28px 32px 44px;
  box-sizing: border-box;
  background: #f7f8fa;
`;

const PageHeader = styled.header`
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const Title = styled.h1`
  margin: 0;
  color: #17191d;
  font-size: 30px;
  font-weight: 650;
  letter-spacing: -0.8px;
`;

const Description = styled.p`
  margin: 7px 0 0;
  color: #818896;
  font-size: 14px;
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

const Panel = styled.section`
  background: #fff;
  border: 1px solid #dce1ea;
  border-radius: 12px;
  box-shadow: 0 2px 7px rgba(15, 23, 42, 0.04);
`;

const FilterPanel = styled(Panel)`
  margin-bottom: 20px;
  padding: 20px 22px;
`;

const PanelTitle = styled.h2`
  margin: 0 0 14px;
  color: #292d35;
  font-size: 16px;
  font-weight: 600;
`;

const TablePanel = styled(Panel)`
  overflow: hidden;
  table {
    width: 100%;
    table-layout: fixed;
  }
`;

const TableHeader = styled.div`
  min-height: 62px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e2e6ed;
`;

const TableTitle = styled.h2`
  margin: 0;
  color: #292d35;
  font-size: 16px;
  font-weight: 600;
`;

const Result = styled.span`
  color: #737b88;
  font-size: 13px;

  strong {
    color: #0755d9;
  }
`;

const Code = styled.strong`
  color: #174b9c;
  font-weight: 600;
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
