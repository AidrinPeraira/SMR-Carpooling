/**
 *
 * We need a reusable function logic to merge the props passed by the project code
 * This package comoponent may use some default calssNamees and other props that might need to be overriden. This is done using this "cn" function.
 *
 * Tailwind Merge. This is a package that handles merging tailwind class names. it removes duplicates and handles colliosons
 * clsx: This package handles taking coditionals as objects in tailwind classes. (but thid doesn't remove duplicates.)
 *
 * Refer: https://www.reddit.com/r/tailwindcss/comments/1egbuvx/the_buzz_around_cn_function_and_why_do_we_use_it/
 */

import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
