import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiAlertTriangle,
  FiEdit3,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";

import Pagination from "../../components/ui/Pagination";
import SearchFilterBar from "../../components/ui/SearchFilterBar";
import SummaryCard from "../../components/ui/SummaryCard";

const INITIAL_LOTS = [
  { id: 12, inboundAt: "2026-02-09 17:49", status: "WAITING", lotNo: "ML-2602091749-4", materialCode: "MAT-20260209-0004", materialName: "분리판", unit: "EA", totalStock: 50, consumed: 0, updatedAt: "2026-02-09 17:49:49" },
  { id: 11, inboundAt: "2026-02-09 17:04", status: "WAITING", lotNo: "ML-2602091704-INIT", materialCode: "MAT-20260209-170423", materialName: "하드케이스", unit: "EA", totalStock: 100, consumed: 0, updatedAt: "2026-02-09 17:04:23" },
  { id: 10, inboundAt: "2026-02-09 16:00", status: "WAITING", lotNo: "ML-2602091600-INIT", materialCode: "MAT-20260209-160043", materialName: "포장지", unit: "EA", totalStock: 1000, consumed: 0, updatedAt: "2026-02-09 16:00:43" },
  { id: 9, inboundAt: "2026-02-08 15:57", status: "WAITING", lotNo: "ML-260208-0009-INIT", materialCode: "MAT-20260209-0009", materialName: "라벨", unit: "EA", totalStock: 600, consumed: 540, updatedAt: "2026-02-10 15:20:11" },
  { id: 8, inboundAt: "2026-02-08 15:57", status: "WAITING", lotNo: "ML-260208-0008-INIT", materialCode: "MAT-20260209-0008", materialName: "단자", unit: "EA", totalStock: 1200, consumed: 1198, updatedAt: "2026-02-10 15:20:05" },
  { id: 7, inboundAt: "2026-02-08 15:57", status: "WAITING", lotNo: "ML-260208-0007-INIT", materialCode: "MAT-20260209-0007", materialName: "커버", unit: "EA", totalStock: 600, consumed: 599, updatedAt: "2026-02-10 15:19:58" },
  { id: 6, inboundAt: "2026-02-08 15:57", status: "WAITING", lotNo: "ML-260208-0006-INIT", materialCode: "MAT-20260209-0006", materialName: "케이스", unit: "EA", totalStock: 600, consumed: 599, updatedAt: "2026-02-10 15:19:54" },
  { id: 5, inboundAt: "2026-02-08 15:57", status: "WAITING", lotNo: "ML-260208-0005-INIT", materialCode: "MAT-20260209-0005", materialName: "전해액", unit: "L", totalStock: 1800, consumed: 1328, updatedAt: "2026-02-10 15:19:48" },
  { id: 4, inboundAt: "2026-02-08 15:57", status: "WAITING", lotNo: "ML-260208-0004-INIT", materialCode: "MAT-20260209-0004", materialName: "분리판", unit: "EA", totalStock: 7600, consumed: 6282, updatedAt: "2026-02-10 15:19:42" },
  { id: 3, inboundAt: "2026-02-08 15:57", status: "WAITING", lotNo: "ML-260208-0003-INIT", materialCode: "MAT-20260209-0003", materialName: "음극판", unit: "EA", totalStock: 3800, consumed: 3377, updatedAt: "2026-02-10 15:19:35" },
  { id: 2, inboundAt: "2026-02-08 15:57", status: "WAITING", lotNo: "ML-260208-0002-INIT", materialCode: "MAT-20260209-0002", materialName: "양극판", unit: "EA", totalStock: 3800, consumed: 3377, updatedAt: "2026-02-10 15:19:31" },
  { id: 1, inboundAt: "2026-02-08 15:57", status: "WAITING", lotNo: "ML-260208-0001-INIT", materialCode: "MAT-20260209-0001", materialName: "납(Pb)", unit: "KG", totalStock: 5400, consumed: 4299, updatedAt: "2026-02-10 15:19:25" },
];

const STATUS_META = {
  WAITING: { label: "생산 대기", color: "#ad7000", background: "#fff5df" },
  IN_USE: { label: "생산중(투입)", color: "#16925a", background: "#e8f8ef" },
  DEFECT: { label: "품절/불량", color: "#d94852", background: "#fdecee" },
};

const formatNumber = (value) => Number(value).toLocaleString();

const Page = styled.div`min-height: 100%; padding: 28px 32px 44px; box-sizing: border-box; background: #f7f8fa;`;
const Header = styled.header`margin-bottom: 22px;`;
const Title = styled.h1`margin: 0; color: #17191d; font-size: 30px; font-weight: 650; letter-spacing: -0.8px;`;
const Description = styled.p`margin: 7px 0 0; color: #818896; font-size: 14px;`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  @media (max-width: 1050px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 620px) { grid-template-columns: 1fr; }
`;

const LotSummaryCard = styled(SummaryCard)`flex-direction: row; align-items: center;`;

const Panel = styled.section`padding: 20px 22px; background: #fff; border: 1px solid #dce1ea; border-radius: 12px;`;
const PanelTitle = styled.h2`margin: 0 0 14px; color: #292d35; font-size: 16px; font-weight: 600;`;
const FilterPanel = styled(Panel)`margin-bottom: 20px;`;
const TablePanel = styled.section`overflow: hidden; background: #fff; border: 1px solid #dce1ea; border-radius: 12px;`;
const TableTop = styled.div`min-height: 62px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e6ed;`;
const ResultText = styled.span`color: #737b88; font-size: 13px; strong { color: #0755d9; }`;
const TableScroll = styled.div`width: 100%; overflow-x: auto;`;

const Table = styled.table`
  width: 100%; min-width: 1120px; border-collapse: collapse; table-layout: fixed;
  th, td { padding: 12px 14px; border-bottom: 1px solid #e3e7ed; font-size: 13px; text-align: center; vertical-align: middle; }
  th { background: #f1f3f6; color: #535b68; font-weight: 600; }
  td { color: #252a32; }
  tbody tr { cursor: pointer; transition: background 0.15s ease; }
  tbody tr:hover { background: #f6f9ff; }
  tbody tr:last-child td { border-bottom: 0; }
`;

const StatusBadge = styled.span`
  min-width: 92px; padding: 5px 10px; display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  box-sizing: border-box; border-radius: 999px; color: ${({ $status }) => STATUS_META[$status].color};
  background: ${({ $status }) => STATUS_META[$status].background}; font-size: 12px; font-weight: 600;
`;

const LotNumber = styled.strong`color: #174b9c; font-weight: 600;`;

const RateCell = styled.div`display: flex; align-items: center; justify-content: center; gap: 10px;`;
const RateTrack = styled.span`width: 70px; height: 7px; overflow: hidden; flex-shrink: 0; background: #e7e9ed; border-radius: 999px;`;
const RateFill = styled.span`display: block; width: ${({ $rate }) => `${Math.min(100, $rate)}%`}; height: 100%; background: ${({ $rate }) => $rate >= 95 ? "#ef4444" : "#0755d9"}; border-radius: inherit;`;
const RateText = styled.span`min-width: 42px; color: #535b68; font-size: 12px;`;
const PaginationArea = styled.div`border-top: 1px solid #e2e6ed;`;

const Overlay = styled.div`position: fixed; inset: 0; z-index: 900; background: rgba(17, 24, 39, 0.46);`;
const Drawer = styled.aside`
  position: fixed; top: 0; right: ${({ $open }) => $open ? "0" : "-600px"}; z-index: 901; width: 600px; max-width: 100%; height: 100vh;
  display: flex; flex-direction: column; background: #f8f9fb; border-left: 1px solid #d8dee9; box-shadow: -8px 0 28px rgba(15, 23, 42, 0.16); transition: right 0.25s ease;
`;
const DrawerHeader = styled.header`min-height: 70px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; background: #fff; border-bottom: 1px solid #dfe3eb;`;
const DrawerTitle = styled.h2`margin: 0; color: #20252d; font-size: 19px;`;
const CloseButton = styled.button`width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 0; border-radius: 8px; background: transparent; color: #505968; cursor: pointer; &:hover { background: #eef1f5; }`;
const DrawerBody = styled.div`flex: 1; overflow-y: auto; padding: 22px 24px 32px;`;
const Section = styled.section`margin-bottom: 22px;`;
const SectionTitle = styled.h3`margin: 0 0 12px; padding-left: 10px; border-left: 3px solid #0755d9; color: #252a32; font-size: 15px;`;
const DetailCard = styled.div`padding: 18px; background: #fff; border: 1px solid #dfe4eb; border-radius: 10px;`;
const DetailGrid = styled.div`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 24px;`;
const DetailItem = styled.div`min-width: 0; ${({ $full }) => $full && "grid-column: 1 / -1;"}`;
const DetailLabel = styled.span`display: block; margin-bottom: 6px; color: #858d99; font-size: 12px;`;
const DetailValue = styled.strong`color: #252a32; font-size: 14px; font-weight: 600; overflow-wrap: anywhere;`;

const MiniTable = styled.table`
  width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 8px;
  th, td { padding: 10px 12px; border-bottom: 1px solid #e2e6ed; font-size: 12px; text-align: left; }
  th { background: #eef1f5; color: #59616e; }
  td { background: #fff; color: #2d333b; }
`;

function MaterialLotManagement() {
  const [lots] = useState(INITIAL_LOTS);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", status: "", keyword: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLot, setSelectedLot] = useState(null);
  const itemsPerPage = 8;

  const summary = useMemo(() => ({
    total: lots.length,
    inUse: lots.filter((lot) => lot.status === "IN_USE").length,
    waiting: lots.filter((lot) => lot.status === "WAITING").length,
    defect: lots.filter((lot) => lot.status === "DEFECT").length,
  }), [lots]);

  const filteredLots = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    return lots.filter((lot) => {
      const date = lot.inboundAt.slice(0, 10);
      return (!filters.startDate || date >= filters.startDate)
        && (!filters.endDate || date <= filters.endDate)
        && (!filters.status || lot.status === filters.status)
        && (!keyword || [lot.lotNo, lot.materialName, lot.materialCode].some((value) => value.toLowerCase().includes(keyword)));
    });
  }, [lots, filters]);

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLots.slice(start, start + itemsPerPage);
  }, [filteredLots, currentPage]);

  const changeFilters = (values) => { setFilters(values); setCurrentPage(1); };
  const getRate = (lot) => lot.totalStock > 0 ? Number(((lot.consumed / lot.totalStock) * 100).toFixed(1)) : 0;
  const getRemaining = (lot) => Math.max(0, lot.totalStock - lot.consumed);

  return <>
    <Page>
      <Header><Title>원료 LOT 관리</Title><Description>자재 LOT별 입고, 생산 투입 및 소진 현황을 추적하고 관리합니다.</Description></Header>

      <SummaryGrid>
        <LotSummaryCard height={116} padding={18} gap={14} icon={<FiEdit3 />} iconBoxSize={50} iconSize={24} iconBackground="#e8efff" iconColor="#0755d9" title="전체 LOT" titleFontSize={13} value={summary.total} valueFontSize={25} />
        <LotSummaryCard height={116} padding={18} gap={14} icon={<FiRefreshCw />} iconBoxSize={50} iconSize={24} iconBackground="#e8f8ef" iconColor="#18a860" title="생산중(투입)" titleFontSize={13} value={summary.inUse} valueFontSize={25} />
        <LotSummaryCard height={116} padding={18} gap={14} icon={<span style={{ fontSize: 23 }}>⌛</span>} iconBoxSize={50} iconSize={24} iconBackground="#fff5df" iconColor="#e39400" title="대기중" titleFontSize={13} value={summary.waiting} valueFontSize={25} />
        <LotSummaryCard height={116} padding={18} gap={14} icon={<FiAlertTriangle />} iconBoxSize={50} iconSize={24} iconBackground="#fdecee" iconColor="#e34b55" title="품절/불량" titleFontSize={13} value={summary.defect} valueFontSize={25} />
      </SummaryGrid>

      <FilterPanel>
        <PanelTitle>원료 LOT 검색</PanelTitle>
        <SearchFilterBar
          defaultValues={filters}
          startDateLabel="시작일"
          endDateLabel="종료일"
          dateWidth={145}
          filters={[{ name: "status", label: "LOT 상태", placeholder: "전체 상태", width: 160, options: [
            { value: "WAITING", label: "생산 대기" }, { value: "IN_USE", label: "생산중(투입)" }, { value: "DEFECT", label: "품절/불량" },
          ] }]}
          keywordLabel="통합 검색"
          keywordPlaceholder="LOT번호 / 자재명 / 자재코드 검색"
          keywordWidth={320}
          flexWrap="nowrap"
          inputHeight={38}
          padding={0}
          border="none"
          showSearchButton={false}
          resetButtonText="초기화"
          onChange={changeFilters}
        />
      </FilterPanel>

      <TablePanel>
        <TableTop><PanelTitle style={{ margin: 0 }}>원료 LOT 현황</PanelTitle><ResultText>조회 결과 <strong>{filteredLots.length}</strong>건</ResultText></TableTop>
        <TableScroll><Table>
          <thead><tr><th style={{ width: 48 }}>No</th><th style={{ width: 145 }}>입고일자</th><th style={{ width: 115 }}>LOT 상태</th><th style={{ width: 190 }}>LOT번호</th><th style={{ width: 190 }}>자재코드</th><th>자재명</th><th style={{ width: 90 }}>총 재고</th><th style={{ width: 90 }}>생산투입</th><th style={{ width: 150 }}>자재 소진율</th></tr></thead>
          <tbody>{currentRows.map((lot) => { const rate = getRate(lot); return <tr key={lot.id} onClick={() => setSelectedLot(lot)}>
            <td>{lot.id}</td><td>{lot.inboundAt}</td><td><StatusBadge $status={lot.status}><span>⌛</span>{STATUS_META[lot.status].label}</StatusBadge></td>
            <td><LotNumber>{lot.lotNo}</LotNumber></td><td>{lot.materialCode}</td><td>{lot.materialName}</td><td>{formatNumber(lot.totalStock)}</td><td>{formatNumber(lot.consumed)}</td>
            <td><RateCell><RateTrack><RateFill $rate={rate} /></RateTrack><RateText>{rate}%</RateText></RateCell></td>
          </tr>; })}</tbody>
        </Table></TableScroll>
        <PaginationArea><Pagination currentPage={currentPage} totalItems={filteredLots.length} itemsPerPage={itemsPerPage} visiblePages={5} height={66} background="#f5f6f8" borderTop="none" onPageChange={setCurrentPage} /></PaginationArea>
      </TablePanel>
    </Page>

    {selectedLot && <Overlay onClick={() => setSelectedLot(null)} />}
    <Drawer $open={Boolean(selectedLot)}>{selectedLot && <>
      <DrawerHeader><DrawerTitle>원료 LOT 상세 조회</DrawerTitle><CloseButton type="button" aria-label="상세 닫기" onClick={() => setSelectedLot(null)}><FiX size={22} /></CloseButton></DrawerHeader>
      <DrawerBody>
        <Section><SectionTitle>LOT 정보</SectionTitle><DetailCard><DetailGrid>
          <DetailItem $full><DetailLabel>LOT 번호</DetailLabel><DetailValue>{selectedLot.lotNo}</DetailValue></DetailItem>
          <DetailItem><DetailLabel>LOT 상태</DetailLabel><StatusBadge $status={selectedLot.status}><span>⌛</span>{STATUS_META[selectedLot.status].label}</StatusBadge></DetailItem>
          <DetailItem><DetailLabel>최초 입고일</DetailLabel><DetailValue>{selectedLot.inboundAt}</DetailValue></DetailItem>
        </DetailGrid></DetailCard></Section>
        <Section><SectionTitle>자재 정보</SectionTitle><DetailCard><DetailGrid>
          <DetailItem $full><DetailLabel>자재코드</DetailLabel><DetailValue>{selectedLot.materialCode}</DetailValue></DetailItem>
          <DetailItem><DetailLabel>자재명</DetailLabel><DetailValue>{selectedLot.materialName}</DetailValue></DetailItem>
          <DetailItem><DetailLabel>단위</DetailLabel><DetailValue>{selectedLot.unit}</DetailValue></DetailItem>
        </DetailGrid></DetailCard></Section>
        <Section><SectionTitle>재고 현황</SectionTitle><DetailCard><DetailGrid>
          <DetailItem><DetailLabel>총 입고 수량</DetailLabel><DetailValue>{formatNumber(selectedLot.totalStock)} {selectedLot.unit}</DetailValue></DetailItem>
          <DetailItem><DetailLabel>생산 투입량</DetailLabel><DetailValue>{formatNumber(selectedLot.consumed)} {selectedLot.unit}</DetailValue></DetailItem>
          <DetailItem><DetailLabel>현재고</DetailLabel><DetailValue>{formatNumber(getRemaining(selectedLot))} {selectedLot.unit}</DetailValue></DetailItem>
          <DetailItem><DetailLabel>소진율</DetailLabel><DetailValue>{getRate(selectedLot)}%</DetailValue></DetailItem>
        </DetailGrid></DetailCard></Section>
        <Section><SectionTitle>투입 이력</SectionTitle>
          <MiniTable><thead><tr><th>일시</th><th>제품 LOT</th><th>수량</th></tr></thead><tbody>
            {selectedLot.consumed > 0 ? <tr><td>{selectedLot.updatedAt}</td><td>LOT-20260210-005</td><td>{formatNumber(selectedLot.consumed)} {selectedLot.unit}</td></tr> : <tr><td colSpan="3" style={{ textAlign: "center", color: "#8a929e" }}>투입 이력이 없습니다.</td></tr>}
          </tbody></MiniTable>
        </Section>
        <Section><SectionTitle>최근 상태 변경일</SectionTitle><DetailCard><DetailValue>{selectedLot.updatedAt}</DetailValue></DetailCard></Section>
      </DrawerBody>
    </>}</Drawer>
  </>;
}

export default MaterialLotManagement;
