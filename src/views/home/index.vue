<template>
  <div class="min-h-screen dark:bg-black bg-white pt-16">
    <div class="text-xl font-bold text-center px-4 relative z-[1] pt-6">
      Web3 DApp Template
    </div>
    <div class="flex justify-center mt-4 relative z-[1]">
      <div
        class="text-base flex items-center shadow rounded-full px-4 py-1.5 dark:border dark:border-[#FF89044D] dark:bg-[#FF89041A]"
      >
        <div class="dark:text-[#FF8904]">{{ t("Welcome") }}</div>
      </div>
    </div>

    <div class="px-6 mt-10 text-center">
      <p class="text-sm text-[#666] dark:text-white/60 leading-relaxed">
        {{ t("TemplateDescription") }}
      </p>
    </div>

    <div class="px-8 mt-6">
      <ConnectWalletBtn />
    </div>

    <div class="px-6 mt-10">
      <div class="text-2xl font-bold text-center mb-6">{{ t("TechStack") }}</div>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="item in techStack"
          :key="item.name"
          class="flex items-center gap-3 bg-white dark:bg-[#1A1E2E] rounded-2xl p-4 shadow-sm"
        >
          <div class="text-2xl">{{ item.icon }}</div>
          <span class="text-sm font-medium">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <div class="px-6 mt-10">
      <div class="text-2xl font-bold text-center mb-6">{{ t("Features") }}</div>
      <div class="space-y-3">
        <div
          v-for="feature in features"
          :key="feature"
          class="flex items-center gap-3 bg-white dark:bg-[#1A1E2E] rounded-2xl p-4 shadow-sm"
        >
          <div class="w-8 h-8 rounded-full bg-[#00a63e33] flex items-center justify-center shrink-0">
            <svg-icon name="check" class="w-4 h-4" />
          </div>
          <span class="text-sm">{{ feature }}</span>
        </div>
      </div>
    </div>

    <div class="px-6 mt-10">
      <div class="text-2xl font-bold text-center mb-6">{{ t("QuickStart") }}</div>
      <div class="bg-[#101828] text-white rounded-2xl p-5 text-sm font-mono leading-7 overflow-x-auto">
        <div class="text-[#6A7282]"># Install dependencies</div>
        <div>npm install</div>
        <div class="mt-3 text-[#6A7282]"># Start dev server</div>
        <div>npm run dev</div>
        <div class="mt-3 text-[#6A7282]"># Build for production</div>
        <div>npm run build</div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import ConnectWalletBtn from "@/components/ConnectWalletBtn.vue";
import Footer from "@/components/Footer.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const techStack = [
  { name: "Vue 3", icon: "V" },
  { name: "TypeScript", icon: "TS" },
  { name: "Vite", icon: "V" },
  { name: "Wagmi + Viem", icon: "W" },
  { name: "Pinia", icon: "P" },
  { name: "Tailwind CSS", icon: "TW" },
  { name: "Vant UI", icon: "V" },
  { name: "Vue Query", icon: "VQ" },
];

const features = [
  t("FeatureMultiChain"),
  t("FeatureWalletConnect"),
  t("FeatureAutoApi"),
  t("FeatureI18n"),
  t("FeatureDarkMode"),
  t("FeatureDocker"),
];
</script>
