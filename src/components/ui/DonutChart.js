import React from "react";
import styled from "styled-components";

const ChartPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
`;

const TotalText = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  span {
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }
`;

const DataItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
`;

const LabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

export default function DonutChart({ total, data }) {
  return (
    <ChartPlaceholder>
      <TotalText>
        총 불량 건수: <span>{total}건</span>
      </TotalText>
      {data.map((item, idx) => (
        <DataItem key={idx}>
          <LabelGroup>
            <ColorDot $color={item.color} />
            <span>{item.label}</span>
          </LabelGroup>
          <strong>{item.value}%</strong>
        </DataItem>
      ))}
    </ChartPlaceholder>
  );
}
