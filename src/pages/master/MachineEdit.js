import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";

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
    <>
      <Backdrop onClick={onClose} />
      {/* 버블링 방지 및 UI 일체화를 위해 Drawer 컴포넌트 적용 */}
      <Drawer role="dialog" aria-modal="true" aria-labelledby="machine-edit-title" onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title id="machine-edit-title">설비 수정</Title>
          <Close type="button" onClick={onClose} aria-label="닫기">
            <FiX />
          </Close>
        </Header>

        <Form id="machine-edit-form" onSubmit={handleSubmit}>
          {/* 1. 공정코드 */}
          <FormGroup>
            <Label>공정코드</Label>
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
            <Label>설비코드</Label>
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
            <Label>설비명</Label>
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
            <Label>설비상태</Label>
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
            <Label>사용여부</Label>
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
          <Secondary type="button" onClick={onClose}>
            취소
          </Secondary>
          {/* form 외부 버튼이므로 type="submit"과 form 매칭을 통해 깔끔히 기능 통합 */}
          <Primary type="submit" form="machine-edit-form">
            수정
          </Primary>
        </Footer>
      </Drawer>
    </>
  );
}

/* ================= Styled Components ================= */
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
  width: min(480px, 100%);
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

const Form = styled.form`
  flex: 1;
  overflow-y: auto;
  padding: 32px 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 7px;
  color: #616b7e;
  font-size: 12px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 16px;
  border: 1px solid #c7cddd;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  background: #fff;
  color: #262d3c;
  transition: border-color 0.15s;

  &:focus {
    border-color: #084693;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 16px;
  border: 1px solid #c7cddd;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  background: #fff;
  color: #262d3c;
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    border-color: #084693;
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
  width: 140px;
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