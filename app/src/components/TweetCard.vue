<script setup>
import { toRefs, computed } from "vue";
import { useWorkspace } from "@/composables";
import { deleteTweet } from "@/api";
import { donateToAuthor } from "@/api";

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

const toggleDonationPopup = async () => {
  let amount = prompt("Enter the amount of the donation", "").replace(",", ".");
  if (amount == null || amount == "") {
    return null;
  } else {
    const transacSignature = await donateToAuthor(
      tweet.value.author,
      parseInt(amount * 1000000000)
    );
    if (transacSignature) alert(transacSignature);
  }
};
</script>
<script>
export default {
  data() {
    return {
      message: "",
    };
  },
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
    <div class="md:flex">
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
          class="h-5 w-5 m-auto"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.083,8.25H5.917v7h1.167V8.25z M18.75,3h-5.834V1.25c0-0.323-0.262-0.583-0.582-0.583H7.667
								c-0.322,0-0.583,0.261-0.583,0.583V3H1.25C0.928,3,0.667,3.261,0.667,3.583c0,0.323,0.261,0.583,0.583,0.583h1.167v14
								c0,0.644,0.522,1.166,1.167,1.166h12.833c0.645,0,1.168-0.522,1.168-1.166v-14h1.166c0.322,0,0.584-0.261,0.584-0.583
								C19.334,3.261,19.072,3,18.75,3z M8.25,1.833h3.5V3h-3.5V1.833z M16.416,17.584c0,0.322-0.262,0.583-0.582,0.583H4.167
								c-0.322,0-0.583-0.261-0.583-0.583V4.167h12.833V17.584z M14.084,8.25h-1.168v7h1.168V8.25z M10.583,7.083H9.417v8.167h1.167V7.083
								z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button
        v-if="wallet && !isMyTweet"
        @click="toggleDonationPopup"
        class="
          flex
          px-2
          py-2
          rounded-full
          text-gray-500
          hover:text-pink-500 hover:bg-gray-100
        "
        title="Donate"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 m-auto"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M15.123,9.991c-0.944,0-1.71,0.766-1.71,1.71c0,0.945,0.766,1.711,1.71,1.711c0.945,0,1.711-0.766,1.711-1.711C16.834,10.756,16.068,9.991,15.123,9.991z M15.703,12.281h-1.141v-1.141h1.141V12.281z M17.984,4.867h-2.288v-0.57h-0.024c0.011-0.086,0.025-0.17,0.025-0.26V2.852c0-1.092-0.838-1.977-1.871-1.977H2.745C1.8,0.875,1.027,1.618,0.9,2.58H0.875v15.404c0,0.629,0.511,1.141,1.141,1.141h15.969c0.629,0,1.14-0.512,1.14-1.141V6.008C19.124,5.377,18.613,4.867,17.984,4.867zM2.016,2.586c0-0.315,0.255-0.57,0.57-0.57h11.406c0.314,0,0.57,0.255,0.57,0.57v2.275H2.016V2.586z M17.984,17.414c0,0.314-0.257,0.57-0.57,0.57H2.586c-0.315,0-0.57-0.256-0.57-0.57V6.578c0-0.315,0.255-0.57,0.57-0.57h14.828c0.313,0,0.57,0.255,0.57,0.57V17.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
