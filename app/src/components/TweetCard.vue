<script setup>
import { toRefs, computed } from "vue";
import { useWorkspace } from "@/composables";
import { deleteTweet } from "@/api";

const emit = defineEmits(["delete"]);
const props = defineProps({
  tweet: Object,
});

const { tweet } = toRefs(props);
const { wallet } = useWorkspace();
const authorRoute = computed(() => {
  if (
    wallet.value &&
    wallet.value.publicKey.toBase58() === tweet.value.author.toBase58()
  ) {
    return { name: "Profile" };
  } else {
    return { name: "Users", params: { author: tweet.value.author.toBase58() } };
  }
});

const isMyTweet = computed(() => {
  if (
    wallet.value &&
    wallet.value.publicKey.toBase58() === tweet.value.author.toBase58()
  ) {
    return true;
  } else {
    return false;
  }
});

const onDelete = async () => {
  await deleteTweet(tweet.value);
  emit("delete", tweet.value);
};
</script>

<template>
  <div class="relative px-8 py-4">
    <div>
      <h3 class="inline font-semibold" :title="tweet.author">
        <router-link :to="authorRoute" class="hover:underline">
          {{ tweet.author_display }}
        </router-link>
      </h3>
      <span class="text-gray-500"> • </span>
      <time class="text-gray-500 text-sm" :title="tweet.created_at">
        <router-link
          :to="{ name: 'Tweet', params: { tweet: tweet.publicKey.toBase58() } }"
          class="hover:underline"
        >
          {{ tweet.created_ago }}
        </router-link>
      </time>
    </div>
    <p class="whitespace-pre-wrap" v-text="tweet.content"></p>
    <router-link
      v-if="tweet.topic"
      :to="{ name: 'Topics', params: { topic: tweet.topic } }"
      class="inline-block mt-2 text-pink-500 hover:underline"
    >
      #{{ tweet.topic }}
    </router-link>
    <button
      v-if="isMyTweet"
      @click="onDelete"
      class="
        flex
        px-2
        py-2
        rounded-full
        text-gray-500
        hover:text-pink-500 hover:bg-gray-100
      "
      title="Delete tweet"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 m-auto"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>
