# MES 프론트엔드 협업 규칙

## 팀 구성

| 이름 | 담당                  |
| ---- | --------------------- |
| 미   | 대시보드              |
| 나   | 품질관리, 리포트/조회 |
| 현   | 기준정보관리          |
| 유   | 생산관리              |
| 상   | 자재/재고관리         |

## 프로젝트 구조

```
src/
├── api/              # axios 레이어 (MesApi.js 등)
├── components/       # 공용 UI 컴포넌트
│   └── ui/            # Button, Badge, Card, DataTable 등 디자인 토큰 기반 공용 컴포넌트
├── context/          # 전역 상태 (Auth 등)
├── pages/
│   ├── monitoring/    # 대시보드 (담당: 미)
│   ├── master/         # 기준정보관리 - 설비/공정/제품/자재/BOM/작업자 (담당: 현)
│   ├── production/     # 생산관리 - 작업지시/LOT (담당: 유)
│   ├── quality/         # 품질관리 - 검사이력/불량관리 (담당: 나)
│   ├── inventory/       # 자재/재고관리 (담당: 상)
│   └── report/          # 리포트/조회 - 생산리포트/Traceability (담당: 나)
├── style/            # GlobalStyle, 디자인 토큰
└── App.js            # 라우터
```

- 페이지 파일은 `목록.js` + `상세.js` 형제 파일로 분리 (예: `MachineList.js`, `MachineDetail.js`)
- 자기 담당 폴더(`pages/{담당그룹}/*`) 안에서만 작업

## Git 브랜치 전략

```
main  ←(PR, 리뷰 후 머지)  dev  ←(PR, 리뷰 후 머지)  feature/{이름}-{기능}
```

- `main`: 배포/발표용, 항상 정상 동작 상태만 유지
- `dev`: 팀 통합 브랜치, 평소 작업은 전부 여기로 모임
- `feature/{이름}-{기능}`: 개인 작업 브랜치, `dev`에서 분기

### 브랜치 네이밍 예시

```
feature/hyun-machine-list
feature/hyun-bom-detail
feature/yu-workorder-list
feature/mi-material-inventory
feature/sang-dashboard
feature/na-defect-log
```

## 커밋 메시지 컨벤션

```
<type>: <설명>
```

| type     | 의미                              |
| -------- | --------------------------------- |
| feat     | 새 기능                           |
| fix      | 버그 수정                         |
| style    | 스타일/포맷 변경 (로직 변경 없음) |
| refactor | 코드 리팩터링                     |
| docs     | 문서 수정                         |
| chore    | 빌드/설정 등 기타                 |

예: `feat: 설비 목록 페이지 테이블 UI 구현`

## PR 규칙

- PR 대상 브랜치: `dev`
- PR 제목: `[담당그룹] 작업 내용 요약` (예: `[기준정보관리] 설비 목록/상세 페이지`)

## 공용 파일 수정 규칙

아래 파일은 여러 명이 동시에 건드리면 충돌이 잦으므로, **수정 전 팀 채널에 미리 공지**:

- `App.js` (라우터)
- `api/MesApi.js` (공용 API 함수 모음)
- `components/ui/*` (공용 컴포넌트)
- `style/GlobalStyle.js`, 디자인 토큰 파일
