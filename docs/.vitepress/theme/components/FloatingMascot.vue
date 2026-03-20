<template>
  <div
    class="mascot-root"
    :class="{ peeking: isPeeking }"
    @mouseenter="onHover"
    @mouseleave="onLeave"
    @click="onHover"
    title="Oi! 👋"
  >
    <svg
      class="mascot-svg"
      viewBox="0 0 80 120"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <!-- Left hand gripping the edge -->
      <g class="hand-left">
        <rect x="1" y="58" width="14" height="9" rx="4.5" fill="#f9c74f" stroke="#e6a800" stroke-width="1.2"/>
        <!-- fingers -->
        <rect x="2"  y="53" width="4" height="8" rx="2" fill="#f9c74f" stroke="#e6a800" stroke-width="1"/>
        <rect x="7"  y="51" width="4" height="9" rx="2" fill="#f9c74f" stroke="#e6a800" stroke-width="1"/>
        <rect x="12" y="53" width="3.5" height="7" rx="1.75" fill="#f9c74f" stroke="#e6a800" stroke-width="1"/>
      </g>

      <!-- Body (hoodie) — mostly hidden off right edge -->
      <rect x="12" y="62" width="68" height="58" rx="18" fill="#0284c7"/>
      <!-- Hoodie pocket -->
      <rect x="28" y="95" width="20" height="14" rx="6" fill="#0369a1"/>

      <!-- Neck -->
      <rect x="30" y="55" width="20" height="14" rx="7" fill="#f9c74f"/>

      <!-- Head -->
      <circle cx="40" cy="38" r="28" fill="#f9c74f" stroke="#e6a800" stroke-width="1.5"/>

      <!-- Ear left -->
      <ellipse cx="13" cy="40" rx="5" ry="7" fill="#f9c74f" stroke="#e6a800" stroke-width="1.2"/>
      <!-- Ear right -->
      <ellipse cx="67" cy="40" rx="5" ry="7" fill="#f9c74f" stroke="#e6a800" stroke-width="1.2"/>

      <!-- Hair -->
      <path d="M14 30 Q16 10 40 10 Q64 10 66 30" fill="#1a1a2e" stroke="#1a1a2e" stroke-width="1"/>
      <!-- Hair spikes -->
      <path d="M20 18 Q22 8 26 12" fill="#1a1a2e"/>
      <path d="M30 12 Q32 4 36 10" fill="#1a1a2e"/>
      <path d="M44 10 Q46 3 50 9" fill="#1a1a2e"/>
      <path d="M54 13 Q58 7 60 16" fill="#1a1a2e"/>

      <!-- Eyes group (animated) -->
      <g class="eyes">
        <!-- Left eye white -->
        <ellipse cx="30" cy="40" rx="7" ry="8" fill="white"/>
        <!-- Right eye white -->
        <ellipse cx="50" cy="40" rx="7" ry="8" fill="white"/>
        <!-- Left pupil (moves) -->
        <circle class="pupil-l" cx="30" cy="41" r="3.5" fill="#1a1a2e"/>
        <circle cx="31.2" cy="39.5" r="1.2" fill="white"/>
        <!-- Right pupil (moves) -->
        <circle class="pupil-r" cx="50" cy="41" r="3.5" fill="#1a1a2e"/>
        <circle cx="51.2" cy="39.5" r="1.2" fill="white"/>
      </g>

      <!-- Eyebrows -->
      <path class="brow-l" d="M23 32 Q30 29 37 32" stroke="#1a1a2e" stroke-width="2.2" stroke-linecap="round"/>
      <path class="brow-r" d="M43 32 Q50 29 57 32" stroke="#1a1a2e" stroke-width="2.2" stroke-linecap="round"/>

      <!-- Nose -->
      <ellipse cx="40" cy="47" rx="3" ry="2" fill="#e6a800" opacity="0.5"/>

      <!-- Mouth (smile) -->
      <path class="mouth" d="M32 54 Q40 60 48 54" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>

      <!-- Headphone / fone -->
      <path d="M13 38 Q13 14 40 14 Q67 14 67 38" stroke="#1a1a2e" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <rect x="9" y="37" width="8" height="12" rx="3" fill="#0284c7"/>
      <rect x="63" y="37" width="8" height="12" rx="3" fill="#0284c7"/>

      <!-- Right hand gripping the edge -->
      <g class="hand-right">
        <rect x="1" y="78" width="14" height="9" rx="4.5" fill="#f9c74f" stroke="#e6a800" stroke-width="1.2"/>
        <rect x="2"  y="74" width="4" height="8" rx="2" fill="#f9c74f" stroke="#e6a800" stroke-width="1"/>
        <rect x="7"  y="72" width="4" height="9" rx="2" fill="#f9c74f" stroke="#e6a800" stroke-width="1"/>
        <rect x="12" y="74" width="3.5" height="7" rx="1.75" fill="#f9c74f" stroke="#e6a800" stroke-width="1"/>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isPeeking = ref(false)
let peekTimer = null
let hideTimer = null

function onHover() {
  clearTimeout(hideTimer)
  isPeeking.value = true
  hideTimer = setTimeout(() => { isPeeking.value = false }, 4000)
}

function onLeave() {
  hideTimer = setTimeout(() => { isPeeking.value = false }, 1800)
}

function scheduleAutopeek() {
  peekTimer = setTimeout(() => {
    isPeeking.value = true
    hideTimer = setTimeout(() => {
      isPeeking.value = false
      scheduleAutopeek()
    }, 4500)
  }, 8000 + Math.random() * 6000)
}

onMounted(() => {
  setTimeout(() => { isPeeking.value = true }, 2000)
  hideTimer = setTimeout(() => {
    isPeeking.value = false
    scheduleAutopeek()
  }, 5000)
})

onUnmounted(() => {
  clearTimeout(peekTimer)
  clearTimeout(hideTimer)
})
</script>

<style scoped>
.mascot-root {
  position: fixed;
  bottom: 80px;
  right: 0;
  width: 72px;
  height: 110px;
  cursor: pointer;
  z-index: 100;
  transform: translateX(54px);
  transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(-3px 4px 8px rgba(0,0,0,0.22));
  user-select: none;
}

.mascot-root.peeking {
  transform: translateX(8px);
}

.mascot-svg {
  width: 100%;
  height: 100%;
}

/* Eyes look left/right loop */
.pupil-l {
  animation: lookAround 5s ease-in-out infinite;
}
.pupil-r {
  animation: lookAround 5s ease-in-out infinite;
  animation-delay: 0.05s;
}

@keyframes lookAround {
  0%   { transform: translate(0px, 0px); }
  15%  { transform: translate(-2.5px, 0px); }
  30%  { transform: translate(-2.5px, 0px); }
  50%  { transform: translate(2.5px, 0px); }
  65%  { transform: translate(2.5px, 0px); }
  80%  { transform: translate(0px, 1px); }
  90%  { transform: translate(0px, 1px); }
  100% { transform: translate(0px, 0px); }
}

/* Blink */
.eyes {
  animation: blink 6s ease-in-out infinite;
  animation-delay: 1s;
}

@keyframes blink {
  0%, 90%, 100%  { transform: scaleY(1); }
  94%            { transform: scaleY(0.08); }
}

/* Subtle body bob */
.mascot-root.peeking .mascot-svg {
  animation: bob 2.5s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-4px); }
}

/* Hover: grows a tiny bit */
.mascot-root:hover {
  transform: translateX(6px) scale(1.06);
}
</style>
