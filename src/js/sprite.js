class Sprite {
    constructor(src, [row, col], config = {}) {
        this.id = config.id || '';
        this.frame = config.frame || 30;
        this.loop = config.loop || false;
        this.offset = config.offset || [0, 0, 0, 0];

        this.dev = config.dev || false;
        this.children = [];

        this.imageLoaded = new Promise((resolve) => {
            this.img = new Image();
            this.row = row;
            this.col = col;
            this.spriteCount = row * col;

            this.img.onload = () => resolve();
            this.img.onerror = (err) => console.error(err);

            this.img.src = src;
        }).then(() => {
            this.imageSize = [
                (this.img.width - (this.offset[1] + this.offset[3])) / col,
                (this.img.height - (this.offset[0] + this.offset[2])) / row,
            ];

            this.init();
        });
    }

    render() {
        const items = document.querySelectorAll(`[sprite="${this.id}"]`);
        items.forEach((item) => {
            this.create(item, item.getAttribute('spriteidx') || 0);
        });
    }

    create(target, idx) {
        let targetDom = typeof target === 'string' ? document.querySelector(target) : target;

        const imgDom = document.createElement('div');
        targetDom.append(imgDom);

        const result = new SpriteItem(this);
        result.idx = idx;
        result.targetDom = targetDom;
        result.imgDom = imgDom;

        this.children.push(result);
        return result;
    }

    increaseSpeed() {
        this.frame -= 1;
        if (this.frame <= 1) {
            this.devMsg('최대 속도입니다.');
            this.frame = 1;
        } else {
            this.devMsg(`속도가 증가하였습니다. 초당 ${this.frame}회 재생됩니다.`);
        }
    }

    decreaseSpeed() {
        this.frame += 1;
        if (this.frame <= 60) {
            this.devMsg('최소 속도입니다.');
            this.frame = 60;
        } else {
            this.devMsg(`속도가 감소하였습니다. 초당 ${this.frame}회 재생됩니다.`);
        }
    }

    // 이미지가 로드되면 dom을 생성하고, 초기 프레임을 렌더링한다.
    init() {
        const imgDom = document.createElement('div');
        const [width, height] = this.imageSize;

        imgDom.style.cssText = `
          width: ${width}px;
          height: ${height}px;
          background-image: url(${this.img.src});
          background-position: ${this.offset[0]}px ${this.offset[3]}px;
          background-size: ${this.img.width}px ${this.img.height}px;
          background-repeat: no-repeat;
        `;

        this.imgDom = imgDom;
        this.children.forEach((el) => {
            el.update();
        });
    }

    devMsg(msg) {
        if (this.dev) console.error(msg);
    }
}

class SpriteItem {
    constructor(parent) {
        this.parent = parent;
        this.frame = parent.frame;
    }

    setSpeed(value) {
        this.frame = value;

        return this;
    }

    // 입력받은 idx의 프레임으로 이미지를 변경한다.
    async setIdx(idx) {
        this.idx = idx;
        const { imageLoaded, imageSize, offset, col } = this.parent;
        await imageLoaded;

        const [width, height] = imageSize;
        const ratio = this.targetDom.offsetWidth / width;

        const left = (width * Math.floor(idx % col) * -1 - offset[3]) * ratio;
        const top = (height * Math.floor(idx / col) * -1 - offset[0]) * ratio;

        this.imgDom.style.backgroundPosition = `${left}px ${top}px`;
    }

    update() {
        const [width, height] = this.parent.imageSize || [0, 0];
        const ratio = this.targetDom.offsetWidth / width;

        this.imgDom.style.cssText = `
          width: ${this.targetDom.offsetWidth}px;
          height: ${this.targetDom.offsetHeight}px;
          background-image: url(${this.parent.img.src});
          background-size: ${this.parent.img.width * ratio}px ${this.parent.img.height * ratio}px;
          background-repeat: no-repeat;
        `;

        const left = (width * Math.floor(this.idx % this.parent.col) * -1 - this.parent.offset[3]) * ratio;
        const top = (height * Math.floor(this.idx / this.parent.col) * -1 - this.parent.offset[0]) * ratio;

        this.imgDom.style.backgroundPosition = `${left}px ${top}px`;
    }

    // start와 end를 받아서 animation을 실행한다.
    play(start = 0, end = this.parent.spriteCount - 1) {
        const { devMsg, loop } = this.parent;
        let { startSprite, endSprite, currentFrame } = this.parent;

        currentFrame = 0;
        startSprite = start;
        endSprite = end;

        if (this.isPlaying) return devMsg('진행중인 애니메이션이 있습니다.');
        if (start < 0) return devMsg('시작 프레임은 0보다 작을 수 없습니다.');
        if (start >= end) return devMsg('시작 프레임은 종료 프레임보다 같거나 클 수 없습니다.');
        if (end > this.spriteCount - 1) return devMsg(`종료 프레임은 ${this.spriteCount - 1} 이하여야 합니다.`);

        this.isPlaying = true;

        this.setIdx(this.startSprite);

        const nextFrame = () => {
            if (this.paused) {
                this.reqAnimeFrame = requestAnimationFrame(nextFrame);
                return;
            }

            currentFrame += 1;
            if (currentFrame >= this.frame) {
                currentFrame = 0;

                startSprite += 1;

                if (startSprite > endSprite) {
                    if (loop) startSprite = start;
                    else stop();
                }
                this.setIdx(startSprite);
            }
            this.reqAnimeFrame = requestAnimationFrame(nextFrame);
        };

        this.reqAnimeFrame = requestAnimationFrame(nextFrame);
    }

    async onPlay() {
        this.targetDom.addEventListener('mouseenter', () => this.play());
        this.targetDom.addEventListener('mouseleave', () => this.stop());
    }

    async onClick() {
        this.targetDom.addEventListener('click', () => (this.isPlaying ? this.stop() : this.play()));
    }

    // 멈춰져있던 animation을 재생 시킨다.
    start() {
        if (this.paused) {
            this.paused = false;
        }
    }

    // 진행중인 animation을 일시정지한다.
    pause() {
        this.paused = true;
    }

    // 진행중인 animation을 정지한다.
    stop() {
        if (this.reqAnimeFrame) cancelAnimationFrame(this.reqAnimeFrame);
        this.isPlaying = false;
    }
}
