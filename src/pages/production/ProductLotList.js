import { forwardRef, useMemo, useState } from "react";
import styled from "styled-components";
import { FiCalendar, FiRefreshCw, FiSearch } from "react-icons/fi";
import FinishedLotDetailDrawer from "./ProductLotDetail";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// 날짜 문자열("2026-07-14")을 Date 객체로 바꾸는 함수
const parseDate = (value) => {
  if (!value) return null;

  // "YYYY-MM-DD" 문자열을 "-" 기준으로 나눠서 숫자로 변환
  const [year, month, day] = value.split("-").map(Number);

  // JS Date의 month는 0부터 시작해서 1월이 0이므로 month - 1 처리
  return new Date(year, month - 1, day);
};

// Date 객체를 화면/필터에서 쓰기 좋은 "YYYY-MM-DD" 문자열로 바꾸는 함수
const formatDate = (date) => {
  // 날짜를 지우거나 선택하지 않은 경우 빈 문자열로 저장
  if (!date) return "";

  // Date 객체에서 연/월/일을 꺼냄
  const year = date.getFullYear();

  // 월/일이 한 자리면 앞에 0을 붙여 "07", "04" 형태로 맞춤
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // 필터 비교가 쉬운 ISO 비슷한 날짜 문자열로 반환
  return `${year}-${month}-${day}`;
};

// react-datepicker가 사용할 커스텀 input 컴포넌트
const DateInput = forwardRef(function DateInput(
  {
    value,
    onClick,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    placeholder,
    className,
  },
  ref,
) {
  // react-datepicker가 사용할 실제 input
  return (
    <DateTextInput
      ref={ref}
      className={className}
      type="text"
      value={value || ""}
      placeholder={placeholder}
      inputMode="numeric"
      autoComplete="off"
      onClick={onClick}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />
  );
});

// 완제품 LOT 목록 목업 데이터
// 아직 백엔드 API가 없어서 화면 테스트용으로 임시 데이터
// DB가 연결되면 이 배열 대신 API 응답 데이터를 받아서 사용
//
// 필드 의미
// - id: React에서 목록을 반복 렌더링할 때 쓰는 화면용 고유값
// - lotId, productId, workOrderId, fgInventoryId: DB 테이블의 PK/FK를 흉내 낸 값
// - lotNo: 사용자가 화면에서 확인하는 LOT 번호
// - productCode/productName: 제품 마스터(product)에서 오는 제품 정보
// - workOrderNo: 작업지시(work_order) 번호
// - lotQty: LOT에 배정된 생산 수량
// - inspectionQty/goodQty/defectQty: 생산실적/검사 결과 요약 수량
// - locationCode: 완제품 재고(fg_inventory)에 입고된 위치
// - createdDate/createdTime: LOT 생성일시, 날짜 필터와 테이블 표시에 사용
// - status: LOT 진행 상태, 배지 색상과 상세 화면 상태 표시에 사용
const LOTS = [
  {
    // 첫 번째 행입니다. 아래 LOT들도 같은 구조로 반복됩니다.
    id: 1,                                    // 화면에서 행을 구분하기 위한 값
    lotId: 1001,                              // DB lot 테이블의 lot_id 역할
    lotNo: "LOT-20260714-001",                // 테이블 첫 번째 컬럼에 보이는 LOT 번호
    productId: 201,                           // DB product 테이블과 연결되는 제품 ID
    productCode: "BAT-12V-060",               // 제품 구분/필터에 쓰는 제품 코드
    productName: "차량용 배터리 12V 60Ah",     // 테이블에 표시되는 제품명
    workOrderId: 301,                         // DB work_order 테이블과 연결되는 작업지시 ID
    workOrderNo: "WO-20260714-001",           // 테이블 제품명 아래에 표시되는 작업지시 번호
    lotQty: 5000,                             // 이 LOT에 배정된 전체 생산 수량
    inspectionQty: 5000,                      // 검사한 수량, 테이블의 검사 수량 컬럼에 표시
    goodQty: 4958,                            // 합격 수량, 합격/불합격 컬럼의 앞 숫자
    defectQty: 42,                            // 불합격 수량, 합격/불합격 컬럼의 뒤 숫자
    fgInventoryId: 401,                       // 완제품 재고 테이블과 연결되는 ID
    locationCode: "FG-A-01",                  // 완제품 창고 위치 코드
    createdDate: "2026-07-14",                // 날짜 필터 검색에 쓰는 LOT 생성일
    createdTime: "오전 09:30",                // 테이블 LOT 생성일 아래에 표시되는 시간
    status: "생산완료",                        // LOT 상태 배지에 표시되는 값
  },
  {
    // 입고까지 완료된 LOT 예시
    id: 2,
    lotId: 1002,
    lotNo: "LOT-20260714-002",
    productId: 202,
    productCode: "BAT-12V-080",
    productName: "차량용 배터리 12V 80Ah",
    workOrderId: 302,
    workOrderNo: "WO-20260714-002",
    lotQty: 3200,
    inspectionQty: 3200,
    goodQty: 3168,
    defectQty: 32,
    fgInventoryId: 402,
    locationCode: "FG-A-02",
    createdDate: "2026-07-14",
    createdTime: "오전 11:10",
    status: "입고완료",
  },
  {
    // 생산은 끝났지만 아직 최종 검사 전인 LOT 예시
    id: 3,
    lotId: 1003,
    lotNo: "LOT-20260713-001",
    productId: 203,
    productCode: "BAT-12V-100",
    productName: "차량용 배터리 12V 100Ah",
    workOrderId: 303,
    workOrderNo: "WO-20260713-004",
    lotQty: 2800,
    inspectionQty: 2800,
    goodQty: 0,
    defectQty: 0,
    fgInventoryId: null,
    locationCode: "-",
    createdDate: "2026-07-13",
    createdTime: "오후 03:45",
    status: "검사대기",
  },
  {
    // 완제품 재고로 잡혔고 출하를 기다리는 LOT 예시
    id: 4,
    lotId: 1004,
    lotNo: "LOT-20260713-002",
    productId: 201,
    productCode: "BAT-12V-060",
    productName: "차량용 배터리 12V 60Ah",
    workOrderId: 304,
    workOrderNo: "WO-20260713-005",
    lotQty: 4500,
    inspectionQty: 4500,
    goodQty: 4420,
    defectQty: 80,
    fgInventoryId: 403,
    locationCode: "FG-B-01",
    createdDate: "2026-07-13",
    createdTime: "오후 05:20",
    status: "출하대기",
  },
  {
    // 다른 제품 규격의 입고 완료 LOT 예시
    id: 5,
    lotId: 1005,
    lotNo: "LOT-20260712-001",
    productId: 204,
    productCode: "BAT-12V-120",
    productName: "차량용 배터리 12V 120Ah",
    workOrderId: 305,
    workOrderNo: "WO-20260712-002",
    lotQty: 1800,
    inspectionQty: 1800,
    goodQty: 1773,
    defectQty: 27,
    fgInventoryId: 404,
    locationCode: "FG-C-01",
    createdDate: "2026-07-12",
    createdTime: "오후 02:15",
    status: "입고완료",
  },
  {
    // 검사 결과 불량 수량이 조금 있는 생산 완료 LOT 예시
    id: 6,
    lotId: 1006,
    lotNo: "LOT-20260712-002",
    productId: 202,
    productCode: "BAT-12V-080",
    productName: "차량용 배터리 12V 80Ah",
    workOrderId: 306,
    workOrderNo: "WO-20260712-003",
    lotQty: 3600,
    inspectionQty: 3600,
    goodQty: 3515,
    defectQty: 85,
    fgInventoryId: 405,
    locationCode: "FG-B-03",
    createdDate: "2026-07-12",
    createdTime: "오후 06:40",
    status: "생산완료",
  },
];

const PAGE_SIZE = 4;

// 숫자를 한국식 천 단위 콤마로 표시하기 위한 formatter
// 예: 5000 -> "5,000"
const formatNumber = new Intl.NumberFormat("ko-KR");

// 검색 조건의 초기값
// 초기화 버튼을 누르거나 화면이 처음 열릴 때 이 값으로 시작
const initialFilters = {
  keyword: "",
  productCode: "ALL",
  workOrderNo: "ALL",
  startDate: "",
  endDate: "",
};

export default function ProductLotList() {
  // draft는 사용자가 입력 중인 검색 조건, filters는 조회 버튼을 눌렀을 때 실제 적용되는 조건
  const [draft, setDraft] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);

  // 현재 보고 있는 페이지 번호
  const [page, setPage] = useState(1);

  // 클릭해서 상세 drawer에 보여줄 LOT 데이터
  // null이면 상세 drawer가 닫힌 상태
  const [selectedLot, setSelectedLot] = useState(null);

  // 제품명 select 옵션을 LOT 목업 데이터에서 자동으로 뽑아 중복 없이 만듬
  const productOptions = useMemo(
    () => [
      ...new Map(
        LOTS.map((lot) => [lot.productCode, lot.productName]),
      ).entries(),
    ],
    [],
  );
  const workOrderOptions = useMemo(
    // 작업지시 번호 select 옵션도 현재 LOT 데이터 기준으로 만듬
    () => [...new Set(LOTS.map((lot) => lot.workOrderNo))],
    [],
  );

  // 조회 버튼을 눌렀을 때 적용된 조건(filters)을 기준으로 테이블에 표시할 LOT만 골라냄
  const filteredRows = useMemo(
    () =>
      LOTS.filter((lot) => {
        const keyword = filters.keyword.trim().toLowerCase();
        return (
          (!keyword || lot.lotNo.toLowerCase().includes(keyword)) &&
          (filters.productCode === "ALL" ||
            lot.productCode === filters.productCode) &&
          (filters.workOrderNo === "ALL" ||
            lot.workOrderNo === filters.workOrderNo) &&
          (!filters.startDate || lot.createdDate >= filters.startDate) &&
          (!filters.endDate || lot.createdDate <= filters.endDate)
        );
      }),
    [filters],
  );

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  // 현재 페이지에 보여줄 행만 잘라낸 데이터
  // 예: 1페이지면 0~3번, 2페이지면 4~7번 데이터
  const rows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 검색 조건 draft 값을 바꾸는 공통 함수
  // key에는 "keyword", "productCode", "startDate" 같은 필드명이 들어감
  const updateDraft = (key, value) =>
    // input/select/date가 바뀔 때 draft 검색 조건만 먼저 수정
    setDraft((current) => ({ ...current, [key]: value }));

  const search = () => {
    // 사용자가 입력한 draft 조건을 실제 필터로 확정하고 첫 페이지로 이동
    setFilters(draft);
    setPage(1);
  };

  const reset = () => {
    // 검색 조건과 페이지를 모두 처음 상태로 되돌림
    setDraft(initialFilters);
    setFilters(initialFilters);
    setPage(1);
  };

  // 테이블 행을 클릭했을 때 상세 drawer에 보여줄 LOT을 저장
  const openLotDetail = (lot) => setSelectedLot(lot);

  // 키보드 접근성을 위한 상세 열기 함수
  // 테이블 행에 focus가 있을 때 Enter 또는 Space를 누르면 상세 drawer를 엶
  const openLotDetailWithKeyboard = (event, lot) => {
    // 마우스 클릭뿐 아니라 Enter/Space 키로도 상세 drawer를 열 수 있음
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLotDetail(lot);
    }
  };

  return (
    // 전체 완제품 LOT 목록 화면
    <Page>
      <Content>
        {/* 완제품 LOT 목록 상단 제목/설명/버튼 메뉴 */}
        <Header>
          <div>
            <Title>완제품 LOT 목록</Title>
            <Description>
              생산 완료된 제품의 LOT 정보를 조회하고 품질 판정 결과를
              모니터링합니다.
            </Description>
          </div>
          <HeaderActions>
            <ActionButton type="button" onClick={reset}>
              <FiRefreshCw /> 초기화
            </ActionButton>
            <SearchButton type="button" onClick={search}>
              <FiSearch /> 조회
            </SearchButton>
          </HeaderActions>
        </Header>

        {/* LOT 번호, 제품명, 작업지시, 생산 일자를 조회하는 검색 조건 메뉴 */}
        <FilterPanel
          onSubmit={(event) => {
            event.preventDefault();
            search();
          }}
        >
          <Field>
            <Label htmlFor="lot-number">LOT 번호</Label>
            <Control
              id="lot-number"
              value={draft.keyword}
              onChange={(event) => updateDraft("keyword", event.target.value)}
              placeholder="예: LOT-2023-..."
            />
          </Field>
          <Field>
            <Label htmlFor="product-code">제품명</Label>
            <Select
              id="product-code"
              value={draft.productCode}
              onChange={(event) =>
                updateDraft("productCode", event.target.value)
              }
            >
              <option value="ALL">전체 제품군</option>
              {productOptions.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="work-order">작업지시 번호</Label>
            <Select
              id="work-order"
              value={draft.workOrderNo}
              onChange={(event) =>
                updateDraft("workOrderNo", event.target.value)
              }
            >
              <option value="ALL">전체 작업지시</option>
              {workOrderOptions.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label>시작일</Label>
            <DateBox>
              <FiCalendar aria-hidden="true" />
              <DatePicker
                selected={parseDate(draft.startDate)}
                onChange={(date) => updateDraft("startDate", formatDate(date))}
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                popperPlacement="bottom-start"
                popperProps={{ strategy: "fixed" }}
                customInput={<DateInput />}
              />
            </DateBox>
          </Field>

          <Field>
            <Label>종료일</Label>
            <DateBox>
              <FiCalendar aria-hidden="true" />
              <DatePicker
                selected={parseDate(draft.endDate)}
                onChange={(date) => updateDraft("endDate", formatDate(date))}
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                popperPlacement="bottom-start"
                popperProps={{ strategy: "fixed" }}
                customInput={<DateInput />}
              />
            </DateBox>
          </Field>
          <HiddenSubmit type="submit" aria-hidden="true" tabIndex="-1" />
        </FilterPanel>

        {/* 완제품 LOT 조회 결과 테이블 메뉴 */}
        <TablePanel>
          <TableViewport>
            <Table>
              <thead>
                {/* 테이블 컬럼 제목 메뉴 */}
                <tr>
                  <th scope="col">LOT ID</th>
                  <th scope="col">제품명 / 작업지시</th>
                  <th scope="col" className="number">
                    검사 수량
                  </th>
                  <th scope="col" className="number">
                    합격 / 불합격
                  </th>
                  <th scope="col">LOT 생성일</th>
                  <th scope="col">LOT 상태</th>
                </tr>
              </thead>
              <tbody>
                {/* LOT 데이터 행 메뉴: 행을 클릭하면 상세 drawer가 열림 */}
                {rows.map((lot) => (
                  <tr
                    key={lot.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${lot.lotNo} 상세 보기`}
                    onClick={() => openLotDetail(lot)}
                    onKeyDown={(event) => openLotDetailWithKeyboard(event, lot)}
                  >
                    <td>
                      <LotLink>{lot.lotNo}</LotLink>
                    </td>
                    <td>
                      <ProductName>{lot.productName}</ProductName>
                      <SubText>{lot.workOrderNo}</SubText>
                    </td>
                    <td className="number">
                      {formatNumber.format(lot.inspectionQty)}
                    </td>
                    <td className="number">
                      <Good>{formatNumber.format(lot.goodQty)}</Good>
                      <Divider>/</Divider>
                      <Defect>{formatNumber.format(lot.defectQty)}</Defect>
                    </td>
                    <td>
                      <CreatedDate>
                        {lot.createdDate.replaceAll("-", ". ")}
                      </CreatedDate>
                      <SubText>{lot.createdTime}</SubText>
                    </td>
                    <td>
                      <Status $status={lot.status}>
                        <StatusDot />
                        {lot.status}
                      </Status>
                    </td>
                  </tr>
                ))}
                {/* 조회 결과가 없을 때 보여주는 빈 데이터 안내 메뉴 */}
                {rows.length === 0 && (
                  <tr>
                    <EmptyCell colSpan="6">
                      조회 조건에 맞는 완제품 LOT가 없습니다.
                    </EmptyCell>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableViewport>

          {/* 조회 결과 개수와 페이지 이동 메뉴 */}
          <TableFooter>
            <ResultText>
              전체 {filteredRows.length}건 중{" "}
              {filteredRows.length ? (page - 1) * PAGE_SIZE + 1 : 0}에서{" "}
              {Math.min(page * PAGE_SIZE, filteredRows.length)}까지 표시
            </ResultText>
            <Pagination aria-label="페이지 이동">
              <PageButton
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={page === 1}
              >
                이전
              </PageButton>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (number) => (
                  <PageButton
                    key={number}
                    type="button"
                    $active={page === number}
                    onClick={() => setPage(number)}
                    aria-current={page === number ? "page" : undefined}
                  >
                    {number}
                  </PageButton>
                ),
              )}
              <PageButton
                type="button"
                onClick={() =>
                  setPage((value) => Math.min(pageCount, value + 1))
                }
                disabled={page === pageCount}
              >
                다음
              </PageButton>
            </Pagination>
          </TableFooter>
        </TablePanel>
      </Content>
      {/* 테이블 행 클릭 시 열리는 완제품 LOT 상세 drawer 메뉴 */}
      <FinishedLotDetailDrawer
        lot={selectedLot}
        onClose={() => setSelectedLot(null)}
      />
    </Page>
  );
}

// 아래 styled-components는 이 페이지 전용 스타일
// 완제품 LOT 목록 화면 전체 영역
const Page = styled.main`
  min-height: 100vh;
  padding: 34px 30px 48px;
  background: #f8f8fe;
  color: #172033;
  @media (max-width: 720px) {
    padding: 24px 16px 40px;
  }
`;
// 화면 내용을 가운데 정렬하고 최대 너비를 제한하는 컨테이너
const Content = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
`;
// 페이지 제목/설명과 우측 버튼들을 한 줄에 배치하는 상단 영역
const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
// "완제품 LOT 목록" 같은 페이지 메인 제목에 사용
const Title = styled.h1`
  font-size: 27px;
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: -0.035em;
`;
// 제목 아래 안내 문구에 사용
const Description = styled.p`
  margin-top: 8px;
  color: #687184;
  font-size: 13px;
  line-height: 1.5;
`;
// 초기화, 조회 버튼을 묶는 우측 버튼 영역
const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  @media (max-width: 480px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;
// 초기화/내보내기처럼 기본 동작 버튼에 사용
const ActionButton = styled.button`
  height: 38px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid #cfd5e2;
  border-radius: 7px;
  background: #fff;
  color: #283247;
  font-size: 12px;
  font-weight: 600;
  &:hover {
    background: #f5f7fb;
  }
  &:focus-visible {
    outline: 3px solid rgba(16, 79, 160, 0.18);
  }
`;
// 조회 버튼처럼 가장 중요한 실행 버튼에 사용
const SearchButton = styled(ActionButton)`
  background: #084693;
  border-color: #084693;
  color: #fff;
  min-width: 78px;
  &:hover {
    background: #073b7c;
  }
`;
// LOT 번호, 제품명, 작업지시, 생산일자 검색 조건을 담는 필터 박스
const FilterPanel = styled.form`
  display: grid;
  grid-template-columns:
    minmax(150px, 1fr)
    minmax(150px, 1fr)
    minmax(170px, 1fr)
    minmax(150px, 1fr)
    minmax(150px, 1fr);
  gap: 28px;
  padding: 28px 30px;
  border: 1px solid #cfd5e2;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 1px 2px rgba(35, 50, 80, 0.03);
  @media (max-width: 1050px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 22px 18px;
  }
`;
// 필터 안에서 label과 input/select를 한 세트로 묶는 칸
const Field = styled.div`
  width: 100%;
  min-width: 0;
`;
// 필터 입력칸 위에 붙는 작은 제목
const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  color: #4c566a;
  font-size: 12px;
  font-weight: 600;
`;
// 일반 input/select가 공통으로 쓰는 기본 입력 스타일
const controlStyles = `height: 42px; width: 100%; padding: 0 14px; border: 1px solid #cbd3e1; border-radius: 6px; background: #f8faff; color: #273147; font-size: 12px; outline: none;`;
// LOT 번호 검색처럼 직접 텍스트를 입력하는 칸
const Control = styled.input`
  ${controlStyles} &::placeholder {
    color: #8c95a7;
  }
  &:focus {
    border-color: #2c67ad;
    box-shadow: 0 0 0 3px rgba(44, 103, 173, 0.1);
  }
`;
// 제품명/작업지시 번호처럼 목록에서 선택하는 칸
const Select = styled.select`
  ${controlStyles}
  padding-right: 38px;
  cursor: pointer;

  appearance: none;
  background-color: #f8faff;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23273147' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 12px 8px;

  &:focus {
    border-color: #2c67ad;
    box-shadow: 0 0 0 3px rgba(44, 103, 173, 0.1);
  }
`;
// 실제 날짜 텍스트를 보여주는 입력칸
const DateTextInput = styled.input`
  display: block;
  width: 100%;
  height: 42px;
  padding: 0 4px;

  background: transparent;
  border: 0;
  outline: none;

  color: #5e687a;
  font-size: 11px;
  line-height: 42px;
  box-sizing: border-box;
  text-align: center;

  &::placeholder {
    color: #8c95a7;
    opacity: 1;
  }
`;

// 날짜 검색칸 스타일
const DateBox = styled.div`
  height: 42px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  padding: 0 10px;

  border: 1px solid #cbd3e1;
  border-radius: 6px;
  background: #f8faff;

  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    width: 100%;
    height: 100%;
  }

  .react-datepicker__header {
    padding-top: 8px;
    padding-bottom: 6px;
  }

  .react-datepicker__current-month {
    margin-bottom: 6px;
    font-size: 14px;
  }
`;

// Enter 키로 검색 form이 제출될 수 있게 숨겨둔 submit 버튼
const HiddenSubmit = styled.button`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
`;
// 테이블 전체를 감싸는 카드형 영역
const TablePanel = styled.section`
  margin-top: 26px;
  overflow: hidden;
  border: 1px solid #cfd5e2;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(35, 50, 80, 0.04);
`;
// 화면이 좁을 때 테이블을 가로 스크롤할 수 있게 감싸는 영역
const TableViewport = styled.div`
  overflow-x: auto;
`;
// 완제품 LOT 목록의 실제 표헤더, 행, 숫자 정렬 스타일
const Table = styled.table`
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
  font-size: 12px;

  thead {
    background: #edf3fb;
  }

  thead th {
    height: 52px;
    padding: 0 30px;

    vertical-align: middle;

    background: linear-gradient(180deg, #f2f6fc 0%, #e8eff8 100%);

    color: #233b5d;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
  }

  th + th {
    border-left: 1px solid rgba(184, 198, 218, 0.65);
  }

  th:first-child {
    width: 19%;
  }
  th:nth-child(2) {
    width: 24%;
  }
  th:nth-child(3) {
    width: 13%;
  }
  th:nth-child(4) {
    width: 18%;
  }
  th:nth-child(5) {
    width: 15%;
  }
  th:last-child {
    width: 11%;
  }

  // 숫자 제목은 가운데 정렬
  thead th.number {
    text-align: center;
  }

  // 실제 숫자는 오른쪽 정렬
  tbody td.number {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  td {
    height: 67px;
    padding: 9px 30px;
    border-bottom: 1px solid #d7dce7;
    color: #202a3c;
    vertical-align: middle;
    white-space: nowrap;
  }

  tbody tr:hover {
    background: #fafcff;
  }

  tbody tr[role="button"] {
    cursor: pointer;
  }

  tbody tr[role="button"]:focus-visible {
    outline: 3px solid rgba(16, 79, 160, 0.22);
    outline-offset: -3px;
    background: #fafcff;
  }

  @media (max-width: 1000px) {
    th,
    td {
      padding-left: 18px;
      padding-right: 18px;
    }
  }
`;
// LOT ID 텍스트입니다. 클릭 가능한 행처럼 보이도록 파란색/밑줄 hover
const LotLink = styled.span`
  color: #0756ae;
  font-family: var(--font-family-mono);
  font-size: 12px;
  font-weight: 700;
  tr:hover & {
    text-decoration: underline;
  }
`;
// 테이블의 제품명 텍스트
const ProductName = styled.div`
  color: #2c3548;
  font-weight: 600;
`;
// 제품명 아래 작업지시 번호, 생성 시간처럼 보조 정보를 작게 표시할 때 사용
const SubText = styled.div`
  margin-top: 4px;
  color: #586376;
  font-family: var(--font-family-mono);
  font-size: 10px;
`;
// LOT 생성일 날짜 텍스트
const CreatedDate = styled.div`
  font-size: 11px;
  font-weight: 600;
`;
// 합격 수량을 강조해서 보여주는 숫자 
const Good = styled.span`
  color: #00499c;
  font-weight: 700;
`;
// 합격 수량과 불합격 수량 사이의 '/' 
const Divider = styled.span`
  margin: 0 9px;
  color: #9aa3b2;
`;
// 불합격 수량을 표시하는 숫자 스타일
const Defect = styled.span`
  color: #697286;
`;
// 생산완료/입고완료/검사대기/출하대기 상태 배지
const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 650;
  color: ${({ $status }) =>
    $status === "생산완료" || $status === "입고완료"
      ? "#168853"
      : $status === "출하대기"
        ? "#1767bf"
        : "#7a8495"};
  background: ${({ $status }) =>
    $status === "생산완료" || $status === "입고완료"
      ? "#e5f8ec"
      : $status === "출하대기"
        ? "#e7f1ff"
        : "#eef1f5"};
`;
// 상태 배지 안의 작은 원형 점 부모 색상을 따라감
const StatusDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
`;
// 조회 결과가 없을 때 테이블 가운데 보여주는 빈 상태 셀
const EmptyCell = styled.td`
  height: 150px !important;
  color: #778196 !important;
  text-align: center;
`;
// 테이블 하단의 결과 개수 문구와 페이지 버튼을 담는 영역
const TableFooter = styled.footer`
  min-height: 50px;
  padding: 8px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: #f8f9fc;
  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
    padding: 14px 18px;
  }
`;
// "전체 n건 중..." 결과 안내 문구
const ResultText = styled.p`
  color: #707a8e;
  font-size: 10px;
`;
// 페이지 번호 버튼들을 묶는 영역
const Pagination = styled.nav`
  display: flex;
  gap: 5px;
`;
// 이전/다음/페이지 번호 버튼
const PageButton = styled.button`
  min-width: 34px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid ${({ $active }) => ($active ? "#084693" : "#cbd2df")};
  border-radius: 4px;
  background: ${({ $active }) => ($active ? "#084693" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#3d475a")};
  font-size: 11px;
  &:hover:not(:disabled) {
    border-color: #084693;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
