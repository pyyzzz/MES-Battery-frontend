import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../components/ui/Button";
import { FiX, FiTrash2 } from "react-icons/fi"; // FiX 아이콘 추가

/* ProductDetail 기반 통일된 디자인 시스템 적용 */
const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 23, 42, 0.38);
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  width: min(480px, 100%);
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: -12px 0 36px rgba(15, 23, 42, 0.18);
  transform: ${(props) =>
    props.$isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.24s ease-out;
`;

const Header = styled.header`
  min-height: 86px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d9deea;

  h3 {
    margin: 0;
    color: #202738;
    font-size: 20px;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  color: #6f788b;
  font-size: 23px;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background: #f1f3f8;
  }
`;

const FormBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px 30px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  margin: 0 0 24px;
  color: #202738;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;

  label {
    display: block;
    margin-bottom: 7px;
    color: #616b7e;
    font-size: 12px;
  }

  input,
  select {
    width: 100%;
    height: 42px;
    padding: 0 16px;
    border: 1px solid #c7cddd;
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    background-color: #fff;
    color: #262d3c;
    font-weight: 500;
    box-sizing: border-box;

    &:focus {
      border-color: #084693;
    }
  }
`;

const RowFields = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$cols || 2}, 1fr);
  gap: 16px;
`;

const InputWithSuffix = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  input {
    padding-right: 40px;
  }

  span.suffix {
    position: absolute;
    right: 16px;
    font-size: 13px;
    color: #616b7e;
    font-weight: 500;
  }
`;

const BomAddContainer = styled.div`
  background-color: #f7f8fd;
  border: 1px solid #c7cddd;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const BomAddActionRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;

  & > div {
    flex: 1;
    margin-bottom: 0;
  }
`;

/* 좁은 폭에서도 텍스트가 잘리지 않도록 가로 스크롤 컨테이너 추가 */
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #c7cddd;
  border-radius: 8px;

  /* 스크롤바 디자인 (선택 사항) */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c7cddd;
    border-radius: 4px;
  }
`;

const BomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  /* 가로폭 확보를 위해 auto 혹은 테이블 최소 크기 지정 가능 */
  table-layout: auto; 
  min-width: 500px; 
  display: table;

  th,
  td {
    height: 44px;
    padding: 0 10px;
    border-bottom: 1px solid #c7cddd;
    color: #303748;
    font-size: 12px;
    vertical-align: middle;
    /* 말줄임표 처리 제거하여 텍스트 온전히 노출 */
    white-space: nowrap; 
  }

  th {
    background: #eef0f8;
    font-weight: 700;
    color: #202738;
  }

  td {
    color: #262d3c;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const Badge = styled.span`
  background-color: #eef0f8;
  color: #084693;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
`;

const DeleteActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  margin: 0 auto;

  &:hover {
    background-color: #f1f3f8;
  }
`;

const Footer = styled.div`
  min-height: 92px;
  padding: 20px 30px;
  display: flex;
  justify-content: center;
  gap: 16px;
  border-top: 1px solid #d9deea;
  background-color: #fff;
  box-sizing: border-box;
`;

export default function ProductNew({ isOpen, onClose, onRegister }) {
  // 제품 마스터 기본 정보 State
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [voltage, setVoltage] = useState("12");
  const [capacity, setCapacity] = useState("0");
  const [unit, setUnit] = useState("EA");

  // BOM 자재 입력용 인라인 임시 State
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedProcess, setSelectedProcess] = useState("");
  const [quantity, setQuantity] = useState("0.00");

  // BOM 리스트 State
  const [bomList, setBomList] = useState([
    {
      id: 1,
      materialCode: "MAT-CELL-01",
      materialName: "Lithium Cell Unit",
      qty: "4.00",
      unit: "EA",
      process: "조립공정",
    },
    {
      id: 2,
      materialCode: "MAT-BMS-03",
      materialName: "BMS Module v2",
      qty: "1.00",
      unit: "EA",
      process: "조립공정",
    },
  ]);

  // BOM 자재 임시 추가 핸들러
  const handleAddBomItem = () => {
    if (!selectedMaterial || !selectedProcess || Number(quantity) <= 0) {
      alert("자재, 투입 공정 및 소요량을 정확히 설정해주세요.");
      return;
    }

    // 예시 맵핑 데이터 기반 이름 바인딩
    const matName =
      selectedMaterial === "MAT-CELL-01"
        ? "Lithium Cell Unit"
        : "BMS Module v2";

    const newItem = {
      id: Date.now(),
      materialCode: selectedMaterial,
      materialName: matName,
      qty: Number(quantity).toFixed(2),
      unit: "EA",
      process: selectedProcess,
    };

    setBomList((prev) => [...prev, newItem]);
    // 추가 후 입력 폼 초기화
    setSelectedMaterial("");
    setSelectedProcess("");
    setQuantity("0.00");
  };

  // BOM 자재 목록 삭제 핸들러
  const handleDeleteBomItem = (id) => {
    if (window.confirm("이 자재를 BOM 목록에서 삭제하시겠습니까?")) {
      setBomList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // 마스터 최종 등록 전송
  const handleSubmit = () => {
    if (!productCode || !productName) {
      alert("제품 코드와 제품명을 모두 입력해주세요.");
      return;
    }

    const payload = {
      product_code: productCode,
      product_name: productName,
      voltage: Number(voltage),
      capacity_ah: Number(capacity),
      unit: unit,
      bom: bomList,
    };

    // 상위 부모 컴포넌트로 데이터 emit 후 드로어 닫기
    onRegister(payload);
    handleDrawerClose();
  };

  // 인풋 초기화하며 닫기
  const handleDrawerClose = () => {
    setProductCode("");
    setProductName("");
    setVoltage("12");
    setCapacity("0");
    setUnit("EA");
    setBomList([
      {
        id: 1,
        materialCode: "MAT-CELL-01",
        materialName: "Lithium Cell Unit",
        qty: "4.00",
        unit: "EA",
        process: "조립공정",
      },
      {
        id: 2,
        materialCode: "MAT-BMS-03",
        materialName: "BMS Module v2",
        qty: "1.00",
        unit: "EA",
        process: "조립공정",
      },
    ]);
    onClose();
  };

  return (
    <>
      <DrawerOverlay $isOpen={isOpen} onClick={handleDrawerClose} />
      <DrawerContainer $isOpen={isOpen}>
        <Header>
          <h3>제품 등록</h3>
          <CloseButton onClick={handleDrawerClose} aria-label="닫기">
            <FiX />
          </CloseButton>
        </Header>

        <FormBody>
          <Section>
            <SectionTitle>제품 정보</SectionTitle>

            <FormGroup>
              <label>제품 코드</label>
              <input
                type="text"
                placeholder="예: BAT-12V-100AH-LI"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <label>제품명</label>
              <input
                type="text"
                placeholder="제품명을 입력하세요"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </FormGroup>

            <RowFields $cols={3}>
              <FormGroup>
                <label>전압(V)</label>
                <select
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </FormGroup>

              <FormGroup>
                <label>용량(Ah)</label>
                <InputWithSuffix>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                  <span className="suffix">Ah</span>
                </InputWithSuffix>
              </FormGroup>

              <FormGroup>
                <label>단위</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="EA">EA</option>
                  <option value="BOX">BOX</option>
                </select>
              </FormGroup>
            </RowFields>
          </Section>

          <Section>
            <SectionTitle>BOM 자재 추가</SectionTitle>
            <BomAddContainer>
              <RowFields $cols={2}>
                <FormGroup>
                  <label>자재 선택</label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                  >
                    <option value="">자재를 선택하세요</option>
                    <option value="MAT-CELL-01">
                      MAT-CELL-01 (Lithium Cell Unit)
                    </option>
                    <option value="MAT-BMS-03">
                      MAT-BMS-03 (BMS Module v2)
                    </option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>투입 공정</label>
                  <select
                    value={selectedProcess}
                    onChange={(e) => setSelectedProcess(e.target.value)}
                  >
                    <option value="">투입 공정을 선택하세요</option>
                    <option value="조립공정">조립공정</option>
                    <option value="패킹공정">패킹공정</option>
                  </select>
                </FormGroup>
              </RowFields>

              <BomAddActionRow>
                <FormGroup>
                  <label>소요량</label>
                  <InputWithSuffix>
                    <input
                      type="number"
                      step="0.01"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <span className="suffix">EA</span>
                  </InputWithSuffix>
                </FormGroup>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleAddBomItem}
                  style={{
                    width: "140px",
                    height: "42px",
                    backgroundColor: "#084693",
                    fontWeight: "700",
                    borderRadius: "8px",
                    border: "none",
                  }}
                >
                  + 자재 추가
                </Button>
              </BomAddActionRow>
            </BomAddContainer>
          </Section>

          <Section>
            <SectionTitle>BOM 리스트</SectionTitle>
            {/* 가로 스크롤 래퍼로 감싸 리스트 가독성 확보 */}
            <TableWrapper>
              <BomTable>
                <thead>
                  <tr>
                    <th style={{ width: "22%" }}>자재 코드</th>
                    <th style={{ width: "28%" }}>자재명</th>
                    <th style={{ width: "12%", textAlign: "right" }}>소요량</th>
                    <th style={{ width: "12%", textAlign: "center" }}>단위</th>
                    <th style={{ width: "16%", textAlign: "center" }}>
                      투입 공정
                    </th>
                    <th style={{ width: "10%", textAlign: "center" }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {bomList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.materialCode}</td>
                      <td>{item.materialName}</td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "700",
                        }}
                      >
                        {item.qty}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.unit}</td>
                      <td style={{ textAlign: "center" }}>
                        <Badge>{item.process}</Badge>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <DeleteActionBtn
                          type="button"
                          onClick={() => handleDeleteBomItem(item.id)}
                        >
                          <FiTrash2 size={16} color="#ef4444" />
                        </DeleteActionBtn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </BomTable>
            </TableWrapper>
          </Section>
        </FormBody>

        <Footer>
          <Button
            variant="outline"
            onClick={handleDrawerClose}
            style={{
              width: "140px",
              height: "44px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "700",
              border: "none",
              background: "#eaebf3",
              color: "#61697a",
            }}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{
              width: "140px",
              height: "44px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "700",
              border: "none",
              background: "#084693",
              color: "#fff",
              boxShadow: "0 5px 12px rgba(8, 70, 147, 0.2)",
            }}
          >
            등록
          </Button>
        </Footer>
      </DrawerContainer>
    </>
  );
}