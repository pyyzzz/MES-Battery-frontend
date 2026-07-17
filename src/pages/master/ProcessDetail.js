import React, { useEffect } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";

// product 프로퍼티로 공정 데이터를 받아오고, onEdit과 onClose를 처리합니다.
export default function ProcessDetail({ isOpen, product, onClose, onEdit }) {
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
      <Drawer role="dialog" aria-modal="true" aria-labelledby="process-detail-title">
        <Header>
          <Title id="process-detail-title">공정 상세 조회</Title>
          <Close type="button" onClick={onClose} aria-label="닫기">
            <FiX />
          </Close>
        </Header>

        <Body>
          <SectionTitle>공정 정보</SectionTitle>
          <Field>
            <Label>공정명</Label>
            <Value>{product.step_name}</Value>
          </Field>
          <Field>
            <Label>공정 코드</Label>
            <Value $code>{product.step_code}</Value>
          </Field>
          
          <Grid>
            <Field>
              <Label>담당 설비</Label>
              <Value>{product.machine || "지정되지 않음"}</Value>
            </Field>
            <Field>
              <Label>담당 작업자</Label>
              <Value>{product.worker || "미지정"}</Value>
            </Field>
          </Grid>
          
          <Field>
            <Label>사용 여부</Label>
            <Value>{product.is_active ? "사용" : "미사용"}</Value>
          </Field>

          <Field>
            <Label>공정 설명</Label>
            <Value style={{ minHeight: "80px", alignItems: "flex-start", paddingTop: "12px" }}>
              {product.description || "등록된 설명이 없습니다."}
            </Value>
          </Field>
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

/* Styled Components */
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
  width: min(480px, 100%); /* 가로 폭을 기존 600px에서 480px로 변경 */
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
  font-family: ${({ $code }) => ($code ? "var(--font-family-mono)" : "inherit")};
  font-size: 13px;
  font-weight: ${({ $code }) => ($code ? 700 : 500)};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 440px) { /* 반응형 트리거 시점을 다른 모달 컴포넌트와 동일하게 440px로 수정 */
    grid-template-columns: 1fr;
    gap: 0;
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
  width: 140px; /* 버튼 가로 폭을 기존 160px에서 다른 모달들과 동일하게 140px로 축소 */
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