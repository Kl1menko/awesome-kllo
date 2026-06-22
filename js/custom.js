/* ==== inline script block 4 ==== */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-card.is-video");
  if (!hero) return;

  const playButton = hero.querySelector(".case_play-button");
  if (!playButton) return;

  const videoUrl = hero.dataset.videoUrl;
  console.log(videoUrl);
  console.log(hero);
  if (!videoUrl) return;

  playButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openVideoPopup(videoUrl);
  });

  function openVideoPopup(url) {
    if (document.querySelector(".video-popup")) return;

    const popup = document.createElement("div");
    popup.className = "video-popup";
    popup.innerHTML = `
      <div class="video-popup__overlay"></div>
      <div class="video-popup__content">
        <button class="video-popup__close" aria-label="Close video">×</button>
        <video src="#" autoplay controls playsinline></video>
      </div>
    `;

    document.body.appendChild(popup);
    document.body.style.overflow = "hidden";

    const close = () => {
      popup.remove();
      document.body.style.overflow = "";
    };

    popup.querySelector(".video-popup__overlay").addEventListener("click", close);
    popup.querySelector(".video-popup__close").addEventListener("click", close);

    // Optional: ESC to close
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", escHandler);
      }
    });
  }
});

/* ==== inline script block 5 ==== */
document.addEventListener("DOMContentLoaded", () => {
    // If these are <video class="hero-card_image"> elements
    document.querySelectorAll(".hero-card_image").forEach((video) => {
      const source = video.querySelector("source[data-src]");
      if (source) {
        source.src = source.dataset.src;
        source.removeAttribute("data-src");
        video.load();
      }
    });

    document.querySelectorAll(".hero-card_swiper").forEach((item) => {
      const paginationEl = item.querySelector(".story__pagination");

      const heroImageSwiper = new Swiper(item, {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 300,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        loop: true,
        pagination: {
          el: paginationEl,
          clickable: true,
          renderBullet: function (index, className) {
            return `
              <div class="${className} story-bullet">
                <div class="swiper-pagination-progress"></div>
  </div>
            `;
          },
        },
      });

      // helper to get progress elements in THIS swiper only
      const getProgressBars = () =>
      paginationEl
      ? Array.from(
        paginationEl.querySelectorAll(".swiper-pagination-progress")
      )
      : [];

      // init state
      const initBullets = () => {
        const bars = getProgressBars();
        bars.forEach((b) => gsap.set(b, { width: "0%" }));
      };
      initBullets();

      heroImageSwiper.on("autoplayTimeLeft", function (swiper, time) {
        const bars = getProgressBars();
        const currentBar = bars[swiper.realIndex];
        if (!currentBar) return;

        const fullTime = swiper.params.autoplay.delay;
        const percentage =
              Math.min(Math.max(((fullTime - time) * 100) / fullTime, 0), 100) + "%";

        gsap.set(currentBar, { width: percentage });
      });

      const syncBarsToIndex = (swiper) => {
        const bars = getProgressBars();
        bars.forEach((bar, i) => {
          if (i < swiper.realIndex) gsap.set(bar, { width: "100%" });
          else gsap.set(bar, { width: "0%" });
        });
      };

      heroImageSwiper.on("slideChangeTransitionStart", syncBarsToIndex);
      heroImageSwiper.on("paginationUpdate", syncBarsToIndex);

      const onEnter = () => {
        if (heroImageSwiper.autoplay?.running) heroImageSwiper.autoplay.pause();
      };

      const onLeave = () => {
        // resume continues from the paused time (doesn't restart the delay)
        if (heroImageSwiper.autoplay?.running) heroImageSwiper.autoplay.resume();
      };

      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);

      item.addEventListener("click", (e) => {
        const rect = item.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const half = rect.width / 2;

        if (relativeX < half) heroImageSwiper.slidePrev();
        else heroImageSwiper.slideNext();
      });
    });

    const heroSwiper = new Swiper(".hero-swiper", {
      slidesPerView: "auto",
      spaceBetween: 12,
      loop: false,
      mousewheel: {
        enabled: true,
        releaseOnEdges: true,
      },
      freeMode: true,
      initialSlide: 1,
    });
  });

/* ==== inline script block 6 ==== */
const showTabsTrigger = document.querySelector('.how-choose-pro-button');
  const whyAnimationContainer = document.querySelector('.why-steps-animated-wrapper');
  const closeTabsTrigger = document.querySelector('.close-why-animated');
  var whyTimeout;
  var whyIsPaused = false;
  var currentAnimation = null; // keep reference to active animation

  function whyTabLoop() {
    if (whyIsPaused) return; // stop if paused

    whyTimeout = setTimeout(function () {
      var current = document.querySelector('.why-animated-steps-menu .w--current');
      var next = current ? current.nextElementSibling : null;

      if (next) {
        if (document.querySelector(".why-animated-steps-menu").classList.contains("w--open")) {
          whyTabLoop();
        } else {
          next.removeAttribute("href");
          next.click();
          whyStartAnimation(Array.from(document.querySelectorAll('.why-step')).indexOf(next));
          whyTabLoop();
        }
      } else {
        // when reaching the end → restart at first tab
        var firstTab = document.querySelector('.why-step');
        if (firstTab) {
          firstTab.removeAttribute("href");
          firstTab.click();
          whyStartAnimation(0);
          whyTabLoop();
        }
      }
    }, 5000);
  }

  function whyStartAnimation(index) {
    const currentTab = document.querySelectorAll('.why-animated-pane')[index];
    if (!currentTab) return;

    const progressBarWrapper = currentTab.querySelector('.how-tab_progress-wrapper');
    if (!progressBarWrapper) return;

    const progressStatus = progressBarWrapper.querySelector('.how-tab_progress-status');
    if (!progressStatus) return;

    // cancel any previous animation
    if (currentAnimation) {
      currentAnimation.cancel();
    }

    currentAnimation = progressStatus.animate([
      {width: '0%'},
      {width: '100%'}
    ], {
      duration: 5000,
      easing: 'ease-in-out',
      fill: 'forwards'
    });
  }

  // click on tab → continue from clicked index
  document.querySelectorAll('.why-step').forEach(function(tabLink, index) {
    tabLink.addEventListener('click', function() {
      clearTimeout(whyTimeout);
      whyStartAnimation(index);
      whyTabLoop();
    });
  });

  // click on "show tabs" button → always restart at first step
  showTabsTrigger.addEventListener('click', function(){
    clearTimeout(whyTimeout);

    const firstTab = document.querySelector('.why-step');
    if (firstTab) {
      firstTab.removeAttribute("href");
      firstTab.click();
      whyStartAnimation(0);
      whyTabLoop();
    }
  });

  closeTabsTrigger.addEventListener('click', function () {
    clearTimeout(whyTimeout);     // stop loop
    whyAnimationContainer.style.display = 'none';
    if (currentAnimation) {
      currentAnimation.cancel(); // stop animation
      currentAnimation = null;
    }
    whyIsPaused = true;           // mark as paused so loop won't restart
  });
  if (window.innerWidth < 567) {
    document.addEventListener('click', function (e) {
      const wrapper = document.querySelector('.why-awesomic_block._w-face');
      if (wrapper && !wrapper.contains(e.target)) {
        clearTimeout(whyTimeout);    
        whyAnimationContainer.style.display = 'none';

        if (currentAnimation) {
          currentAnimation.cancel(); 
          currentAnimation = null;
        }
        whyIsPaused = true;
      }
    });
  }

/* ==== inline script block 7 ==== */
const featuresCircle = document.getElementById('features-cta-circle');
  const featuresCta = document.querySelector('.features_cta');

  featuresCta.addEventListener('mousemove', function(event) {
    const rect = featuresCta.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    featuresCircle.style.left = (x - 185) + 'px';
    featuresCircle.style.top  = (y - 160) + 'px';
    featuresCircle.style.opacity = 1;
  });

  featuresCta.addEventListener('mouseleave', function() {
    featuresCircle.style.opacity = 0;
  });

  featuresCircle.style.opacity = 0;

/* ==== inline script block 8 ==== */
var tabTimeout;
  var isInView = false;
  var isPaused = false;

  // Intersection Observer to detect when component is in view
  const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isInView = true;
        if (!isPaused) {
          clearTimeout(tabTimeout);
          // Start from first tab
          const firstTab = document.querySelector('.how-tab_link');
          if (firstTab) {
            firstTab.removeAttribute("href");
            firstTab.click();
            startAnimation();
            tabLoop();
          }
        }
      } else {
        isInView = false;
        clearTimeout(tabTimeout);
      }
    });
  }, {
    threshold: 0.1 // Adjust this value as needed (0.1 = 10% visible)
  });

  // Start observing the component
  const tabsComponent = document.querySelector('.how-tabs_component');
  if (tabsComponent) {
    processObserver.observe(tabsComponent);
  }

  function tabLoop() {
    if (!isInView) return; // Don't continue if not in view

    tabTimeout = setTimeout(function () {
      if (isPaused || !isInView) {
        tabLoop(); // Restart the timer without proceeding
        return;
      }

      var current = document.querySelector('.how-tabs_menu .w--current');
      var next = current ? current.nextElementSibling : null;

      if (next) {
        if (document.querySelector(".how-tabs_menu").classList.contains("w--open")) {
          tabLoop();
        } else {
          next.removeAttribute("href");
          next.click();
          startAnimation();
        }
      } else {
        if (document.querySelector(".how-tabs_menu").classList.contains("w--open")) {
          tabLoop();
        } else {
          var firstTab = document.querySelector('.how-tab_link');
          if (firstTab) {
            firstTab.removeAttribute("href");
            firstTab.click();
            startAnimation();
          }
        }
      }
    }, 5000);
  }

  // Keep a handle on the running progress animation so we can cancel it before
  // starting a new one — otherwise stale animations stack up across tabs and
  // leave the progress bar stuck/jumping when a card is opened by click.
  var progressAnimation = null;

  function resetAllProgressBars() {
    if (progressAnimation) {
      progressAnimation.cancel();
      progressAnimation = null;
    }
    document.querySelectorAll('.how-tab_progress-status').forEach(function (status) {
      status.getAnimations().forEach(function (a) { a.cancel(); });
      status.style.width = '0%';
    });
  }

  function startAnimation() {
    const currentTab = document.querySelector('.how-tab_link.w--current');
    if (!currentTab) return;

    const progressBarWrapper = currentTab.querySelector('.how-tab_progress-wrapper');
    if (!progressBarWrapper) return;

    const progressStatus = progressBarWrapper.querySelector('.how-tab_progress-status');
    if (!progressStatus) return;

    // Clear any previous animations/widths so only the active tab animates.
    resetAllProgressBars();

    progressAnimation = progressStatus.animate([
      { width: '0%' },
      { width: '100%' }
    ], {
      duration: 5000,
      easing: 'ease-in-out',
      fill: 'forwards'
    });

    currentTab.addEventListener('mouseenter', () => {
      if (progressAnimation) progressAnimation.pause();
      isPaused = true; // Pause the tab loop as well
    });

    currentTab.addEventListener('mouseleave', () => {
      if (progressAnimation) progressAnimation.play();
      isPaused = false; // Resume the tab loop
    });
  }

  // Add hover listeners to all tabs for pausing the loop
  document.querySelectorAll('.how-tab_link').forEach(function(tabLink) {
    tabLink.addEventListener('mouseenter', function() {
      isPaused = true;
    });

    tabLink.addEventListener('mouseleave', function() {
      isPaused = false;
    });

    tabLink.addEventListener('click', function() {
      clearTimeout(tabTimeout);
      // Let Webflow move the `w--current` class to the clicked tab first,
      // otherwise the bar animates on the previously active tab.
      requestAnimationFrame(function () {
        startAnimation();
        tabLoop();
      });
    });

    tabLink.querySelector('.tab_button-imitation').addEventListener('click', function(){
      if (tabLink.classList.contains('w--current')){
        if(tabLink.getAttribute('data-link')){
          window.open(
            tabLink.getAttribute('data-link'),
            tabLink.getAttribute('tab')
          );
        }
      }
    })
  });

  document.addEventListener("DOMContentLoaded", () => {
    const bgTarget = document.getElementById('how-it-wroks');

    let styleAdded = false;

    const lazyBackground = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !styleAdded) {
          const style = document.createElement('style');
          style.innerHTML = `
        .how-tabs_content {
          background-image: url("images/how-it-works-img.jpg");
        }
      `;
          document.head.appendChild(style);
          styleAdded = true;

          observer.disconnect();
        }
      });
    };

    const bgObserver = new IntersectionObserver(lazyBackground);
    bgObserver.observe(bgTarget);
  });

/* ==== inline script block 9 ==== */
/*document.addEventListener("DOMContentLoaded", (event) => {
    document.querySelector('.cta-bg-image').src = document.querySelector('.cta-bg-image').getAttribute('data-src');
  });*/
  if(window.innerWidth > 991){
    const circle = document.getElementById('cta-circle');
    const ctaBlock = document.getElementById('cta-block');

    ctaBlock.addEventListener('mousemove', function(event) {
      const rect = ctaBlock.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      circle.style.left = (x - 370) + 'px';
      circle.style.top  = (y - 320) + 'px';
      circle.style.opacity = 1;
    });

    ctaBlock.addEventListener('mouseleave', function() {
      circle.style.opacity = 0;
    });

    circle.style.opacity = 0;
  }

  const ctaSection = document.querySelector('.section_cta');

  const imgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          //ctaSection.classList.add('animate-background');
        } else {
          //ctaSection.classList.remove('animate-background');
        }
      });
    },
    { threshold: 0.5 }
  );

  if (ctaSection) {
    imgObserver.observe(ctaSection);
  }
  
  const imageToLoad = document.getElementById('cta-dec-image');

  if (imageToLoad) {
    const imageSection = imageToLoad.closest('section');
    const prevSection = imageSection?.previousElementSibling;
    const nextSection = imageSection?.nextElementSibling;

    const loadImage = () => {
      if (imageToLoad.dataset.src) {
        imageToLoad.src = imageToLoad.dataset.src;
        imageToLoad.removeAttribute('data-src');
        ctaImageObserver.disconnect();
        initialObserver.disconnect();
      }
    };

    // Observe when image section is already in view (page load case)
    const initialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) loadImage();
      });
    }, { threshold: 0.1 });

    if (imageSection) initialObserver.observe(imageSection);

    // Observe prev and next sections
    const ctaImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) loadImage();
      });
    }, { threshold: 0.1 });

    if (prevSection?.tagName === 'SECTION') ctaImageObserver.observe(prevSection);
    if (nextSection?.tagName === 'SECTION') ctaImageObserver.observe(nextSection);
  }

/* ==== inline script block 10 ==== */
(function () {

    document.addEventListener('click', function (e) {

      /* ---------- PLAY ---------- */
      const clickedPlaceholder = e.target.closest('.video-placeholder');
      if (clickedPlaceholder) {
        const block = clickedPlaceholder.closest('.video-review_content');
        console.log(block);
        if (!block) return;

        const video = block.querySelector('.video-review');
        // Support both lazy sources (<source data-src>) and ready ones (<source src>).
        const source = video?.querySelector('source[data-src], source[src]');

        // no real video → do nothing
        if (!video || !source) return;

        if (!video.dataset.loaded) {
          const realSrc = source.dataset.src || source.getAttribute('src');
          if (!realSrc) return;
          // Promote a lazy data-src to a real src if needed.
          if (source.dataset.src && !source.getAttribute('src')) {
            source.src = realSrc;
          }
          video.load();
          video.dataset.loaded = 'true';
        }

        video.play().catch(() => {});

        clickedPlaceholder.style.opacity = '0';
        clickedPlaceholder.style.pointerEvents = 'none';
        video.style.zIndex = '2';

        return;
      }

      /* ---------- PAUSE ---------- */
      const clickedVideo = e.target.closest('.video-review');
      if (!clickedVideo) return;
      if (clickedVideo.paused) return;

      const block = clickedVideo.closest('.video-review_content');
      const placeholder = block?.querySelector('.video-placeholder');
      if (!placeholder) return;

      clickedVideo.pause();

      placeholder.style.opacity = '1';
      placeholder.style.pointerEvents = 'auto';
      clickedVideo.style.zIndex = '0';

    });

    /* ---------- RESET ON END ---------- */
    document.addEventListener(
      'ended',
      function (e) {
        const video = e.target.closest('.video-review');
        if (!video) return;

        const block = video.closest('.video-review_content');
        const placeholder = block?.querySelector('.video-placeholder');
        if (!placeholder) return;

        placeholder.style.opacity = '1';
        placeholder.style.pointerEvents = 'auto';
        video.style.zIndex = '0';
      },
      true
    );

  })();

/* ==== inline script block 11 ==== */
document.addEventListener("DOMContentLoaded", function () {
    const moreReviewsBlock = document.querySelector(".more-reviews_block");
    const buttonWhiteS = moreReviewsBlock?.querySelector(".button.is-white");
    const reviewsComponent = document.querySelector(".reviews-component");

    if (buttonWhiteS && reviewsComponent) {
      const isSmallScreen = window.innerWidth <= 478;
      const initialMaxHeight = isSmallScreen ? "2000px" : "1460px";

      reviewsComponent.style.maxHeight = initialMaxHeight;
      reviewsComponent.style.overflow = "hidden";
      reviewsComponent.style.transition = "max-height 0.5s ease";

      /*buttonWhiteS.addEventListener("click", function () {
        moreReviewsBlock.style.transition = "opacity 0.5s";
        moreReviewsBlock.style.opacity = "0";

        setTimeout(() => {
          moreReviewsBlock.style.display = "none";
          const fullHeight = reviewsComponent.scrollHeight;
          reviewsComponent.style.maxHeight = `${fullHeight}px`;
          setTimeout(() => {
            reviewsComponent.style.transition = "max-height 0.5s ease"; 
            reviewsComponent.style.maxHeight = "9999px"; 
          }, 50); 
        }, 0); 
      });*/
    }
  });

/* ==== inline script block 12 ==== */
(function () {

    const previewVideos = document.querySelectorAll(
      '.w-background-video video'
    );

    if (!previewVideos.length) return;

    const activateVideo = (video) => {
      if (video.dataset.activated) return;

      const source = video.querySelector('source[data-src]');
      if (!source || !source.dataset.src) return;

      // Attach src ONLY now
      source.src = source.dataset.src;
      video.load();

      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const p = video.play();
      if (p && p.catch) p.catch(() => {});

      video.dataset.activated = 'true';
    };

    /* -------- IntersectionObserver (modern browsers) -------- */
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              activateVideo(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '200px', // preload just before visible
          threshold: 0.01
        }
      );

      previewVideos.forEach(video => observer.observe(video));
    }

    /* -------- Safari fallback (very old versions) -------- */
    else {
      previewVideos.forEach(video => {
        activateVideo(video);
      });
    }

  })();

/* ==== inline script block 13 ==== */
let designSwiper = null;
  let marketingSwiper = null;
  let devSwiper = null;
  let nocodeSwiper = null;
  let achievementsSwiper = null;

  function initOrDestroySwiper() {
    const isSmallDesktop = window.innerWidth < 1280;
    const isTablet = window.innerWidth < 991;

    // Design Services
    if (isSmallDesktop && !designSwiper) {
      designSwiper = new Swiper('#design-services', {
        slidesPerView: 1.1,
        spaceBetween: 12,
        breakpoints: {
          640: { slidesPerView: 2.2 },
          991: { slidesPerView: 3.2 },
        },
      });
    } else if (!isSmallDesktop && designSwiper) {
      designSwiper.destroy(true, true);
      designSwiper = null;
    }

    // Marketing Services
    if (isSmallDesktop && !marketingSwiper) {
      marketingSwiper = new Swiper('#marketing-services', {
        slidesPerView: 1.1,
        spaceBetween: 12,
        breakpoints: {
          640: { slidesPerView: 2.2 },
          991: { slidesPerView: 3.2 },
        },
      });
    } else if (!isTablet && marketingSwiper) {
      marketingSwiper.destroy(true, true);
      marketingSwiper = null;
    }

    // Dev Services
    if (isSmallDesktop && !devSwiper) {
      devSwiper = new Swiper('#dev-services', {
        slidesPerView: 1.1,
        spaceBetween: 12,
        breakpoints: {
          640: { slidesPerView: 2.2 },
          991: { slidesPerView: 3.2 },
        },
      });
    } else if (!isTablet && devSwiper) {
      devSwiper.destroy(true, true);
      devSwiper = null;
    }

    // No-code Services
    if (isSmallDesktop && !nocodeSwiper) {
      nocodeSwiper = new Swiper('#nocode-service', {
        slidesPerView: 1.1,
        spaceBetween: 12,
        breakpoints: {
          640: { slidesPerView: 2.2 },
          991: { slidesPerView: 3.2 },
        },
      });
    } else if (!isTablet && nocodeSwiper) {
      nocodeSwiper.destroy(true, true);
      nocodeSwiper = null;
    }
    if (isTablet && !achievementsSwiper) {
      achievementsSwiper = new Swiper('.achievements-swiper', {
        slidesPerView: 1.5,
        spaceBetween: 12,
        loop: true,
        initialSlide: 1,
        centeredSlides: true,
        breakpoints: {
          480: { slidesPerView: 'auto' },
          320: { slidesPerView: 1.082 }
        },
      });
    } else if (!isTablet && achievementsSwiper) {
      achievementsSwiper.destroy(true, true);
      achievementsSwiper = null;
    }
  }


  window.addEventListener("load", (event) => {
    /* NO CODE SWIPER WILL BE USED LATER! DO NOT DELETE
    const serviceSwiper = new Swiper('.service_image-wrapper.no-code-image', {
      slidesPerView: 1,
      watchSlidesProgress: true,
      slidesPerView: 1,
      loop: true,
      autoplay: {
        delay: 5000,
      },
      pagination: {
        el: '.story__pagination',
        renderBullet: function (index, className) {
          return '<div class="story-bullet"> <div class="swiper-pagination-progress"></div> </div>';
        }
      },
      on: {
        autoplayTimeLeft(swiper, time, progress) {
          let currentSlide = document.querySelectorAll('.service_image-wrapper.no-code-image .swiper-slide')[swiper.activeIndex];
          let currentBullet = document.querySelectorAll('.service_image-wrapper.no-code-image .swiper-pagination-progress')[swiper.realIndex];
          let fullTime = currentSlide.dataset.swiperAutoplay ? parseInt(currentSlide.dataset.swiperAutoplay) : swiper.params.autoplay.delay;

          let percentage = Math.min(Math.max(parseFloat(((fullTime - time) * 100 / fullTime).toFixed(1)), 0), 100) + '%';
          gsap.set(currentBullet, {width: percentage});
        },
        transitionEnd(swiper) {
          let allBullets = $('.service_image-wrapper.no-code-image .swiper-pagination-progress');
          let bulletsBefore = allBullets.slice(0, swiper.realIndex);
          let bulletsAfter = allBullets.slice(swiper.realIndex, allBullets.length);
          if (bulletsBefore.length) {
            gsap.set(bulletsBefore, {width: '100%'})
          }
          if (bulletsAfter.length) {
            gsap.set(bulletsAfter, {width: '0%'})
          }

          let activeSlide = document.querySelectorAll('.service_image-wrapper.no-code-image .swiper-slide')[swiper.realIndex];
        },
      }
    });*/
    // Step 1: Create Swiper instance first (without event handlers)
    if (document.querySelector('.service_image-wrapper.no-code-image')) {
    const serviceSwiper = new Swiper('.service_image-wrapper.no-code-image', {
      slidesPerView: 1,
      loop: true,
      speed: 1,
      autoplay: {
        delay: 2000,
      },
      pagination: {
        el: '.story__pagination',
        renderBullet: function (index, className) {
          return '<div class="story-bullet"> <div class="swiper-pagination-progress"></div> </div>';
        }
      },
    });

    // Step 2: Add event handlers AFTER initialization
    serviceSwiper.on('slideChange', function () {
      document.querySelectorAll('.slide-img, .service-image').forEach(img => {
        img.classList.remove('zoom-in', 'left-to-right', 'top-to-bottom');
      });

      const activeSlide = serviceSwiper.slides[serviceSwiper.activeIndex];
      const img = activeSlide.querySelector('.service-image');
      const animationType = img?.dataset?.animation;

      if (animationType) {
        img.classList.add(animationType);
      }
    });

    serviceSwiper.on('autoplayTimeLeft', function (swiper, time, progress) {
      const currentSlide = document.querySelectorAll('.service_image-wrapper.no-code-image .swiper-slide')[swiper.activeIndex];
      const currentBullet = document.querySelectorAll('.service_image-wrapper.no-code-image .swiper-pagination-progress')[swiper.realIndex];
      const fullTime = currentSlide.dataset.swiperAutoplay ? parseInt(currentSlide.dataset.swiperAutoplay) : swiper.params.autoplay.delay;

      const percentage = Math.min(Math.max(parseFloat(((fullTime - time) * 100 / fullTime).toFixed(1)), 0), 100) + '%';
      gsap.set(currentBullet, { width: percentage });
    });

    serviceSwiper.on('transitionEnd', function (swiper) {
      const allBullets = document.querySelectorAll('.service_image-wrapper.no-code-image .swiper-pagination-progress');
      const bulletsBefore = Array.from(allBullets).slice(0, swiper.realIndex);
      const bulletsAfter = Array.from(allBullets).slice(swiper.realIndex);

      bulletsBefore.forEach(b => gsap.set(b, { width: '100%' }));
      bulletsAfter.forEach(b => gsap.set(b, { width: '0%' }));

      const activeSlide = document.querySelectorAll('.service_image-wrapper.no-code-image .swiper-slide')[swiper.realIndex];
    });

    // Trigger animation for first slide
    setTimeout(() => {
      const activeSlide = serviceSwiper.slides[serviceSwiper.activeIndex];
      const img = activeSlide.querySelector('.service-image');
      const animationType = img?.dataset?.animation;
      if (animationType) {
        img.classList.add(animationType);
      }
    }, 50);
    }

    if (document.querySelector('.achievements-component')) {
    const swiper = new Swiper('.achievements-component', {
      slidesPerView: 1.082,
      spaceBetween: 12,
      initialSlide: 1,
      //speed: 10000, // smooth transition speed
      loop: true,
      freeMode: false,
      navigation: {
        nextEl: '[next-achievement]',
        prevEl: '[prev-achievement]',
      },
      /*autoplay: {
      	delay: 4000,
        //delay: 0,         // no delay between transitions
        //disableOnInteraction: false
      },*/
      breakpoints: {
        768: {
          slidesPerView: 1.1,
        },
        1024: {
          slidesPerView: 3.001,
        }
      }
    });

    }

    if (document.querySelector('.talents-swiper')) {
    const talentsSwiper = new Swiper('.talents-swiper', {
      slidesPerView: 1.1,
      spaceBetween: 12,
      mousewheel: {
        releaseOnEdges: true, 
        forceToAxis: true
      },
      navigation: {
        nextEl: '[next-talent]',
        prevEl: '[prev-talent]',
      },
      breakpoints: {
        479: {
          slidesPerView: 1.8,
        },
        991: {
          slidesPerView: 3.1,
        },
        1280:{
          slidesPerView: 4,
        }
      }
    });

    }

    const casesSwiper = new Swiper('.cases_swiper', {
      slidesPerView: 1.082,
      spaceBetween: 12,
      centeredSlides: true,
      loop: true,
      initialSlide: 1,
      /*pagination: {
        el: '.cases-pagination',
        type: 'bullets',
        clickable: true
      },*/
      navigation: {
        nextEl: '[next-case]',
        prevEl: '[prev-case]',
      },
      breakpoints: {
        768: {
          slidesPerView: 1.1,
        },
        1280: {
          slidesPerView: 1.66,
        }
      }
    });
    initOrDestroySwiper();

    /* COMMENTED TILL RETURNING OF NO-CODE SERVICES SLIDER
    $('[data-w-tab]').on('click', function () {
        // Delay is necessary to allow the content to become visible
        setTimeout(() => {
            serviceSwiper.update();     // Recalculate dimensions
            serviceSwiper.slideToLoop(serviceSwiper.realIndex, 0); // Optional: reset position
            serviceSwiper.autoplay.start(); // Restart autoplay
        }, 100); // 100ms delay is usually enough
    });
    */
  });


  window.addEventListener('resize', () => {
    initOrDestroySwiper();
  });

  document.addEventListener("DOMContentLoaded", () => {

    const whyStepsTrigger = document.querySelector('.how-choose-pro-button');
    whyStepsTrigger.addEventListener('click', function(){
      document.querySelector('.why-steps-animated-wrapper').style.display = 'flex';
    });

    const counters = document.querySelectorAll('[counter="true"]');
    const getDecimalPlaces = (numberStr) => {
      const match = numberStr.match(/\.(\d+)/);
      return match ? match[1].length : 0;
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const endStr = el.textContent.trim();
          const startStr = el.getAttribute('start-number') || '0';

          const start = parseFloat(startStr);
          const end = parseFloat(endStr);

          const decimals = Math.max(getDecimalPlaces(endStr), getDecimalPlaces(startStr));
          const duration = parseFloat(el.getAttribute('duration')) || 2; // seconds
          const delay = parseInt(el.getAttribute('delay')) || 0; // ms

          let startTime = null;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const current = start + (end - start) * progress;
            el.textContent = current.toFixed(decimals);
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = end.toFixed(decimals);
            }
          };

          setTimeout(() => {
            requestAnimationFrame(animate);
          }, delay);

          observer.unobserve(el); // run only once per element
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(el => counterObserver.observe(el));
  });

  let initialWidth = window.innerWidth;

  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;

    const crossed768 = (initialWidth < 768 && currentWidth >= 768) || (initialWidth >= 768 && currentWidth < 768);
    const crossed1440 = (initialWidth < 1440 && currentWidth >= 1440) || (initialWidth >= 1440 && currentWidth < 1440);

    if (crossed768 || crossed1440) {
      location.reload();
    }
  });
  window.addEventListener("load", (event) => {
    const wfCardsSwiper = new Swiper('.webflow-cards', {
      slidesPerView: 'auto',
      loop: true,
      spaceBetween: 12,
      initialSlide: 1,
      navigation: {
        nextEl: '[next-wf-card]',
        prevEl: '[prev-wf-card]',
      },
    });
  });

/* ==== inline script block 14 ==== */
(function(){
  var KEY='site-lang';
  var lang=localStorage.getItem(KEY)||'EN';
  function apply(l){
    document.documentElement.setAttribute('lang', l==='UA'?'uk':'en');
    document.querySelectorAll('.lang-switch .lang-label').forEach(function(el){el.textContent=l;});
  }
  apply(lang);
  document.querySelectorAll('.lang-switch').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.preventDefault();
      lang = (lang==='EN') ? 'UA' : 'EN';
      localStorage.setItem(KEY,lang);
      apply(lang);
    });
  });
})();

/* ==== inline script block 15 ==== */
/* Route all site form submissions to inbox@kllo.com.ua via the visitor's mail client. */
(function () {
  var INBOX = "inbox@kllo.com.ua";
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || form.tagName !== "FORM") return;
    e.preventDefault();

    var data = new FormData(form);
    var lines = [];
    var email = "";
    data.forEach(function (val, key) {
      if (!String(val).trim()) return;
      if (/mail/i.test(key) && !email) email = String(val).trim();
      lines.push(key + ": " + val);
    });

    var formName = form.getAttribute("data-name") || form.id || "Заявка з сайту";
    var subject = "Нова заявка з сайту Kllo — " + formName;
    var body = "Нова заявка з сайту kllo.com.ua\n\n" + lines.join("\n");
    if (email) body += "\n\nКонтактний email: " + email;

    window.location.href =
      "mailto:" + INBOX +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    // Show Webflow success state if present.
    var wrap = form.closest(".w-form") || form.parentElement;
    if (wrap) {
      var done = wrap.querySelector(".w-form-done");
      if (done) { form.style.display = "none"; done.style.display = "block"; }
    }
    try { form.reset(); } catch (err) {}
  }, true);
})();
