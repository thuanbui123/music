const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player")
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play")
const cd = $(".cd");
const progress = $("#progress")
const nextBtn = $(".btn-next")
const prevBtn = $(".btn-prev")
const randomBtn = $(".btn-random")
const repeatBtn = $(".btn-repeat")
const playList = $(".playlist")

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
    {
      name: "Nevada",
      singer: "Monstercat",
      path: "../assets/music/Nevada-Monstercat.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "Hoa tàn tình tan",
      singer: "Giang Jolee",
      path: "../assets/music/Hoa Tan Tinh Tan.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    {
      name: "Vui lắm nha",
      singer: "Huong Ly ft Jombie",
      path:
        "../assets/music/Vuilamnha.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Waiting for love",
      singer: "Avicii",
      path:
        "../assets/music/WaitingForLove-Avicii.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Spark",
      singer: "TAEYEON",
      path: "../assets/music/spark.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
    {
      name: "Reality",
      singer: "Lost Frequencies feat. Janieck Devy",
      path: "../assets/music/reality.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Home",
      singer: "Michael Bublé",
      path:
        "../assets/music/home.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
    },
    {
      name: "Holo",
      singer: "Ampyx",
      path: "../assets/music/holo.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
  ],
  // setConfig: function(key, value) {
  //   this.config[key] = value;
  //   // localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  // },
  render: function() {
      const htmls = this.songs.map((song, index) =>{
          return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
      })
      playList.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
        get: function() {
            return this.songs[this.currentIndex];
        }
    })
  },
  handleEvents: function() {
  const _this = this;  
  const cdWidth = cd.offsetWidth;

    // Xử lý cd quay / dừng
    const cdThumbAnimate = cdThumb.animate([
      {transform: "rotate(360deg)"}
    ], {
      duration: 10000, //10seconds
      iterations: Infinity
    })

    cdThumbAnimate.pause()

    //xử lý phóng to thu nhỏ cd
    document.onscroll = function (){
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0;
        cd.style.opacity = newCdWidth/cdWidth;
    }

    // Xử lý khi click play
    playBtn.onclick = function() {
      if(_this.isPlaying){
        audio.pause()
      }else {
        audio.play()
      }
    }

    // Khi song được play
    audio.onplay = function(){
      _this.isPlaying = true;
      player.classList.add("playing")
      cdThumbAnimate.play()
    }

    // Khi song bị pause
    audio.onpause = function(){
      _this.isPlaying = false;
      player.classList.remove("playing")
      cdThumbAnimate.pause()
    }

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent;
      }
    }

    // Xửr lý khi tua song
    progress.onchange = function(e) {
      const seekTime = e.target.value * audio.duration /100
      audio.currentTime = seekTime
    }

    // Khi next song
    nextBtn.onclick = function () {
      if(_this.isRandom) {
        _this.playRandomSong()
      }else {
        _this.nextSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    // Khi prev song
    prevBtn.onclick = function () {
      if(_this.isRandom) {
        _this.playRandomSong()
      }else {
        _this.prevSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    //Xử lý bật / tắt random
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom
      // _this.setConfig("isRandom", _this.isRandom)
      randomBtn.classList.toggle("active", _this.isRandom)
    }

    // Xử lý lặp lại một song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat
      // _this.setConfig("isRepeat", _this.isRepeat)
      repeatBtn.classList.toggle("active", _this.isRepeat)
    }

    // Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play()
      }else {
        nextBtn.click()
      }
    }
    // Lăng nghe hành vi click vào playlist
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)")
      if (songNode || e.target.closest(".option")) {
        
        // Xử lý khi click vào song 
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
        }

        // // Xử lý khi click vao song option
        // if (e.target.closest('.option')) {

        // }
      }
    }
  },

  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      })
    }, 300);
  },

  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  // loadConfig: function () {
  //   _this.isRandom = _this.config.isRandom;
  //   _this.isRepeat = _this.config.isRepeat;
  // },

  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length -1
    }
    this.loadCurrentSong()
  },

  playRandomSong: function() {
    let newIndex 
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    }while (newIndex === this.currentIndex )
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },

  start: function() {
    // Gán cấu hình từ config vào ứng dụng
    // this.loadConfig();

    //Định nghĩa các thuộc tính cho object
    this.defineProperties();

    //lắng nghe/ xử lý các sự kiện DOM events
    this.handleEvents();

    //tải thông tin bài hát đầu tiên vào UI khi tải ứng dụng
    this.loadCurrentSong();

    //Render playList
    this.render();

    // Hiển thị trạng thái ban đầu của button random and repeat 
    // randomBtn.classList.toggle("active", this.isRandom)
    // repeatBtn.classList.toggle("active", this.isRepeat)
  }
}

app.start();