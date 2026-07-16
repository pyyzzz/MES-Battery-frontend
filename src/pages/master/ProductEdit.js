import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../components/ui/Button";

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
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
    &:focus {
      border-color: var(--color-primary);
    }
  }
`;

const RowFields = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
`;

export default function ProductEdit({ isOpen, product, onClose, onSave }) {
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [voltage, setVoltage] = useState("12");
  const [capacity, setCapacity] = useState("0");
  const [unit, setUnit] = useState("EA");

  // 선택된 제품 데이터가 바뀔 때마다 폼 초기화
  useEffect(() => {
    if (product) {
      setProductCode(product.product_code || "");
      setProductName(product.product_name || "");
      setVoltage(product.voltage?.toString() || "12");
      setCapacity(product.capacity_ah?.toString() || "0");
      setUnit(product.unit || "EA");
    }
  }, [product]);

  const handleUpdate = () => {
    onSave({
      ...product,
      product_code: productCode,
      product_name: productName,
      voltage: Number(voltage),
      capacity_ah: Number(capacity),
      unit: unit,
    });
    onClose();
  };

  return (
    <>
      <DrawerOverlay $isOpen={isOpen} onClick={onClose} />
      <DrawerContainer $isOpen={isOpen}>
        <Header>
          <h3>제품 수정</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <FormBody>
          <Section>
            <SectionTitle>제품 정보 수정</SectionTitle>
            <FormGroup>
              <label>제품 코드</label>
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label>제품명</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </FormGroup>
            <RowFields>
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
        </FormBody>

        <Footer>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            style={{ backgroundColor: "#0b3a9e" }}
          >
            수정
          </Button>
        </Footer>
      </DrawerContainer>
    </>
  );
}
