import React, { useState, useEffect } from "react";
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

// 하단 푸터 영역 (취소, 수정 버튼)
const Footer = styled.div`
  padding: 20px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: var(--color-bg-canvas);
`;

/* ================= Component Logic ================= */
export default function MachineEdit({
  isOpen,
  onClose,
  selectedMachine,
  onUpdate,
}) {
  // 수정 대상을 바인딩할 local state
  const [formData, setFormData] = useState({
    machine_id: "",
    process_id: "",
    machine_code: "",
    machine_name: "",
    status: "가동",
    use_yn: "Y",
  });

  // 선택한 행의 데이터가 변경되거나 모달이 활성화될 때 state 동기화
  useEffect(() => {
    if (selectedMachine && isOpen) {
      setFormData({
        machine_id: selectedMachine.machine_id,
        process_id: selectedMachine.process_id || "",
        machine_code: selectedMachine.machine_code || "",
        machine_name: selectedMachine.machine_name || "",
        status: selectedMachine.status || "가동",
        use_yn: selectedMachine.use_yn || "Y",
      });
    }
  }, [selectedMachine, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.process_id ||
      !formData.machine_code ||
      !formData.machine_name
    ) {
      alert("필수 입력 항목을 확인해 주세요.");
      return;
    }
    onUpdate(formData); // 상위 컴포넌트로 수정 정보 전달
    onClose();
  };

  return (
    <Backdrop onClick={onClose}>
      {/* 버블링 방지 */}
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          <h3>설비 수정</h3>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* 1. 공정코드 */}
          <FormGroup>
            <label>공정코드</label>
            <Input
              type="text"
              name="process_id"
              placeholder="예: PC-001"
              value={formData.process_id}
              onChange={handleChange}
              required
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
              required
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
              required
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
            <label>사용여부</label>
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
          <Button variant="primary" type="button" onClick={handleSubmit}>
            수정
          </Button>
        </Footer>
      </Panel>
    </Backdrop>
  );
}
