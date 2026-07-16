import React, { useState } from "react";
import styled from "styled-components";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";

import FilterPanel, {
  FilterField,
  FilterActions,
} from "../../components/ui/FilterPanel";

import ProductNew from "./ProductNew";
import ProductEdit from "./ProductEdit";
import ProductDetail from "./ProductDetail";

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
      margin-bottom: 8px;
    }
    p {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
  }
`;

// 테이블 배치 영역 카드
const TableCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 통합 검색 필터용 Input
const SearchInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  input {
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
  }
`;

// 날짜 입력 필드 스타일
const DateInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #cfd5e2;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  outline: none;
  background: #fff;
  &:focus {
    border-color: var(--color-primary);
  }
`;

// 날짜 범위 컨테이너
const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  span {
    color: var(--color-text-secondary);
  }
`;

// 제품 코드 스타일 텍스트
const ProductCodeText = styled.span`
  font-weight: var(--font-weight-bold);
  color: #1e40af;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const EditTextBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-primary-light);
    text-decoration: underline;
  }
`;

// 하단 페이지네이션 컨테이너
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

/* Component Logic */
export default function ProductList() {
  // 1. Mock 데이터 선언
  const [products, setProducts] = useState([
    {
      id: 1,
      product_code: "BAT-12V-45AH",
      product_name: "12V 소형 배터리",
      voltage: 12,
      capacity_ah: 45,
      unit: "EA",
      created_at: "2026-02-09 15:57",
      updated_at: "2026-02-09 15:57",
    },
    {
      id: 2,
      product_code: "BAT-12V-65AH",
      product_name: "12V 중형 배터리",
      voltage: 12,
      capacity_ah: 69,
      unit: "EA",
      created_at: "2026-02-09 15:57",
      updated_at: "2026-02-09 17:02",
    },
    {
      id: 3,
      product_code: "BAT-12V-90AH",
      product_name: "12V 대형 배터리",
      voltage: 12,
      capacity_ah: 90,
      unit: "EA",
      created_at: "2026-02-09 15:57",
      updated_at: "2026-02-09 15:57",
    },
    {
      id: 4,
      product_code: "BAT-12V-100AH",
      product_name: "12V 지존 배터리",
      voltage: 12,
      capacity_ah: 100,
      unit: "EA",
      created_at: "2026-02-09 16:01",
      updated_at: "2026-02-09 16:01",
    },
    {
      id: 5,
      product_code: "BAT-12V-30AH",
      product_name: "12V 초소형 배터리",
      voltage: 12,
      capacity_ah: 30,
      unit: "EA",
      created_at: "2026-02-09 17:02",
      updated_at: "2026-02-09 17:02",
    },
  ]);

  // 검색 필터용 State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");

  // 모달 제어용 State
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 이벤트 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setKeyword("");
  };

  const handleRegisterClick = () => {
    setIsNewOpen(true);
    console.log("제품 등록 모달/드로어 오픈");
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
    console.log("제품 수정 호출:", product.product_code);
  };

  // 필터링 로직
  const filteredRows = products.filter((item) => {
    const matchKeyword =
      item.product_code.toLowerCase().includes(keyword.toLowerCase()) ||
      item.product_name.toLowerCase().includes(keyword.toLowerCase());

    const itemDate = item.created_at.split(" ")[0];
    const matchStart = startDate === "" || itemDate >= startDate;
    const matchEnd = endDate === "" || itemDate <= endDate;

    return matchKeyword && matchStart && matchEnd;
  });

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item,
      ),
    );
    setIsEditOpen(false);
  };

  // Table 컴포넌트에 넘겨줄 컬럼 구조
  const columns = [
    { key: "id", label: "ID", align: "center" },
    { key: "product_code", label: "제품 코드", align: "left" },
    { key: "product_name", label: "제품명", align: "left" },
    { key: "voltage_styled", label: "전압", align: "center" },
    { key: "capacity_styled", label: "용량", align: "center" },
    { key: "unit", label: "단위", align: "center" },
    { key: "created_at", label: "등록일", align: "left" },
    { key: "updated_at", label: "수정일", align: "left" },
    { key: "management", label: "관리", align: "center" },
  ];

  // 데이터 가공 및 컴포넌트 데이터셀 인젝션
  const tableRows = filteredRows.map((row) => ({
    ...row,
    product_code: <ProductCodeText>{row.product_code}</ProductCodeText>,
    voltage_styled: `${row.voltage}V`,
    capacity_styled: `${row.capacity_ah}Ah`,
    management: (
      <EditTextBtn
        onClick={(e) => {
          e.stopPropagation();
          handleEditClick(row);
        }}
        type="button"
      >
        편집
      </EditTextBtn>
    ),
  }));
  return (
    <Container>
      {/* 상단 타이틀 헤더 영역 */}
      <Header>
        <div className="title-group">
          <h2>제품 관리</h2>
          <p>생산 제품의 기본 규격과 마스터 데이터를 관리하는 시스템입니다.</p>
        </div>
        <Button
          variant="primary"
          onClick={handleRegisterClick}
          style={{
            padding: "10px 20px",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          + 제품 등록
        </Button>
      </Header>

      <TableCard>
        <FilterPanel
          onSubmit={handleSearchSubmit}
          $columns="minmax(280px, 1.2fr) minmax(320px, 1.5fr) auto"
        >
          {/* 등록일 필터 */}
          <FilterField>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "var(--font-weight-medium)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              등록일
            </label>
            <DateRangeContainer>
              <DateInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>~</span>
              <DateInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </DateRangeContainer>
          </FilterField>

          {/* 통합 검색 필터 */}
          <FilterField>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "var(--font-weight-medium)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              통합 검색
            </label>
            <SearchInput>
              <input
                type="text"
                placeholder="제품코드 / 제품명 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </SearchInput>
          </FilterField>

          {/* 공용 초기화, 조회 버튼 영역 */}
          <FilterActions onReset={handleReset} submitLabel="조회" />
        </FilterPanel>

        {/* 기획 디자인 전용 테이블 목록 본문 */}
        <Table
          columns={columns}
          rows={tableRows}
          onRowClick={(row) => {
            setSelectedProduct(row);
            setIsDetailOpen(true);
          }}
          emptyMessage="조건에 부합하는 제품 마스터 내역이 존재하지 않습니다."
        />
        <PaginationContainer>
          <div>
            전체 {filteredRows.length}개 항목 중 1에서 {filteredRows.length}까지
            표시
          </div>
          <div className="page-buttons">
            <PageBtn disabled>&lt;</PageBtn>
            <PageBtn $active>1</PageBtn>
            <PageBtn>&gt;</PageBtn>
          </div>
        </PaginationContainer>
      </TableCard>
      <ProductNew
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onRegister={(payload) => {
          console.log("등록할 데이터:", payload);
          setIsNewOpen(false);
        }}
      />
      <ProductDetail
        isOpen={isDetailOpen}
        product={selectedProduct}
        onClose={() => setIsDetailOpen(false)}
        onEdit={() => {
          setIsDetailOpen(false);
          setIsEditOpen(true);
        }}
      />
      <ProductEdit
        isOpen={isEditOpen}
        product={selectedProduct} // 선택된 제품 데이터 전달
        onClose={() => setIsEditOpen(false)}
        onSave={handleUpdateProduct} // 위에서 만든 업데이트 함수 전달
      />
    </Container>
  );
}
