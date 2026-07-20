import React, { useState } from "react";
import styled from "styled-components";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// 공용 SearchFilterBar 컴포넌트 import (ProcessList와 동일하게 이식)
import SearchFilterBar from "../../components/ui/SearchFilterBar";

import ProductNew from "./ProductNew";
import ProductEdit from "./ProductEdit";
import ProductDetail from "./ProductDetail";

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

// 페이지 헤더
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
    }
    p {
      margin: 0;
      font-size: 14px;
      color: #888f9c;
    }
  }
`;

// Filter 영역을 감싸는 패널 스타일
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

// SearchFilterBar 가로 정렬 및 내부 그룹 스타일 정리를 위한 래퍼
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

// 테이블 패널
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
  min-width: 1080px;
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

// 제품 코드 스타일 블루 계열 볼드 텍스트 적용
const ProductCodeText = styled.strong`
  display: inline-block;
  color: #174b9c;
  font-weight: 600;
  white-space: nowrap;
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

const EmptyMessage = styled.div`
  padding: 60px 20px;
  text-align: center;
  font-size: 14px;
  color: #9198a4;
`;

// 하단 페이지네이션 컨테이너
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

  // 검색 필터 State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");

  // 모달 제어 State
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // SearchFilterBar 연동 조회 핸들러
  const handleSearch = (filterValues) => {
    setStartDate(filterValues.startDate || "");
    setEndDate(filterValues.endDate || "");
    setKeyword(filterValues.keyword || "");
  };

  // SearchFilterBar 연동 초기화 핸들러
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

  // 필터링 로직 (조회 버튼을 클릭하여 State가 세팅되었을 때 렌더링되게 설계됨)
  const filteredRows = products.filter((item) => {
    const normalizedKeyword = String(keyword ?? "").toLowerCase();
    const matchKeyword =
      String(item.product_code ?? "")
        .toLowerCase()
        .includes(normalizedKeyword) ||
      String(item.product_name ?? "")
        .toLowerCase()
        .includes(normalizedKeyword);

    const itemDate = String(item.created_at ?? "").split(" ")[0];
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
    { key: "id", label: "ID", align: "center", width: 80 },
    { key: "product_code", label: "제품 코드", align: "left", width: 180 },
    { key: "product_name", label: "제품명", align: "left", width: 220 },
    { key: "voltage_styled", label: "전압", align: "center", width: 100 },
    { key: "capacity_styled", label: "용량", align: "center", width: 100 },
    { key: "unit", label: "단위", align: "center", width: 90 },
    { key: "created_at", label: "등록일", align: "left", width: 150 },
    { key: "updated_at", label: "수정일", align: "left", width: 150 },
    { key: "management", label: "관리", align: "center", width: 100 },
  ];

  // 데이터 가공 및 컴포넌트 데이터셀 인젝션
  const tableRows = filteredRows.map((row) => ({
    ...row,
    originalProduct: row,
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

      {/* 공용 SearchFilterBar 적용 영역 */}
      <StyledFilterPanel>
        <PanelTitle>제품 검색</PanelTitle>
        <FilterBarWrapper>
          <SearchFilterBar
            filters={[]} // 추가적인 select 필터가 필요 없으므로 빈 배열로 전달
            showKeyword={true}
            keywordName="keyword"
            keywordLabel="통합 검색"
            keywordPlaceholder="제품코드 / 제품명 검색"
            keywordWidth={280}
            showDateRange={true} // 등록일 필터용 Date Range 사용 선언
            dateLabel="등록일"
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

      {/* 테이블 패널 영역 */}
      <TablePanel>
        <TableTop>
          <TableTitle>제품 목록</TableTitle>
          <TableSummary>
            조회 제품 <strong>{filteredRows.length}</strong>건
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
                  <tr
                    key={row.id}
                    onClick={() => {
                      setSelectedProduct(row.originalProduct);
                      setIsDetailOpen(true);
                    }}
                  >
                    <td style={{ textAlign: "center" }}>{row.id}</td>
                    <td style={{ textAlign: "left" }}>{row.product_code}</td>
                    <td style={{ textAlign: "left" }}>{row.product_name}</td>
                    <td style={{ textAlign: "center" }}>
                      {row.voltage_styled}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {row.capacity_styled}
                    </td>
                    <td style={{ textAlign: "center" }}>{row.unit}</td>
                    <td style={{ textAlign: "left" }}>{row.created_at}</td>
                    <td style={{ textAlign: "left" }}>{row.updated_at}</td>
                    <td style={{ textAlign: "center" }}>{row.management}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableScroll>
        ) : (
          <EmptyMessage>
            조건에 부합하는 제품 마스터 내역이 존재하지 않습니다.
          </EmptyMessage>
        )}

        {/* 페이지네이션 Area */}
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
      </TablePanel>

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
        product={selectedProduct}
        onClose={() => setIsEditOpen(false)}
        onSave={handleUpdateProduct}
      />
    </Container>
  );
}
