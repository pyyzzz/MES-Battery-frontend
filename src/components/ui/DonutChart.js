import React from "react";
import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const ChartWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

const ChartArea = styled.div`
  position: relative;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  flex-shrink: 0;
`;

const CenterText = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  pointer-events: none;
`;

const TotalValue = styled.strong`
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: #111827;
`;

const TotalLabel = styled.span`
  margin-top: 8px;
  font-size: 13px;
  color: #9ca3af;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 100px;
`;

const LegendItem = styled.div`
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  column-gap: 10px;

  font-size: 14px;
  color: #374151;
`;

const LegendColor = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

const LegendValue = styled.span`
  margin-left: 16px;
  color: #111827;
  font-weight: 500;
`;

const EmptyCircle = styled.div`
  width: 100%;
  height: 100%;
  border: 14px solid #e5e7eb;
  border-radius: 50%;
`;

function DonutChart({
  data = [],
  total,
  totalLabel = "전체",
  size = 150,
  innerRadius = 52,
  outerRadius = 68,
  showTooltip = false,
}) {
  const calculatedTotal = data.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0
  );

  const displayTotal = total ?? calculatedTotal;
  const hasData = calculatedTotal > 0;

  return (
    <ChartWrapper>
      <ChartArea $size={size}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                stroke="none"
                isAnimationActive
              >
                {data.map((item, index) => (
                  <Cell
                    key={`${item.name}-${index}`}
                    fill={item.color}
                  />
                ))}
              </Pie>

              {showTooltip && (
                <Tooltip
                  formatter={(value, name) => [`${value}`, name]}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyCircle />
        )}

        <CenterText>
          <TotalValue>{displayTotal}</TotalValue>
          <TotalLabel>{totalLabel}</TotalLabel>
        </CenterText>
      </ChartArea>

      <Legend>
        {data.map((item) => (
          <LegendItem key={item.name}>
            <LegendColor $color={item.color} />
            <span>{item.name}</span>
            <LegendValue>{item.value}</LegendValue>
          </LegendItem>
        ))}
      </Legend>
    </ChartWrapper>
  );
}

export default DonutChart;