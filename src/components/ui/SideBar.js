// MES 전체 좌측 네비게이션 - 6개 그룹 아코디언 메뉴, activeItem으로 현재 위치 표시
import { useState } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  FiGrid,
  FiDatabase,
  FiActivity,
  FiClipboard,
  FiArchive,
  FiBarChart2,
  FiChevronRight,
} from "react-icons/fi";

const MENU_ITEMS = [
  { key: "대시보드", label: "대시보드", icon: FiGrid, path: "/mes/dashboard" },
  {
    key: "기준정보관리",
    label: "기준정보관리",
    icon: FiDatabase,
    children: [
      { key: "공정", label: "공정", path: "/mes/master/process" },
      { key: "작업자", label: "작업자", path: "/mes/master/worker" },
      { key: "설비", label: "설비", path: "/mes/master/machine" },
      { key: "BOM", label: "BOM", path: "/mes/master/bom" },
      { key: "자재", label: "자재", path: "/mes/master/material" },
      { key: "제품", label: "제품", path: "/mes/master/product" },
    ],
  },
  {
    key: "생산관리",
    label: "생산관리",
    icon: FiActivity,
    children: [
      { key: "작업지시", label: "작업지시", path: "/mes/production/workorders" },
      { key: "완제품LOT", label: "완제품LOT", path: "/mes/production/product-lot" },
    ],
  },
  { key: "품질관리", label: "품질관리", icon: FiClipboard, path: "/mes/quality/test-log" },
  {
    key: "자재/재고관리",
    label: "자재/재고관리",
    icon: FiArchive,
    children: [
      { key: "자재재고", label: "자재재고", path: "/mes/inventory/material-list" },
      { key: "자재입출고이력", label: "자재입출고이력", path: "/mes/inventory/material-tx" },
      { key: "원료LOT", label: "원료LOT", path: "/mes/inventory/material-lot" },
    ],
  },
  { key: "리포트", label: "리포트 (Traceability)", icon: FiBarChart2, path: "/mes/report/trace" },
];

const Container = styled.aside`
  width: 260px;
  min-height: 100vh;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  padding: 25px 0 24px;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  padding: 0 24px 0px;
  margin-bottom: 30px;
  align-items: center;
  filter: drop-shadow(0 0 4px rgba(255,255,255,.2));

  .eum {
    color: rgba(255,255,255,.92);
  }
  p {
    margin-top: 12px;
    color: rgba(255,255,255,.92);
    font-weight: 600;
    letter-spacing: 2px;
    text-align: center;
    filter: drop-shadow(0 0 4px rgba(255,255,255,.2));
    /* margin-left: 3px; */
  }
`;

const SidebarDivider = styled.div`
  width: calc(100% - 48px);
  height: 1px;
  margin: 0 auto 27px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.36),
    transparent
  );
`;

const SidebarLogo = styled.img`
  display: block;
  width: 110px;
  height: auto;
  object-fit: contain;
  /* filter:
        drop-shadow(0.1px 0 0 #fff)
        drop-shadow(-0.1px 0 0 #fff)
        drop-shadow(0 0.3px 0 #fff)
        drop-shadow(0 -0.3px 0 #fff); */
  filter: brightness(1.18);
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px;
  overflow-y: auto;
`;

const activeAccent = css`
  background: rgba(37, 99, 235, 0.22);
  color: var(--color-text-inverse);
  border-left-color: var(--sidebar-active);
`;

const rowBase = css`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-md);
  border-left: 2px solid transparent;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--sidebar-text);
  background: transparent;
  text-align: left;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  ${(props) => props.$active && activeAccent}
`;

const GroupButton = styled.button`
  ${rowBase}
`;

const GroupLink = styled(Link)`
  ${rowBase}
`;

const GroupLabel = styled.span`
  flex: 1;
`;

const Chevron = styled(FiChevronRight)`
  margin-left: auto;
  color: var(--sidebar-text-muted);
  transition: transform 0.2s ease;
  transform: rotate(${(props) => (props.$open ? "90deg" : "0deg")});
`;

const SubMenuWrap = styled.div`
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.22s ease, opacity 0.16s ease;

  ${(props) =>
    props.$open &&
    css`
      grid-template-rows: 1fr;
      opacity: 1;
    `}
`;

const SubMenu = styled.div`
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 2px 0 4px 43px;
`;

const SubMenuItem = styled(Link)`
  display: block;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border-left: 2px solid transparent;
  font-size: var(--font-size-sm);
  color: var(--sidebar-text-muted);
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    color: var(--sidebar-text);
  }

  ${(props) =>
    props.$active &&
    css`
      ${activeAccent}
      font-weight: var(--font-weight-medium);
    `}
`;

export default function SideBar({ activeItem }) {
  const defaultOpenGroup = MENU_ITEMS.find((item) =>
    item.children?.some((child) => child.key === activeItem)
  )?.key;

  const [openGroups, setOpenGroups] = useState(
    defaultOpenGroup ? [defaultOpenGroup] : []
  );

  const toggleGroup = (key) => {
    setOpenGroups((prev) =>
      prev.includes(key)
        ? prev.filter((groupKey) => groupKey !== key)
        : [...prev, key]
    );
  };

  return (
    <Container>
      <LogoSection>
        <SidebarLogo
          src="/eum-battery-sidebar-logo.png"
          alt="이음 Battery"
        />
        <p><span className="eum">EUM</span> Battery</p>
      </LogoSection>

      <SidebarDivider />

      <Nav>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;

          if (!item.children) {
            return (
              <GroupLink key={item.key} to={item.path} $active={activeItem === item.key}>
                <Icon size={18} />
                <GroupLabel>{item.label}</GroupLabel>
              </GroupLink>
            );
          }

          const isOpen = openGroups.includes(item.key);

          return (
            <div key={item.key}>
              <GroupButton type="button" onClick={() => toggleGroup(item.key)}>
                <Icon size={18} />
                <GroupLabel>{item.label}</GroupLabel>
                <Chevron size={16} $open={isOpen} />
              </GroupButton>

              <SubMenuWrap $open={isOpen}>
                <SubMenu>
                  {item.children.map((child) => (
                    <SubMenuItem
                      key={child.key}
                      to={child.path}
                      $active={activeItem === child.key}
                    >
                      {child.label}
                    </SubMenuItem>
                  ))}
                </SubMenu>
              </SubMenuWrap>
            </div>
          );
        })}
      </Nav>

    </Container>
  );
}
