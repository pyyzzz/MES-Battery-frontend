import styled from "styled-components";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

const toCssSize = (value, fallback) => {
  if (value === undefined || value === null) return fallback;
  return typeof value === "number" ? `${value}px` : value;
};

const PaginationWrapper = styled.nav`
  width: ${({ $width }) => toCssSize($width, "100%")};
  min-height: ${({ $height }) => toCssSize($height, "72px")};

  display: flex;
  align-items: center;
  justify-content: ${({ $justifyContent }) => $justifyContent};
  gap: ${({ $gap }) => toCssSize($gap, "6px")};

  padding: ${({ $padding }) => toCssSize($padding, "12px")};

  background: ${({ $background }) => $background};
  border-top: ${({ $borderTop }) => $borderTop};

  box-sizing: border-box;
`;

const PageButton = styled.button`
  width: ${({ $size }) => toCssSize($size, "38px")};
  height: ${({ $size }) => toCssSize($size, "38px")};

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  border: ${({ $active, $border }) =>
    $active ? "none" : $border};

  border-radius: ${({ $borderRadius }) =>
    toCssSize($borderRadius, "6px")};

  background: ${({ $active, $activeBackground, $background }) =>
    $active ? $activeBackground : $background};

  color: ${({ $active, $activeColor, $color }) =>
    $active ? $activeColor : $color};

  font-size: ${({ $fontSize }) => toCssSize($fontSize, "14px")};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};

  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.35 : 1)};

  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({
      disabled,
      $active,
      $hoverBackground,
      $activeBackground,
    }) =>
      disabled
        ? "transparent"
        : $active
        ? $activeBackground
        : $hoverBackground};
  }

  svg {
    width: 17px;
    height: 17px;
  }
`;

function Pagination({
  currentPage = 1,

  totalItems = 0,
  itemsPerPage = 10,

  onPageChange,

  visiblePages = 5,

  showFirstLast = true,
  showPrevNext = true,

  width = "100%",
  height = 72,
  padding = 12,
  gap = 6,
  justifyContent = "center",

  background = "#f8fafc",
  borderTop = "1px solid #e5e7eb",

  buttonSize = 38,
  buttonBorder = "none",
  buttonBorderRadius = 6,

  buttonBackground = "transparent",
  buttonColor = "#374151",

  activeBackground = "#0755d9",
  activeColor = "#ffffff",

  hoverBackground = "#eef2f7",
  fontSize = 14,

  className,
}) {
  const safeTotalItems = Math.max(Number(totalItems) || 0, 0);
  const safeItemsPerPage = Math.max(Number(itemsPerPage) || 1, 1);

  const totalPages = Math.max(
    Math.ceil(safeTotalItems / safeItemsPerPage),
    1
  );

  const safeCurrentPage = Math.min(
    Math.max(Number(currentPage) || 1, 1),
    totalPages
  );

  const safeVisiblePages = Math.max(
    Number(visiblePages) || 1,
    1
  );

  const half = Math.floor(safeVisiblePages / 2);

  let startPage = Math.max(safeCurrentPage - half, 1);
  let endPage = startPage + safeVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(
      endPage - safeVisiblePages + 1,
      1
    );
  }

  const pageNumbers = [];

  for (let page = startPage; page <= endPage; page += 1) {
    pageNumbers.push(page);
  }

  const movePage = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === safeCurrentPage
    ) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <PaginationWrapper
      className={className}
      aria-label="페이지 이동"
      $width={width}
      $height={height}
      $padding={padding}
      $gap={gap}
      $justifyContent={justifyContent}
      $background={background}
      $borderTop={borderTop}
    >
      {showFirstLast && (
        <PageButton
          type="button"
          aria-label="첫 페이지"
          disabled={safeCurrentPage === 1}
          onClick={() => movePage(1)}
          $size={buttonSize}
          $border={buttonBorder}
          $borderRadius={buttonBorderRadius}
          $background={buttonBackground}
          $color={buttonColor}
          $activeBackground={activeBackground}
          $activeColor={activeColor}
          $hoverBackground={hoverBackground}
          $fontSize={fontSize}
        >
          <FiChevronsLeft />
        </PageButton>
      )}

      {showPrevNext && (
        <PageButton
          type="button"
          aria-label="이전 페이지"
          disabled={safeCurrentPage === 1}
          onClick={() => movePage(safeCurrentPage - 1)}
          $size={buttonSize}
          $border={buttonBorder}
          $borderRadius={buttonBorderRadius}
          $background={buttonBackground}
          $color={buttonColor}
          $activeBackground={activeBackground}
          $activeColor={activeColor}
          $hoverBackground={hoverBackground}
          $fontSize={fontSize}
        >
          <FiChevronLeft />
        </PageButton>
      )}

      {pageNumbers.map((page) => (
        <PageButton
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={
            page === safeCurrentPage ? "page" : undefined
          }
          $active={page === safeCurrentPage}
          onClick={() => movePage(page)}
          $size={buttonSize}
          $border={buttonBorder}
          $borderRadius={buttonBorderRadius}
          $background={buttonBackground}
          $color={buttonColor}
          $activeBackground={activeBackground}
          $activeColor={activeColor}
          $hoverBackground={hoverBackground}
          $fontSize={fontSize}
        >
          {page}
        </PageButton>
      ))}

      {showPrevNext && (
        <PageButton
          type="button"
          aria-label="다음 페이지"
          disabled={safeCurrentPage === totalPages}
          onClick={() => movePage(safeCurrentPage + 1)}
          $size={buttonSize}
          $border={buttonBorder}
          $borderRadius={buttonBorderRadius}
          $background={buttonBackground}
          $color={buttonColor}
          $activeBackground={activeBackground}
          $activeColor={activeColor}
          $hoverBackground={hoverBackground}
          $fontSize={fontSize}
        >
          <FiChevronRight />
        </PageButton>
      )}

      {showFirstLast && (
        <PageButton
          type="button"
          aria-label="마지막 페이지"
          disabled={safeCurrentPage === totalPages}
          onClick={() => movePage(totalPages)}
          $size={buttonSize}
          $border={buttonBorder}
          $borderRadius={buttonBorderRadius}
          $background={buttonBackground}
          $color={buttonColor}
          $activeBackground={activeBackground}
          $activeColor={activeColor}
          $hoverBackground={hoverBackground}
          $fontSize={fontSize}
        >
          <FiChevronsRight />
        </PageButton>
      )}
    </PaginationWrapper>
  );
}

export default Pagination;