import React from "react";
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

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    font-size: var(--font-size-sm);
    color: #6b7280;
  }
  div {
    padding: 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
  }
`;

const RowFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const BomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    background: #f3f4f6;
    padding: 12px;
    font-size: var(--font-size-sm);
    border: 1px solid #e5e7eb;
  }
  td {
    padding: 12px;
    text-align: center;
    border: 1px solid #e5e7eb;
    font-size: var(--font-size-sm);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
`;

/* Component Logic */
export default function ProductDetail({ isOpen, product, onClose, onEdit }) {
  if (!product) return null;

  return (
    <>
      <DrawerOverlay $isOpen={isOpen} onClick={onClose} />
      <DrawerContainer $isOpen={isOpen}>
        <Header>
          <h3>제품 상세 조회</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <FormBody>
          <Section>
            <SectionTitle>제품 정보</SectionTitle>
            <InfoBox>
              <label>제품명</label>
              <div>{product.product_name}</div>
            </InfoBox>
            <InfoBox>
              <label>제품 코드</label>
              <div>{product.product_code}</div>
            </InfoBox>
            <RowFields>
              <InfoBox>
                <label>전압(V)</label>
                <div>{product.voltage}V</div>
              </InfoBox>
              <InfoBox>
                <label>용량(Ah)</label>
                <div>{product.capacity_ah}Ah</div>
              </InfoBox>
            </RowFields>
            <InfoBox>
              <label>단위</label>
              <div>{product.unit}</div>
            </InfoBox>
          </Section>

          <Section>
            <SectionTitle>BOM 구성 정보</SectionTitle>
            <BomTable>
              <thead>
                <tr>
                  <th>자재 코드</th>
                  <th>자재명</th>
                  <th>소요량</th>
                  <th>단위</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" style={{ color: "#9ca3af" }}>
                    등록된 BOM 정보가 없습니다.
                  </td>
                </tr>
              </tbody>
            </BomTable>
          </Section>
        </FormBody>

        <Footer>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={onEdit}>
            수정하기
          </Button>
        </Footer>
      </DrawerContainer>
    </>
  );
}
