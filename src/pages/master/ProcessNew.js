import React, { useState } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi"; // MachineNew와 동일한 닫기 아이콘 사용
import Button from "../../components/ui/Button";

/* Styled Components */
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

// 우측 사이드 패널
const Panel = styled.div`
  width: 560px;
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

  @media (max-width: 600px) {
    width: 100%;
  }
`;

// 헤더 영역
const Header = styled.div`
  padding: 40px 40px 20px 40px;
  background: var(--color-bg);
  position: relative;

  h3 {
    font-size: 22px;
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    margin-bottom: 8px;
  }
  p {
    font-size: var(--font-size-xs);
    color: var(--color-neutral);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 40px;
  right: 40px;
  background: none;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: var(--color-text);
  }
`;

const Form = styled.form`
  flex: 1;
  padding: 10px 40px 32px 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 그리드 레이아웃 (공정코드 / 순서 / 상태)
const FormGroupRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 1.6fr;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-neutral);
    text-transform: uppercase;
  }
`;

/* 입력 필드 공통 스타일 */
const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--color-primary);
  }

  /* 읽기 전용 스타일 */
  ${(props) =>
    props.readOnly &&
    `
      background: #f1f5f9;
      border-color: #e2e8f0;
      color: #334155;
      cursor: not-allowed;
    `}
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background: #ffffff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 16px;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background: #ffffff;
  outline: none;
  resize: none;
  line-height: 1.5;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--color-primary);
  }
`;

// 하단 푸터 영역
const Footer = styled.div`
  padding: 24px 40px 32px 40px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #ffffff;

  button {
    min-width: 96px;
    height: 44px;
    font-size: var(--font-size-sm);
  }
`;

/* Component Logic */
export default function ProcessNew({ isOpen, onClose, onRegister }) {
  // 컴포넌트 초기 상태 정의
  const initialFormState = {
    step_code: "PROC-006",
    seq: "6",
    is_active: "사용",
    step_name: "",
    machine: "설비 선택 (없음)",
    description: "",
    worker: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // 열려있지 않으면 아무것도 반환하지 않음
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.step_name.trim()) {
      alert("공정 명칭을 입력해주세요.");
      return;
    }

    // 부모 컴포넌트에 누락되었던 나머지 항목들(machine, description, worker)까지 전달
    onRegister({
      step_code: formData.step_code,
      seq: Number(formData.seq),
      step_name: formData.step_name,
      is_active: formData.is_active === "사용",
      machine: formData.machine,
      description: formData.description,
      worker: formData.worker,
    });

    // 등록 완료 후 폼을 초기 상태로 리셋
    setFormData(initialFormState);
    onClose();
  };

  return (
    <Backdrop onClick={onClose}>
      {/* 내부 패널 클릭 시 바깥 닫기 이벤트 전파 방지 */}
      <Panel onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <Header>
          <h3>공정 등록</h3>
          <p>신규 공정 마스터 정보를 입력하십시오.</p>
          <CloseButton type="button" onClick={onClose}>
            <FiX />
          </CloseButton>
        </Header>

        {/* 바디 폼 */}
        <Form id="process-new-form" onSubmit={handleSubmit}>
          {/* 상단 3개 요소 나란히 배치 */}
          <FormGroupRow>
            <FormGroup>
              <label>공정코드</label>
              <Input
                type="text"
                name="step_code"
                value={formData.step_code}
                readOnly
              />
            </FormGroup>

            <FormGroup>
              <label>순서 (SEQ)</label>
              <Input
                type="text"
                name="seq"
                value={formData.seq}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>상태</label>
              <Select
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
              >
                <option value="사용">사용</option>
                <option value="미사용">미사용</option>
              </Select>
            </FormGroup>
          </FormGroupRow>

          {/* 공정명 */}
          <FormGroup>
            <label>공정명</label>
            <Input
              type="text"
              name="step_name"
              placeholder="공정 명칭을 입력하세요"
              value={formData.step_name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {/* 담당 설비 */}
          <FormGroup>
            <label>담당 설비 (MACHINE)</label>
            <Select
              name="machine"
              value={formData.machine}
              onChange={handleChange}
            >
              <option value="설비 선택 (없음)">설비 선택 (없음)</option>
              <option value="MCH-001">프레스 기기 A</option>
              <option value="MCH-002">레이저 커터 B</option>
            </Select>
          </FormGroup>

          {/* 공정 설명 */}
          <FormGroup>
            <label>공정 설명</label>
            <TextArea
              name="description"
              placeholder="공정 세부 프로세스 및 품질 주의사항을 작성하세요."
              value={formData.description}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>담당자</label>
            <Input
              type="text"
              name="worker"
              placeholder="작업자 성명"
              value={formData.worker}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>

        <Footer>
          <Button variant="outline" type="button" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" type="submit" form="process-new-form">
            등록
          </Button>
        </Footer>
      </Panel>
    </Backdrop>
  );
}
