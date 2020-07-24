<template>

<div class="max-w-lg m-auto rounded overflow-hidden shadow-lg bg-white">
  <div class="px-6 py-4">
    <h1 class="font-bold text-xl mb-2">
			<slot name="header"></slot>
		</h1>
    <p class="text-gray-700 text-base">
			<slot name="content"></slot>
    </p>

    <div class='mt-3'>
      <slot name="footer"></slot>
    </div>
  </div>
</div>

</template>
