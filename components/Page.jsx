import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";
import HerculesScroll from "./HerculesScroll";

// Tipo de contenido "page": una pila de bloques
export default function Page({ blok }) {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.hercules_scroll && <HerculesScroll />}
      {blok.body?.map((b) => (
        <StoryblokServerComponent blok={b} key={b._uid} />
      ))}
    </div>
  );
}
