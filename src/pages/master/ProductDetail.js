import { useEffect } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";

export default function ProductDetail({ isOpen, product, onClose, onEdit }) {
  useEffect(() => {
    if (!isOpen || !product) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, product, onClose]);

  if (!isOpen || !product) return null;

  return (
    <>
      <Backdrop onClick={onClose} />

      <Drawer
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
      >
        <Header>
          <Title id="product-detail-title">제품 상세 조회</Title>

          <Close type="button" onClick={onClose} aria-label="닫기">
            <FiX />
          </Close>
        </Header>

        <Body>
          <SectionTitle>제품 정보</SectionTitle>

          <Field>
            <Label>제품명</Label>
            <Value>{product.product_name}</Value>
          </Field>

          <Field>
            <Label>제품 코드</Label>
            <Value $code>{product.product_code}</Value>
          </Field>

          <Grid>
            <Field>
              <Label>전압(V)</Label>
              <Value>{product.voltage}V</Value>
            </Field>

            <Field>
              <Label>용량(Ah)</Label>
              <Value>{product.capacity_ah}Ah</Value>
            </Field>
          </Grid>

          <Field>
            <Label>단위</Label>
            <Value>{product.unit}</Value>
          </Field>

          <History>
            <SectionTitle>BOM 구성 정보</SectionTitle>

            <TableWrap>
              <table>
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
              </table>
            </TableWrap>
          </History>
        </Body>

        <Footer>
          <Secondary type="button" onClick={onClose}>
            닫기
          </Secondary>

          <Primary type="button" onClick={onEdit}>
            수정
          </Primary>
        </Footer>
      </Drawer>
    </>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 23, 42, 0.38);
`;

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  width: min(600px, 100%);
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: -12px 0 36px rgba(15, 23, 42, 0.18);
  animation: open 0.24s ease-out;

  @keyframes open {
    from {
      transform: translateX(100%);
    }
    to {
      transform: none;
    }
  }
`;

const Header = styled.header`
  min-height: 86px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d9deea;
`;

const Title = styled.h2`
  margin: 0;
  color: #202738;
  font-size: 20px;
  font-weight: 700;
`;

const Close = styled.button`
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

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px 30px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 24px;
  color: #202738;
  font-size: 18px;
  font-weight: 700;
`;

const Field = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.span`
  display: block;
  margin-bottom: 7px;
  color: #616b7e;
  font-size: 12px;
`;

const Value = styled.div`
  min-height: 42px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border: 1px solid #c7cddd;
  border-radius: 8px;
  background: #f7f8fd;
  color: ${({ $code }) => ($code ? "#084693" : "#262d3c")};
  font-family: ${({ $code }) =>
    $code ? "var(--font-family-mono)" : "inherit"};
  font-size: 13px;
  font-weight: ${({ $code }) => ($code ? 700 : 500)};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const History = styled.section`
  margin-top: 38px;
`;

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid #c7cddd;
  border-radius: 8px;

  table {
    width: 100%;
    min-width: 500px;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th,
  td {
    height: 44px;
    padding: 0 16px;
    border-bottom: 1px solid #c7cddd;
    color: #303748;
    font-size: 12px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
  }

  th {
    background: #eef0f8;
    font-weight: 700;
  }

  tr:last-child td {
    border-bottom: 0;
  }
`;

const Footer = styled.footer`
  min-height: 92px;
  padding: 20px 30px;
  display: flex;
  justify-content: center;
  gap: 16px;
  border-top: 1px solid #d9deea;
`;

const FooterButton = styled.button`
  width: 140px; /* 버튼 가로 폭을 기존 160px에서 140px로 축소 */
  height: 44px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
`;

const Secondary = styled(FooterButton)`
  background: #eaebf3;
  color: #61697a;

  &:hover {
    background: #dfe1eb;
  }
`;

const Primary = styled(FooterButton)`
  background: #084693;
  color: #fff;
  box-shadow: 0 5px 12px rgba(8, 70, 147, 0.2);

  &:hover {
    background: #063b7d;
  }
`;
