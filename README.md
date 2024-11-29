# recruit-crawler-app

- Electron + React + Vite + TS로 구성된 채용공고 크롤러 앱 입니다.
- ipc통신을 통해 로컬 접근 환경과 자체 node 서버 환경에서의 크롤러 구성이 가능합니다.
- electron-updater를 통해 새로운 release마다 자동 업데이트를 지원합니다.
- [크롤링 서버 레포](https://github.com/minr2kb/recruit-crawler-back)
<img width="1376" alt="스크린샷 2024-03-16 01 35 37" src="https://github.com/minr2kb/recruit-crawler-app/assets/77144827/96ce7118-e213-4efb-aa1e-01d744582a78">

## 지원 서비스
- 잡코리아
- 잡플래닛
- 원티드
- 리멤버
- 점핏
- 프로그래머스

## 사용법
0. 최신 release 에서 운영체제에 맞는 파일을 설치해줍니다.

1. 서버가 실행중인지 확인 후, Config에서 공고 날짜 범위, 필드를 선택해줍니다.

2. Platforms에서 원하는 플랫폼의 우측 토글 버튼을 눌러 선택해줍니다.

3. 각 플랫폼 블럭을 클릭하여 설정을 여닫을 수 있습니다.

4. 추가하기 버튼을 클릭하여 원하는 직무를 모두 선택해줍니다.

5. 우측 Result에 추가된 플랫폼과 직무를 확인합니다.

6. START를 클릭 하여 크롤링을 진행합니다.

7. 각 직무 chip을 클릭시 직무별 csv를, 아래 다운 버튼 클릭시 플랫폼 단위로 다운로드 가능합니다.

8. 크롤링 도중, STOP을 클릭하여 크롤링을 중지할 수 있습니다.

### 기타 feature

- 크롤링 중 결과가 없거나 문제 발생시 직무 chip에 에러 인디케이터가 표시됩니다.

- 원티드의 경우, 공고 날짜가 지원되지 않아 전체 공고 크롤링을 진행합니다.

- 모든 요청은 기존적으로 병렬로 이루어지되, 서버 과부하 방지를 위해 5개 초과 카테고리는 동기 요청이 이루어집니다. 따라서 크롤링 속도가 느릴 수 있습니다. (플랫폼 이름 옆 SYNC/ASYNC 표시)


## 프로젝트 셋팅


### Install

```bash
$ yarn
```

### Development

```bash
$ yarn dev
```

### Build

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```

### Deploy
```bash
$ yarn deploy
```
