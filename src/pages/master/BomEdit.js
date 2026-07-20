import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiChevronDown, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import Table from "../../components/ui/Table";

// BOM에 추가할 수 있는 자재 선택지
// 자재를 선택하면 코드, 이름, 단위가 새 BOM 행에 함께 복사
const MATERIAL_OPTIONS = [
  {
    materialCode: "MAT-20260209-0001",
    materialName: "납(Pb)",
    unit: "KG",
  },
  {
    materialCode: "MAT-20260209-0002",
    materialName: "양극판",
    unit: "EA",
  },
  {
    materialCode: "MAT-20260209-0003",
    materialName: "음극판",
    unit: "EA",
  },
  {
    materialCode: "MAT-20260209-0004",
    materialName: "전해액",
    unit: "L",
  },
];

// 자재별 투입 공정을 선택하거나 변경할 때 사용하는 선택지
const PROCESS_OPTIONS = [
  "전극공정",
  "조립공정",
  "주액공정",
  "충전공정",
  "검사공정",
];

// 선택 제품의 BOM 자재를 추가·수정·삭제한 뒤 부모 목록에 저장하는 드로어
function BomEdit({ isOpen, product, bomRows, onClose, onSave }) {
  // 부모의 bomRows를 바로 수정하지 않고 별도의 편집용 배열에서 변경
  const [editingRows, setEditingRows] = useState([]);

  // 새 자재 추가 영역에서 입력한 자재, 공정, 소요량
  const [selectedMaterialCode, setSelectedMaterialCode] = useState("");
  const [selectedProcess, setSelectedProcess] = useState("");
  const [addQuantity, setAddQuantity] = useState("");

  // 드로어를 열 때마다 원본을 복사해 편집용 상태를 만들고 추가 입력값을 초기화
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setEditingRows(
      bomRows.map((row) => ({
        ...row,
      })),
    );

    setSelectedMaterialCode("");
    setSelectedProcess("");
    setAddQuantity("");
  }, [isOpen, bomRows]);

  if (!isOpen || !product) {
    return null;
  }

  // 드로어 안쪽 클릭은 무시하고 바깥 배경을 직접 클릭한 경우에만 닫기
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // 입력값을 검증한 뒤 선택 자재를 편집 목록 끝에 추가
  const handleAddMaterial = () => {
    const material = MATERIAL_OPTIONS.find(
      (item) => item.materialCode === selectedMaterialCode,
    );

    if (!material) {
      alert("자재를 선택해주세요.");
      return;
    }

    if (!selectedProcess) {
      alert("투입 공정을 선택해주세요.");
      return;
    }

    if (!addQuantity || Number(addQuantity) <= 0) {
      alert("소요량을 입력해주세요.");
      return;
    }

    const duplicated = editingRows.some(
      (row) => row.materialCode === material.materialCode,
    );

    if (duplicated) {
      alert("이미 추가된 자재입니다.");
      return;
    }

    // 선택한 자재 정보와 사용자가 입력한 값으로 새 BOM 행을 만듬
    const newRow = {
      id: Date.now(),
      materialCode: material.materialCode,
      materialName: material.materialName,
      requiredQty: Number(addQuantity),
      unit: material.unit,
      process: selectedProcess,
    };

    setEditingRows((prev) => [...prev, newRow]);

    // 추가 완료 후 다음 자재를 바로 입력할 수 있도록 입력 영역을 비움
    setSelectedMaterialCode("");
    setSelectedProcess("");
    setAddQuantity("");
  };

  // 테이블에서 변경한 소요량만 해당 id의 행에 반영
  const handleQuantityChange = (id, value) => {
    setEditingRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              requiredQty: value,
            }
          : row,
      ),
    );
  };

  // 테이블에서 변경한 투입 공정만 해당 id의 행에 반영
  const handleProcessChange = (id, value) => {
    setEditingRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              process: value,
            }
          : row,
      ),
    );
  };

  const handleDeleteRow = (id) => {
    // 삭제할 id를 제외한 새 배열을 만들어 편집 상태를 갱신
    setEditingRows((prev) => prev.filter((row) => row.id !== id));
  };

  // 전체 소요량을 검증하고 숫자 타입으로 정규화한 결과를 부모 컴포넌트에 전달
  const handleSave = () => {
    const hasInvalidQuantity = editingRows.some(
      (row) => !row.requiredQty || Number(row.requiredQty) <= 0,
    );

    if (hasInvalidQuantity) {
      alert("소요량은 0보다 큰 값이어야 합니다.");
      return;
    }

    const savedRows = editingRows.map((row) => ({
      ...row,
      requiredQty: Number(row.requiredQty),
    }));

    onSave(savedRows);
  };

  // 공용 Table이 사용하는 수정 화면의 열 정의
  const bomColumns = [
    { key: "materialCode", label: "자재코드", width: "150px" },
    { key: "materialName", label: "자재명", width: "120px" },
    { key: "requiredQty", label: "소요량", width: "100px" },
    { key: "unit", label: "단위", width: "64px" },
    { key: "process", label: "투입공정", width: "150px" },
    { key: "management", label: "관리", width: "64px" },
  ];

  // 편집 상태를 입력 필드, 셀렉트, 삭제 버튼이 포함된 테이블 행으로 변환
  const bomTableRows = editingRows.map((row) => ({
    id: row.id,
    materialCode: <CodeContent>{row.materialCode}</CodeContent>,
    materialName: row.materialName,
    requiredQty: (
      <TableInput
        type="number"
        min="0"
        step="0.01"
        value={row.requiredQty}
        onChange={(event) => handleQuantityChange(row.id, event.target.value)}
      />
    ),
    unit: row.unit,
    process: (
      <TableSelect
        value={row.process}
        onChange={(event) => handleProcessChange(row.id, event.target.value)}
      >
        {PROCESS_OPTIONS.map((process) => (
          <option key={process} value={process}>
            {process}
          </option>
        ))}
      </TableSelect>
    ),
    management: (
      <DeleteButton type="button" onClick={() => handleDeleteRow(row.id)}>
        <FiTrash2 size={17} />
      </DeleteButton>
    ),
  }));

  return (
    <DrawerBackdrop onMouseDown={handleBackdropClick}>
      <DrawerContainer>
        {/* 드로어 제목과 닫기 버튼 */}
        <DrawerHeader>
          <DrawerTitle>BOM 수정</DrawerTitle>

          <CloseButton type="button" onClick={onClose}>
            <FiX size={24} />
          </CloseButton>
        </DrawerHeader>

        <DrawerBody>
          {/* 현재 수정 중인 완제품의 기본 정보이며 직접 변경 X */}
          <DrawerSection>
            <DrawerSectionTitle>제품 정보</DrawerSectionTitle>

            <ProductInfoGrid>
              <InputGroup>
                <Label>제품코드</Label>
                <ReadOnlyInput value={product.productCode} readOnly />
              </InputGroup>

              <InputGroup>
                <Label>제품명</Label>
                <ReadOnlyInput value={product.productName} readOnly />
              </InputGroup>

              <InputGroup>
                <Label>전압(V)</Label>
                <ReadOnlyInput value={product.voltage} readOnly />
              </InputGroup>

              <InputGroup>
                <Label>용량(Ah)</Label>
                <ReadOnlyInput value={product.capacity} readOnly />
              </InputGroup>
            </ProductInfoGrid>
          </DrawerSection>

          {/* 선택한 자재와 공정, 소요량을 편집 목록에 추가하는 입력 영역 */}
          <DrawerSection>
            <DrawerSectionTitle>BOM 자재 추가</DrawerSectionTitle>

            <AddMaterialGrid>
              <SelectWrapper>
                <Select
                  value={selectedMaterialCode}
                  onChange={(event) =>
                    setSelectedMaterialCode(event.target.value)
                  }
                >
                  <option value="">자재 선택</option>

                  {MATERIAL_OPTIONS.map((material) => (
                    <option
                      key={material.materialCode}
                      value={material.materialCode}
                    >
                      {material.materialName}
                    </option>
                  ))}
                </Select>

                <FiChevronDown />
              </SelectWrapper>

              <SelectWrapper>
                <Select
                  value={selectedProcess}
                  onChange={(event) => setSelectedProcess(event.target.value)}
                >
                  <option value="">공정 선택</option>

                  {PROCESS_OPTIONS.map((process) => (
                    <option key={process} value={process}>
                      {process}
                    </option>
                  ))}
                </Select>

                <FiChevronDown />
              </SelectWrapper>

              <QuantityInput
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={addQuantity}
                onChange={(event) => setAddQuantity(event.target.value)}
              />

              <AddButton type="button" onClick={handleAddMaterial}>
                <FiPlus />
                추가
              </AddButton>
            </AddMaterialGrid>
          </DrawerSection>

          {/* 추가된 BOM 자재의 소요량/공정을 수정하거나 행을 삭제하는 테이블 */}
          <DrawerSection>
            <DrawerSectionTitle>BOM 리스트</DrawerSectionTitle>

            <BomEditTableArea>
              <Table
                columns={bomColumns}
                rows={bomTableRows}
                dense
                fixed
                minWidth="648px"
              />
            </BomEditTableArea>
          </DrawerSection>
        </DrawerBody>

        {/* 취소는 편집 상태를 버리고, 저장은 검증 후 부모의 onSave를 호출 */}
        <DrawerFooter>
          <CancelButton type="button" onClick={onClose}>
            취소
          </CancelButton>

          <SaveButton type="button" onClick={handleSave}>
            수정하기
          </SaveButton>
        </DrawerFooter>
      </DrawerContainer>
    </DrawerBackdrop>
  );
}

export default BomEdit;

// ===== BOM 수정 드로어 스타일 =====
// 화면 전체를 덮는 반투명 배경이며, 드로어를 오른쪽에 정렬
const DrawerBackdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  background: rgba(19, 27, 39, 0.35);
`;

// 오른쪽에서 열리는 BOM 수정 패널의 본체
const DrawerContainer = styled.aside`
  display: flex;
  width: min(600px, 100%);
  height: 100%;
  flex-direction: column;
  background: #f7f9fc;
  box-shadow: -12px 0 32px rgba(21, 29, 44, 0.2);
  animation: drawerOpen 0.25s ease-out;

  @keyframes drawerOpen {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }
`;

// 수정 테이블에만 적용할 셀 높이, 정렬, 글꼴을 공용 Table 위에 덮어씀.
const BomEditTableArea = styled.div`
  width: 100%;

  > div {
    border: 1px solid #dce1ea;
    border-radius: 8px;
  }

  table {
    min-width: 648px;
    table-layout: fixed;
  }

  /* dense 테이블 헤더 높이가 40px이므로 중앙 정렬 */
  th {
    height: 40px;
    padding: 9px 10px;
    border-bottom: 1px solid #e3e7ed;
    background: #f1f3f6;
    color: #535b68;
    font-size: 12px;
    font-weight: 600;
    text-align: center !important;
    vertical-align: middle !important;
    font-family: "Pretendard", sans-serif;
    line-height: normal;
  }

  td {
    height: 40px;
    padding: 9px 10px;
    border-bottom: 1px solid #e3e7ed;
    color: #252a32;
    font-size: 12px;
    text-align: center !important;
    vertical-align: middle !important;
    font-family: "Pretendard", sans-serif;
  }

  input,
  select,
  button {
    font-family: "Pretendard", sans-serif;
  }

  tbody tr:hover {
    background: #f6f9ff;
  }
`;

// 드로어의 제목과 닫기 버튼을 배치하는 상단 고정 영역
const DrawerHeader = styled.div`
  display: flex;
  height: 84px;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #cbd3e0;
  background: #fff;
`;

// 드로어 상단의 화면 제목
const DrawerTitle = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
`;

// 드로어 우측 상단의 닫기 아이콘 버튼
const CloseButton = styled.button`
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #262c35;
  cursor: pointer;

  &:hover {
    background: #eef1f6;
  }
`;

// 내용이 길어질 때 세로 스크롤되는 드로어
const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

// 제품 정보, 자재 추가, BOM 목록을 나누는 본문 구역
const DrawerSection = styled.section`
  margin-bottom: 30px;
`;

// 파란색 세로선으로 강조한 각 본문 구역의 제목
const DrawerSectionTitle = styled.h3`
  margin: 0 0 17px;
  padding-left: 11px;
  border-left: 4px solid #0744a0;
  color: #202630;
  font-size: 18px;
  font-weight: 700;
`;

// 제품 정보를 두 열로 배치
const ProductInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 16px;
`;

// 라벨과 입력 필드를 한 묶음으로 관리하는 영역
const InputGroup = styled.div``;

// 입력 필드 위에 표시되는 항목명
const Label = styled.label`
  display: block;
  margin-bottom: 7px;
  color: #5d6676;
  font-size: 12px;
`;

// 수정할 수 없는 제품 정보를 보여주는 읽기 전용 입력 필드
const ReadOnlyInput = styled.input`
  width: 100%;
  height: 47px;
  padding: 0 13px;
  border: 1px solid #c7cee0;
  border-radius: 9px;
  outline: none;
  background: #f1f2fb;
  color: #303642;
  font-size: 14px;
  box-sizing: border-box;
`;

// 자재, 공정, 수량, 추가 버튼을 한 줄에 배치하는 그리드
const AddMaterialGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1.3fr 96px 72px;
  gap: 12px;
`;

// 기본 select 위에 사용자 지정 화살표 아이콘을 겹쳐 놓는 와퍼
const SelectWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    right: 13px;
    color: #687386;
    pointer-events: none;
    transform: translateY(-50%);
  }
`;

// 자재와 공정을 선택할 때 공통으로 사용하는 셀렉트 박스
const Select = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 35px 0 12px;
  border: 1px solid #c7cee0;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #303642;
  font-size: 13px;
  appearance: none;

  &:focus {
    border-color: #0744a0;
  }
`;

// 새 BOM 자재의 소요량을 입력하는 필드
const QuantityInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #c7cee0;
  border-radius: 8px;
  outline: none;
  text-align: center;
  box-sizing: border-box;

  // 숫자 입력 화살표 제거
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
  }

  &[type="number"] {
    appearance: textfield;
  }

  &:focus {
    border-color: #0744a0;
  }
`;

// 입력한 자재를 편집 중인 BOM 목록에 추가하는 버튼
const AddButton = styled.button`
  display: flex;
  gap: 5px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: #0744a0;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #063b8b;
  }
`;

// 긴 자재 코드가 테이블 셀 밖으로 넘치지 않도록 줄바꿈
const CodeContent = styled.span`
  display: block;
  overflow-wrap: anywhere;
  font-size: 11px;
  line-height: 1.35;
`;

// BOM 테이블 안에서 기존 소요량을 직접 수정하는 작은 입력 필드
const TableInput = styled.input`
  width: 60px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid #bdc7da;
  border-radius: 5px;
  outline: none;
  text-align: center;
  box-sizing: border-box;

  // Chrome, Edge, Safari 숫자 화살표 제거
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
  }

  // Firefox 숫자 화살표 제거
  &[type="number"] {
    appearance: textfield;
  }

  &:focus {
    border-color: #0744a0;
  }
`;

// BOM 테이블 안에서 기존 투입 공정을 변경하는 셀렉트 박스
const TableSelect = styled.select`
  width: 100%;
  height: 34px;
  padding: 0 24px 0 8px;
  border: 1px solid #bdc7da;
  border-radius: 5px;
  outline: none;
  background: #fff;
  font-size: 12px;
  box-sizing: border-box;

  &:focus {
    border-color: #0744a0;
  }
`;

// 편집 중인 BOM 행을 삭제하는 휴지통 아이콘 버튼
const DeleteButton = styled.button`
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #e01f28;
  cursor: pointer;

  &:hover {
    background: #fff0f1;
  }
`;

// 취소와 저장 버튼을 오른쪽에 배치하는 드로어 하단 고정 영역
const DrawerFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
  padding: 16px 18px;
  border-top: 1px solid #cbd3e0;
  background: #fff;
`;

// 변경 내용을 저장하지 않고 드로어를 닫는 보조 버튼
const CancelButton = styled.button`
  min-width: 84px;
  height: 38px;
  padding: 0 16px;
  border: 1px solid #d1d7e3;
  border-radius: 7px;
  background: #fff;
  color: #111827;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #f5f7fa;
  }
`;

// 검증을 통과한 BOM 변경 내용을 저장하는 주요 버튼
const SaveButton = styled.button`
  min-width: 84px;
  height: 38px;
  padding: 0 16px;
  border: 1px solid #0b57d0;
  border-radius: 7px;
  background: #0b57d0;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #0848ad;
  }
`;
