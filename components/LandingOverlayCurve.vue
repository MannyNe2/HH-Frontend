<template>
  <svg
    :width="width"
    :height="height ? height : '321'"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 2.00005C282 -23.0001 800.5 244.5 1064 255.5C1064 255.5 1139 254 1204 198.5C1269 143 1440 27.9999 1440 27.9999V321H0V2.00005Z"
      :fill="fill"
    />
  </svg>
</template>
<script>
export default {
  props: {
    width: String,
    height: String,
    fill: String,
  },
};
</script>

