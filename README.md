# Sprite.js

스프라이트 이미지를 이용하여 정적 아이콘 및 애니메이션 관리를 위한 자바스크립트 클래스입니다.  
html 태그에 attribute를 추가하여 간편하게 스프라이트 아이콘을 표시하거나,  
개별 애니메이션을 재생할 수 있습니다.

<a href="https://mooky1007.github.io/sprite.js" target="_blank">데모 페이지</a>

## 기능
-   **수동 스프라이트 관리**: `create`를 사용하여 스프라이트 아이템 객체를 생성할 수 있습니다.
-   **애니메이션 제어**: 지정된 프레임 범위에서 애니메이션 재생/정지/일시정지를  수 있습니다.

## 설치
프로젝트에 `Sprite` 클래스를 직접 포함하여 사용할 수 있습니다.

```html
<script src="./your-path/sprite.js"></script>
```

## 사용 예시

1. 정적 이미지 자동 생성

![image](https://github.com/user-attachments/assets/9175ddf2-3b22-4842-8bc2-023086531d40)

```js
//초기 설정
const iconset =
  new Sprite(
    './src/images/sample_iconset.webp', // 이미지 경로
     [2, 8], // 스프라이트의 행/열
    {
      id: 'iconset', // render() 매서드 사용 시 필수
      offset: [87, 227, 86, 227], // 스프라이트 이미지에 여백이 포함되어 있는 경우 적용 (상/우/하/좌)
  });

iconset.render();

//html 태그중 sprite attribute가 `id`인 요소들을 찾아 자동으로 create()가 실행된다.
//이미지 순서는 spriteIdx 값으로 지정된다. (미입력 시 0으로 생성)
//렌더링 후 개별제어 불가능

```

2. 개별 애니메이션 수동 생성

![image](https://github.com/user-attachments/assets/07e2dc3d-92c9-4549-8d55-3325cbf70a03)

```js
const animation = new Sprite(
  './src/images/sample_animation.jpg',
  [2, 4],
  {
    initialFrame: 0,
    frame: 12,
    loop: true,
});

animation.create('.animtion_1', 0).play();
animation.create('.animtion_2', 0).setSpeed(4).play();
animation.create('.animtion_3', 0).onPlay();
animation.create('.animtion_4', 0).onClick();
animation.create('.animtion_5', 0).play(0, 1);
animation.create('.animtion_6', 0).play(2, 3);
animation.create('.animtion_7', 0).play(4, 5);
animation.create('.animtion_8', 0).play(6, 7);
```

## 옵션

-   `id`: render() 매서드 사용 시 식별용 키값
-   `frame`: 초당 프레임 수 (기본값: 30)
-   `loop`: 애니메이션 반복 여부 (기본값: false)
-   `targetClass`: 애니메이션이 삽입될 DOM 요소 클래스 (기본값: `body`)
-   `dev`: 에러로그 활성화 여부 (기본값: false)
-   `offset`: [top, right, bottom, left] 스프라이트 이미지의 offset 설정

## 메서드

-   `render()`: document에서 id와 일치하는 sprite 속성을 가진 태그들에 자동으록 create 실행.
-   `play(start, end)`: 지정된 프레임 범위로 애니메이션을 재생합니다.
-   `setIdx(idx)`: 해당 인덱스의 프레임을 수동으로 표시합니다.
-   `pause()`: 애니메이션을 일시정지합니다.
-   `start()`: 일시정지된 애니메이션을 재개합니다.
-   `stop()`: 애니메이션을 완전히 멈춥니다.
-   `onPlay()`: 마우스가 올라가 있을때만 애니메이션이 실행됩니다. **임시**
-   `clickPlay()`: 클릭 할때마다 재생/정지 반복. **임시**
