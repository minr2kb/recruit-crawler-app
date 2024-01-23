# 설치가 필요한 도구

-   node.js

# 기본 세팅

-   아래의 커멘드를 통해 의존성을 설치해주세요

```
> npm i
```

# 실행

-   아래의 커맨드를 실행시 크롤링이 시작됩니다.

```
> npm run start
```

# 결과 가져오기

-   모든 결과물은 csv파일로 저장되며, /results 디렉토리에 모입니다.
-   파일명 형식은 {플랫폼이름}\_{포지션}.csv 입니다.
-   전체가 모인 파일명은 RECRUITS_ALL.csv 입니다.

# Config

### 개월 수 변경

-   config.js의 month를 수정해주세요.

### 특정 사이트만 크롤링

-   config.js의 sites 에서 원하지 않는 사이트 부분을 주석처리 해주신 후 실행해주세요.

### 특정 사이트의 특정 포지션만 크롤링

-   config.js의 positions 에서 해당 사이트 내의 불필요한 포지션 부분을 주석처리 해주신 후 실행해주세요. (값으로 있는 숫자는 고유한 카테고리 숫자값이므로 건드리지 않으시는걸 추천합니다)

### 특정 필드만 크롤링

-   config.js의 headers 에서 불필요한 필드 부분을 주석처리 해주신 후 실행해주세요. 한국어 value 변경시 csv의 헤더 이름이 변경됩니다.

# 참고사항

-   아주 가끔 사이트의 서버 과부화로 접속이 차단당할 수 있으니, 그럴 땐 어느정도 시간이 지난 후 다시 시도해주세요.