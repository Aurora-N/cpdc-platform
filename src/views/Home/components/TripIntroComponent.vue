<template>
  <div class="intro-background relative flex flex-col items-center py-10">
    <img src="/introbg.png" class="w-full max-w-[1280px] px-10 md:px-30 lg:px-40" />
    <div
      class="bg-primary-200 hover:bg-primary-300 absolute bottom-1/3 cursor-pointer rounded-sm px-2 text-xl font-bold text-white"
    >
      点击开启回忆之旅
    </div>
  </div>
</template>

<style scoped>
.intro-background {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
    url('/cpdc-platform/herobg.png');

  background-size: cover;
  background-position: center;
  overflow: hidden;
}
</style>
