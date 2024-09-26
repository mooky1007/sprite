# Sprite.js

스프라이트 애니메이션 및 아이콘 스프라이트 관리를 위한 자바스크립트 클래스입니다.  
프레임을 수동으로 설정하거나 스프라이트 애니메이션을 간편하게 재생할 수 있습니다.

#### 09.26

-   각각의 스프라이트마다 이미지를 로드해오는 방식이 성능상 안좋게 느껴짐.
    예를들어, 10개의 아이콘이 있는 스프라이트 파일을 사용 할 경우, 이미지를 10번 로드해와야 하므로
    1번만 로드 후 로드 된 스프라이트 객체에서 개별로 이미지를 적용시켜주는 방식으로 수정해야 할듯.

## Todo
-   입력된 영역에 꽉 채워지는 가변 이미지 적용 예시.
-   하나의 class에서 preload를 구현해볼것.
-   만든 다음엔 어떤식으로 운영할지?..
-   애니메이션 효과 reverse 효과, 지정 프레임 반복, 하나의 애니메이션 내에서 속도 가변
-   사용자 입력 인터렉션 효과 추가 / 호버 시 애니메이션의 시작 혹은 정지

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
