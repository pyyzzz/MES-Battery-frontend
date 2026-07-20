import { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import styled from "styled-components";

const HeaderContainer = styled.header`
  height: 45px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 28px;
  border-bottom: 1px solid #e8ebf0;
  background: #ffffff;
`;

const RightSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Clock = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-right: 18px;
  border-right: 1px solid #e5e8ed;
  white-space: nowrap;
`;

const DateText = styled.span`
  color: #8a94a6;
  font-size: 12px;
  font-weight: 500;
`;

const TimeText = styled.time`
  min-width: 70px;
  color: #253047;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const NotificationButton = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #596579;
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease;

  &:hover {
    background: #f1f5f9;
    color: #2563eb;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 7px;
  right: 7px;
  width: 8px;
  height: 8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #ef4444;
`;

const NotificationPanel = styled.div`
  position: absolute;
  top: calc(100% + 14px);
  right: 0;
  z-index: 1200;
  width: 320px;
  overflow: hidden;
  border: 1px solid #e5e8ed;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
`;

const NotificationHeader = styled.div`
  padding: 15px 16px 12px;
  border-bottom: 1px solid #eef0f3;
  color: #172033;
  font-size: 14px;
  font-weight: 700;
`;

const NotificationItem = styled.div`
  padding: 13px 16px;
  border-bottom: 1px solid #f0f2f5;

  &:last-child {
    border-bottom: 0;
  }
`;

const NotificationTitle = styled.div`
  color: #334155;
  font-size: 13px;
  font-weight: 600;
`;

const NotificationTime = styled.div`
  margin-top: 5px;
  color: #94a3b8;
  font-size: 11px;
`;

const EmptyNotification = styled.div`
  padding: 28px 16px;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
`;

const NOTIFICATIONS = [
  { id: 1, title: "새로운 작업 지시가 등록되었습니다.", time: "방금 전" },
  { id: 2, title: "설비 점검 예정 시간이 다가옵니다.", time: "10분 전" },
  { id: 3, title: "재고 부족 품목을 확인해 주세요.", time: "30분 전" },
];

export default function Header() {
  const [now, setNow] = useState(() => new Date());
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const date = now.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  const time = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <HeaderContainer>
      <RightSection ref={notificationRef}>
        <Clock>
          <DateText>{date}</DateText>
          <TimeText dateTime={now.toISOString()}>{time}</TimeText>
        </Clock>

        <NotificationButton
          type="button"
          aria-label="알림 열기"
          aria-expanded={notificationOpen}
          onClick={() => setNotificationOpen((prev) => !prev)}
        >
          <FiBell size={19} />
          <NotificationDot />
        </NotificationButton>

        {notificationOpen && (
          <NotificationPanel>
            <NotificationHeader>알림</NotificationHeader>
            {NOTIFICATIONS.length > 0 ? (
              NOTIFICATIONS.map((notification) => (
                <NotificationItem key={notification.id}>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationTime>{notification.time}</NotificationTime>
                </NotificationItem>
              ))
            ) : (
              <EmptyNotification>새로운 알림이 없습니다.</EmptyNotification>
            )}
          </NotificationPanel>
        )}
      </RightSection>
    </HeaderContainer>
  );
}
