<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
    <g
      fill="none"
      stroke="currentColor"
      stroke-dasharray="16"
      stroke-dashoffset="16"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path d="M5 5h14">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"></animate>
      </path>
      <path d="M5 12h14">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.2s"
          dur="0.2s"
          values="16;0"
        ></animate>
      </path>
      <path d="M5 19h14">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.4s"
          dur="0.2s"
          values="16;0"
        ></animate>
      </path>
    </g>
  </svg>
</template>

<script lang="ts">
export default {
  name: 'NavMenu',
}
</script>
