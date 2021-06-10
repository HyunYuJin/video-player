// ;는 번들러 때문에 예전부터 내려온 구분자 같은 것
;(() => {

    'use strict'

    const DOM = {
        video: document.getElementById('video'),
        container: document.querySelector('.video-container'),
        controls: document.querySelector('.video-controls'),
        togglePlay: document.getElementById('togglePlay'),
        togglePlayButton: document.getElementById('togglePlay'),
        toggleMute: document.getElementById('toggleMute'),
        toggleMuteButton: document.getElementById('toggleMute'),
        toggleFullScreen: document.getElementById('toggleFullscreen'),
        toggleFullScreenButton: document.getElementById('toggleFullscreen'),
        currentTime: document.getElementById('currentTime'),
        totalTime: document.getElementById('totalTime'),
        volume: document.getElementById('volume'),
        progressFilled: document.getElementById('progressFilled'),
        progressCursor: document.getElementById('progressCursor')
    }

    let isPlaying = false // 재생 상태
    let isMuted = false // 음소거 상태
    let isFullScreen = false // 전체화면 상태

    let isMouseover = false

    function init() {
        initEvents()
    }

    function initEvents() {
        DOM.togglePlay.addEventListener('click', togglePlay)
        DOM.toggleMute.addEventListener('click', toggleMute)
        DOM.toggleFullScreen.addEventListener('click', toggleFullScreen)

        DOM.video.addEventListener('timeupdate', onTimeupdate)
        // video를 다운받으면 이 metadata에서 넘어온다 기본 정보들을 담고있다.
        DOM.video.addEventListener('loadedmetadata', loadedMetaData)
        
        // input(마우스 움직이는 내내 계속)는 keyup, change(마우스 놨을 때) 대신에 요즘 많이 사용된다.
        DOM.volume.addEventListener('input', updateVolumn)
        
        DOM.container.addEventListener('mouseenter', onMouseenter)
        DOM.container.addEventListener('mouseleave', onMouseleave)
    }

    function onMouseenter() {
        isMouseover = true
        updateProgressFilled()
        updateProgressCursor()

        DOM.container.classList.remove('transition-out')
        DOM.container.classList.add('transition-in')
    }
    
    function onMouseleave() {
        isMouseover = false
        if (isPlaying) {
            DOM.container.classList.remove('transition-in')
            DOM.container.classList.add('transition-out')
        }
    }

    function updateVolumn(event) {
        const volume = event.target.value
        DOM.volume.value = volume // 최근 업데이트 된 값으로!
        DOM.video.volume = volume / 100 // 실제 볼륨 조절
        DOM.volume.style.backgroundSize = `${volume}% 100%`
    }

    function loadedMetaData() {
        DOM.totalTime.innerHTML = prettyTime(DOM.video.duration)
    }

    function onTimeupdate() {
        // 마우스 올렸을 때만 update
        if (isMouseover) {
            updateTimeDisplay()
            updateProgressFilled()
            updateProgressCursor()
        }
    }

    function updateTimeDisplay() {
        const currentTime = prettyTime(DOM.video.currentTime)

        DOM.currentTime.innerHTML = currentTime
    }

    function updateProgressFilled() {
        const scaleX = DOM.video.currentTime / DOM.video.duration
        DOM.progressFilled.style.transform = `scaleX(${scaleX})`
    }

    function updateProgressCursor() {
        const left = DOM.video.currentTime / DOM.video.duration * 100
        DOM.progressCursor.style.left = `${left}%`
    }

    function prettyTime(time) {
        const hours = zeroFill(Math.floor(time / 3600))
        const minutes = zeroFill(Math.floor(time % 3600 / 60))
        const second = zeroFill(Math.floor(time % 3600 % 60))

        return `${hours}:${minutes}:${second}`
    }

    function zeroFill(time) {
        return ('0' + time).slice(-2)
    }

    function togglePlay() {
        if (isPlaying) {
            onPause()
        } else {
            onPlay()
        }
    }

    function onPlay() {
        isPlaying = true

        DOM.togglePlayButton.classList.remove('play')
        DOM.togglePlayButton.classList.add('pause')
        
        // video의 기본 메소드
        DOM.video.play()
    }
    
    function onPause() {
        isPlaying = false

        DOM.togglePlayButton.classList.remove('pause')
        DOM.togglePlayButton.classList.add('play')
        
        // video의 기본 메소드
        DOM.video.pause()
    }

    function toggleMute() {
        if (isMuted) {
            onMute()
        } else {
            onUnMuted()
        }
    }
    
    function onMute() {
        isMuted = false
    
        DOM.toggleMuteButton.classList.remove('unmute')
        DOM.toggleMuteButton.classList.add('mute')

        DOM.video.muted = false
    }

    function onUnMuted() {
        isMuted = true
        
        DOM.toggleMuteButton.classList.remove('mute')
        DOM.toggleMuteButton.classList.add('unmute')

        DOM.video.muted = true
    }

    function toggleFullScreen() {
        if (!isFullScreen) {
            onFullScreen()
        } else {
            onUnFullScreen()
        }
    }

    function onFullScreen() {
        isFullScreen = true
        
        DOM.toggleFullScreenButton.classList.remove('unfullscreen')
        DOM.toggleFullScreenButton.classList.add('fullscreen')

        DOM.video.requestFullscreen()
    }

    function onUnFullScreen() {
        isFullScreen = false
        
        DOM.toggleFullScreenButton.classList.remove('fullscreen')
        DOM.toggleFullScreenButton.classList.add('unfullscreen')
    }

    init()

})()