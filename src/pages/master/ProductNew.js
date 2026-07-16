import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../components/ui/Button";

import { FiTrash2 } from "react-icons/fi";

/* Styled Components */
const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 560px;
  height: 100%;
  background-color: #fff;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  transform: ${(props) =>
    props.$isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease-in-out;
`;

// 헤더 영역
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9ca3af;
  &:hover {
    color: #4b5563;
  }
`;

const FormBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.div`
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: #4b5563;
  }

  input,
  select {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    border: 1px solid #cfd5e2;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    outline: none;
    background-color: #fff;
    &:focus {
      border-color: var(--color-primary);
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

  input {
    padding-right: 40px;
  }

  span.suffix {
    position: absolute;
    right: 14px;
    font-size: var(--font-size-sm);
    color: #9ca3af;
  }
`;

const BomAddContainer = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BomAddActionRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;

  & > div {
    flex: 1;
  }
`;

const BomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
  text-align: left;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md);
  overflow: hidden;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background-color: #eef2f6;
    font-weight: var(--font-weight-semibold);
    color: #334155;
  }

  td {
    color: #475569;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const Badge = styled.span`
  background-color: #dbeafe;
  color: #1e40af;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: var(--font-weight-medium);
`;

const DeleteActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: var(--radius-sm);
  margin: 0 auto;

  &:hover {
    background-color: #fee2e2;
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
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
          <CloseButton onClick={handleDrawerClose}>&times;</CloseButton>
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
                    height: "42px",
                    backgroundColor: "#0b3a9e",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  + 자재 추가
                </Button>
              </BomAddActionRow>
            </BomAddContainer>
          </Section>

          <Section>
            <SectionTitle>BOM 리스트</SectionTitle>
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
                        fontWeight: "var(--font-weight-medium)",
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
                        <FiTrash2 size={16} color="var(--color-danger)" />
                      </DeleteActionBtn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </BomTable>
          </Section>
        </FormBody>

        <Footer>
          <Button
            variant="outline"
            onClick={handleDrawerClose}
            style={{
              padding: "10px 24px",
              color: "#475569",
              borderColor: "#cbd5e1",
            }}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{ padding: "10px 24px", backgroundColor: "#0b3a9e" }}
          >
            등록
          </Button>
        </Footer>
      </DrawerContainer>
    </>
  );
}
