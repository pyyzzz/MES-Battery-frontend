// 디자인 토큰(DESIGN.md) 기반 공용 데이터 테이블 컴포넌트
// columns: [{ key, label, align }]  rows: [{...}]
import styled from "styled-components";

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
`;

const Thead = styled.thead`
  position: sticky;
  top: 0;
  background: var(--color-bg-canvas);
`;

const Th = styled.th`
  height: ${(props) => (props.$dense ? "40px" : "56px")};
  padding: 0 12px;
  text-align: ${(props) => (props.$align === "right" ? "right" : "left")};
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  white-space: nowrap;
  border-bottom: 1px solid var(--color-border);
`;

const Td = styled.td`
  height: ${(props) => (props.$dense ? "40px" : "56px")};
  padding: 0 12px;
  text-align: ${(props) => (props.$align === "right" ? "right" : "left")};
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  border-bottom: 1px solid var(--color-border);
`;

const EmptyRow = styled.td`
  padding: 32px;
  text-align: center;
  color: var(--color-text-secondary);
`;

export default function Table({ columns, rows, dense = false, onRowClick }) {
  return (
    <TableWrapper>
      <StyledTable>
        <Thead>
          <tr>
            {columns.map((col) => (
              <Th key={col.key} $align={col.align} $dense={dense}>
                {col.label}
              </Th>
            ))}
          </tr>
        </Thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <EmptyRow colSpan={columns.length}>데이터가 없습니다.</EmptyRow>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <Td key={col.key} $align={col.align} $dense={dense}>
                    {row[col.key]}
                  </Td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
}
