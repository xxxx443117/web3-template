<template>
  <footer class="bg-[#F9FAFB] dark:bg-black pb-8">
    <div class="max-w-7xl mx-auto px-5 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 pt-8">
        <!-- Wallet -->
        <div class="border-b border-[#E5E7EB] dark:border-white/10 md:border-none">
          <button
            class="w-full flex items-center justify-between py-4 text-sm font-bold text-[#1B1B1B] dark:text-white md:cursor-default"
            @click="toggleSection('wallet')"
          >
            <span>{{ t("连接钱包") }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="md:hidden text-[#999] transition-transform duration-200 w-4 h-4"
              :class="{ 'rotate-180': openSections.wallet }"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div
            class="overflow-hidden transition-all duration-200 md:max-h-none"
            :class="openSections.wallet ? 'max-h-40 pb-4' : 'max-h-0 md:max-h-none'"
          >
            <ul class="space-y-2.5">
              <li>
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener"
                  class="text-sm text-[#1B1B1B] dark:text-white/70 hover:text-[#D5651B] dark:hover:text-[#D5651B]"
                >
                  Metamask
                </a>
              </li>
              <li>
                <a
                  href="https://www.tokenpocket.pro/"
                  target="_blank"
                  rel="noopener"
                  class="text-sm text-[#1B1B1B] dark:text-white/70 hover:text-[#D5651B] dark:hover:text-[#D5651B]"
                >
                  TokenPocket
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Links - customize for your project -->
        <div class="border-b border-[#E5E7EB] dark:border-white/10 md:border-none">
          <button
            class="w-full flex items-center justify-between py-4 text-sm font-bold text-[#1B1B1B] dark:text-white md:cursor-default"
            @click="toggleSection('links')"
          >
            <span>Links</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="md:hidden text-[#999] transition-transform duration-200 w-4 h-4"
              :class="{ 'rotate-180': openSections.links }"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div
            class="overflow-hidden transition-all duration-200 md:max-h-none"
            :class="openSections.links ? 'max-h-40 pb-4' : 'max-h-0 md:max-h-none'"
          >
            <ul class="space-y-2.5">
              <!-- Add your links here -->
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-white/10 text-center">
        <div class="text-xs text-[#98A2B3] dark:text-white/40">
          &copy; {{ new Date().getFullYear() }} Your Project. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const openSections = reactive<Record<string, boolean>>({
  wallet: false,
  links: false,
});

const toggleSection = (section: string) => {
  openSections[section] = !openSections[section];
};
</script>
