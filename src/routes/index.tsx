import { createFileRoute } from "@tanstack/react-router";
import { SinkyApp } from "../sinky/SinkyApp";

export const Route = createFileRoute("/")({
  component: SinkyApp,
});
