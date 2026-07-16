import React, { useState } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";
import Button from "../../components/ui/Button";

/* ================= Styled Components ================= */
// 모달 전체 뒷배경 (어두운 레이어)
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: flex-end; /* 우측 정렬 */
`;

// 우측 사이드 패널 본체
const Panel = styled.div`
  width: 480px;
  height: 100%;
  background: var(--color-bg);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

// 헤더 영역 (타이틀 + 닫기 버튼)
const Header = styled.div`
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);

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
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: var(--radius-sm);

  &:hover {
    background: var(--color-bg-canvas);
    color: var(--color-text);
  }
`;

// 입력 폼 영역
const Form = styled.form`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
  }
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #cfd5e2;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #cfd5e2;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  outline: none;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--color-primary);
  }
`;

// 하단 푸터 영역 (취소, 저장 버튼)
const Footer = styled.div`
  padding: 20px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: var(--color-bg-canvas);
`;

/* ================= Component Logic ================= */
export default function MachineNew({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    process_id: "",
    machine_code: "",
    machine_name: "",
    status: "가동",
    use_yn: "Y",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 form 제출 기능(새로고침) 방지
    
    // 💡 .trim()을 사용하여 띄어쓰기 공백만 넣어서 우회하는 것을 완벽 차단!
    if (
      !formData.process_id.trim() ||
      !formData.machine_code.trim() ||
      !formData.machine_name.trim()
    ) {
      alert("모든 필수 입력 항목을 채워주세요.");
      return;
    }

    onSave(formData);

    // 저장 후 모달 닫기 및 폼 초기화
    setFormData({
      process_id: "",
      machine_code: "",
      machine_name: "",
      status: "가동",
      use_yn: "Y",
    });
    onClose();
  };

  return (
    <Backdrop onClick={onClose}>
      {/* 버블링 방지를 위해 내부 Panel 클릭 시 이벤트 전파 차단 */}
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          <h3>설비 등록</h3>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </Header>

        {/* 💡 onSubmit 핸들러가 연결되어 있어 form 내부에서 Enter를 눌러도 제출 가능합니다 */}
        <Form id="machine-new-form" onSubmit={handleSubmit}>
          {/* 1. 공정코드 */}
          <FormGroup>
            <label>공정코드</label>
            <Input
              type="text"
              name="process_id"
              placeholder="예: PC-001"
              value={formData.process_id}
              onChange={handleChange}
              required // HTML5 브라우저 검증 활성화
            />
          </FormGroup>

          {/* 2. 설비코드 */}
          <FormGroup>
            <label>설비코드</label>
            <Input
              type="text"
              name="machine_code"
              placeholder="예: MC-001"
              value={formData.machine_code}
              onChange={handleChange}
              required // HTML5 브라우저 검증 활성화
            />
          </FormGroup>

          {/* 3. 설비명 */}
          <FormGroup>
            <label>설비명</label>
            <Input
              type="text"
              name="machine_name"
              placeholder="설비 이름을 입력하세요"
              value={formData.machine_name}
              onChange={handleChange}
              required // HTML5 브라우저 검증 활성화
            />
          </FormGroup>

          {/* 4. 설비상태 */}
          <FormGroup>
            <label>설비상태</label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="가동">가동</option>
              <option value="비가동">비가동</option>
              <option value="에러">에러</option>
            </Select>
          </FormGroup>

          {/* 5. 사용여부 */}
          <FormGroup>
            <label>사용 여부</label>
            <Select
              name="use_yn"
              value={formData.use_yn}
              onChange={handleChange}
            >
              <option value="Y">사용 중</option>
              <option value="N">사용 중지</option>
            </Select>
          </FormGroup>
        </Form>

        <Footer>
          <Button variant="outline" type="button" onClick={onClose}>
            취소
          </Button>
          {/* 💡 type을 "submit"으로 바꾸어 Form의 onSubmit이 온전히 트리거되도록 수정 */}
          <Button variant="primary" type="submit" form="machine-new-form">
            등록
          </Button>
        </Footer>
      </Panel>
    </Backdrop>
  );
}