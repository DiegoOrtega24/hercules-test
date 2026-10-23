import { storyblokEditable } from "@storyblok/react/rsc";

export default function DetailRow({ blok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="grid gap-1 border-t border-carbon/15 py-5 last:border-b sm:grid-cols-[11rem_1fr] sm:gap-6"
    >
      <dt className="text-carbon/60">{blok.label}</dt>
      <dd className="whitespace-pre-line">{blok.value}</dd>
    </div>
  );
}
