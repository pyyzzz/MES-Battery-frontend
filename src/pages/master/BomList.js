import { useState } from "react";
import styled from "styled-components";
import { FiEdit2 } from "react-icons/fi";
import BomEdit from "./BomEdit";
import BomDetail from "./BomDeatil";
import Table from "../../components/ui/Table";

// 화면에서 선택할 수 있는 완제품의 임시 데이터
// 실제 API 연동 시 서버에서 받은 제품 목록으로 대체
const PRODUCT_LIST = [
  {
    id: 1,
    productCode: "BAT-12V-45AH",
    productName: "12V 소형 배터리",
    voltage: "12V",
    capacity: "45Ah",
  },
  {
    id: 2,
    productCode: "BAT-12V-65AH",
    productName: "12V 중형 배터리",
    voltage: "12V",
    capacity: "65Ah",
  },
  {
    id: 3,
    productCode: "BAT-12V-90AH",
    productName: "12V 대형 배터리",
    voltage: "12V",
    capacity: "90Ah",
  },
  {
    id: 4,
    productCode: "BAT-12V-100AH",
    productName: "12V 지존 배터리",
    voltage: "12V",
    capacity: "100Ah",
  },
  {
    id: 5,
    productCode: "BAT-12V-30AH",
    productName: "12V 초소형 배터리",
    voltage: "12V",
    capacity: "30Ah",
  },
];

// 제품 id를 key로 사용하고, 각 제품에 포함된 BOM 자재 배열을 value
// 예: INITIAL_BOM[1]은 id가 1인 제품의 BOM 자재 목록
const INITIAL_BOM = {
  1: [
    {
      id: 1,
      materialCode: "MAT-20260209-0001",
      materialName: "납(Pb)",
      requiredQty: 6,
      unit: "KG",
      scrapRate: 1.5,
      process: "전극공정",
    },
    {
      id: 2,
      materialCode: "MAT-20260209-0002",
      materialName: "양극판",
      requiredQty: 5,
      unit: "EA",
      scrapRate: 0,
      process: "전극공정",
    },
    {
      id: 3,
      materialCode: "MAT-20260209-0003",
      materialName: "음극판",
      requiredQty: 5,
      unit: "EA",
      scrapRate: 0,
      process: "전극공정",
    },
  ],

  2: [
    {
      id: 4,
      materialCode: "MAT-20260209-0001",
      materialName: "납(Pb)",
      requiredQty: 8,
      unit: "KG",
      scrapRate: 1.2,
      process: "전극공정",
    },
    {
      id: 5,
      materialCode: "MAT-20260209-0002",
      materialName: "양극판",
      requiredQty: 6,
      unit: "EA",
      scrapRate: 0,
      process: "전극공정",
    },
  ],

  3: [
    {
      id: 6,
      materialCode: "MAT-20260209-0001",
      materialName: "납(Pb)",
      requiredQty: 10,
      unit: "KG",
      scrapRate: 1.7,
      process: "전극공정",
    },
    {
      id: 7,
      materialCode: "MAT-20260209-0004",
      materialName: "전해액",
      requiredQty: 7,
      unit: "L",
      scrapRate: 0.5,
      process: "주액공정",
    },
  ],

  4: [
    {
      id: 8,
      materialCode: "MAT-20260209-0001",
      materialName: "납(Pb)",
      requiredQty: 12,
      unit: "KG",
      scrapRate: 1.8,
      process: "전극공정",
    },
  ],

  5: [
    {
      id: 9,
      materialCode: "MAT-20260209-0001",
      materialName: "납(Pb)",
      requiredQty: 4,
      unit: "KG",
      scrapRate: 1.1,
      process: "전극공정",
    },
  ],
};

// 완제품 선택, BOM 데이터 변경, 수정/상세 드로어 상태를 관리하는 목록 화면
function Bom() {
  // 제품 목록은 현재 고정 데이터이므로 setter 없이 읽기 전용 상태로 사용
  const [products] = useState(PRODUCT_LIST);

  // 현재 선택된 완제품과 제품별 BOM 데이터를 관리.
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [bomData, setBomData] = useState(INITIAL_BOM);

  // 수정/상세 드로어
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBomItem, setSelectedBomItem] = useState(null);

  // 선택된 id로 제품 기본 정보와 해당 제품의 BOM 목록 찾기
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const selectedBomRows = bomData[selectedProductId] || [];

  // 다른 완제품을 선택하면 이전 자재의 상세 선택 상태도 함께 초기화
  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    setIsDetailOpen(false);
    setSelectedBomItem(null);
  };

  // 수정 버튼과 닫기 동작은 수정 드로어의 표시 상태만 변경
  const handleOpenEdit = () => {
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  // 수정 드로어에서 받은 BOM 목록을 현재 선택 제품의 데이터로 교체
  const handleBomSave = (savedRows) => {
    setBomData((prev) => ({
      ...prev,
      [selectedProductId]: savedRows,
    }));

    setIsEditOpen(false);
  };

  // 공용 Table 행의 id로 원본 BOM 자재를 찾아 상세 드로어에 전달
  const handleOpenDetail = (tableRow) => {
    const clickedBomItem = selectedBomRows.find(
      (item) => item.id === tableRow.id,
    );

    if (!clickedBomItem) {
      return;
    }

    setSelectedBomItem(clickedBomItem);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedBomItem(null);
  };

  // 공용 Table이 사용하는 열 정의, key는 아래 bomTableRows의 필드와 대응
  const bomColumns = [
    {
      key: "no",
      width: "72px",
      label: "NO",
    },
    {
      key: "material",
      width: "32%",
      label: "자재명",
    },
    {
      key: "requiredQty",
      width: "15%",
      label: "소요 수량",
      align: "right",
    },
    {
      key: "unit",
      width: "12%",
      label: "단위",
    },
    {
      key: "scrapRate",
      width: "15%",
      label: "불량률 (%)",
      align: "right",
    },
    {
      key: "process",
      width: "20%",
      label: "투입 공정",
    },
  ];

  // 원본 BOM 데이터를 번호, 배지, 경고 색상이 포함된 테이블 표시 데이터로 변환
  const bomTableRows = selectedBomRows.map((row, index) => ({
    id: row.id,

    no: String(index + 1).padStart(2, "0"),

    material: (
      <MaterialInfo>
        <strong>{row.materialName}</strong>
        <span>{row.materialCode}</span>
      </MaterialInfo>
    ),

    requiredQty: Number(row.requiredQty).toFixed(2),

    unit: <UnitBadge>{row.unit}</UnitBadge>,

    scrapRate: (
      <ScrapText $warning={Number(row.scrapRate) > 0}>
        {Number(row.scrapRate).toFixed(1)}%
      </ScrapText>
    ),

    process: <ProcessBadge>{row.process}</ProcessBadge>,
  }));

  return (
    <PageContainer>
      {/* 화면 제목과 BOM 수정 진입 버튼 */}
      <PageHeader>
        <div>
          <PageTitle>BOM 관리</PageTitle>

          <PageDescription>
            제품 생산에 필요한 자재 구성 및 표준 소요량을 관리합니다.
          </PageDescription>
        </div>

        <EditButton type="button" onClick={handleOpenEdit}>
          <FiEdit2 size={17} />
          BOM 수정
        </EditButton>
      </PageHeader>

      {/* 제품 카드를 클릭하면 아래 BOM 테이블의 데이터가 해당 제품 기준 */}
      <ProductSection>
        <SectionTitle>완제품 목록</SectionTitle>

        <ProductList>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              type="button"
              $active={selectedProductId === product.id}
              onClick={() => handleSelectProduct(product.id)}
            >
              <ProductName>{product.productName}</ProductName>
              <ProductCode>{product.productCode}</ProductCode>
            </ProductCard>
          ))}
        </ProductList>
      </ProductSection>

      {/* 선택한 제품의 BOM 자재 목록 */}
      <BomSection>
        <SelectedProductTitle>
          <TitleDot />

          <span>선택된 품목 : {selectedProduct?.productName}</span>
        </SelectedProductTitle>

        <BomTableArea>
          <Table
            columns={bomColumns}
            rows={bomTableRows}
            fixed
            minWidth="760px"
            onRowClick={handleOpenDetail}
          />
        </BomTableArea>
      </BomSection>

      {/* 수정 드로어: 저장 결과를 handleBomSave로 받아 목록 상태에 반영. */}
      <BomEdit
        isOpen={isEditOpen}
        product={selectedProduct}
        bomRows={selectedBomRows}
        onClose={handleCloseEdit}
        onSave={handleBomSave}
      />

      {/* 상세 드로어: 테이블에서 클릭한 원본 BOM 자재를 전달 */}
      <BomDetail
        isOpen={isDetailOpen}
        product={selectedProduct}
        bomItem={selectedBomItem}
        onClose={handleCloseDetail}
      />
    </PageContainer>
  );
}

export default Bom;

// ===== BOM 목록 화면 스타일 =====
// 페이지 전체 배경과 기본 여백을 담당하는 최상위 레이아웃
const PageContainer = styled.div`
  min-height: 100%;
  padding: 24px;
  background: #f5f7fb;
  color: #202530;
`;

// 공용 Table의 기본 테두리/정렬을 BOM 목록 화면에 맞게 덮어씀
const BomTableArea = styled.div`
  width: 100%;

  > div {
    border: 0;
    border-radius: 0;
  }

  /* 공용 Table 내부 헤더 */
  th {
    height: 56px;
    padding: 0 12px;
    text-align: center !important;
    vertical-align: middle !important;
    font-family: "Pretendard", sans-serif;
    line-height: normal;
  }

  /* 표 본문도 좌우·위아래 중앙 정렬 */
  td {
    text-align: center !important;
    vertical-align: middle !important;
    font-family: "Pretendard", sans-serif;
  }

  /* 자재명만 기존처럼 왼쪽 정렬 */
  th:nth-child(2),
  td:nth-child(2) {
    text-align: left !important;
  }

  tbody tr {
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: #f5f8fd;
  }
`;

// 화면 제목 영역과 BOM 수정 버튼을 양 끝에 배치
const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

// BOM 목록 화면의 주 제목
const PageTitle = styled.h1`
  margin: 0;
  font-size: 30px;
  font-weight: 700;
`;

// 제목 아래에 표시되는 화면 설명 문구
const PageDescription = styled.p`
  margin: 7px 0 0;
  color: #697386;
  font-size: 13px;
`;

// BOM 수정 드로어를 여는 주요 액션 버튼
const EditButton = styled.button`
  display: flex;
  min-width: 130px;
  height: 40px;
  gap: 7px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border: none;
  border-radius: 8px;
  background: #0744a0;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #063b8b;
  }
`;

// 완제품 선택 카드들을 감싸는 흰색 패널
const ProductSection = styled.section`
  padding: 16px;
  border: 1px solid #c9d1df;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(32, 37, 48, 0.04);
`;

// 각 콘텐츠 영역의 소제목
const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 17px;
  font-weight: 600;
`;

// 완제품 카드를 5열로 배치하는 그리드
const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(160px, 1fr));
  gap: 12px;
`;

// 완제품 선택 버튼, $active가 true이면 선택 상태의 파란색으로 표시
const ProductCard = styled.button`
  min-height: 63px;
  padding: 12px;
  border: 1px solid ${({ $active }) => ($active ? "#0a53c9" : "#c9d1df")};
  border-radius: 9px;
  background: ${({ $active }) => ($active ? "#0a53c9" : "#f8f9fc")};
  color: ${({ $active }) => ($active ? "#fff" : "#272d38")};
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: #0a53c9;
  }
`;

// 제품 카드 안의 제품명
const ProductName = styled.span`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
`;

// 제품명 아래에 보조 정보로 표시되는 제품 코드
const ProductCode = styled.span`
  display: block;
  color: inherit;
  font-size: 11px;
  opacity: 0.7;
`;

// 선택 제품의 BOM 테이블 전체를 감싸는 패널
const BomSection = styled.section`
  margin-top: 22px;
  overflow: hidden;
  border: 1px solid #c9d1df;
  border-radius: 12px;
  background: #fff;
`;

// BOM 테이블 상단에 현재 선택된 제품을 표시하는 제목
const SelectedProductTitle = styled.div`
  display: flex;
  height: 52px;
  gap: 10px;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #c9d1df;
  font-size: 16px;
`;

// 선택 제품 제목 앞에 표시되는 강조
const TitleDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0744a0;
`;

// KG, EA 같은 자재 단위를 태그 형태로 표시
const UnitBadge = styled.span`
  display: inline-flex;
  min-width: 32px;
  height: 28px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 6px;
  background: #eef1f7;
  color: #5a6373;
`;

// 자재가 투입되는 공정을 둥근 태그 형태로 표시
const ProcessBadge = styled.span`
  display: inline-flex;
  min-height: 25px;
  align-items: center;
  padding: 0 12px;
  border-radius: 20px;
  background: #eaf2ff;
  color: #3166ac;
  font-size: 12px;
`;

// 테이블의 자재명과 자재 코드를 위아래로 묶어 표시
const MaterialInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-weight: 500;
  }

  span {
    color: #566174;
    font-size: 11px;
  }
`;

// 불량률 텍스트, $warning이 true이면 경고 의미의 빨간색을 사용
const ScrapText = styled.span`
  color: ${({ $warning }) => ($warning ? "#df1616" : "#52627b")};
`;
