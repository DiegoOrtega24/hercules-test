import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";
import Page from "@/components/Page";
import Hero from "@/components/Hero";
import Feature from "@/components/Feature";
import Gallery from "@/components/Gallery";
import TextBlock from "@/components/TextBlock";
import Cards from "@/components/Cards";
import Card from "@/components/Card";
import Details from "@/components/Details";
import DetailRow from "@/components/DetailRow";
import Cta from "@/components/Cta";
import Newsletter from "@/components/Newsletter";
import BeerList from "@/components/BeerList";
import Cerveza from "@/components/Cerveza";
import Carousel from "@/components/Carousel";
import Slide from "@/components/Slide";
import SectionsGrid from "@/components/SectionsGrid";
import SectionTile from "@/components/SectionTile";
import VenueMosaic from "@/components/VenueMosaic";
import MosaicTile from "@/components/MosaicTile";

const token = process.env.STORYBLOK_PREVIEW_TOKEN;

// Sin token el sitio funciona en "modo demo" con el contenido de
// storyblok/paginas. Con token, el contenido viene de Storyblok.
export const storyblokConectado = Boolean(token);

// Cada nombre de la izquierda es el "technical name" del bloque en Storyblok.
export const getStoryblokApi = storyblokInit({
  accessToken: token,
  use: token ? [apiPlugin] : [],
  apiOptions: {
    region: process.env.STORYBLOK_REGION || "eu",
    cache: { type: "none" },
  },
  components: {
    page: Page,
    hero: Hero,
    feature: Feature,
    gallery: Gallery,
    text_block: TextBlock,
    cards: Cards,
    card: Card,
    details: Details,
    detail_row: DetailRow,
    cta: Cta,
    newsletter: Newsletter,
    beer_list: BeerList,
    cerveza: Cerveza,
    carousel: Carousel,
    slide: Slide,
    sections_grid: SectionsGrid,
    section_tile: SectionTile,
    venue_mosaic: VenueMosaic,
    mosaic_tile: MosaicTile,
  },
  enableFallbackComponent: true,
});
