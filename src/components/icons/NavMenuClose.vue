<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path d="M5 12H19">
        <animate fill="freeze" attributeName="d" dur="0.4s" values="M5 12H19;M12 12H12"></animate>
        <set fill="freeze" attributeName="opacity" begin="0.4s" to="0"></set>
      </path>
      <path d="M5 5L19 5M5 19L19 19" opacity="0">
        <animate
          fill="freeze"
          attributeName="d"
          begin="0.2s"
          dur="0.4s"
          values="M5 5L19 5M5 19L19 19;M5 5L19 19M5 19L19 5"
        ></animate>
        <set fill="freeze" attributeName="opacity" begin="0.2s" to="1"></set>
      </path>
    </g>
  </svg>
</template>

<script lang="ts">
export default {
  name: 'NavMenuClose',
}
</script>
