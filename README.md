# Phaser-Practice

Phaser-Practice

https://foocojun.github.io/Phaser-Practice/

## 강의 f/u

### 현재까지 분기

- 경험치 적용 방식 변경 (Ui 중심 -> Player 중심)
  - 강의
  - 선언
    - expBar가 exp, maxExp을 가지고 있음.
    - topBar가 level을 가지고 있음.
    - PlayingScene가 pickExpUp 메서드를 가지고 있음.
    - expBar 생성 시 초기값 상수 exp = 0, maxExp = 50 사용
    - topBar 생성 시 초기값 상수 level = 1 사용
  - 흐름
    - PlayingScene가 플레이어와 경험치아이템 중첩 시 pickExpUp 작동.
    - expBar의 경험치 상승 및 드로우
      - 경험치 가득차면 topBar의 레벨업 작동
        - topBar의 레벨 상승 및 드로우
  - 특징
    - 게임 단위의 로직 작성 대표적인 아케이드 게임 형식
  - 변경 후
  - 선언
    - player가 exp, maxExp, level, pickExpUp을 가지고 있음.
    - expBar 생성 시 player의 exp, maxExp 값 사용
    - topBar 생성 시 player의 level 값 사용
  - 흐름
    - PlayingScene가 플레이어와 경험치아이템 중첩 시 player의 pickExpUp을 작동.
    - expUp의 경험치 량 만큼 플레이어의 exp 증가 및 maxExp 초과시 레벨업.
      - exp 증가 시 expBar를 업데이트 함.
      - level 증가 시 expBar와 topBar를 업데이트 함.
  - 특징
    - player 중심의 확장성 확보
    - **나중에 저장된 Player 비동기 호출 하고싶단 말이에요..**

### 리팩토링

- 예정
