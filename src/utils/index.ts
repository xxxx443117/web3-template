import copy from "copy-to-clipboard";
import { toast } from "vue3-toastify";

export const copyHandle = (text: string) => {
  const res = copy(text);
  if (res) {
    toast.success("Copy Successfully!");
  } else {
    toast.error("Copy Failed!");
  }
};
