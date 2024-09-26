class Sprite {
    constructor(src, [row, col], config = {}) {
        this.frame = config.frame || 30;
        this.loop = config.loop || false;
        this.offset = config.offset || [0, 0, 0, 0];

        this.dev = config.dev || false;

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

            this.init(config.initialFrame);
        });
    }

    async create(className, idx) {
        await this.imageLoaded;

        const targetDom = document.querySelector(className);

        const imgDom = document.createElement('div');
        const [width, height] = this.imageSize;

        const ratio = targetDom.clientWidth / width;

        imgDom.style.cssText = `
          width: ${targetDom.clientWidth}px;
          height: ${targetDom.clientHeight}px;
          background-image: url(${this.img.src});
          background-size: ${this.img.width * ratio}px ${this.img.height * ratio}px;
          background-repeat: no-repeat;
        `;

        const left = (width * Math.floor(idx % this.col) * -1 - this.offset[3]) * ratio;
        const top = (height * Math.floor(idx / this.col) * -1 - this.offset[0]) * ratio;

        imgDom.style.backgroundPosition = `${left}px ${top}px`;

        targetDom.append(imgDom);

        this.targetDom = targetDom;
        this.imgDom = imgDom;

        return this;
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
    init(initialFrame = 0) {
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
    }

    // 입력받은 idx의 프레임으로 이미지를 변경한다.
    async setIdx(idx) {
        await this.imageLoaded;

        const [width, height] = this.imageSize;
        const ratio = this.targetDom.clientWidth / width;

        const left = (width * Math.floor(idx % this.col) * -1 - this.offset[3]) * ratio;
        const top = (height * Math.floor(idx / this.col) * -1 - this.offset[0]) * ratio;

        this.imgDom.style.backgroundPosition = `${left}px ${top}px`;
    }

    // start와 end를 받아서 animation을 실행한다.
    async play(start = 0, end = this.spriteCount - 1) {
        await this.imageLoaded;

        this.currentFrame = 0;
        this.startSprite = start;
        this.endSprite = end;

        if (this.isPlaying) return this.devMsg('진행중인 애니메이션이 있습니다.');
        if (start < 0) return this.devMsg('시작 프레임은 0보다 작을 수 없습니다.');
        if (start >= end) return this.devMsg('시작 프레임은 종료 프레임보다 같거나 클 수 없습니다.');
        if (end > this.spriteCount - 1) return this.devMsg(`종료 프레임은 ${this.spriteCount - 1} 이하여야 합니다.`);

        this.isPlaying = true;

        this.setIdx(this.startSprite);

        const nextFrame = () => {
            if (this.paused) {
                this.reqAnimeFrame = requestAnimationFrame(nextFrame);
                return;
            }

            this.currentFrame += 1;
            if (this.currentFrame >= this.frame) {
                this.currentFrame = 0;

                this.startSprite += 1;

                if (this.startSprite > this.endSprite) {
                    if (this.loop) this.startSprite = start;
                    else this.stop();
                }
                this.setIdx(this.startSprite);
            }
            this.reqAnimeFrame = requestAnimationFrame(nextFrame);
        };

        this.reqAnimeFrame = requestAnimationFrame(nextFrame);
    }

    async onPlay() {
        await this.imageLoaded;
        this.targetDom.addEventListener('mouseenter', () => this.play());
        this.targetDom.addEventListener('mouseleave', () => this.stop());
    }

    async onClick() {
        await this.imageLoaded;
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

    devMsg(msg) {
        if (this.dev) console.error(msg);
    }
}
