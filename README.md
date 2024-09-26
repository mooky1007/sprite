# Sprite.js

스프라이트 애니메이션 및 아이콘 스프라이트 관리를 위한 자바스크립트 클래스입니다.  
프레임을 수동으로 설정하거나 스프라이트 애니메이션을 간편하게 재생할 수 있습니다.

[데모 페이지](https://mooky1007.github.io/sprite.js/)

## Todo

-   애니메이션 재시작 딜레이, 반복 횟수
-   애니메이션용 - 아이템 클래스 생성

## 기능

-   **수동 프레임 관리**: `setIdx`를 사용하여 정적 스프라이트나 아이콘을 관리할 수 있습니다.
-   **애니메이션 제어**: 지정된 프레임 범위에서 애니메이션을 재생할 수 있습니다.
-   **속도 제어**: `increaseSpeed`와 `decreaseSpeed` 메서드로 애니메이션 속도를 조절할 수 있습니다.
-   **일시정지 & 재개**: 애니메이션을 쉽게 일시정지하거나 다시 시작할 수 있습니다.
-   **개발자 모드**: `dev` 모드를 통해 디버깅에 필요한 자세한 로그를 확인할 수 있습니다.

## 설치

프로젝트에 `Sprite` 클래스를 직접 포함하여 사용할 수 있습니다.

```html
<script src="path-to-sprite-class.js"></script>
```

## 사용 예시

```js
// 스프라이트 클래스 사용 예시
const sprite = new Sprite('sprite.png', [4, 4], {
    frame: 24,
    loop: true,
    targetClass: '.sprite-container',
    dev: true,
    initialFrame: 0,
});

// 애니메이션 재생
sprite.play(0, 15);

// 특정 프레임으로 아이콘 변경
sprite.setIdx(5);

// 속도 조절
sprite.increaseSpeed();
sprite.decreaseSpeed();

// 일시정지 및 재개
sprite.pause();
sprite.start();
```

## 옵션

-   `frame`: 초당 프레임 수 (기본값: 30)
-   `loop`: 애니메이션 반복 여부 (기본값: false)
-   `targetClass`: 애니메이션이 삽입될 DOM 요소 클래스 (기본값: `body`)
-   `dev`: 개발자 모드 활성화 여부 (기본값: false)
-   `initialFrame`: 초기 프레임 설정 (기본값: 0)
-   `offset`: [top, right, bottom, left] 스프라이트 이미지의 offset 설정

## 메서드

-   `play(start, end)`: 지정된 프레임 범위로 애니메이션을 재생합니다.
-   `setIdx(idx)`: 해당 인덱스의 프레임을 수동으로 표시합니다.
-   `increaseSpeed()`: 애니메이션 속도를 증가시킵니다.
-   `decreaseSpeed()`: 애니메이션 속도를 감소시킵니다.
-   `pause()`: 애니메이션을 일시정지합니다.
-   `start()`: 일시정지된 애니메이션을 재개합니다.
-   `stop()`: 애니메이션을 완전히 멈춥니다.
